"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BrandData } from "@/lib/mockData";
import { generateWhatsAppLink } from "@/lib/whatsapp";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BrandShowcaseProps {
  brands: BrandData[];
  whatsappNumber?: string;
}

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: idx * 0.12,
      duration: 0.7,
      ease: customEase,
    },
  }),
};

export default function BrandShowcase({
  brands,
  whatsappNumber,
}: BrandShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger for Scroll-linked image parallax (targeted on plain image wrapper divs, NOT motion.div)
  useGSAP(
    () => {
      if (!gridRef.current || !sectionRef.current) return;

      const imgContainers = gridRef.current.querySelectorAll(".brand-card-img-wrapper");

      imgContainers.forEach((imgBox) => {
        gsap.to(imgBox, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: imgBox,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="sub-brands"
      className="relative py-24 px-6 md:px-12 bg-[#F5F5F5] border-t border-neutral-200/80 overflow-hidden"
    >
      {/* Subtle Dot Pattern Texture */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Section Header with Gold Line Accent & Left Alignment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-8 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-[#C9A961]" />
              <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
                Layanan Utama
              </span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-neutral-950 tracking-tight">
              Empat Sub-Brand Prabaswara
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 font-sans-body font-light leading-relaxed">
            Setiap sub-brand difokuskan untuk memberikan kualitas karya fotografi terbaik sesuai kebutuhan visual Anda.
          </p>
        </div>

        {/* 4 Brand Cards Grid with GSAP Scroll-linked Parallax */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {brands.map((brand, idx) => {
            const waLink = generateWhatsAppLink({
              number: whatsappNumber,
              brandSlug: brand.slug,
              customMessage: brand.whatsappMessage,
            });

            return (
              <motion.div
                key={brand.slug}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative flex flex-col justify-between bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs hover:border-[#C9A961]/70 hover:shadow-xl transition-all duration-300"
              >
                {/* Image Aspect Box */}
                <div className="brand-card-img-wrapper relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={brand.coverImage}
                    alt={brand.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  <span className="absolute top-4 left-4 px-3.5 py-1 text-[10px] uppercase tracking-widest font-semibold text-white bg-[#C9A961] backdrop-blur-md rounded-full shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    0{idx + 1} / 04
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#161616] group-hover:text-[#C9A961] transition-colors duration-300">
                      {brand.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C9A961]">
                      {brand.tagline}
                    </p>
                    <p className="text-sm text-neutral-600 font-sans-body leading-relaxed font-light line-clamp-3">
                      {brand.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center gap-3 border-t border-neutral-100">
                    <Link
                      href={`/${brand.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#161616] rounded-full transition-all duration-300 hover:bg-[#C9A961] hover:scale-[1.02] active:scale-95 text-center shadow-xs"
                    >
                      <span>Lihat Galeri</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A961] group-hover:text-white transition-colors duration-300" />
                    </Link>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-neutral-700 border border-neutral-200 rounded-full transition-all duration-300 hover:text-[#C9A961] hover:border-[#C9A961] hover:bg-[#C9A961]/10 active:scale-95"
                      title={`Tanya via WhatsApp tentang ${brand.title}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
