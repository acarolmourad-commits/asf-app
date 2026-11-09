"""Regression checks for the post-surf stretching content and its generator."""
import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('alongamento', ROOT / 'scripts/alongamento_dicas.py')
alongamento = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(alongamento)


class AlongamentoTests(unittest.TestCase):
    def setUp(self):
        self.exercise = next(e for e in alongamento.ALONGAMENTO_EXERCICIOS
                             if e['title'].startswith('Alongamento Pós-Surf'))

    def test_post_surf_has_no_unsupported_recovery_claim(self):
        rendered = alongamento.generate_html(self.exercise)
        for claim in ('40%', 'Recuperação muscular mais rápida', 'Menor dor no dia seguinte'):
            self.assertNotIn(claim, rendered)
        self.assertIn('Interrompa se sentir dor.', rendered)

    def test_all_exercises_render(self):
        for exercise in alongamento.ALONGAMENTO_EXERCICIOS:
            with self.subTest(title=exercise['title']):
                rendered = alongamento.generate_html(exercise)
                self.assertIn(exercise['title'], rendered)
                self.assertIn('<ol', rendered)
                self.assertNotIn('40%', rendered)

    def test_save_post_surf_regenerates_safe_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            original_open = open
            def sandbox_open(path, *args, **kwargs):
                return original_open(Path(tmp) / path, *args, **kwargs)
            with patch.object(alongamento, 'get_random_exercise', return_value=self.exercise), \
                 patch.object(alongamento.os, 'makedirs', side_effect=lambda path, **kw: (Path(tmp) / path).mkdir(parents=True, exist_ok=True)), \
                 patch('builtins.open', side_effect=sandbox_open):
                self.assertEqual(alongamento.save_exercise(), self.exercise)
            output = (Path(tmp) / 'docs/generated/alongamento.html').read_text()
            self.assertEqual(output, alongamento.generate_html(self.exercise))
            self.assertNotIn('40%', output)


if __name__ == '__main__':
    unittest.main()
