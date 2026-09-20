-- Run in Supabase SQL editor once.
-- Site visit counter + public mailbox messages.

create table if not exists site_stats (
  id text primary key default 'main',
  visit_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into site_stats (id, visit_count)
values ('main', 0)
on conflict (id) do nothing;

create table if not exists mailbox_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists mailbox_messages_created_at_idx
  on mailbox_messages (created_at desc);

-- Lock down: only service role (API routes) should read/write.
alter table site_stats enable row level security;
alter table mailbox_messages enable row level security;

-- No anon policies — all access via SUPABASE_SERVICE_ROLE_KEY on the server.
