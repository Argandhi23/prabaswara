"use client";

import { useState } from "react";
import { Check, ArrowUpRight, ShieldCheck, Tag } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { PackageData } from "@/lib/mockData";

interface PricingSectionProps {
  packages?: PackageData[];
  whatsappNumber?: string;
  currentBrandSlug?: string;
  brandTitle?: string;
}

export default function PricingSection({
  packages = [],
  whatsappNumber,
  currentBrandSlug,
  brandTitle,
}: PricingSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentBrandSlug || "swara-studio"
  );

  const categories = [
    { label: "Swara Gallery", value: "swara-gallery" },
    { label: "Swara Studio", value: "swara-studio" },
    { label: "Swara Moment", value: "swara-moment" },
    { label: "Swara Wedding", value: "swara-wedding" },
  ];

  // Filter packages strictly for the active sub-brand category
  const activeBrandSlug = currentBrandSlug || selectedCategory;
  const filteredPackages = packages.filter(
    (pkg) => pkg.brandSlug === activeBrandSlug
  );

  return (
    <section className="relative py-24 px-6 md:px-12 bg-[#FAFAF8] text-[#161616] border-t border-neutral-200/80 overflow-hidden">
      {/* Subtle Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A961]/40 to-transparent" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-[#C9A961]" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#8C6D2B]">
              {brandTitle ? `Investasi Visual ${brandTitle}` : "Pricelist & Paket Harga"}
            </span>
            <div className="w-8 h-[1px] bg-[#C9A961]" />
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#161616]">
            {brandTitle ? `Paket Harga ${brandTitle}` : "Pilihan Paket Harga Kami"}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-sans-body font-light leading-relaxed max-w-2xl">
            {brandTitle
              ? `Penawaran investasi fotografi eksklusif dari ${brandTitle} yang dikurasi khusus untuk kebutuhan visual Anda.`
              : "Pilih kategori sub-brand di bawah untuk melihat penawaran paket harga spesifik sesuai kebutuhan foto Anda."}
          </p>
        </div>

        {/* Category Filter Tabs (Pill Buttons matching Gallery Grid style - 4 Sub-Brands) */}
        {!currentBrandSlug && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto pt-1 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-[#C9A961]/12 text-[#161616] border border-[#C9A961] font-bold scale-105 shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:text-[#C9A961] hover:border-[#C9A961]/50 hover:bg-[#C9A961]/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Pricing Cards Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8">
            <Tag className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-xs text-neutral-500 font-light">
              Belum ada paket harga untuk kategori ini. Hubungi kami via WhatsApp untuk konsultasi kustom.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredPackages.map((pkg) => {
              const cardWaLink = generateWhatsAppLink({
                number: whatsappNumber,
                customMessage:
                  pkg.waMessage ||
                  `Halo Prabaswara, saya tertarik dengan ${pkg.name} (${pkg.price}) dan ingin berkonsultasi mengenai jadwal ketersediaan.`,
              });

              return (
                <div
                  key={pkg._id}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 transition-all duration-300 ${
                    pkg.isPopular
                      ? "bg-white border border-[#C9A961] shadow-xl ring-1 ring-[#C9A961]/30 z-10"
                      : "bg-white/90 border border-neutral-200/90 shadow-md hover:shadow-lg hover:border-neutral-300"
                  }`}
                >
                  {/* Subtle Badge */}
                  {pkg.isPopular && (
                    <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-[#161616] text-[#C9A961] text-[10px] font-medium uppercase tracking-[0.2em] shadow-sm border border-[#C9A961]/40">
                      {pkg.popularLabel || "REKOMENDASI"}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Sub-brand tag & Title */}
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-[#FAFAF8] text-[#8C6D2B] border border-[#C9A961]/30">
                        {pkg.brandTag || pkg.brandSlug}
                      </span>

                      <h3 className="font-serif-heading text-2xl font-bold text-[#161616] mt-3 tracking-tight">
                        {pkg.name}
                      </h3>

                      {pkg.description && (
                        <p className="text-xs text-neutral-500 font-sans-body font-light leading-relaxed mt-2.5 min-h-[36px]">
                          {pkg.description}
                        </p>
                      )}
                    </div>

                    {/* Price display */}
                    <div className="pt-3 border-t border-neutral-100">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#161616]">
                          {pkg.price}
                        </span>
                        {pkg.period && (
                          <span className="text-xs text-neutral-400 font-light">
                            {pkg.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                          Fasilitas Termasuk:
                        </span>
                        <ul className="space-y-2.5">
                          {pkg.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 font-sans-body font-light">
                              <div className="p-0.5 rounded-full bg-[#C9A961]/15 text-[#8C6D2B] shrink-0 mt-0.5">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </div>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card CTA Action */}
                  <div className="pt-8 mt-6 border-t border-neutral-100">
                    <a
                      href={cardWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-sm ${
                        pkg.isPopular
                          ? "bg-[#C9A961] text-white hover:bg-[#B8964E]"
                          : "bg-neutral-900 text-white hover:bg-[#C9A961]"
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
        )}

        {/* Custom Quote Footer Note */}
        <div className="bg-white/80 border border-neutral-200/80 rounded-2xl p-6 text-center max-w-3xl mx-auto flex items-center justify-center gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#C9A961] shrink-0" />
          <p className="text-xs text-neutral-600 font-sans-body font-light">
            Membutuhkan penawaran khusus atau paket kustom sesuai kebutuhan event Anda?{" "}
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
