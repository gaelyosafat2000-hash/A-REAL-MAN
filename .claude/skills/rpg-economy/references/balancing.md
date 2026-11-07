# Balance rápido (sin hojas de cálculo)

Variable del jugador típico (en `docs/economy.md`): ingreso diario `I` (oro/día).

- **Días para comprar** un item de precio `P`: `D = P / I`. Compáralo con la columna objetivo de la tabla de precios.
- **Nuevo faucet** de `F` oro cada `T` días: `I' = I + F/T`. Recalcula `D` para todas las rarezas.
- **Ratio semanal** = `gasto_semanal / (7 * I')`. Fuera de 0.7–0.9 → ajustar.
- **XP:** días para subir del nivel `n` = `xpToNextLevel(n) / XP_diaria`. Objetivo: niveles 1–5 en ≤ 1 semana; nivel 10 en ~1 mes.

## Señales de alarma

- Un item raro comprable en < 3 días → precio bajo o faucet excesivo.
- Oro medio acumulado > 10 × `I` sin gastar → faltan sinks atractivos.
- Un solo tipo de misión aporta > 50 % del ingreso → farmeo probable.
