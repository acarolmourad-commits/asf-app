#!/usr/bin/env python3
"""GitHub Issues Monitor — checks for new issues, PRs, and responses to ASF repo"""
import json, urllib.request, sys, os
from datetime import datetime, timedelta, timezone

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
REPO = 'acarolmourad-commits/asf-app'

url = f"https://api.github.com/repos/{REPO}/issues?state=open&per_page=20&sort=created&direction=desc"
headers = {"User-Agent": "ASF-Cron", "Accept": "application/vnd.github.v3+json"}
if GITHUB_TOKEN:
    headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

try:
    req = urllib.request.Request(url, headers=headers)
    data = json.loads(urllib.request.urlopen(req, timeout=30).read().decode())
    
    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(hours=24)
    
    new_issues = []
    new_prs = []
    
    for issue in data:
        created_at = issue.get('created_at', '')
        if not created_at:
            continue
        try:
            created_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        except:
            continue
        
        # Check if created in last 24h
        if created_time > yesterday:
            if 'pull_request' in issue:
                new_prs.append({
                    'title': issue['title'],
                    'number': issue['number'],
                    'url': issue['html_url'],
                    'author': issue['user']['login']
                })
            else:
                new_issues.append({
                    'title': issue['title'],
                    'number': issue['number'],
                    'url': issue['html_url'],
                    'author': issue['user']['login']
                })
    
    if new_issues or new_prs:
        msg = "📬 GitHub — New items in ASF repo:\n\n"
        for issue in new_issues[:10]:
            msg += f"🐛 Issue #{issue['number']}: {issue['title'][:60]} (by @{issue['author']})\n"
        for pr in new_prs[:10]:
            msg += f"🔧 PR #{pr['number']}: {pr['title'][:60]} (by @{pr['author']})\n"
        print(f"ALERT: {msg}")
    else:
        open_count = len([i for i in data if 'pull_request' not in i])
        pr_count = len([i for i in data if 'pull_request' in i])
        print(f"✅ No new issues/PRs in 24h (open: {open_count} issues, {pr_count} PRs)")

except urllib.error.HTTPError as e:
    print(f"⚠️ GitHub API returned {e.code}")
    if e.code == 403:
        print("  Recommendation: Add GITHUB_TOKEN to cronjob environment")
except Exception as e:
    print(f"Error: {e}")
