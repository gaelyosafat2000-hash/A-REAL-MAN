// Stop: si hay código modificado, ejecuta typecheck + lint + tests relacionados.
// Si algo falla, devuelve el error (recortado) a Claude para que lo corrija.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { readInput, projectDir } from './lib.mjs';

const input = await readInput();
if (input.stop_hook_active) process.exit(0); // evita bucles infinitos

let changed = [];
try {
  const out = execFileSync('git', ['status', '--porcelain', '-uall'], {
    cwd: projectDir,
    encoding: 'utf8',
  });
  changed = out
    .split('\n')
    .filter(Boolean)
    .map((l) => l.slice(3).trim().replace(/^"|"$/g, '').split(' -> ').pop())
    .filter((f) => /\.(ts|tsx|js|jsx)$/.test(f) && !f.startsWith('.claude/'))
    .filter((f) => fs.existsSync(path.join(projectDir, f))); // ignora archivos borrados
} catch {
  process.exit(0); // sin git no verificamos
}
if (changed.length === 0) process.exit(0);

const bin = (pkg, file) => path.join(projectDir, 'node_modules', pkg, file);
const steps = [
  ['typecheck', [bin('typescript', 'bin/tsc'), '--noEmit']],
  ['lint', [bin('eslint', 'bin/eslint.js'), '--max-warnings=0', ...changed]],
  [
    'tests',
    [
      bin('jest', 'bin/jest.js'),
      '--ci',
      '--silent',
      '--passWithNoTests',
      '--findRelatedTests',
      ...changed,
    ],
  ],
];

const failures = [];
for (const [name, args] of steps) {
  const r = spawnSync(process.execPath, args, { cwd: projectDir, encoding: 'utf8' });
  if (r.status !== 0) {
    const out = `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n').slice(-30).join('\n');
    failures.push(`## ${name} falló\n${out}`);
  }
}

if (failures.length) {
  process.stderr.write(
    `Verificación automática (stop-check) encontró errores:\n\n${failures.join('\n\n')}\n`,
  );
  process.exit(2);
}
process.exit(0);
