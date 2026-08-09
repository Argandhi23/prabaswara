"use client";

import Image from "next/image";
import { Edit, Trash2, Star, Eye } from "lucide-react";
import { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
  onEdit: (photo: Photo) => void;
  onDelete: (id: string) => void;
}

export default function PhotoCard({ photo, onEdit, onDelete }: PhotoCardProps) {
  const targetPage =
    photo.brand_slug === "swara-gallery"
      ? "/swara-gallery"
      : photo.brand_slug === "swara-studio"
      ? "/swara-studio"
      : photo.brand_slug === "swara-moment"
      ? "/swara-moment"
      : photo.brand_slug === "swara-wedding"
      ? "/swara-wedding"
      : "/";

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-[#C9A961]/60 transition-all shadow-md group">
      <div>
        {/* Image Preview */}
        <div className="relative aspect-[3/4] bg-neutral-950 overflow-hidden">
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />

          {photo.is_featured && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#C9A961] text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-neutral-950" />
              Tampil di Homepage
            </span>
          )}
        </div>

        {/* Content Info & Location Badge */}
        <div className="p-5 space-y-3">
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1">
            <span className="text-neutral-400 font-medium block">📍 Halaman Website:</span>
            <div className="flex items-center justify-between">
              <span className="text-[#C9A961] font-bold uppercase tracking-wider">
                {photo.brand_title || photo.brand_slug}
              </span>
              <a
                href={targetPage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 underline"
              >
                <span>Lihat</span>
                <Eye className="w-3 h-3 text-[#C9A961]" />
              </a>
            </div>
          </div>

          <h3 className="font-serif-heading text-lg font-bold text-white line-clamp-1">
            {photo.title}
          </h3>

          {photo.caption && (
            <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
              {photo.caption}
            </p>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
        <button
          onClick={() => onEdit(photo)}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-[#C9A961] font-semibold transition-colors cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Foto & Caption</span>
        </button>

        <button
          onClick={() => onDelete(photo.id)}
          className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}
