import { xpToNextLevel } from './xp';

describe('xpToNextLevel', () => {
  it('nivel 1 requiere 100 XP', () => {
    expect(xpToNextLevel(1)).toBe(100);
  });

  it('crece con el nivel', () => {
    expect(xpToNextLevel(10)).toBeGreaterThan(xpToNextLevel(9));
  });

  it('rechaza niveles inválidos', () => {
    expect(() => xpToNextLevel(0)).toThrow(RangeError);
  });
});
