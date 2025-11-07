/*
  # Create Praktikum Module Schema

  1. New Tables
    - `praktikum_modules` (praktikum modules)
      - `id` (uuid, primary key)
      - `nomor` (integer, unique module number)
      - `judul` (text, module title)
      - `deskripsi` (text, module description)
      - `pdf_url` (text, URL to PDF file)
      - `video_url` (text, URL to video file)
      - `created_at` (timestamp)
    
    - `tugas_submissions` (task submissions)
      - `id` (uuid, primary key)
      - `praktikum_id` (uuid, reference to praktikum_modules)
      - `user_id` (uuid, reference to auth.users)
      - `file_url` (text, URL to submitted PDF)
      - `nama_mahasiswa` (text, student name)
      - `nim` (text, student ID)
      - `submitted_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Public read access for praktikum_modules
    - Authenticated users can view and insert submissions
    - Users can only view their own submissions
*/

CREATE TABLE IF NOT EXISTS praktikum_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor integer UNIQUE NOT NULL,
  judul text NOT NULL,
  deskripsi text NOT NULL DEFAULT '',
  pdf_url text NOT NULL,
  video_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tugas_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  praktikum_id uuid REFERENCES praktikum_modules(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  nama_mahasiswa text NOT NULL,
  nim text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE praktikum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tugas_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view praktikum modules"
  ON praktikum_modules FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert praktikum modules"
  ON praktikum_modules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update praktikum modules"
  ON praktikum_modules FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete praktikum modules"
  ON praktikum_modules FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all submissions"
  ON tugas_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert submissions"
  ON tugas_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON tugas_submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own submissions"
  ON tugas_submissions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

INSERT INTO praktikum_modules (nomor, judul, deskripsi, pdf_url, video_url) VALUES
  (1, 'Pengenalan Jaringan Komputer', 'Praktikum pengenalan dasar jaringan komputer, topologi, dan protokol jaringan', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (2, 'Konfigurasi Router', 'Praktikum konfigurasi dasar router dan routing protocol', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (3, 'VLAN dan Switch', 'Praktikum konfigurasi VLAN dan manajemen switch', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (4, 'Wireless Networking', 'Praktikum konfigurasi jaringan wireless dan security', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (5, 'Network Security', 'Praktikum keamanan jaringan, firewall, dan VPN', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
