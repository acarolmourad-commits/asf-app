import unittest
import contextlib
import io
import os
import tempfile
import textwrap
from types import SimpleNamespace
from unittest.mock import patch
from pathlib import Path

from scripts.network_navigation import navigation_error


ROOT = Path(__file__).resolve().parents[1]
CARD = "https://asf.surf/emitir.html"


class NetworkNavigationTests(unittest.TestCase):
    def setUp(self):
        self.card = (ROOT / "emitir.html").read_text(encoding="utf-8")

    def test_current_card_passes_without_satellite_script(self):
        self.assertNotIn("asf-network.js", self.card)
        self.assertIsNone(navigation_error(CARD, CARD, self.card))

    def test_each_required_card_link_is_checked(self):
        for href, label in [("./index.html", "voltar ao app"),
                            ("./recuperar-carteirinha.html", "recuperação"),
                            ("/beneficios/", "benefícios"),
                            ("./privacidade.html", "privacidade")]:
            with self.subTest(href=href):
                broken = self.card.replace('href="' + href + '"', 'href="/missing.html"')
                self.assertIn(label, navigation_error(CARD, CARD, broken))

    def test_unexpected_card_redirect_fails_even_with_network_script(self):
        for final in ["https://asf.surf/", "https://example.org/emitir.html", "http://asf.surf/emitir.html"]:
            with self.subTest(final=final):
                self.assertIsNotNone(navigation_error(CARD, final, '<script src="/asf-network.js"></script>'))

    def test_satellites_still_need_real_script_element(self):
        for url in ["https://eco.asf.surf/", "https://eco.asf.surf/#carteirinha", "https://example.org/emitir.html"]:
            with self.subTest(url=url):
                self.assertIsNotNone(navigation_error(url, url, self.card))
                self.assertIsNotNone(navigation_error(url, url, '<!-- asf-network.js -->'))
                self.assertIsNone(navigation_error(url, url, '<script src="https://asf.surf/asf-network.js?v=1"></script>'))

    def test_legacy_card_anchor_remains_supported(self):
        self.assertIsNone(navigation_error("https://asf.surf/#carteirinha", "https://asf.surf/", ""))


class WorkflowRegressionTests(unittest.TestCase):
    def run_monitor(self, card_status="200", card_body=None):
        workflow = (ROOT / ".github/workflows/ssl-cert-watch.yml").read_text()
        code = textwrap.dedent(workflow.split("python3 - <<'PY'\n", 1)[1].split("          PY", 1)[0])
        card_body = card_body if card_body is not None else (ROOT / "emitir.html").read_text()
        def fake_curl(cmd, **kwargs):
            url = cmd[-1]
            body = card_body if url == CARD else '<script src="https://asf.surf/asf-network.js"></script> previsao.asf.surf asf-app asf.surf/#carteirinha'
            status = card_status if url == CARD else "200"
            return SimpleNamespace(stdout=body + " ASFSTATUS:" + status + " ASFFINAL:" + url, stderr="", returncode=0)
        previous = os.getcwd()
        try:
            with tempfile.TemporaryDirectory() as temp:
                Path(temp, "asf-network.js").write_text((ROOT / "asf-network.js").read_text())
                os.chdir(temp)
                with patch("subprocess.run", side_effect=fake_curl), contextlib.redirect_stdout(io.StringIO()):
                    with self.assertRaises(SystemExit) as result:
                        exec(compile(code, "ssl-cert-watch.yml", "exec"), {})
                return result.exception.code, Path("relatorio-ssl.txt").read_text()
        finally:
            os.chdir(previous)

    def test_full_registry_accepts_current_card_navigation(self):
        code, report = self.run_monitor()
        self.assertEqual(code, 0)
        self.assertIn("61 verificações HTTPS concluídas", report)
        self.assertIn("0 falhas.", report)

    def test_card_http_failure_still_fails_workflow(self):
        code, report = self.run_monitor(card_status="404")
        self.assertEqual(code, 1)
        self.assertIn("HTTP=404", report)

    def test_missing_card_navigation_still_fails_workflow(self):
        code, report = self.run_monitor(card_body="<main>Sem navegação</main>")
        self.assertEqual(code, 1)
        self.assertIn("navegação da carteirinha incompleta", report)


if __name__ == "__main__":
    unittest.main()
