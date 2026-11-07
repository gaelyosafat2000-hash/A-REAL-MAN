# Economía — fuente única de verdad

> Valores provisionales del MVP. Cualquier número del código o de las skills debe salir de aquí.
> Cambiar un valor: edita esta tabla → migración/seed → tests → línea en `decisions.md`.

## Monedas

| Moneda | Tipo                       | Se obtiene                       | MVP     |
| ------ | -------------------------- | -------------------------------- | ------- |
| Oro    | blanda, solo se gana       | misiones, rachas, subir de nivel | Sí      |
| Gemas  | premium (compra en tienda) | compra in-app, eventos           | No (v2) |

## XP por nivel

`xpToNextLevel(n) = round(100 * n^1.5)` — implementación: `src/features/character/xp.ts`

| Nivel | XP al siguiente |
| ----- | --------------- |
| 1     | 100             |
| 5     | 1118            |
| 10    | 3162            |

## Recompensa base por misión (faucet)

| Dificultad | XP  | Oro | Límite por día |
| ---------- | --- | --- | -------------- |
| Trivial    | 10  | 2   | —              |
| Fácil      | 25  | 5   | —              |
| Media      | 50  | 10  | —              |
| Difícil    | 100 | 20  | 3              |
| Épica      | 250 | 50  | 1              |

- Tope diario de misiones auto-reportadas: **500 XP y 100 oro** por usuario.
- Subir de nivel: **20 × nuevo nivel** de oro.

## Bonus

- Racha: **+2 % XP por día**, máximo **+30 %**.
- Equipo y clase: bonus porcentuales.
- Los bonus se **suman** y se aplican una vez: `xp_final = round(xp_base * (1 + Σbonus))`, con **Σbonus ≤ 0.5**.

## Precios (sinks)

| Rareza     | Precio (oro) | Días de un jugador típico\* |
| ---------- | ------------ | --------------------------- |
| Común      | 50           | 1–2                         |
| Poco común | 150          | 3–5                         |
| Rara       | 500          | 1–2 semanas                 |
| Épica      | 1500         | 4–6 semanas                 |
| Legendaria | 5000         | 3–5 meses                   |

| Otros sinks        | Precio (oro) |
| ------------------ | ------------ |
| Protector de racha | 100          |
| Cambio de clase    | 300          |

\*Jugador típico ≈ **40 oro/día** (4 misiones mixtas). Objetivo semanal: gasto/ingreso entre **0.7 y 0.9**.
