#!/usr/bin/env python3
"""Audit every canonical URL in data/app-links.json and write a fresh JSON report.

Uses only the Python standard library. Redirects are followed and reported separately.
The registry is the source of truth; historical report-only apps are reported as drift.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from functools import partial
import json
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit, urlunsplit


USER_AGENT = "ASF-App-Registry-Audit/1.0 (+https://asf.surf/)"
TIMEOUT_SECONDS = 15


def normalize_url(url: str) -> str:
    parts = urlsplit(url)
    # URL fragments are client-side anchors and are not sent to the server.
    return urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, ""))


def probe(url: str, timeout: int = TIMEOUT_SECONDS) -> dict[str, Any]:
    requested = normalize_url(url)
    request = urllib.request.Request(
        requested,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,*/*;q=0.8"},
        method="GET",
    )
    started = time.monotonic()
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            status = response.status
            final_url = normalize_url(response.geturl())
            response.read(2048)
            return {
                "requested_url": requested,
                "final_url": final_url,
                "http_status": status,
                "result": "ok" if 200 <= status < 300 else "http_error",
                "redirected": final_url != requested,
                "elapsed_ms": round((time.monotonic() - started) * 1000),
            }
    except urllib.error.HTTPError as exc:
        return {
            "requested_url": requested,
            "final_url": normalize_url(exc.geturl()),
            "http_status": exc.code,
            "result": "http_error",
            "redirected": normalize_url(exc.geturl()) != requested,
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": str(exc.reason),
        }
    except (socket.gaierror, urllib.error.URLError) as exc:
        reason = getattr(exc, "reason", exc)
        if isinstance(reason, ssl.SSLError):
            category = "tls_error"
        elif isinstance(reason, (socket.timeout, TimeoutError)):
            category = "timeout"
        elif isinstance(reason, socket.gaierror):
            category = "dns_error"
        else:
            category = "connection_error"
        return {
            "requested_url": requested,
            "final_url": None,
            "http_status": None,
            "result": category,
            "redirected": False,
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": str(reason)[:300],
        }
    except (ssl.SSLError, socket.timeout, TimeoutError) as exc:
        category = "tls_error" if isinstance(exc, ssl.SSLError) else "timeout"
        return {
            "requested_url": requested,
            "final_url": None,
            "http_status": None,
            "result": category,
            "redirected": False,
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": str(exc)[:300],
        }
    except Exception as exc:  # Keep one failing URL from aborting the full inventory.
        return {
            "requested_url": requested,
            "final_url": None,
            "http_status": None,
            "result": "connection_error",
            "redirected": False,
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": str(exc)[:300],
        }


def load_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def build_report(registry: dict[str, Any], previous: dict[str, Any] | None = None, timeout: int = TIMEOUT_SECONDS) -> dict[str, Any]:
    apps = registry.get("apps")
    if not isinstance(apps, dict) or not apps:
        raise ValueError("Registry must contain a non-empty 'apps' object")

    # Probe each distinct URL once, then reuse the result for aliases.
    unique_urls = sorted({
        normalize_url(url)
        for app in apps.values()
        for url in (app.get("github_io"), app.get("asf_surf"))
        if isinstance(url, str) and url.startswith(("http://", "https://"))
    })
    with ThreadPoolExecutor(max_workers=12) as executor:
        results = executor.map(partial(probe, timeout=timeout), unique_urls)
        probes = dict(zip(unique_urls, results))

    details = []
    for app_id, config in sorted(apps.items()):
        detail: dict[str, Any] = {"app": app_id}
        for key in ("github_io", "asf_surf"):
            url = config.get(key)
            if isinstance(url, str) and url.startswith(("http://", "https://")):
                detail[key] = probes[normalize_url(url)]
            else:
                detail[key] = {
                    "requested_url": url,
                    "final_url": None,
                    "http_status": None,
                    "result": "not_configured",
                    "redirected": False,
                }
        if config.get("note"):
            detail["note"] = config["note"]
        details.append(detail)

    ids = set(apps)
    previous_ids = set()
    if previous:
        previous_ids = {
            item.get("app") for item in previous.get("details", [])
            if isinstance(item, dict) and isinstance(item.get("app"), str)
        }

    def ok(detail: dict[str, Any], key: str) -> bool:
        return detail[key].get("result") == "ok"

    gh_ok = [d["app"] for d in details if ok(d, "github_io")]
    surf_ok = [d["app"] for d in details if ok(d, "asf_surf")]
    both_ok = sorted(set(gh_ok) & set(surf_ok))
    gh_only = sorted(set(gh_ok) - set(surf_ok))
    surf_only = sorted(set(surf_ok) - set(gh_ok))
    both_failed = sorted(
        d["app"] for d in details
        if not ok(d, "github_io") and not ok(d, "asf_surf")
    )

    return {
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "source": "data/app-links.json",
        "registry_count": len(apps),
        "checked_unique_urls": len(unique_urls),
        "summary": {
            "github_io_ok": gh_ok,
            "asf_surf_ok": surf_ok,
            "both_ok": both_ok,
            "gh_only": gh_only,
            "surf_only": surf_only,
            "both_failed": both_failed,
            "both_404": sorted(
                d["app"] for d in details
                if d["github_io"].get("http_status") == 404
                and d["asf_surf"].get("http_status") == 404
            ),
        },
        "registry_consistency": {
            "previous_report_only": sorted(previous_ids - ids),
            "missing_from_previous_report": sorted(ids - previous_ids) if previous else [],
            "previous_report_compared": previous is not None,
        },
        "details": details,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", default="data/app-links.json")
    parser.add_argument("--previous", default="app-status.json")
    parser.add_argument("--output", default="app-status.json")
    parser.add_argument("--timeout", type=int, default=TIMEOUT_SECONDS)
    args = parser.parse_args()

    registry_path = Path(args.registry)
    previous_path = Path(args.previous)
    output_path = Path(args.output)
    registry = load_json(registry_path)
    previous = load_json(previous_path) if previous_path.exists() else None
    report = build_report(registry, previous, max(3, min(args.timeout, 60)))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    drift = report["registry_consistency"]
    print(f"Registry apps: {report['registry_count']}; unique URLs checked: {report['checked_unique_urls']}")
    print(f"GitHub Pages OK: {len(report['summary']['github_io_ok'])}; custom domains OK: {len(report['summary']['asf_surf_ok'])}")
    print(f"Historical report-only apps: {drift['previous_report_only']}")
    print(f"New registry apps absent from historical report: {drift['missing_from_previous_report']}")
    print(f"Report written to: {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
