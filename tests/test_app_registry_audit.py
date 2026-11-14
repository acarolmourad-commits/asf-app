import unittest
from unittest.mock import patch

from scripts.audit_app_registry import build_report, normalize_url


class RegistryAuditTests(unittest.TestCase):
    def test_fragment_is_not_sent_to_server(self):
        self.assertEqual(
            normalize_url("https://asf.surf/#carteirinha"),
            "https://asf.surf/",
        )

    @patch("scripts.audit_app_registry.probe")
    def test_registry_is_source_of_truth_and_urls_are_deduplicated(self, mocked_probe):
        mocked_probe.return_value = {
            "requested_url": "https://example.org/",
            "final_url": "https://example.org/",
            "http_status": 200,
            "result": "ok",
            "redirected": False,
            "elapsed_ms": 12,
        }
        registry = {
            "apps": {
                "asf-one": {
                    "github_io": "https://example.org/",
                    "asf_surf": "https://example.org/#home",
                },
                "asf-two": {
                    "github_io": "https://example.org/",
                    "asf_surf": "https://example.org/",
                    "note": "Alias consolidado",
                },
            }
        }
        previous = {"details": [{"app": "asf-eventos"}]}
        report = build_report(registry, previous, timeout=5)

        self.assertEqual(report["registry_count"], 2)
        self.assertEqual(report["checked_unique_urls"], 1)
        self.assertEqual(mocked_probe.call_count, 1)
        self.assertEqual(len(report["details"]), 2)
        self.assertEqual(report["registry_consistency"]["previous_report_only"], ["asf-eventos"])
        self.assertEqual(report["registry_consistency"]["missing_from_previous_report"], ["asf-one", "asf-two"])
        self.assertEqual(report["summary"]["both_ok"], ["asf-one", "asf-two"])


if __name__ == "__main__":
    unittest.main()
