-- Additive, optional manually recorded savings goals. No ledger/balance mutation.
-- Existing tables, rows, policies and migrations remain intact. Rehearse locally.
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check(length(trim(name)) between 1 and 60),
  target_amount numeric not null check(target_amount > 0 and target_amount <= 9999999999999999.99 and scale(target_amount) <= 2),
  saved_amount numeric not null default 0 check(saved_amount >= 0 and saved_amount <= 9999999999999999.99 and scale(saved_amount) <= 2),
  target_date date check(target_date is null or isfinite(target_date)),
  created_at timestamptz not null default now()
);
create index goals_owner on public.goals(user_id);
alter table public.goals enable row level security;
revoke all on public.goals from public, anon, authenticated;
grant select,insert,update,delete on public.goals to authenticated;
create policy owner on public.goals for all to authenticated
  using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy assurance on public.goals as restrictive for all to authenticated
  using ((select private.session_allowed()) is true)
  with check ((select private.session_allowed()) is true);

create or replace function public.finance_snapshot() returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
begin
  if private.session_allowed() is not true then raise exception 'UNAUTHENTICATED' using errcode='42501'; end if;
  return jsonb_build_object(
    'locale',coalesce((select locale from public.profiles where user_id=auth.uid()),'en'),
    'accounts',coalesce((select jsonb_agg(to_jsonb(a) - 'user_id' || jsonb_build_object('opening_balance',a.opening_balance::text)) from public.accounts a),'[]'::jsonb),
    'categories',coalesce((select jsonb_agg(to_jsonb(c) - 'user_id') from public.categories c),'[]'::jsonb),
    'subcategories',coalesce((select jsonb_agg(to_jsonb(c) - 'user_id') from public.subcategories c),'[]'::jsonb),
    'transactions',coalesce((select jsonb_agg(to_jsonb(t) - 'user_id' || jsonb_build_object('amount',t.amount::text)) from public.transactions t),'[]'::jsonb),
    'transfers',coalesce((select jsonb_agg(to_jsonb(t) - 'user_id' || jsonb_build_object('amount',t.amount::text)) from public.transfers t),'[]'::jsonb),
    'budgets',coalesce((select jsonb_agg(to_jsonb(b) - 'user_id' - 'category_type' || jsonb_build_object('amount',b.amount::text)) from public.budgets b),'[]'::jsonb),
    'goals',coalesce((select jsonb_agg(to_jsonb(g) - 'user_id' || jsonb_build_object('target_amount',g.target_amount::text,'saved_amount',g.saved_amount::text)) from public.goals g),'[]'::jsonb)
  );
end $$;
revoke all on function public.finance_snapshot() from public, anon;
grant execute on function public.finance_snapshot() to authenticated;
