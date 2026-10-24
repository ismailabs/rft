-- Rehearse in an isolated database before applying to the empty hosted RFT project.
-- Unconstrained NUMERIC plus scale/bounds CHECKs rejects excess precision instead
-- of the silent rounding performed by NUMERIC(18,2) input coercion.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.session_allowed() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null
    and exists (select 1 from auth.users u where u.id = auth.uid())
    and exists (select 1 from auth.identities i where i.user_id = auth.uid() and i.provider = 'google')
    and exists (select 1 from auth.sessions s where s.user_id = auth.uid()
      and s.id::text = auth.jwt()->>'session_id'
      and (s.not_after is null or s.not_after > now()))
    and (coalesce(auth.jwt()->>'aal','aal1') = 'aal2'
      or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified'));
$$;
revoke all on function private.session_allowed() from public, anon;
grant execute on function private.session_allowed() to authenticated;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text not null default 'en' check(locale in ('en','ms')),
  created_at timestamptz not null default now()
);
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check(length(trim(name)) between 1 and 60),
  type text not null check(type in ('cash','bank','ewallet')),
  provider text not null default '' check(length(provider) <= 60),
  opening_balance numeric not null default 0 check(scale(opening_balance) <= 2 and abs(opening_balance) <= 9999999999999999.99),
  opened_at timestamptz not null check(isfinite(opened_at)),
  archived boolean not null default false,
  unique(user_id,id)
);
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check(length(trim(name)) between 1 and 60),
  type text not null check(type in ('income','expense')),
  archived boolean not null default false,
  unique(user_id,id), unique(user_id,id,type), unique(user_id,name,type)
);
create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null,
  name text not null check(length(trim(name)) between 1 and 60),
  archived boolean not null default false,
  foreign key(user_id,category_id) references public.categories(user_id,id),
  unique(user_id,id,category_id), unique(user_id,category_id,name)
);
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null,
  category_id uuid not null,
  subcategory_id uuid,
  type text not null check(type in ('income','expense')),
  amount numeric not null check(amount > 0 and amount <= 9999999999999999.99 and scale(amount) <= 2),
  occurred_at timestamptz not null check(isfinite(occurred_at)),
  note text not null default '' check(length(note) <= 300),
  planned boolean,
  foreign key(user_id,account_id) references public.accounts(user_id,id),
  foreign key(user_id,category_id,type) references public.categories(user_id,id,type),
  foreign key(user_id,subcategory_id,category_id) references public.subcategories(user_id,id,category_id)
);
create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid not null,
  destination_id uuid not null,
  amount numeric not null check(amount > 0 and amount <= 9999999999999999.99 and scale(amount) <= 2),
  occurred_at timestamptz not null check(isfinite(occurred_at)),
  note text not null default '' check(length(note) <= 300),
  check(source_id <> destination_id),
  foreign key(user_id,source_id) references public.accounts(user_id,id),
  foreign key(user_id,destination_id) references public.accounts(user_id,id)
);
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null,
  category_type text not null default 'expense' check(category_type = 'expense'),
  month date not null check(extract(day from month)=1 and isfinite(month)),
  amount numeric not null check(amount > 0 and amount <= 9999999999999999.99 and scale(amount) <= 2),
  foreign key(user_id,category_id,category_type) references public.categories(user_id,id,type),
  unique(user_id,category_id,month)
);
create index accounts_owner on public.accounts(user_id);
create index subcategories_parent on public.subcategories(user_id,category_id);
create index transactions_owner_time on public.transactions(user_id,occurred_at);
create index transactions_account on public.transactions(user_id,account_id);
create index transactions_category on public.transactions(user_id,category_id,type);
create index transactions_subcategory on public.transactions(user_id,subcategory_id,category_id);
create index transfers_owner_time on public.transfers(user_id,occurred_at);
create index transfers_source on public.transfers(user_id,source_id);
create index transfers_destination on public.transfers(user_id,destination_id);

do $$ declare t text; begin
  foreach t in array array['profiles','accounts','categories','subcategories','transactions','transfers','budgets'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from anon, authenticated',t);
    execute format('grant select,insert,update,delete on public.%I to authenticated',t);
    execute format('create policy owner on public.%I for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id)',t);
    execute format('create policy assurance on public.%I as restrictive for all to authenticated using ((select private.session_allowed()) is true) with check ((select private.session_allowed()) is true)',t);
  end loop;
end $$;

create function private.history_guard() returns trigger
language plpgsql set search_path = '' as $$
declare a public.accounts; b public.accounts;
begin
  if tg_table_name='accounts' then
    -- Locking the account row serializes concurrent entry/opening-date changes.
    if (new.opening_balance,new.opened_at) is distinct from (old.opening_balance,old.opened_at)
      and (exists(select 1 from public.transactions where account_id=old.id)
        or exists(select 1 from public.transfers where source_id=old.id or destination_id=old.id))
    then raise exception 'OPENING_HAS_HISTORY' using errcode='23514'; end if;
    return new;
  end if;
  if tg_table_name='transactions' then
    select * into a from public.accounts where id=new.account_id and user_id=new.user_id for update;
    if a.id is null or new.occurred_at < a.opened_at or a.archived then raise exception 'ACCOUNT_NOT_ACTIVE_AT_TIME' using errcode='23514'; end if;
    if not exists(select 1 from public.categories where id=new.category_id and user_id=new.user_id and type=new.type and not archived)
      or (new.subcategory_id is not null and not exists(select 1 from public.subcategories where id=new.subcategory_id and user_id=new.user_id and category_id=new.category_id and not archived))
    then raise exception 'CATEGORY_NOT_ACTIVE' using errcode='23514'; end if;
  else
    -- Canonical lock order prevents transfer deadlocks between opposite accounts.
    perform 1 from public.accounts where id in (new.source_id,new.destination_id) and user_id=new.user_id order by id for update;
    select * into a from public.accounts where id=new.source_id and user_id=new.user_id;
    select * into b from public.accounts where id=new.destination_id and user_id=new.user_id;
    if a.id is null or b.id is null or a.archived or b.archived or new.occurred_at < a.opened_at or new.occurred_at < b.opened_at
    then raise exception 'ACCOUNT_NOT_ACTIVE_AT_TIME' using errcode='23514'; end if;
  end if;
  return new;
end $$;
revoke all on function private.history_guard() from public, anon, authenticated;
create trigger account_history before update on public.accounts for each row execute function private.history_guard();
create trigger transaction_history before insert or update on public.transactions for each row execute function private.history_guard();
create trigger transfer_history before insert or update on public.transfers for each row execute function private.history_guard();

-- One snapshot statement; explicitly serialize all money as decimal text.
create function public.finance_snapshot() returns jsonb
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
    'budgets',coalesce((select jsonb_agg(to_jsonb(b) - 'user_id' - 'category_type' || jsonb_build_object('amount',b.amount::text)) from public.budgets b),'[]'::jsonb)
  );
end $$;
revoke all on function public.finance_snapshot() from public, anon;
grant execute on function public.finance_snapshot() to authenticated;

-- Idempotent first-run taxonomy initialization is one transaction and owner scoped.
create function public.initialize_profile(chosen_locale text default 'en') returns void
language plpgsql security invoker set search_path = '' as $$
begin
  if private.session_allowed() is not true then raise exception 'UNAUTHENTICATED' using errcode='42501'; end if;
  if chosen_locale not in ('en','ms') then raise exception 'INVALID_LOCALE'; end if;
  insert into public.profiles(user_id,locale) values(auth.uid(),chosen_locale) on conflict do nothing;
  perform 1 from public.profiles where user_id=auth.uid() for update;
  if exists(select 1 from public.categories where user_id=auth.uid()) then return; end if;
  insert into public.categories(user_id,name,type)
  select auth.uid(),case when chosen_locale='ms' then name_ms else name_en end,type from (values
    ('Salary','Gaji','income'),('Freelance','Kerja bebas','income'),('Gift','Hadiah','income'),('Other income','Pendapatan lain','income'),
    ('Food & drinks','Makanan & minuman','expense'),('Groceries','Barangan dapur','expense'),('Petrol & tolls','Petrol & tol','expense'),('Transport','Pengangkutan','expense'),('Bills','Bil','expense'),('Rent','Sewa','expense'),('Subscriptions','Langganan','expense'),('Personal','Peribadi','expense'),('Healthcare','Kesihatan','expense'),('Education','Pendidikan','expense'),('Other expenses','Perbelanjaan lain','expense')
  ) as defaults(name_en,name_ms,type) on conflict(user_id,name,type) do nothing;
end $$;
revoke all on function public.initialize_profile(text) from public, anon;
grant execute on function public.initialize_profile(text) to authenticated;
