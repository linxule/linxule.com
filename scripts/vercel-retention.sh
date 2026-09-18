#!/bin/zsh
# Weekly retention: current production plus one rollback per project.
# The helper refuses extra READY previews and protects aliased deployments.
# Provider expiry has a ten-deployment floor and protected-release exceptions.
# Deleted deployments remain metered during the 30-day recovery hold.
# Install this tracked source at ~/.local/bin/vercel-retention.sh.
export PATH="$HOME/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
SITE="$HOME/Documents/Apps/personal-website/xule-site"
LOG="$HOME/.local/log/vercel-retention.log"
mkdir -p "$(dirname "$LOG")" || exit 1
retention_failed=0
{
  echo "=== $(date '+%Y-%m-%d %H:%M:%S')"
  cd "$SITE" || { echo "site checkout missing"; exit 1; }
  for project in research-memex linxule-com; do
    echo "--- $project"
    if bun scripts/deployment-retention.mjs --project "$project" --auto --apply 2>&1; then
      echo "--- $project: success"
    else
      retention_exit=$?
      echo "--- $project: failed (exit $retention_exit)"
      retention_failed=1
    fi
  done
} >> "$LOG" 2>&1 || exit 1
exit "$retention_failed"
