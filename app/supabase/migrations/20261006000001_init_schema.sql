-- Pigxel: esquema inicial (Fase 5)
-- Montos: bigint en colones enteros. Todas las tablas con RLS por usuario.

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ───────── Perfiles y ajustes (1 fila por usuario, creada por trigger) ─────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text not null default '',
  email text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'CRC' check (currency in ('CRC','USD','EUR','GBP')),
  language text not null default 'es' check (language in ('es','en','pt','fr','de')),
  appearance text not null default 'system' check (appearance in ('light','dark','system')),
  limit_enabled boolean not null default false,
  limit_amount bigint not null default 0 check (limit_amount >= 0),
  limit_period text not null default 'monthly' check (limit_period in ('weekly','monthly')),
  notify_subscriptions boolean not null default true,
  notify_goals boolean not null default true,
  notify_limit boolean not null default true,
  notify_activity boolean not null default false,
  notify_news boolean not null default true,
  notify_email boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger user_settings_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();

-- ───────── Datos financieros ─────────
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  description text check (description is null or char_length(description) <= 120),
  icon text not null default 'bank'
    check (icon in ('bank','cash','credit-card','shopping-cart','money-bag','coffee','car')),
  initial_amount bigint not null default 0 check (initial_amount >= 0),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  icon text
    check (icon is null or icon in ('bank','cash','credit-card','shopping-cart','money-bag','coffee','car')),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);
create unique index categories_user_name_uq on public.categories (user_id, lower(name));

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  account_id uuid not null,
  category_id uuid,
  type text not null check (type in ('income','expense')),
  title text not null default '' check (char_length(title) <= 120),
  amount bigint not null check (amount > 0),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  -- cuenta y categoría deben pertenecer al mismo usuario
  foreign key (account_id, user_id) references public.accounts (id, user_id) on delete cascade,
  foreign key (category_id, user_id) references public.categories (id, user_id)
    on delete set null (category_id)
);
create index transactions_user_date_idx on public.transactions (user_id, occurred_at desc);
create index transactions_account_idx on public.transactions (account_id);
create index transactions_category_idx on public.transactions (category_id);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  cost bigint not null default 0 check (cost >= 0),
  status text not null default 'active' check (status in ('active','inactive')),
  plan text not null default 'monthly' check (plan in ('weekly','monthly','yearly')),
  next_charge_at date not null default current_date,
  created_at timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  target_amount bigint not null check (target_amount > 0),
  current_amount bigint not null default 0 check (current_amount >= 0),
  created_at timestamptz not null default now()
);
create index goals_user_idx on public.goals (user_id);
create index accounts_user_idx on public.accounts (user_id);

-- Saldo por cuenta = inicial + ingresos - gastos (se calcula, no se guarda)
create view public.account_balances with (security_invoker = true) as
select a.id as account_id,
       a.user_id,
       (a.initial_amount + coalesce(sum(case t.type when 'income' then t.amount else -t.amount end), 0))::bigint as balance
from public.accounts a
left join public.transactions t on t.account_id = a.id
group by a.id, a.user_id, a.initial_amount;

-- ───────── Alta de usuario: perfil, ajustes y categorías por defecto ─────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_local text := split_part(coalesce(new.email, ''), '@', 1);
  v_name text := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), v_local);
begin
  insert into public.profiles (id, full_name, username, email)
  values (new.id, v_name, v_local, coalesce(new.email, ''));

  insert into public.user_settings (user_id) values (new.id);

  insert into public.categories (user_id, name, icon) values
    (new.id, 'Alimentación', 'coffee'),
    (new.id, 'Transporte', 'car'),
    (new.id, 'Entretenimiento', null),
    (new.id, 'Compras', 'shopping-cart'),
    (new.id, 'Salud', null),
    (new.id, 'Educación', null),
    (new.id, 'Hogar', null),
    (new.id, 'Otros', null);
  return new;
end $$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────── Seguridad: RLS ─────────
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy user_settings_select_own on public.user_settings
  for select to authenticated using (user_id = (select auth.uid()));
create policy user_settings_update_own on public.user_settings
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

do $$
declare t text;
begin
  foreach t in array array['accounts','categories','transactions','subscriptions','goals'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for all to authenticated
         using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
      t || '_own', t);
  end loop;
end $$;

-- Sin acceso anónimo a nada de public
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from anon;
grant select on public.account_balances to authenticated;
