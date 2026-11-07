// Utilidades compartidas por los hooks. Sin dependencias externas.
import path from 'node:path';

export async function readInput() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

/** Ruta relativa al proyecto con barras normales ('' si está fuera del proyecto). */
export function relPath(filePath) {
  if (!filePath) return '';
  const rel = path
    .relative(projectDir, path.resolve(projectDir, filePath))
    .split(path.sep)
    .join('/');
  return rel.startsWith('..') ? '' : rel;
}
