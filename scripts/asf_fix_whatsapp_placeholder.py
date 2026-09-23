from pathlib import Path
p=Path('index.html')
s=p.read_text()
old='wa.me/5511999999999'
new='wa.me/5511954346288'
if old in s:
    p.write_text(s.replace(old,new))
    print('Placeholder WhatsApp corrigido para o número oficial já utilizado no projeto.')
else:
    print('Placeholder não encontrado; nenhuma alteração necessária.')
