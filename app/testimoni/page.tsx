import { Metadata } from "next";
import { getSiteSettings, getTestimonials } from "@/lib/supabase/data";
import TestimonialSection from "@/components/sections/TestimonialSection";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Testimoni Klien",
    description: `Ulasan dan pengalaman nyata dari para klien yang telah menggunakan jasa fotografi Swara Gallery, Studio, Moment, dan Wedding di ${settings.companyName}.`,
    openGraph: {
      title: `Testimoni Klien | ${settings.companyName}`,
      description: `Ulasan dan pengalaman nyata dari para klien ${settings.companyName}.`,
    },
  };
}

export default async function TestimoniPage() {
  const [testimonials, settings] = await Promise.all([
    getTestimonials(),
    getSiteSettings(),
  ]);

  const waLink = generateWhatsAppLink({ number: settings.whatsappNumber });

  return (
    <div className="pt-24 pb-16 bg-white text-neutral-950 space-y-0">
      {/* Page Header */}
      <section className="py-16 px-6 md:px-12 text-center bg-[#FAFAFA] border-b border-neutral-200">
        <div className="max-w-4xl mx-auto space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-[2px] bg-[#C9A961]" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
              Ulasan & Pengalaman
            </span>
            <div className="w-6 h-[2px] bg-[#C9A961]" />
          </div>
          <h1 className="font-serif-heading text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950">
            Testimoni Klien
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-sans-body font-light max-w-2xl mx-auto leading-relaxed">
            Dengarkan apa kata para pasangan, individu, dan perusahaan yang telah memercayakan momen berharga mereka kepada Prabaswara.
          </p>
        </div>
      </section>

      {/* Main Testimonial Section */}
      <TestimonialSection
        testimonials={testimonials}
        title="Ulasan Pelanggan Prabaswara"
        subtitle="Kepuasan dan kebahagiaan Anda adalah prioritas utama setiap karya yang kami hasilkan"
      />

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12 bg-[#F5F5F5] text-center border-t border-neutral-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif-heading text-3xl font-bold text-neutral-950">
            Jadilah Bagian dari Cerita Indah Berikutnya
          </h2>
          <p className="text-sm text-neutral-600 font-sans-body font-light">
            Hubungi kami sekarang untuk berkonsultasi dan mewujudkan momen visual terbaik Anda.
          </p>
          <div className="pt-4 flex justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-neutral-950 rounded-full transition-all duration-300 hover:bg-neutral-900 hover:scale-105 active:scale-95 shadow-md"
            >
              <span>Konsultasi WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 text-[#C9A961] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
