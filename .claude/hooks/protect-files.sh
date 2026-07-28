#!/usr/bin/env bash
# PreToolUse(Edit|Write): block edits to secrets and lockfiles. Exit 2 blocks.
# Reads {tool_input:{file_path}} JSON on stdin.
set -euo pipefail

input="$(cat)"
path="$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
[ -z "$path" ] && exit 0

base="$(basename "$path")"
case "$base" in
  .env|.env.*)
    # allow *.env.example templates, block real env files
    case "$base" in
      *.example) exit 0 ;;
      *) echo "BLOCKED: refusing to edit secret file '$base'. Edit it yourself." >&2; exit 2 ;;
    esac
    ;;
  package-lock.json|yarn.lock|pnpm-lock.yaml)
    echo "BLOCKED: don't hand-edit lockfile '$base'. Use the package manager." >&2
    exit 2
    ;;
esac
exit 0
