/*
  # Allow Public Submissions to Tugas Submissions Table

  1. Changes
    - Add policy to allow public (anon) users to INSERT into tugas_submissions table
    - This allows students who are not logged in to submit assignments
    - Public can only insert with user_id = NULL (for non-authenticated students)
  
  2. Security Notes
    - Only public INSERT is allowed, not UPDATE or DELETE
    - Authenticated users (admin) can still view all submissions
    - Students submit with nama_mahasiswa and nim for identification
*/

CREATE POLICY "Public can submit assignments"
  ON tugas_submissions
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
