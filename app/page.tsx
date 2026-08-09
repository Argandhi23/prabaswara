export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import {
  getBrands,
  getFeaturedPhotos,
  getSiteSettings,
  getTestimonials,
} from "@/lib/supabase/data";
import HeroSection from "@/components/sections/HeroSection";
import BrandShowcase from "@/components/sections/BrandShowcase";
import PricingSection from "@/components/sections/PricingSection";
import GalleryGrid from "@/components/sections/GalleryGrid";
import TestimonialSection from "@/components/sections/TestimonialSection";
import AboutSection from "@/components/sections/AboutSection";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { ArrowUpRight, MessageCircle } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.companyName} | ${settings.tagline}`,
    description: settings.aboutText.slice(0, 160),
    openGraph: {
      title: `${settings.companyName} | ${settings.tagline}`,
      description: settings.aboutText.slice(0, 160),
      images: [
        {
          url:
            settings.ogImageUrl ||
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
  };
}

export default async function HomePage() {
  const [settings, brands, photos, testimonials] = await Promise.all([
    getSiteSettings(),
    getBrands(),
    getFeaturedPhotos(),
    getTestimonials(),
  ]);

  const mainWaLink = generateWhatsAppLink({
    number: settings.whatsappNumber,
    customMessage: settings.defaultWhatsappMessage,
  });

  return (
    <div className="space-y-0">
      {/* Hero Section (White) */}
      <HeroSection brands={brands} whatsappNumber={settings.whatsappNumber} />

      {/* About Preview (Off-White #FAFAFA) */}
      <AboutSection settings={settings} />

      {/* Sub-Brands Showcase (Light Gray #F5F5F5) */}
      <BrandShowcase brands={brands} whatsappNumber={settings.whatsappNumber} />

      {/* Paket Harga / Pricing Section */}
      <PricingSection whatsappNumber={settings.whatsappNumber} />

      {/* Featured Gallery (White #FFFFFF) */}

      <GalleryGrid
        photos={photos}
        title="Koleksi Karya Unggulan"
        subtitle="Portofolio fotografi pilihan dari Swara Gallery, Studio, Moment, dan Wedding"
        showFilter={true}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Testimonials (Off-White #FAFAFA) */}
      <TestimonialSection testimonials={testimonials} />

      {/* Main WhatsApp CTA Banner with Luxury Gold-Tinted Gradient Card */}
      <section className="py-24 px-6 md:px-12 bg-white text-[#161616] border-t border-neutral-200/80">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-[#FAFAF7] via-[#F7F3E9] to-[#F3ECD9] border border-[#C9A961]/40 p-10 md:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-[#C9A961]">
            <MessageCircle className="w-64 h-64" />
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A961]/40 bg-[#C9A961]/15 text-[#8C6D2B] text-xs uppercase tracking-[0.25em] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961] animate-pulse" />
            Konsultasi Bebas & Ramah
          </span>

          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#161616]">
            Siap Mengabadikan Momen Berharga Anda?
          </h2>

          <p className="text-sm sm:text-base text-neutral-700 font-sans-body max-w-2xl mx-auto leading-relaxed font-light">
            Hubungi tim Prabaswara langsung melalui WhatsApp untuk konsultasi ide, harga paket, jadwal foto studio, maupun ketersediaan tanggal acara Anda.
          </p>

          <div className="pt-4 flex justify-center">
            <a
              href={mainWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-[#C9A961] rounded-full transition-all duration-300 hover:bg-[#B8964E] hover:scale-105 active:scale-95 shadow-lg"
            >
              <span>Hubungi Tim Prabaswara</span>
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
