"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Industry = {
  _id?: string;
  id: string;
  title: string;
  image: string;
  order: number;
};

const fallbackIndustries: Industry[] = [
  {
    id: "01",
    title: "Food & Beverage",
    image: "/industries/01.webp",
    order: 1,
  },
  {
    id: "02",
    title: "Fashion & Beauty",
    image: "/industries/02.webp",
    order: 2,
  },
  {
    id: "03",
    title: "Apparel & Lifestyle",
    image: "/industries/03.webp",
    order: 3,
  },
  {
    id: "04",
    title: "Construction & Real Estate",
    image: "/industries/04.webp",
    order: 4,
  },
  {
    id: "05",
    title: "Education & Training",
    image: "/industries/05.webp",
    order: 5,
  },
  {
    id: "06",
    title: "Entertainment & Media",
    image: "/industries/06.webp",
    order: 6,
  },
  {
    id: "07",
    title: "Health & Wellness",
    image: "/industries/07.webp",
    order: 7,
  },
  {
    id: "08",
    title: "Automobiles & Transport",
    image: "/industries/08.webp",
    order: 8,
  },
  {
    id: "09",
    title: "Jewellery & Boutiques",
    image: "/industries/09.webp",
    order: 9,
  },
  {
    id: "10",
    title: "Miscellaneous & Emerging",
    image: "/industries/10.webp",
    order: 10,
  },
];

export function IndustriesSection() {
  const [industries, setIndustries] =
    useState<Industry[]>(fallbackIndustries);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/industries"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch industries");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const sortedIndustries = [...result.data].sort(
            (a: Industry, b: Industry) => a.order - b.order
          );

          setIndustries(sortedIndustries);
        }
      } catch (error) {
        console.error(
          "Failed to fetch industries. Using fallback data.",
          error
        );

        setIndustries(fallbackIndustries);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <section className="bg-[#1A1A1A] text-[#f7f1e4] px-[6%] py-28">
      {/* TOP */}
      <div className="grid md:grid-cols-2 gap-10 items-start mb-16 md:mb-30">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-left md:text-right md:order-2"
        >
          <h2
            className="uppercase font-bebas text-[48px] sm:text-[62px] md:text-[76px] leading-[44px] sm:leading-[58px] md:leading-[72.2px]"
            style={{
              fontWeight: 700,
              letterSpacing: "0.5px",
              fontFamily: "'Bebas Neue', sans-serif",
              color: "#f7f1e4",
            }}
          >
            10 INDUSTRIES.
            <br />
            ONE STUDENT.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center md:order-1"
        >
          <p className="text-[#f7f1e4]/90 text-lg md:text-xl max-w-sm leading-relaxed">
            One project per industry. No repeats. That portfolio is what
            gets you the job or the client.
          </p>
        </motion.div>
      </div>

      {/* BADGE */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.55,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-10 flex flex-wrap"
      >
        <span className="border border-[#FFC62A]/40 text-[#FFC62A] px-3 py-2 md:px-4 md:py-2 text-[9px] sm:text-xs tracking-[2px] md:tracking-[3px] uppercase inline-block">
          ★ FIRST IN INDIA – 10-INDUSTRY PORTFOLIO CERTIFICATION
        </span>
      </motion.div>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {industries.map((item, i) => (
          <motion.div
            key={item._id ?? item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="overflow-hidden rounded-xl bg-[#111] flex items-center justify-center"
          >
            <img
              src={item.image}
              alt={item.title}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}