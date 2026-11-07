#!/usr/bin/env node
// Auditoría de contexto de Life RPG. Solo lee archivos; no modifica nada.
// Uso: node .claude/skills/token-manager/scripts/context-audit.mjs
// Sale con código 1 si hay errores (frontmatter inválido); los avisos no fallan.
import fs from 'node:fs';
import path from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const LIMITS = {
  claudeMdLines: 60,
  alwaysLoadedChars: 8000, // CLAUDE.md + AGENTS.md
  skillLines: 120,
  descriptionChars: 400,
  dupMinChars: 40,
};

const tokens = (chars) => Math.round(chars / 4); // aproximación
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const rel = (p) => path.relative(root, p).split(path.sep).join('/');
const list = (dir, filter) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter(filter)
        .map((f) => path.join(dir, f))
    : [];

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return fm;
}

const warnings = [];
const errors = [];
const rows = [];

// 1. Siempre cargado
const claudeMd = read(path.join(root, 'CLAUDE.md'));
const agentsMd = read(path.join(root, 'AGENTS.md'));
const claudeLines = claudeMd.split('\n').length;
rows.push(['CLAUDE.md', 'siempre', claudeMd.length]);
rows.push(['AGENTS.md (importado)', 'siempre', agentsMd.length]);
if (claudeLines > LIMITS.claudeMdLines)
  warnings.push(`CLAUDE.md tiene ${claudeLines} líneas (máx. ${LIMITS.claudeMdLines}).`);
if (claudeMd.length + agentsMd.length > LIMITS.alwaysLoadedChars)
  warnings.push(`CLAUDE.md + AGENTS.md ≈ ${tokens(claudeMd.length + agentsMd.length)} tokens.`);

// 2. Skills
const skillDirs = list(path.join(root, '.claude', 'skills'), () => true).filter((d) =>
  fs.statSync(d).isDirectory(),
);
let descTotal = 0;
for (const dir of skillDirs) {
  const file = path.join(dir, 'SKILL.md');
  const text = read(file);
  const fm = text && frontmatter(text);
  if (!fm?.name || !fm?.description) {
    errors.push(`${rel(file)}: falta frontmatter name/description.`);
    continue;
  }
  if (fm.name !== path.basename(dir))
    errors.push(`${rel(file)}: name "${fm.name}" ≠ carpeta "${path.basename(dir)}".`);
  if (fm.description.length > LIMITS.descriptionChars)
    warnings.push(`${rel(file)}: descripción de ${fm.description.length} caracteres.`);
  const lines = text.split('\n').length;
  if (lines > LIMITS.skillLines)
    warnings.push(`${rel(file)}: ${lines} líneas; mueve detalle a references/.`);
  descTotal += fm.description.length;
  rows.push([`skill ${fm.name}`, 'al usarla', text.length]);
}

// 3. Agentes
for (const file of list(path.join(root, '.claude', 'agents'), (f) => f.endsWith('.md'))) {
  const text = read(file);
  const fm = frontmatter(text);
  if (!fm?.name || !fm?.description) {
    errors.push(`${rel(file)}: falta frontmatter name/description.`);
    continue;
  }
  if (`${fm.name}.md` !== path.basename(file))
    errors.push(`${rel(file)}: name "${fm.name}" ≠ archivo.`);
  descTotal += fm.description.length;
  rows.push([`agente ${fm.name}`, 'al delegar', text.length]);
}
rows.push(['descripciones skills+agentes', 'siempre', descTotal]);

// 4. Duplicados entre fuentes de instrucciones
const sources = [
  path.join(root, 'CLAUDE.md'),
  path.join(root, 'AGENTS.md'),
  ...skillDirs.map((d) => path.join(d, 'SKILL.md')),
  ...list(path.join(root, '.claude', 'agents'), (f) => f.endsWith('.md')),
  ...list(path.join(root, 'docs'), (f) => f.endsWith('.md')),
];
const seen = new Map();
for (const file of sources) {
  const inCode = { v: false };
  const body = read(file).replace(/^---\r?\n[\s\S]*?\r?\n---/, ''); // sin frontmatter
  for (const raw of body.split('\n')) {
    if (raw.trim().startsWith('```')) inCode.v = !inCode.v;
    if (inCode.v) continue;
    const norm = raw
      .toLowerCase()
      .replace(/[`*_>#|-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (norm.length < LIMITS.dupMinChars) continue;
    const files = seen.get(norm) || new Set();
    files.add(rel(file));
    seen.set(norm, files);
  }
}
for (const [line, files] of seen)
  if (files.size > 1)
    warnings.push(`Línea duplicada en ${[...files].join(', ')}: "${line.slice(0, 80)}…"`);

// Informe
console.log('Contexto de Life RPG (≈ tokens = caracteres / 4)\n');
for (const [name, when, chars] of rows)
  console.log(
    `${name.padEnd(30)} ${when.padEnd(11)} ≈ ${String(tokens(chars)).padStart(5)} tokens`,
  );
console.log(
  `\nCarga fija por sesión ≈ ${tokens(claudeMd.length + agentsMd.length + descTotal)} tokens (sin plugins).`,
);
if (warnings.length) console.log(`\nAvisos (${warnings.length}):\n- ${warnings.join('\n- ')}`);
if (errors.length) console.log(`\nErrores (${errors.length}):\n- ${errors.join('\n- ')}`);
if (!warnings.length && !errors.length) console.log('\nSin avisos.');
process.exit(errors.length ? 1 : 0);
