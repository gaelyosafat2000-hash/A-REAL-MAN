/**
 * Curva de XP de referencia (provisional — la fuente de verdad será docs/economy.md).
 * XP necesaria para pasar del nivel `level` al siguiente.
 */
export function xpToNextLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new RangeError('level debe ser un entero >= 1');
  }
  return Math.round(100 * Math.pow(level, 1.5));
}
