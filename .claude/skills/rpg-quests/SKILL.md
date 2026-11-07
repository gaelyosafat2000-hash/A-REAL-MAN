---
name: rpg-quests
description: Diseña e implementa misiones de Life RPG (diarias, semanales, metas, cadenas, rachas, verificación, dificultad y recompensas). Úsala al crear o cambiar tipos de misión, rachas o cómo se completan.
---

# Misiones

Recompensas y topes: `docs/economy.md`. Cálculo de recompensas: skill `rpg-economy`.

## Tipos

| Tipo    | Periodo    | `source_id` de la recompensa |
| ------- | ---------- | ---------------------------- |
| Diaria  | día local  | `<quest_id>:<AAAA-MM-DD>`    |
| Semanal | semana ISO | `<quest_id>:<AAAA-Www>`      |
| Meta    | una vez    | `<quest_id>`                 |
| Cadena  | por paso   | `<quest_id>:<paso>`          |

## Verificación

1. **Auto-reporte** (MVP): sujeto a topes diarios.
2. **Temporizador** (MVP): sesión de foco medida en servidor (`started_at`/`ended_at`) con duración mínima.
3. Evidencia (foto/nota) e integraciones (salud, calendario): post-MVP.

## Rachas

- El día se cierra a medianoche en la **zona horaria del perfil**, evaluado en servidor.
- La racha sigue viva si hubo ≥ 1 misión diaria completada ese día.
- Protector de racha (sink): cubre 1 día perdido, máximo 1 por semana. Precio en `docs/economy.md`.
- Bonus de racha: valor y tope en `docs/economy.md`.

## Procedimiento: nuevo tipo de misión o regla

1. Define periodo, verificación, atributo que sube y dificultades permitidas.
2. Define el `source_id` (tabla de arriba) → garantiza idempotencia.
3. Comprueba los límites por dificultad y día.
4. Migración + función de completado (skill `backend-architect`) + tests: completar, repetir en el mismo periodo (no paga), siguiente periodo (sí paga), cambio de día en otra zona horaria.
5. UI: tarjeta de misión y animación de recompensa (skill `mobile-design`).

## Ejemplo

Petición: «misión semanal "Leer 3 capítulos", atributo Intelecto, dificultad media».

- Semanal, auto-reporte con progreso 0/3; paga al llegar a 3/3.
- `source_id = 'leer-3-capitulos:2026-W45'`.
- Tests: 2/3 no paga; 3/3 paga una vez; 4/3 no vuelve a pagar; la semana W46 empieza en 0.
