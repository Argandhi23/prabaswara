export interface BrandData {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  whatsappMessage: string;
  order: number;
}

export interface PhotoData {
  _id: string;
  title: string;
  imageUrl: string;
  caption: string;
  brandSlug: string;
  brandTitle: string;
  isFeatured: boolean;
  aspectRatio: "portrait" | "landscape" | "square";
  order: number;
}

export interface TestimonialData {
  _id: string;
  clientName: string;
  roleOrEvent: string;
  quote: string;
  avatarUrl?: string;
  rating: number;
  brandSlug?: string;
}

export interface PackageData {
  _id: string;
  brandSlug: string;
  brandTag: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  popularLabel?: string;
  waMessage: string;
  order: number;
}

export interface SiteSettingsData {
  companyName: string;
  tagline: string;
  aboutText: string;
  whatsappNumber: string;
  defaultWhatsappMessage: string;
  address: string;
  email: string;
  instagramUrl: string;
  youtubeUrl: string;
  ogImageUrl?: string;
  aboutImageUrl?: string;
  cameraImageUrl?: string;
}

export const MOCK_SITE_SETTINGS: SiteSettingsData = {
  companyName: "Prabaswara",
  tagline: "Photography & Creative Visual Studio",
  aboutText:
    "Prabaswara adalah kolektif fotografi profesional yang didirikan dengan semangat mengabadikan keindahan visual, cerita emosional, dan momen berharga. Kami menaungi empat bidang keahlian spesifik: Swara Gallery untuk eksplorasi seni fotografi visual, Swara Studio untuk potret personal & komersial berstandar tinggi, Swara Moment untuk dokumentasi acara & selebrasi, serta Swara Wedding untuk merayakan momen terbaik dalam hidup pasangan suami istri.",
  whatsappNumber: "6287701906556",
  defaultWhatsappMessage:
    "Halo Prabaswara, saya ingin berkonsultasi mengenai layanan fotografi Anda.",
  address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
  email: "hello@prabaswara.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  ogImageUrl:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
  cameraImageUrl:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
};

export const MOCK_BRANDS: BrandData[] = [
  {
    _id: "brand-1",
    title: "Swara Gallery",
    slug: "swara-gallery",
    tagline: "Eksplorasi Karya Fotografi Seni & Fine Art",
    description:
      "Galeri kurasi karya fotografi konseptual, landscape, arsitektur, dan fine art fotografi dari talenta fotografer Prabaswara. Menyajikan keindahan visual dengan estetika tinggi.",
    coverImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
    whatsappMessage:
      "Halo, saya tertarik dengan karya visual di Swara Gallery dan ingin berkonsultasi mengenai cetak/lisensi karya.",
    order: 1,
  },
  {
    _id: "brand-2",
    title: "Swara Studio",
    slug: "swara-studio",
    tagline: "Jasa Foto Studio Portrait, Lookbook & Produk",
    description:
      "Layanan foto studio profesional dengan penataan pencahayaan terkontrol, estetika minimalis, dan arahan gaya personal. Melayani portrait personal, maternity, keluarga, lookbook fashion, dan commercial product.",
    coverImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop",
    whatsappMessage:
      "Halo, saya ingin reservasi jadwal foto studio di Swara Studio.",
    order: 2,
  },
  {
    _id: "brand-3",
    title: "Swara Moment",
    slug: "swara-moment",
    tagline: "Dokumentasi Momen, Acara & Selebrasi Berharga",
    description:
      "Abadikan setiap detik berharga dalam acara Anda dengan gaya jurnalisme visual yang hangat. Melayani dokumentasi event korporat, ulang tahun, lamaran, wisuda, dan gathering keluarga.",
    coverImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
    whatsappMessage:
      "Halo, saya ingin meminta info paket dokumentasi event di Swara Moment.",
    order: 3,
  },
  {
    _id: "brand-4",
    title: "Swara Wedding",
    slug: "swara-wedding",
    tagline: "Abadikan Momen Pernikahan Penuh Makna & Elegansi",
    description:
      "Spesialis fotografi dan videografi pernikahan bergaya timeless dan emosional. Kami mengabadikan tatapan, senyuman, dan rasa haru dalam hari paling bahagia kehidupan Anda.",
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    whatsappMessage:
      "Halo, saya tertarik dengan layanan dokumentasi pernikahan Swara Wedding dan ingin mengecek ketersediaan tanggal.",
    order: 4,
  },
];

export const MOCK_PHOTOS: PhotoData[] = [
  // Swara Gallery
  {
    _id: "p1",
    title: "Silent Horizon",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    caption: "Fine art landscape capturing morning mist and tranquility.",
    brandSlug: "swara-gallery",
    brandTitle: "Swara Gallery",
    isFeatured: true,
    aspectRatio: "landscape",
    order: 1,
  },
  {
    _id: "p2",
    title: "Monochrome Geometry",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    caption: "Architectural shadow play in central Jakarta.",
    brandSlug: "swara-gallery",
    brandTitle: "Swara Gallery",
    isFeatured: true,
    aspectRatio: "portrait",
    order: 2,
  },
  {
    _id: "p3",
    title: "Celestial Glow",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    caption: "Abstract light movement exploration.",
    brandSlug: "swara-gallery",
    brandTitle: "Swara Gallery",
    isFeatured: false,
    aspectRatio: "square",
    order: 3,
  },

  // Swara Studio
  {
    _id: "p4",
    title: "Graceful Portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    caption: "High fashion editorial studio portrait.",
    brandSlug: "swara-studio",
    brandTitle: "Swara Studio",
    isFeatured: true,
    aspectRatio: "portrait",
    order: 1,
  },
  {
    _id: "p5",
    title: "Minimalist Lookbook",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    caption: "Apparel lookbook shoot with soft diffused lighting.",
    brandSlug: "swara-studio",
    brandTitle: "Swara Studio",
    isFeatured: true,
    aspectRatio: "portrait",
    order: 2,
  },
  {
    _id: "p6",
    title: "Commercial Product Elegance",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    caption: "Luxury cosmetics product shoot in studio setup.",
    brandSlug: "swara-studio",
    brandTitle: "Swara Studio",
    isFeatured: false,
    aspectRatio: "square",
    order: 3,
  },

  // Swara Moment
  {
    _id: "p7",
    title: "Gala Celebration",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    caption: "Candlelight ambience at corporate anniversary event.",
    brandSlug: "swara-moment",
    brandTitle: "Swara Moment",
    isFeatured: true,
    aspectRatio: "landscape",
    order: 1,
  },
  {
    _id: "p8",
    title: "Engagement Warmth",
    imageUrl:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
    caption: "Intimate engagement gathering moment.",
    brandSlug: "swara-moment",
    brandTitle: "Swara Moment",
    isFeatured: false,
    aspectRatio: "portrait",
    order: 2,
  },
  {
    _id: "p9",
    title: "Joyful Reunion",
    imageUrl:
      "https://images.unsplash.com/photo-1470753937643-efeb931202a9?q=80&w=1200&auto=format&fit=crop",
    caption: "Spontaneous laughter documented at private dinner.",
    brandSlug: "swara-moment",
    brandTitle: "Swara Moment",
    isFeatured: true,
    aspectRatio: "landscape",
    order: 3,
  },

  // Swara Wedding
  {
    _id: "p10",
    title: "The Eternal Vow",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    caption: "Sacred matrimony moment at Plataran.",
    brandSlug: "swara-wedding",
    brandTitle: "Swara Wedding",
    isFeatured: true,
    aspectRatio: "portrait",
    order: 1,
  },
  {
    _id: "p11",
    title: "Sunset Bride",
    imageUrl:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    caption: "Outdoor wedding portrait during golden hour.",
    brandSlug: "swara-wedding",
    brandTitle: "Swara Wedding",
    isFeatured: true,
    aspectRatio: "landscape",
    order: 2,
  },
  {
    _id: "p12",
    title: "First Dance Whispers",
    imageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    caption: "First dance celebration in ballroom setting.",
    brandSlug: "swara-wedding",
    brandTitle: "Swara Wedding",
    isFeatured: true,
    aspectRatio: "portrait",
    order: 3,
  },
];

export const MOCK_TESTIMONIALS: TestimonialData[] = [
  {
    _id: "t1",
    clientName: "Anisa & Dimas",
    roleOrEvent: "Swara Wedding - Matrimony at Plataran Heritage",
    quote:
      "Prabaswara berhasil mengabadikan pernikahan kami dengan cara yang sangat indah dan emosional. Setiap foto terasa hidup dan mengalir alami tanpa paksaan pose.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    brandSlug: "swara-wedding",
  },
  {
    _id: "t2",
    clientName: "Rian Hidayat",
    roleOrEvent: "Swara Studio - Personal Branding & Portrait",
    quote:
      "Suasana studio sangat nyaman dan tim fotografernya sangat mengarahkan dengan sabar. Hasil foto portofolio personal saya sangat profesional!",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    brandSlug: "swara-studio",
  },
  {
    _id: "t3",
    clientName: "Valerie & Co. Fashion",
    roleOrEvent: "Swara Studio - Commercial Lookbook 2025",
    quote:
      "Pencahayaan dan detil warna foto produk dari Swara Studio benar-benar memperkuat brand fashion kami. Sangat direkomendasikan untuk komersial.",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    brandSlug: "swara-studio",
  },
  {
    _id: "t4",
    clientName: "Bumi Raya Tech",
    roleOrEvent: "Swara Moment - Annual Gala Dinner",
    quote:
      "Tim Swara Moment sangat cekatan menangkap ekspresi para tamu dan atmosfer selebrasi perusahaan kami. Hasil dokumentasinya luar biasa.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    brandSlug: "swara-moment",
  },
];

export const MOCK_PACKAGES: PackageData[] = [
  // Swara Studio
  {
    _id: "pkg-studio-1",
    brandSlug: "swara-studio",
    brandTag: "Swara Studio",
    name: "Personal Portrait & Studio",
    price: "Rp 750.000",
    period: "/ sesi photo",
    description:
      "Cocok untuk foto personal portrait, wisuda, profil profesional, dan kebutuhan portofolio komersial.",
    isPopular: false,
    features: [
      "1 Jam Sesi Foto Studio Eksklusif",
      "10 Foto Retouched HD Masterpiece",
      "All Softcopy Files (Google Drive)",
      "1 Cetak Foto 10R + Frame Minimalis",
      "Arahan Pose & Style Guide Personal",
      "Kapasitas Maksimal 2 Person",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan Paket Personal Portrait & Studio (Rp 750.000) dari Swara Studio.",
    order: 1,
  },
  {
    _id: "pkg-studio-2",
    brandSlug: "swara-studio",
    brandTag: "Swara Studio",
    name: "Commercial & Lookbook Studio",
    price: "Rp 2.250.000",
    period: "/ 4 jam sesi",
    description:
      "Penawaran ideal untuk brand fashion, lookbook produk, katalog bisnis, dan kebutuhan komersial.",
    isPopular: true,
    popularLabel: "REKOMENDASI BISNIS",
    features: [
      "Half-Day Studio Session (4 Jam)",
      "30 Foto Retouched High-End Commercial",
      "Master Color Grading + Color Matched",
      "Commercial Rights & Digital Usage",
      "Lighting & Background Setup Kustom",
      "Asisten Fotografer & Arahan Gaya",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan Paket Commercial & Lookbook Studio (Rp 2.250.000) dari Swara Studio.",
    order: 2,
  },

  // Swara Gallery
  {
    _id: "pkg-gallery-1",
    brandSlug: "swara-gallery",
    brandTag: "Swara Gallery",
    name: "Fine Art Print Limited Edition",
    price: "Rp 1.200.000",
    period: "/ cetakan karya",
    description:
      "Cetak foto seni berkualitas museum (archival fine art paper) untuk dekorasi interior hunian dan kantor.",
    isPopular: false,
    features: [
      "Cetak Archival Cotton Rag Paper A2/16R",
      "Frame Kayu Jati Minimalis + Museum Glass",
      "Sertifikat Keaslian Tanda Tangan Artis",
      "Nomor Seri Terbatas (Limited Run)",
      "Garansi Ketahanan Warna Hingga 50 Tahun",
      "Bebas Biaya Pengiriman Jabodetabek",
    ],
    waMessage:
      "Halo Prabaswara, saya berminat memesan karya Fine Art Print Limited Edition dari Swara Gallery.",
    order: 1,
  },
  {
    _id: "pkg-gallery-2",
    brandSlug: "swara-gallery",
    brandTag: "Swara Gallery",
    name: "Custom Visual Art & Licensing",
    price: "Rp 3.500.000",
    period: "/ lisensi proyek",
    description:
      "Layanan kurasi karya seni visual kustom dan lisensi penggunaan foto fine art untuk ruang komersial & publik.",
    isPopular: true,
    popularLabel: "KOLEKTOR PILIHAN",
    features: [
      "Konsultasi Kurasi Interior & Visual Space",
      "Hak Lisensi Penggunaan Komersial Eksklusif",
      "High-Resolution Master Files 60MP",
      "Custom Framing & Material Speciality",
      "Direct Artist Consultation Session",
      "Dokumentasi Instalasi Karya",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan konsultasi lisensi karya visual kustom di Swara Gallery.",
    order: 2,
  },

  // Swara Moment
  {
    _id: "pkg-moment-1",
    brandSlug: "swara-moment",
    brandTag: "Swara Moment",
    name: "Intimate Birthday & Celebration",
    price: "Rp 1.850.000",
    period: "/ event & sesi",
    description:
      "Pilihan ideal untuk foto keluarga, grup, selebrasi ulang tahun, maternity, hingga acara intimate.",
    isPopular: true,
    popularLabel: "PALING POPULER",
    features: [
      "2 - 3 Jam Sesi Foto (Studio / Outdoor)",
      "25 Foto Retouched Premium",
      "Unlimited Softcopy High-Res Files",
      "2 Cetak Foto 10R + Frame Kayu Eksklusif",
      "Free Konsultasi Moodboard & Konsep",
      "Kapasitas Dokumentasi Hingga 6 Person",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan Paket Intimate Birthday & Celebration (Rp 1.850.000) dari Swara Moment.",
    order: 1,
  },
  {
    _id: "pkg-moment-2",
    brandSlug: "swara-moment",
    brandTag: "Swara Moment",
    name: "Corporate Event & Gathering",
    price: "Rp 3.200.000",
    period: "/ event (5 jam)",
    description:
      "Dokumentasi profesional untuk acara gala dinner perusahaan, seminar, launching produk, dan gathering.",
    isPopular: false,
    features: [
      "Liputan Acara Hingga 5 Jam Sesi",
      "1 Fotografer Senior + 1 Assistant",
      "100+ Foto Edited Color Corrected",
      "Same-Day Preview Photos (10 Image)",
      "Google Drive Folder Akses Klien",
      "Hak Cipta Publikasi Media Perusahaan",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan Paket Corporate Event & Gathering (Rp 3.200.000) dari Swara Moment.",
    order: 2,
  },

  // Swara Wedding
  {
    _id: "pkg-wedding-1",
    brandSlug: "swara-wedding",
    brandTag: "Swara Wedding",
    name: "Intimate Wedding Essential",
    price: "Rp 4.500.000",
    period: "/ hari pernikahan",
    description:
      "Layanan lengkap dokumentasi foto & video pernikahan bergaya timeless, emosional, dan bernilai seni tinggi.",
    isPopular: false,
    features: [
      "Full Day Coverage (Hingga 8 Jam Sesi)",
      "2 Fotografer + 1 Videografer Profesional",
      "50+ Foto Retouched Color Graded",
      "Photobook Album Kolase Premium 20 Hal",
      "Video Cinematic Highlight (3-5 Menit)",
      "Custom Wooden USB Flashdisk Box",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan Paket Intimate Wedding Essential (Rp 4.500.000) dari Swara Wedding.",
    order: 1,
  },
  {
    _id: "pkg-wedding-2",
    brandSlug: "swara-wedding",
    brandTag: "Swara Wedding",
    name: "Grand Masterpiece Wedding",
    price: "Rp 8.500.000",
    period: "/ full wedding package",
    description:
      "Paket pernikahan paling komprehensif mencakup Akad/Holy Matrimony, Resepsi, album fisik eksklusif, dan teaser video.",
    isPopular: true,
    popularLabel: "EKSKLUSIF WEDDING",
    features: [
      "Coverage Pernikahan Lengkap (Akad & Resepsi)",
      "3 Fotografer + 2 Videografer + Drone Pilot",
      "100+ Foto Retouched High-End Masterpiece",
      "2 Photobook Luxury Canvas Leather Album 30 Hal",
      "Video Cinematic Teaser (1 Menit) + Film (10-15 Menit)",
      "Pre-Wedding Studio Session Termasuk (Free)",
      "Exclusive Wooden Box Presentation + Framed 16R",
    ],
    waMessage:
      "Halo Prabaswara, saya tertarik dengan Paket Grand Masterpiece Wedding (Rp 8.500.000) dari Swara Wedding.",
    order: 2,
  },
];

export function saveMockPackage(pkgData: any) {
  const brandTagMap: Record<string, string> = {
    "swara-gallery": "Swara Gallery",
    "swara-studio": "Swara Studio",
    "swara-moment": "Swara Moment",
    "swara-wedding": "Swara Wedding",
  };

  const id = pkgData.id || pkgData._id || `pkg-${Date.now()}`;
  const brandSlug = pkgData.brand_slug || pkgData.brandSlug || "swara-studio";

  const fullPkg: PackageData = {
    _id: id,
    brandSlug,
    brandTag: brandTagMap[brandSlug] || brandSlug,
    name: pkgData.name || "Nama Paket",
    price: pkgData.price || "Rp 0",
    period: pkgData.period || "",
    description: pkgData.description || "",
    features: Array.isArray(pkgData.features) ? pkgData.features : [],
    isPopular: Boolean(pkgData.is_popular !== undefined ? pkgData.is_popular : pkgData.isPopular),
    popularLabel: pkgData.popular_label || pkgData.popularLabel || "PALING POPULER",
    waMessage: pkgData.wa_message || pkgData.waMessage || "",
    order: Number(pkgData.display_order !== undefined ? pkgData.display_order : pkgData.order) || 0,
  };

  const index = MOCK_PACKAGES.findIndex((p) => p._id === id);
  if (index >= 0) {
    MOCK_PACKAGES[index] = fullPkg;
  } else {
    MOCK_PACKAGES.push(fullPkg);
  }
  return fullPkg;
}

export function deleteMockPackage(id: string) {
  const index = MOCK_PACKAGES.findIndex((p) => p._id === id);
  if (index >= 0) {
    MOCK_PACKAGES.splice(index, 1);
  }
}

