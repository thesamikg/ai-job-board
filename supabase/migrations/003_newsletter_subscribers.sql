create table if not exists public.subscribers (
  email text primary key,
  source text default 'homepage',
  created_at timestamptz default now()
);

alter table public.subscribers enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'subscribers' AND policyname = 'Public insert subscribers'
  ) THEN
    CREATE POLICY "Public insert subscribers"
      ON public.subscribers
      FOR INSERT
      WITH CHECK (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'subscribers' AND policyname = 'Authenticated read subscribers'
  ) THEN
    CREATE POLICY "Authenticated read subscribers"
      ON public.subscribers
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END$$;

create index if not exists subscribers_created_at_idx on public.subscribers (created_at desc);
