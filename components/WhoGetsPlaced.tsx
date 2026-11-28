"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { DM_Sans, Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });

const API_BASE_URL = "http://localhost:5000";

type Sector = { count: string; label: string; color: string };

type WhoGetsPlacedContent = {
  eyebrow: string;
  heading: string;
  movieLabel: string;
  logo: string;
  logoAlt: string;
  movieParagraphs: string[];
  sectorsEyebrow: string;
  companiesHeading: string;
  sectors: Sector[];
  callout: string;
};

/* Shown until the API responds, or if it is unavailable. */
const fallbackContent: WhoGetsPlacedContent = {
  eyebrow: "From film sets to agencies",
  heading: "Who gets placed - and where?",
  movieLabel: "Movie Industry",
  logo: "/companies/walls-and-trends.webp",
  logoAlt: "Walls & Trends",
  movieParagraphs: [
    "Posters and pre-production for **Netflix** and **Warner Bros.** projects.",
    "Trailer cuts and lyrical videos for **Baahubali, RRR** and top‑star films.",
  ],
  sectorsEyebrow: "And across every other sector",
  companiesHeading: "40+ companies",
  sectors: [
    { count: "15", label: "Media, creative and marketing", color: "#FE5517" },
    { count: "11", label: "AI and tech", color: "#346CDD" },
    { count: "6", label: "Consumer brands", color: "#987050" },
    { count: "4", label: "Real estate", color: "#3C3C47" },
    { count: "6", label: "Education and services", color: "#CAA021" },
  ],
  callout: "From Batch 1: a TAC student now works as Assistant Director.",
};

/* Renders **text** as bold; everything else as plain text. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

const ease = [0.22, 1, 0.36, 1] as const;

/* "Who gets placed - and where?" — movie-industry highlight, company
 * sectors and the Batch 1 callout. Sits after the Real Jobs section. */
export function WhoGetsPlaced() {
  const [content, setContent] =
    useState<WhoGetsPlacedContent>(fallbackContent);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/who-gets-placed`);
        if (!response.ok) throw new Error("Failed to load section");

        const result = await response.json();
        if (isMounted && result.success && result.data) {
          setContent({ ...fallbackContent, ...result.data });
        }
      } catch (error) {
        console.error("Failed to load Who Gets Placed section:", error);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    eyebrow,
    heading,
    movieLabel,
    logo,
    logoAlt,
    movieParagraphs,
    sectorsEyebrow,
    companiesHeading,
    sectors,
    callout,
  } = content;

  return (
    <section
      className={`${dmSans.className} bg-[#F5F2ED] px-[6%] py-16 text-[#111] md:py-24`}
    >
      <motion.p
        {...reveal}
        transition={{ duration: 0.5, ease }}
        className="text-[13px] font-bold uppercase tracking-[3px] text-[#E24E09] md:text-[clamp(15px,1.47vw,21.3px)]"
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        {...reveal}
        transition={{ duration: 0.6, delay: 0.08, ease }}
        className={`${oswald.className} mt-3 text-[38px] font-bold leading-[1.1] text-[#111] md:mt-5 md:text-[clamp(44px,3.68vw,53.4px)]`}
      >
        {heading}
      </motion.h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:mt-[clamp(16px,1.2vw,17.4px)] lg:grid-cols-[683fr_745fr] lg:gap-[clamp(16px,1.32vw,19.2px)]">
        {/* MOVIE INDUSTRY */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.6, delay: 0.12, ease }}
          className="rounded-2xl bg-[#14151A] p-6 text-white md:p-[clamp(24px,1.86vw,27px)]"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF5A1F] md:h-[clamp(48px,3.4vw,49.3px)] md:w-[clamp(48px,3.4vw,49.3px)]">
              <Play
                aria-hidden="true"
                strokeWidth={2}
                className="ml-0.5 h-5 w-5 text-[#14151A] md:h-[clamp(20px,1.4vw,20.3px)] md:w-[clamp(20px,1.4vw,20.3px)]"
              />
            </span>
            <p className="text-[16px] font-bold uppercase tracking-[3px] text-[#FA540A] md:text-[clamp(17px,1.2vw,17.4px)]">
              {movieLabel}
            </p>
          </div>

          {logo ? (
          <div className="mt-4 flex h-28 w-48 items-center justify-center rounded-[10px] bg-white px-5 py-3 md:h-[clamp(110px,7.8vw,113.2px)] md:w-[clamp(190px,13.6vw,197.3px)]">
            <div className="relative h-full w-full">
              <Image
                src={logo}
                alt={logoAlt}
                fill
                sizes="262px"
                unoptimized={!logo.startsWith("/")}
                className="object-contain"
              />
            </div>
          </div>
          ) : null}

          <div className="mt-5 space-y-3.5 text-[17px] leading-[1.5] text-white md:text-[clamp(18px,1.48vw,21.5px)]">
            {movieParagraphs.map((paragraph, i) => (
              <p key={i}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </motion.div>

        {/* EVERY OTHER SECTOR */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="rounded-2xl border border-[#ECEAE6] bg-white p-6 md:p-[clamp(24px,1.86vw,27px)]"
        >
          <p className="text-[14px] font-bold uppercase tracking-[3px] text-[#E13D00] md:text-[clamp(15px,1.2vw,17.4px)]">
            {sectorsEyebrow}
          </p>

          <p
            className={`${oswald.className} mt-3 text-[44px] font-bold leading-none whitespace-nowrap min-[400px]:text-[48px] text-[#111] md:mt-[clamp(12px,1.2vw,17.4px)] md:text-[clamp(56px,4.5vw,65.3px)]`}
          >
            {companiesHeading}
          </p>

          <ul className="mt-5 space-y-3 md:mt-[clamp(16px,1.2vw,17.4px)] md:space-y-[clamp(10px,0.8vw,11.6px)]">
            {sectors.map(({ count, label, color }, i) => (
              <li
                key={`${label}-${i}`}
                className="flex items-start gap-4 text-[17px] font-bold leading-tight text-[#111] md:text-[clamp(18px,1.49vw,21.6px)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.18em] h-4 w-4 shrink-0 rounded-full md:mt-[0.2em] md:h-[clamp(14px,1vw,14.5px)] md:w-[clamp(14px,1vw,14.5px)]"
                  style={{ backgroundColor: color }}
                />
                <span>
                  {count} · {label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* BATCH 1 CALLOUT */}
      {callout ? (
      <motion.div
        {...reveal}
        transition={{ duration: 0.6, delay: 0.28, ease }}
        className="mt-1 flex items-center gap-4 md:gap-[clamp(16px,1.3vw,18.9px)] rounded-[10px] bg-[#F4DFC0] px-6 py-4 md:px-[clamp(24px,1.86vw,27px)] md:py-[clamp(16px,1.3vw,18.9px)]"
      >
        <Star
          aria-hidden="true"
          strokeWidth={1.8}
          className="h-6 w-6 shrink-0 text-[#B88A32] md:h-[clamp(24px,1.6vw,24px)] md:w-[clamp(24px,1.6vw,24px)]"
        />
        <p className="text-[16px] font-bold leading-snug text-[#171717] md:text-[clamp(18px,1.57vw,22.8px)]">
          <RichText text={callout} />
        </p>
      </motion.div>
      ) : null}
    </section>
  );
}

export default WhoGetsPlaced;
