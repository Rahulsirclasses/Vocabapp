-- Add write policies for vocab_words table
-- Allow authenticated users to insert, update, and delete vocab words
-- In production, you may want to restrict this to specific admin users

DROP POLICY IF EXISTS "Authenticated users can insert vocab words" ON vocab_words;
CREATE POLICY "Authenticated users can insert vocab words"
  ON vocab_words FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update vocab words" ON vocab_words;
CREATE POLICY "Authenticated users can update vocab words"
  ON vocab_words FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete vocab words" ON vocab_words;
CREATE POLICY "Authenticated users can delete vocab words"
  ON vocab_words FOR DELETE
  TO authenticated
  USING (true);
