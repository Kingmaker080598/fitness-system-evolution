-- Create the shared_health_data table
create table if not exists public.shared_health_data (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users(id) not null,
  recipient_email text,
  share_code text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  sender_name text
);

-- Enable RLS
alter table public.shared_health_data enable row level security;

-- Create policies
create policy "Users can create their own shares"
  on public.shared_health_data
  for insert
  with check (auth.uid() = sender_id);

create policy "Users can view their own shares"
  on public.shared_health_data
  for select
  using (auth.uid() = sender_id);

create policy "Anyone can view non-expired shares by code"
  on public.shared_health_data
  for select
  using (expires_at > now());

-- Grant permissions
grant all on public.shared_health_data to postgres, anon, authenticated, service_role;
