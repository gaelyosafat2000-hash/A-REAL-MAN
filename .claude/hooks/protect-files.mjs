// PreToolUse (Edit|Write|MultiEdit|NotebookEdit): evita modificaciones accidentales.
//  - deny: secretos .env*, package-lock.json, migraciones SQL ya existentes
//  - ask:  configuración sensible (app.json, eas.json, .claude/settings.json, hooks)
import fs from 'node:fs';
import path from 'node:path';
import { readInput, relPath, projectDir } from './lib.mjs';

const input = await readInput();
const filePath = input.tool_input?.file_path || input.tool_input?.notebook_path || '';
const rel = relPath(filePath);
if (!rel) process.exit(0); // fuera del proyecto: lo gestiona el sistema de permisos normal

const base = path.posix.basename(rel);
const exists = fs.existsSync(path.resolve(projectDir, rel));

function deny(reason) {
  process.stderr.write(`Bloqueado por protect-files: ${reason}\n`);
  process.exit(2);
}
function ask(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

if (/^\.env/.test(base) && base !== '.env.example') {
  deny(
    `${rel} contiene secretos. Edítalo tú manualmente; usa .env.example para documentar variables.`,
  );
}
if (base === 'package-lock.json') {
  deny('package-lock.json solo debe cambiar vía `npx expo install` o `npm install`.');
}
if (/^supabase\/migrations\/.+\.sql$/.test(rel) && exists) {
  deny(`${rel} es una migración existente. Crea una migración nueva en lugar de editarla.`);
}
if (['app.json', 'app.config.ts', 'eas.json'].includes(rel) || rel.startsWith('.claude/')) {
  ask(`${rel} es configuración sensible del proyecto. ¿Confirmas el cambio?`);
}
process.exit(0);
