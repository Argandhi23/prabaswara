# 📷 Prabaswara Photography & Visual Studio

Website Landing Page & Company Profile profesional untuk **Prabaswara** dan 4 sub-brandnya (**Swara Gallery, Swara Studio, Swara Moment, Swara Wedding**). 

Dibangun dengan **Next.js 14 App Router (TypeScript)**, **Tailwind CSS (Monochrome Luxury Theme)**, dan **Supabase (PostgreSQL & Storage)**.

---

## 🌟 Fitur Utama

1. **Luxury Visual Aesthetics:** Desain minimalis mewah serba hitam-putih-emas (`#111111` & `#C9A961`) dengan visual tipografi elegan (*Playfair Display* & *Inter*).
2. **4 Sub-Brand Sections & Pages:**
   - **Swara Gallery:** Galeri fine art & fotografi seni.
   - **Swara Studio:** Portofolio foto studio, portrait & lookbook komersial.
   - **Swara Moment:** Dokumentasi event & selebrasi.
   - **Swara Wedding:** Dokumentasi momen pernikahan abadi.
3. **Custom Admin Panel (`/admin`):**
   - Halaman admin khusus yang super gampang digunakan.
   - Fitur upload foto langsung ke Supabase Storage, atur judul, caption, sub-brand, dan status *Featured* di Homepage.
   - Dilengkapi login keamanan terproteksi cookie HTTP-Only.
4. **Optimasi Vercel Free Tier (0 Image Transformations):**
   - Menggunakan `unoptimized: true` sehingga bebas dari kuota 5.000 limit transformasi Vercel.
5. **Full Lightbox Photo Viewer:**
   - Modal preview foto resolusi tinggi lengkap dengan tombol langsung *"Konsultasi Foto Ini via WA"*.
6. **SEO & Social Media Preview:**
   - Next.js Metadata API & Open Graph per halaman untuk preview link yang menarik saat dibagikan ke WhatsApp / Sosial Media.

---

## 🚀 Cara Menjalankan Project Secara Lokal

### 1. Prasyarat
- Node.js versi 18.x atau lebih baru.
- Akun Supabase (Gratis).

### 2. Jalankan Dev Server
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Panduan Setup Supabase & Admin Panel

### 1. Variabel Lingkungan (`.env.local`)
Buat file `.env.local` di root folder project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://couougglyiwydtlihpmfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
ADMIN_PASSWORD=your_secure_admin_password
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
```

### 2. Akses Dashboard Admin
Akses halaman admin di: [http://localhost:3000/admin](http://localhost:3000/admin) (atau `domain-anda.vercel.app/admin`).
