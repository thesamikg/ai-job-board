-- Enforce moderation and private-data access in Postgres rather than relying on
-- client-side role checks. Existing profile admins are copied into the durable
-- allowlist. Add future admins with:
-- insert into public.admin_users (email) values (lower('admin@example.com'));

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz default now()
);

insert into public.admin_users (email)
select distinct lower(email)
from public.profiles
where role = 'admin' and coalesce(email, '') <> ''
on conflict (email) do nothing;

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Profiles: users can maintain their own non-admin profile; admins can read all.
drop policy if exists "Users can manage own profile" on public.profiles;
drop policy if exists "Authenticated can read profiles" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (
    auth.uid() = id
    and (
      (public.is_admin() and role = 'admin')
      or (not public.is_admin() and role in ('job_seeker', 'employer'))
    )
  );

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      (public.is_admin() and role = 'admin')
      or (not public.is_admin() and role in ('job_seeker', 'employer'))
    )
  );

-- Jobs: the public sees approved jobs, owners see their own submissions, and
-- only allowlisted admins can moderate or delete listings.
drop policy if exists "Allow public read access on jobs" on public.jobs;
drop policy if exists "Public can read approved jobs" on public.jobs;
drop policy if exists "Authenticated update jobs" on public.jobs;
drop policy if exists "Authenticated delete jobs" on public.jobs;
drop policy if exists "Admins can update jobs" on public.jobs;
drop policy if exists "Admins can delete jobs" on public.jobs;

create policy "Public can read approved jobs"
  on public.jobs
  for select
  to anon, authenticated
  using (
    status = 'approved'
    or auth.uid() = posted_by
    or public.is_admin()
  );

create policy "Admins can update jobs"
  on public.jobs
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete jobs"
  on public.jobs
  for delete
  to authenticated
  using (public.is_admin());

-- Applications: prevent applicant-id spoofing and keep application data scoped
-- to the applicant or an administrator.
drop policy if exists "Public insert applications" on public.applications;
drop policy if exists "Authenticated read applications" on public.applications;
drop policy if exists "Public can insert applications" on public.applications;
drop policy if exists "Users can read own applications" on public.applications;

create policy "Public can insert applications"
  on public.applications
  for insert
  to anon, authenticated
  with check (applicant_id is null or applicant_id = auth.uid());

create policy "Users can read own applications"
  on public.applications
  for select
  to authenticated
  using (
    public.is_admin()
    or applicant_id = auth.uid()
    or lower(applicant_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Subscriber addresses are administrative data, not a general authenticated
-- user directory.
drop policy if exists "Authenticated read subscribers" on public.subscribers;
drop policy if exists "Admins can read subscribers" on public.subscribers;

create policy "Admins can read subscribers"
  on public.subscribers
  for select
  to authenticated
  using (public.is_admin());
