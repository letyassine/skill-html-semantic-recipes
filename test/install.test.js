'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  AGENTS,
  parseSkillName,
  parseArgs,
  detectAgents,
  selectAgents,
  targetsFor,
  isSkillContent,
  skillSourceEntries,
  installSkill,
  uninstallSkill,
  confirm,
} = require('../bin/install.js');

const SKILL_NAME = parseSkillName();

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-install-'));
  return {
    root,
    home: path.join(root, 'home'),
    configHome: path.join(root, 'config'),
    cwd: path.join(root, 'project'),
    cleanup() {
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

test('parseSkillName reads the frontmatter name', () => {
  assert.strictEqual(SKILL_NAME, 'html-semantic-recipes');
  assert.match(SKILL_NAME, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test('parseSkillName falls back on a package without SKILL.md', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'no-skill-'));
  try {
    assert.strictEqual(parseSkillName(empty), 'html-semantic-recipes');
  } finally {
    fs.rmSync(empty, { recursive: true, force: true });
  }
});

test('detectAgents finds only agents whose marker dirs exist', () => {
  const sb = makeSandbox();
  try {
    fs.mkdirSync(path.join(sb.home, '.claude'), { recursive: true });
    fs.mkdirSync(path.join(sb.home, '.cursor'), { recursive: true });
    const found = detectAgents(sb).map((a) => a.id);
    assert.ok(found.includes('claude-code'));
    assert.ok(found.includes('cursor'));
    assert.ok(!found.includes('goose'));
    assert.ok(!found.includes('windsurf'));
  } finally {
    sb.cleanup();
  }
});

test('selectAgents rejects unknown ids and accepts known ones', () => {
  assert.throws(() => selectAgents(['nope']), /Unknown agent/);
  const picked = selectAgents(['claude-code', 'opencode']);
  assert.deepStrictEqual(
    picked.map((a) => a.id),
    ['claude-code', 'opencode']
  );
  assert.strictEqual(selectAgents([]), null);
});

test('targetsFor dedupes agents sharing ~/.agents/skills', () => {
  const sb = makeSandbox();
  try {
    const agents = selectAgents(['codex', 'warp', 'cline', 'claude-code']);
    const targets = targetsFor('global', agents, sb);
    const universal = path.join(sb.home, '.agents', 'skills');
    assert.ok(targets.includes(universal));
    assert.ok(targets.includes(path.join(sb.home, '.claude', 'skills')));
    assert.strictEqual(targets.length, 2);
    assert.strictEqual(new Set(targets).size, targets.length);
  } finally {
    sb.cleanup();
  }
});

test('targetsFor falls back to the universal folder when nothing is detected', () => {
  const sb = makeSandbox();
  try {
    assert.deepStrictEqual(targetsFor('global', [], sb), [
      path.join(sb.home, '.agents', 'skills'),
    ]);
    assert.deepStrictEqual(targetsFor('project', [], sb), [
      path.join(sb.cwd, '.agents', 'skills'),
    ]);
  } finally {
    sb.cleanup();
  }
});

test('skill package content excludes tooling files', () => {
  const entries = skillSourceEntries();
  assert.ok(entries.includes('SKILL.md'));
  assert.ok(entries.includes('references'));
  assert.ok(!entries.includes('bin'));
  assert.ok(!entries.includes('package.json'));
  assert.ok(!entries.includes('test'));
  assert.ok(!isSkillContent(path.join(__dirname, 'package.json')));
});

test('installSkill copies a working skill folder and is idempotent', () => {
  const sb = makeSandbox();
  try {
    const target = path.join(sb.home, '.claude', 'skills');
    const first = installSkill(target, { skillName: SKILL_NAME });
    assert.strictEqual(first.action, 'installed');
    assert.ok(fs.existsSync(path.join(first.path, 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(first.path, 'references', 'recipes.md')));
    assert.ok(!fs.existsSync(path.join(first.path, 'package.json')));
    assert.ok(!fs.existsSync(path.join(first.path, 'bin')));

    const second = installSkill(target, { skillName: SKILL_NAME });
    assert.strictEqual(second.action, 'updated');

    const removed = uninstallSkill(target, { skillName: SKILL_NAME });
    assert.strictEqual(removed.action, 'removed');
    assert.ok(!fs.existsSync(first.path));

    const again = uninstallSkill(target, { skillName: SKILL_NAME });
    assert.strictEqual(again.action, 'absent');
  } finally {
    sb.cleanup();
  }
});

test('installSkill --link symlinks back to the package', () => {
  const sb = makeSandbox();
  try {
    const target = path.join(sb.cwd, '.agents', 'skills');
    const result = installSkill(target, { skillName: SKILL_NAME, link: true });
    assert.strictEqual(result.action, 'linked');
    assert.ok(fs.lstatSync(result.path).isSymbolicLink());
    assert.ok(fs.existsSync(path.join(result.path, 'SKILL.md')));
    const removed = uninstallSkill(target, { skillName: SKILL_NAME });
    assert.strictEqual(removed.action, 'removed');
  } finally {
    sb.cleanup();
  }
});

test('parseArgs understands the documented flags', () => {
  const opts = parseArgs(['--project', '-a', 'claude-code,opencode', '-y', '--link']);
  assert.strictEqual(opts.scope, 'project');
  assert.deepStrictEqual(opts.agents, ['claude-code', 'opencode']);
  assert.strictEqual(opts.yes, true);
  assert.strictEqual(opts.link, true);

  assert.strictEqual(parseArgs(['--uninstall']).uninstall, true);
  assert.strictEqual(parseArgs(['--dry-run']).dryRun, true);
  assert.strictEqual(parseArgs(['--help']).help, true);
  assert.throws(() => parseArgs(['--bogus']), /Unknown option/);
  assert.throws(() => parseArgs(['-a']), /requires a value/);
});

test('confirm resolves answers, defaults, and EOF without hanging', async () => {
  const { PassThrough } = require('stream');
  const sink = new PassThrough();
  sink.resume();

  const yn = new PassThrough();
  const answered = confirm('ok? ', yn, sink);
  yn.write('n\n');
  assert.strictEqual(await answered, 'n');

  const eof = new PassThrough();
  const onEof = confirm('ok? ', eof, sink);
  eof.end();
  assert.strictEqual(await onEof, '');
});

test('every declared agent has the required shape', () => {
  const ids = new Set();
  for (const agent of AGENTS) {
    assert.match(agent.id, /^[a-z0-9-]+$/);
    assert.ok(agent.label.length > 0);
    assert.ok(typeof agent.detect === 'function');
    assert.ok(typeof agent.globalDir === 'function');
    assert.ok(typeof agent.projectDir === 'string');
    assert.ok(!ids.has(agent.id), `duplicate id ${agent.id}`);
    ids.add(agent.id);
  }
});
