"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Partner = {
  name: string;
};

type PartnersData = {
  heading: string;
  partners: Partner[];
};

const fallbackPartners: PartnersData = {
  heading: "Associated Studios, Agencies & Hiring Partners",
  partners: [
    { name: "BRANDLABS" },
    { name: "CREATIVE CO." },
    { name: "STUDIO 91" },
    { name: "ADGENCE HYD" },
    { name: "SOCIAL PULSE" },
    { name: "REELCRAFT" },
    { name: "VIJAYIISAM" },
    { name: "PIXEL WORKS" },
    { name: "THINKMEDIA" },
    { name: "REDANTZ" },
    { name: "TAMMADA MEDIA" },
    { name: "PROPERTY EDGE" },
    { name: "ALOK MEDIA" },
    { name: "CITTA AI" },
    { name: "INFINITUM" },
    { name: "HYD TALKIES" },
    { name: "WE MEDIA" },
    { name: "STUDENT TRIBE" },
    { name: "RECORD INNOVATION" },
    { name: "DOLLY STUDIOS" },
  ],
};

export const PartnersSection = () => {
  const [active, setActive] = useState(0);
  const [partnersData, setPartnersData] =
    useState<PartnersData>(fallbackPartners);

  // Load Partners data from CMS
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/partners"
        );

        if (!response.ok) {
          throw new Error("Failed to load partners");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setPartnersData(result.data);
        }
      } catch (error) {
        console.error("Failed to load partners:", error);
      }
    };

    loadPartners();
  }, []);

  // 🔁 Moving glow
  useEffect(() => {
    if (partnersData.partners.length === 0) return;

    const interval = setInterval(() => {
      setActive(
        (prev) => (prev + 1) % partnersData.partners.length
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [partnersData.partners.length]);

  return (
    <section className="bg-[#0D0D0D] py-20 text-center">
      {/* TITLE */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-12 text-xs uppercase tracking-[6px] text-[#C9A227]/70"
      >
        {partnersData.heading}
      </motion.p>

      {/* BOXES */}
      <div className="flex flex-wrap justify-center gap-6 px-[5%]">
        {partnersData.partners.map((item, i) => (
          <motion.div
            key={item.name}
            whileHover={{
              y: -4,
              scale: 1.02,
              borderColor: "rgba(244, 208, 63, 0.55)",
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`relative overflow-hidden rounded-[12px] border px-8 py-4 text-sm uppercase tracking-[3px] transition-all duration-500 ${
              active === i
                ? "scale-105 border-[#F4D03F] text-black"
                : "border-white/10 bg-[#111] text-white/60"
            }`}
          >
            {/* 🔥 GLOW BACKGROUND */}
            {active === i && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4D03F] via-[#FFD700] to-[#F4D03F] opacity-90 blur-[6px]" />
            )}

            {/* CONTENT */}
            <span className="relative z-10 font-medium">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};