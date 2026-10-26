create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  text text not null,
  created_at timestamp with time zone default now()
);

-- agar polling bisa ambil urutan waktu
alter table messages enable row level security;
create policy allow_select on messages for select using (true);
create policy allow_insert on messages for insert with check (true);
