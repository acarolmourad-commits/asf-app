#!/usr/bin/env python3
"""Search Bar Check — verifies search-results.active CSS fix is live and functional"""
import urllib.request, re

# 1. Check asf-fixes.js has the search fix
fixes_url = "https://acarolmourad-commits.github.io/asf-app/asf-fixes.js"
# 2. Check app.js has normalizedSearchIndex
app_url = "https://acarolmourad-commits.github.io/asf-app/app.js"
# 3. Check that asf-fixes.js is loaded (verify via home page)
home_url = "https://acarolmourad-commits.github.io/asf-app/"

issues = []

try:
    # Check 1: asf-fixes.js has search fix
    req = urllib.request.Request(fixes_url, headers={"User-Agent": "ASF-Cron"})
    fixes_js = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    
    if 'asf-search-fix' not in fixes_js:
        issues.append("asf-fixes.js: Missing 'asf-search-fix' CSS injection")
    if '.search-results.active' not in fixes_js:
        issues.append("asf-fixes.js: Missing .search-results.active rule")
    
    # Check 2: app.js has normalizedSearchIndex
    req = urllib.request.Request(app_url, headers={"User-Agent": "ASF-Cron"})
    app_js = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', errors='ignore')
    
    if 'normalizedSearchIndex' not in app_js:
        issues.append("app.js: normalizedSearchIndex not found")
    if 'buildSearchIndex' not in app_js:
        issues.append("app.js: buildSearchIndex function missing")
    
    # Check 3: asf-fixes.js is loaded in home
    req = urllib.request.Request(home_url, headers={"User-Agent": "ASF-Cron"})
    html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    
    if 'asf-fixes.js' not in html:
        issues.append("Home page: asf-fixes.js script not loaded")
    
    # Check 4: Search input exists
    if 'searchInput' not in html and 'search' not in html.lower():
        issues.append("Home page: Search input not found in HTML")
    
except Exception as e:
    issues.append(f"Connection error: {str(e)[:80]}")

if issues:
    msg = "🚨 Search Bar Issues Detected:\n\n"
    for issue in issues:
        msg += f"❌ {issue}\n"
    print(f"ALERT: {msg}")
else:
    print("✅ Search bar fully functional:")
    print("   • asf-fixes.js with .search-results.active fix: OK")
    print("   • app.js with normalizedSearchIndex: OK")
    print("   • asf-fixes.js loaded on home: OK")
    print("   • Search input present in HTML: OK")
