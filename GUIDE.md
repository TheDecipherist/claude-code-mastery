# The Complete Guide to Claude Code V2: Global CLAUDE.md, MCP Servers, Commands, Skills, Hooks, and Why Single-Purpose Chats Matter

## 🎉 Updated Based on Community Feedback

This is V2 of the guide that went viral. Huge thanks to u/headset38, u/tulensrma, u/jcheroske, and everyone who commented. You pointed out that CLAUDE.md rules are suggestions Claude can ignore — and you were right. This version adds **Part 7: Skills & Hooks** covering the enforcement layer.

**What's new in V2:**
- Part 7: Skills & Hooks — deterministic enforcement over behavioral suggestion
- Browser MCP comparison guide — Playwright vs Browser MCP vs Browser Use
- Team workflows & Compounding Engineering — evolving CLAUDE.md, @.claude in PRs
- [GitHub repo](https://github.com/TheDecipherist/claude-code-mastery) with ready-to-use templates, hooks, and skills

---

**TL;DR:** Your global `~/.claude/CLAUDE.md` is a security gatekeeper that prevents secrets from reaching production AND a project scaffolding blueprint that ensures every new project follows the same structure. MCP servers extend Claude's capabilities exponentially. Context7 gives Claude access to up-to-date documentation. Custom commands and agents automate repetitive workflows. **Hooks enforce rules deterministically** where CLAUDE.md can fail. **Skills package reusable expertise**. And research shows mixing topics in a single chat causes **39% performance degradation** — so keep chats focused.

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

## Deployment
Use Dokploy MCP for production. API URL in `~/.env`
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

### NEVER Hardcode Credentials
- ALWAYS use environment variables
```

### Why This Matters: Claude Reads Your .env

[Security researchers discovered](https://www.knostic.ai/blog/claude-loads-secrets-without-permission) that Claude Code **automatically reads `.env` files** without explicit permission. [Backslash Security warns](https://www.backslash.security/blog/claude-code-security-best-practices):

> "If not restricted, Claude can read `.env`, AWS credentials, or `secrets.json` and leak them through 'helpful suggestions.'"

Your global CLAUDE.md creates a **behavioral gatekeeper** — even if Claude has access, it won't output secrets.

### Defense in Depth

| Layer | What | How |
|-------|------|-----|
| 1 | Behavioral rules | Global CLAUDE.md "NEVER" rules |
| 2 | Access control | Deny list in settings.json |
| 3 | Git safety | .gitignore |

### Team Workflows: Evolving CLAUDE.md

Solo developers maintain their own CLAUDE.md. But what about teams? [Boris Cherny shares how Anthropic's Claude Code team does it](https://x.com/bcherny/status/2007179832300581177):

> "Our team shares a single CLAUDE.md for the Claude Code repo. We check it into git, and the whole team contributes multiple times a week. Anytime we see Claude do something incorrectly we add it to the CLAUDE.md, so Claude knows not to do it next time."

**The key insight:** CLAUDE.md isn't a static document you write once. It's a **living file that evolves** with your codebase.

#### The Pattern: Mistakes Become Documentation

```
Claude makes mistake → You fix it → You add rule to CLAUDE.md → Claude never makes that mistake again
```

Example workflow:
1. Claude uses deprecated API in PR
2. Reviewer catches it
3. Team adds to CLAUDE.md: `## API Guidelines\nNEVER use deprecated v1 endpoints. Always use v2.`
4. Future Claude sessions know to avoid v1

#### @.claude in PR Reviews

Using the [Claude Code GitHub Action](https://docs.anthropic.com/en/docs/claude-code/github-actions), you can tag `@.claude` directly in PR comments:

```
Reviewer comment on PR #142:
"@.claude add to CLAUDE.md: Always use our internal logger instead of console.log"
```

Claude updates CLAUDE.md as part of the PR itself. The lesson gets documented where it was learned.

**To set this up:**
```bash
claude /install-github-action
```

#### Compounding Engineering

This workflow embodies a concept called [Compounding Engineering](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents):

> "Each unit of engineering work should make subsequent units easier — not harder."

The traditional approach: fix bug, move on, repeat same mistake later.

The compounding approach: fix bug, document why, never repeat.

```
Plan → Work → Review → Compound → (better) Plan → ...
```

**The 80/20 inversion:** Spend 80% on planning and review, 20% on execution. Each cycle feeds learnings back into the system. Your CLAUDE.md becomes institutional knowledge that compounds over time.

**Resources:**
- [Compound Engineering Plugin](https://github.com/EveryInc/compound-engineering-plugin) — Claude Code plugin implementing this workflow
- [How Every Codes with Agents](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents) — Deep dive into the methodology

---

## Part 2: Global Rules for New Project Scaffolding

This is where global CLAUDE.md becomes a **project factory**. Every new project you create automatically inherits your standards, structure, and safety requirements.

### The Problem Without Scaffolding Rules

[Research from project scaffolding experts](https://github.com/madison-hutson/claude-project-scaffolding) explains:

> "LLM-assisted development fails by silently expanding scope, degrading quality, and losing architectural intent."

Without global scaffolding rules:
- Each project has different structures
- Security files get forgotten (.gitignore, .dockerignore)
- Error handling is inconsistent
- Documentation patterns vary
- You waste time re-explaining the same requirements

### The Solution: Scaffolding Rules in Global CLAUDE.md

Add a "New Project Setup" section to your global file:

```markdown
## New Project Setup

When creating ANY new project, ALWAYS do the following:

### 1. Required Files (Create Immediately)
- `.env` — Environment variables (NEVER commit)
- `.env.example` — Template with placeholder values
- `.gitignore` — Must include: .env, .env.*, node_modules/, dist/, .claude/
- `.dockerignore` — Must include: .env, .git/, node_modules/
- `README.md` — Project overview (reference env vars, don't hardcode)

### 2. Required Directory Structure
```
project-root/
├── src/               # Source code
├── tests/             # Test files
├── docs/              # Documentation (gitignored for generated docs)
├── .claude/           # Claude configuration
│   ├── commands/      # Custom slash commands
│   └── settings.json  # Project-specific settings
└── scripts/           # Build/deploy scripts
```

### 3. Required .gitignore Entries
```
# Environment
.env
.env.*
.env.local

# Dependencies
node_modules/
vendor/
__pycache__/

# Build outputs
dist/
build/
.next/

# Claude local files
.claude/settings.local.json
CLAUDE.local.md

# Generated docs
docs/*.generated.*
```

### 4. Node.js Projects — Required Error Handling
Add to entry point (index.ts, server.ts, app.ts):
```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
```

### 5. Required CLAUDE.md Sections
Every project CLAUDE.md must include:
- Project overview (what it does)
- Tech stack
- Build commands
- Test commands
- Architecture overview
```

### Why This Works

When you tell Claude "create a new Node.js project," it reads your global CLAUDE.md first and **automatically**:

1. Creates `.env` and `.env.example`
2. Sets up proper `.gitignore` with all required entries
3. Creates the directory structure
4. Adds error handlers to the entry point
5. Generates a project CLAUDE.md with required sections

**You never have to remember these requirements again.**

### Advanced: Framework-Specific Rules

```markdown
## Framework-Specific Setup

### Next.js Projects
- Use App Router (not Pages Router)
- Create `src/app/` directory structure
- Include `next.config.js` with strict mode enabled
- Add analytics to layout.tsx

### Python Projects
- Create `pyproject.toml` (not setup.py)
- Use `src/` layout
- Include `requirements.txt` AND `requirements-dev.txt`
- Add `.python-version` file

### Docker Projects
- Multi-stage builds ALWAYS
- Never run as root (use non-root user)
- Include health checks
- `.dockerignore` must mirror `.gitignore` + include `.git/`
```

### Quality Gates in Scaffolding

[The claude-project-scaffolding approach](https://github.com/madison-hutson/claude-project-scaffolding) adds enforcement:

```markdown
## Quality Requirements

### File Size Limits
- No file > 300 lines (split if larger)
- No function > 50 lines

### Required Before Commit
- All tests pass
- TypeScript compiles with no errors
- Linter passes with no warnings
- No secrets in staged files

### CI/CD Requirements
Every project must include:
- `.github/workflows/ci.yml` for GitHub Actions
- Pre-commit hooks via Husky (Node.js) or pre-commit (Python)
```

### Example: What Happens When You Create a Project

**You say:** "Create a new Next.js e-commerce project called shopify-clone"

**Claude reads global CLAUDE.md and automatically creates:**

```
shopify-clone/
├── .env                          ← Created (empty, for secrets)
├── .env.example                  ← Created (with placeholder vars)
├── .gitignore                    ← Created (with ALL required entries)
├── .dockerignore                 ← Created (mirrors .gitignore)
├── README.md                     ← Created (references env vars)
├── CLAUDE.md                     ← Created (with required sections)
├── src/
│   └── app/                      ← App Router structure
├── tests/
├── docs/
├── .claude/
│   ├── commands/
│   └── settings.json
└── scripts/
```

**Zero manual setup. Every project starts secure and consistent.**

---

## Part 3: MCP Servers — Claude's Integrations

[MCP (Model Context Protocol)](https://www.anthropic.com/news/model-context-protocol) lets Claude interact with external tools and services.

### What MCP Servers Do

> "MCP is an open protocol that standardizes how applications provide context to LLMs."

MCP servers give Claude:
- Access to databases
- Integration with APIs
- File system capabilities beyond the project
- Browser automation
- And much more

### Adding MCP Servers

```bash
# Add a server
claude mcp add <server-name> -- <command>

# List servers
claude mcp list

# Remove a server
claude mcp remove <server-name>
```

### Essential MCP Servers

| Server | Purpose | Install |
|--------|---------|---------|
| **Context7** | Live documentation | `claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp` |
| **Playwright** | Browser testing | `claude mcp add playwright -- npx -y @anthropic-ai/playwright-mcp` |
| **GitHub** | Repo management | `claude mcp add github -- npx -y @modelcontextprotocol/server-github` |
| **PostgreSQL** | Database queries | `claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres` |
| **Filesystem** | Extended file access | `claude mcp add fs -- npx -y @anthropic-ai/filesystem-mcp` |

### Browser Automation: Choosing the Right MCP

Browser automation gets its own section because there are multiple solid options with different tradeoffs.

| MCP Server | Best For | Session State | Runs |
|------------|----------|---------------|------|
| **Playwright** | Testing, scraping, fresh contexts | ❌ None | Local |
| **Browser MCP** | Tasks needing your logins | ✅ Your Chrome profile | Local |
| **Browser Use** | Complex AI-driven workflows | ✅ Cloud profiles | Cloud |

#### Playwright MCP (Default Choice)
```bash
claude mcp add playwright -- npx -y @anthropic-ai/playwright-mcp
```
**Pros:** Official Anthropic server, reliable, uses accessibility trees for semantic page understanding, well-documented.

**Cons:** Spawns fresh browser contexts — no access to your logged-in sessions. Every task starts from scratch.

**Use when:** Writing tests, scraping public sites, debugging web apps.

#### Browser MCP (Best for Authenticated Tasks)
```bash
# Install Chrome extension from https://browsermcp.io
claude mcp add browser-mcp -- npx -y @anthropic-ai/browser-mcp
```
**Pros:** Uses your **actual Chrome profile** — stay logged into Gmail, GitHub, Twitter, etc. Bypasses bot detection using your real browser fingerprint. Local execution = no latency.

**Cons:** Requires Chrome extension. Only works with your current browser session.

**Use when:** "Check my email", "Post to my Twitter", "Review my GitHub notifications" — any task needing your existing logins.

#### Browser Use MCP (AI-Driven Automation)
```bash
# Requires API key from https://browser-use.com
claude mcp add browser-use -- npx -y browser-use-mcp
```
**Pros:** AI agent reasoning (describe tasks in natural language), persistent cloud profiles, 85.8% WebVoyager benchmark score, real-time task monitoring.

**Cons:** Cloud-hosted (data leaves your machine), requires API key, higher abstraction = less direct control.

**Use when:** Complex multi-step workflows, tasks requiring persistent cloud sessions, when you need AI to figure out the "how."

#### Quick Decision Guide

```
Need your logged-in sessions? → Browser MCP
Need AI to figure out complex steps? → Browser Use
Writing tests or scraping? → Playwright
Want the official/stable option? → Playwright
```

### MCP in CLAUDE.md

Document required MCP servers in your global file:

```markdown
## Required MCP Servers

These MCP servers must be installed for full functionality:

### context7
Live documentation access for all libraries.
Install: `claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp`

### playwright
Browser automation for testing.
Install: `claude mcp add playwright -- npx -y @anthropic-ai/playwright-mcp`
```

---

## Part 4: Context7 — Live Documentation

[Context7](https://github.com/upstash/context7) is a game-changer. It gives Claude access to **up-to-date documentation** for any library.

### The Problem

Claude's training data has a cutoff. When you ask about:
- A library released after training
- Recent API changes
- New framework features

Claude might give outdated or incorrect information.

### The Solution

Context7 fetches live documentation:

```
You: "Using context7, show me how to use the new Next.js 15 cache API"

Claude: *fetches current Next.js docs*
        *provides accurate, up-to-date code*
```

### Installation

```bash
claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp
```

### Usage Patterns

| Pattern | Example |
|---------|---------|
| Explicit | "Using context7, look up Prisma's createMany" |
| Research | "Check context7 for React Server Components patterns" |
| Debugging | "Use context7 to find the correct Tailwind v4 syntax" |

### Add to Global CLAUDE.md

```markdown
## Documentation Lookup

When unsure about library APIs or recent changes:
1. Use Context7 MCP to fetch current documentation
2. Prefer official docs over training knowledge
3. Always verify version compatibility
```

---

## Part 5: Custom Commands and Sub-Agents

[Slash commands](https://code.claude.com/docs/en/slash-commands) are reusable prompts that automate workflows.

### Creating Commands

Commands live in `.claude/commands/` as markdown files:

**`.claude/commands/fix-types.md`:**

```markdown
---
description: Fix TypeScript errors
---

Run `npx tsc --noEmit` and fix any type errors.
For each error:
1. Identify the root cause
2. Fix with minimal changes
3. Verify the fix compiles

After fixing all errors, run the check again to confirm.
```

**Use it:**

```
/fix-types
```

### Benefits of Commands

| Benefit | Description |
|---------|-------------|
| **Workflow efficiency** | One word instead of paragraph prompts |
| **Team sharing** | Check into git, everyone gets them |
| **Parameterization** | Use `$ARGUMENTS` for dynamic input |
| **Orchestration** | Commands can spawn sub-agents |

### Sub-Agents

[Sub-agents](https://www.arsturn.com/blog/commands-vs-sub-agents-in-claude-code-a-guide-to-supercharging-your-workflow) run in **isolated context windows** — they don't pollute your main conversation.

> "Each sub-agent operates in its own isolated context window. This means it can focus on a specific task without getting 'polluted' by the main conversation."

### Global Commands Library

Add frequently-used commands to your global config:

```markdown
## Global Commands

Store these in ~/.claude/commands/ for use in ALL projects:

### /new-project
Creates new project with all scaffolding rules applied.

### /security-check
Scans for secrets, validates .gitignore, checks .env handling.

### /pre-commit
Runs all quality gates before committing.

### /docs-lookup
Spawns sub-agent with Context7 to research documentation.
```

---

## Part 6: Why Single-Purpose Chats Are Critical

This might be the most important section. **Research consistently shows that mixing topics destroys accuracy.**

### The Research

[Studies on multi-turn conversations](https://arxiv.org/pdf/2505.06120) found:

> "An average **39% performance drop** when instructions are delivered across multiple turns, with models making premature assumptions and failing to course-correct."

[Chroma Research on context rot](https://research.trychroma.com/context-rot):

> "As the number of tokens in the context window increases, the model's ability to accurately recall information decreases."

[Research on context pollution](https://kurtiskemple.com/blog/measuring-context-pollution/):

> "A **2% misalignment early** in a conversation chain can create a **40% failure rate** by the end."

### Why This Happens

**1. Lost-in-the-Middle Problem**

LLMs recall information best from the **beginning and end** of context. Middle content gets forgotten.

**2. Context Drift**

[Research shows](https://arxiv.org/html/2510.07777) context drift is:

> "The gradual degradation or distortion of the conversational state the model uses to generate its responses."

As you switch topics, earlier context becomes **noise that confuses** later reasoning.

**3. Attention Budget**

[Anthropic's context engineering guide](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) explains:

> "Transformers require n² pairwise relationships between tokens. As context expands, the model's 'attention budget' gets stretched thin."

### What Happens When You Mix Topics

```
Turn 1-5: Discussing authentication system
Turn 6-10: Switch to database schema design
Turn 11-15: Ask about the auth system again

Result: Claude conflates database concepts with auth,
        makes incorrect assumptions, gives degraded answers
```

The earlier auth discussion is now buried in "middle" context, competing with database discussion for attention.

### The Golden Rule

> **"One Task, One Chat"**

From [context management best practices](https://www.arsturn.com/blog/beyond-prompting-a-guide-to-managing-context-in-claude-code):

> "If you're switching from brainstorming marketing copy to analyzing a PDF, start a new chat. Don't bleed contexts. This keeps the AI's 'whiteboard' clean."

### Practical Guidelines

| Scenario | Action |
|----------|--------|
| New feature | New chat |
| Bug fix (unrelated to current work) | `/clear` then new task |
| Different file/module | Consider new chat |
| Research vs implementation | Separate chats |
| 20+ turns elapsed | Start fresh |

### Use `/clear` Liberally

```bash
/clear
```

This resets context. [Anthropic recommends](https://www.anthropic.com/engineering/claude-code-best-practices):

> "Use `/clear` frequently between tasks to reset the context window, especially during long sessions where irrelevant conversations accumulate."

### Sub-Agents for Topic Isolation

If you need to research something mid-task without polluting your context:

```
Spawn a sub-agent to research React Server Components.
Return only a summary of key patterns.
```

The sub-agent works in isolated context and returns just the answer.

---

## Part 7: Skills & Hooks — Enforcement Over Suggestion

This section was added based on community feedback. Special thanks to u/headset38 and u/tulensrma for pointing out that **Claude doesn't always follow CLAUDE.md rules rigorously**.

### Why CLAUDE.md Rules Can Fail

[Research on prompt-based guardrails](https://paddo.dev/blog/claude-code-hooks-guardrails/) explains:

> "Prompts are interpreted at runtime by an LLM that can be convinced otherwise. You need something deterministic."

Common failure modes:
- **Context window pressure**: Long conversations can push rules out of active attention
- **Conflicting instructions**: Other context may override your rules
- **Copy-paste propagation**: Even if Claude won't edit `.env`, it might copy secrets to another file

One community member noted their PreToolUse hook catches Claude attempting to access `.env` files "a few times per week" — despite explicit CLAUDE.md rules saying not to.

### The Critical Difference

| Mechanism | Type | Reliability |
|-----------|------|-------------|
| CLAUDE.md rules | Suggestion | Good, but can be overridden |
| **Hooks** | **Enforcement** | **Deterministic — always runs** |
| settings.json deny list | Enforcement | Good |
| .gitignore | Last resort | Only prevents commits |

```
PreToolUse hook blocking .env edits:
  → Always runs
  → Returns exit code 2
  → Operation blocked. Period.

CLAUDE.md saying "don't edit .env":
  → Parsed by LLM
  → Weighed against other context
  → Maybe followed
```

### Hooks: Deterministic Control

[Hooks](https://code.claude.com/docs/en/hooks) are shell commands that execute at specific lifecycle points. They're not suggestions — they're code that runs every time.

#### Hook Events

| Event | When It Fires | Use Case |
|-------|--------------|----------|
| `PreToolUse` | Before any tool executes | Block dangerous operations |
| `PostToolUse` | After tool completes | Run linters, formatters, tests |
| `Stop` | When Claude finishes responding | End-of-turn quality gates |
| `UserPromptSubmit` | When user submits prompt | Validate/enhance prompts |
| `SessionStart` | New session begins | Load context, initialize |
| `Notification` | Claude sends alerts | Desktop notifications |

#### Example: Block Secrets Access

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/block-secrets.py"
          }
        ]
      }
    ]
  }
}
```

The hook script (`~/.claude/hooks/block-secrets.py`):

```python
#!/usr/bin/env python3
"""
PreToolUse hook to block access to sensitive files.
Exit code 2 = block operation and feed stderr to Claude.
"""
import json
import sys
from pathlib import Path

SENSITIVE_PATTERNS = {
    '.env', '.env.local', '.env.production',
    'secrets.json', 'secrets.yaml',
    'id_rsa', 'id_ed25519', '.npmrc', '.pypirc'
}

def main():
    try:
        data = json.load(sys.stdin)
        tool_input = data.get('tool_input', {})
        file_path = tool_input.get('file_path') or tool_input.get('path') or ''
        
        if not file_path:
            sys.exit(0)
        
        path = Path(file_path)
        
        if path.name in SENSITIVE_PATTERNS or '.env' in str(path):
            print(f"BLOCKED: Access to '{path.name}' denied.", file=sys.stderr)
            print("Use environment variables instead.", file=sys.stderr)
            sys.exit(2)  # Exit 2 = block and feed stderr to Claude
        
        sys.exit(0)
    except Exception:
        sys.exit(0)  # Fail open

if __name__ == '__main__':
    main()
```

#### Example: Quality Gates on Stop

Run linters and tests when Claude finishes each turn:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/end-of-turn.sh"
          }
        ]
      }
    ]
  }
}
```

#### Hook Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success, allow operation |
| 1 | Error (shown to user only) |
| **2** | **Block operation, feed stderr to Claude** |

#### Hook Input Format

Hooks receive JSON via stdin containing context about the current operation. This lets you build conditional logic based on what Claude is doing.

**PreToolUse / PostToolUse:**

```json
{
  "hook_type": "PreToolUse",
  "tool_name": "Read",
  "tool_input": {
    "file_path": "/path/to/file.js"
  },
  "session_id": "abc123-def456"
}
```

**Stop (end of turn):**

```json
{
  "hook_type": "Stop",
  "stop_reason": "end_turn",
  "transcript_path": "/tmp/claude/transcript.json"
}
```

**UserPromptSubmit:**

```json
{
  "hook_type": "UserPromptSubmit",
  "prompt": "Help me refactor this function",
  "session_id": "abc123-def456"
}
```

**Example: Conditional Logic Based on Input**

```python
#!/usr/bin/env python3
import json
import sys

data = json.load(sys.stdin)
tool_name = data.get('tool_name', '')
tool_input = data.get('tool_input', {})

# Different behavior based on which tool
if tool_name == 'Bash':
    command = tool_input.get('command', '')
    if 'rm ' in command:
        print("Blocking rm command", file=sys.stderr)
        sys.exit(2)

# Access file paths for Read/Edit/Write
if tool_name in ['Read', 'Edit', 'Write']:
    file_path = tool_input.get('file_path', '')
    # Your logic here

sys.exit(0)  # Allow by default
```

**Limitation:** There's no native `is_plan_mode` flag. To detect plan mode, you'd need to infer from context (e.g., check if recent prompts contain plan-related keywords or parse the transcript).

### Skills: Packaged Expertise

[Skills](https://code.claude.com/docs/en/skills) are markdown files that teach Claude how to do something specific — like a training manual it can reference on demand.

From [Anthropic's engineering blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills):

> "Building a skill for an agent is like putting together an onboarding guide for a new hire."

#### How Skills Work

**Progressive disclosure** is the key principle:
1. **Startup**: Claude loads only skill *names and descriptions* into context
2. **Triggered**: When relevant, Claude reads the full `SKILL.md` file
3. **As needed**: Additional resources load only when referenced

This makes skills **extremely token efficient**. A 500-line skill costs zero tokens until triggered. Compare this to putting the same instructions in CLAUDE.md, where they consume context in every single conversation — even when irrelevant.

**Rule of thumb:** If instructions apply to <20% of your conversations, make it a skill instead of adding it to CLAUDE.md.

#### Skill Structure

```
.claude/skills/
└── commit-messages/
    ├── SKILL.md           ← Required: instructions + frontmatter
    ├── templates.md       ← Optional: reference material
    └── validate.py        ← Optional: executable scripts
```

**SKILL.md** (required):

```markdown
---
name: commit-messages
description: Generate clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Commit Message Skill

When generating commit messages:
1. Run `git diff --staged` to see changes
2. Use conventional commit format: `type(scope): description`
3. Keep subject line under 72 characters

## Types
- feat: New feature
- fix: Bug fix  
- docs: Documentation
- refactor: Code restructuring
```

#### When to Use Skills vs Other Options

| Need | Solution |
|------|----------|
| Project-specific instructions | Project `CLAUDE.md` |
| Reusable workflow across projects | **Skill** |
| External tool integration | MCP Server |
| Deterministic enforcement | **Hook** |
| One-off automation | Slash Command |

### Combining Hooks and Skills

The most robust setups use both:

- A `secrets-handling` **skill** teaches Claude *how* to work with secrets properly
- A `PreToolUse` **hook** *enforces* that Claude can never actually read `.env` files

### Updated Defense in Depth

| Layer | Mechanism | Type |
|-------|-----------|------|
| 1 | CLAUDE.md behavioral rules | Suggestion |
| **2** | **PreToolUse hooks** | **Enforcement** |
| 3 | settings.json deny list | Enforcement |
| 4 | .gitignore | Prevention |
| **5** | **Skills with security checklists** | **Guidance** |

---

## Putting It All Together

### The Complete Global CLAUDE.md Template

```markdown
# Global CLAUDE.md

## Identity & Accounts
- GitHub: YourUsername (SSH key: ~/.ssh/id_ed25519)
- Docker Hub: authenticated via ~/.docker/config.json
- Deployment: Dokploy (API URL in ~/.env)

## NEVER EVER DO (Security Gatekeeper)
- NEVER commit .env files
- NEVER hardcode credentials
- NEVER publish secrets to git/npm/docker
- NEVER skip .gitignore verification

## New Project Setup (Scaffolding Rules)

### Required Files
- .env (NEVER commit)
- .env.example (with placeholders)
- .gitignore (with all required entries)
- .dockerignore
- README.md
- CLAUDE.md

### Required Structure
project/
├── src/
├── tests/
├── docs/
├── .claude/commands/
└── scripts/

### Required .gitignore
.env
.env.*
node_modules/
dist/
.claude/settings.local.json
CLAUDE.local.md

### Node.js Requirements
- Error handlers in entry point
- TypeScript strict mode
- ESLint + Prettier configured

### Quality Gates
- No file > 300 lines
- All tests must pass
- No linter warnings
- CI/CD workflow required

## Framework-Specific Rules
[Your framework patterns here]

## Required MCP Servers
- context7 (live documentation)
- playwright (browser testing)

## Global Commands
- /new-project — Apply scaffolding rules
- /security-check — Verify no secrets exposed
- /pre-commit — Run all quality gates
```

---

## Quick Reference

| Tool | Purpose | Location |
|------|---------|----------|
| Global CLAUDE.md | Security + Scaffolding | `~/.claude/CLAUDE.md` |
| Project CLAUDE.md | Architecture + Commands | `./CLAUDE.md` |
| MCP Servers | External integrations | `claude mcp add` |
| Context7 | Live documentation | `claude mcp add context7` |
| Slash Commands | Workflow automation | `.claude/commands/*.md` |
| **Skills** | **Packaged expertise** | `.claude/skills/*/SKILL.md` |
| **Hooks** | **Deterministic enforcement** | `~/.claude/settings.json` |
| Sub-Agents | Isolated context | Spawn via commands |
| `/clear` | Reset context | Type in chat |
| `/init` | Generate project CLAUDE.md | Type in chat |

---

## GitHub Repo

All templates, hooks, and skills from this guide are available:

**[github.com/TheDecipherist/claude-code-mastery](https://github.com/TheDecipherist/claude-code-mastery)**

What's included:
- Complete CLAUDE.md templates (global + project)
- Ready-to-use hooks (block-secrets.py, end-of-turn.sh, etc.)
- Example skills (commit-messages, security-audit)
- settings.json with hooks pre-configured

---

## Sources

- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices) — Anthropic
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) — Anthropic
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic
- [Agent Skills Documentation](https://code.claude.com/docs/en/skills) — Claude Code Docs
- [Hooks Reference](https://code.claude.com/docs/en/hooks) — Claude Code Docs
- [Claude Project Scaffolding](https://github.com/madison-hutson/claude-project-scaffolding) — Madison Hutson
- [CLAUDE.md Templates](https://github.com/ruvnet/claude-flow/wiki/CLAUDE-MD-Templates) — Claude-Flow
- [Context7 MCP Server](https://github.com/upstash/context7) — Upstash
- [Context Rot Research](https://research.trychroma.com/context-rot) — Chroma
- [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/pdf/2505.06120) — arXiv
- [Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices) — Backslash
- [Claude Code Hooks: Guardrails That Actually Work](https://paddo.dev/blog/claude-code-hooks-guardrails/) — Paddo.dev
- [Claude Code Hooks Mastery](https://github.com/disler/claude-code-hooks-mastery) — GitHub
- [Claude loads secrets without permission](https://www.knostic.ai/blog/claude-loads-secrets-without-permission) — Knostic
- [Slash Commands Documentation](https://code.claude.com/docs/en/slash-commands) — Claude Code Docs
- [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md) — HumanLayer
- [Context Management Guide](https://www.arsturn.com/blog/beyond-prompting-a-guide-to-managing-context-in-claude-code) — Arsturn
- [CLAUDE.md Best Practices from Prompt Learning](https://arize.com/blog/claude-md-best-practices-learned-from-optimizing-claude-code-with-prompt-learning/) — Arize

---

*What's in your global CLAUDE.md? Share your hooks, skills, and patterns below.*
