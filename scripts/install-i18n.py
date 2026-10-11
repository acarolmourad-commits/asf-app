"""Install optional PT/EN foundation with strict legacy-block guards."""
from pathlib import Path
import re

home_path=Path('index.html')
app_path=Path('app.js')
quiz_path=Path('js/home-quiz-i18n.js')
home=home_path.read_text(encoding='utf-8')
app=app_path.read_text(encoding='utf-8')
quiz=quiz_path.read_text(encoding='utf-8')
include='<script defer src="js/asf-i18n.js?v=1"></script>'
if include in home:
    print('Already installed; no changes.')
    raise SystemExit(0)
assert home.count('</body>')==1
assert app.count('function setLanguage(lang) {')==1
startup="  // Initialize: load saved language\n  var savedLang = localStorage.getItem('asf-lang');\n  if (savedLang) setLanguage(savedLang);\n"
assert app.startswith(startup),'Unexpected language startup block'
app=app[len(startup):]
pattern=r'function setLanguage\(lang\) \{.*?(?=function toggleChatbot\()'
app,n=re.subn(pattern,'// Language controls are implemented in js/asf-i18n.js.\n',app,count=1,flags=re.S)
assert n==1
marker='// Language Translation System\n'
assert quiz.count(marker)==1
prefix,legacy=quiz.split(marker,1)
assert "document.querySelector('.icon-btn[]')" in legacy
assert 'function changeLanguage(lang)' in legacy
assert legacy.rstrip().endswith('});'), 'Unexpected code after legacy language block'
quiz=prefix+'// Optional language foundation: js/asf-i18n.js. Quiz and XP code above preserved.\n'
home=home.replace('</body>',include+'\n</body>')
# Validate all transformations before writing.
assert 'guia-cutback-unificado' in home
assert 'checkASFBadges' in quiz
for path,text in [(home_path,home),(app_path,app),(quiz_path,quiz)]:path.write_text(text,encoding='utf-8')
print('Installed PT/EN module; removed only two broken legacy language implementations.')
