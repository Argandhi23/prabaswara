"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface FloatingWhatsAppProps {
  number?: string;
}

export default function FloatingWhatsApp({ number }: FloatingWhatsAppProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  // Determine current brand slug from route if on a sub-brand page
  const brandSlug = pathname?.replace("/", "") || "";

  const waLink = generateWhatsAppLink({
    number,
    brandSlug,
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 px-4 py-3 bg-white/90 text-neutral-950 border border-neutral-300 rounded-full shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-neutral-500 hover:shadow-2xl active:scale-95"
        aria-label="Konsultasi via WhatsApp"
      >
        {/* Pulsing indicator dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
        </span>

        {/* WhatsApp Icon */}
        <MessageCircle className="w-5 h-5 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />

        {/* Text Label */}
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 group-hover:text-neutral-950 transition-colors pr-1">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
