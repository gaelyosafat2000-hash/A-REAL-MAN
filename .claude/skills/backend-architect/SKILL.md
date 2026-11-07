---
name: backend-architect
description: Arquitectura de backend de Life RPG en Supabase (esquema Postgres, RLS, funciones security definer, migraciones, índices, cliente Supabase, recompensas en servidor). Úsala al crear tablas, políticas, RPCs o migraciones.
---

# Backend (Supabase)

## Convenciones

- Tablas `snake_case` en plural, en `public`. Toda tabla de usuario lleva `user_id uuid references auth.users on delete cascade`.
- **RLS activado en todas las tablas**, sin excepción. Plantillas: `references/rls-patterns.md`.
- Lo que toca la economía (XP, oro, inventario, rankings) **no tiene políticas de escritura**: solo se modifica desde funciones `security definer` con `set search_path = ''`. Ejemplo completo: `references/grant-reward.sql.md`.
- Funciones: `revoke execute ... from public, anon` y `grant execute ... to authenticated`; dentro, validar `(select auth.uid())`.
- Índices para toda columna usada en `where`/`order by` de consultas frecuentes y para cada clave foránea.

## Migraciones

- Archivo nuevo en `supabase/migrations/<AAAAMMDDHHMMSS>_<nombre>.sql`. **Nunca** se edita una migración existente (el hook lo bloquea).
- El MCP de Supabase es de **solo lectura**: Claude escribe el SQL; tú lo aplicas con `npx supabase db push` (o en el panel) en el proyecto de desarrollo.
- Después de cada migración, actualiza `docs/schema.md` (tabla, propósito, políticas; 1–3 líneas).

## Cliente

- Un único cliente en `src/lib/supabase.ts` con `EXPO_PUBLIC_SUPABASE_URL` y la clave anónima. **Nunca** la clave `service_role` en la app.
- El cliente llama RPCs (`supabase.rpc('complete_quest', { p_quest_id })`) en vez de escribir tablas de economía.

## Procedimiento: nueva tabla o RPC

1. Lee `docs/schema.md` (solo la sección relacionada).
2. Escribe la migración: tabla + RLS + políticas + índices (o función + permisos).
3. Escribe tests SQL (pgTAP con `supabase test db` si hay entorno local; si no, tests de integración contra el proyecto de desarrollo).
4. Actualiza `docs/schema.md` y los tipos (`npx supabase gen types typescript`).
5. Pide revisión al agente `security-auditor` si la migración toca economía, auth o datos personales.

## Ejemplo

Petición: «tabla de inventario».

- `inventory(id, user_id, item_id, equipped_slot, acquired_at)`, único `(user_id, item_id)`.
- RLS: `select` solo propias; sin `insert/update/delete` para clientes → compras vía RPC `buy_item` (transacción: saldo, descuento, inserción).
- Índice `(user_id)`. Tests: no puedo leer el inventario de otro; comprar sin saldo falla; comprar dos veces no duplica.
