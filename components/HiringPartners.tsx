"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { DM_Sans, Oswald } from "next/font/google";
import {
  hiringPartnerSections,
  partnerCategories,
  type HiringPartnerSection,
  type PartnerCategory,
} from "@/data/hiringPartners";

const oswald = Oswald({ subsets: ["latin"], weight: ["700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "700"] });

const ease = [0.22, 1, 0.36, 1] as const;

const categoryOrder = Object.keys(partnerCategories) as PartnerCategory[];

/* Sizes scale with the screen and stop at the reference design's values. */
function PartnersGrid({
  section,
  isLast,
}: {
  section: HiringPartnerSection;
  isLast: boolean;
}) {
  const present = categoryOrder.filter((category) =>
    section.partners.some((partner) => partner.category === category)
  );

  return (
    <section
      className={`${dmSans.className} bg-[#F5F2ED] px-[6%] text-[#121116] ${
        isLast ? "pb-16 md:pb-24" : "pb-14 md:pb-[clamp(56px,5vw,72px)]"
      }`}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease }}
        className="text-center text-[11px] uppercase leading-relaxed tracking-[3px] text-[#B88A32] sm:text-xs md:tracking-[6px]"
      >
        {section.eyebrow}
      </motion.p>

      {section.heading ? (
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, delay: 0.06, ease }}
        className={`${oswald.className} mt-2 text-[30px] font-bold leading-[1.15] md:mt-[clamp(8px,0.7vw,10px)] md:text-[clamp(32px,2.76vw,40px)]`}
      >
        {section.heading}
      </motion.h2>
      ) : null}

      <ul className={`${section.heading ? "mt-4 md:mt-[clamp(10px,0.83vw,12px)]" : "mt-8 md:mt-12"} grid auto-rows-fr grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-[clamp(8px,0.83vw,12px)] lg:grid-cols-7`}>
        {section.partners.map((partner, i) => (
          <motion.li
            key={partner.logo}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: (i % 7) * 0.04, ease }}
            className="flex flex-col overflow-hidden rounded-lg border border-[#E4E1D8] bg-white"
          >
            <span
              aria-hidden="true"
              className="h-1.5 shrink-0"
              style={{ backgroundColor: partnerCategories[partner.category].color }}
            />

            <div className="flex flex-1 flex-col items-center px-2 pt-2.5 pb-3 text-center md:px-[clamp(8px,0.83vw,12px)] md:pt-[clamp(8px,0.69vw,10px)] md:pb-[clamp(8px,0.69vw,10px)]">
              <div className="relative h-12 w-full sm:h-14 md:h-[clamp(56px,5.1vw,74px)]">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 22vw, 30vw"
                  className="object-contain"
                />
              </div>

              <p className="mt-2 text-[12px] font-bold leading-[1.24] sm:text-[13px] md:mt-[clamp(8px,0.7vw,10px)] md:text-[clamp(13px,1.17vw,17px)]">
                {partner.name}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      {section.showLegend ? (
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#49484D] md:mt-[clamp(32px,4.8vw,70px)] md:text-[clamp(14px,1.17vw,17px)]">
        {present.map((category) => (
          <li key={category} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: partnerCategories[category].color }}
            />
            {partnerCategories[category].label}
          </li>
        ))}
      </ul>
      ) : null}
    </section>
  );
}

/* "Our Hiring Partners" — one continuous grid of partner logos. */
export function HiringPartners() {
  return (
    <>
      {hiringPartnerSections.map((section, i) => (
        <PartnersGrid
          key={section.eyebrow}
          section={section}
          isLast={i === hiringPartnerSections.length - 1}
        />
      ))}
    </>
  );
}

export default HiringPartners;
