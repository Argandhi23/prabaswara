"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { BrandData } from "@/lib/mockData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  brands: BrandData[];
  whatsappNumber?: string;
}

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: customEase,
    },
  },
};

export default function HeroSection({
  brands,
  whatsappNumber,
}: HeroSectionProps) {
  const waLink = generateWhatsAppLink({ number: whatsappNumber });
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const scrollFadeRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger for Scroll-linked Parallax & Scroll Fade
  useGSAP(
    () => {
      if (!bgImageRef.current || !sectionRef.current) return;

      // Parallax background image linked to scroll position
      gsap.to(bgImageRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Subtle scroll-linked text fade out when scrolling past hero (targeted on dedicated scrollFadeRef)
      if (scrollFadeRef.current) {
        gsap.to(scrollFadeRef.current, {
          opacity: 0.3,
          y: 35,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex items-center justify-center pt-36 pb-28 px-6 md:px-12 overflow-hidden bg-white text-neutral-950"
    >
      {/* Subtle Gray Grid Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Background Image Overlay with GSAP Scroll-linked Parallax */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
        <div ref={bgImageRef} className="relative w-full h-[120%] -top-[10%]">
          <Image
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
            alt="Prabaswara Background"
            fill
            sizes="100vw"
            className="object-cover grayscale"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/60" />
      </div>

      <motion.div
        ref={textContainerRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <div ref={scrollFadeRef} className="space-y-10">
          {/* Badge with Gold Accent Tint */}
          <motion.div variants={itemVariants} className="inline-block">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C9A961]/30 bg-[#C9A961]/8 backdrop-blur-md text-neutral-800 text-[10px] uppercase tracking-[0.3em] font-semibold">
              <Camera className="w-3.5 h-3.5 text-[#C9A961]" />
              <span>Photography & Visual Art Studio</span>
            </div>
          </motion.div>

          {/* Main Headline with Gold Highlighted Phrase */}
          <div className="space-y-6">
            <motion.h1
              variants={itemVariants}
              className="font-serif-heading text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] font-bold tracking-tight text-[#161616] leading-[1.04]"
            >
              Mengabadikan <br className="hidden sm:block" />
              <span className="text-[#C9A961] italic font-normal">Setiap Momen</span> Abadi
            </motion.h1>

            {/* Gold Accent Divider line */}
            <motion.div variants={itemVariants} className="flex justify-center pt-1">
              <div className="w-16 h-[2px] bg-[#C9A961] rounded-full" />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 font-sans-body leading-relaxed font-light"
            >
              Prabaswara menghadirkan narasi visual yang estetis dan emosional melalui empat fokus keahlian: seni galeri, foto studio, dokumentasi momen, dan pernikahan.
            </motion.p>
          </div>

          {/* Sub-brand Pills with Gold Hover State */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/${brand.slug}`}
                className="px-5 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-wider text-neutral-700 bg-neutral-50/80 border border-neutral-200 transition-all duration-300 hover:text-neutral-950 hover:border-[#C9A961] hover:bg-[#C9A961]/10 hover:scale-105 active:scale-95 shadow-2xs"
              >
                {brand.title}
              </Link>
            ))}
          </motion.div>

          {/* Action CTAs: Solid Gold WhatsApp Button & Outline Layanan Button */}
          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-[#C9A961] rounded-full transition-all duration-300 hover:bg-[#B8964E] hover:scale-105 active:scale-95 shadow-md"
            >
              <span>Konsultasi WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#sub-brands"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-700 border border-neutral-300 rounded-full transition-all duration-300 hover:text-neutral-950 hover:border-[#C9A961] hover:bg-[#C9A961]/5"
            >
              Lihat Layanan & Galeri
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
