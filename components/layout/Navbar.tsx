"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronDown, Camera, Image as ImageIcon, Calendar, Heart } from "lucide-react";
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
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

  const isBrandPageActive = BRAND_SERVICES.some((s) => pathname === s.href);
  const waLink = generateWhatsAppLink();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#121212]/92 backdrop-blur-md py-3 shadow-md border-b border-neutral-800/80"
          : "bg-[#121212]/85 backdrop-blur-md py-4 border-b border-neutral-800/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Transparent Original Logo (No CSS filters, No background container) */}
        <Link
          href="/"
          className="shrink-0 flex items-center transition-all duration-300 hover:opacity-85 active:scale-95"
        >
          <div className="relative h-16 w-60 sm:h-20 sm:w-72 shrink-0">
            <Image
              src="/logo.png"
              alt="Prabaswara Logo"
              fill
              sizes="288px"
              className="object-contain object-left scale-110 origin-left"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white focus:outline-none transition-transform duration-200 active:scale-90"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-[#121212]/95 backdrop-blur-2xl border-b border-neutral-800 shadow-2xl text-neutral-300"
          >
            <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col space-y-4 text-xs uppercase tracking-wider font-medium">
              {/* BERANDA */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors duration-200 border-b border-neutral-800 ${
                  pathname === "/"
                    ? "text-white font-bold pl-2 border-l-2 border-[#C9A961]"
                    : "text-neutral-300 hover:text-[#C9A961]"
                }`}
              >
                BERANDA
              </Link>

              {/* LAYANAN Accordion */}
              <div className="border-b border-neutral-800 pb-2">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full py-2 text-left text-neutral-300 hover:text-[#C9A961] uppercase text-xs tracking-wider font-medium"
                >
                  <span className={isBrandPageActive ? "text-white font-bold" : ""}>
                    LAYANAN
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileServicesOpen ? "rotate-180 text-[#C9A961]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 space-y-2 pt-2 pb-1 overflow-hidden"
                    >
                      {BRAND_SERVICES.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileServicesOpen(false);
                          }}
                          className={`block py-1.5 text-xs uppercase tracking-wider transition-colors ${
                            pathname === item.href
                              ? "text-white font-semibold"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TENTANG KAMI */}
              <Link
                href="/tentang"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors duration-200 border-b border-neutral-800 ${
                  pathname === "/tentang"
                    ? "text-white font-bold pl-2 border-l-2 border-[#C9A961]"
                    : "text-neutral-300 hover:text-[#C9A961]"
                }`}
              >
                TENTANG KAMI
              </Link>

              {/* TESTIMONI */}
              <Link
                href="/testimoni"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors duration-200 border-b border-neutral-100 ${
                  pathname === "/testimoni"
                    ? "text-white font-bold pl-2 border-l-2 border-[#C9A961]"
                    : "text-neutral-300 hover:text-[#C9A961]"
                }`}
              >
                TESTIMONI
              </Link>

              {/* Mobile CTA */}
              <div className="pt-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#121212] bg-[#C9A961] rounded-full text-center transition-transform duration-200 active:scale-95 shadow-md"
                >
                  <span>HUBUNGI VIA WHATSAPP</span>
                  <ArrowUpRight className="w-4 h-4 text-[#121212]" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
