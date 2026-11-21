"use client";

import { motion } from "framer-motion";
import { Building2, IndianRupee, Users, type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

type PlacedStat = {
  value: string;
  label: string;
  Icon: LucideIcon;
};

/* Headline placement numbers shown alongside "PLACED & THRIVING". */
const placedStats: PlacedStat[] = [
  { value: "100+", label: "TAC Creators Placed", Icon: Users },
  { value: "80+", label: "Companies Hiring", Icon: Building2 },
  { value: "₹7 LPA", label: "Highest Package", Icon: IndianRupee },
];

/* AnimatedCounter strips non-digits, so only count up plain whole numbers
 * like "100+"; values such as "₹7 LPA" render as-is. */
const isWholeNumber = (value: string) => /^\d+\D*$/.test(value);

export function PlacedStats({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.6,
        delay: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative ${className}`}
    >
      {/* Golden accent slab offset behind the strip. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[20px] bg-[#FFC62A]"
      />

      <div className="relative grid grid-cols-1 divide-y divide-[#1A1A1A]/10 overflow-hidden rounded-[20px] border border-[#1A1A1A]/10 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {placedStats.map(({ value, label, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 px-6 py-5 sm:justify-center sm:gap-3 sm:px-4 sm:py-7 lg:gap-4 lg:px-6"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3C4] text-[#B8860B] lg:h-12 lg:w-12">
              <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="whitespace-nowrap text-[26px] font-black leading-none text-[#111] lg:text-[30px]">
                {isWholeNumber(value) ? <AnimatedCounter value={value} /> : value}
              </p>

              <p className="mt-1.5 text-[13px] font-medium leading-snug text-[#1A1A1A]/60">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
