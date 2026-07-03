-- If you get "policy already exists" errors, run this to reset policies
drop policy if exists "Allow public read access on jobs" on public.jobs;
drop policy if exists "Allow public insert on jobs" on public.jobs;

create policy "Allow public read access on jobs"
  on public.jobs for select
  using (true);
