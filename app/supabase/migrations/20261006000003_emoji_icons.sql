-- Íconos de datos de usuario = emoji libre (texto). Se quitan los CHECK de las 7 claves fijas.
do $$
declare r record;
begin
  for r in
    select conrelid::regclass as tbl, conname
    from pg_constraint
    where contype = 'c'
      and conrelid in ('public.accounts'::regclass, 'public.categories'::regclass)
      and pg_get_constraintdef(oid) ilike '%icon%'
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;

alter table public.accounts alter column icon set default '🏦';
alter table public.accounts add constraint accounts_icon_len check (char_length(icon) between 1 and 16);

alter table public.categories alter column icon set default '🏷️';
alter table public.categories alter column icon set not null;
alter table public.categories add constraint categories_icon_len check (char_length(icon) between 1 and 16);

alter table public.goals add column icon text not null default '🎯'
  check (char_length(icon) between 1 and 16);
alter table public.subscriptions add column icon text not null default '💳'
  check (char_length(icon) between 1 and 16);

-- Categorías por defecto con emoji
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
    (new.id, 'Alimentación', '☕'),
    (new.id, 'Transporte', '🚗'),
    (new.id, 'Entretenimiento', '🎬'),
    (new.id, 'Compras', '🛒'),
    (new.id, 'Salud', '🩺'),
    (new.id, 'Educación', '🎓'),
    (new.id, 'Hogar', '🏠'),
    (new.id, 'Otros', '📦');
  return new;
end $$;
