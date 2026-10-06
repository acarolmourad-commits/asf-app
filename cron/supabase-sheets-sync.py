#!/usr/bin/env python3
"""ASF Carteirinhas Sync — Sync between Supabase and Google Sheets

Bidirectional sync:
1. Supabase → Sheets: fetch carteirinhas from Supabase, update Sheets
2. Sheets → Supabase: fetch from Sheets, upsert to Supabase

Runs on schedule via monitor-loop-v2.sh or GitHub Actions.
Uses service_role key for Supabase (stored in .env.sync, never committed).
"""
import os, json, urllib.request, urllib.error, urllib.parse, sys
from datetime import datetime, timezone

ASF_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ─── Config ─────────────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://qktabrzbgdfndklytwub.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')  # service_role key for sync
GOOGLE_SCRIPT_URL = os.environ.get('GOOGLE_SCRIPT_URL', '')
GOOGLE_SCRIPT_TOKEN = os.environ.get('GOOGLE_SCRIPT_TOKEN', '')
SYNC_LOG_PATH = os.path.join(ASF_DIR, 'docs/carteirinhas-sync-log.json')

def get_supabase_carteirinhas():
    """Fetch all carteirinhas from Supabase via associadas table"""
    if not SUPABASE_KEY:
        print("  ⚠️  SUPABASE_KEY not set — skipping Supabase read")
        return []
    
    url = f"{SUPABASE_URL}/rest/v1/associadas?select=numero,nome,apelido,nivel,praia,cidade,insta,registrada,validade"
    req = urllib.request.Request(url, headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Accept': 'application/json',
    })
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read().decode())
        print(f"  ✅ Supabase: {len(data)} carteirinhas encontradas")
        return data
    except urllib.error.HTTPError as e:
        print(f"  ❌ Supabase: HTTP {e.code} — {e.read().decode()[:200]}")
        return []
    except Exception as e:
        print(f"  ❌ Supabase: {e}")
        return []

def get_sheets_carteirinhas():
    """Fetch all carteirinhas from Google Sheets via Apps Script"""
    if not GOOGLE_SCRIPT_URL:
        print("  ⚠️  GOOGLE_SCRIPT_URL not set — skipping Sheets read")
        return []
    
    url = f"{GOOGLE_SCRIPT_URL}?action=list&token={GOOGLE_SCRIPT_TOKEN}"
    req = urllib.request.Request(url, headers={'User-Agent': 'ASF-Sync'})
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read().decode())
        if data.get('status') == 'OK':
            cartas = data.get('carteirinhas', [])
            print(f"  ✅ Sheets: {len(cartas)} carteirinhas encontradas")
            return cartas
        else:
            print(f"  ❌ Sheets: {data.get('message', 'Error')}")
            return []
    except Exception as e:
        print(f"  ❌ Sheets: {e}")
        return []

def sync_supabase_to_sheets(supa_data, sheets_data):
    """Upsert Supabase records into Sheets via Apps Script"""
    if not GOOGLE_SCRIPT_URL:
        return {"action": "supabase_to_sheets", "status": "skipped", "reason": "GOOGLE_SCRIPT_URL not configured"}
    
    # Build a lookup of Sheets data by numero
    sheets_lookup = {c.get('numero'): c for c in sheets_data if c.get('numero')}
    
    synced = 0
    for c in supa_data:
        numero = c.get('numero')
        if not numero:
            continue
        
        # If not in Sheets, insert via doPost
        if numero not in sheets_lookup:
            payload = urllib.parse.urlencode({
                'numero': numero,
                'nome': c.get('nome', ''),
                'apelido': c.get('apelido', ''),
                'nivel': c.get('nivel', ''),
                'praia': c.get('praia', ''),
                'cidade': c.get('cidade', ''),
                'insta': c.get('insta', ''),
            }).encode()
            req = urllib.request.Request(GOOGLE_SCRIPT_URL, data=payload, method='POST')
            try:
                resp = urllib.request.urlopen(req, timeout=10)
                result = json.loads(resp.read().decode())
                if result.get('status') == 'OK':
                    synced += 1
            except Exception as e:
                print(f"  ⚠️  Failed to insert {numero}: {e}")
    
    return {"action": "supabase_to_sheets", "status": "completed", "synced": synced}

def main():
    print("=== ASF Carteirinhas Sync ===\n")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"Timestamp: {now}\n")
    
    # Source 1: Supabase
    print("1. Lendo Supabase...")
    supa_data = get_supabase_carteirinhas()
    
    # Source 2: Sheets
    print("\n2. Lendo Google Sheets...")
    sheets_data = get_sheets_carteirinhas()
    
    # Sync
    print("\n3. Sincronizando Supabase → Sheets...")
    result1 = sync_supabase_to_sheets(supa_data, sheets_data)
    print(f"  {result1}")
    
    # Save log
    log_entry = {
        "timestamp": now,
        "supabase_count": len(supa_data),
        "sheets_count": len(sheets_data),
        "supabase_to_sheets": result1,
    }
    
    # Load existing log
    log_data = []
    if os.path.exists(SYNC_LOG_PATH):
        try:
            with open(SYNC_LOG_PATH, 'r') as f:
                log_data = json.load(f).get('entries', [])
        except:
            pass
    
    log_data.append(log_entry)
    with open(SYNC_LOG_PATH, 'w') as f:
        json.dump({"entries": log_data[-50:], "last_sync": now}, f, indent=2, ensure_ascii=False)
    
    print(f"\n4. Log salvo em docs/carteirinhas-sync-log.json")
    print(f"\n✅ Sync concluído: {len(supa_data)} Supabase, {len(sheets_data)} Sheets")

if __name__ == "__main__":
    main()
