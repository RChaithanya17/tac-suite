"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";
import { placementStats as fallbackPlacementStats } from "@/data/placements";
import { AnimatedCounter } from "@/components/AnimatedCounter";

type PlacementStat = {
  _id?: string;
  value: string;
  label: string;
  highlight?: boolean;
};

type PlacementSectionContent = {
  _id?: string;
  eyebrow: string;
  heading: string;
  description: string;
};

const API_BASE_URL = "http://localhost:5000";

// Font
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const fallbackPlacementSection: PlacementSectionContent = {
  eyebrow: "★ FIRST REAL PLACEMENT CERTIFICATE",
  heading: "REAL JOBS.\nREAL MONEY.",
  description:
    "Numbers from Cohort 1 and 2. Both cohorts placed successfully within 60 days of completion.",
};

export function PlacementSection() {
  const [placementStats, setPlacementStats] = useState<PlacementStat[]>(
    fallbackPlacementStats
  );

  const [sectionContent, setSectionContent] =
    useState<PlacementSectionContent>(
      fallbackPlacementSection
    );

  useEffect(() => {
    let isMounted = true;

    const loadPlacementStats = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/placements/stats`
        );

        if (!response.ok) {
          throw new Error("Failed to load placement stats");
        }

        const result = await response.json();

        if (!isMounted) {
          return;
        }

        setPlacementStats(result.data ?? fallbackPlacementStats);
      } catch (error) {
        console.error("Failed to load placement stats:", error);
      }
    };

    const loadPlacementSection = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/placement-section`
        );

        if (!response.ok) {
          throw new Error("Failed to load placement section");
        }

        const result = await response.json();

        if (!isMounted) {
          return;
        }

        if (result.success && result.data) {
          setSectionContent(result.data);
        }
      } catch (error) {
        console.error(
          "Failed to load placement section:",
          error
        );
      }
    };

    loadPlacementStats();
    loadPlacementSection();

    return () => {
      isMounted = false;
    };
  }, []);

  const headingLines = sectionContent.heading.split("\n");

  return (
    <section className="bg-[#FBF8E4] px-[6%] py-12 text-black">
      {/* TOP SECTION */}
      <div className="mb-8 grid gap-10 md:grid-cols-2">
        {/* LEFT SMALL TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-start"
        >
          <p className="text-xs uppercase tracking-[4px] text-[#C9A227]">
            {sectionContent.eyebrow}
          </p>
        </motion.div>

        {/* RIGHT TITLE */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-left md:text-right"
        >
          <h2
            className={`${bebas.className} text-[52px] uppercase leading-[48px] tracking-[0.5px] text-[#111] sm:text-[64px] sm:leading-[60px] md:text-[76px] md:leading-[72px]`}
          >
            {headingLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="ml-0 mt-3 max-w-md text-sm text-black/50 md:ml-auto"
          >
            {sectionContent.description}
          </motion.p>
        </motion.div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-[24px] bg-black/10 sm:grid-cols-2 md:grid-cols-3">
        {placementStats.map((item, i) => (
          <motion.div
            key={item._id ?? `${item.label}-${i}`}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              delay: i * 0.07,
            }}
            className={`p-10 text-center transition duration-300 ${
              item.highlight
                ? "bg-[#F4D03F]"
                : "bg-[#FFFDF5]"
            }`}
          >
            {/* VALUE */}
            <h3 className="mb-2 text-5xl font-extrabold tracking-tight">
              <AnimatedCounter value={item.value} />
            </h3>

            {/* LABEL */}
            <p className="text-xs font-semibold tracking-[3px] text-black/60">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default PlacementSection;