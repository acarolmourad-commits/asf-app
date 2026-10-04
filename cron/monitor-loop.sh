#!/usr/bin/env bash
# ASF Monitoring Loop — runs all monitors on schedule
# Created: 2026-10-02
# Runs in background, checking every 5 minutes

ASF_DIR="C:/Users/Zion/asf-app-local"
CRON_DIR="$ASF_DIR/cron"
PYTHON="C:/Users/Zion/AppData/Local/hermes/hermes-agent/venv/Scripts/python"

# Load GitHub token for API access (avoids rate-limit)
if [ -f "$ASF_DIR/.env.cron" ]; then
  source "$ASF_DIR/.env.cron"
fi
if [ -z "$GH_TOKEN" ] && [ -f "$ASF_DIR/.github-token" ]; then
  export GH_TOKEN=$(cat "$ASF_DIR/.github-token")
  export GITHUB_TOKEN="$GH_TOKEN"
fi

while true; do
    HOUR=$(date -u +%H)
    MIN=$(date -u +%M)
    MINUTE_OF_DAY=$((HOUR * 60 + MIN))
    
    # Site Health Check: every 4 hours (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)
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
    
    sleep 300  # Check every 5 minutes
done
