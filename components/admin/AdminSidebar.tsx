"use client";

import Image from "next/image";
import {
  BarChart3,
  Grid,
  Layers,
  Tag,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";

export type AdminTabType = "analytics" | "photos" | "brands" | "packages" | "settings";

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  counts: {
    todayVisitors: number;
    photos: number;
    brands: number;
    packages: number;
  };
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  counts,
  mobileOpen,
  setMobileOpen,
  onLogout,
}: AdminSidebarProps) {
  const navItems: {
    id: AdminTabType;
    label: string;
    sublabel: string;
    icon: typeof Grid;
    badge?: number | string;
  }[] = [
    {
      id: "photos",
      label: "Galeri Foto",
      sublabel: "Portofolio & karya",
      icon: Grid,
      badge: counts.photos,
    },
    {
      id: "brands",
      label: "Banner Sub-Brand",
      sublabel: "Cover 4 layanan utama",
      icon: Layers,
      badge: counts.brands,
    },
    {
      id: "packages",
      label: "Paket & Pricelist",
      sublabel: "Harga & daftar benefit",
      icon: Tag,
      badge: counts.packages,
    },
    {
      id: "analytics",
      label: "Statistik Pengunjung",
      sublabel: "Trafik IG, Chrome, dll",
      icon: BarChart3,
      badge: counts.todayVisitors > 0 ? `${counts.todayVisitors} hari ini` : undefined,
    },
    {
      id: "settings",
      label: "Pengaturan Website",
      sublabel: "Gambar About & Kontak WA",
      icon: Settings,
    },
  ];

  const handleSelect = (id: AdminTabType) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Brand & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-40 h-11 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Prabaswara Logo"
                  fill
                  sizes="160px"
                  className="object-contain object-left scale-110 origin-left"
                  priority
                />
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              aria-label="Tutup menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Section Label */}
          <div className="px-5 pt-5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Menu Kelola Website
            </span>
          </div>

          {/* Navigation Buttons */}
          <nav className="px-3 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? "bg-[#C9A961] text-neutral-950 shadow-md shadow-[#C9A961]/10"
                      : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isActive
                          ? "bg-neutral-950/15 text-neutral-950"
                          : "bg-neutral-950 text-[#C9A961] border border-neutral-800 group-hover:border-[#C9A961]/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div
                        className={`text-xs tracking-wide truncate ${
                          isActive ? "font-bold text-neutral-950" : "font-semibold text-neutral-200"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? "text-neutral-900/80 font-medium" : "text-neutral-500"
                        }`}
                      >
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isActive
                          ? "bg-neutral-950 text-[#C9A961]"
                          : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2 bg-neutral-950/40">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition-colors"
          >
            <span>Lihat Website Utama</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C9A961]" />
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-xs font-semibold text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
