-- Run this in your Supabase SQL Editor to set up the database

-- Create resumes storage bucket
-- (Do this via Supabase Dashboard > Storage > New Bucket > "resumes")

-- Create cv_analyses table
create table cv_analyses (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  score numeric not null,
  max_score numeric not null,
  grade text not null,
  word_count integer not null,
  suggestions jsonb not null,
  analysis jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table cv_analyses enable row level security;

-- Allow anonymous read/write (since we're client-side only)
create policy "Allow anonymous insert" on cv_analyses for insert with check (true);
create policy "Allow anonymous read" on cv_analyses for select using (true);
create policy "Allow anonymous delete" on cv_analyses for delete using (true);

-- Storage bucket policy (run in Supabase Dashboard SQL Editor)
-- insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);
-- create policy "Allow anonymous upload" on storage.objects for insert with check (bucket_id = 'resumes');
-- create policy "Allow anonymous read" on storage.objects for select using (bucket_id = 'resumes');
