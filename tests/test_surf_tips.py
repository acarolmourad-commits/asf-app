"""Offline contract, editorial guardrail and publication tests for Surf Tips."""

import copy
from datetime import date, datetime, timedelta, timezone
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/generate_surf_tips.py"
SPEC = importlib.util.spec_from_file_location("surf_tips", SCRIPT)
surf = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(surf)
TODAY = date(2026, 11, 5)
NOW = datetime(2026, 11, 5, 16, 0, tzinfo=timezone.utc)


class SurfTipsTests(unittest.TestCase):
    def setUp(self):
        self.catalog = surf.read_json(surf.CATALOG_PATH)
        self.temp = tempfile.TemporaryDirectory()
        self.output_dir = Path(self.temp.name)
        self.addCleanup(self.temp.cleanup)

    def feed(self, **kwargs):
        return surf.build_feed(self.catalog, now=kwargs.pop("now", NOW), **kwargs)

    def cli(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--output-dir", str(self.output_dir), *args],
            cwd=self.output_dir, capture_output=True, text=True,
        )

    def test_valid_catalog_and_feed(self):
        surf.validate_catalog(self.catalog)
        feed = self.feed()
        surf.validate_feed(feed, TODAY)
        self.assertEqual(feed["schema_version"], 1)
        self.assertEqual(feed["catalog_version"], "2026-11-05")
        self.assertEqual(feed["selection_date"], "2026-11-05")
        self.assertEqual(feed["generated_at"], "2026-11-05T16:00:00Z")
        self.assertEqual(len(feed["tips"]), 10)
        self.assertIn(feed["featured_id"], {tip["id"] for tip in feed["tips"]})

    def test_build_does_not_mutate_catalog(self):
        original = copy.deepcopy(self.catalog)
        self.feed()["tips"][0]["title"] = "Changed only in output"
        self.assertEqual(self.catalog, original)

    def test_sao_paulo_midnight_not_utc_midnight(self):
        before = datetime(2026, 11, 6, 2, 59, 59, tzinfo=timezone.utc)
        after = datetime(2026, 11, 6, 3, 0, tzinfo=timezone.utc)
        self.assertEqual(self.feed(now=before)["selection_date"], "2026-11-05")
        self.assertEqual(self.feed(now=after)["selection_date"], "2026-11-06")

    def test_uses_iana_timezone_including_historical_daylight_saving(self):
        self.assertEqual(surf.local_date(datetime(2018, 12, 1, 2, 30, tzinfo=timezone.utc)), date(2018, 12, 1))
        self.assertEqual(surf.local_date(datetime(2026, 12, 1, 2, 30, tzinfo=timezone.utc)), date(2026, 11, 30))

    def test_selection_is_repeatable_across_hours_and_catalog_order(self):
        expected = self.feed()["featured_id"]
        for hour in (3, 4, 12, 23):
            self.assertEqual(self.feed(now=NOW.replace(hour=hour))["featured_id"], expected)
        self.catalog["tips"].reverse()
        self.assertEqual(self.feed()["featured_id"], expected)

    def test_each_tip_is_featured_once_per_catalog_cycle(self):
        selections = {
            self.feed(now=NOW + timedelta(days=offset))["featured_id"]
            for offset in range(len(self.catalog["tips"]))
        }
        self.assertEqual(selections, {tip["id"] for tip in self.catalog["tips"]})

    def test_explicit_date_controls_selection_not_generation_timestamp(self):
        later = NOW + timedelta(days=3)
        feed = self.feed(selection_date=TODAY, now=later)
        self.assertEqual(feed["selection_date"], "2026-11-05")
        self.assertEqual(feed["generated_at"], "2026-11-08T16:00:00Z")
        surf.validate_feed(feed, TODAY, now=later)

    def test_build_rejects_selection_before_edition_or_after_local_today(self):
        for selected in (TODAY - timedelta(days=1), TODAY + timedelta(days=1)):
            with self.subTest(selected=selected), self.assertRaises(surf.ValidationError):
                self.feed(selection_date=selected)
        self.catalog["catalog_version"] = "2026-11-06"
        with self.assertRaisesRegex(surf.ValidationError, "catalog edition"):
            self.feed()

    def test_feed_rejects_selection_before_edition_and_future_selection(self):
        for selected in (TODAY - timedelta(days=1), TODAY + timedelta(days=1)):
            feed = self.feed()
            feed["selection_date"] = selected.isoformat()
            feed["featured_id"] = surf.featured_id(feed["tips"], selected)
            with self.subTest(selected=selected), self.assertRaises(surf.ValidationError):
                surf.validate_feed(feed, selected, now=NOW)
        feed = self.feed()
        feed["catalog_version"] = "2026-11-06"
        with self.assertRaisesRegex(surf.ValidationError, "catalog edition"):
            surf.validate_feed(feed, now=NOW)

    def test_feed_rejects_generation_before_local_selection_or_in_future(self):
        for timestamp in ("2026-11-04T23:59:59Z", "2026-11-05T02:59:59Z", "2026-11-05T16:00:01Z"):
            feed = self.feed()
            feed["generated_at"] = timestamp
            with self.subTest(timestamp=timestamp), self.assertRaises(surf.ValidationError):
                surf.validate_feed(feed, now=NOW)
        feed = self.feed()
        feed["generated_at"] = "2026-11-05T03:00:00Z"
        surf.validate_feed(feed, now=NOW)

    def test_timestamp_is_normalized_to_utc(self):
        aware = datetime(2026, 11, 5, 13, 0, tzinfo=timezone(timedelta(hours=-3)))
        self.assertEqual(self.feed(now=aware)["generated_at"], "2026-11-05T16:00:00Z")

    def test_rejects_naive_time_or_non_date_selection(self):
        with self.assertRaises(surf.ValidationError):
            self.feed(now=datetime(2026, 11, 5, 13))
        for value in ("2026-11-05", NOW, True):
            with self.subTest(value=value), self.assertRaises(surf.ValidationError):
                self.feed(selection_date=value)

    def test_stale_and_future_dates_are_explicit_failures_when_required(self):
        feed = self.feed()
        surf.validate_feed(feed)  # A dated catalog remains readable without claiming freshness.
        for expected in (TODAY - timedelta(days=1), TODAY + timedelta(days=1)):
            with self.subTest(expected=expected), self.assertRaisesRegex(surf.ValidationError, "stale or future"):
                surf.validate_feed(feed, expected)

    def test_rejects_invalid_dates(self):
        for value in ("2026-2-01", "20261105", "2026-02-29", "2026-13-05", "2026-11-05T00:00:00Z", True, None):
            with self.subTest(value=value), self.assertRaises(surf.ValidationError):
                surf.parse_date(value)

    def test_rejects_unsupported_schema_versions(self):
        for value in (True, "1", 1.0, 0, 2, None):
            catalog = copy.deepcopy(self.catalog)
            catalog["schema_version"] = value
            with self.subTest(value=value), self.assertRaises(surf.ValidationError):
                surf.validate_catalog(catalog)

    def test_rejects_unknown_or_missing_fields(self):
        variants = []
        extra = copy.deepcopy(self.catalog)
        extra["html"] = "Unexpected field"
        variants.append(extra)
        missing = copy.deepcopy(self.catalog)
        del missing["catalog_version"]
        variants.append(missing)
        for field in surf.TIP_FIELDS:
            catalog = copy.deepcopy(self.catalog)
            del catalog["tips"][0][field]
            variants.append(catalog)
        extra_tip = copy.deepcopy(self.catalog)
        extra_tip["tips"][0]["onclick"] = "alert(1)"
        variants.append(extra_tip)
        for catalog in variants:
            with self.subTest(catalog=catalog), self.assertRaises(surf.ValidationError):
                surf.validate_catalog(catalog)

    def test_rejects_duplicate_or_invalid_identifiers(self):
        for value in (self.catalog["tips"][1]["id"], "UPPERCASE", "has space", "a", "x" * 65, [], None):
            catalog = copy.deepcopy(self.catalog)
            catalog["tips"][0]["id"] = value
            with self.subTest(value=value), self.assertRaises(surf.ValidationError):
                surf.validate_catalog(catalog)

    def test_rejects_unknown_categories_or_missing_category_coverage(self):
        for value in ("Novidade", "segurança", None, []):
            catalog = copy.deepcopy(self.catalog)
            catalog["tips"][0]["category"] = value
            with self.subTest(value=value), self.assertRaises(surf.ValidationError):
                surf.validate_catalog(catalog)
        for tip in self.catalog["tips"]:
            tip["category"] = "Segurança"
        with self.assertRaisesRegex(surf.ValidationError, "all four"):
            surf.validate_catalog(self.catalog)

    def test_rejects_wrong_catalog_size(self):
        for tips in ([], self.catalog["tips"][:7], self.catalog["tips"] * 2, {}, None):
            catalog = copy.deepcopy(self.catalog)
            catalog["tips"] = tips
            with self.subTest(tips=tips), self.assertRaises(surf.ValidationError):
                surf.validate_catalog(catalog)

    def test_rejects_empty_long_or_non_string_text(self):
        for field, (minimum, maximum) in surf.TEXT_LIMITS.items():
            for value in ("", "a" * (minimum - 1), "a" * (maximum + 1), None, {}, 42):
                catalog = copy.deepcopy(self.catalog)
                catalog["tips"][0][field] = value
                with self.subTest(field=field, value=value), self.assertRaises(surf.ValidationError):
                    surf.validate_catalog(catalog)

    def test_rejects_html_scripts_entities_and_control_characters(self):
        attacks = (
            "<script>alert(1)</script>", "<img src=x onerror=alert(1)>",
            "&lt;script&gt;alert(1)&lt;/script&gt;", "&#60;script&#62;",
            "javascript:alert(1)", "data:text/html;base64,abc", "onclick = alert(1)",
            "window.location = evil", "document.write(evil)", "eval(evil)",
            "Legível\nmas em duas linhas", "Texto\tcom tabulação", "Texto com \x00 controle",
            "Texto com \u202e direção oculta", "Texto com \u200b invisível", "  Espaços no início",
            "Espaços duplicados  aqui", "Código `executável` aqui", "Campos {inesperados} aqui",
        )
        for attack in attacks:
            for field in surf.TEXT_LIMITS:
                catalog = copy.deepcopy(self.catalog)
                catalog["tips"][0][field] = attack
                with self.subTest(field=field, attack=attack), self.assertRaises(surf.ValidationError):
                    surf.validate_catalog(catalog)

    def test_exact_url_allowlist_blocks_external_scripts_and_path_tricks(self):
        for href in (
            "https://evil.example/", "//evil.example/", "javascript:alert(1)",
            "data:text/html,hello", "/aprender/?redirect=evil", "/aprender/#wrong",
            "/../aprender/", "/aprender/%2e%2e/", " /aprender/", "/aprender/\n",
            "https://treino.asf.surf.evil.example/#plano-30-dias", "/apnea/", None, [],
        ):
            catalog = copy.deepcopy(self.catalog)
            catalog["tips"][0]["href"] = href
            with self.subTest(href=href), self.assertRaises(surf.ValidationError):
                surf.validate_catalog(catalog)

    def test_all_allowed_local_destinations_exist_without_network(self):
        for href in surf.ALLOWED_HREFS:
            catalog = copy.deepcopy(self.catalog)
            catalog["tips"][0]["href"] = href
            surf.validate_catalog(catalog)
        with self.assertRaisesRegex(surf.ValidationError, "does not exist"):
            surf.validate_catalog(self.catalog, root=self.output_dir)

    def test_rejects_invalid_output_metadata(self):
        for field, value in (
            ("selection_date", "2026-02-30"), ("generated_at", "2026-11-05"),
            ("generated_at", "2026-11-05T13:00:00-03:00"),
            ("generated_at", "2026-02-30T12:00:00Z"), ("featured_id", "unknown-tip"),
            ("featured_id", self.catalog["tips"][0]["id"]),
        ):
            feed = self.feed()
            if field == "featured_id" and value == feed[field]:
                value = self.catalog["tips"][1]["id"]
            feed[field] = value
            with self.subTest(field=field, value=value), self.assertRaises(surf.ValidationError):
                surf.validate_feed(feed)
        feed = self.feed()
        feed["published_today"] = True
        with self.assertRaises(surf.ValidationError):
            surf.validate_feed(feed)

    def test_rejects_malformed_duplicate_or_oversized_json(self):
        target = self.output_dir / "input.json"
        for raw in (b"not-json", b"\xff", b'{"tips": [], "tips": []}', b" " * (surf.MAX_BYTES + 1)):
            target.write_bytes(raw)
            with self.subTest(raw=raw[:50]), self.assertRaises(surf.ValidationError):
                surf.read_json(target)

    def test_editorial_catalog_avoids_legacy_prescriptions_and_novelty_claims(self):
        text = " ".join(tip[field] for tip in self.catalog["tips"] for field in surf.TEXT_LIMITS).lower()
        for forbidden in (
            "apneia", "retenha", "prenda a respiração", "hiperventil", "cura", "previne lesões",
            "revisão médica", "flutuação garantida", "dica inédita", "publicado hoje",
            "3 séries", "10 repetições", "prancha abdominal",
        ):
            self.assertNotIn(forbidden, text)

    def test_atomic_write_replaces_existing_output(self):
        first = self.feed()
        target = surf.write_feed(first, self.output_dir)
        following = self.feed(now=NOW + timedelta(days=1))
        surf.write_feed(following, self.output_dir, now=NOW + timedelta(days=1))
        self.assertEqual(surf.read_json(target), following)
        self.assertEqual(list(self.output_dir.iterdir()), [target])

    def test_same_day_rerun_preserves_bytes_and_first_generation_time(self):
        target = surf.write_feed(self.feed(), self.output_dir)
        first = target.read_bytes()
        surf.write_feed(self.feed(now=NOW.replace(hour=22)), self.output_dir, now=NOW.replace(hour=22))
        self.assertEqual(target.read_bytes(), first)

    def test_changed_catalog_updates_even_on_same_day(self):
        target = surf.write_feed(self.feed(), self.output_dir)
        self.catalog["tips"][0]["title"] = "Leve uma pergunta para a primeira aula"
        changed = self.feed(now=NOW.replace(hour=22))
        surf.write_feed(changed, self.output_dir, now=NOW.replace(hour=22))
        self.assertEqual(surf.read_json(target), changed)

    def test_atomic_failure_preserves_original_and_cleans_temporary_file(self):
        target = surf.write_feed(self.feed(), self.output_dir)
        original = target.read_bytes()
        with patch.object(surf.os, "replace", side_effect=OSError("simulated write failure")):
            with self.assertRaisesRegex(OSError, "simulated"):
                surf.write_feed(self.feed(now=NOW + timedelta(days=1)), self.output_dir, now=NOW + timedelta(days=1))
        self.assertEqual(target.read_bytes(), original)
        self.assertEqual(list(self.output_dir.iterdir()), [target])

    def test_invalid_new_or_existing_output_is_not_silently_published(self):
        target = surf.write_feed(self.feed(), self.output_dir)
        original = target.read_bytes()
        invalid = self.feed()
        invalid["tips"][0]["title"] = "<script>unsafe</script>"
        with self.assertRaises(surf.ValidationError):
            surf.write_feed(invalid, self.output_dir)
        self.assertEqual(target.read_bytes(), original)
        target.write_text("not valid JSON", encoding="utf-8")
        with self.assertRaises(surf.ValidationError):
            surf.write_feed(self.feed(), self.output_dir)
        self.assertEqual(target.read_text(), "not valid JSON")

    def test_cli_generate_check_repeat_and_stale_without_production_mutation(self):
        production = surf.OUTPUT_DIR / "surf-tips.json"
        before = production.read_bytes() if production.exists() else None
        result = self.cli("--date", "2026-11-05")
        self.assertEqual(result.returncode, 0, result.stderr)
        target = self.output_dir / "surf-tips.json"
        original = target.read_bytes()
        self.assertEqual(self.cli("--date", "2026-11-05").returncode, 0)
        self.assertEqual(target.read_bytes(), original)
        self.assertEqual(self.cli("--date", "2026-11-05", "--check").returncode, 0)
        stale = self.cli("--date", "2026-11-06", "--check")
        self.assertNotEqual(stale.returncode, 0)
        self.assertIn("future", stale.stderr)
        self.assertEqual(target.read_bytes(), original)
        self.assertEqual(production.read_bytes() if production.exists() else None, before)

    def test_cli_rejects_missing_output_and_invalid_dates(self):
        self.assertNotEqual(self.cli("--date", "2026-11-05", "--check").returncode, 0)
        for value in ("2026-02-29", "2026-1-1", "yesterday"):
            self.assertNotEqual(self.cli("--date", value).returncode, 0)
        self.assertEqual(list(self.output_dir.iterdir()), [])

    def test_cli_rejects_pre_catalog_and_future_dates_without_writing(self):
        future = (surf.local_date() + timedelta(days=1)).isoformat()
        for selected in ("2026-11-04", future):
            for check in ([], ["--check"]):
                result = self.cli("--date", selected, *check)
                with self.subTest(selected=selected, check=check):
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("selection_date", result.stderr)
        self.assertEqual(list(self.output_dir.iterdir()), [])

    def test_check_rejects_forged_future_feed_even_with_matching_date(self):
        selected = surf.local_date() + timedelta(days=1)
        future_now = datetime.combine(selected, datetime.min.time(), tzinfo=timezone.utc) + timedelta(hours=16)
        forged = self.feed(selection_date=selected, now=future_now)
        target = self.output_dir / "surf-tips.json"
        target.write_text(json.dumps(forged, ensure_ascii=False), encoding="utf-8")
        original = target.read_bytes()
        result = self.cli("--date", selected.isoformat(), "--check")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("future", result.stderr)
        self.assertEqual(target.read_bytes(), original)

    def test_check_rejects_catalog_drift(self):
        target = surf.write_feed(self.feed(), self.output_dir)
        feed = surf.read_json(target)
        feed["tips"][0]["title"] = "Uma edição diferente do catálogo"
        target.write_text(json.dumps(feed, ensure_ascii=False), encoding="utf-8")
        result = self.cli("--date", "2026-11-05", "--check")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("does not match", result.stderr)


if __name__ == "__main__":
    unittest.main()
