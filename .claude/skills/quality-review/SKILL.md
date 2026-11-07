---
name: quality-review
description: Revisión de calidad específica de Life RPG antes de dar por terminado un cambio (reglas del juego, economía en servidor, RLS, accesibilidad, rendimiento, tests). Úsala al terminar una funcionalidad, antes de un commit o PR, o cuando pidan "revisa", "verifica" o "está listo".
---

# Revisión de calidad

Esta skill cubre lo **propio de Life RPG**. Para bugs genéricos usa `/code-review`; para seguridad profunda, `/security-review`. No dupliques esas revisiones.

## Procedimiento

1. Alcance: `git status` y `git diff --stat`; lee solo los archivos cambiados.
2. Automático: `npm run check` (tipos, lint, formato, tests). Si falla, para y arréglalo primero.
3. Lista de comprobación (marca solo lo que aplique al cambio):

| Área         | Comprobación                                                                             |
| ------------ | ---------------------------------------------------------------------------------------- |
| Juego        | Ningún cálculo de XP/oro/inventario en el cliente; números tomados de `docs/economy.md`. |
| Idempotencia | Toda recompensa nueva tiene `(source, source_id)` único y test de «no paga dos veces».   |
| Backend      | Tablas nuevas con RLS; funciones `security definer` con `search_path = ''` y permisos.   |
| Secretos     | Nada sensible en `EXPO_PUBLIC_*`, en el código ni en los logs.                           |
| UI           | Tokens de `theme.ts`, objetivos ≥ 44 pt, `accessibilityLabel`, reducir movimiento.       |
| Rendimiento  | Listas largas virtualizadas; sin trabajo pesado en render; imágenes con `expo-image`.    |
| Tests        | Lógica nueva con test; casos límite (cero, tope, cambio de día/zona horaria).            |
| Docs         | `docs/schema.md`, `docs/economy.md` o `docs/decisions.md` actualizados si aplica.        |

4. Si el cambio toca auth, pagos, economía o datos personales → recomienda `/security-review`.

## Formato de salida (≤ 15 líneas)

```
Veredicto: LISTO | CAMBIOS NECESARIOS
check: ✅/❌
[ALTA|MEDIA|BAJA] ruta:línea — problema → arreglo
```

## Ejemplo

```
Veredicto: CAMBIOS NECESARIOS
check: ✅
[ALTA] src/features/quests/complete.ts:42 — suma XP en el cliente → llamar RPC complete_quest
[MEDIA] supabase/migrations/20261110_quests.sql:18 — falta índice en quests(user_id)
[BAJA] src/components/QuestCard.tsx:30 — icono sin accessibilityLabel
```
