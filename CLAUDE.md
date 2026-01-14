# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **documentation and template repository** for Claude Code best practices. It contains:
- Educational guide (GUIDE.md) explaining Claude Code configuration
- Ready-to-use templates for CLAUDE.md files, settings.json, and .gitignore
- Example hooks (Python/Bash) for deterministic security enforcement
- Example skills for reusable AI expertise

**This is NOT a code project** — there is no build system, no tests, no runtime application.

## Repository Structure

```
├── GUIDE.md                  # Main educational content (~900 lines)
├── templates/                # Copy-and-use templates
│   ├── global-claude.md      # Template for ~/.claude/CLAUDE.md
│   ├── project-claude.md     # Template for ./CLAUDE.md in any project
│   ├── settings.json         # Hook configuration template
│   └── .gitignore            # Recommended ignore patterns
├── hooks/                    # Security enforcement scripts
│   ├── block-secrets.py      # PreToolUse: blocks .env/credentials access
│   ├── block-dangerous-commands.sh  # PreToolUse: blocks rm -rf, etc.
│   ├── after-edit.sh         # PostToolUse: run formatters
│   ├── end-of-turn.sh        # Stop: quality gates
│   └── notify.sh             # Desktop notifications
└── skills/                   # Packaged AI expertise
    ├── commit-messages/      # Conventional commit generation
    └── security-audit/       # Vulnerability scanning checklist
```

## Key Concepts

### Hooks vs CLAUDE.md

CLAUDE.md rules are **suggestions** that Claude can override under context pressure. Hooks are **deterministic enforcement** — they always execute.

- `block-secrets.py`: Exit code 2 blocks Read/Edit/Write operations on sensitive files
- `block-dangerous-commands.sh`: Exit code 2 blocks dangerous Bash patterns

### Hook Exit Codes

| Code | Behavior |
|------|----------|
| 0 | Allow operation |
| 1 | Error (shown to user only) |
| 2 | Block operation, stderr fed back to Claude |

### Skills

Skills use **progressive disclosure**: only name/description loaded at startup, full content loaded when triggered. Located in `skills/*/SKILL.md` with optional supporting files.

## Working With This Repo

When editing **GUIDE.md**: This is the viral Reddit guide. Maintain tone, structure, and citation style. Update "What's new in V2" section when adding features.

When editing **templates/**: These are copy-paste targets. Keep them self-contained. Use placeholders like `YourUsername`, `[DATE]`, `[e.g., PostgreSQL]`.

When editing **hooks/**: Include usage instructions in file header. Explain exit codes. Fail open (exit 0) on unexpected errors.

When editing **skills/**: SKILL.md requires frontmatter with `name` and `description`. Description must explain when to activate.
