alter table public.subscribers enable row level security;

drop policy if exists "Public insert subscribers" on public.subscribers;
drop policy if exists "Authenticated read subscribers" on public.subscribers;

create policy "Public insert subscribers"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated read subscribers"
  on public.subscribers
  for select
  to authenticated
  using (true);

grant insert on table public.subscribers to anon, authenticated;
grant select on table public.subscribers to authenticated;
