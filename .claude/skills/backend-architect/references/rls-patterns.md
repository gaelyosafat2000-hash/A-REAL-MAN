# Plantillas de RLS

```sql
alter table public.<tabla> enable row level security;

-- Datos propios: leer y escribir solo lo mío (tablas NO económicas: perfil, ajustes, notas)
create policy "<tabla>_select_own" on public.<tabla>
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "<tabla>_insert_own" on public.<tabla>
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "<tabla>_update_own" on public.<tabla>
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Tablas económicas (wallets, inventory, rewards_ledger, season_scores):
-- solo política de SELECT propia. Las escrituras van por funciones security definer.

-- Catálogo público de solo lectura (items, seasons)
create policy "<tabla>_read_all" on public.<tabla>
  for select to authenticated using (true);
```

Notas:

- `(select auth.uid())` en lugar de `auth.uid()` → Postgres lo evalúa una vez por consulta (más rápido).
- Nunca `to anon` salvo datos públicos intencionados.
- Comprueba con el MCP en solo lectura que no hay tablas sin RLS: `select tablename from pg_tables where schemaname = 'public' and not rowsecurity;`
