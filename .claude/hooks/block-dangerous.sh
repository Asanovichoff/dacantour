#!/usr/bin/env bash
# PreToolUse(Bash): block destructive commands. Exit 2 blocks the tool call and
# shows stderr to Claude. Reads {tool_input:{command}} JSON on stdin.
set -euo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p')"

deny_patterns=(
  'rm[[:space:]]+-rf[[:space:]]+/'
  'rm[[:space:]]+-rf[[:space:]]+\*'
  'rm[[:space:]]+-rf[[:space:]]+~'
  ':\(\)\{'                    # fork bomb
  'git[[:space:]]+push[[:space:]]+--force'
  'DROP[[:space:]]+DATABASE'
  '>[[:space:]]*\.env$'
)

for p in "${deny_patterns[@]}"; do
  if printf '%s' "$cmd" | grep -Eq "$p"; then
    echo "BLOCKED by .claude/hooks/block-dangerous.sh: command matches '$p'." >&2
    echo "If this is intentional, run it yourself in a terminal." >&2
    exit 2
  fi
done
exit 0
