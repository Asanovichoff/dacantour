#!/usr/bin/env bash
# PostToolUse(Edit|Write): auto-format the edited file(s) with Prettier.
# Receives tool input JSON on stdin; CLAUDE_FILE_PATHS holds the changed paths.
set -euo pipefail

paths="${CLAUDE_FILE_PATHS:-}"
[ -z "$paths" ] && exit 0

for f in $paths; do
  case "$f" in
    *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md)
      if command -v npx >/dev/null 2>&1; then
        npx --no-install prettier --write "$f" >/dev/null 2>&1 || true
      fi
      ;;
  esac
done
exit 0
