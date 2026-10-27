# html-semantic-recipes — Agent Skill

[![npm version](https://img.shields.io/npm/v/skill-html-semantic-recipes.svg)](https://www.npmjs.com/package/skill-html-semantic-recipes)

> Semantic HTML5 markup recipes for common UI components, packaged as an agent skill.

This skill teaches an AI coding agent to generate accessible, semantic HTML markup for common UI components — adapted automatically for **HTML, React, Vue, Angular, Svelte, and Astro**. It is the agent-skill counterpart of the [HTML Semantic Recipes](https://github.com/letyassine/vsc-html-semantic-recipes) VS Code extension.

## What's Inside

```
skill-html-semantic-recipes/
├── SKILL.md                 # Skill entrypoint: routing rules, framework adaptation table
├── references/
│   └── recipes.md           # Full copy-paste markup for all 11 recipes × 6 frameworks
├── bin/
│   └── install.js           # Zero-dependency installer CLI (npx skill-html-semantic-recipes)
├── test/
│   └── install.test.js      # Installer smoke tests (node --test)
├── package.json             # npm package: bin, files, agents.skills metadata
├── README.md
└── LICENSE
```

- **`SKILL.md`** — loaded when the skill triggers. Contains the recipe index, framework adaptation rules, and semantic-element guidance.
- **`references/recipes.md`** — progressive-disclosure reference with complete markup for every recipe and framework variant.
- **`bin/install.js`** — detects your installed agents and copies (or links) the skill into their skills folders.

## Recipes (11)

| Recipe                | Component                                          |
| --------------------- | -------------------------------------------------- |
| `breadcrumbs`         | Hierarchical path navigation                       |
| `nav`                 | Primary site/menu navigation                       |
| `card`                | Content card (`article` + header/body/footer)      |
| `cardlist`            | Ordered collection of cards                        |
| `datalist`            | Key-value details (`dl`/`dt`/`dd`)                 |
| `checkboxlist`        | Grouped checkboxes (`fieldset`/`legend`)           |
| `formbasic`           | Standard contact form                              |
| `formvalidation`      | Form with inline validation messages               |
| `formvalidationsummary` | Form with error summary + inline errors          |
| `login`               | Username/password auth form                        |
| `accordion`           | Expandable sections (`details`/`summary`)          |

## Framework Coverage

| Framework | Adaptations                                                        |
| --------- | ------------------------------------------------------------------ |
| HTML      | Baseline semantic markup                                           |
| React     | `className`, `htmlFor`, `autoComplete`, `.map()`                   |
| Vue       | `router-link`, `v-model`, `v-for`, `@submit.prevent`, `v-if`       |
| Angular   | `[routerLink]`, `[(ngModel)]`, `(ngSubmit)`, `*ngIf`, `*ngFor`      |
| Svelte    | `bind:value`, `bind:group`, `on:submit\|preventDefault`, `{#each}` |
| Astro     | `{items.map()}`, standard HTML, code-fence notes                   |

## Install

### One-liner (npm) — recommended

```bash
npx skill-html-semantic-recipes
```

Detects your installed agents (Claude Code, OpenCode, Cursor, Codex, Copilot, Gemini CLI, …) and copies the skill into their global skills folders. No agents detected? It falls back to `~/.agents/skills`, which most agents read natively.

```bash
npx skill-html-semantic-recipes --project        # install into the current repo only
npx skill-html-semantic-recipes -a claude-code,opencode -y   # specific agents, no prompt
npx skill-html-semantic-recipes --dry-run        # preview targets, change nothing
npx skill-html-semantic-recipes --uninstall      # remove it again
npx skill-html-semantic-recipes --help           # all options
```

### As an npm dependency (stays in sync)

```bash
npm install -D skill-html-semantic-recipes
npx skill-html-semantic-recipes --project --link
```

`--link` symlinks the skill to this package, so `npm update` refreshes the skill too. Ecosystem tools also pick the package up automatically — a root `SKILL.md` is one of the [npm skill discovery locations](https://github.com/antfu/skills-npm/blob/main/PROPOSAL.md), and the package declares `agents.skills` metadata:

```bash
npx skills experimental_sync -y   # vercel-labs/skills CLI (experimental)
npx skills-npm                    # antfu/skills-npm: symlinks into detected agents
```

### With the Skills CLI (GitHub)

```bash
npx skills add letyassine/skill-html-semantic-recipes -g
```

### Manual

Copy this directory into your agent's skills folder:

```bash
# opencode
cp -r skill-html-semantic-recipes ~/.agents/skills/html-semantic-recipes

# Claude Code / Claude Desktop
cp -r skill-html-semantic-recipes ~/.claude/skills/html-semantic-recipes
```

> The folder name must match the skill's frontmatter `name` (`html-semantic-recipes`).

## When the Agent Uses It

The skill triggers when a user asks to:

- Build cards, navigation, breadcrumbs, accordions, or definition lists
- Create forms with validation, login forms, or checkbox groups
- Write "semantic HTML" or "accessible markup"
- Generate UI skeletons in any of the six supported frameworks

## Design Principles

1. **Semantic elements first** — `article`, `nav`, `fieldset`, `dl`, `details` over `div` soup
2. **Accessibility built in** — labels, `aria-live`, `aria-describedby`, `role="alert"`
3. **Minimal styling hooks** — only class names where structurally necessary
4. **Framework-agnostic structure** — same semantic skeleton, adapted syntax

## Development

```bash
npm test           # installer smoke tests (node --test, zero dependencies)
npm pack --dry-run # preview what would be published
```

## Releasing (maintainers)

```bash
npm test
npm version patch  # or minor / major
npm publish
git push --follow-tags
```

After the first publish the package is installable by everyone with `npx skill-html-semantic-recipes`.

## License

MIT
