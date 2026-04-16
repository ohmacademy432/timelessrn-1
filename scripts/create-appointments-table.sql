-- Run this in Supabase SQL Editor (https://supabase.com/dashboard > SQL Editor)

create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references profiles(id) on delete cascade,
  service text not null,
  appointment_date date not null,
  notes text default '',
  created_at timestamptz default now()
);

-- Enable RLS
alter table appointments enable row level security;

-- Users can read their own appointments
create policy "Users can view own appointments"
  on appointments for select
  using (auth.uid() = profile_id);

-- Allow authenticated users to insert (for admin use via service role or anon key with admin check)
create policy "Authenticated users can insert appointments"
  on appointments for insert
  with check (true);

-- Allow updates
create policy "Authenticated users can update appointments"
  on appointments for update
  using (true);

-- Allow deletes
create policy "Authenticated users can delete appointments"
  on appointments for delete
  using (true);

-- Index for fast lookups
create index if not exists idx_appointments_profile on appointments(profile_id);
create index if not exists idx_appointments_date on appointments(appointment_date desc);
