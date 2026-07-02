-- Allow signed-in users to create their own jobs for moderation.
-- The app submits new employer listings as pending and stores auth.uid() in posted_by.

alter table public.jobs enable row level security;

alter table public.jobs
  add column if not exists status text default 'approved',
  add column if not exists posted_by uuid;

update public.jobs set status = coalesce(status, 'approved');

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'jobs'
      AND policyname = 'Authenticated users can insert own pending jobs'
  ) THEN
    CREATE POLICY "Authenticated users can insert own pending jobs"
      ON public.jobs
      FOR INSERT
      TO authenticated
      WITH CHECK (
        auth.uid() = posted_by
        AND status = 'pending'
      );
  END IF;
END$$;
