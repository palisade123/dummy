/*
  # Create Storage Bucket for Tugas Submissions

  1. New Storage Bucket
    - `tugas-submissions`
      - Public bucket for student assignment uploads
      - Accepts PDF files up to 10MB
      - No Row Level Security needed for storage (handled by upload_codes validation)
  
  2. Security
    - Public read access
    - Upload controlled by upload_codes validation in application layer
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tugas-submissions',
  'tugas-submissions',
  true,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];
