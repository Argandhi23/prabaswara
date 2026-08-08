"use client";

import Image from "next/image";
import { ExternalLink, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="relative w-52 h-14 shrink-0">
          <Image
            src="/logo.png"
            alt="Prabaswara Logo"
            fill
            sizes="208px"
            className="object-contain object-left scale-110 origin-left"
            priority
          />
        </div>
        <div className="hidden sm:block pl-5 border-l border-neutral-800">
          <h1 className="font-serif-heading text-lg font-bold text-white tracking-wide">
            Admin Panel
          </h1>
          <p className="text-[11px] text-[#C9A961] uppercase tracking-widest font-semibold">
            Management Portofolio & Cover Sub-Brand
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 transition-colors"
        >
          <span>Buka Website Utama</span>
          <ExternalLink className="w-4 h-4 text-[#C9A961]" />
        </a>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/70 border border-red-800/80 text-xs font-semibold text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
