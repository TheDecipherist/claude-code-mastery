# The Complete Guide to Claude Code V3: LSP, CLAUDE.md, MCP, Skills & Hooks — Now With IDE-Level Code Intelligence

📸 **[View with banner on the website](https://thedecipherist.github.io/claude-code-mastery?utm_source=reddit&utm_medium=post&utm_campaign=claude-code-mastery&utm_content=v3-guide)**

## 🎉 V3: Built on Community Feedback (Again)

V2 hit #2 all-time on r/ClaudeAI. Your comments made V3 possible. Huge thanks to u/BlueVajra (commands/skills merge), u/stratofax (dotfiles sync), u/antoniocs (MCP tradeoffs), u/GeckoLogic (LSP), and everyone from V2: u/headset38, u/tulensrma, u/jcheroske.

**What's new in V3:**
- **Part 8: LSP** — Claude now has IDE-level code intelligence (900x faster navigation)
- **Commands & Skills merged** — Same schema, simpler mental model
- **Expanded MCP directory** — 25+ recommended servers by category
- **MCP tradeoffs** — When NOT to use MCP servers
- **Dotfiles sync** — Keep ~/.claude consistent across machines
- [GitHub repo](https://github.com/TheDecipherist/claude-code-mastery) with templates, hooks, and skills

---

**TL;DR:** Your global `~/.claude/CLAUDE.md` is a security gatekeeper AND project blueprint. **LSP gives Claude semantic code understanding** — go-to-definition, find-references, diagnostics. MCP servers extend capabilities (but have tradeoffs). Commands and skills now share the same schema. **Hooks enforce rules deterministically** where CLAUDE.md can fail. And research shows mixing topics causes **39% performance degradation** — keep chats focused.

---

## Part 1: The Global CLAUDE.md as Security Gatekeeper

### The Memory Hierarchy

Claude Code loads CLAUDE.md files in a specific order:

| Level | Location | Purpose |
|-------|----------|---------|
| **Enterprise** | `/etc/claude-code/CLAUDE.md` | Org-wide policies |
| **Global User** | `~/.claude/CLAUDE.md` | Your standards for ALL projects |
| **Project** | `./CLAUDE.md` | Team-shared project instructions |
| **Project Local** | `./CLAUDE.local.md` | Personal project overrides |

Your global file applies to **every single project** you work on.

### What Belongs in Global

**1. Identity & Authentication**

```markdown
## GitHub Account
**ALWAYS** use **YourUsername** for all projects:
- SSH: `git@github.com:YourUsername/<repo>.git`

## Docker Hub
Already authenticated. Username in `~/.env` as `DOCKER_HUB_USER`
```

**Why global?** You use the same accounts everywhere. Define once, inherit everywhere.

**2. The Gatekeeper Rules**

```markdown
## NEVER EVER DO

These rules are ABSOLUTE:

### NEVER Publish Sensitive Data
- NEVER publish passwords, API keys, tokens to git/npm/docker
- Before ANY commit: verify no secrets included

### NEVER Commit .env Files
- NEVER commit `.env` to git
- ALWAYS verify `.env` is in `.gitignore`
```

### Why This Matters: Claude Reads Your .env

[Security researchers discovered](https://www.knostic.ai/blog/claude-loads-secrets-without-permission) that Claude Code **automatically reads `.env` files** without explicit permission. [Backslash Security warns](https://www.backslash.security/blog/claude-code-security-best-practices):

> "If not restricted, Claude can read `.env`, AWS credentials, or `secrets.json` and leak them through 'helpful suggestions.'"

Your global CLAUDE.md creates a **behavioral gatekeeper** — even if Claude has access, it won't output secrets.

### Syncing Global CLAUDE.md Across Machines

*Thanks to u/stratofax for this tip.*

If you work on multiple computers, sync your `~/.claude/` directory using a dotfiles manager:

```bash
# Using GNU Stow
cd ~/dotfiles
stow claude  # Symlinks ~/.claude to dotfiles/claude/.claude
```

This gives you:
- Version control on your settings
- Consistent configuration everywhere
- Easy recovery if something breaks

### Defense in Depth

| Layer | What | How |
|-------|------|-----|
| 1 | Behavioral rules | Global CLAUDE.md "NEVER" rules |
| 2 | Access control | Deny list in settings.json |
| 3 | Git safety | .gitignore |

### Team Workflows: Evolving CLAUDE.md

[Boris Cherny shares how Anthropic's Claude Code team does it](https://x.com/bcherny/status/2007179832300581177):

> "Our team shares a single CLAUDE.md for the Claude Code repo. We check it into git, and the whole team contributes multiple times a week."

**The pattern:** Mistakes become documentation.

```
Claude makes mistake → You fix it → You add rule to CLAUDE.md → Never happens again
```

#### Compounding Engineering

This embodies [Compounding Engineering](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents):

> "Each unit of engineering work should make subsequent units easier."

The 80/20 inversion: Spend 80% on planning and review, 20% on execution. Your CLAUDE.md becomes institutional knowledge that compounds over time.

---

## Part 2: Global Rules for New Project Scaffolding

Your global CLAUDE.md becomes a **project factory**. Every new project automatically inherits your standards.

### The Problem Without Scaffolding Rules

[Research from project scaffolding experts](https://github.com/madison-hutson/claude-project-scaffolding):

> "LLM-assisted development fails by silently expanding scope, degrading quality, and losing architectural intent."

### The Solution

```markdown
## New Project Setup

When creating ANY new project:

### Required Files
- `.env` — Environment variables (NEVER commit)
- `.env.example` — Template with placeholders
- `.gitignore` — Must include: .env, node_modules/, dist/
- `CLAUDE.md` — Project overview

### Required Structure
project/
├── src/
├── tests/
├── docs/
├── .claude/skills/
└── scripts/

### Node.js Requirements
Add to entry point:
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
```

When you say "create a new Node.js project," Claude reads this and **automatically** creates the correct structure. Zero manual setup.

---

## Part 3: MCP Servers — Claude's Integrations

[MCP (Model Context Protocol)](https://www.anthropic.com/news/model-context-protocol) lets Claude interact with external tools.

### Adding MCP Servers

```bash
claude mcp add <server-name> -- <command>
claude mcp list
claude mcp remove <server-name>
```

### When NOT to Use MCP

*Thanks to u/antoniocs for this perspective.*

MCP servers consume tokens and context. For simple integrations, consider alternatives:

| Use Case | MCP Overhead | Alternative |
|----------|--------------|-------------|
| Trello tasks | High | CLI tool (`trello-cli`) |
| Simple HTTP calls | Overkill | `curl` via Bash |
| One-off queries | Wasteful | Direct command |

**Rule of thumb:** If you're calling an MCP tool once per session, a CLI is more efficient. MCP shines for *repeated* tool use within conversations.

### Recommended MCP Servers for Developers

#### Core Development

| Server | Purpose | Install |
|--------|---------|---------|
| **Context7** | Live docs for any library | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest` |
| **GitHub** | PRs, issues, CI/CD | `claude mcp add github -- npx -y @modelcontextprotocol/server-github` |
| **Filesystem** | Advanced file operations | `claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem` |
| **Sequential Thinking** | Structured problem-solving | `claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking` |

#### Databases

| Server | Purpose | Install |
|--------|---------|---------|
| **MongoDB** | Atlas/Community, Performance Advisor | `claude mcp add mongodb -- npx -y mongodb-mcp-server` |
| **PostgreSQL** | Query Postgres naturally | `claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres` |
| **DBHub** | Universal (MySQL, SQLite, etc.) | `claude mcp add db -- npx -y @bytebase/dbhub` |

#### Documents & RAG

| Server | Purpose | Install |
|--------|---------|---------|
| **Docling** | PDF/DOCX parsing, 97.9% table accuracy | `claude mcp add docling -- uvx docling-mcp-server` |
| **Qdrant** | Vector search, semantic memory | `claude mcp add qdrant -- npx -y @qdrant/mcp-server` |
| **Chroma** | Embeddings, vector DB | `claude mcp add chroma -- npx -y @chroma/mcp-server` |

#### Browser & Testing

| Server | Purpose | Install |
|--------|---------|---------|
| **Playwright** | E2E testing, scraping | `claude mcp add playwright -- npx -y @anthropic-ai/playwright-mcp` |
| **Browser MCP** | Use your logged-in Chrome | [browsermcp.io](https://browsermcp.io) |
| **Brave Search** | Privacy-first web search | `claude mcp add brave -- npx -y @anthropic-ai/brave-search-mcp` |

#### Cloud & Hosting

| Server | Purpose | Install |
|--------|---------|---------|
| **AWS** | Full AWS service access | `claude mcp add aws -- uvx awslabs.aws-api-mcp-server@latest` |
| **Cloudflare** | Workers, KV, R2 | `claude mcp add cloudflare -- npx -y @cloudflare/mcp-server` |
| **Hostinger** | Domains, DNS, VMs, billing | `npm i -g hostinger-api-mcp` then configure |
| **Kubectl** | Kubernetes natural language | `claude mcp add kubectl -- npx -y @modelcontextprotocol/server-kubernetes` |

#### Workflow & Communication

| Server | Purpose | Install |
|--------|---------|---------|
| **Slack** | Messages, channel summaries | `claude mcp add slack -- npx -y @anthropic-ai/slack-mcp` |
| **Linear** | Issue tracking | `claude mcp add linear -- npx -y @linear/mcp-server` |
| **Figma** | Design specs, components | `claude mcp add figma -- npx -y @anthropic-ai/figma-mcp` |

#### Discovery

Find more servers:
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — 76k+ stars, hundreds of servers
- [mcpservers.org](https://mcpservers.org) — Searchable directory
- [Claude Market](https://github.com/claude-market/marketplace) — Curated marketplace

---

## Part 4: Context7 — Live Documentation

[Context7](https://github.com/upstash/context7) gives Claude access to **up-to-date documentation**.

### The Problem

Claude's training has a cutoff. Ask about a library released after training → outdated answers.

### The Solution

```
You: "Using context7, show me the Next.js 15 cache API"
Claude: *fetches current docs* → accurate, up-to-date code
```

### Installation

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

---

## Part 5: Skills (Commands Are Now Skills)

*Thanks to u/BlueVajra for the correction.*

**Update:** As of late 2025, **commands and skills have been merged**. They now share the same schema.

> "Merged slash commands and skills, simplifying the mental model with no change in behavior." — Claude Code Changelog

### The New Structure

| Old Location | New Location |
|--------------|--------------|
| `~/.claude/commands/review.md` | `~/.claude/skills/review/SKILL.md` |

### Key Difference

- **Slash commands** (`/review`) — You explicitly invoke them
- **Skills** — Claude can trigger automatically based on context

Both use the same SKILL.md format:

```markdown
---
name: review
description: Review code for bugs and security issues
---

# Code Review Skill

When reviewing code:
1. Check for security vulnerabilities
2. Look for performance issues
3. Verify error handling
```

### Progressive Disclosure

Skills use **progressive disclosure** for token efficiency:
1. **Startup**: Only name/description loaded
2. **Triggered**: Full SKILL.md content loaded
3. **As needed**: Additional resources loaded

**Rule of thumb:** If instructions apply to <20% of conversations, make it a skill instead of putting it in CLAUDE.md.

---

## Part 6: Why Single-Purpose Chats Are Critical

**Research consistently shows mixing topics destroys accuracy.**

[Studies on multi-turn conversations](https://arxiv.org/pdf/2505.06120):

> "An average **39% performance drop** when instructions are delivered across multiple turns."

[Chroma Research on context rot](https://research.trychroma.com/context-rot):

> "As tokens in the context window increase, the model's ability to accurately recall information decreases."

### The Golden Rule

> **"One Task, One Chat"**

| Scenario | Action |
|----------|--------|
| New feature | New chat |
| Bug fix (unrelated) | `/clear` then new task |
| Research vs implementation | Separate chats |
| 20+ turns elapsed | Start fresh |

### Use `/clear` Liberally

```bash
/clear
```

[Anthropic recommends](https://www.anthropic.com/engineering/claude-code-best-practices):

> "Use `/clear` frequently between tasks to reset the context window."

---

## Part 7: Hooks — Deterministic Enforcement

*This section added based on V2 feedback from u/headset38 and u/tulensrma.*

CLAUDE.md rules are **suggestions** Claude can ignore under context pressure. Hooks are **deterministic** — they always run.

### The Critical Difference

| Mechanism | Type | Reliability |
|-----------|------|-------------|
| CLAUDE.md rules | Suggestion | Can be overridden |
| **Hooks** | **Enforcement** | Always executes |

### Hook Events

| Event | When | Use Case |
|-------|------|----------|
| `PreToolUse` | Before tool executes | Block dangerous ops |
| `PostToolUse` | After tool completes | Run linters |
| `Stop` | Claude finishes turn | Quality gates |

### Example: Block Secrets Access

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "python3 ~/.claude/hooks/block-secrets.py"
        }]
      }
    ]
  }
}
```

The hook script:

```python
#!/usr/bin/env python3
import json, sys
from pathlib import Path

SENSITIVE = {'.env', '.env.local', 'secrets.json', 'id_rsa'}

data = json.load(sys.stdin)
file_path = data.get('tool_input', {}).get('file_path', '')

if Path(file_path).name in SENSITIVE:
    print(f"BLOCKED: Access to {file_path} denied.", file=sys.stderr)
    sys.exit(2)  # Exit 2 = block and feed stderr to Claude

sys.exit(0)
```

### Hook Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Allow operation |
| 1 | Error (shown to user) |
| **2** | **Block operation, tell Claude why** |

---

## Part 8: LSP — IDE-Level Code Intelligence

*Thanks to u/GeckoLogic for highlighting this.*

**New in December 2025** (v2.0.74), Claude Code gained native Language Server Protocol support. This is a game-changer.

### What LSP Enables

LSP gives Claude the same code understanding your IDE has:

| Capability | What It Does |
|------------|--------------|
| **Go to Definition** | Jump to where any symbol is defined |
| **Find References** | See everywhere a function is used |
| **Hover** | Get type signatures and docs |
| **Diagnostics** | Real-time error detection |
| **Document Symbols** | List all symbols in a file |

### Why This Matters

Before LSP, Claude used **text-based search** (grep, ripgrep) to understand code. Slow and imprecise.

With LSP, Claude has **semantic understanding** — it knows that `getUserById` in file A calls the function defined in file B, not just that the text matches.

**Performance:** 900x faster (50ms vs 45 seconds for cross-codebase navigation)

### Supported Languages

Python, TypeScript, Go, Rust, Java, C/C++, C#, PHP, Kotlin, Ruby, HTML/CSS

### Setup

LSP is built-in as of v2.0.74. For older versions:

```bash
export ENABLE_LSP_TOOL=1
```

### What This Means for You

Claude can now:
- Navigate massive codebases instantly
- Find all usages before refactoring
- Catch type errors in real-time
- Understand code structure semantically

This shifts AI coding from **text manipulation** to **semantic understanding**.

---

## Quick Reference

| Tool | Purpose | Location |
|------|---------|----------|
| Global CLAUDE.md | Security + Scaffolding | `~/.claude/CLAUDE.md` |
| Project CLAUDE.md | Architecture + Team rules | `./CLAUDE.md` |
| MCP Servers | External integrations | `claude mcp add` |
| Context7 | Live documentation | MCP server |
| **Skills** | **Reusable expertise** | `.claude/skills/*/SKILL.md` |
| **Hooks** | **Deterministic enforcement** | `~/.claude/settings.json` |
| **LSP** | **Semantic code intelligence** | Built-in (v2.0.74+) |
| `/clear` | Reset context | Type in chat |

---

## GitHub Repo

All templates, hooks, and skills:

**[github.com/TheDecipherist/claude-code-mastery](https://github.com/TheDecipherist/claude-code-mastery)**

- CLAUDE.md templates (global + project)
- Ready-to-use hooks (block-secrets.py, etc.)
- Example skills
- settings.json pre-configured

---

## Sources

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Anthropic
- [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic
- [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) — Anthropic
- [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic
- [Claude Code LSP Setup](https://www.aifreeapi.com/en/posts/claude-code-lsp) — AI Free API
- [Claude Code December 2025 Update](https://www.geeky-gadgets.com/claude-code-update-dec-2025/) — Geeky Gadgets
- [MongoDB MCP Server](https://www.mongodb.com/company/blog/announcing-mongodb-mcp-server) — MongoDB
- [Hostinger MCP Server](https://github.com/hostinger/api-mcp-server) — Hostinger
- [Docling MCP](https://docling-project.github.io/docling/usage/mcp/) — IBM Research
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — GitHub
- [Context Rot Research](https://research.trychroma.com/context-rot) — Chroma
- [LLMs Get Lost In Multi-Turn](https://arxiv.org/pdf/2505.06120) — arXiv
- [Claude Code Hooks Guardrails](https://paddo.dev/blog/claude-code-hooks-guardrails/) — Paddo.dev
- [Claude loads secrets without permission](https://www.knostic.ai/blog/claude-loads-secrets-without-permission) — Knostic
- [Compound Engineering](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents) — Every

---

*What's in your setup? Drop your hooks, skills, and MCP configs below.*
