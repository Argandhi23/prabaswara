"use client";

import { PhotoData } from "@/lib/mockData";
import FeaturedWorkItem from "./FeaturedWorkItem";

interface FeaturedWorkSectionProps {
  photos: PhotoData[];
  whatsappNumber?: string;
}

export default function FeaturedWorkSection({
  photos,
  whatsappNumber,
}: FeaturedWorkSectionProps) {
  // Extract 4 curated featured photos representing each sub-brand
  const featuredList =
    photos.filter((p) => p.isFeatured).slice(0, 4).length > 0
      ? photos.filter((p) => p.isFeatured).slice(0, 4)
      : photos.slice(0, 4);

  return (
    <section className="relative py-24 px-6 md:px-12 bg-[#FAFAF8] text-[#161616] border-t border-neutral-200/80 overflow-hidden">
      {/* Section Divider Gradient */}
      <div className="absolute top-0 left-0 right-0 section-divider-gradient" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Clean Section Header (No Demo Placeholders) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-[#C9A961]" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
              Koleksi Unggulan Pilihan
            </span>
            <div className="w-8 h-[2px] bg-[#C9A961]" />
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#161616]">
            Karya Unggulan Kami
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-sans-body font-light leading-relaxed">
            Penampilan kurasi karya fotografi terbaik dari Swara Gallery, Studio, Moment, dan Wedding yang menyajikan narasi visual penuh makna.
          </p>
        </div>

        {/* Parallax Scroll Items rendered via FeaturedWorkItem child component */}
        <div className="flex flex-col md:px-0">
          {featuredList.map((photo, index) => (
            <FeaturedWorkItem
              key={photo._id}
              photo={photo}
              index={index}
              reverse={index % 2 !== 0}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
