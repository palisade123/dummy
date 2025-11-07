# Virtual Lab - Student Management System

Aplikasi web untuk mengelola daftar nilai mahasiswa dan galeri foto praktikum.

## Fitur

- **Landing Page** - Informasi tentang Virtual Lab
- **Daftar Nilai** - CRUD data mahasiswa (NIM, Nama, Nilai)
- **Galeri** - Upload dan kelola foto kegiatan praktikum
- **Authentication** - Sign up dan login untuk admin

## Teknologi

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (Database & Auth)
- React Router
- Lucide React (Icons)

## Cara Setup

### 1. Download Project

Download atau clone repository ini ke komputer Anda.

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### A. Buat Akun Supabase
1. Buka [supabase.com](https://supabase.com)
2. Sign up atau login
3. Create New Project
4. Tunggu hingga project selesai dibuat

#### B. Salin Credentials
1. Di Supabase Dashboard, buka **Settings** → **API**
2. Salin:
   - **Project URL**
   - **anon/public key**

#### C. Buat File `.env`
Buat file `.env` di root project dan isi dengan:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Ganti `your_supabase_url` dan `your_supabase_anon_key` dengan nilai yang Anda salin.

### 4. Setup Database

#### A. Jalankan Migration
1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik **New Query**
3. Salin isi file `supabase/migrations/20251107022024_create_virtual_lab_schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl + Enter`

Migration ini akan membuat:
- Tabel `mahasiswa` (NIM, Nama, Nilai)
- Tabel `gallery` (Image URL, Caption)
- Row Level Security policies
- Storage bucket untuk gambar

### 5. Setup Storage

1. Di Supabase Dashboard, buka **Storage**
2. Bucket `gallery-images` sudah dibuat otomatis oleh migration
3. Pastikan bucket tersebut terlihat di daftar

### 6. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 7. Buat Akun Admin

1. Buka aplikasi di browser
2. Klik **Sign Up** di header
3. Isi form:
   - Email: `admin@example.com` (atau email pilihan Anda)
   - Password: minimal 6 karakter
   - Confirm Password: ulangi password
4. Klik **Create Account**
5. Login dengan kredensial yang baru dibuat

### 8. Build untuk Production

```bash
npm run build
```

File production akan ada di folder `dist/`

## Deploy ke Vercel

### Cara 1: Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Cara 2: Via GitHub + Vercel Dashboard

1. Push code ke GitHub repository
2. Buka [vercel.com](https://vercel.com)
3. Klik **Add New** → **Project**
4. Import repository dari GitHub
5. Vercel akan auto-detect Vite project
6. Tambahkan **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Klik **Deploy**

## Scripts

```bash
npm run dev       # Jalankan development server
npm run build     # Build untuk production
npm run preview   # Preview build production
npm run lint      # Jalankan ESLint
npm run typecheck # Type checking TypeScript
```

## Struktur Folder

```
project/
├── src/
│   ├── components/      # Komponen reusable
│   ├── contexts/        # React Context (Auth)
│   ├── lib/            # Library configs (Supabase)
│   ├── pages/          # Halaman aplikasi
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── supabase/
│   └── migrations/     # Database migrations
├── .env                # Environment variables (local)
└── package.json        # Dependencies
```

## Troubleshooting

### Database Connection Error
- Pastikan file `.env` sudah dibuat dengan nilai yang benar
- Periksa Supabase Project URL dan Anon Key
- Restart development server setelah mengubah `.env`

### Migration Gagal
- Pastikan SQL query tidak ada syntax error
- Cek di SQL Editor apakah ada error message
- Pastikan tidak ada tabel dengan nama yang sama

### Upload Gambar Gagal
- Pastikan storage bucket `gallery-images` sudah dibuat
- Periksa RLS policies di Storage
- Pastikan user sudah login

### Build Error
- Jalankan `npm run typecheck` untuk cek TypeScript errors
- Pastikan semua dependencies sudah ter-install
- Hapus folder `node_modules` dan `package-lock.json`, lalu `npm install` ulang

## Lisensi

MIT
