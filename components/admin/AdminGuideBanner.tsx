"use client";

import { Info } from "lucide-react";

export default function AdminGuideBanner() {
  return (
    <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-[#C9A961]/10 border border-[#C9A961]/40 p-6 rounded-2xl space-y-3 relative overflow-hidden shadow-lg">
      <div className="flex items-start gap-3">
        <Info className="w-6 h-6 text-[#C9A961] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-serif-heading text-lg font-bold text-white flex items-center gap-2">
            <span>Pusat Pengelolaan Gambar & Portofolio Prabaswara</span>
          </h3>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            Anda dapat mengubah **Foto Karya Galeri** di Tab 1, atau mengganti **Cover Banner 4 Sub-Brand Utama** (Swara Gallery, Studio, Moment, Wedding) di Tab 2. Seluruh gambar baru dapat dipotong (crop) dan otomatis ter-update seketika di website!
          </p>
        </div>
      </div>
    </div>
  );
}
