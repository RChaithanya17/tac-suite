"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type GovernmentCertificate = {
  _id?: string;
  src: string;
  label: string;
  sub: string;
  order: number;
};

const fallbackCertificates: GovernmentCertificate[] = [
  {
    src: "/dpiit.png",
    label: "MSME Registered",
    sub: "Ministry of MSME, Govt. of India",
    order: 1,
  },
  {
    src: "/001.png",
    label: "TAC Certified",
    sub: "Job & Freelance Ready",
    order: 2,
  },
  {
    src: "/msme.png",
    label: "DPIIT Recognised",
    sub: "Startup India, Govt. of India",
    order: 3,
  },
];

export function GovCertSection() {
  const [certificates, setCertificates] = useState<
    GovernmentCertificate[]
  >(fallbackCertificates);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/gov-certificates",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch government certificates"
          );
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setCertificates(result.data);
        }
      } catch (error) {
        console.error(
          "Failed to load government certificates:",
          error
        );
      }
    };

    fetchCertificates();
  }, []);

  return (
    <section className="bg-[#F7F4E8] px-[6%] py-16">
      <div className="text-center">
        <p className="mb-2 text-[11px] uppercase tracking-[4px] text-[#C9A227]">
          Officially Recognised
        </p>

        <h2 className="mb-10 text-2xl font-bold text-[#111]">
          Government Certified Institution
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-0">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert._id ?? `${cert.src}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: i * 0.1,
              }}
              className="flex flex-col items-center justify-center"
            >
              <Image
                src={cert.src}
                alt={cert.label}
                width={160}
                height={80}
                className="mx-auto h-20 w-auto max-w-40 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}