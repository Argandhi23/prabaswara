"use client";

import Image from "next/image";
import { Crop, Eye } from "lucide-react";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
}

export default function BrandCard({ brand, onEdit }: BrandCardProps) {
  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-[#C9A961]/60 transition-all shadow-lg">
      <div>
        {/* Cover Banner Preview */}
        <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
          <Image
            src={brand.cover_image}
            alt={brand.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold block">
              Cover Banner Halaman
            </span>
            <h3 className="font-serif-heading text-xl font-bold">
              {brand.title}
            </h3>
            <p className="text-xs text-neutral-300 font-light line-clamp-1">
              {brand.tagline}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-2">
          <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        </div>
      </div>

      <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
        <a
          href={`/${brand.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 underline"
        >
          <span>Lihat Halaman {brand.title}</span>
          <Eye className="w-3.5 h-3.5 text-[#C9A961]" />
        </a>

        <button
          onClick={() => onEdit(brand)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A961] hover:bg-[#B8964E] text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <Crop className="w-3.5 h-3.5" />
          <span>Ganti Banner & Crop</span>
        </button>
      </div>
    </div>
  );
}
