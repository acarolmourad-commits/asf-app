#!/usr/bin/env python3
"""ASF general inbox monitor: all Gmail labels except SPAM/TRASH. Minimal metadata only (id, direction, timestamp, category); never sends mail or follow-ups. Explicit Composio user/account/toolkit-version routing (PR #49 pattern). Private Notion state deduplicates. Logs contain no subjects, bodies, addresses or attachments."""
import datetime as dt, json, os, re, sys
from email.utils import parseaddr
import requests
try:
    UTC = dt.UTC
except AttributeError:
    UTC = dt.timezone.utc
P_ALL='ASF_EMAIL:'; P_PARTNER='ASF_PARTNER_EVENT:'; P_REPLY='ASF_REPLY_NEEDED:'; P_FOLLOW='ASF_FOLLOWUP_DUE:'
PREFIXES=(P_ALL,P_PARTNER,P_REPLY,P_FOLLOW)
SELF_ADDRESSES={'asf.surffeminino@gmail.com'}; SELF_DOMAINS={'asf.surf'}
PARTNERS={'contato@villablumaresias.com.br':'Villa Blu','cristiano@surflandbrasil.com.br':'Surfland Brasil','sac@hurley.com.br':'Hurley Brasil','surfsidemaresias@gmail.com':'Surfside','adrian.vcch@gmail.com':'Prosurfingtools','coletivo@todasparaomar.org':'TPM Todas Para o Mar','ecosurf@ecosurf.org.br':'Ecosurf','contato@ecosurf.org.br':'Ecosurf','joao@ecosurf.org.br':'Ecosurf'}
PARTNER_DOMAINS={}
for _a,_n in PARTNERS.items(): PARTNER_DOMAINS.setdefault(_a.rsplit('@',1)[-1],_n)
DONE={'3fbabe37-0d44-81a4-a9ef-c07e4a6f4fc4','3fbabe37-0d44-8155-84dc-c274039f57c8','3fbabe37-0d44-8142-9272-ee3ace51f33e','3fbabe37-0d44-813c-9a71-d3e36103668a'}
STOP='3fbabe37-0d44-8185-b720-e38b6fd0869b'
ALLOWED={'GMAIL_FETCH_EMAILS','NOTION_RETRIEVE_PAGE','NOTION_FETCH_BLOCK_CONTENTS','NOTION_APPEND_TEXT_BLOCKS','NOTION_UPDATE_BLOCK'}
SYSTEM={'INBOX','SENT','DRAFT','IMPORTANT','STARRED','UNREAD','CHAT','CATEGORY_FORUMS','CATEGORY_UPDATES','CATEGORY_PERSONAL','CATEGORY_PROMOTIONS','CATEGORY_SOCIAL','YELLOW_STAR','SPAM','TRASH'}
class MonitorError(Exception): pass
def text(b):
    v=b.get(b.get('type',''),{}); return ''.join(r.get('plain_text',r.get('text',{}).get('content','')) for r in v.get('rich_text',[]))
def date(v):
    try: return dt.datetime.fromisoformat(v.replace('Z','+00:00')).astimezone(UTC)
    except (ValueError,AttributeError,TypeError): raise MonitorError('Metadata timestamp unavailable') from None
def sdomain(v):
    try: return parseaddr(v or '')[1].lower().rsplit('@',1)[-1]
    except (ValueError,IndexError): return ''
def ident(m):
    v=m.get('messageId') or m.get('id')
    if not isinstance(v,str) or not re.fullmatch(r'[0-9a-fA-F]{8,32}',v): raise MonitorError('Message identifier unavailable')
    return v
def category(labels):
    for lab,cat in (('CATEGORY_PROMOTIONS','promocao'),('CATEGORY_SOCIAL','social'),('CATEGORY_UPDATES','atualizacao'),('CATEGORY_FORUMS','forum'),('YELLOW_STAR','destaque')):
        if lab in labels: return cat
    return 'etiqueta_usuario' if [x for x in labels if x not in SYSTEM] else 'principal'
def event(m):
    labels=m.get('labelIds') or []
    if 'DRAFT' in labels or 'SPAM' in labels or 'TRASH' in labels: return None
    at=date(m.get('messageTimestamp')); sender=parseaddr(m.get('sender') or '')[1].lower()
    if 'SENT' in labels or sender in SELF_ADDRESSES or sdomain(sender) in SELF_DOMAINS:
        return {'id':ident(m),'direction':'sent','at':at.isoformat(),'category':'enviado'}
    return {'id':ident(m),'direction':'received','at':at.isoformat(),'category':category(labels)}
def bucket(prefix,value):
    e=json.loads(value[len(prefix):])
    if prefix==P_ALL:
        if set(e)!={'id','direction','at','category'} or e['direction'] not in ('received','sent'): raise ValueError()
        date(e['at']); return e['id'],e
    if prefix==P_PARTNER:
        if set(e)!={'partner','last_in','last_out','state'}: raise ValueError()
        date(e['last_in']); date(e['last_out']); return e['partner'],e
    if prefix==P_REPLY:
        if set(e)!={'id','at','partner'}: raise ValueError()
        date(e['at']); return e['id'],e
    if set(e)!={'partner','due7','last_out'}: raise ValueError()
    date(e['due7']); date(e['last_out']); return e['partner'],e
def events_from(blocks):
    out={p:{} for p in PREFIXES}
    for b in blocks:
        v=text(b)
        for p in PREFIXES:
            if v.startswith(p):
                try: k,e=bucket(p,v); out[p][k]=e
                except (ValueError,KeyError,TypeError): raise MonitorError('Private state invalid') from None
                break
    return out[P_ALL],out[P_PARTNER],out[P_REPLY],out[P_FOLLOW]
def completion(blocks):
    todos={b['id']:b.get('to_do',{}) for b in blocks if b.get('type')=='to_do'}
    if not DONE.issubset(todos) or STOP not in todos: raise MonitorError('Private completion controls missing')
    rem=sum(not todos[i].get('checked',False) for i in DONE); return bool(todos[STOP].get('checked')) or rem==0, rem
def analyze(events):
    vals=list(events.values()); return [date(e['at']) for e in vals if e['direction']=='received'],[date(e['at']) for e in vals if e['direction']=='sent']
def needs_reply(events):
    inc,out=analyze(events); return bool(inc) and (not out or max(inc)>max(out))
def followup_due(events,now=None):
    inc,out=analyze(events)
    if inc and (not out or max(inc)>max(out)): return False
    return bool(out) and (now or dt.datetime.now(UTC))>=max(out)+dt.timedelta(days=7)
def partner_key(sender):
    addr=parseaddr(sender or '')[1].lower()
    return PARTNERS.get(addr) or PARTNER_DOMAINS.get(sdomain(addr))
def _missing_names(names):
    return [name for name in names if not os.environ.get(name)]
class Router:
    def __init__(self, require_gmail=False):
        self.key=os.environ.get('COMPOSIO_API_KEY'); self.user=os.environ.get('COMPOSIO_USER_ID')
        self.accounts={n:os.environ.get('COMPOSIO_'+n+'_CONNECTED_ACCOUNT_ID') for n in ('NOTION','GMAIL')}
        self.versions={n:os.environ.get('COMPOSIO_'+n+'_TOOL_VERSION') for n in ('NOTION','GMAIL')}
        if not self.key or not self.user: raise MonitorError('Missing explicit routing secret(s): COMPOSIO_API_KEY, COMPOSIO_USER_ID (values not logged)')
        notion_missing=_missing_names(('COMPOSIO_NOTION_CONNECTED_ACCOUNT_ID','COMPOSIO_NOTION_TOOL_VERSION'))
        if notion_missing: raise MonitorError('Missing explicit Notion routing secret(s): '+', '.join(notion_missing)+' (values not logged)')
        if require_gmail:
            gmail_missing=_missing_names(('COMPOSIO_GMAIL_CONNECTED_ACCOUNT_ID','COMPOSIO_GMAIL_TOOL_VERSION'))
            if gmail_missing: raise MonitorError('Missing explicit Gmail routing secret(s): '+', '.join(gmail_missing)+' (values not logged)')
    def call(self,slug,args):
        if slug not in ALLOWED: raise MonitorError('Action not permitted')
        tk=slug.split('_',1)[0]
        if not self.accounts.get(tk) or not self.versions.get(tk): raise MonitorError('Explicit account and version configuration unavailable for toolkit')
        try:
            r=requests.post('https://backend.composio.dev/api/v3/tools/execute/'+slug,headers={'x-api-key':self.key,'Content-Type':'application/json'},json={'user_id':self.user,'connected_account_id':self.accounts[tk],'version':self.versions[tk],'arguments':args},timeout=90)
            if r.status_code!=200: raise MonitorError('Router HTTP '+str(r.status_code)+' for '+slug)
            res=r.json()
            if res.get('successful') is not True or res.get('error'): raise MonitorError('Router action failed for '+slug)
            return res.get('data') or {}
        except requests.RequestException: raise MonitorError('Router network failure for '+slug) from None
        except ValueError: raise MonitorError('Router response invalid for '+slug) from None
def blocks_from(router,page):
    result,cursor,seen=[],None,set()
    while True:
        args={'block_id':page,'page_size':100}
        if cursor: args['start_cursor']=cursor
        data=router.call('NOTION_FETCH_BLOCK_CONTENTS',args); result.extend(data.get('results') or [])
        if not data.get('has_more'): return result
        cursor=data.get('next_cursor')
        if not cursor or cursor in seen: raise MonitorError('Private pagination incomplete')
        seen.add(cursor)
def blk(prefix,obj): return {'type':'paragraph','paragraph':{'rich_text':[{'text':{'content':prefix+json.dumps(obj,separators=(',',':'))}}]}}
def append_blocks(router,page,children):
    for i in range(0,len(children),100): router.call('NOTION_APPEND_TEXT_BLOCKS',{'block_id':page,'children':children[i:i+100]})
def mail_from(router):
    result,senders,token,seen={}, {},None,set()
    while True:
        args={'user_id':'me','query':'after:2019/08/01 -in:spam -in:trash','max_results':100,'verbose':False,'include_payload':False,'include_spam_trash':False}
        if token: args['page_token']=token
        data=router.call('GMAIL_FETCH_EMAILS',args)
        for m in data.get('messages') or []:
            e=event(m)
            if e: result[e['id']]=e; senders[e['id']]=parseaddr(m.get('sender') or '')[1].lower()
        token=data.get('nextPageToken')
        if not token: return result,senders
        if token in seen: raise MonitorError('Mail pagination incomplete')
        seen.add(token)
def run():
    preflight='--preflight' in sys.argv
    router=Router(require_gmail=not preflight); page=os.environ['NOTION_MONITOR_PAGE_ID']; status_id=os.environ['NOTION_STATUS_BLOCK_ID']
    meta=router.call('NOTION_RETRIEVE_PAGE',{'page_id':page})
    if meta.get('id')!=page or meta.get('public_url') or meta.get('archived') or meta.get('in_trash'): raise MonitorError('Notion target is not an active private page')
    blocks=blocks_from(router,page); known_all,known_partners,known_replies,known_follow=events_from(blocks); end,pending=completion(blocks); checked=dt.datetime.now(UTC).isoformat()
    if preflight:
        if not any(b.get('id')==status_id for b in blocks): raise MonitorError('Private status block unavailable')
        print('Private Notion read-only preflight OK; mail and writes skipped.'); return
    if end:
        router.call('NOTION_UPDATE_BLOCK',{'block_id':status_id,'block_type':'paragraph','content':'ASF_MONITOR_STATUS: ENCERRADO em '+checked+'; nenhuma leitura de email.'}); print('Private monitor: completed; mail access skipped.'); return
    current,senders=mail_from(router); new_all=sorted([e for mid,e in current.items() if mid not in known_all],key=lambda x:x['at'])
    children=[blk(P_ALL,e) for e in new_all]; derived=[]; summaries={}; now=dt.datetime.now(UTC)
    for name in sorted(set(PARTNERS.values())):
        pevents={mid:e for mid,e in current.items() if partner_key(senders.get(mid,''))==name}
        if not pevents: continue
        inc,out=analyze(pevents); last_in=max(inc) if inc else None; last_out=max(out) if out else None
        state='RESPOSTA_PENDENTE' if needs_reply(pevents) else ('FOLLOWUP_7D_REVISAO_HUMANA' if followup_due(pevents,now) else ('RESPOSTA_RECEBIDA' if last_in and (not last_out or last_in>last_out) else ('AGUARDANDO_RESPOSTA' if last_out else 'SEM_EVENTOS')))
        summary={'partner':name,'last_in':last_in.isoformat() if last_in else '1970-01-01T00:00:00+00:00','last_out':last_out.isoformat() if last_out else '1970-01-01T00:00:00+00:00','state':state}; summaries[name]=summary
        if known_partners.get(name)!=summary: derived.append(blk(P_PARTNER,summary))
        if needs_reply(pevents):
            latest=max((e for e in pevents.values() if e['direction']=='received'),key=lambda x:x['at'])
            if latest['id'] not in known_replies: derived.append(blk(P_REPLY,{'id':latest['id'],'at':latest['at'],'partner':name}))
        if followup_due(pevents,now):
            lo=max((e for e in pevents.values() if e['direction']=='sent'),key=lambda x:x['at']); due=(date(lo['at'])+dt.timedelta(days=7)).isoformat()
            if known_follow.get(name,{}).get('due7')!=due: derived.append(blk(P_FOLLOW,{'partner':name,'due7':due,'last_out':lo['at']}))
    append_blocks(router,page,children+derived)
    persisted=events_from(blocks_from(router,page))
    if not set(current).issubset(persisted[0]) or not set(summaries).issubset(persisted[1]): raise MonitorError('Private persistence verification failed')
    inc,out=analyze(current); summary=('ASF_MONITOR_STATUS: ATIVO; ultima checagem '+checked+'; pendencias '+str(pending)+'; novos eventos minimos='+str(len(new_all))+'; ultima recebida='+(max(inc).isoformat() if inc else 'nenhuma')+'; ultima enviada='+(max(out).isoformat() if out else 'nenhuma')+'\nSem envios automaticos; sem corpos, assuntos, enderecos ou anexos armazenados.')
    router.call('NOTION_UPDATE_BLOCK',{'block_id':status_id,'block_type':'paragraph','content':summary})
    if not any(b.get('id')==status_id and text(b)==summary for b in blocks_from(router,page)): raise MonitorError('Private status verification failed')
    print('Private general monitor OK; new minimal events='+str(len(new_all))+'; pending='+str(pending))
def self_test():
    sent={'messageId':'a1234567890abcde','labelIds':['SENT','INBOX'],'sender':'asf.surffeminino@gmail.com','messageTimestamp':'2026-10-08T03:30:48Z','subject':'DO_NOT_STORE','messageText':'DO_NOT_STORE','attachmentList':['DO_NOT_STORE']}
    assert event(dict(sent,labelIds=['DRAFT'])) is None and event(dict(sent,labelIds=['SPAM'])) is None and event(dict(sent,labelIds=['TRASH'])) is None
    e=event(sent); assert set(e)=={'id','direction','at','category'} and 'DO_NOT_STORE' not in json.dumps(e)
    try: event(dict(sent,messageId='a'*33)); raise AssertionError('long id accepted')
    except MonitorError: pass
    b={'type':'paragraph','paragraph':{'rich_text':[{'text':{'content':P_ALL+json.dumps(e)}}]}}; assert len(events_from([b,b])[0])==1
    reply=event(dict(sent,messageId='b1234567890abcde',labelIds=['INBOX'],sender='cristiano@surflandbrasil.com.br',messageTimestamp='2026-10-08T02:00:00Z'))
    assert needs_reply({e['id']:e,reply['id']:reply}) is False and needs_reply({reply['id']:reply}) is True and followup_due({e['id']:e},date('2026-10-20T00:00:00Z')) is True
    assert partner_key('cristiano@surflandbrasil.com.br')=='Surfland Brasil' and partner_key('x@villablumaresias.com.br')=='Villa Blu'
    controls=[{'id':i,'type':'to_do','to_do':{'checked':False}} for i in DONE|{STOP}]; assert completion(controls)==(False,4)
    for c in controls:
        if c['id']==STOP: c['to_do']['checked']=True
    assert completion(controls)[0]
    import os as _os
    _saved=dict(_os.environ)
    try:
        for _k in list(_os.environ):
            if _k.startswith('COMPOSIO_'): del _os.environ[_k]
        try: Router(require_gmail=False); raise AssertionError('preflight router should fail closed')
        except MonitorError as _e: assert 'COMPOSIO_API_KEY' in str(_e)
        _os.environ.update({'COMPOSIO_API_KEY':'synthetic','COMPOSIO_USER_ID':'synthetic'})
        try: Router(require_gmail=False); raise AssertionError('notion routing should fail closed')
        except MonitorError as _e: assert 'COMPOSIO_NOTION_CONNECTED_ACCOUNT_ID' in str(_e)
        _os.environ.update({'COMPOSIO_NOTION_CONNECTED_ACCOUNT_ID':'synthetic','COMPOSIO_NOTION_TOOL_VERSION':'synthetic'})
        Router(require_gmail=False)
        try: Router(require_gmail=True); raise AssertionError('gmail routing should fail closed')
        except MonitorError as _e: assert 'COMPOSIO_GMAIL_CONNECTED_ACCOUNT_ID' in str(_e)
    finally:
        _os.environ.clear(); _os.environ.update(_saved)
    print('PASS: privacy, spam/trash/draft exclusion, id length, dedupe, reply/followup rules, partner seeds, completion controls and staged explicit routing (Notion preflight, Gmail full).')
if __name__=='__main__':
    try: self_test() if '--self-test' in sys.argv else run()
    except (MonitorError,KeyError): print('::error::Private general monitor failed safely; provider payload suppressed.'); sys.exit(1)
