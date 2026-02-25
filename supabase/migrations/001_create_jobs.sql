-- Jobs table for AI Jobboard
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  company_logo text default '',
  location text default 'Remote',
  salary_min numeric default 0,
  salary_max numeric default 0,
  currency text default 'USD',
  job_type text default 'Full-time',
  experience_level text default '2-5',
  remote boolean default false,
  skills jsonb default '[]'::jsonb,
  description text default '',
  apply_url text default '',
  posted_at timestamptz default now(),
  featured boolean default false,
  category text default 'AI Engineering',
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional - allows public read by default)
alter table public.jobs enable row level security;

-- Allow public read access (anyone can list jobs)
create policy "Allow public read access on jobs"
  on public.jobs for select
  using (true);

-- Allow public insert (anyone can post a job - restrict in production if needed)
create policy "Allow public insert on jobs"
  on public.jobs for insert
  with check (true);
