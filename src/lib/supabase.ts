import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  nilai: number;
  created_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  image_url: string;
  uploaded_at: string;
  uploaded_by: string | null;
}

export interface PraktikumModule {
  id: string;
  nomor: number;
  judul: string;
  deskripsi: string;
  pdf_url: string;
  video_url: string;
  created_at: string;
}

export interface TugasSubmission {
  id: string;
  praktikum_id: string;
  user_id: string;
  file_url: string;
  nama_mahasiswa: string;
  nim: string;
  submitted_at: string;
}
