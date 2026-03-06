-- Admin dashboard support tables and policies

-- Jobs moderation fields
alter table public.jobs
  add column if not exists status text default 'approved',
  add column if not exists posted_by uuid;

update public.jobs set status = coalesce(status, 'approved');

-- Constrain status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'jobs_status_check'
  ) THEN
    ALTER TABLE public.jobs
      ADD CONSTRAINT jobs_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END$$;

-- User profiles (safe admin-visible user list)
create table if not exists public.profiles (
  id uuid primary key,
  email text not null,
  role text default 'job_seeker',
  company_name text,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

alter table public.profiles
  add column if not exists role text default 'job_seeker',
  add column if not exists company_name text,
  add column if not exists last_seen_at timestamptz default now();

update public.profiles
set role = case
  when role in ('admin', 'employer', 'job_seeker') then role
  else 'job_seeker'
end;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check CHECK (role IN ('job_seeker', 'employer', 'admin'));
  END IF;
END$$;

alter table public.profiles enable row level security;

-- Allow authenticated users to upsert their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can manage own profile'
  ) THEN
    CREATE POLICY "Users can manage own profile"
      ON public.profiles
      FOR ALL
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END$$;

-- Allow reads for authenticated users (needed for admin user list)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Authenticated can read profiles'
  ) THEN
    CREATE POLICY "Authenticated can read profiles"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END$$;

-- Job applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  applicant_id uuid,
  applicant_email text not null,
  submitted_at timestamptz default now()
);

alter table public.applications
  add column if not exists applicant_id uuid;

alter table public.applications enable row level security;

-- Anyone can create applications (public board)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'applications' AND policyname = 'Public insert applications'
  ) THEN
    CREATE POLICY "Public insert applications"
      ON public.applications
      FOR INSERT
      WITH CHECK (true);
  END IF;
END$$;

create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists profiles_email_idx on public.profiles (lower(email));
create index if not exists applications_job_id_idx on public.applications (job_id);
create index if not exists applications_applicant_id_idx on public.applications (applicant_id);
create index if not exists applications_applicant_email_idx on public.applications (lower(applicant_email));

-- Authenticated users can read applications (used by admin UI)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'applications' AND policyname = 'Authenticated read applications'
  ) THEN
    CREATE POLICY "Authenticated read applications"
      ON public.applications
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END$$;

-- Admin/moderation actions need update/delete on jobs from client-side admin UI.
-- Restrict this in production with stricter policies and role checks.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'jobs' AND policyname = 'Authenticated update jobs'
  ) THEN
    CREATE POLICY "Authenticated update jobs"
      ON public.jobs
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'jobs' AND policyname = 'Authenticated delete jobs'
  ) THEN
    CREATE POLICY "Authenticated delete jobs"
      ON public.jobs
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END$$;
