"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PhotoData } from "@/lib/mockData";
import LightboxModal from "@/components/common/LightboxModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryGridProps {
  photos: PhotoData[];
  title?: string;
  subtitle?: string;
  showFilter?: boolean;
  whatsappNumber?: string;
}

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function GalleryGrid({
  photos,
  title = "Koleksi Karya Pilihan",
  subtitle = "Portofolio visual karya unggulan dari seluruh sub-brand Prabaswara",
  showFilter = true,
  whatsappNumber,
}: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<PhotoData | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger for ScrollTrigger refresh on layout updates
  useGSAP(
    () => {
      ScrollTrigger.refresh();
    },
    { scope: sectionRef, dependencies: [selectedCategory] }
  );

  const categories = [
    { label: "Semua Karya", value: "all" },
    { label: "Swara Gallery", value: "swara-gallery" },
    { label: "Swara Studio", value: "swara-studio" },
    { label: "Swara Moment", value: "swara-moment" },
    { label: "Swara Wedding", value: "swara-wedding" },
  ];

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((p) => p.brandSlug === selectedCategory);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 bg-white text-neutral-950 border-t border-neutral-200/80"
    >
      {/* Subtle Gradient Section Divider */}
      <div className="absolute top-0 left-0 right-0 section-divider-gradient" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header with Gold Accent */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-[2px] bg-[#C9A961]" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
              Portofolio Fotografi
            </span>
            <div className="w-6 h-[2px] bg-[#C9A961]" />
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-neutral-950 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-neutral-600 font-sans-body font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filter Tabs with Gold Tint Active State */}
        {showFilter && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto pt-2 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? "bg-[#C9A961]/12 text-[#161616] border border-[#C9A961] font-bold scale-105 shadow-xs"
                    : "bg-neutral-50/80 text-neutral-600 border border-neutral-200 hover:text-[#C9A961] hover:border-[#C9A961]/50 hover:bg-[#C9A961]/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Masonry / Grid Display with Framer Motion Layout Animation & GSAP Scroll-linked Shift */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 font-sans-body">
            Belum ada foto untuk kategori ini.
          </div>
        ) : (
          <motion.div
            ref={galleryGridRef}
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => {
                const isPortrait = photo.aspectRatio === "portrait";
                const isLandscape = photo.aspectRatio === "landscape";

                return (
                  <motion.div
                    key={photo._id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.4, ease: customEase }}
                    onClick={() => setActivePhoto(photo)}
                    className="group relative overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/80 cursor-pointer transition-all duration-500 hover:border-[#C9A961]/80 hover:shadow-xl aspect-[3/4]"

                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Dark Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                      <div className="flex justify-end">
                        <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-[#C9A961] border border-white/20 shadow-sm">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>

                      <div className="space-y-1 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#C9A961]">
                          {photo.brandTitle}
                        </span>
                        <h4 className="font-serif-heading text-xl font-bold text-white">
                          {photo.title}
                        </h4>
                        {photo.caption && (
                          <p className="text-xs text-neutral-300 font-sans-body line-clamp-2 font-light">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
        whatsappNumber={whatsappNumber}
      />
    </section>
  );
}
