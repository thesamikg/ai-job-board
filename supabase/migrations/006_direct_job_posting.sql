-- Server-side job posting support. Public form submissions are inserted by
-- the API route and wait for moderation.

alter table public.jobs enable row level security;

alter table public.jobs
  add column if not exists status text default 'pending',
  add column if not exists posted_by uuid;

update public.jobs set status = 'pending' where status is null;
