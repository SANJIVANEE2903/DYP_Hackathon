-- ============================================================
-- RepoForge Complete Schema Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- STEP 1: Create the 'repos' table (what the backend actually uses)
CREATE TABLE IF NOT EXISTS repos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id BIGINT UNIQUE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  stack TEXT DEFAULT 'generic',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_score INTEGER DEFAULT 0,
  last_audit_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- STEP 2: Fix audit_runs to reference 'repos' (not 'repositories')
-- Drop old FK and table if it was created wrong
ALTER TABLE audit_runs DROP CONSTRAINT IF EXISTS audit_runs_repo_id_fkey;

-- Make sure audit_runs has the right columns
ALTER TABLE audit_runs ADD COLUMN IF NOT EXISTS results JSONB;
ALTER TABLE audit_runs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';

-- Drop columns that don't belong (they go inside 'results' JSONB now)
ALTER TABLE audit_runs DROP COLUMN IF EXISTS grade;
ALTER TABLE audit_runs DROP COLUMN IF EXISTS issues;
ALTER TABLE audit_runs DROP COLUMN IF EXISTS passed_checks;
ALTER TABLE audit_runs DROP COLUMN IF EXISTS summary;
ALTER TABLE audit_runs DROP COLUMN IF EXISTS user_id;

-- Re-add FK pointing to the correct 'repos' table
ALTER TABLE audit_runs ADD CONSTRAINT audit_runs_repo_id_fkey
  FOREIGN KEY (repo_id) REFERENCES repos(id) ON DELETE CASCADE;

-- STEP 3: Create 'users' table (backend upserts into this)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_id BIGINT,
  login TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- STEP 4: Enable RLS on all tables
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- STEP 5: RLS Policies for repos
DROP POLICY IF EXISTS "Users can view their own repos" ON repos;
DROP POLICY IF EXISTS "Users can insert their own repos" ON repos;
DROP POLICY IF EXISTS "Users can update their own repos" ON repos;
DROP POLICY IF EXISTS "Users can delete their own repos" ON repos;

CREATE POLICY "Users can view their own repos"   ON repos FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own repos" ON repos FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own repos" ON repos FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own repos" ON repos FOR DELETE USING (auth.uid() = owner_id);

-- STEP 6: RLS Policies for audit_runs (open via service key on backend)
DROP POLICY IF EXISTS "Allow all audit_runs" ON audit_runs;
CREATE POLICY "Allow all audit_runs" ON audit_runs FOR ALL USING (true) WITH CHECK (true);

-- STEP 7: RLS Policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can upsert own profile" ON users;
CREATE POLICY "Users can view own profile"   ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can upsert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
