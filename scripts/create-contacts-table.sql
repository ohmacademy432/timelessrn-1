-- Run this in Supabase SQL Editor

create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  source text not null default 'manual',
  created_at timestamptz default now()
);

-- Unique on email to prevent duplicates (ignore blank emails)
create unique index if not exists idx_contacts_email_unique
  on contacts(email) where email != '';

alter table contacts enable row level security;

-- Only authenticated users can access
create policy "Authenticated read contacts" on contacts for select using (auth.role() = 'authenticated');
create policy "Authenticated insert contacts" on contacts for insert with check (true);
create policy "Authenticated update contacts" on contacts for update using (true);
create policy "Authenticated delete contacts" on contacts for delete using (true);
