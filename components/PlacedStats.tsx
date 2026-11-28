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
      <div className="relative grid grid-cols-1 divide-y divide-[#1A1A1A]/10 overflow-hidden rounded-[20px] border border-[#1A1A1A]/12 bg-[#F3EDD7] shadow-[0_10px_30px_rgba(26,26,26,0.07)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {placedStats.map(({ value, label, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 px-6 py-5 sm:justify-center sm:px-4 sm:py-7 lg:px-6 min-[640px]:gap-3 min-[1024px]:gap-4 min-[1280px]:gap-3 min-[1440px]:gap-[18px] min-[1440px]:py-8"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFC62A] text-[#1A1A1A] min-[640px]:h-12 min-[640px]:w-12 min-[1024px]:h-14 min-[1024px]:w-14 min-[1280px]:h-13 min-[1280px]:w-13 min-[1440px]:h-16 min-[1440px]:w-16 min-[1440px]:rounded-2xl">
              <Icon
                strokeWidth={2.2}
                aria-hidden="true"
                className="h-6.5 w-6.5 min-[640px]:h-5.5 min-[640px]:w-5.5 min-[1024px]:h-6.5 min-[1024px]:w-6.5 min-[1280px]:h-6 min-[1280px]:w-6 min-[1440px]:h-7.5 min-[1440px]:w-7.5"
              />
            </div>

            <div className="min-w-0">
              <p className="whitespace-nowrap text-[34px] font-black leading-none text-[#C41E3A] min-[640px]:text-[28px] min-[1024px]:text-[38px] min-[1280px]:text-[34px] min-[1440px]:text-[42px]">
                {isWholeNumber(value) ? <AnimatedCounter value={value} /> : value}
              </p>

              <p className="mt-1.5 text-[15px] min-[1024px]:whitespace-nowrap font-medium leading-snug text-[#1A1A1A]/65 min-[640px]:text-[13px] min-[1024px]:text-[15px] min-[1280px]:text-[14px] min-[1440px]:mt-2 min-[1440px]:text-[16px]">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
