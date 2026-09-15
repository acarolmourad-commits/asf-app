#!/usr/bin/env python3
"""One-time fix: repair broken <style> blocks in index.html.

Bug: a premature </style> and an unclosed @media block left ~90 lines
of raw CSS rendering as visible text at the top of the page.
Idempotent: exits cleanly with no changes if already fixed.
"""
import sys

PATH = "index.html"

FIX_A_OLD = "        }\n    </style>\n    /* ─── Tip of the Day ─── */"
FIX_A_NEW = "        }\n    /* ─── Tip of the Day ─── */"

FIX_B_OLD = (
    "    @media(max-width:480px){\n"
    "        .dica-refresh-btn.dica-refresh-lg{padding:5px 10px;font-size:11px;}\n"
    "    </style>\n"
    "       /* Optimized daily tip styles */"
)
FIX_B_NEW = (
    "    @media(max-width:480px){\n"
    "        .dica-refresh-btn.dica-refresh-lg{padding:5px 10px;font-size:11px;}\n"
    "    }\n"
    "       /* Optimized daily tip styles */"
)

s = open(PATH, encoding="utf-8").read()

a_found = s.count(FIX_A_OLD)
b_found = s.count(FIX_B_OLD)
print(f"Pattern A occurrences: {a_found}")
print(f"Pattern B occurrences: {b_found}")

if a_found == 0 and b_found == 0:
    print("✅ Already fixed - nothing to do")
    sys.exit(0)

if a_found > 1 or b_found > 1:
    print("❌ ERROR: ambiguous patterns, aborting")
    sys.exit(1)

if a_found:
    s = s.replace(FIX_A_OLD, FIX_A_NEW)
if b_found:
    s = s.replace(FIX_B_OLD, FIX_B_NEW)

opens = s.count("<style")
closes = s.count("</style>")
print(f"After fix: <style>={opens} </style>={closes}")
if opens != closes:
    print("❌ ERROR: style tags still unbalanced, aborting")
    sys.exit(1)

open(PATH, "w", encoding="utf-8").write(s)
print("✅ index.html fixed and saved")
