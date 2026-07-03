-- Direct job posting: listings are published immediately from the public form.

alter table public.jobs enable row level security;

alter table public.jobs
  add column if not exists status text default 'approved',
  add column if not exists posted_by uuid;

update public.jobs set status = 'approved' where status is null or status = 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'jobs'
      AND policyname = 'Public can insert approved jobs'
  ) THEN
    CREATE POLICY "Public can insert approved jobs"
      ON public.jobs
      FOR INSERT
      WITH CHECK (coalesce(status, 'approved') = 'approved');
  END IF;
END$$;
