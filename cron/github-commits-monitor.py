#!/usr/bin/env python3
"""GitHub Commits Monitor — tracks new commits and pushes to ASF repo"""
import json, urllib.request, sys, os
from datetime import datetime, timedelta, timezone

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
REPO = 'acarolmourad-commits/asf-app'

url = f"https://api.github.com/repos/{REPO}/commits?per_page=10"
headers = {"User-Agent": "ASF-Cron", "Accept": "application/vnd.github.v3+json"}
if GITHUB_TOKEN:
    headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

try:
    req = urllib.request.Request(url, headers=headers)
    data = json.loads(urllib.request.urlopen(req, timeout=30).read().decode())
    
    now = datetime.now(timezone.utc)
    one_hour_ago = now - timedelta(hours=1)
    
    recent_commits = []
    for commit in data:
        try:
            commit_time = datetime.fromisoformat(
                commit['commit']['committer']['date'].replace('Z', '+00:00')
            )
        except:
            continue
        
        if commit_time > one_hour_ago:
            recent_commits.append({
                'message': commit['commit']['message'].split('\n')[0][:80],
                'author': commit['commit']['committer']['name'],
                'sha': commit['sha'][:8],
                'time': commit['commit']['committer']['date']
            })
    
    if recent_commits:
        msg = "📝 ASF App — New commits in last hour:\n\n"
        for c in recent_commits:
            msg += f"• {c['sha']}: {c['message']}\n  by {c['author']}\n"
        print(f"ALERT: {msg}")
    else:
        if data:
            latest = data[0]
            print(f"✅ No commits in last hour. Latest: {latest['sha'][:8]} - {latest['commit']['message'].split(chr(10))[0][:60]}")
        else:
            print("⚠️ No commits data returned")

except urllib.error.HTTPError as e:
    print(f"⚠️ GitHub API returned {e.code}")
except Exception as e:
    print(f"Error: {e}")
