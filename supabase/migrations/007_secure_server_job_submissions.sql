-- Remove browser-side job insert policies. Job submissions now go through
-- the server API, which inserts with the service role and forces pending status.

alter table public.jobs enable row level security;

alter table public.jobs
  alter column status set default 'pending';

drop policy if exists "Public can insert approved jobs" on public.jobs;
drop policy if exists "Allow public insert on jobs" on public.jobs;
drop policy if exists "Authenticated users can insert own pending jobs" on public.jobs;
