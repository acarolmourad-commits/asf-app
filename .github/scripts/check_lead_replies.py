#!/usr/bin/env python3
"""Private Villa Blu monitor. Minimal metadata only; never sends mail.

Uses the Composio user routing previously configured for the repository key.
Private Notion state prevents duplicate events. Public logs contain no message
subjects, bodies, addresses, links, cards or documents. Completion is manual.
"""
import datetime as dt
import json
import os
import re
import sys
from email.utils import parseaddr
import requests

UTC = dt.timezone.utc
PARTNER = 'contato@villablumaresias.com.br'
PREFIX = 'ASF_EVENT:'
DONE = {'75ec6e8f-1b3e-438d-b568-ec8382fd3ecc', '241ac44e-7417-41f0-9107-e1e2e9f8e2fa',
        'c41b861d-cb04-43c2-8d75-a610aa1a9c09', '79258ebc-3bb5-411e-947c-9cd937b3ad65'}
STOP = '0bd2e0e6-e9de-4fb6-acf0-51f814fa5517'
ALLOWED = {'GMAIL_FETCH_EMAILS', 'NOTION_RETRIEVE_PAGE', 'NOTION_FETCH_BLOCK_CONTENTS',
           'NOTION_APPEND_TEXT_BLOCKS', 'NOTION_UPDATE_BLOCK'}

class MonitorError(Exception):
    pass

def text(block):
    value = block.get(block.get('type', ''), {})
    return ''.join(r.get('plain_text', r.get('text', {}).get('content', ''))
                   for r in value.get('rich_text', []))

def date(value):
    try:
        return dt.datetime.fromisoformat(value.replace('Z', '+00:00')).astimezone(UTC)
    except (ValueError, AttributeError, TypeError):
        raise MonitorError('Metadata timestamp unavailable') from None

def event(message):
    labels = message.get('labelIds') or []
    if 'DRAFT' in labels:
        return None
    kind = 'sent' if 'SENT' in labels else 'received'
    if kind == 'received' and parseaddr(message.get('sender') or '')[1].lower() != PARTNER:
        return None
    identifier = message.get('messageId') or message.get('id')
    if not isinstance(identifier, str) or not re.fullmatch(r'[0-9a-fA-F]{8,32}', identifier):
        raise MonitorError('Message identifier unavailable')
    return {'id': identifier, 'direction': kind, 'at': date(message.get('messageTimestamp')).isoformat()}

def events_from(blocks):
    result = {}
    for block in blocks:
        value = text(block)
        if not value.startswith(PREFIX):
            continue
        try:
            e = json.loads(value[len(PREFIX):])
            if set(e) != {'id', 'direction', 'at'} or e['direction'] not in ('received', 'sent'):
                raise ValueError()
            date(e['at'])
            result[e['id']] = e
        except (ValueError, KeyError, TypeError):
            raise MonitorError('Private state invalid') from None
    return result

def completion(blocks):
    todos = {b['id']: b.get('to_do', {}) for b in blocks if b.get('type') == 'to_do'}
    if not DONE.issubset(todos) or STOP not in todos:
        raise MonitorError('Private completion controls missing')
    remaining = sum(not todos[i].get('checked', False) for i in DONE)
    return bool(todos[STOP].get('checked')) or remaining == 0, remaining

def next_step(events):
    incoming = [date(e['at']) for e in events.values() if e['direction'] == 'received']
    outgoing = [date(e['at']) for e in events.values() if e['direction'] == 'sent']
    last_in = max(incoming) if incoming else None
    last_out = max(outgoing) if outgoing else None
    if last_in and (not last_out or last_in > last_out):
        state = 'RESPOSTA_RECEBIDA: revisar prontamente; nenhum envio automatico.'
    elif last_out:
        state = ('AGUARDANDO_RESPOSTA: follow-up apenas com aprovacao, apos '
                 + (last_out + dt.timedelta(days=7)).isoformat()
                 + '; conferir outras conversas antes de enviar.')
    else:
        state = 'SEM_ENVIO_IDENTIFICADO: revisao humana necessaria.'
    return state, last_in, last_out

class Router:
    def __init__(self):
        self.key = os.environ.get('COMPOSIO_API_KEY')
        self.user = os.environ.get('COMPOSIO_ENTITY_ID', 'default_user')
        if not self.key:
            raise MonitorError('Composio credential unavailable')
    def call(self, slug, arguments):
        if slug not in ALLOWED:
            raise MonitorError('Action not permitted')
        try:
            response = requests.post('https://backend.composio.dev/api/v3/tools/execute/' + slug,
                headers={'x-api-key': self.key, 'Content-Type': 'application/json'},
                json={'user_id': self.user, 'arguments': arguments}, timeout=90)
            if response.status_code != 200:
                raise MonitorError('Router HTTP ' + str(response.status_code) + ' for ' + slug)
            result = response.json()
            if result.get('successful') is not True or result.get('error'):
                raise MonitorError('Router action failed for ' + slug)
            return result.get('data') or {}
        except requests.RequestException:
            raise MonitorError('Router network failure for ' + slug) from None
        except ValueError:
            raise MonitorError('Router response invalid for ' + slug) from None

def blocks_from(router, page):
    result, cursor, seen = [], None, set()
    while True:
        args = {'block_id': page, 'page_size': 100}
        if cursor:
            args['start_cursor'] = cursor
        data = router.call('NOTION_FETCH_BLOCK_CONTENTS', args)
        result.extend(data.get('results') or [])
        if not data.get('has_more'):
            return result
        cursor = data.get('next_cursor')
        if not cursor or cursor in seen:
            raise MonitorError('Private pagination incomplete')
        seen.add(cursor)

def mail_from(router):
    result, token, seen = {}, None, set()
    while True:
        args = {'user_id': 'me', 'query': '{from:' + PARTNER + ' to:' + PARTNER + '} -in:drafts',
                'max_results': 100, 'verbose': False, 'include_payload': False,
                'include_spam_trash': False}
        if token:
            args['page_token'] = token
        data = router.call('GMAIL_FETCH_EMAILS', args)
        for message in data.get('messages') or []:
            e = event(message)
            if e:
                result[e['id']] = e
        token = data.get('nextPageToken')
        if not token:
            return result
        if token in seen:
            raise MonitorError('Mail pagination incomplete')
        seen.add(token)

def run():
    router = Router()
    page = os.environ['NOTION_MONITOR_PAGE_ID']
    status_id = os.environ['NOTION_STATUS_BLOCK_ID']
    meta = router.call('NOTION_RETRIEVE_PAGE', {'page_id': page})
    if meta.get('id') != page or meta.get('public_url') or meta.get('archived') or meta.get('in_trash'):
        raise MonitorError('Notion target is not an active private page')
    blocks = blocks_from(router, page)
    end, pending = completion(blocks)
    checked = dt.datetime.now(UTC).isoformat()
    if end:
        router.call('NOTION_UPDATE_BLOCK', {'block_id': status_id, 'block_type': 'paragraph',
            'content': 'ASF_MONITOR_STATUS: ENCERRADO em ' + checked + '; nenhuma leitura de email.'})
        print('Private monitor: completed; mail access skipped.')
        return
    known = events_from(blocks)
    current = mail_from(router)
    new = sorted([e for mid, e in current.items() if mid not in known], key=lambda e: e['at'])
    for start in range(0, len(new), 100):
        children = [{'type': 'paragraph', 'paragraph': {'rich_text': [
            {'text': {'content': PREFIX + json.dumps(e, separators=(',', ':'))}}]}}
            for e in new[start:start + 100]]
        router.call('NOTION_APPEND_TEXT_BLOCKS', {'block_id': page, 'children': children})
    persisted = events_from(blocks_from(router, page))
    if not set(current).issubset(persisted):
        raise MonitorError('Private persistence verification failed')
    state, last_in, last_out = next_step(persisted)
    summary = ('ASF_MONITOR_STATUS: ATIVO; ultima checagem ' + checked + '; pendencias ' + str(pending)
               + '; ' + state + '\nUltima resposta: ' + (last_in.isoformat() if last_in else 'nao identificada')
               + '\nUltimo envio: ' + (last_out.isoformat() if last_out else 'nao identificado')
               + '\nSem envios automaticos; sem corpos, assuntos ou anexos armazenados.')
    router.call('NOTION_UPDATE_BLOCK', {'block_id': status_id, 'block_type': 'paragraph', 'content': summary})
    if not any(b.get('id') == status_id and text(b) == summary for b in blocks_from(router, page)):
        raise MonitorError('Private status verification failed')
    print('Private monitor OK; new minimal events=' + str(len(new)) + '; pending=' + str(pending))

def self_test():
    sent = {'messageId': 'a1234567890abcde', 'labelIds': ['SENT', 'INBOX'],
        'sender': 'our-test@example.invalid', 'messageTimestamp': '2026-10-08T01:30:48Z',
        'subject': 'DO_NOT_STORE', 'messageText': 'DO_NOT_STORE', 'attachmentList': ['DO_NOT_STORE']}
    assert event(dict(sent, labelIds=['DRAFT'])) is None
    assert event(dict(sent, labelIds=['INBOX'])) is None
    e = event(sent)
    assert set(e) == {'id', 'direction', 'at'} and 'DO_NOT_STORE' not in json.dumps(e)
    b = {'type': 'paragraph', 'paragraph': {'rich_text': [{'text': {'content': PREFIX + json.dumps(e)}}]}}
    assert len(events_from([b, b])) == 1
    assert '2026-10-15T01:30:48+00:00' in next_step({e['id']: e})[0]
    reply = event(dict(sent, messageId='b1234567890abcde', labelIds=['INBOX'],
                       sender=PARTNER, messageTimestamp='2026-10-08T02:00:00Z'))
    assert next_step({e['id']: e, reply['id']: reply})[0].startswith('RESPOSTA_RECEBIDA')
    controls = [{'id': i, 'type': 'to_do', 'to_do': {'checked': False}} for i in DONE | {STOP}]
    assert completion(controls) == (False, 4)
    for c in controls:
        if c['id'] == STOP:
            c['to_do']['checked'] = True
    assert completion(controls)[0]
    print('PASS: privacy, draft exclusion, duplicate state, seven-day interval and completion controls.')

if __name__ == '__main__':
    try:
        self_test() if '--self-test' in sys.argv else run()
    except (MonitorError, KeyError):
        print('::error::Private monitor failed safely; provider payload suppressed.')
        sys.exit(1)
