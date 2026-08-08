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
  whatsappNumber: "6281234567890",
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
