"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Award, Eye, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { SiteSettingsData } from "@/lib/mockData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
  settings?: SiteSettingsData;
}

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: customEase,
    },
  }),
};

export default function AboutSection({ settings }: AboutSectionProps) {
  const waLink = generateWhatsAppLink({ number: settings?.whatsappNumber });
  const aboutText =
    settings?.aboutText ||
    "Prabaswara adalah kolektif fotografi profesional yang didirikan dengan semangat mengabadikan keindahan visual, cerita emosional, dan momen berharga. Kami menaungi empat bidang keahlian spesifik: Swara Gallery untuk eksplorasi seni fotografi visual, Swara Studio untuk potret personal & komersial berstandar tinggi, Swara Moment untuk dokumentasi acara & selebrasi, serta Swara Wedding untuk merayakan momen terbaik dalam hidup pasangan suami istri.";

  const sectionRef = useRef<HTMLElement>(null);
  const secondImageRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger for Scroll-linked Image Shift
  useGSAP(
    () => {
      if (!secondImageRef.current || !sectionRef.current) return;

      gsap.to(secondImageRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  const values = [
    {
      icon: Eye,
      title: "Estetika Timeless",
      desc: "Komposisi dan pencahayaan yang dirancang agar tetap elegan di setiap masa.",
    },
    {
      icon: Award,
      title: "Kualitas Berstandar Tinggi",
      desc: "Penggunaan peralatan fotografi kelas profesional & olah digital presisi.",
    },
    {
      icon: Heart,
      title: "Emosi & Narasi Alami",
      desc: "Menangkap momen otentik dan cerita di balik setiap ekspresi klien.",
    },
    {
      icon: ShieldCheck,
      title: "Pelayanan Profesional",
      desc: "Komunikasi responsif, transparansi, dan ketepatan waktu penyerahan karya.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 bg-[#FAFAFA] text-neutral-950 border-t border-neutral-200/80"
    >
      {/* Subtle Section Divider Gradient */}
      <div className="absolute top-0 left-0 right-0 section-divider-gradient" />

      <div className="max-w-7xl mx-auto space-y-24">
        {/* Main Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Asymmetric Image Collage Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
            className="lg:col-span-6 grid grid-cols-12 gap-4 relative"
          >
            <div className="col-span-7 relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
                alt="Studio Prabaswara Camera"
                fill
                sizes="(max-width: 1024px) 50vw, 30vw"
                className="object-cover"
              />
            </div>
            <div
              ref={secondImageRef}
              className="col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md translate-y-8"
            >
              <Image
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
                alt="Fine Art Photography"
                fill
                sizes="(max-width: 1024px) 50vw, 30vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Text Side with Left Alignment & Gold Line Accent */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
            className="lg:col-span-6 space-y-7 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-[#C9A961]" />
                <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
                  Tentang Prabaswara
                </span>
              </div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
                Seni Visual & Dedikasi Abadi
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 font-sans-body font-light leading-relaxed">
              {aboutText}
            </p>

            <div className="pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white bg-[#C9A961] rounded-full transition-all duration-300 hover:bg-[#B8964E] hover:scale-105 active:scale-95 shadow-md"
              >
                <span>Konsultasi Proyek Anda</span>
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Core Values Grid with Gold Number Badges & Icon Accents */}
        <div className="pt-14 border-t border-neutral-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="group p-6 rounded-2xl bg-white border border-neutral-200/80 space-y-4 transition-all duration-300 hover:border-[#C9A961]/70 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 border border-[#C9A961]/30 flex items-center justify-center text-[#C9A961] transition-colors group-hover:bg-[#C9A961] group-hover:text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-[#C9A961]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-serif-heading text-lg font-semibold text-[#161616]">
                  {v.title}
                </h3>
                <p className="text-xs text-neutral-600 font-sans-body leading-relaxed font-light">
                  {v.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
