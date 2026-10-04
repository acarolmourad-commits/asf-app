#!/usr/bin/env python3
"""GitHub Workflows Monitor — checks for failed workflow runs"""
import json, urllib.request, sys, os
from datetime import datetime, timedelta

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
REPO = 'acarolmourad-commits/asf-app'

url = f"https://api.github.com/repos/{REPO}/actions/runs?per_page=10"
headers = {"User-Agent": "ASF-Cron", "Accept": "application/vnd.github.v3+json"}
if GITHUB_TOKEN:
    headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

try:
    req = urllib.request.Request(url, headers=headers)
    data = json.loads(urllib.request.urlopen(req, timeout=30).read().decode())
    
    failures = []
    for run in data.get('workflow_runs', []):
        if run.get('conclusion') == 'failure':
            failures.append({
                'name': run.get('name', 'unknown'),
                'workflow': run.get('path', '').split('/')[-1] if run.get('path') else 'unknown',
                'time': run.get('created_at', 'unknown'),
                'url': run.get('html_url', '')
            })
    
    if failures:
        msg = "🚨 GitHub Actions Failures Detected:\n\n"
        for f in failures[:5]:
            msg += f"❌ {f['name']} ({f['workflow']}) - {f['time']}\n"
        print(f"ALERT: {msg}")
    else:
        print("✅ All recent GitHub workflows passing")

except urllib.error.HTTPError as e:
    print(f"⚠️ GitHub API returned {e.code} — may need auth token")
    if e.code == 403:
        print("  Recommendation: Add GITHUB_TOKEN to cronjob environment")
except Exception as e:
    print(f"Error: {e}")
