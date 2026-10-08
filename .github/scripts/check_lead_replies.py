#!/usr/bin/env python3
"""Private Villa Blu tracking via Composio. Never sends mail or publishes reports.

Only minimal metadata is stored in the private Notion page. No email subjects,
message bodies, attachments, membership cards or personal documents are stored.
The Notion checklist must be completed manually after formal confirmation.
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
EVENT_PREFIX = 'ASF_EVENT:'
DONE_IDS = {
    '75ec6e8f-1b3e-438d-b568-ec8382fd3ecc',
    '241ac44e-7417-41f0-9107-e1e2e9f8e2fa',
    'c41b861d-cb04-43c2-8d75-a610aa1a9c09',
    '79258ebc-3bb5-411e-947c-9cd937b3ad65',
}
STOP_ID = '0bd2e0e6-e9de-4fb6-acf0-51f814fa5517'
ALLOWED = {
    'GMAIL_FETCH_EMAILS', 'NOTION_RETRIEVE_PAGE',
    'NOTION_FETCH_BLOCK_CONTENTS', 'NOTION_APPEND_TEXT_BLOCKS',
    'NOTION_UPDATE_BLOCK',
}

class MonitorError(Exception):
    pass

def text_of(block):
    value = block.get(block.get('type', ''), {})
    return ''.join(r.get('plain_text', r.get('text', {}).get('content', ''))
                   for r in value.get('rich_text', []))

def iso_date(value):
    try:
        return dt.datetime.fromisoformat(value.replace('Z', '+00:00')).astimezone(UTC)
    except (ValueError, AttributeError, TypeError):
        raise MonitorError('Metadata timestamp unavailable') from None

def minimal_event(message):
    labels = message.get('labelIds') or []
    if 'DRAFT' in labels:
        return None
    if 'SENT' in labels:
        direction = 'sent'
    elif parseaddr(message.get('sender') or '')[1].lower() == PARTNER:
        direction = 'received'
    else:
        return None
    identifier = message.get('messageId') or message.get('id')
    if not isinstance(identifier, str) or not re.fullmatch(r'[0-9a-fA-F]{8,32}', identifier):
        raise MonitorError('Message identifier unavailable')
    timestamp = iso_date(message.get('messageTimestamp'))
    return {'id': identifier, 'direction': direction, 'at': timestamp.isoformat()}

def read_events(blocks):
    events = {}
    for block in blocks:
        value = text_of(block)
        if value.startswith(EVENT_PREFIX):
            try:
                event = json.loads(value[len(EVENT_PREFIX):])
                if set(event) != {'id', 'direction', 'at'}:
                    raise ValueError()
                if event['direction'] not in ('received', 'sent'):
                    raise ValueError()
                iso_date(event['at'])
                events[event['id']] = event
            except (ValueError, KeyError, TypeError):
                raise MonitorError('Private event state invalid') from None
    return events

def stopped(blocks):
    todos = {b['id']: b.get('to_do', {}) for b in blocks if b.get('type') == 'to_do'}
    if not DONE_IDS.issubset(todos) or STOP_ID not in todos:
        raise MonitorError('Private completion controls unavailable')
    remaining = sum(not todos[i].get('checked', False) for i in DONE_IDS)
    return bool(todos[STOP_ID].get('checked')) or remaining == 0, remaining

def next_step(events):
    incoming = [iso_date(e['at']) for e in events.values() if e['direction'] == 'received']
    outgoing = [iso_date(e['at']) for e in events.values() if e['direction'] == 'sent']
    last_in = max(incoming) if incoming else None
    last_out = max(outgoing) if outgoing else None
    if last_in and (not last_out or last_in > last_out):
        return 'RESPOSTA_RECEBIDA: revisar prontamente; nenhum envio automatico.', last_in, last_out
    if last_out:
        earliest = last_out + dt.timedelta(days=7)
        return ('AGUARDANDO_RESPOSTA: follow-up somente com aprovacao, apos ' + earliest.isoformat()
                + '; revalidar outras conversas antes de enviar.'), last_in, last_out
    return 'SEM_ENVIO_IDENTIFICADO: revisao humana necessaria.', last_in, last_out

class Router:
    def __init__(self):
        self.key = os.environ.get('COMPOSIO_API_KEY')
        if not self.key:
            raise MonitorError('Composio credential unavailable')
        self.accounts = {'GMAIL': os.environ['GMAIL_ACCOUNT_ID'],
                         'NOTION': os.environ['NOTION_ACCOUNT_ID']}
    def call(self, slug, arguments):
        if slug not in ALLOWED:
            raise MonitorError('Action not permitted by monitor')
        account = self.accounts[slug.split('_', 1)[0]]
        try:
            response = requests.post(
                'https://backend.composio.dev/api/v3/tools/execute/' + slug,
                headers={'x-api-key': self.key, 'Content-Type': 'application/json'},
                json={'connected_account_id': account, 'arguments': arguments},
                timeout=90,
            )
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
        # Never print response bodies, URLs, headers, payloads or exception details.

def list_blocks(router, page):
    blocks, cursor, seen = [], None, set()
    while True:
        args = {'block_id': page, 'page_size': 100}
        if cursor:
            args['start_cursor'] = cursor
        data = router.call('NOTION_FETCH_BLOCK_CONTENTS', args)
        blocks.extend(data.get('results') or [])
        if not data.get('has_more'):
            return blocks
        cursor = data.get('next_cursor')
        if not cursor or cursor in seen:
            raise MonitorError('Private state pagination incomplete')
        seen.add(cursor)

def fetch_events(router):
    # Search all ordinary folders, including archived mail; omit drafts/spam/trash.
    events, token, seen = {}, None, set()
    query = '{from:' + PARTNER + ' to:' + PARTNER + '} -in:drafts'
    while True:
        args = {'user_id': 'me', 'query': query, 'max_results': 100,
                'verbose': False, 'include_payload': False, 'include_spam_trash': False}
        if token:
            args['page_token'] = token
        data = router.call('GMAIL_FETCH_EMAILS', args)
        for message in data.get('messages') or []:
            event = minimal_event(message)
            if event:
                events[event['id']] = event
        token = data.get('nextPageToken')
        if not token:
            return events
        if token in seen:
            raise MonitorError('Mail pagination incomplete')
        seen.add(token)

def run():
    router = Router()
    page = os.environ['NOTION_MONITOR_PAGE_ID']
    status_block = os.environ['NOTION_STATUS_BLOCK_ID']
    metadata = router.call('NOTION_RETRIEVE_PAGE', {'page_id': page})
    if metadata.get('id') != page or metadata.get('public_url') or metadata.get('archived') or metadata.get('in_trash'):
        raise MonitorError('Notion target is not an active private page')
    blocks = list_blocks(router, page)
    end, pending = stopped(blocks)
    checked_at = dt.datetime.now(UTC).isoformat()
    if end:
        router.call('NOTION_UPDATE_BLOCK', {
            'block_id': status_block, 'block_type': 'paragraph',
            'content': 'ASF_MONITOR_STATUS: ENCERRADO em ' + checked_at + '; nenhuma leitura de email.',
        })
        print('Private monitor: completed; email access skipped.')
        return
    known = read_events(blocks)
    current = fetch_events(router)
    new = [e for mid, e in current.items() if mid not in known]
    for start in range(0, len(new), 100):
        children = [{'type': 'paragraph', 'paragraph': {'rich_text': [
            {'text': {'content': EVENT_PREFIX + json.dumps(e, separators=(',', ':'))}}
        ]}} for e in sorted(new[start:start + 100], key=lambda e: e['at'])]
        router.call('NOTION_APPEND_TEXT_BLOCKS', {'block_id': page, 'children': children})
    # Read-after-write: do not report success until private persistence is confirmed.
    persisted = read_events(list_blocks(router, page))
    if not set(current).issubset(persisted):
        raise MonitorError('Private state verification failed')
    state, last_in, last_out = next_step(persisted)
    summary = ('ASF_MONITOR_STATUS: ATIVO; ultima checagem ' + checked_at
               + '; pendencias ' + str(pending) + '; ' + state
               + '\nUltima resposta: ' + (last_in.isoformat() if last_in else 'nao identificada')
               + '\nUltimo envio: ' + (last_out.isoformat() if last_out else 'nao identificado')
               + '\nSem envios automaticos; sem corpos, assuntos ou anexos armazenados.')
    router.call('NOTION_UPDATE_BLOCK', {
        'block_id': status_block, 'block_type': 'paragraph', 'content': summary,
    })
    final = list_blocks(router, page)
    if not any(b.get('id') == status_block and text_of(b) == summary for b in final):
        raise MonitorError('Private status verification failed')
    print('Private monitor OK; new minimal events=' + str(len(new)) + '; pending=' + str(pending))

def self_test():
    sent = {'messageId': 'a1234567890abcde', 'labelIds': ['SENT', 'INBOX'],
            'sender': 'our-test@example.invalid', 'messageTimestamp': '2026-10-08T01:30:48Z',
            'subject': 'DO_NOT_STORE', 'messageText': 'DO_NOT_STORE', 'attachmentList': ['DO_NOT_STORE']}
    incoming = dict(sent, messageId='b1234567890abcde', labelIds=['INBOX'], sender=PARTNER)
    assert minimal_event(dict(sent, labelIds=['DRAFT'])) is None
    assert minimal_event(dict(sent, labelIds=['INBOX'])) is None
    event = minimal_event(sent)
    assert set(event) == {'id', 'direction', 'at'} and 'DO_NOT_STORE' not in json.dumps(event)
    block = {'type': 'paragraph', 'paragraph': {'rich_text': [{'text': {'content': EVENT_PREFIX + json.dumps(event)}}]}}
    assert len(read_events([block, block])) == 1
    status, _, _ = next_step({event['id']: event})
    assert '2026-10-15T01:30:48+00:00' in status
    later = minimal_event(dict(incoming, messageTimestamp='2026-10-08T02:00:00Z'))
    assert next_step({event['id']: event, later['id']: later})[0].startswith('RESPOSTA_RECEBIDA')
    controls = [{'id': i, 'type': 'to_do', 'to_do': {'checked': False}} for i in DONE_IDS | {STOP_ID}]
    assert stopped(controls) == (False, 4)
    for b in controls:
        if b['id'] == STOP_ID:
            b['to_do']['checked'] = True
    assert stopped(controls)[0] is True
    print('PASS: privacy, draft exclusion, duplicate state, seven-day interval and completion controls.')

if __name__ == '__main__':
    try:
        self_test() if '--self-test' in sys.argv else run()
    except (MonitorError, KeyError):
        # Deliberately suppress provider payloads and unexpected data.
        print('::error::Private monitor failed safely. Check connection permissions and private configuration.')
        sys.exit(1)
