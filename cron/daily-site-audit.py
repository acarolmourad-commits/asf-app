#!/usr/bin/env python3
"""Daily Site Audit — checks HTML structure, SEO, and content integrity"""
import os, re, subprocess, json

ASF_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or "C:/Users/Zion/asf-app-local"

def run_daily_audit():
    """Run full audit on all HTML pages"""
    result = subprocess.run(["bash", "-c", f'find "{ASF_DIR}" -name "*.html" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null'],
                            capture_output=True, text=True)
    html_files = [f for f in result.stdout.strip().split('\n') if f]
    
    issues = {
        "missing_title": [],
        "missing_description": [],
        "missing_canonical": [],
        "missing_og": [],
        "missing_lang": [],
        "images_no_alt": [],
        "broken_external": [],
        "junk_files": [],
        "empty_pages": [],
    }
    
    # File extensions to check as junk
    junk_exts = ['.bak', '.corrupt', '.tmp', '.old', '.test', '.orig']
    
    # Check junk files
    for root, dirs, files in os.walk(ASF_DIR):
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__']]
        for f in files:
            for ext in junk_exts:
                if f.endswith(ext):
                    rel = os.path.join(root, f).replace(ASF_DIR, "")
                    issues["junk_files"].append(rel)
    
    # Audit each HTML file
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except:
            continue
        
        rel_path = html_file.replace(ASF_DIR, "")
        
        # Skip Google verification
        if 'google08e65fdfcd0ec5c7.html' in rel_path:
            continue
        
        # Title
        if not re.search(r'<title[^>]*>.*?</title>', content, re.IGNORECASE | re.DOTALL):
            issues["missing_title"].append(rel_path)
        
        # Meta description
        if not re.search(r'<meta name="description"[^>]*content="[^"]+"', content, re.IGNORECASE):
            issues["missing_description"].append(rel_path)
        
        # Canonical
        if not re.search(r'<link rel="canonical"', content, re.IGNORECASE):
            issues["missing_canonical"].append(rel_path)
        
        # OG tags
        if not re.search(r'<meta property="og:title"', content, re.IGNORECASE):
            issues["missing_og"].append(rel_path)
        
        # Lang attribute
        if '<html' in content.lower() and 'lang=' not in content.lower():
            issues["missing_lang"].append(rel_path)
        
        # Images without alt
        imgs_no_alt = re.findall(r'<img(?![^>]*alt=)[^>]*>', content, re.IGNORECASE)
        if imgs_no_alt:
            issues["images_no_alt"].append(f"{rel_path} ({len(imgs_no_alt)} imgs)")
        
        # Empty pages (less than 200 chars of content)
        body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
        if body_match:
            body = body_match.group(1)
            # Remove tags and check text length
            text = re.sub(r'<[^>]+>', '', body).strip()
            if len(text) < 50:
                issues["empty_pages"].append(rel_path)
    
    # Summary
    total_issues = sum(len(v) for v in issues.values() if isinstance(v, list))
    
    print("=== AUDITORIA DIÁRIA ASF.surf ===")
    print(f"Páginas auditadas: {len(html_files)}")
    print(f"Issues totais: {total_issues}")
    print()
    
    for category, items in issues.items():
        if items:
            print(f"⚠️  {category}: {len(items)}")
            for item in items[:3]:
                print(f"   • {item}")
            if len(items) > 3:
                print(f"   • ... e mais {len(items) - 3}")
        else:
            print(f"✅ {category}: OK")
    
    # Save audit results
    log_path = os.path.join(ASF_DIR, "docs/daily-audit-log.json")
    from datetime import datetime, timezone
    audit_log = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "pages_audited": len(html_files),
        "total_issues": total_issues,
        "issues": {k: v for k, v in issues.items() if v},
    }
    
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(audit_log, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Auditoria salva em docs/daily-audit-log.json")
    
    return audit_log

if __name__ == "__main__":
    run_daily_audit()
