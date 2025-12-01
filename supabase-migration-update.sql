-- Migration to update existing user_profiles table to match new onboarding schema
-- Run this in your Supabase SQL Editor if you already have the old table

-- Drop old columns if they exist (from previous version)
DO $$ 
BEGIN
  -- Drop old columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='internship_location') THEN
    ALTER TABLE user_profiles DROP COLUMN internship_location;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='tools') THEN
    ALTER TABLE user_profiles DROP COLUMN tools;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='team_size') THEN
    ALTER TABLE user_profiles DROP COLUMN team_size;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='manager_name') THEN
    ALTER TABLE user_profiles DROP COLUMN manager_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='goals') THEN
    ALTER TABLE user_profiles DROP COLUMN goals;
  END IF;
END $$;

-- Add new columns if they don't exist
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS budget TEXT,
  ADD COLUMN IF NOT EXISTS hobbies TEXT[],
  ADD COLUMN IF NOT EXISTS lifestyle_preferences TEXT[];

-- Migrate data from old column names to new ones (only if old column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='internship_location') THEN
    UPDATE user_profiles 
    SET location = internship_location 
    WHERE location IS NULL AND internship_location IS NOT NULL;
  END IF;
END $$;

-- Note: The updated_at column should already exist, but ensure it's there
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Ensure updated_at is updated on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

