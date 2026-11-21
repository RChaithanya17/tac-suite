"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Partner = {
  name: string;
  logo?: string;
};

type PartnersData = {
  heading: string;
  partners: Partner[];
};

const fallbackPartners: PartnersData = {
  heading: "Associated Studios, Agencies & Hiring Partners",
  partners: [
    { name: "Yaas", logo: "/partners/yaas.webp" },
    { name: "Wilson", logo: "/partners/wilson.webp" },
    { name: "Zyro Lifts", logo: "/partners/zyro-lifts.webp" },
    { name: "RK Media", logo: "/partners/rk-media.webp" },
    { name: "Camvya Photography", logo: "/partners/camvya-photography.webp" },
    { name: "Sri Sreenivasa Infra", logo: "/partners/sri-sreenivasa-infra.webp" },
    { name: "Starbuzz.ai", logo: "/partners/starbuzz-ai.webp" },
    { name: "Student Tribe", logo: "/partners/student-tribe.webp" },
    { name: "Ozrit", logo: "/partners/ozrit.webp" },
    { name: "LUK Studio", logo: "/partners/luk-studio.webp" },
    { name: "Keus", logo: "/partners/keus.webp" },
    { name: "K", logo: "/partners/k.webp" },
    { name: "Hyderabad Talkies", logo: "/partners/hyderabad-talkies.webp" },
    { name: "Honasa", logo: "/partners/honasa.webp" },
    { name: "Hala Rentals", logo: "/partners/hala-rentals.webp" },
    { name: "Ekam", logo: "/partners/ekam.webp" },
    { name: "Yuvi Creations Digital Marketing", logo: "/partners/yuvi-creations-digital-marketing.webp" },
    { name: "Dakshin Stories", logo: "/partners/dakshin-stories.webp" },
    { name: "Conduira", logo: "/partners/conduira.webp" },
    { name: "OneGrasp", logo: "/partners/onegrasp.webp" },
    { name: "B", logo: "/partners/b.webp" },
    { name: "Obladi Creatives", logo: "/partners/obladi-creatives.webp" },
    { name: "C", logo: "/partners/c.webp" },
    { name: "Digicarotene", logo: "/partners/digicarotene.webp" },
    { name: "Citta AI", logo: "/partners/citta-ai.webp" },
    { name: "Nikhila Constructions and Developers", logo: "/partners/ncd.webp" },
    { name: "CGS – Computer Generated Solutions", logo: "/partners/cgs.webp" },
    { name: "Vayura Solutions", logo: "/partners/vayura-solutions.webp" },
    { name: "Medigita Technologies", logo: "/partners/medigita-technologies.webp" },
    { name: "Theory Consulting", logo: "/partners/theory-consulting.webp" },
    { name: "The Big Day by Chai", logo: "/partners/the-big-day-by-chai.webp" },
    { name: "B-Hub Media", logo: "/partners/b-hub-media.webp" },
    { name: "Aloka Creative Media Solution", logo: "/partners/aloka.webp" },
    { name: "Reginald Men", logo: "/partners/reginald-men.webp" },
    { name: "Red Antz Studios", logo: "/partners/red-antz-studios.webp" },
    { name: "Raré Café", logo: "/partners/rare-cafe.webp" },
    { name: "Property Edge", logo: "/partners/property-edge.webp" },
    { name: "Brochill", logo: "/partners/brochill.webp" },
    { name: "Bristle Tech", logo: "/partners/bristle-tech.webp" },
  ],
};

export const PartnersSection = () => {
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

  // Only partners with an actual logo are shown — names are never used as stand-ins.
  const logoPartners = partnersData.partners.filter((partner) => partner.logo);

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

      {/* LOGO GRID — fixed column counts per breakpoint; the last row centres itself. */}
      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto flex max-w-350 flex-wrap justify-center gap-3 px-[5%] sm:gap-4 lg:gap-5"
      >
        {logoPartners.map((partner) => (
          <li
            key={partner.logo}
            className="w-[calc((100%-12px)/2-1px)] sm:w-[calc((100%-32px)/3-1px)] md:w-[calc((100%-48px)/4-1px)] lg:w-[calc((100%-80px)/5-1px)] xl:w-[calc((100%-100px)/6-1px)]"
          >
            <div className="overflow-hidden rounded-xl bg-[#F7F7F7] ring-1 ring-white/10 transition duration-300 ease-out hover:-translate-y-1 hover:ring-2 hover:ring-[#FFC62A]/80">
              <Image
                src={partner.logo as string}
                alt={`${partner.name} logo`}
                title={partner.name}
                width={400}
                height={160}
                // Logos are already small, pre-sized WebP files; serving them
                // directly avoids the optimizer stalling on some of them.
                unoptimized
                className="block h-auto w-full"
              />
            </div>
          </li>
        ))}
      </motion.ul>
    </section>
  );
};
