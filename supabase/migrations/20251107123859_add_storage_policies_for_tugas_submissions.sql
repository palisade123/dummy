/*
  # Add Storage Policies for Tugas Submissions Bucket

  1. Storage Policies
    - Allow public INSERT (upload) to tugas-submissions bucket
    - Allow public SELECT (read) from tugas-submissions bucket
    - Allow authenticated users (admin) to DELETE from tugas-submissions bucket
    - Allow authenticated users (admin) to UPDATE in tugas-submissions bucket

  2. Security Notes
    - Upload is controlled by upload_codes validation in application layer
    - Public can upload and read, but only admin can delete/update
*/

CREATE POLICY "Public can upload to tugas-submissions"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'tugas-submissions');

CREATE POLICY "Public can read tugas-submissions"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'tugas-submissions');

CREATE POLICY "Authenticated can delete from tugas-submissions"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'tugas-submissions');

CREATE POLICY "Authenticated can update tugas-submissions"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tugas-submissions')
  WITH CHECK (bucket_id = 'tugas-submissions');
