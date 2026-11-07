# Life RPG

App móvil gamificada de desarrollo personal (Expo + React Native + TypeScript).
Las reglas generales de Expo están en @AGENTS.md. Aquí solo va lo propio de Life RPG.

## Stack

- Expo SDK 58 · Expo Router (`src/app/` = solo pantallas) · TypeScript estricto
- Backend previsto: Supabase (Auth, Postgres, RLS). Pagos previstos: RevenueCat.
- Tests: jest-expo + @testing-library/react-native. Formato: Prettier. Lint: eslint-config-expo.

## Comandos

- `npm run check` → typecheck + lint + formato + tests (obligatorio antes de dar algo por terminado)
- `npm test -- <ruta>` → tests de un archivo · `npm run audit` → vulnerabilidades altas

## Estructura

- `src/app/` pantallas y layouts · `src/features/<dominio>/` lógica + tests junto al código
- `src/components/` UI compartida · `src/lib/` clientes (supabase, etc.)
- `supabase/migrations/` migraciones SQL (nunca editar una ya aplicada; crear otra nueva)

## Reglas del juego (no negociables)

- XP, monedas, inventario y rankings se calculan en el SERVIDOR (funciones Postgres + RLS).
  El cliente solo muestra y solicita; nunca suma recompensas por su cuenta.
- Cada fórmula vive en un solo sitio. Fuente de verdad de números: `docs/economy.md`.

## Contexto (ahorro de tokens)

- No leas `docs/` completo: abre solo el archivo que la tarea necesita (índice en `docs/README.md`).
- Usa Grep/Glob antes de abrir archivos grandes; cita `ruta:línea` en vez de copiar bloques.
- Decisiones de arquitectura → una línea en `docs/decisions.md`.
- Al cerrar una sesión larga → resumen breve en `docs/sessions/AAAA-MM-DD.md`.

## Seguridad

- Nunca leas ni edites `.env*` (excepto `.env.example`). Secretos solo vía variables de entorno.
- Solo `EXPO_PUBLIC_*` llega al cliente: jamás pongas ahí claves de servicio.

## Skills y agentes

- Skills en `.claude/skills/` (se cargan solo al usarlas). Agentes en `.claude/agents/`: solo para tareas de varios pasos; lo simple se hace directamente.
- Tras añadir o cambiar una skill, agente o este archivo → `npm run audit:context`.
