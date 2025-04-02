-- Create shared_health_data table
create table if not exists shared_health_data (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references auth.users(id) not null,
  recipient_email text,
  share_code text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  sender_name text
);

-- Add RLS policies
alter table shared_health_data enable row level security;

-- Allow users to create shares
create policy "Users can create their own shares"
  on shared_health_data for insert
  with check (auth.uid() = sender_id);

-- Allow users to view their own shares
create policy "Users can view their own shares"
  on shared_health_data for select
  using (auth.uid() = sender_id);

-- Allow anyone to view non-expired shares by code
create policy "Anyone can view non-expired shares by code"
  on shared_health_data for select
  using (expires_at > now());
