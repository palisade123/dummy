/*
  # Virtual Lab Portfolio Database Schema

  1. New Tables
    - `mahasiswa`
      - `id` (uuid, primary key) - Unique identifier for each student
      - `nama` (text) - Student name
      - `nim` (text, unique) - Student ID number
      - `nilai` (numeric) - Student score (0-100)
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `gallery`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `title` (text) - Image title
      - `image_url` (text) - URL to stored image
      - `uploaded_at` (timestamptz) - Upload timestamp
      - `uploaded_by` (uuid) - Reference to user who uploaded

  2. Security
    - Enable RLS on both tables
    - Public read access for all users
    - Write access only for authenticated users
*/

-- Create mahasiswa table
CREATE TABLE IF NOT EXISTS mahasiswa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  nim text NOT NULL UNIQUE,
  nilai numeric NOT NULL CHECK (nilai >= 0 AND nilai <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Mahasiswa policies
CREATE POLICY "Public can view mahasiswa"
  ON mahasiswa FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert mahasiswa"
  ON mahasiswa FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update mahasiswa"
  ON mahasiswa FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete mahasiswa"
  ON mahasiswa FOR DELETE
  TO authenticated
  USING (true);

-- Gallery policies
CREATE POLICY "Public can view gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert gallery"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery"
  ON gallery FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery"
  ON gallery FOR DELETE
  TO authenticated
  USING (true);