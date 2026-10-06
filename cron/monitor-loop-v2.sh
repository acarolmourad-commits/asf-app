#!/usr/bin/env bash
# ASF Monitoring Loop with GitHub token configuration
# Runs all monitors on schedule, with proper env vars

export GH_TOKEN="${GH_TOKEN:-}"
export GITHUB_TOKEN="${GITHUB_TOKEN:-}"

ASF_DIR="C:/Users/Zion/asf-app-local"
CRON_DIR="$ASF_DIR/cron"
PYTHON="C:/Users/Zion/AppData/Local/hermes/hermes-agent/venv/Scripts/python"

# Load token from secrets if available
if [ -z "$GH_TOKEN" ]; then
    # Try to read from local secrets file (never commit this)
    if [ -f "$ASF_DIR/.github-token" ]; then
        export GH_TOKEN=$(cat "$ASF_DIR/.github-token")
        export GITHUB_TOKEN="$GH_TOKEN"
        echo "[$(date -u)] GH_TOKEN loaded from secrets file"
    fi
fi

echo "[$(date -u)] ASF Monitor Loop started"
echo "  GH_TOKEN: ${GH_TOKEN:+CONFIGURED}${GH_TOKEN:-NOT_SET}"
echo "  Rate limit: $([ -n "$GH_TOKEN" ] && echo '5000 req/h' || echo '60 req/h (limitada)')"

while true; do
    HOUR=$(date -u +%H)
    MIN=$(date -u +%M)
    MINUTE_OF_DAY=$((HOUR * 60 + MIN))
    
    # Site Health Check: every 4 hours
    if [ $((MINUTE_OF_DAY % 240)) -lt 5 ] && [ "$MIN" -lt 5 ]; then
        echo "[$(date -u)] Site Health Check:"
        $PYTHON "$CRON_DIR/site-health-check.py" 2>&1
    fi
    
    # Search Bar Check: daily at 8:00 UTC
    if [ "$HOUR" -eq 8 ] && [ "$MIN" -eq 0 ]; then
        echo "[$(date -u)] Search Bar Check:"
        $PYTHON "$CRON_DIR/search-bar-check.py" 2>&1
    fi
    
    # GitHub Workflows Monitor: daily at 6:00 UTC
    if [ "$HOUR" -eq 6 ] && [ "$MIN" -eq 0 ]; then
        echo "[$(date -u)] GitHub Workflows Monitor:"
        $PYTHON "$CRON_DIR/github-workflows-monitor.py" 2>&1
    fi
    
    # GitHub Issues Monitor: daily at 7:00 UTC
    if [ "$HOUR" -eq 7 ] && [ "$MIN" -eq 0 ]; then
        echo "[$(date -u)] GitHub Issues Monitor:"
        $PYTHON "$CRON_DIR/github-issues-monitor.py" 2>&1
    fi
    
    # GitHub Commits Monitor: every hour at :30
    if [ "$MIN" -eq 30 ]; then
        echo "[$(date -u)] GitHub Commits Monitor:"
        $PYTHON "$CRON_DIR/github-commits-monitor.py" 2>&1
    fi
    
    # Email Campaign Monitor: daily at 10:00 UTC
    if [ "$HOUR" -eq 10 ] && [ "$MIN" -eq 0 ]; then
        echo "[$(date -u)] Email Campaign Monitor:"
        $PYTHON "$CRON_DIR/email-campaign-monitor.py" 2>&1
    fi
    
# Daily Site Audit: daily at 11:00 UTC
    if [ "$HOUR" -eq 11 ] && [ "$MIN" -eq 0 ]; then
        echo "[$(date -u)] Daily Site Audit:"
        $PYTHON "$CRON_DIR/daily-site-audit.py" 2>&1
    fi
    
    # Supabase-Sheets Sync: daily at 3:00 UTC
    if [ "$HOUR" -eq 3 ] && [ "$MIN" -eq 0 ]; then
        echo "[$(date -u)] Supabase-Sheets Sync:"
        if [ -f "$ASF_DIR/.env.sync" ]; then
            export $(grep -v '^#' "$ASF_DIR/.env.sync" | xargs) 2>/dev/null
        fi
        $PYTHON "$CRON_DIR/supabase-sheets-sync.py" 2>&1
    fi
    
    sleep 300  # Check every 5 minutes
done
