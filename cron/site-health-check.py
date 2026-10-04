#!/usr/bin/env python3
"""Site Health Check — verifies ASF app is reachable and JS is loaded"""
import urllib.request, re, sys

SITE_URL = "https://acarolmourad-commits.github.io/asf-app/"

try:
    req = urllib.request.Request(SITE_URL, headers={"User-Agent": "ASF-Cron"})
    response = urllib.request.urlopen(req, timeout=20)
    html = response.read().decode('utf-8', errors='ignore')
    
    issues = []
    
    # Check HTTP 200
    if response.status != 200:
        issues.append(f"HTTP {response.status} instead of 200")
    
    # Check essential elements
    checks = [
        ("Title tag", "<title>" in html),
        ("Search input", "searchInput" in html or "search" in html.lower()),
        ("Carteirinha section", "carteirinha" in html.lower()),
        ("app.js script", "app.js" in html),
        ("asf-fixes.js script", "asf-fixes.js" in html),
        ("app-links.json", "app-links.json" in html),
        ("ASF logo", "asf-logo" in html.lower() or "logo" in html.lower())
    ]
    
    for name, passed in checks:
        if not passed:
            issues.append(f"{name} missing")
    
    # Check for critical text
    if "Associação de Surf Feminino" not in html:
        issues.append("ASF branding text missing")
    
    if issues:
        msg = "🚨 ASF Site Health Issues:\n\n"
        for issue in issues:
            msg += f"❌ {issue}\n"
        print(f"ALERT: {msg}")
    else:
        print(f"✅ ASF site healthy — HTTP 200, all checks passed")
        print(f"   Content-Length: {response.headers.get('Content-Length', 'unknown')}")

except urllib.error.HTTPError as e:
    print(f"❌ ALERT: ASF site returned HTTP {e.code}")
    sys.exit(1)
except Exception as e:
    print(f"❌ ALERT: ASF site unreachable: {e}")
    sys.exit(1)
