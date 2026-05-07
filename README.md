> ## ✨ MDD — Manual-Driven Development: standalone package
>
> MDD turns Claude Code into a structured development partner: every feature starts with documentation, every fix starts with an audit. **21 modes** covering build, audit, planning, ops runbooks, and more — all via `/mdd` in any Claude Code session.
>
> **Install:** `npm install -g @thedecipherist/mdd && mdd install`
>
> [GitHub →](https://github.com/TheDecipherist/mdd) &nbsp;·&nbsp; [npm →](https://www.npmjs.com/package/@thedecipherist/mdd)

> ## 🚀 NEW 2-14-2026: [Claude Code Mastery Starter Kit](https://thedecipherist.github.io/claude-code-mastery-project-starter-kit/?utm_source=github&utm_medium=readme&utm_campaign=claude-code-mastery&utm_content=starter-kit-banner)
>
> Everything from V1–V5 baked into a production-ready project template. 16 slash commands, deterministic hook enforcement, a battle-tested MongoDB wrapper, live AI monitoring, and three-layer security — all wired up and ready to clone. **Stop configuring, start building.**


# Claude Code Mastery V2 (Obsolete)

The complete guide to maximizing Claude Code: Global CLAUDE.md, MCP Servers, Commands, Hooks, Skills, and Why Single-Purpose Chats Matter.

**This version is obsolete by now. Please use the new Claude Code Mastery Starter Kit instead**

Previous versions:

[V5](https://thedecipherist.com/articles/claude-code-guide-v5/?utm_source=github&utm_medium=readme&utm_campaign=claude-code-v5&utm_content=update)

[V4](https://thedecipherist.com/articles/claude-code-guide-v4/?utm_source=github&utm_medium=repo&utm_campaign=claude-code-mastery&utm_content=v4-banner)

[V3](https://thedecipherist.github.io/claude-code-mastery/?utm_source=github&utm_medium=readme&utm_campaign=claude-code-mastery&utm_content=hero-cta)


---

> **TL;DR:** Your global `~/.claude/CLAUDE.md` is a security gatekeeper AND project scaffolding blueprint. MCP servers extend Claude's capabilities. Custom commands automate workflows. **Hooks enforce rules deterministically** (where CLAUDE.md can fail). Skills package reusable expertise. And research shows mixing topics in a single chat causes **39% performance degradation**.

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [The Guide](#-the-guide)
- [Repository Contents](#-repository-contents)
- [Installation](#-installation)
- [Contributing](#-contributing)
- [Sources](#-sources)

---

## 🚀 Quick Start

```bash
# Clone this repo
git clone https://github.com/TheDecipherist/claude-code-mastery.git
cd claude-code-mastery

# Copy hooks to your Claude config
mkdir -p ~/.claude/hooks
cp hooks/* ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh

# Copy the settings template (review and customize first!)
cp templates/settings.json ~/.claude/settings.json

# Copy skills
mkdir -p ~/.claude/skills
cp -r skills/* ~/.claude/skills/
```

---

## 📖 The Guide

**[📱 Read V3 on GitHub Pages](https://thedecipherist.github.io/claude-code-mastery/?utm_source=github&utm_medium=readme&utm_campaign=claude-code-mastery&utm_content=guide-section)** | [📄 View GUIDE.md (V3)](./GUIDE.md)

### What's Covered

| Part | Topic | Key Takeaway |
|------|-------|--------------|
| 1 | Global CLAUDE.md as Security Gatekeeper | Define once, inherit everywhere |
| 2 | Project Scaffolding Rules | Every project follows same structure |
| 3 | MCP Servers | External tool integrations |
| 4 | Context7 | Live documentation access |
| 5 | Custom Commands | Workflow automation |
| 6 | Single-Purpose Chats | 39% degradation from topic mixing |
| **7** | **Skills & Hooks** | **Enforcement over suggestion** |

---

## 📁 Repository Contents

```
claude-code-mastery/
├── GUIDE.md                    # The complete guide
├── templates/
│   ├── global-claude.md        # ~/.claude/CLAUDE.md template
│   ├── project-claude.md       # ./CLAUDE.md starter
│   ├── settings.json           # Hook configuration template
│   └── .gitignore              # Recommended .gitignore
├── hooks/
│   ├── block-secrets.py        # PreToolUse: Block .env access
│   ├── block-dangerous-commands.sh  # PreToolUse: Block rm -rf, etc.
│   ├── end-of-turn.sh          # Stop: Quality gates
│   ├── after-edit.sh           # PostToolUse: Run formatters
│   └── notify.sh               # Notification: Desktop alerts
├── skills/
│   ├── commit-messages/        # Generate conventional commits
│   │   └── SKILL.md
│   └── security-audit/         # Security vulnerability checks
│       └── SKILL.md
└── commands/
    ├── new-project.md          # /new-project scaffold
    ├── security-check.md       # /security-check audit
    └── pre-commit.md           # /pre-commit quality gates
```

---

## 🔧 Installation

### Prerequisites

- [Claude Code](https://code.claude.com) installed
- Python 3.8+ (for Python hooks)
- `jq` (for JSON parsing in shell hooks)

### Step-by-Step

#### 1. Install Hooks

```bash
# Create hooks directory
mkdir -p ~/.claude/hooks

# Copy hook scripts
cp hooks/block-secrets.py ~/.claude/hooks/
cp hooks/block-dangerous-commands.sh ~/.claude/hooks/
cp hooks/end-of-turn.sh ~/.claude/hooks/

# Make shell scripts executable
chmod +x ~/.claude/hooks/*.sh
```

#### 2. Configure Settings

```bash
# If you don't have settings.json yet
cp templates/settings.json ~/.claude/settings.json

# If you already have settings.json, merge the hooks section manually
```

#### 3. Install Skills

```bash
# Create skills directory
mkdir -p ~/.claude/skills

# Copy skills
cp -r skills/* ~/.claude/skills/
```

#### 4. Set Up Global CLAUDE.md

```bash
# Copy template
cp templates/global-claude.md ~/.claude/CLAUDE.md

# Customize with your details
$EDITOR ~/.claude/CLAUDE.md
```

#### 5. Verify Installation

```bash
# Start Claude Code
claude

# Check hooks are loaded
/hooks

# Check skills are loaded
/skills
```

---

## 🔒 Why Hooks Matter

CLAUDE.md rules are **suggestions**. Hooks are **enforcement**.

```
CLAUDE.md saying "don't edit .env"
  → Parsed by LLM
  → Weighed against other context
  → Maybe followed

PreToolUse hook blocking .env edits
  → Always runs
  → Returns exit code 2
  → Operation blocked. Period.
```

Real-world example from a community member:

> "My PreToolUse hook blocks Claude from accessing secrets (.env files) a few times per week. Claude does not respect CLAUDE.md rules very rigorously."

### Hook Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success, allow operation |
| 1 | Error (shown to user only) |
| **2** | **Block operation, feed stderr to Claude** |

---

## 🧠 Why Single-Purpose Chats

Research consistently shows topic mixing destroys accuracy:

| Study | Finding |
|-------|---------|
| [Multi-turn conversations](https://arxiv.org/pdf/2505.06120) | **39% performance drop** when mixing topics |
| [Context rot](https://research.trychroma.com/context-rot) | Recall decreases as context grows |
| [Context pollution](https://kurtiskemple.com/blog/measuring-context-pollution/) | 2% early misalignment → 40% failure rate |

**Golden Rule: One Task, One Chat**

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add your hooks, skills, or improvements
4. Submit a PR with description

### Ideas for Contributions

- [ ] More language-specific hooks (Go, Rust, Ruby)
- [ ] Additional skills (code review, documentation, testing)
- [ ] Framework-specific scaffolding templates
- [ ] MCP server configuration examples

---

## 📚 Sources

### Official Documentation
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Anthropic
- [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic
- [Agent Skills](https://code.claude.com/docs/en/skills) — Claude Code Docs
- [Hooks Reference](https://code.claude.com/docs/en/hooks) — Claude Code Docs

### Research
- [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/pdf/2505.06120) — arXiv
- [Context Rot Research](https://research.trychroma.com/context-rot) — Chroma
- [Claude Loads Secrets Without Permission](https://www.knostic.ai/blog/claude-loads-secrets-without-permission) — Knostic

### Community
- [Claude Code Hooks: Guardrails That Actually Work](https://paddo.dev/blog/claude-code-hooks-guardrails/)
- [Claude Code Hooks Mastery](https://github.com/disler/claude-code-hooks-mastery)
- [Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices)

---

## 📄 License

MIT License - See [LICENSE](./LICENSE)

---

*Built with ❤️ by [TheDecipherist](https://thedecipherist.com?utm_source=github&utm_medium=readme&utm_campaign=claude-code-mastery&utm_content=author-link) and the Claude Code community*
