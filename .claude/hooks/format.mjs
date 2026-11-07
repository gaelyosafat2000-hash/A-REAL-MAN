// PostToolUse (Edit|Write|MultiEdit): formatea con Prettier solo el archivo editado.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { readInput, relPath, projectDir } from './lib.mjs';

const input = await readInput();
const rel = relPath(input.tool_input?.file_path);
if (!rel || !/\.(ts|tsx|js|jsx|mjs|cjs|json|md|css|ya?ml)$/.test(rel)) process.exit(0);

const prettierBin = path.join(projectDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
if (!fs.existsSync(prettierBin)) process.exit(0);

try {
  execFileSync(
    process.execPath,
    [prettierBin, '--write', '--ignore-unknown', '--log-level', 'warn', rel],
    {
      cwd: projectDir,
      stdio: ['ignore', 'ignore', 'pipe'],
    },
  );
} catch {
  // Un error de sintaxis lo detectará typecheck/lint en el hook Stop; no bloqueamos aquí.
}
process.exit(0);
