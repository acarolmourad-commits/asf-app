#!/usr/bin/env python3
"""Validate a curated catalog and atomically publish its daily selection.

No network, AI generation, executable markup, or legacy content is consumed.
Python 3.11+ and the system IANA time-zone database are sufficient.
"""

from __future__ import annotations

import argparse
import copy
from datetime import date, datetime, timezone
import json
import os
from pathlib import Path
import re
import tempfile
import unicodedata
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data/surf-tips-catalog.json"
OUTPUT_DIR = ROOT / "docs/generated"
TIMEZONE = ZoneInfo("America/Sao_Paulo")
MAX_BYTES = 64 * 1024
CATEGORIES = frozenset({"Começar", "Segurança", "Equipamento", "Treino"})
ALLOWED_HREFS = frozenset({
    "/aprender/",
    "/previsao-surf/",
    "/diario/",
    "/guias/previsao-de-ondas/",
    "/guias/pos-surf-e-aprendizado/",
    "https://treino.asf.surf/#plano-30-dias",
})
TIP_FIELDS = frozenset({"id", "category", "title", "summary", "action", "label", "href"})
CATALOG_FIELDS = frozenset({"schema_version", "catalog_version", "tips"})
FEED_FIELDS = CATALOG_FIELDS | {"selection_date", "generated_at", "featured_id"}
TEXT_LIMITS = {"title": (6, 96), "summary": (20, 300), "action": (12, 260), "label": (3, 60)}
DATE_RE = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}\Z")
ID_RE = re.compile(r"[a-z][a-z0-9]*(?:-[a-z0-9]+)*\Z")
UTC_RE = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z\Z")
UNSAFE_TEXT = re.compile(
    r"[<>{}`]|&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);"
    r"|(?:javascript|vbscript|data)\s*:|\bon[a-z]+\s*="
    r"|\b(?:alert|eval|Function|setTimeout|setInterval)\s*\("
    r"|\b(?:document|window)\s*\.",
    re.IGNORECASE,
)


class ValidationError(ValueError):
    """Input is not compatible with the safe feed contract."""


def require_fields(value: object, expected: set | frozenset, location: str) -> None:
    if not isinstance(value, dict) or set(value) != expected:
        raise ValidationError(f"{location}: expected exactly {sorted(expected)}")


def parse_date(value: object, field: str = "date") -> date:
    if not isinstance(value, str) or not DATE_RE.fullmatch(value):
        raise ValidationError(f"{field}: expected YYYY-MM-DD")
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValidationError(f"{field}: invalid calendar date") from exc


def local_date(now: datetime | None = None) -> date:
    instant = now if now is not None else datetime.now(timezone.utc)
    if instant.tzinfo is None or instant.utcoffset() is None:
        raise ValidationError("now: a timezone-aware datetime is required")
    return instant.astimezone(TIMEZONE).date()


def validate_text(value: object, field: str, minimum: int, maximum: int) -> None:
    if not isinstance(value, str) or not minimum <= len(value) <= maximum:
        raise ValidationError(f"{field}: expected {minimum}–{maximum} text characters")
    if value != value.strip() or "  " in value:
        raise ValidationError(f"{field}: use trimmed, single-spaced text")
    if any(unicodedata.category(char).startswith("C") or (char.isspace() and char != " ") for char in value):
        raise ValidationError(f"{field}: control or invisible characters are not allowed")
    if UNSAFE_TEXT.search(value):
        raise ValidationError(f"{field}: only plain text is allowed, not HTML or script")


def check_size(value: object) -> None:
    try:
        encoded = json.dumps(value, ensure_ascii=False, allow_nan=False).encode("utf-8")
    except (TypeError, ValueError, UnicodeError) as exc:
        raise ValidationError("Input must be serializable UTF-8 JSON") from exc
    if len(encoded) > MAX_BYTES:
        raise ValidationError(f"Input exceeds the {MAX_BYTES}-byte limit")


def validate_catalog(catalog: object, root: Path = ROOT) -> None:
    require_fields(catalog, CATALOG_FIELDS, "catalog")
    check_size(catalog)
    if type(catalog["schema_version"]) is not int or catalog["schema_version"] != 1:
        raise ValidationError("schema_version: only integer 1 is supported")
    parse_date(catalog["catalog_version"], "catalog_version")
    tips = catalog["tips"]
    if not isinstance(tips, list) or not 8 <= len(tips) <= 12:
        raise ValidationError("tips: expected a catalog of 8–12 tips")
    ids = set()
    for position, tip in enumerate(tips):
        location = f"tips[{position}]"
        require_fields(tip, TIP_FIELDS, location)
        tip_id = tip["id"]
        if not isinstance(tip_id, str) or not 3 <= len(tip_id) <= 64 or not ID_RE.fullmatch(tip_id):
            raise ValidationError(f"{location}.id: expected a lowercase kebab-case identifier")
        if tip_id in ids:
            raise ValidationError(f"{location}.id: duplicate identifier {tip_id}")
        ids.add(tip_id)
        if not isinstance(tip["category"], str) or tip["category"] not in CATEGORIES:
            raise ValidationError(f"{location}.category: unsupported category")
        for field, (minimum, maximum) in TEXT_LIMITS.items():
            validate_text(tip[field], f"{location}.{field}", minimum, maximum)
        href = tip["href"]
        if not isinstance(href, str) or href not in ALLOWED_HREFS:
            raise ValidationError(f"{location}.href: URL is not on the exact allowlist")
        if href.startswith("/") and not (root / href.lstrip("/") / "index.html").is_file():
            raise ValidationError(f"{location}.href: local destination does not exist: {href}")
    if {tip["category"] for tip in tips} != CATEGORIES:
        raise ValidationError("tips: all four categories must be represented")


def featured_id(tips: list[dict], selection_date: date) -> str:
    """A fixed catalog cycles through sorted IDs once per local calendar day."""
    identifiers = sorted(tip["id"] for tip in tips)
    return identifiers[selection_date.toordinal() % len(identifiers)]


def validate_selection(catalog_version: str, selected: date, now: datetime) -> None:
    if type(selected) is not date:
        raise ValidationError("selection_date: expected a date, not a datetime or string")
    if selected < parse_date(catalog_version, "catalog_version"):
        raise ValidationError("selection_date: cannot precede the catalog edition")
    if selected > local_date(now):
        raise ValidationError("selection_date: future selections are not allowed")


def validate_feed(feed: object, expected_date: date | None = None, root: Path = ROOT, *, now: datetime | None = None) -> None:
    require_fields(feed, FEED_FIELDS, "feed")
    check_size(feed)
    validate_catalog({key: feed[key] for key in CATALOG_FIELDS}, root)
    selected = parse_date(feed["selection_date"], "selection_date")
    instant = now if now is not None else datetime.now(timezone.utc)
    validate_selection(feed["catalog_version"], selected, instant)
    timestamp = feed["generated_at"]
    if not isinstance(timestamp, str) or not UTC_RE.fullmatch(timestamp):
        raise ValidationError("generated_at: expected a UTC timestamp YYYY-MM-DDTHH:MM:SSZ")
    try:
        generated = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValidationError("generated_at: invalid UTC timestamp") from exc
    if generated > instant:
        raise ValidationError("generated_at: future generation time is not allowed")
    if local_date(generated) < selected:
        raise ValidationError("generated_at: cannot precede the selection date in Sao Paulo")
    if feed["featured_id"] != featured_id(feed["tips"], selected):
        raise ValidationError("featured_id: does not match the deterministic daily selection")
    if expected_date is not None and selected != expected_date:
        raise ValidationError(
            f"selection_date: stale or future selection {selected}; expected {expected_date}"
        )


def reject_duplicate_keys(pairs: list[tuple]) -> dict:
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValidationError(f"JSON contains a duplicate key: {key}")
        result[key] = value
    return result


def read_json(path: Path) -> object:
    with path.open("rb") as handle:
        raw = handle.read(MAX_BYTES + 1)
    if len(raw) > MAX_BYTES:
        raise ValidationError(f"{path}: file exceeds the {MAX_BYTES}-byte limit")
    try:
        return json.loads(raw.decode("utf-8"), object_pairs_hook=reject_duplicate_keys)
    except (UnicodeError, json.JSONDecodeError, RecursionError) as exc:
        raise ValidationError(f"{path}: invalid UTF-8 JSON") from exc


def build_feed(catalog: dict, selection_date: date | None = None, now: datetime | None = None) -> dict:
    validate_catalog(catalog)
    instant = now if now is not None else datetime.now(timezone.utc)
    today = local_date(instant)
    selected = selection_date if selection_date is not None else today
    validate_selection(catalog["catalog_version"], selected, instant)
    feed = copy.deepcopy(catalog)
    feed.update({
        "selection_date": selected.isoformat(),
        "generated_at": instant.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "featured_id": featured_id(feed["tips"], selected),
    })
    validate_feed(feed, selected, now=instant)
    return feed


def write_feed(feed: dict, output_dir: Path, *, now: datetime | None = None) -> Path:
    """Validate before touching disk, then replace in the same filesystem."""
    instant = now if now is not None else datetime.now(timezone.utc)
    validate_feed(feed, now=instant)
    output_dir.mkdir(parents=True, exist_ok=True)
    target = output_dir / "surf-tips.json"
    if target.exists():
        existing = read_json(target)
        validate_feed(existing, now=instant)
        # A same-day rerun with identical content preserves the original generation
        # time and bytes. Invalid existing files are errors, not silent fallbacks.
        if {k: v for k, v in existing.items() if k != "generated_at"} == {
            k: v for k, v in feed.items() if k != "generated_at"
        }:
            return target
    payload = json.dumps(feed, ensure_ascii=False, indent=2, allow_nan=False) + "\n"
    if len(payload.encode("utf-8")) > MAX_BYTES:
        raise ValidationError("Formatted output exceeds the feed size limit")
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output_dir, prefix=".surf-tips-", suffix=".tmp", delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
        temporary.chmod(0o644)
        os.replace(temporary, target)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()
    return target


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", type=parse_date, help="Selection date YYYY-MM-DD, from the catalog edition through today in America/Sao_Paulo")
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR, help="Destination directory (default: docs/generated)")
    parser.add_argument("--check", action="store_true", help="Validate existing output, its date and its equality to the curated catalog; write nothing")
    args = parser.parse_args(argv)
    try:
        catalog = read_json(CATALOG_PATH)
        validate_catalog(catalog)
        instant = datetime.now(timezone.utc)
        selected = args.date if args.date is not None else local_date(instant)
        validate_selection(catalog["catalog_version"], selected, instant)
        target = args.output_dir / "surf-tips.json"
        if args.check:
            feed = read_json(target)
            validate_feed(feed, selected, now=instant)
            if {key: feed[key] for key in CATALOG_FIELDS} != catalog:
                raise ValidationError("Generated output does not match the curated catalog")
            print(f"Validated {target}: selection {selected}; catalog edition {catalog['catalog_version']}")
        else:
            target = write_feed(build_feed(catalog, selected, now=instant), args.output_dir, now=instant)
            print(f"Published {target}: selection {selected}; catalog edition {catalog['catalog_version']}")
    except (ValidationError, OSError) as exc:
        parser.exit(1, f"Surf tips error: {exc}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
