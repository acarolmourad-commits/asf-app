#!/usr/bin/env python3
"""
ASF Instagram Poster — Meta Graph API (urllib stdlib — zero dependencies)
Posta conteúdo automaticamente no Instagram da ASF.

Uso:
    python3 post.py "texto do post"
    python3 post.py "texto" --image /caminho/foto.jpg
    python3 post.py --update-token SEU_TOKEN_CURTO
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
import mimetypes
from pathlib import Path

# Carrega variáveis do .env
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())

APP_ID = os.environ.get('META_APP_ID', '')
APP_SECRET = os.environ.get('META_APP_SECRET', '')
PAGE_TOKEN = os.environ.get('META_PAGE_ACCESS_TOKEN', '')
IG_USER_ID = os.environ.get('META_IG_USER_ID', '')

BASE = 'https://graph.facebook.com/v19.0'


def http_request(url: str, data: dict = None, files: dict = None, method: str = 'GET') -> dict:
    """HTTP request usando urllib padrão."""
    if data and not files:
        data = urllib.parse.urlencode(data).encode()
    elif files:
        boundary = '----FormBoundary7MA4YWxkTrZu0gW'
        body = bytearray()
        for key, value in (data or {}).items():
            body += f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n'.encode()
        for key, filepath in files.items():
            filename = Path(filepath).name
            content_type = mimetypes.guess_type(filepath)[0] or 'image/jpeg'
            body += f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"; filename="{filename}"\r\nContent-Type: {content_type}\r\n\r\n'.encode()
            with open(filepath, 'rb') as f:
                body += f.read()
            body += b'\r\n'
        body += f'--{boundary}--\r\n'.encode()
        data = bytes(body)
        headers = {'Content-Type': f'multipart/form-data; boundary={boundary}'}
    else:
        headers = {}
        data = None

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {'error': str(e), 'body': e.read().decode()}


def check_config():
    missing = []
    for var, label in [(APP_ID, 'META_APP_ID'), (APP_SECRET, 'META_APP_SECRET'),
                       (PAGE_TOKEN, 'META_PAGE_ACCESS_TOKEN'), (IG_USER_ID, 'META_IG_USER_ID')]:
        if not var or 'SEU' in var or 'AQUI' in var:
            missing.append(label)
    if missing:
        print(f'⚠️  Preencha no .env: {", ".join(missing)}')
        print('   Verifique meta-integration/.env.example')
        sys.exit(1)


def upload_image(image_path: str) -> str | None:
    """Faz upload de imagem e retorna o media_id."""
    url = f'{BASE}/{IG_USER_ID}/media'
    r = http_request(url, data={'caption': '', 'access_token': PAGE_TOKEN},
                     files={'image': image_path}, method='POST')
    if 'id' in r:
        print(f'   ✅ Upload OK: {r["id"]}')
        return r['id']
    print(f'   ❌ Erro upload: {r}')
    return None


def create_container(text: str, media_ids: list | None = None) -> str | None:
    """Cria o container do post."""
    url = f'{BASE}/{IG_USER_ID}/media'
    payload = {
        'caption': text,
        'access_token': PAGE_TOKEN,
        'media_type': ('CAROUSEL' if media_ids and len(media_ids) > 1
                       else ('IMAGE' if media_ids else 'TEXT')),
    }
    if media_ids:
        if len(media_ids) > 1:
            payload['children'] = json.dumps(media_ids)
        else:
            payload['image_url'] = ''  # será ignorado para upload feito

    r = http_request(url, data=payload, method='POST')
    return r.get('id')


def publish(container_id: str) -> dict | None:
    """Publica o post."""
    url = f'{BASE}/{IG_USER_ID}/media_publish'
    r = http_request(url, data={
        'creation_id': container_id,
        'access_token': PAGE_TOKEN,
    }, method='POST')
    return r.get('id') and r


def get_long_lived_token(short_token: str) -> str:
    """Troca token curto por longo (60 dias)."""
    url = f'{BASE}/oauth/access_token'
    r = http_request(url, data={
        'grant_type': 'fb_exchange_token',
        'client_id': APP_ID,
        'client_secret': APP_SECRET,
        'fb_exchange_token': short_token,
    })
    if 'access_token' in r:
        print(f'✅ Token longo obtido (expira ~60 dias)!')
        return r['access_token']
    print(f'❌ Erro: {r}')
    sys.exit(1)


def post_text(text: str) -> dict | None:
    print('📝 Criando post de texto...')
    container = create_container(text)
    if not container:
        return None
    time.sleep(2)
    return publish(container)


def post_with_image(text: str, image_paths: list[str]) -> dict | None:
    media_ids = []
    for img in image_paths:
        p = Path(img)
        if not p.exists():
            print(f'⚠️  Imagem não encontrada: {img}')
            continue
        print(f'📤 Enviando: {p.name}')
        mid = upload_image(str(p))
        if mid:
            media_ids.append(mid)
        time.sleep(1)

    if not media_ids:
        return None

    print(f'📝 Criando post com {len(media_ids)} imagem(ns)...')
    container = create_container(text, media_ids)
    if not container:
        return None
    time.sleep(3)
    return publish(container)


def main():
    check_config()

    if len(sys.argv) < 2:
        print('Uso:')
        print('  python3 post.py "texto do post"')
        print('  python3 post.py "texto" --image foto.jpg')
        print('  python3 post.py --update-token SEU_TOKEN_CURTO')
        sys.exit(1)

    if sys.argv[1] == '--update-token':
        long_token = get_long_lived_token(sys.argv[2])
        env_file = Path(__file__).parent / '.env'
        content = env_file.read_text()
        content = content.replace('SEU_TOKEN_LONGO_AQUI', long_token)
        env_file.write_text(content)
        print('✅ Salvo no .env!')
        sys.exit(0)

    text = sys.argv[1]
    images = []
    i = 2
    while i < len(sys.argv):
        if sys.argv[i] == '--image' and i + 1 < len(sys.argv):
            images.append(sys.argv[i + 1])
            i += 2
        else:
            i += 1

    print(f'🏄 Postando no @associacaosurffeminino')
    print(f'   {"📷 Com " + str(len(images)) + " imagem(ns)" if images else "📝 Só texto"}')

    result = (post_with_image(text, images) if images else post_text(text))

    if result and 'id' in result:
        post_url = f'https://www.instagram.com/p/{result["id"]}/'
        print(f'\n✅ POST PUBLICADO!')
        print(f'   ID: {result["id"]}')
        print(f'   🔗 {post_url}')
    else:
        print(f'❌ Falha: {result}')
        sys.exit(1)


if __name__ == '__main__':
    main()
