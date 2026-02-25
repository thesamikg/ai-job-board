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
  role text default 'user',
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

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
  applicant_email text not null,
  submitted_at timestamptz default now()
);

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
