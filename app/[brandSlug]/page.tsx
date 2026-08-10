export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getBrandBySlug,
  getBrands,
  getPackages,
  getPhotosByBrand,
  getSiteSettings,
  getTestimonials,
} from "@/lib/supabase/data";
import GalleryGrid from "@/components/sections/GalleryGrid";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { ArrowUpRight, MessageCircle } from "lucide-react";

interface BrandPageProps {
  params: Promise<{ brandSlug: string }>;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((b) => ({
    brandSlug: b.slug,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);

  if (!brand) {
    return {
      title: "Brand Tidak Ditemukan | Prabaswara",
    };
  }

  return {
    title: `${brand.title} - ${brand.tagline}`,
    description: brand.description,
    openGraph: {
      title: `${brand.title} | Prabaswara Photography`,
      description: brand.description,
      images: [
        {
          url: brand.coverImage,
        },
      ],
    },
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { brandSlug } = await params;
  const [brand, photos, testimonials, settings, packages] = await Promise.all([
    getBrandBySlug(brandSlug),
    getPhotosByBrand(brandSlug),
    getTestimonials(brandSlug),
    getSiteSettings(),
    getPackages(brandSlug),
  ]);

  if (!brand) {
    notFound();
  }

  const brandWaLink = generateWhatsAppLink({
    number: settings.whatsappNumber,
    brandSlug: brand.slug,
    brandTitle: brand.title,
    customMessage: brand.whatsappMessage,
  });

  return (
    <div className="pt-24 pb-16 space-y-0 bg-white text-neutral-950">
      {/* Brand Hero Banner */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center px-6 md:px-12 overflow-hidden border-b border-neutral-200">
        {/* Background Cover */}
        <div className="absolute inset-0 z-0">
          <Image
            src={brand.coverImage}
            alt={brand.title}
            fill
            sizes="100vw"
            className="object-cover opacity-15 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/60" />
        </div>

        {/* Content Header */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 py-12 flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-100/90 backdrop-blur-md text-neutral-700 text-xs uppercase tracking-[0.25em] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
            Prabaswara / Sub-Brand
          </span>

          <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-950">
            {brand.title}
          </h1>

          <div className="w-12 h-[2px] bg-[#C9A961] rounded-full my-1" />

          <p className="text-sm sm:text-lg text-[#C9A961] uppercase tracking-widest font-semibold max-w-2xl mx-auto">
            {brand.tagline}
          </p>

          <p className="text-sm sm:text-base text-neutral-600 font-sans-body font-light leading-relaxed max-w-3xl mx-auto pt-2">
            {brand.description}
          </p>

          <div className="pt-6 flex justify-center">
            <a
              href={brandWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-neutral-950 rounded-full transition-all duration-300 hover:bg-neutral-900 hover:scale-105 active:scale-95 shadow-lg"
            >
              <span>Konsultasi {brand.title}</span>
              <ArrowUpRight className="w-4 h-4 text-[#C9A961] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Brand Gallery Grid */}
      <GalleryGrid
        photos={photos}
        title={`Galeri ${brand.title}`}
        subtitle={`Koleksi hasil karya fotografi dan portofolio ${brand.title}`}
        showFilter={false}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Brand Pricing Packages Section */}
      <PricingSection
        packages={packages}
        currentBrandSlug={brand.slug}
        brandTitle={brand.title}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Brand Testimonials if available */}
      {testimonials.length > 0 && (
        <TestimonialSection
          testimonials={testimonials}
          title={`Ulasan Klien ${brand.title}`}
          subtitle="Pengalaman dan kesan mendalam dari klien yang menggunakan layanan ini"
        />
      )}

      {/* Brand Contextual CTA Banner */}
      <section className="py-20 px-6 md:px-12 bg-[#F5F5F5] border-t border-neutral-200">
        <div className="max-w-4xl mx-auto text-center space-y-6 bg-white border border-neutral-200 p-10 md:p-14 rounded-3xl shadow-md">
          <MessageCircle className="w-12 h-12 text-[#C9A961] mx-auto opacity-90" />
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-neutral-950">
            Tertarik Menggunakan Layanan {brand.title}?
          </h2>
          <p className="text-sm text-neutral-600 font-sans-body max-w-xl mx-auto leading-relaxed font-light">
            Klik tombol di bawah untuk terhubung langsung dengan tim Prabaswara melalui WhatsApp dengan pesan otomatis khusus layanan ini.
          </p>
          <div className="pt-4 flex justify-center">
            <a
              href={brandWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-neutral-950 rounded-full transition-all duration-300 hover:bg-neutral-900 hover:scale-105 active:scale-95 shadow-md"
            >
              <span>Chat WhatsApp Sekarang</span>
              <ArrowUpRight className="w-4 h-4 text-[#C9A961] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
