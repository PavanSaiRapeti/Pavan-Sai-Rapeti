-- Run in Supabase SQL editor (safe to re-run).
-- Unique visitors + mailbox messages.

create table if not exists site_stats (
  id text primary key default 'main',
  visit_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into site_stats (id, visit_count)
values ('main', 0)
on conflict (id) do nothing;

-- One row per browser/device visitor id (client UUID in localStorage)
create table if not exists site_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists mailbox_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists mailbox_messages_created_at_idx
  on mailbox_messages (created_at desc);

alter table site_stats enable row level security;
alter table site_visitors enable row level security;
alter table mailbox_messages enable row level security;

create or replace function increment_visit_count()
returns bigint
language plpgsql
security definer
as $$
declare
  new_count bigint;
begin
  insert into site_stats (id, visit_count, updated_at)
  values ('main', 1, now())
  on conflict (id) do update
  set visit_count = site_stats.visit_count + 1,
      updated_at = now()
  returning visit_count into new_count;
  return new_count;
end;
$$;

-- Register visitor; bump count only the first time that visitor_id appears.
create or replace function record_unique_visit(p_visitor_id text)
returns json
language plpgsql
security definer
as $$
declare
  is_new boolean := false;
  new_count bigint;
begin
  p_visitor_id := trim(both from coalesce(p_visitor_id, ''));
  if length(p_visitor_id) < 8 or length(p_visitor_id) > 80 then
    raise exception 'invalid_visitor_id';
  end if;

  begin
    insert into site_visitors (visitor_id, first_seen, last_seen)
    values (p_visitor_id, now(), now());
    is_new := true;
  exception
    when unique_violation then
      update site_visitors
      set last_seen = now()
      where visitor_id = p_visitor_id;
      is_new := false;
  end;

  if is_new then
    new_count := increment_visit_count();
  else
    select visit_count into new_count from site_stats where id = 'main';
    new_count := coalesce(new_count, 0);
  end if;

  return json_build_object('count', new_count, 'isNew', is_new);
end;
$$;
