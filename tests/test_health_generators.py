"""Editorial safety checks for all breathing, stretching and mobility outputs."""
import contextlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


stretch = load('alongamento_dicas')
breathing = load('respiracao_dicas')
mobility = load('mobility_agent')
UNSUPPORTED = ('40%', 'previne', 'prevenção de lesões', 'alivia dor',
               'menor dor no dia seguinte', 'recuperação rápida', 'mais rápida',
               'reduz cortisol', 'oxigênio no sangue', 'oxygena',
               'comprovada', 'instantaneamente', 'melhora performance')
UNSAFE_BREATHING = ('4-7-8', '4-4-4-4', 'segure 7', 'segure 4',
                    'no lineup esperando', 'conserva ar', 'confie na prancha e no leash')


class HealthGeneratorTests(unittest.TestCase):
    def assert_editorial_safety(self, text):
        for claim in UNSUPPORTED:
            self.assertNotIn(claim, text.lower())
        self.assertNotIn('exemplo.com', text)

    def test_all_catalog_entries_avoid_unsupported_health_claims(self):
        for catalog in (stretch.ALONGAMENTO_EXERCICIOS, breathing.RESPIRAÇÃO_DICAS,
                        mobility.MOBILITY_EXERCISES):
            for item in catalog:
                with self.subTest(title=item['title']):
                    self.assert_editorial_safety(json.dumps(item, ensure_ascii=False))

    def test_every_stretch_selection_regenerates_with_cautions_and_source(self):
        for item in stretch.ALONGAMENTO_EXERCICIOS:
            with self.subTest(title=item['title']), tempfile.TemporaryDirectory() as tmp:
                with contextlib.chdir(tmp), patch.object(stretch.random, 'choice', return_value=item):
                    stretch.save_exercise()
                    rendered = Path('docs/generated/alongamento.html').read_text()
                self.assert_editorial_safety(rendered)
                self.assertIn('Mayo Clinic', rendered)
                self.assertIn('Não force nem continue com dor.', rendered)
                self.assertIn('fora da água', rendered)

    def test_every_breathing_selection_regenerates_without_water_drills(self):
        for item in breathing.RESPIRAÇÃO_DICAS:
            with self.subTest(title=item['title']), tempfile.TemporaryDirectory() as tmp:
                with contextlib.chdir(tmp), patch.object(breathing.random, 'choice', return_value=item):
                    breathing.save_tip()
                    rendered = Path('docs/generated/respiracao.html').read_text()
                self.assert_editorial_safety(rendered)
                for instruction in UNSAFE_BREATHING:
                    self.assertNotIn(instruction, rendered.lower())
                self.assertIn('apenas em terra', rendered)
                self.assertIn('Pare se sentir tontura ou desconforto', rendered)
                self.assertIn('www.nhs.uk', rendered)
                self.assertIn('www.ausport.gov.au', rendered)

    def test_every_mobility_selection_keeps_json_and_html_consistent(self):
        for item in mobility.MOBILITY_EXERCISES:
            with self.subTest(title=item['title']), tempfile.TemporaryDirectory() as tmp:
                with contextlib.chdir(tmp), patch.object(mobility.random, 'choice', return_value=item):
                    content = mobility.generate_daily()
                    rendered = Path('docs/generated/mobility.html').read_text()
                    saved = json.loads(Path('docs/generated/mobility.json').read_text())
                self.assertEqual(content, saved)
                self.assertEqual(saved['exercise'], item)
                self.assert_editorial_safety(rendered)
                self.assertIn(item['description'], rendered)
                self.assertIn('Mayo Clinic', rendered)
                self.assertIn('continue com dor', rendered)

    def test_checked_in_outputs_are_safe_and_mobility_matches_catalog(self):
        for name in ('alongamento.html', 'respiracao.html', 'mobility.html', 'mobility.json'):
            with self.subTest(file=name):
                self.assert_editorial_safety((ROOT / 'docs/generated' / name).read_text())
        saved = json.loads((ROOT / 'docs/generated/mobility.json').read_text())
        self.assertIn(saved['exercise'], mobility.MOBILITY_EXERCISES)


if __name__ == '__main__':
    unittest.main()
