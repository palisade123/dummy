/*
  # Allow Public Upload to Gallery

  1. Security Changes
    - Add policy to allow public (anon) to insert into gallery table
    - This allows anyone with a valid upload code to upload files
    - Existing SELECT policy already allows public to view gallery

  2. Important Notes
    - Public users can insert into gallery
    - Upload code validation happens in application layer
    - Authenticated users retain all their existing permissions
*/

-- Drop existing insert policy that only allows authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert gallery" ON gallery;

-- Create new policy that allows public to insert
CREATE POLICY "Anyone can insert gallery"
  ON gallery
  FOR INSERT
  TO public
  WITH CHECK (true);