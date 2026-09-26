"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  courseAboutLinks as fallbackCourseAboutLinks,
  footerBadges as fallbackFooterBadges,
  footerContact as fallbackFooterContact,
  footerCopy as fallbackFooterCopy,
  legalLinks as fallbackLegalLinks,
  socialLinks as fallbackSocialLinks,
} from "@/data/footer";

const API_BASE_URL = "http://localhost:5000";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = FooterLink;

type FooterContact = {
  addressLines: string[];
  phone: string;
  phoneHref: string;
  admissionsEmail: string;
  admissionsEmailHref: string;
};

type FooterBadge = {
  label: string;
};

type FooterData = {
  _id?: string;
  socialLinks: SocialLink[];
  footerContact: FooterContact;
  courseAboutLinks: FooterLink[];
  legalLinks: FooterLink[];
  footerBadges: FooterBadge[];
  copyright: string;
  marketingStatement: string;
};

const fallbackFooter: FooterData = {
  socialLinks: fallbackSocialLinks,
  footerContact: fallbackFooterContact,
  courseAboutLinks: fallbackCourseAboutLinks,
  legalLinks: fallbackLegalLinks,
  footerBadges: fallbackFooterBadges,
  copyright: fallbackFooterCopy.copyright,
  marketingStatement: fallbackFooterCopy.marketingStatement,
};

export function Footer() {
  const [footer, setFooter] = useState<FooterData>(
    fallbackFooter
  );

  useEffect(() => {
    let isMounted = true;

    const loadFooter = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/footer`
        );

        if (!response.ok) {
          throw new Error("Failed to load footer");
        }

        const result = await response.json();

        if (!isMounted) {
          return;
        }

        if (result.success && result.data) {
          setFooter(result.data);
        }
      } catch (error) {
        console.error("Failed to load footer:", error);
      }
    };

    loadFooter();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="bg-[#0D0D0D] text-white px-[6%] py-8 border-t border-white/10">
      {/* TOP ROW */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5"
      >
        <h2 className="text-lg md:text-xl tracking-[2px] md:tracking-[3px] font-semibold">
          <span className="text-[#C9A227]">TAC </span>
          School of Modern Learning Private Limited
        </h2>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm tracking-[2px] md:tracking-[3px] uppercase text-white/60">
          {footer.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#C9A227] transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>

      <div className="border-t border-white/10 mb-5" />

      {/* MIDDLE ROW — Address & Nav Links */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.65,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col md:flex-row justify-between gap-4 mb-5"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-[#C9A227] mt-0.5">
              📍
            </span>

            <div>
              <p className="text-xs font-semibold tracking-[2px] uppercase text-white mb-0.5">
                Address
              </p>

              <p className="text-xs text-white/50 leading-relaxed">
                {footer.footerContact.addressLines[0]}
                <br />
                {footer.footerContact.addressLines[1]}
                <br />
                {footer.footerContact.addressLines[2]}
                <br />
                {footer.footerContact.addressLines[3]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#C9A227]">
              📞
            </span>

            <a
              href={footer.footerContact.phoneHref}
              className="text-xs text-white/50 hover:text-[#C9A227] transition tracking-[1px]"
            >
              {footer.footerContact.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-white/60 tracking-[2px]">
          {footer.courseAboutLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#C9A227] transition flex items-center gap-2"
            >
              <span className="text-[#C9A227]">
                »
              </span>{" "}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-xs text-white/60 tracking-[2px]">
          <p className="text-[10px] font-semibold tracking-[3px] uppercase text-white/30 mb-1">
            Legal
          </p>

          {footer.legalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#C9A227] transition flex items-center gap-2"
            >
              <span className="text-[#C9A227]">
                »
              </span>{" "}
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="border-t border-white/10 mb-5" />

      {/* BOTTOM ROW */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.55,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <p className="text-xs text-white/40 tracking-[2px]">
          {footer.copyright}
        </p>

        <div className="flex flex-wrap gap-2 text-xs tracking-[2px]">
          {footer.footerBadges.map((badge) => (
            <span
              key={badge.label}
              className="border border-white/10 px-3 py-1.5 rounded-[6px] text-white/60"
            >
              {badge.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* EXTRA INFO */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.5,
          delay: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-5 text-center"
      >
        <p className="text-xs text-white/50 mb-1">
          {footer.marketingStatement}
        </p>

        <a
          href={footer.footerContact.admissionsEmailHref}
          className="text-xs text-[#C9A227] hover:underline"
        >
          {footer.footerContact.admissionsEmail}
        </a>
      </motion.div>
    </footer>
  );
}