---
name: rpg-leaderboard
description: Diseña e implementa rankings de Life RPG (temporadas, ligas, amigos, empates, privacidad, anti-trampas y consultas SQL eficientes). Úsala al tocar clasificaciones, temporadas o puntuaciones competitivas.
---

# Rankings

## Diseño

- **Temporadas de 4 semanas.** Se clasifica por XP ganada en la temporada (no total) → los nuevos pueden competir.
- **MVP:** ranking global + ranking de amigos. Ligas de ~30 jugadores: post-MVP.
- **Empates:** gana quien alcanzó la puntuación antes (`reached_at` ascendente).
- **Privacidad:** participación opt-in; se muestra alias y avatar, **nunca** nombres de hábitos ni datos reales.
- **Premios de temporada:** solo cosméticos (items legendarios, títulos).

## Implementación

- Tabla `season_scores(season_id, user_id, score, reached_at)`, actualizada **dentro** de `grant_reward` (misma transacción).
- Índice `(season_id, score desc, reached_at asc)`.
- Lectura por RPC: top 100 + posición propia. Sin Realtime: se recarga al enfocar la pantalla (menos costo).
- SQL de ejemplo: `references/sql.md`.

## Anti-trampas

- La XP auto-reportada ya tiene tope diario (`docs/economy.md`).
- Quien gane en un día > 3 × el percentil 99 queda marcado y oculto hasta revisión.

## Procedimiento

1. Decide alcance (global/amigos/liga) y periodo.
2. Migración: tabla/índice o RPC (skill `backend-architect`) con RLS: solo filas opt-in.
3. Tests: orden, empates, opt-out oculto, cambio de temporada.
4. UI: lista virtualizada con la posición propia fija abajo (skill `mobile-design`).

## Ejemplo

Petición: «ranking de amigos de la temporada actual».

- RPC `friends_leaderboard(season_id)`: `security definer`, filtra por `auth.uid()`, amistades aceptadas y opt-in.
- Tests: un amigo con opt-out no aparece; un empate se ordena por `reached_at`.
