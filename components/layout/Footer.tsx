"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { SiteSettingsData } from "@/lib/mockData";

interface FooterProps {
  settings?: SiteSettingsData;
}

export default function Footer({ settings }: FooterProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  const waNumber = settings?.whatsappNumber || "6281234567890";
  const address =
    settings?.address || "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan";
  const email = settings?.email || "hello@prabaswara.com";

  return (
    <footer className="bg-[#121212] text-neutral-400 border-t border-neutral-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block transition-opacity duration-300 hover:opacity-85">
              <div className="relative h-16 w-56 sm:h-18 sm:w-64">
                <Image
                  src="/logo.png"
                  alt="Prabaswara Logo"
                  fill
                  sizes="256px"
                  className="object-contain object-left scale-110 origin-left"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 max-w-md font-sans-body font-light">
              Menaungi empat bidang keahlian fotografi profesional: seni karya visual, foto studio, dokumentasi momen berharga, dan momen pernikahan abadi.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              {/* Custom SVG Instagram */}
              <a
                href={settings?.instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-400 hover:text-[#C9A961] hover:border-[#C9A961] hover:bg-neutral-800 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Custom SVG YouTube */}
              <a
                href={settings?.youtubeUrl || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-400 hover:text-[#C9A961] hover:border-[#C9A961] hover:bg-neutral-800 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Sub-Brands Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white font-serif-heading flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
              Sub-Brands
            </h4>
            <ul className="space-y-3 text-sm font-sans-body">
              <li>
                <Link
                  href="/swara-gallery"
                  className="hover:text-[#C9A961] transition-colors duration-200"
                >
                  Swara Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/swara-studio"
                  className="hover:text-[#C9A961] transition-colors duration-200"
                >
                  Swara Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/swara-moment"
                  className="hover:text-[#C9A961] transition-colors duration-200"
                >
                  Swara Moment
                </Link>
              </li>
              <li>
                <Link
                  href="/swara-wedding"
                  className="hover:text-[#C9A961] transition-colors duration-200"
                >
                  Swara Wedding
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white font-serif-heading flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
              Kontak Studio
            </h4>
            <ul className="space-y-4 text-sm font-sans-body">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A961] mt-1 shrink-0" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9A961] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[#C9A961] transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={generateWhatsAppLink({ number: waNumber })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-neutral-950 bg-white rounded-full transition-all duration-300 hover:bg-[#C9A961] hover:text-white hover:scale-105 active:scale-95 shadow-xs"
                >
                  <span>Chat WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C9A961] group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Prabaswara. Hak Cipta Dilindungi.</p>
          <div className="flex items-center space-x-6">
            <Link href="/tentang" className="hover:text-[#C9A961] transition-colors">
              Tentang Kami
            </Link>
            <Link href="/testimoni" className="hover:text-[#C9A961] transition-colors">
              Testimoni
            </Link>
            <Link
              href="/admin"
              className="text-neutral-500 hover:text-[#C9A961] transition-colors underline"
              title="Kelola Konten & WA via Admin Panel"
            >
              Admin Panel Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
