#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const PKG_ROOT = path.resolve(__dirname, '..');
const FALLBACK_SKILL_NAME = 'html-semantic-recipes';

// Files/folders that belong to the package, not to an installed skill.
const NOT_SKILL_CONTENT = new Set([
  'bin',
  'test',
  'node_modules',
  'skills',
  'package.json',
  'package-lock.json',
  'npm-debug.log',
  '.git',
  '.gitignore',
  '.npmrc',
  '.DS_Store',
]);

/**
 * Agents that consume Agent Skills.
 * Paths mirror the `skills` CLI (vercel-labs/skills) agent table.
 * Agents that natively read `~/.agents/skills` share that single target so
 * the same skill is never installed twice.
 */
const AGENTS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    detect: ({ home, exists }) => exists(path.join(home, '.claude')),
    globalDir: ({ home }) => path.join(home, '.claude', 'skills'),
    projectDir: '.claude/skills',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    detect: ({ home, configHome, exists }) =>
      exists(path.join(configHome, 'opencode')) || exists(path.join(home, '.opencode')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'codex',
    label: 'Codex',
    detect: ({ home, exists }) => exists(path.join(home, '.codex')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    detect: ({ home, exists }) => exists(path.join(home, '.cursor')),
    globalDir: ({ home }) => path.join(home, '.cursor', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'github-copilot',
    label: 'GitHub Copilot',
    detect: ({ home, exists }) => exists(path.join(home, '.copilot')),
    globalDir: ({ home }) => path.join(home, '.copilot', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'gemini-cli',
    label: 'Gemini CLI',
    detect: ({ home, exists }) => exists(path.join(home, '.gemini')),
    globalDir: ({ home }) => path.join(home, '.gemini', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'qwen-code',
    label: 'Qwen Code',
    detect: ({ home, exists }) => exists(path.join(home, '.qwen')),
    globalDir: ({ home }) => path.join(home, '.qwen', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'amp',
    label: 'Amp',
    detect: ({ configHome, exists }) => exists(path.join(configHome, 'amp')),
    globalDir: ({ configHome }) => path.join(configHome, 'agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'warp',
    label: 'Warp',
    detect: ({ home, exists }) => exists(path.join(home, '.warp')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'zed',
    label: 'Zed',
    detect: ({ configHome, exists }) => exists(path.join(configHome, 'zed')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'cline',
    label: 'Cline',
    detect: ({ home, exists }) => exists(path.join(home, '.cline')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'kilo',
    label: 'Kilo Code',
    detect: ({ home, exists }) =>
      exists(path.join(home, '.kilo')) || exists(path.join(home, '.kilocode')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'droid',
    label: 'Droid',
    detect: ({ home, exists }) => exists(path.join(home, '.factory')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'pi',
    label: 'Pi',
    detect: ({ home, exists }) => exists(path.join(home, '.pi', 'agent')),
    globalDir: ({ home }) => path.join(home, '.agents', 'skills'),
    projectDir: '.agents/skills',
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    detect: ({ home, exists }) => exists(path.join(home, '.codeium', 'windsurf')),
    globalDir: ({ home }) => path.join(home, '.codeium', 'windsurf', 'skills'),
    projectDir: '.windsurf/skills',
  },
  {
    id: 'roo',
    label: 'Roo Code',
    detect: ({ home, exists }) => exists(path.join(home, '.roo')),
    globalDir: ({ home }) => path.join(home, '.roo', 'skills'),
    projectDir: '.roo/skills',
  },
  {
    id: 'goose',
    label: 'Goose',
    detect: ({ configHome, exists }) => exists(path.join(configHome, 'goose')),
    globalDir: ({ configHome }) => path.join(configHome, 'goose', 'skills'),
    projectDir: '.goose/skills',
  },
  {
    id: 'crush',
    label: 'Crush',
    detect: ({ configHome, exists }) => exists(path.join(configHome, 'crush')),
    globalDir: ({ configHome }) => path.join(configHome, 'crush', 'skills'),
    projectDir: '.crush/skills',
  },
  {
    id: 'continue',
    label: 'Continue',
    detect: ({ home, exists }) => exists(path.join(home, '.continue')),
    globalDir: ({ home }) => path.join(home, '.continue', 'skills'),
    projectDir: '.continue/skills',
  },
  {
    id: 'openclaw',
    label: 'OpenClaw',
    detect: ({ home, exists }) =>
      exists(path.join(home, '.openclaw')) ||
      exists(path.join(home, '.clawdbot')) ||
      exists(path.join(home, '.moltbot')),
    globalDir: ({ home, exists }) => {
      for (const dir of ['.openclaw', '.clawdbot', '.moltbot']) {
        if (exists(path.join(home, dir))) return path.join(home, dir, 'skills');
      }
      return path.join(home, '.openclaw', 'skills');
    },
    projectDir: 'skills',
  },
];

function parseSkillName(pkgRoot = PKG_ROOT) {
  try {
    const raw = fs.readFileSync(path.join(pkgRoot, 'SKILL.md'), 'utf8');
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const name = frontmatter && frontmatter[1].match(/^name:\s*(\S+)\s*$/m);
    if (name && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name[1])) return name[1];
  } catch {
    // fall through
  }
  return FALLBACK_SKILL_NAME;
}

function detectAgents({ home, configHome, cwd, exists = fs.existsSync } = {}) {
  const env = { home, configHome, cwd, exists };
  return AGENTS.filter((agent) => agent.detect(env));
}

function selectAgents(requestedIds) {
  if (!requestedIds || requestedIds.length === 0) return null;
  const unknown = requestedIds.filter((id) => !AGENTS.some((agent) => agent.id === id));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown agent${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}\n` +
        `Available: ${AGENTS.map((agent) => agent.id).join(', ')}`
    );
  }
  return AGENTS.filter((agent) => requestedIds.includes(agent.id));
}

/**
 * Resolve install target directories (deduplicated).
 * Falls back to the universal `~/.agents/skills` convention when nothing is detected.
 */
function targetsFor(scope, agents, { home, configHome, cwd, exists = fs.existsSync } = {}) {
  const base = scope === 'project' ? cwd : home;
  const dirs = agents.map((agent) =>
    path.resolve(
      base,
      scope === 'project' ? agent.projectDir : agent.globalDir({ home, configHome, exists })
    )
  );
  const unique = [...new Set(dirs)];
  if (unique.length === 0) unique.push(path.resolve(base, '.agents', 'skills'));
  return unique;
}

function isSkillContent(src) {
  const base = path.basename(src);
  if (NOT_SKILL_CONTENT.has(base)) return false;
  if (base.startsWith('.') && base !== '.') return false;
  return true;
}

function skillSourceEntries(pkgRoot = PKG_ROOT) {
  return fs
    .readdirSync(pkgRoot)
    .filter((entry) => isSkillContent(path.join(pkgRoot, entry)));
}

/**
 * Copy (or link) the skill into `targetDir/<skillName>`.
 * Returns { path, action: 'installed' | 'updated' | 'linked' }.
 */
function installSkill(targetDir, { pkgRoot = PKG_ROOT, skillName, link = false } = {}) {
  const name = skillName || parseSkillName(pkgRoot);
  const dest = path.join(targetDir, name);
  const existed = fs.existsSync(dest) || isSymlink(dest);

  if (link) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.rmSync(dest, { recursive: true, force: true });
    fs.symlinkSync(pkgRoot, dest, process.platform === 'win32' ? 'junction' : 'dir');
    return { path: dest, action: 'linked' };
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(pkgRoot, dest, { recursive: true, filter: isSkillContent });
  return { path: dest, action: existed ? 'updated' : 'installed' };
}

function uninstallSkill(targetDir, { skillName, pkgRoot = PKG_ROOT } = {}) {
  const name = skillName || parseSkillName(pkgRoot);
  const dest = path.join(targetDir, name);
  if (!fs.existsSync(dest) && !isSymlink(dest)) return { path: dest, action: 'absent' };
  fs.rmSync(dest, { recursive: true, force: true });
  return { path: dest, action: 'removed' };
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const opts = {
    scope: 'global',
    agents: [],
    yes: false,
    link: false,
    uninstall: false,
    dryRun: false,
    help: false,
    version: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-g':
      case '--global':
        opts.scope = 'global';
        break;
      case '-p':
      case '--project':
        opts.scope = 'project';
        break;
      case '-a':
      case '--agent': {
        const value = argv[++i];
        if (!value) throw new Error(`${arg} requires a value`);
        opts.agents.push(...value.split(',').map((s) => s.trim()).filter(Boolean));
        break;
      }
      case '-y':
      case '--yes':
        opts.yes = true;
        break;
      case '--link':
        opts.link = true;
        break;
      case '-u':
      case '--uninstall':
        opts.uninstall = true;
        break;
      case '-n':
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '-h':
      case '--help':
        opts.help = true;
        break;
      case '-v':
      case '--version':
        opts.version = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}\nRun with --help for usage.`);
    }
  }
  return opts;
}

const HELP = `skill-html-semantic-recipes — install the HTML Semantic Recipes agent skill

Usage:
  npx skill-html-semantic-recipes [options]

Options:
  -g, --global          Install for all projects (default)
  -p, --project         Install into the current project only
  -a, --agent <ids>     Install only for these agents (comma-separated)
  -y, --yes             Skip confirmation prompts
      --link            Symlink instead of copy (stays in sync when installed
                        as an npm dependency)
  -u, --uninstall       Remove the skill from the selected locations
  -n, --dry-run         Show what would be done, change nothing
  -h, --help            Show this help
  -v, --version         Show the package version

Examples:
  npx skill-html-semantic-recipes
  npx skill-html-semantic-recipes --project --link
  npx skill-html-semantic-recipes -a claude-code,opencode -y
  npx skill-html-semantic-recipes --uninstall

Agents: ${AGENTS.map((a) => a.id).join(', ')}
No supported agent detected? The skill is installed to ~/.agents/skills,
which OpenCode, Codex, Cursor, Zed, Warp, and others read natively.`;

function formatPlan({ scope, agents, targets, skillName, link, uninstall }) {
  const lines = [];
  lines.push(`Scope:    ${scope}`);
  lines.push(
    `Agents:   ${
      agents.length > 0 ? agents.map((a) => a.label).join(', ') : '(none detected — universal fallback)'
    }`
  );
  lines.push(`Skill:    ${skillName}`);
  lines.push(`Mode:     ${uninstall ? 'uninstall' : link ? 'symlink' : 'copy'}`);
  lines.push('Targets:');
  for (const dir of targets) {
    lines.push(`  ${uninstall ? '-' : link ? '~' : '+'} ${path.join(dir, skillName)}`);
  }
  return lines.join('\n');
}

async function confirm(question, input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, output });
  try {
    return await new Promise((resolve) => {
      let answered = false;
      rl.question(question, (answer) => {
        answered = true;
        resolve(answer.trim().toLowerCase());
      });
      // EOF (Ctrl-D) before an answer: fall through to the default.
      rl.on('close', () => {
        if (!answered) resolve('');
      });
    });
  } finally {
    rl.close();
  }
}

async function main(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  const pkg = require(path.join(PKG_ROOT, 'package.json'));

  if (opts.version) {
    process.stdout.write(`${pkg.version}\n`);
    return 0;
  }
  if (opts.help) {
    process.stdout.write(`${HELP}\n`);
    return 0;
  }

  const home = os.homedir();
  const configHome = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
  const cwd = process.cwd();
  const skillName = parseSkillName();

  let agents = opts.agents.length > 0 ? selectAgents(opts.agents) : detectAgents({ home, configHome, cwd });

  if (
    !opts.yes &&
    opts.agents.length === 0 &&
    process.stdin.isTTY &&
    !process.env.SKILLS_ASSUME_YES
  ) {
    process.stdout.write(`Skill: ${skillName} (v${pkg.version})\n`);
    if (agents.length > 0) {
      process.stdout.write(
        `Detected agents:\n${agents.map((a) => `  - ${a.label} (${a.id})`).join('\n')}\n`
      );
    } else {
      process.stdout.write('No supported agent detected; will use the universal ~/.agents/skills folder.\n');
    }
    const answer = await confirm(
      opts.uninstall ? `Uninstall from these locations? [Y/n] ` : `Install to these locations? [Y/n] `
    );
    if (answer === 'n' || answer === 'no') {
      process.stdout.write('Cancelled. Use -a <agent-id> to pick specific agents.\n');
      return 1;
    }
  }

  const targets = targetsFor(opts.scope, agents, { home, configHome, cwd });
  const plan = formatPlan({
    scope: opts.scope,
    agents,
    targets,
    skillName,
    link: opts.link,
    uninstall: opts.uninstall,
  });

  if (opts.dryRun) {
    process.stdout.write(`${plan}\n(dry run — nothing changed)\n`);
    return 0;
  }

  process.stdout.write(`${plan}\n\n`);

  let failures = 0;
  for (const dir of targets) {
    try {
      const result = opts.uninstall
        ? uninstallSkill(dir, { skillName })
        : installSkill(dir, { skillName, link: opts.link });
      const verb = {
        installed: 'Installed',
        updated: 'Updated',
        linked: 'Linked',
        removed: 'Removed',
        absent: 'Already absent',
      }[result.action];
      process.stdout.write(`  ${verb}: ${result.path}\n`);
    } catch (err) {
      failures++;
      process.stdout.write(`  Failed: ${dir} (${err.message})\n`);
    }
  }

  if (failures > 0) return 1;

  if (!opts.uninstall) {
    process.stdout.write(
      '\nDone. Start a new agent session so it picks up the skill.\n' +
        'Tip: add --project to keep it scoped to one repo.\n'
    );
  }
  return 0;
}

module.exports = {
  AGENTS,
  PKG_ROOT,
  parseArgs,
  parseSkillName,
  detectAgents,
  selectAgents,
  targetsFor,
  isSkillContent,
  skillSourceEntries,
  installSkill,
  uninstallSkill,
  confirm,
  main,
};

if (require.main === module) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      process.stderr.write(`${err.message}\n`);
      process.exit(1);
    }
  );
}
