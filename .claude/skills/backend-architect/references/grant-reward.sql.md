# `grant_reward`: punto único de concesión

Esqueleto; los valores (topes, bonus) salen de `docs/economy.md` y se guardan en una tabla de configuración, no en el código.

```sql
create table public.rewards_ledger (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  source     text not null,             -- 'quest', 'streak_7', 'level_up'...
  source_id  text not null,             -- incluye el periodo: '<quest_id>:2026-11-07'
  xp         int  not null check (xp >= 0),
  gold       int  not null check (gold >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, source, source_id)   -- idempotencia
);
alter table public.rewards_ledger enable row level security;
create policy "ledger_select_own" on public.rewards_ledger
  for select to authenticated using ((select auth.uid()) = user_id);
create index rewards_ledger_user_day_idx on public.rewards_ledger (user_id, created_at);

-- Interna: no se expone a clientes. La llaman RPCs como complete_quest.
create or replace function public.grant_reward(
  p_user uuid, p_source text, p_source_id text, p_xp int, p_gold int
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  v_inserted int;
begin
  -- 1. Tope diario de auto-reporte (valores desde public.economy_config)
  -- 2. Bonus: xp_final = round(p_xp * (1 + least(sum_bonus, max_bonus)))
  insert into public.rewards_ledger (user_id, source, source_id, xp, gold)
  values (p_user, p_source, p_source_id, p_xp, p_gold)
  on conflict (user_id, source, source_id) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    return false;                       -- ya se había pagado
  end if;
  -- 3. Actualizar wallet, nivel y season_scores en la misma transacción
  return true;
end;
$$;
revoke execute on function public.grant_reward(uuid, text, text, int, int) from public, anon, authenticated;
```

Las RPCs públicas (`complete_quest`, `buy_item`) validan `(select auth.uid())`, calculan la recompensa en servidor y llaman a `grant_reward`.
