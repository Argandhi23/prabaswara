"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PhotoData } from "@/lib/mockData";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface FeaturedWorkItemProps {
  photo: PhotoData;
  index: number;
  reverse?: boolean;
  whatsappNumber?: string;
}

export default function FeaturedWorkItem({
  photo,
  index,
  reverse = false,
  whatsappNumber,
}: FeaturedWorkItemProps) {
  // Top-level hooks call inside child component to adhere to React Rules of Hooks
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center start"],
  });

  // Framer Motion transforms for clipPath wipe reveal, opacity fade, and Y translation
  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const clipProgress = useTransform(
    scrollYProgress,
    [0, 0.7],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );
  const translateContent = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  const waLink = generateWhatsAppLink({
    number: whatsappNumber,
    brandSlug: photo.brandSlug,
    customMessage: `Halo Prabaswara, saya tertarik dengan karya '${photo.title}' dari ${photo.brandTitle}.`,
  });

  return (
    <div
      ref={sectionRef}
      className={`min-h-[85vh] md:h-screen flex flex-col items-center justify-center gap-12 md:gap-28 lg:gap-36 py-12 md:py-0 ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Text Column with Scroll Translation */}
      <motion.div
        style={{ y: translateContent }}
        className="flex-1 max-w-lg space-y-6 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
            0{index + 1} / 04 — {photo.brandTitle}
          </span>
          <div className="w-8 h-[2px] bg-[#C9A961]" />
        </div>

        <h3 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#161616] leading-tight">
          {photo.title}
        </h3>

        <motion.p
          style={{ y: translateContent }}
          className="text-sm sm:text-base text-neutral-600 font-sans-body font-light leading-relaxed"
        >
          {photo.caption ||
            "Karya visual artistik dengan standar pencahayaan dan narasi emosional yang dirancang secara profesional."}
        </motion.p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Link
            href={`/${photo.brandSlug}`}
            className="group inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#161616] rounded-full transition-all duration-300 hover:bg-[#C9A961] shadow-xs"
          >
            <span>Lihat Galeri {photo.brandTitle}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A961] group-hover:text-white transition-colors duration-300" />
          </Link>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 border border-neutral-300 rounded-full transition-all duration-300 hover:border-[#C9A961] hover:text-[#C9A961] hover:bg-[#C9A961]/5"
          >
            Tanya via WA
          </a>
        </div>
      </motion.div>

      {/* Image Media Column with ClipPath Reveal & Opacity Animation */}
      <motion.div
        style={{
          opacity: opacityContent,
          clipPath: clipProgress,
        }}
        className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-3xl overflow-hidden border border-neutral-200/80 shadow-2xl bg-neutral-100 shrink-0"
      >
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          sizes="(max-width: 768px) 320px, 420px"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50 pointer-events-none" />
      </motion.div>
    </div>
  );
}
