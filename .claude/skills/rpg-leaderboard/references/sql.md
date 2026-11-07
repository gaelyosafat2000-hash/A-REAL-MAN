# SQL de referencia (Postgres / Supabase)

```sql
create table public.season_scores (
  season_id  int  not null references public.seasons (id),
  user_id    uuid not null references auth.users (id) on delete cascade,
  score      int  not null default 0 check (score >= 0),
  reached_at timestamptz not null default now(),
  primary key (season_id, user_id)
);
alter table public.season_scores enable row level security;
-- Sin políticas de escritura: solo grant_reward (security definer) escribe aquí.

create index season_scores_rank_idx
  on public.season_scores (season_id, score desc, reached_at asc);

-- Top N + posición propia
create or replace function public.season_leaderboard(p_season int, p_limit int default 100)
returns table (user_id uuid, alias text, score int, rank_position bigint)
language sql stable security definer set search_path = ''
as $$
  with ranked as (
    select s.user_id, p.alias, s.score,
           rank() over (order by s.score desc, s.reached_at asc) as rank_position
    from public.season_scores s
    join public.profiles p on p.id = s.user_id and p.leaderboard_opt_in
    where s.season_id = p_season
  )
  select * from ranked
  where rank_position <= least(p_limit, 100) or user_id = (select auth.uid())
  order by rank_position;
$$;
revoke execute on function public.season_leaderboard(int, int) from public, anon;
grant execute on function public.season_leaderboard(int, int) to authenticated;
```
