"use client";

import { Check, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface PricingSectionProps {
  whatsappNumber?: string;
}

export default function PricingSection({ whatsappNumber }: PricingSectionProps) {
  const packages = [
    {
      id: "pkg-studio",
      name: "Paket Personal & Studio",
      brandTag: "Swara Studio",
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
        "Halo Prabaswara, saya tertarik dengan Paket Personal & Studio (Rp 750.000) dan ingin berkonsultasi mengenai jadwal ketersediaan foto studio.",
    },
    {
      id: "pkg-moment",
      name: "Paket Moment & Group",
      brandTag: "Swara Moment",
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
        "Halo Prabaswara, saya tertarik dengan Paket Moment & Group (Rp 1.850.000) dan ingin menanyakan penawaran dokumentasi acara kami.",
    },
    {
      id: "pkg-wedding",
      name: "Paket Wedding & Special Event",
      brandTag: "Swara Wedding",
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
        "Halo Prabaswara, saya tertarik dengan Paket Wedding & Special Event (Rp 4.500.000) dan ingin berkonsultasi mengenai dokumentasi pernikahan kami.",
    },
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 bg-[#FAFAF8] text-[#161616] border-t border-neutral-200/80 overflow-hidden">
      {/* Section Top Subtle Gradient Divider */}
      <div className="absolute top-0 left-0 right-0 section-divider-gradient" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-[#C9A961]" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
              Paket Layanan & Investasi Visual
            </span>
            <div className="w-8 h-[2px] bg-[#C9A961]" />
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#161616]">
            Pilihan Paket Harga Kami
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-sans-body font-light leading-relaxed">
            Kurasi penawaran harga terbaik yang dirancang spesifik untuk kebutuhan foto studio personal, dokumentasi momen berharga, hingga pernikahan impian Anda.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const cardWaLink = generateWhatsAppLink({
              number: whatsappNumber,
              customMessage: pkg.waMessage,
            });

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 transition-all duration-300 ${
                  pkg.isPopular
                    ? "bg-white border-2 border-[#C9A961] shadow-2xl scale-102 z-10"
                    : "bg-white/80 border border-neutral-200/90 shadow-lg hover:shadow-xl hover:border-[#C9A961]/50"
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#C9A961] text-[#161616] text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{pkg.popularLabel}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Sub-brand tag & Title */}
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#C9A961]/12 text-[#8C6D2B] border border-[#C9A961]/30">
                      {pkg.brandTag}
                    </span>
                    <h3 className="font-serif-heading text-2xl font-bold text-[#161616] mt-3">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-sans-body font-light leading-relaxed mt-2 min-h-[36px]">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price display */}
                  <div className="pt-2 border-t border-neutral-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#161616]">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-neutral-400 font-light font-mono">
                        {pkg.period}
                      </span>
                    </div>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                      Fasilitas Paket Termasuk:
                    </span>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 font-sans-body">
                          <div className="p-0.5 rounded-full bg-[#C9A961]/20 text-[#8C6D2B] shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Action */}
                <div className="pt-8 mt-6 border-t border-neutral-100">
                  <a
                    href={cardWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md ${
                      pkg.isPopular
                        ? "bg-[#C9A961] text-[#161616] hover:bg-[#B8964E] hover:text-white"
                        : "bg-neutral-900 text-white hover:bg-[#C9A961] hover:text-[#161616]"
                    }`}
                  >
                    <span>Pesan Paket Via WA</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quote Footer Note */}
        <div className="bg-white/60 border border-neutral-200/80 rounded-2xl p-6 text-center max-w-3xl mx-auto flex items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C9A961] shrink-0" />
          <p className="text-xs text-neutral-600 font-sans-body font-light">
            Membutuhkan penawaran khusus atau paket kustom sesuai event Anda?{" "}
            <a
              href={generateWhatsAppLink({
                number: whatsappNumber,
                customMessage:
                  "Halo Prabaswara, saya ingin menanyakan penawaran harga paket kustom (custom quote) untuk kebutuhan acara kami.",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C6D2B] font-semibold underline hover:text-[#C9A961] transition-colors"
            >
              Konsultasi langsung via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
