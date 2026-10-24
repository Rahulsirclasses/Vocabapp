-- Fix RLS policies to allow admin panel operations without user authentication
-- This allows the admin panel (protected by admin password) to manage vocab words

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert vocab words" ON vocab_words;
DROP POLICY IF EXISTS "Authenticated users can update vocab words" ON vocab_words;
DROP POLICY IF EXISTS "Authenticated users can delete vocab words" ON vocab_words;

-- Create new policies that allow all operations
-- The admin panel is protected by the admin password, so we can allow these operations
CREATE POLICY "Allow insert vocab words"
  ON vocab_words FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update vocab words"
  ON vocab_words FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete vocab words"
  ON vocab_words FOR DELETE
  USING (true);

-- Note: The read policy "Anyone can read vocab words" already exists from script 01
-- and allows public read access, which is correct for the learning features
