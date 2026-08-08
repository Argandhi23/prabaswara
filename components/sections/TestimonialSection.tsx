"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialData } from "@/lib/mockData";

interface TestimonialSectionProps {
  testimonials: TestimonialData[];
  title?: string;
  subtitle?: string;
}

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
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

export default function TestimonialSection({
  testimonials,
  title = "Kata Klien Kami",
  subtitle = "Ulasan dan kebahagiaan dari para klien yang telah mengabadikan momen mereka bersama Prabaswara",
}: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-[#FAFAFA] text-neutral-950 border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-[2px] bg-[#C9A961]" />
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-neutral-500">
              Kepercayaan & Ulasan
            </span>
            <div className="w-6 h-[2px] bg-[#C9A961]" />
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-neutral-950 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-neutral-600 font-sans-body font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item._id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="relative p-8 md:p-10 rounded-3xl bg-white border border-neutral-200/80 flex flex-col justify-between space-y-6 shadow-xs transition-all duration-300 hover:border-[#C9A961]/70 hover:shadow-xl"
            >
              {/* Decorative Gold Watermark Quote */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#C9A961]/15 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Gold Stars */}
                <div className="flex items-center space-x-1 text-[#C9A961]">
                  {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current text-[#C9A961]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-[#161616] font-sans-body italic leading-relaxed font-light">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Client Profile */}
              <div className="flex items-center space-x-4 pt-4 border-t border-neutral-100 relative z-10">
                {item.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C9A961]/40 shrink-0 shadow-xs">
                    <Image
                      src={item.avatarUrl}
                      alt={item.clientName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#C9A961]/10 border border-[#C9A961]/30 flex items-center justify-center text-[#C9A961] font-serif-heading font-bold text-lg shrink-0">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-serif-heading font-semibold text-[#161616] text-sm">
                    {item.clientName}
                  </h4>
                  {item.roleOrEvent && (
                    <p className="text-xs text-neutral-500 font-sans-body font-light">
                      {item.roleOrEvent}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
