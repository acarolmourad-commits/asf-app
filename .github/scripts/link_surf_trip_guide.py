"""Apply the approved surf-trip guide link without rewriting home scripts.
Run with the existing patch-runner workflow. Safe to rerun; no network calls.
"""
from pathlib import Path
import hashlib

path = Path('index.html')
raw = path.read_bytes()
text = raw.decode('utf-8')
link = '<a href="guias/planejar-surf-trip/">Planeje uma surf trip sem surpresas</a> · '
marker = '<a href="guia-apps.html">Explore o catálogo de aplicativos</a> · <a href="parcerias/villa-blu/">'
expected = 'b27ae462d41b600ae734cfb620cc2c928362cb61'
if link + marker in text:
    print('Approved guide link already present; no changes.')
else:
    actual = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
    if actual != expected:
        raise SystemExit('Home changed since review; stop and revalidate before applying.')
    if text.count(marker) != 1:
        raise SystemExit('Expected unique home navigation marker not found.')
    if not Path('guias/planejar-surf-trip/index.html').is_file():
        raise SystemExit('Guide file missing; do not create a broken home link.')
    result = text.replace(marker, link + marker, 1)
    if result.replace(link + marker, marker, 1) != text:
        raise SystemExit('Unexpected change outside the approved insertion.')
    path.write_bytes(result.encode('utf-8'))
    print('Added exactly one approved home link; existing home content preserved.')
