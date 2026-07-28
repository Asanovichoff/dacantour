# Claude Code Setup Notes — CLAUDE.md, Hooks, Project Checklist

Source: code.claude.com/docs/en/hooks (July 2026)

## 1. CLAUDE.md files (persistent context)

| File | Scope | Committed? | What to put there |
|---|---|---|---|
| `~/.claude/CLAUDE.md` | Global — all projects | No | Personal style: "prefer TypeScript strict mode", "run tests before commit", package manager choice |
| `./CLAUDE.md` | One project | Yes | Build/test/lint commands, architecture overview, code conventions, gotchas |
| `CLAUDE.local.md` | One project, just you | No (gitignored) | Local URLs, personal notes, sandbox credentials refs |

Tip: run `/init` in a new repo — Claude Code generates a starter CLAUDE.md from the codebase.

## 2. Hooks (pre/post actions)

Hooks are shell commands (or HTTP/MCP/prompt handlers) that fire at lifecycle events.
Defined in JSON settings, NOT in CLAUDE.md:

| Location | Scope |
|---|---|
| `~/.claude/settings.json` | All your projects |
| `.claude/settings.json` | Project, committable |
| `.claude/settings.local.json` | Project, gitignored |
| Skill/agent frontmatter or plugin `hooks/hooks.json` | While component is active |

### Key events

- `PreToolUse` — before a tool call; CAN BLOCK it (exit code 2 blocks)
- `PostToolUse` — after a tool call succeeds
- `PostToolUseFailure` — after a tool call fails
- `UserPromptSubmit` — when you submit a prompt, before Claude processes it
- `SessionStart` / `SessionEnd` — session begins/ends (load context, cleanup)
- `Stop` — Claude finishes responding
- `SubagentStop` — a subagent finishes
- `Notification`, `PreCompact` — notifications, before context compaction

### Matchers

Filter by tool name: exact (`Bash`), list (`Edit|Write` or `Edit, Write`), regex (`mcp__.*` = all tools from MCP servers). `*` or omitted = fire always.

### Example `.claude/settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": ".claude/hooks/block-dangerous.sh" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write \"$CLAUDE_FILE_PATHS\"" }]
      }
    ]
  }
}
```

Hook mechanics: the handler receives tool input as JSON on stdin (`tool_name`, `tool_input`, `hookEventName`). Exit 0 = allow, exit 2 (PreToolUse) = block with stderr shown to Claude.

### Common hook recipes

- Auto-format after every Edit/Write (prettier, black, gofmt)
- Block `rm -rf`, edits to `.env` or lockfiles
- Run test suite after changes to `src/**`
- Desktop notification on `Stop` (long tasks)
- Log all Bash commands for auditing

Manage interactively with the `/hooks` menu inside Claude Code.

## 3. New-project checklist

1. `/init` → generates `CLAUDE.md`
2. `.claude/settings.json` → permissions (allow/deny tools) + hooks
3. MCP servers → `claude mcp add <name> <command>` (e.g. `claude mcp add playwright npx @playwright/mcp@latest`)
4. Skills → `.claude/skills/<name>/SKILL.md` (reusable instructions auto-applied to matching tasks)
5. Subagents → `.claude/agents/<name>.md` (delegate work, keep main context clean)
6. Slash commands → `.claude/commands/<name>.md` (custom /commands)
7. Commit `.claude/` (minus `settings.local.json`) so the team shares the setup
