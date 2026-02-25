# Supabase Setup Guide

This guide explains how to connect the AI Jobboard to Supabase for persistent job storage.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (choose a name, password, and region)
3. Wait for the project to finish provisioning

## 2. Create the jobs table

In the Supabase Dashboard, go to **SQL Editor** and run the migration:

```sql
-- Copy the contents of supabase/migrations/001_create_jobs.sql
```

Or run the SQL from `supabase/migrations/001_create_jobs.sql` directly in the SQL Editor.
This migration creates the table and RLS policies required for read and insert.

## 3. Get your API keys

1. In the Supabase Dashboard, go to **Project Settings** → **API**
2. Copy the **Project URL** and **anon public** key

## 4. Configure environment variables

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   Use your real values from Supabase, not the placeholder text above.

## 5. Seed sample jobs (optional)

To populate the database with sample jobs:

```bash
npm run seed
```

## 6. Run the app

```bash
npm run dev
```

Jobs will now load from and save to Supabase. If Supabase is not configured, the app falls back to sample data for development.
