---
name: rpg-character
description: Diseña o modifica el personaje de Life RPG (atributos, niveles, curva de XP, clases, equipo, armaduras, rarezas). Úsala al crear o cambiar stats, slots de equipo, items o la progresión de nivel.
---

# Personaje

Números (XP, precios, topes de bonus): **solo** en `docs/economy.md`. No los copies aquí ni en el código; impórtalos.

## Modelo

| Atributo    | Área de vida real | Sube con misiones de       |
| ----------- | ----------------- | -------------------------- |
| Vitalidad   | salud física      | ejercicio, sueño, agua     |
| Intelecto   | aprendizaje       | estudio, lectura           |
| Disciplina  | hábitos           | rachas, rutinas            |
| Carisma     | social            | relaciones, comunidad      |
| Creatividad | proyectos         | arte, proyectos personales |

- Atributos: enteros 1–100. Nivel global derivado de la XP total (`src/features/character/xp.ts`).
- Clase: se elige al nivel 5 y da un bonus de XP a un atributo. Cambiarla cuesta oro (sink).
- Equipo y rarezas: `references/equipment.md` (léelo solo si la tarea toca items).

## Reglas

1. El servidor es dueño de XP, nivel, atributos e inventario. El cliente solo lee y solicita.
2. El equipo da cosmética o calidad de vida; nunca bloquea progreso real (no pay-to-win).
3. Todos los bonus respetan la fórmula y el tope de `docs/economy.md` (se suman, no se multiplican).

## Procedimiento: nuevo atributo, item o clase

1. Lee solo la sección necesaria de `docs/economy.md` y `docs/schema.md`.
2. Describe el cambio en `docs/game-design.md` (1–3 líneas).
3. Si cambia un número → primero `docs/economy.md`.
4. Migración nueva (skill `backend-architect`) + tipos en `src/features/character/types.ts`.
5. Tests: unidad para fórmulas del cliente (solo visualización) y SQL para la función de servidor.
6. `npm run check`.

## Ejemplo

Petición: «armadura "Capa del Madrugador": +5 % XP en misiones completadas antes de las 8:00».

- Slot `cape`, rareza `rare`, bonus `{ "type": "xp_pct", "value": 0.05, "condition": { "before_hour": 8 } }`.
- Comprobar que con racha máxima + clase + capa no se supera el tope de bonus.
- Precio: el de rareza `rare` en `docs/economy.md`.
- Entrega: fila seed en `items`, test del cálculo con y sin condición, hora evaluada en la zona horaria del usuario.
