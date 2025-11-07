/*
  # Create Virtual Lab Schema
  
  1. New Tables
    - `mahasiswa` (students)
      - `id` (uuid, primary key)
      - `nama` (text, student name)
      - `nim` (text, unique student ID)
      - `nilai` (numeric, grade 0-100)
      - `created_at` (timestamp)
    
    - `gallery` (photo gallery)
      - `id` (uuid, primary key)
      - `title` (text, photo title)
      - `image_url` (text, URL to image)
      - `uploaded_at` (timestamp)
      - `uploaded_by` (uuid, reference to auth.users)
  
  2. Security
    - Enable RLS on all tables
    - Public read access for both tables
    - Authenticated users can insert/update/delete
*/

-- Drop tables if they exist
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS mahasiswa CASCADE;

-- Create mahasiswa table
CREATE TABLE mahasiswa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  nim text UNIQUE NOT NULL,
  nilai numeric NOT NULL CHECK (nilai >= 0 AND nilai <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create gallery table
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
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