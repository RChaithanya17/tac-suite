"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Handshake,
  Megaphone,
  Palette,
  PenTool,
  Sparkles,
  Video,
  Wand2,
  type LucideIcon,
} from "lucide-react";

type SkillFromAPI = {
  _id?: string;
  id: string;
  title: string;
  desc: string;
  icon: string;
  tags: string[];
  stat: string;
};

const API_BASE_URL = "http://localhost:5000";

const iconMap: Record<string, LucideIcon> = {
  Video,
  Palette,
  Sparkles,
  Wand2,
  PenTool,
  Camera,
  Handshake,
  Megaphone,
};

const fallbackSkills: SkillFromAPI[] = [
  {
    id: "01",
    title: "Video Editing",
    desc: "Premiere Pro, narrative cuts, reels.",
    icon: "Video",
    tags: ["Premiere", "Reels", "Cuts"],
    stat: "Short-form mastery",
  },
  {
    id: "02",
    title: "Graphic Design",
    desc: "Photoshop, Illustrator, branding.",
    icon: "Palette",
    tags: ["Photoshop", "Branding", "Logos"],
    stat: "Visual identity",
  },
  {
    id: "03",
    title: "After Effects",
    desc: "Motion graphics, animations, VFX.",
    icon: "Sparkles",
    tags: ["Motion", "VFX", "Animation"],
    stat: "High-end visuals",
  },
  {
    id: "04",
    title: "DaVinci Resolve",
    desc: "Colour grading, cinema outputs.",
    icon: "Wand2",
    tags: ["Color", "Cinematic", "LUTs"],
    stat: "Pro grading",
  },
  {
    id: "05",
    title: "Content Writing",
    desc: "Scripts, captions, SEO articles.",
    icon: "PenTool",
    tags: ["Scripts", "SEO", "Copy"],
    stat: "Engaging storytelling",
  },
  {
    id: "06",
    title: "Content Shoot",
    desc: "Camera, lighting, direction.",
    icon: "Camera",
    tags: ["Camera", "Lighting", "Angles"],
    stat: "Production skills",
  },
  {
    id: "07",
    title: "Client Management",
    desc: "Briefing, revisions, retention.",
    icon: "Handshake",
    tags: ["Clients", "Deals", "Retention"],
    stat: "Professional workflow",
  },
  {
    id: "08",
    title: "Digital Marketing",
    desc: "Ads, SEO, analytics, growth.",
    icon: "Megaphone",
    tags: ["Ads", "SEO", "Growth"],
    stat: "Revenue focus",
  },
];

export function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const [skills, setSkills] = useState<SkillFromAPI[]>(fallbackSkills);

  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/skills`);

        if (!response.ok) {
          throw new Error("Failed to load skills");
        }

        const result = await response.json();

        const fetchedSkills: SkillFromAPI[] = result.data ?? [];

        if (isMounted && fetchedSkills.length > 0) {
          setSkills(fetchedSkills);
        }
      } catch (error) {
        console.error("Failed to load skills:", error);
      }
    };

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FBF8E4] px-[6%] py-24 text-[#1D1D1D]">
      {/* BACKGROUND TAC TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute right-[4%] top-[20px] z-0 text-right sm:right-[6%] sm:top-[90px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 0.12, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-bebas select-none text-[80px] leading-none sm:text-[180px] md:text-[220px]"
          style={{
            color: "#1D1D1D",
            textShadow: `
              0 4px 8px rgba(31, 31, 31, 0.15),
              0 8px 16px rgba(31, 31, 31, 0.1),
              0 12px 24px rgba(255, 198, 42, 0.08)
            `,
            fontWeight: 700,
          }}
        >
          TAC
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 0.8, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="-mt-1 font-mono text-[8px] font-bold uppercase tracking-[2px] text-[#1D1D1D]/80 sm:-mt-8 sm:text-[16px] sm:tracking-[3px]"
        >
          Creative. Practical. Industry Ready.
        </motion.p>
      </motion.div>

      {/* HEADER */}
      <div className="relative z-10 mb-16">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-[1.5px] w-10 bg-[#FFC62A]" />
          <p className="-mt-8 font-mono text-[16px] font-bold uppercase tracking-[3px] text-[#1D1D1D]" />
        </div>

        <h2
          className="font-bebas text-[48px] uppercase leading-[44px] tracking-[0.5px] sm:text-[62px] sm:leading-[58px] md:text-[76px] md:leading-[72.2px]"
          style={{
            fontWeight: "700",
            fontFamily: "'Bebas Neue', sans-serif",
          }}
        >
          {skills.length} SKILLS.
          <br />
          <span className="text-[#FFC62A]">ZERO GAPS.</span>
        </h2>
      </div>

      {/* SKILLS GRID */}
      <div className="relative z-10 mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill, i) => {
          const isSelected = selectedSkill === skill.id;

          const SkillIcon = iconMap[skill.icon] ?? Video;

          return (
            <motion.div
              key={skill._id ?? skill.id}
              initial={{ opacity: 1, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() =>
                setSelectedSkill(isSelected ? null : skill.id)
              }
              className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-8 shadow-md transition-all duration-300 ${
                isSelected
                  ? "border-[#FFC62A] bg-[#1D1D1D] shadow-xl"
                  : "border-[#1D1D1D]/5 bg-white hover:shadow-xl"
              }`}
            >
              {/* SELECTED GLOW */}
              <div
                className={`absolute inset-0 transition duration-500 ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC62A]/25 via-transparent to-transparent blur-2xl" />
              </div>

              {/* DARK HOVER / SELECTED BACKGROUND */}
              <div
                className={`absolute inset-0 rounded-3xl bg-[#1D1D1D] transition duration-300 ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />

              {/* ACTIVE INDICATOR */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFC62A] text-xs font-black text-[#1D1D1D]"
                >
                  ✓
                </motion.div>
              )}

              {/* ICON */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                  isSelected
                    ? "bg-[#FFC62A] text-[#1D1D1D]"
                    : "bg-[#FFC62A]/10 text-[#FFC62A] group-hover:bg-[#FFC62A] group-hover:text-[#1D1D1D]"
                }`}
              >
                <SkillIcon size={22} strokeWidth={2.5} />
              </motion.div>

              {/* CONTENT */}
              <div className="relative z-10">
                <p
                  className={`mb-2 text-[10px] font-mono font-bold tracking-[2px] transition-colors duration-300 ${
                    isSelected
                      ? "text-[#FFC62A]"
                      : "text-[#FFC62A]"
                  }`}
                >
                  {skill.id}
                </p>

                <h3
                  className={`mb-2 text-lg font-black uppercase tracking-tight transition-colors duration-300 ${
                    isSelected
                      ? "text-white"
                      : "text-[#1D1D1D] group-hover:text-white"
                  }`}
                >
                  {skill.title}
                </h3>

                <p
                  className={`mb-4 text-[12px] leading-relaxed transition-colors duration-300 ${
                    isSelected
                      ? "text-white/60"
                      : "text-[#1D1D1D]/60 group-hover:text-white/60"
                  }`}
                >
                  {skill.desc}
                </p>

                {/* TAGS */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-md border px-2 py-1 text-[9px] font-mono tracking-[1.5px] transition ${
                        isSelected
                          ? "border-white/20 text-white/70"
                          : "border-[#1D1D1D]/10 text-[#1D1D1D]/60 group-hover:border-white/20 group-hover:text-white/70"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* BOTTOM STAT */}
                <p
                  className={`text-[10px] font-mono uppercase tracking-[2px] transition ${
                    isSelected
                      ? "text-white/40"
                      : "text-[#1D1D1D]/40 group-hover:text-white/40"
                  }`}
                >
                  {skill.stat}
                </p>

                {/* CLICK HINT */}
                <p
                  className={`mt-4 text-[9px] font-mono uppercase tracking-[1.5px] transition-opacity duration-300 ${
                    isSelected
                      ? "text-[#FFC62A] opacity-100"
                      : "text-[#1D1D1D]/30 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isSelected ? "CLICK TO CLOSE" : "CLICK TO EXPLORE"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FONT */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
      `}</style>
    </section>
  );
}