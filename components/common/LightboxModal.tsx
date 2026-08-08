"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ArrowUpRight } from "lucide-react";
import { PhotoData } from "@/lib/mockData";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface LightboxModalProps {
  photo: PhotoData | null;
  onClose: () => void;
  whatsappNumber?: string;
}

export default function LightboxModal({
  photo,
  onClose,
  whatsappNumber,
}: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (photo) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  const photoWaLink = generateWhatsAppLink({
    number: whatsappNumber,
    brandSlug: photo.brandSlug,
    customMessage: `Halo Prabaswara, saya tertarik dengan foto berjudul "${photo.title}" dari ${photo.brandTitle}. Saya ingin berkonsultasi mengenai proyek serupa.`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-neutral-950/80 backdrop-blur-xl transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-md"
        aria-label="Tutup preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Container */}
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Display */}
        <div className="relative flex-1 min-h-[350px] md:min-h-[550px] bg-neutral-950 flex items-center justify-center">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 1200px) 100vw, 80vw"
            priority
          />
        </div>

        {/* Info & Action Panel */}
        <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200 bg-white">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-full">
              {photo.brandTitle}
            </span>
            <h3 className="font-serif-heading text-2xl font-bold text-neutral-950">
              {photo.title}
            </h3>
            {photo.caption && (
              <p className="text-sm text-neutral-600 font-sans-body leading-relaxed font-light">
                {photo.caption}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-neutral-200 space-y-3">
            <a
              href={photoWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-semibold uppercase tracking-widest text-white bg-neutral-950 rounded-full transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <span>Konsultasi Foto Ini</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
