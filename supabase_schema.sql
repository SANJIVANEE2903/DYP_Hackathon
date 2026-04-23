-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Repositories table
CREATE TABLE repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  org TEXT NOT NULL,
  stack TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Audit Runs table
CREATE TABLE audit_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Presets table
CREATE TABLE presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  settings JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own repos" ON repositories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own repos" ON repositories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own presets" ON presets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own presets" ON presets FOR INSERT WITH CHECK (auth.uid() = user_id);
