"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ArrowUpRight, ChevronDown, Camera, Image as ImageIcon, Calendar, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const BRAND_SERVICES = [
  {
    name: "SWARA GALLERY",
    href: "/swara-gallery",
    desc: "Seni karya & dokumentasi visual fine art",
    icon: ImageIcon,
  },
  {
    name: "SWARA STUDIO",
    href: "/swara-studio",
    desc: "Foto studio, potret personal & komersial",
    icon: Camera,
  },
  {
    name: "SWARA MOMENT",
    href: "/swara-moment",
    desc: "Dokumentasi acara, selebrasi & event",
    icon: Calendar,
  },
  {
    name: "SWARA WEDDING",
    href: "/swara-wedding",
    desc: "Foto pernikahan & momen romantis abadi",
    icon: Heart,
  },
];

// Sleek 2-Line Mobile Hamburger Menu Icon
const TwoLineIcon = () => (
  <div className="w-6 h-4 flex flex-col justify-between items-end cursor-pointer group">
    <span className="w-6 h-[2px] bg-[#C9A961] rounded-full transition-all group-hover:bg-white" />
    <span className="w-4 h-[2px] bg-white rounded-full transition-all group-hover:w-6 group-hover:bg-[#C9A961]" />
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const pathname = usePathname();

  // Hide Navbar when on /admin or /studio routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile full-screen menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isBrandPageActive = BRAND_SERVICES.some((s) => pathname === s.href);
  const waLink = generateWhatsAppLink();

  return (
    <>
      {/* MAIN SLENDER DESKTOP & MOBILE HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#121212]/92 backdrop-blur-md py-2 shadow-md border-b border-neutral-800/80"
            : "bg-[#121212]/85 backdrop-blur-md py-2.5 border-b border-neutral-800/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Container (Slim header height, large logo visual) */}
          <Link
            href="/"
            className="shrink-0 flex items-center transition-all duration-300 hover:opacity-85 active:scale-95"
          >
            <div className="relative h-10 sm:h-12 w-48 sm:w-56 shrink-0 flex items-center overflow-visible">
              <Image
                src="/logo.png"
                alt="Prabaswara Logo"
                fill
                sizes="224px"
                className="object-contain object-left scale-125 origin-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-x-8 text-xs uppercase tracking-[0.18em] font-medium text-neutral-300">
            {/* BERANDA */}
            <Link
              href="/"
              className={`transition-colors duration-200 relative py-1.5 hover:text-[#C9A961] ${
                pathname === "/" ? "text-white font-bold" : "text-neutral-300"
              }`}
            >
              BERANDA
              {pathname === "/" && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A961] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            {/* LAYANAN (Dropdown) */}
            <div
              className="relative py-1.5"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 transition-colors duration-200 hover:text-[#C9A961] uppercase text-xs tracking-[0.18em] font-medium ${
                  isBrandPageActive ? "text-white font-bold" : "text-neutral-300"
                }`}
              >
                <span>LAYANAN</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-[#C9A961]" : ""
                  }`}
                />
                {isBrandPageActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A961] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              {/* Desktop Dropdown Panel */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-72 bg-[#1A1A1A]/95 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-2 z-50"
                  >
                    <div className="space-y-1">
                      {BRAND_SERVICES.map((item) => {
                        const Icon = item.icon;
                        const isSelected = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                              isSelected
                                ? "bg-[#C9A961]/20 border border-[#C9A961]/40"
                                : "hover:bg-[#C9A961]/15 hover:border-[#C9A961]/30 border border-transparent"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-neutral-900 text-[#C9A961] shrink-0 mt-0.5 border border-neutral-800">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white tracking-wider flex items-center justify-between">
                                <span>{item.name}</span>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />}
                              </div>
                              <p className="text-[10px] text-neutral-400 font-sans-body leading-normal font-light normal-case tracking-normal mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* TENTANG KAMI */}
            <Link
              href="/tentang"
              className={`transition-colors duration-200 relative py-1.5 hover:text-[#C9A961] ${
                pathname === "/tentang" ? "text-white font-bold" : "text-neutral-300"
              }`}
            >
              TENTANG KAMI
              {pathname === "/tentang" && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A961] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            {/* TESTIMONI */}
            <Link
              href="/testimoni"
              className={`transition-colors duration-200 relative py-1.5 hover:text-[#C9A961] ${
                pathname === "/testimoni" ? "text-white font-bold" : "text-neutral-300"
              }`}
            >
              TESTIMONI
              {pathname === "/testimoni" && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A961] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* Desktop CTA WhatsApp Button in Gold */}
          <div className="hidden lg:block shrink-0">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#121212] bg-[#C9A961] rounded-full transition-all duration-300 hover:bg-[#B8964E] hover:text-white hover:scale-105 active:scale-95 shadow-md"
            >
              <span>HUBUNGI KAMI</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile 2-Line Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white focus:outline-none transition-transform active:scale-90"
            aria-label="Open full screen menu"
          >
            <TwoLineIcon />
          </button>
        </div>
      </header>

      {/* FULL SCREEN MOBILE OVERLAY MENU (MENUTUP SELURUH LAYAR HP) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#0F0F0F] text-white flex flex-col justify-between p-6 sm:p-8 min-h-screen overflow-y-auto"
          >
            {/* Top Bar inside Mobile Fullscreen Overlay */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="relative h-10 w-48 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Prabaswara Logo"
                    fill
                    sizes="192px"
                    className="object-contain object-left scale-125 origin-left"
                  />
                </div>
              </Link>

              {/* Close Button X Icon */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:text-[#C9A961] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Area: Full Screen Menu Navigation Links */}
            <div className="py-8 space-y-6 max-w-md mx-auto w-full">
              {/* BERANDA */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center justify-between text-xl sm:text-2xl font-serif-heading font-bold uppercase tracking-wider py-2 border-b border-neutral-800/80 hover:text-[#C9A961] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#C9A961]">01 /</span>
                  <span>BERANDA</span>
                </span>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A961]" />
              </Link>

              {/* LAYANAN Accordion */}
              <div className="border-b border-neutral-800/80 pb-3">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full text-xl sm:text-2xl font-serif-heading font-bold uppercase tracking-wider py-2 text-left hover:text-[#C9A961] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#C9A961]">02 /</span>
                    <span>LAYANAN SUB-BRAND</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C9A961] transition-transform duration-300 ${
                      mobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 gap-2.5 pt-3 pl-4"
                  >
                    {BRAND_SERVICES.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-[#C9A961]/50 transition-all"
                        >
                          <div className="p-2 rounded-lg bg-neutral-950 text-[#C9A961]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold tracking-wider block text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-light">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* TENTANG KAMI */}
              <Link
                href="/tentang"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center justify-between text-xl sm:text-2xl font-serif-heading font-bold uppercase tracking-wider py-2 border-b border-neutral-800/80 hover:text-[#C9A961] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#C9A961]">03 /</span>
                  <span>TENTANG KAMI</span>
                </span>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A961]" />
              </Link>

              {/* TESTIMONI */}
              <Link
                href="/testimoni"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center justify-between text-xl sm:text-2xl font-serif-heading font-bold uppercase tracking-wider py-2 border-b border-neutral-800/80 hover:text-[#C9A961] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#C9A961]">04 /</span>
                  <span>TESTIMONI</span>
                </span>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A961]" />
              </Link>
            </div>

            {/* Bottom Action inside Mobile Fullscreen Overlay */}
            <div className="pt-6 border-t border-neutral-800 space-y-4 max-w-md mx-auto w-full">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 text-xs font-bold uppercase tracking-widest text-[#121212] bg-[#C9A961] hover:bg-[#B8964E] rounded-full text-center transition-all shadow-lg active:scale-95"
              >
                <span>HUBUNGI VIA WHATSAPP</span>
                <ArrowUpRight className="w-4 h-4 text-[#121212]" />
              </a>

              <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest font-mono">
                Prabaswara Photography & Creative Studio © 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
