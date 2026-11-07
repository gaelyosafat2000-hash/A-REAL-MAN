---
name: rpg-economy
description: Equilibra y protege la economía de Life RPG (XP, oro, gemas, recompensas, precios, tienda, topes, inflación, trampas). Úsala al añadir o cambiar cualquier recompensa, precio o fuente/sumidero de moneda.
---

# Economía

Fuente única de números: `docs/economy.md`. Esta skill define **cómo** cambiarlos, no los valores.

## Principios

1. **Servidor autoritativo:** toda concesión pasa por una única función SQL `grant_reward(...)` (skill `backend-architect`). El cliente nunca suma XP ni oro.
2. **Idempotencia:** cada recompensa tiene `(source, source_id)` único → completar dos veces no paga dos veces.
3. **Faucets ≈ sinks:** objetivo semanal gasto/ingreso entre 0.7 y 0.9 para un jugador típico.
4. **Topes diarios** para todo lo auto-reportado (valores en `docs/economy.md`).
5. **Sin pay-to-win:** lo comprable con dinero real (gemas, suscripción) es cosmético o de comodidad.

## Procedimiento: nueva recompensa o precio

1. Clasifica: ¿faucet (crea moneda) o sink (destruye moneda)?
2. Calcula el impacto con `references/balancing.md` (días para comprar, ratio semanal).
3. Si rompe un objetivo, ajusta el valor o añade un sink equivalente.
4. Actualiza la tabla en `docs/economy.md` + una línea en `docs/decisions.md`.
5. Implementa en servidor (migración/seed) con tests de: valor correcto, idempotencia y tope diario.
6. Revisa los riesgos de `references/anti-cheat.md`.

## Ejemplo

Petición: «dar 30 oro por completar 7 días de racha».

- Faucet nuevo: +30 oro/semana ≈ +4.3 oro/día sobre ~40 → +11 % de ingreso.
- El ratio semanal baja de ~0.8 a ~0.72: sigue en rango. Aceptable.
- `source = 'streak_7'`, `source_id = '<user>:<semana ISO>'` → no se cobra dos veces la misma semana.
- Entrega: fila en `docs/economy.md`, migración, 3 tests (valor, idempotencia, semana distinta sí paga).
