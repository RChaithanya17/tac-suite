"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CertificateFeature = {
  title: string;
  desc: string;
};

type CertificateData = {
  heading: string;
  description: string;

  issuerName: string;
  certificateSubtitle: string;
  certificateDescription: string;

  issuedBy: string;
  recognition: string;
  status: string;

  certificateImage: string;

  badgeText: string;

  features: CertificateFeature[];

  packageText: string;
  packageDescription: string;
};

const fallbackCertificate: CertificateData = {
  heading: "JOB & FREELANCE READY CERTIFICATE",

  description:
    "India's first certificate that proves you can shoot, design, and market — across all industries, verified.",

  issuerName: "THE ART CODE — TAC",

  certificateSubtitle:
    "Certificate of Job & Freelance Readiness",

  certificateDescription:
    "This certifies that the holder has successfully completed the TAC Suite program, demonstrating mastery across creative disciplines and building a verified industry portfolio.",

  issuedBy: "THE ART CODE",

  recognition: "NSDC / Skill India",

  status: "DPIIT Recognised",

  certificateImage: "/certificate.webp",

  badgeText:
    "★ India's First 10-Industry Portfolio Certificate",

  features: [
    {
      title:
        "Real Work. Real Portfolio. Not Just a Certificate.",
      desc:
        "Employers hire portfolios, not degrees every skill you learn is applied on live brand briefs.",
    },
    {
      title:
        "Job-Ready in 90 Days Not 2 Years.",
      desc:
        "No MBA wait, no extra years placed, promoted, or freelancing within 90 days of completion.",
    },
    {
      title:
        "Freelance Income Starts Before You Even Graduate.",
      desc:
        "You learn to take on paying clients and manage projects so your income starts during the course.",
    },
    {
      title:
        "Industry-Validated. Employer-Recognised.",
      desc:
        "Your skills are verified by the companies that will hire you not just the institution that taught you.",
    },
    {
      title:
        "You're Not Just Certified You're Hireable.",
      desc:
        "Built around skills companies are actively hiring for this credential opens doors, not just fills a resume.",
    },
  ],

  packageText:
    "₹25K–₹40K Avg First Job Package",

  packageDescription:
    "Freshers placed across Hyderabad, AP & remote roles.",
};

export function CertificateSection() {
  const [certificate, setCertificate] =
    useState<CertificateData>(fallbackCertificate);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/certificate",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch certificate");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setCertificate(result.data);
        }
      } catch (error) {
        console.error(
          "Failed to load certificate CMS content:",
          error
        );
      }
    };

    fetchCertificate();
  }, []);

  const headingParts = certificate.heading.split(" READY ");

  return (
    <section className="bg-[#1A1A1A] text-white px-[6%] py-28">
      {/* TOP */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        {/* LEFT TITLE */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h2
            className="font-bebas uppercase text-[#F7F1E4] tracking-wide text-[40px] sm:text-[50px] md:text-[60px] leading-[44px] sm:leading-[54px] md:leading-[64px]
            drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            style={{
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            {headingParts.length === 2 ? (
              <>
                {headingParts[0]}
                <br />
                READY {headingParts[1]}
              </>
            ) : (
              certificate.heading
            )}
          </h2>
        </motion.div>

        {/* RIGHT DESC */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center"
        >
          <p className="text-white/60 text-sm max-w-md leading-relaxed">
            {certificate.description}
          </p>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT: CERTIFICATE INFO + IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative p-8 border border-[#FFC62A]/20 rounded-[22px]
          bg-gradient-to-br from-[#1A1A1A] via-[#111] to-black
          shadow-[0_10px_40px_rgba(255,198,42,0.08)]
          hover:shadow-[0_12px_50px_rgba(255,198,42,0.12)]
          transition duration-300 flex flex-col"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FFC62A]/70 blur-[0.5px]" />

          <h3 className="text-[#FFC62A] font-semibold mb-2 tracking-wide">
            {certificate.issuerName}
          </h3>

          <p className="text-white/40 text-xs tracking-[2px] uppercase mb-6">
            {certificate.certificateSubtitle}
          </p>

          <p className="text-white/60 text-sm leading-relaxed mb-6">
            {certificate.certificateDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/60 mb-8">
            <div>
              <p className="text-white/30">
                Issued By
              </p>

              <p className="text-[#FFC62A]">
                {certificate.issuedBy}
              </p>
            </div>

            <div>
              <p className="text-white/30">
                Recognition
              </p>

              <p className="text-green-400">
                {certificate.recognition}
              </p>
            </div>

            <div>
              <p className="text-white/30">
                Status
              </p>

              <p className="text-green-400">
                {certificate.status}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <img
              src={certificate.certificateImage}
              alt="TAC Job Ready Certificate"
              className="w-full h-auto object-contain rounded-[12px] max-h-[400px]"
            />
          </div>
        </motion.div>

        {/* RIGHT: FEATURES */}
        <div className="space-y-6 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block border border-[#FFC62A]/40 text-[#FFC62A] px-4 py-2 text-xs tracking-[3px] uppercase rounded-full"
          >
            {certificate.badgeText}
          </motion.div>

          {certificate.features.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-b border-white/10 pb-4 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-[#FFC62A] mt-1">
                  →
                </span>

                <div>
                  <h4 className="font-semibold text-white group-hover:text-[#FFC62A] transition">
                    {item.title}
                  </h4>

                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.55,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 p-5 border border-[#FFC62A]/20 rounded-[18px]
            bg-gradient-to-r from-[#1A1A1A] via-[#111] to-black
            shadow-[0_8px_30px_rgba(255,198,42,0.06)]"
          >
            <p className="text-[#FFC62A] font-bold text-lg">
              {certificate.packageText}
            </p>

            <p className="text-white/50 text-sm">
              {certificate.packageDescription}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}