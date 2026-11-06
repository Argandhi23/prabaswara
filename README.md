<div align="center">
  <img src="public/icon.png" alt="Prabaswara Logo" width="96" height="96" />

  # Prabaswara Photography & Creative Visual Studio

  **Platform Portofolio, Pricelist Interaktif, Sistem Manajemen Konten (CMS), & Real-Time Visitor Analytics untuk Prabaswara (`prabaswara.co`)**

  [![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

---

## Daftar Isi

1. [Tentang Project](#-tentang-project)
2. [Ekosistem 4 Sub-Brand](#-ekosistem-4-sub-brand)
3. [Fitur Utama](#-fitur-utama)
   - [Halaman Publik (Frontend)](#1-halaman-publik-frontend)
   - [Dashboard Admin dengan Sidebar (`/admin`)](#2-dashboard-admin-dengan-sidebar-admin)
   - [Sistem Pelacakan & Statistik Pengunjung (Visitor Analytics)](#3-sistem-pelacakan--statistik-pengunjung-visitor-analytics)
4. [Teknologi yang Digunakan (Tech Stack)](#-teknologi-yang-digunakan-tech-stack)
5. [Struktur Direktori Project](#-struktur-direktori-project)
6. [Dokumentasi API Internal (Route Handlers)](#-dokumentasi-api-internal-route-handlers)
7. [Skema Database & Storage Supabase](#-skema-database--storage-supabase)
8. [Panduan Instalasi & Menjalankan Secara Lokal](#-panduan-instalasi--menjalankan-secara-lokal)
9. [Panduan Deployment ke Production (Vercel)](#-panduan-deployment-ke-production-vercel)

---

## Tentang Project

**Prabaswara** adalah website *company profile*, galeri portofolio artistik, dan katalog harga (*pricelist*) resmi untuk studio fotografi kreatif **Prabaswara (`prabaswara.co`)**.

Dirancang dengan estetika **Monochrome & Luxury Gold (`#121212`, `#FFFFFF`, `#C9A961`)**, website ini menggabungkan kecepatan pemuatan tinggi, pengalaman visual interaktif, integrasi konsultasi **WhatsApp kontekstual**, serta **Dashboard Admin Mandiri (`/admin`)** yang memungkinkan tim mengelola seluruh foto karya, banner layanan, paket harga, informasi kontak, hingga memantau **siapa saja yang mengunjungi website secara *real-time*** tanpa perlu menyentuh kode.

---

## Ekosistem 4 Sub-Brand

Website ini menaungi empat pilar layanan fotografi utama yang masing-masing memiliki halaman khusus, galeri terpisah, cover banner tersendiri, dan daftar paket harga (*pricelist*) yang dapat dikelola langsung dari Admin Panel:

| Sub-Brand | URL Route | Fokus Layanan |
| :--- | :--- | :--- |
| **Swara Gallery** | `/swara-gallery` | Seni karya visual, pameran, & dokumentasi *fine art photography*. |
| **Swara Studio** | `/swara-studio` | Sesi foto studio profesional, potret personal, keluarga, wisuda, & *commercial lookbook*. |
| **Swara Moment** | `/swara-moment` | Dokumentasi acara, selebrasi, *engagement*, korporat, & *special event*. |
| **Swara Wedding** | `/swara-wedding` | Dokumentasi pernikahan sakral, *pre-wedding*, & *cinematic wedding photography*. |

---

## Fitur Utama

### 1. Halaman Publik (Frontend)
- **Hero Showcase & Sub-Brand Navigation:** Navigasi responsif dengan *dropdown* sub-brand di desktop dan *full-screen animated overlay menu* di perangkat seluler.
- **Dynamic About Section:** Menampilkan profil studio dengan 2 gambar potret utama (Kamera Studio & Fine Art Landscape) yang dapat diubah dan di-*crop* langsung dari Admin Panel.
- **Interactive Portfolio Gallery & Lightbox:**
  - Filter instan berdasarkan kategori sub-brand.
  - Modal **Lightbox Resolusi Tinggi** lengkap dengan informasi karya dan tombol langsung **"Tanyakan Foto Ini via WhatsApp"**.
- **Dynamic Pricing & Pricelist Section:**
  - Menampilkan daftar paket harga per sub-brand lengkap dengan indikator **Paket Paling Populer**, rincian fasilitas/benefit, dan tombol pemesanan WhatsApp dengan format pesan otomatis sesuai paket yang dipilih.
- **Floating WhatsApp & Contextual CTA:** Tombol konsultasi cepat yang otomatis menyesuaikan nomor WhatsApp dan pesan sapaan dari pengaturan database.
- **SEO & OpenGraph Metadata:** Setiap halaman memiliki konfigurasi judul, deskripsi, *Open Graph preview*, dan ikon logo resmi Prabaswara.

---

### 2. Dashboard Admin dengan Sidebar (`/admin`)
Dilengkapi sistem autentikasi berbasis **HMAC-SHA256 Session Token (HTTP-Only Cookie)** dan tata letak **Sidebar Responsif** yang sederhana serta ramah pengguna (*user-friendly*):

1. **Galeri Foto (`photos`):**
   - Tambah foto portofolio baru, ubah judul/caption, ganti file gambar, atau hapus foto.
   - Atur lokasi tampil foto (*Swara Gallery*, *Swara Studio*, *Swara Moment*, *Swara Wedding*) dan tandai sebagai **Homepage Featured**.
   - **Built-in Interactive Image Cropper (`ImageCropperModal`):** Memotong gambar (rasio *Portrait 3:4*, *Landscape 4:3*, *Square 1:1*, *Banner 16:9*, atau *Bebas*) dan otomatis mengonversinya ke format `.webp` yang ringan sebelum diunggah ke Supabase Storage.
2. **Banner Sub-Brand (`brands`):**
   - Ubah dan *crop* gambar sampul (*cover banner* rasio 16:9) untuk ke-4 halaman sub-brand utama.
3. **Paket & Pricelist (`packages`):**
   - Tambah, edit, dan hapus paket harga untuk masing-masing sub-brand.
   - Dilengkapi **Auto-Formatter Rupiah** (`750000` otomatis menjadi `Rp 750.000`), pengaturan urutan tampil, manajemen poin benefit dinamis, *badge* paket rekomendasi/populer, serta kustomisasi teks pesan WhatsApp per paket.
4. **Pengaturan Website (`settings`):**
   - Ganti & *crop* 2 gambar utama pada bagian *Tentang Prabaswara*.
   - Perbarui nomor WhatsApp utama dan alamat email resmi studio dengan sistem **Fault-Tolerant Hybrid Persistence** (tersimpan ke Supabase Database sekaligus memiliki *fallback* otomatis).

---

### 3. Sistem Pelacakan & Statistik Pengunjung (Visitor Analytics)
Fitur analitik internal di dalam Panel Admin untuk memantau performa trafik website secara menyeluruh tanpa bergantung pada pihak ketiga:

- **5 Filter & Kartu Ringkasan Waktu:**
  - **Hari Ini** (sejak pukul `00:00 WIB`)
  - **1 Minggu Ini** (7 hari terakhir)
  - **Sebulan Ini** (30 hari terakhir)
  - **Setahun Ini** (365 hari terakhir)
  - **Semuanya** (akumulasi total seluruh waktu)
  - Menampilkan baik **Total Kunjungan (Page Views)** maupun **Pengunjung Unik (Unique Visitors)**.
- **Deteksi Otomatis Asal Kunjungan (Traffic Source):**
  - Mengenali pengunjung yang datang dari **Instagram** (mendeteksi *Instagram In-App Browser* melalui *User-Agent*, *referrer* `l.instagram.com` / `instagram.com`, maupun parameter `igshid` & `utm_source`), **WhatsApp**, **TikTok**, **Google Search**, **Facebook**, **YouTube**, **Threads**, **Twitter / X**, **Telegram**, hingga **Kunjungan Langsung (Direct Browser)**.
- **Deteksi Browser, Perangkat & Sistem Operasi:**
  - Merinci penggunaan browser (**Google Chrome**, **Instagram Browser**, **Apple Safari**, **Microsoft Edge**, **Mozilla Firefox**, **Samsung Internet**, **TikTok Browser**, dll.).
  - Merinci perangkat pengunjung (**HP Android**, **iPhone / iOS**, **iPad**, **Windows PC/Laptop**, **Mac / macOS**).
- **Tabel Riwayat Pengunjung Real-Time:**
  - Menampilkan daftar riwayat pengunjung lengkap dengan waktu kunjungan (WIB & waktu relatif), ID unik pengunjung, lokasi/negara, *masked IP address*, asal sumber klik, browser/perangkat, dan halaman yang dibuka.

---

## Teknologi yang Digunakan (Tech Stack)

| Kategori | Teknologi | Versi | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org/) | `16.3.0` | Server-Side Rendering (SSR), Route Handlers API, & Metadata SEO |
| **UI Library** | [React](https://react.dev/) | `19.2.8` | Komponen antarmuka pengguna reaktif |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5` | Keamanan tipe data (*static type-checking*) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4` | *Utility-first CSS framework* dengan desain *Luxury Dark/Light* |
| **Database & Storage** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) | `^2.112.2` | Penyimpanan database PostgreSQL & *Object Storage* (`prabaswara-media`) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) | `^12.43.0` / `^3.15.0` | Transisi halaman, *micro-interactions*, & animasi *scroll* halus |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.28.0` | Ikonografi vektor modern & konsisten |

---

## Struktur Direktori Project

```text
prabaswara/
├── app/
│   ├── [brandSlug]/
│   │   └── page.tsx                 # Halaman dinamis 4 Sub-Brand (/swara-gallery, dll)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx             # Halaman login keamanan Admin Panel
│   │   └── page.tsx                 # Dashboard utama Admin Panel dengan Sidebar
│   ├── api/
│   │   ├── admin/
│   │   │   ├── analytics/route.ts   # Endpoint GET data statistik pengunjung (Admin)
│   │   │   ├── auth/route.ts        # Endpoint POST login, GET cek sesi, DELETE logout
│   │   │   ├── brands/route.ts      # Endpoint GET & PUT cover banner sub-brand
│   │   │   ├── packages/route.ts    # Endpoint GET, POST, PUT, DELETE paket pricelist
│   │   │   ├── photos/route.ts      # Endpoint GET, POST, PUT, DELETE foto portofolio
│   │   │   ├── seed/route.ts        # Endpoint POST inisialisasi data awal Supabase
│   │   │   └── settings/route.ts    # Endpoint GET & POST pengaturan website & kontak
│   │   ├── analytics/
│   │   │   └── track/route.ts       # Endpoint POST pencatatan kunjungan website real-time
│   │   ├── revalidate/route.ts      # Endpoint on-demand cache revalidation Next.js
│   │   └── upload/route.ts          # Endpoint POST upload gambar ke Supabase Storage
│   ├── tentang/
│   │   └── page.tsx                 # Halaman Tentang Kami (/tentang)
│   ├── testimoni/
│   │   └── page.tsx                 # Halaman Testimoni Klien (/testimoni)
│   ├── favicon.ico                  # Favicon multi-ukuran resmi Prabaswara
│   ├── globals.css                  # Konfigurasi global Tailwind CSS v4 & tipografi
│   ├── icon.svg                     # Vektor ikon tab browser resmi Prabaswara
│   ├── layout.tsx                   # Root Layout, Metadata SEO, Navbar, Footer, & Tracker
│   └── page.tsx                     # Halaman Beranda Utama (/)
├── components/
│   ├── admin/
│   │   ├── AdminGuideBanner.tsx     # Banner informasi bantuan admin
│   │   ├── AdminHeader.tsx          # Komponen header admin
│   │   ├── AdminSidebar.tsx         # Navigasi sidebar responsif Admin Panel
│   │   ├── AdminToast.tsx           # Notifikasi pop-up sukses/error di Admin Panel
│   │   ├── BrandCard.tsx            # Kartu pratinjau & edit cover sub-brand
│   │   ├── ImageCropperModal.tsx    # Editor crop gambar interaktif berbasis HTML5 Canvas
│   │   ├── PhotoCard.tsx            # Kartu manajemen item foto portofolio
│   │   └── VisitorAnalyticsPanel.tsx# Panel analitik & tabel riwayat pengunjung website
│   ├── common/
│   │   ├── FloatingWhatsApp.tsx     # Tombol mengambang konsultasi WhatsApp
│   │   ├── LightboxModal.tsx        # Modal penampil foto layar penuh (Lightbox)
│   │   └── VisitorTracker.tsx       # Komponen pelacak kunjungan halaman otomatis
│   ├── layout/
│   │   ├── Footer.tsx               # Footer website dengan tautan sub-brand & sosial media
│   │   └── Navbar.tsx               # Header navigasi utama desktop & mobile overlay
│   └── sections/
│       ├── AboutSection.tsx         # Bagian profil Tentang Prabaswara
│       ├── BrandShowcase.tsx        # Showcase kartu 4 sub-brand
│       ├── FeaturedWorkItem.tsx     # Item karya unggulan
│       ├── FeaturedWorkSection.tsx  # Bagian karya unggulan
│       ├── GalleryGrid.tsx          # Grid galeri portofolio dengan filter & lightbox
│       ├── HeroSection.tsx          # Bagian hero utama halaman beranda
│       ├── PricingSection.tsx       # Bagian daftar paket harga & pricelist
│       └── TestimonialSection.tsx   # Bagian kutipan ulasan klien
├── data/
│   └── packages.json                # Penyimpanan fallback lokal daftar paket harga
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Inisialisasi klien Supabase
│   │   └── data.ts                  # Fungsi pengambilan data SSR dengan fallback aman
│   ├── adminAuth.ts                 # Utilitas pembuatan & verifikasi token sesi HMAC Admin
│   ├── formatters.ts                # Utilitas pemformatan mata uang Rupiah otomatis
│   ├── mockData.ts                  # Data cadangan (default fallback)
│   ├── packageStore.ts              # Sinkronisasi data paket harga
│   ├── siteSettingsStore.ts         # Sinkronisasi data pengaturan situs
│   ├── visitorStore.ts              # Mesin analitik pengunjung, detektor sumber/browser, & storage
│   └── whatsapp.ts                  # Generator tautan WhatsApp dinamis
├── public/
│   ├── icon.png                     # Logo ikon resolusi tinggi (512x512)
│   ├── icon.svg                     # Logo ikon vektor publik
│   └── logo.png                     # Logo utama lengkap Prabaswara.co Creative Agency
├── types/
│   └── index.ts                     # Definisi tipe data TypeScript (Photo, Brand, Package, VisitorLog, dll)
├── .env.example                     # Template variabel lingkungan (Environment Variables)
├── next.config.ts                   # Konfigurasi Next.js
├── package.json                     # Daftar dependensi & skrip NPM
└── tsconfig.json                    # Konfigurasi kompilator TypeScript
```

---

## Dokumentasi API Internal (Route Handlers)

Seluruh *endpoint* modifikasi data admin dilindungi oleh verifikasi sesi [`verifyAdminSession()`](lib/adminAuth.ts) menggunakan *cookie* terenkripsi HMAC-SHA256 (`prabaswara_admin_session`):

| Endpoint | Metode | Proteksi Admin | Deskripsi |
| :--- | :--- | :---: | :--- |
| `/api/admin/auth` | `GET`, `POST`, `DELETE` | Publik / Admin | Cek status login (`GET`), verifikasi password & buat sesi (`POST`), atau hapus sesi/logout (`DELETE`). |
| `/api/admin/photos` | `GET`, `POST`, `PUT`, `DELETE` | Ya (`POST/PUT/DELETE`) | Mengambil daftar foto (`GET`), menambah foto baru (`POST`), memperbarui foto/caption (`PUT`), atau menghapus foto (`DELETE`). |
| `/api/admin/brands` | `GET`, `PUT` | Ya (`PUT`) | Mengambil daftar 4 sub-brand (`GET`) atau memperbarui *cover image* & detail sub-brand (`PUT`). |
| `/api/admin/packages` | `GET`, `POST`, `PUT`, `DELETE` | Ya (`POST/PUT/DELETE`) | Mengelola item paket harga & fasilitas (*pricelist*) untuk setiap sub-brand. |
| `/api/admin/settings` | `GET`, `POST` | Ya (`POST`) | Mengambil dan menyimpan pengaturan situs (Gambar *About*, nomor WhatsApp, email, alamat, dll). |
| `/api/admin/analytics` | `GET` | Ya | Mengambil ringkasan statistik pengunjung (*Hari Ini, 1 Minggu, Sebulan, Setahun, Semuanya*) beserta log riwayat pengunjung. |
| `/api/analytics/track` | `POST` | Publik | Mencatat kunjungan halaman baru secara *real-time* (mendeteksi sumber IG/WA/Google/TikTok, browser, OS, perangkat, & lokasi). |
| `/api/upload` | `POST` | Ya | Mengunggah file gambar hasil *crop* (`.webp`, maks 10MB) ke *bucket* Supabase Storage `prabaswara-media`. |
| `/api/admin/seed` | `POST` | Ya | Mengimpor data awal (*seed*) ke tabel Supabase jika tabel masih kosong. |
| `/api/revalidate` | `POST` | Publik / Internal | Memicu *revalidation* halaman publik Next.js agar perubahan di Admin Panel langsung tampil seketika. |

---

## Skema Database & Storage Supabase

Project ini menggunakan **Supabase PostgreSQL** untuk penyimpanan data terstruktur dan **Supabase Storage** (bucket publik bernama `prabaswara-media`) untuk menyimpan seluruh file foto karya, banner, dan log analitik.

### 1. Tabel Database PostgreSQL
Jika Anda menyiapkan project Supabase baru dari awal, jalankan kueri SQL berikut pada **Supabase SQL Editor**:

```sql
-- 1. Tabel Pengaturan Situs (site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT DEFAULT 'Prabaswara',
  tagline TEXT DEFAULT 'Photography & Creative Visual Studio',
  about_text TEXT,
  whatsapp_number TEXT DEFAULT '6281234567890',
  default_whatsapp_message TEXT,
  address TEXT,
  email TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  og_image_url TEXT,
  camera_image_url TEXT,
  about_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel 4 Sub-Brand (brands)
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  cover_image TEXT NOT NULL,
  whatsapp_message TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Galeri Foto Portofolio (photos)
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  brand_slug TEXT NOT NULL,
  brand_title TEXT,
  is_featured BOOLEAN DEFAULT false,
  aspect_ratio TEXT DEFAULT 'portrait',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Paket Harga / Pricelist (packages)
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  popular_label TEXT DEFAULT 'PALING POPULER',
  wa_message TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Testimoni Klien (testimonials)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  role_or_event TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  brand_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. Bucket Supabase Storage
- Nama Bucket: `prabaswara-media` (disetel sebagai **Public Bucket**).
- Digunakan oleh:
  - `/api/upload` untuk menyimpan foto portofolio, cover sub-brand, dan gambar *About* dalam format `.webp`.
  - `lib/visitorStore.ts` untuk menyimpan berkas *state* analitik pengunjung di dalam subfolder terisolasi `analytics/` tanpa mengganggu foto mana pun.

---

## Panduan Instalasi & Menjalankan Secara Lokal

### 1. Prasyarat
- **Node.js** versi `18.18+` atau `20+`
- **npm** (bawaan Node.js)

### 2. Clone Repository & Instal Dependensi
```bash
git clone https://github.com/Argandhi23/prabaswara.git
cd prabaswara
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env.local`)
Salin file `.env.example` menjadi `.env.local` di direktori utama project:
```bash
cp .env.example .env.local
```
Lalu sesuaikan nilainya:
```env
# URL & Anon Key dari Dashboard Supabase -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://project-id-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Password untuk masuk ke Dashboard Admin (/admin/login)
ADMIN_PASSWORD=password_admin_rahasia_anda

# Nomor WhatsApp Fallback Utama (format kode negara 62 tanpa tanda +)
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
```

### 4. Jalankan Server Pengembangan (Development)
```bash
npm run dev
```
- **Website Utama:** Buka [http://localhost:3000](http://localhost:3000)
- **Dashboard Admin:** Buka [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Build untuk Produksi
Untuk menguji hasil *build* produksi secara lokal:
```bash
npm run build
npm run start
```

---

## Panduan Deployment ke Production (Vercel)

1. Hubungkan repositori GitHub `Argandhi23/prabaswara` ke dashboard [Vercel](https://vercel.com/).
2. Pada bagian **Environment Variables** di pengaturan project Vercel, tambahkan keempat variabel berikut:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
3. Klik **Deploy**. Setiap kali ada perubahan yang di-*push* ke *branch* `main` di GitHub, Vercel akan otomatis memperbarui website produksi tanpa *downtime* dan tanpa mengubah data foto maupun konten yang tersimpan di Supabase.

---

<div align="center">
  <p>© 2026 <strong>Prabaswara Photography & Creative Visual Studio</strong>. Hak Cipta Dilindungi.</p>
</div>
