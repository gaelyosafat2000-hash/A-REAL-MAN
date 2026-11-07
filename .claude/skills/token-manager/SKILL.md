---
name: token-manager
description: Mantiene el contexto de Life RPG pequeño y sin contradicciones (resúmenes de sesión, poda de CLAUDE.md, auditoría de duplicados entre CLAUDE.md, skills, agentes y docs). Úsala al cerrar una sesión larga, al añadir o cambiar una skill/agente, o si CLAUDE.md crece.
---

# Gestión de tokens y contexto

Única skill autorizada a editar `CLAUDE.md`.

## Fuente única por tema

| Tema                              | Vive en                   |
| --------------------------------- | ------------------------- |
| Reglas de Expo                    | `AGENTS.md`               |
| Reglas del proyecto (cada sesión) | `CLAUDE.md` (≤ 60 líneas) |
| Números del juego                 | `docs/economy.md`         |
| Esquema de datos                  | `docs/schema.md`          |
| Decisiones                        | `docs/decisions.md`       |
| Procedimientos                    | `.claude/skills/*`        |
| Roles                             | `.claude/agents/*`        |

Si algo aparece en dos sitios: déjalo en su fuente y sustituye la copia por una referencia (`ver docs/economy.md`).

## A. Auditoría (al añadir/cambiar skills, agentes o CLAUDE.md)

1. `node .claude/skills/token-manager/scripts/context-audit.mjs`
2. Corrige cada aviso: tamaño excesivo → mover detalle a `references/`; línea duplicada → dejar una sola fuente; nombre ≠ carpeta → renombrar.
3. Busca contradicciones entre las líneas que el script lista como similares (p. ej. dos valores distintos para el mismo tope).

## B. Resumen de sesión (al cerrar una sesión larga)

Crea `docs/sessions/AAAA-MM-DD.md` (≤ 20 líneas):

```
# AAAA-MM-DD — <tema>
Objetivo: …
Hecho: … (commits: abc123)
Decisiones: → copiadas a docs/decisions.md
Pendiente: …
Archivos clave: ruta, ruta
```

Para retomar, lee solo el último resumen, no todo el historial.

## C. Poda de CLAUDE.md

- Solo entra lo que hace falta en **todas** las sesiones. Lo demás → `docs/` o una skill.
- Mantener ≤ 60 líneas. Sin ejemplos largos ni bloques de código.

## Ejemplo

El script avisa: «línea duplicada en CLAUDE.md y rpg-economy/SKILL.md: "El cliente nunca suma XP ni oro"».
→ Se mantiene en `CLAUDE.md` (regla de todas las sesiones); en la skill se sustituye por «ver regla de servidor en CLAUDE.md».
