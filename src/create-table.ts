import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://oiufgxtaehrwqnqmkhhc.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pdWZneHRhZWhyd3FucW1raGhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjE0NzQwMCwiZXhwIjoyMDU3NzIzNDAwfQ.HbVvU7h3C1N_sHR0lxh4LzXD0glxOhRQgzLSpQn-YPE";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createTable = async () => {
  const { error } = await supabase.rpc('create_shared_health_data_table', {
    sql: `
      create table if not exists public.shared_health_data (
        id uuid default gen_random_uuid() primary key,
        sender_id uuid references auth.users(id) not null,
        recipient_email text,
        share_code text unique not null,
        expires_at timestamp with time zone not null,
        created_at timestamp with time zone default now(),
        sender_name text
      );

      alter table public.shared_health_data enable row level security;

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

      grant all on public.shared_health_data to postgres, anon, authenticated, service_role;
    `
  });

  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('Table created successfully');
  }
};

createTable();
