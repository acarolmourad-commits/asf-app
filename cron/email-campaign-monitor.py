#!/usr/bin/env python3
"""Email Campaign Monitor — tracks emails sent today and response rates"""
import json, os

ASF_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def check_email_campaign():
    today = os.popen('date -u +"%Y-%m-%d"').read().strip()
    
    # Load brand emails data
    brand_path = os.path.join(ASF_DIR, "docs/brand-emails.json")
    if not os.path.exists(brand_path):
        print("❌ brand-emails.json not found")
        return
    
    with open(brand_path, 'r') as f:
        data = json.load(f)
    
    # Load sent log
    log_path = os.path.join(ASF_DIR, "docs/email-sent-log.json")
    sent_log = {"date": today, "emails": [], "total_sent": 0}
    if os.path.exists(log_path):
        with open(log_path, 'r') as f:
            sent_log = json.load(f)
    
    # Check if log is from today
    if sent_log.get('date') != today:
        print(f"⚠️  Sent log is from {sent_log.get('date')}, not today ({today})")
        print("  → Reset log for new day")
        sent_log = {
            "date": today,
            "emails": [],
            "total_sent": 0,
            "total_opened": 0,
            "total_replied": 0,
            "errors": []
        }
    
    # Count statuses
    brands = data.get('brand_emails', [])
    pending = sum(1 for b in brands if b.get('sent_status') == 'pending')
    sent = sum(1 for b in brands if b.get('sent_status') == 'sent')
    responded = sum(1 for b in brands if b.get('sent_status') == 'responded')
    declined = sum(1 for b in brands if b.get('sent_status') == 'declined')
    
    print(f"=== Email Campaign Status — {today} ===\n")
    print(f"  Total brands: {len(brands)}")
    print(f"  ✅ Sent today: {sent}")
    print(f"  ⏳ Pending: {pending}")
    print(f"  📥 Responded: {responded}")
    print(f"  ❌ Declined: {declined}")
    print(f"  📊 Reply rate: {responded}/{sent if sent > 0 else 1} ({int(responded/max(sent,1)*100)}%)")
    
    if sent_log.get('total_sent', 0) > 0:
        print(f"\n  Sent log details:")
        print(f"    • Sent: {sent_log.get('total_sent', 0)}")
        print(f"    • Opened: {sent_log.get('total_opened', 0)}")
        print(f"    • Replied: {sent_log.get('total_replied', 0)}")
    
    # Check if any action needed
    if pending > 0:
        print(f"\n  📝 Action needed: {pending} emails pending")
    
    if responded > 0:
        print(f"\n  🚀 Follow-up needed: {responded} brands responded")
    
    if declined > 0:
        print(f"\n  ⚠️  {declined} brands declined")
    
    # Save updated log
    with open(log_path, 'w') as f:
        json.dump(sent_log, f, indent=2, ensure_ascii=False)
    
    print(f"\n  ✅ Status updated in email-sent-log.json")

if __name__ == "__main__":
    check_email_campaign()
