"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type SkillFromAPI = {
  _id?: string;
  id: string;
  title: string;
  subtitle?: string;
  desc: string;
  icon: string;
  tags: string[];
  stat: string;
  track?: string;
  lessons?: string[];
  aiLesson?: string;
};

const API_BASE_URL = "http://localhost:5000";

const fallbackSkills: SkillFromAPI[] = [
  {
    id: "01",
    title: "Graphic Design",
    desc: "Posters, social, branding and product design.",
    icon: "Photoshop",
    tags: ["Photoshop", "Firefly", "Posters"],
    stat: "Visual identity",
    track: "Photoshop + AI",
    lessons: [
      "Movie / OTT Poster Design",
      "Social Media Design",
      "YouTube & Content Creator Design",
      "E-commerce & Product Design",
      "Branding & Identity Design",
      "Advanced Photo Manipulation",
      "Print & Marketing Collateral",
    ],
  },
  {
    id: "02",
    title: "Illustrator + AI",
    desc: "Vectors, type, packaging and merch.",
    icon: "Palette",
    tags: ["Illustrator", "Vectors", "Logos"],
    stat: "Brand assets",
    track: "",
    lessons: [
      "Typography & Font Design",
      "Print & Packaging Design",
      "Social Media & Web Design",
      "Vector & Illustration Design",
      "Merchandise & Product Design",
      "Advanced Vector & Assets",
    ],
  },
  {
    id: "03",
    title: "Editing",
    desc: "Trailers, weddings, reels and short films.",
    icon: "Video",
    tags: ["Premiere", "Reels", "Cuts"],
    stat: "Short-form mastery",
    track: "Premiere Pro + AI",
    lessons: [
      "Movie Trailer Cuts",
      "Cinematic Wedding Teaser",
      "Beat-Based Editing",
      "Social Media Reels · 10 industries",
      "Complete Short Film Editing",
      "Own Style Editing & Final Touches",
    ],
  },
  {
    id: "04",
    title: "Motion Graphics",
    desc: "Titles, motion design, animation and VFX.",
    icon: "Sparkles",
    tags: ["Motion", "VFX", "Animation"],
    stat: "High-end visuals",
    track: "After Effects + AI",
    lessons: [
      "Logo & Title Animation",
      "Social Media Motion Graphics",
      "Promo & Explainer Animation",
      "Tracking & Compositing VFX",
      "Character & Product Animation",
      "2D Character Animation",
      "Advanced Motion Graphics",
    ],
  },
  {
    id: "05",
    title: "Colour Grading",
    desc: "From correction to cinematic looks.",
    icon: "Globe",
    tags: ["Colour", "Cinematic", "LUTs"],
    stat: "Pro grading",
    track: "DaVinci Resolve",
    lessons: [
      "Basic Colour Correction",
      "Cinematic Look Creation",
      "Skin Tone Grading",
      "Commercial Colour Grading",
      "Advanced Professional Grading",
      "Special Effects Grading",
    ],
  },
  {
    id: "06",
    title: "AI Image Generation",
    desc: "From a single prompt to a realistic visual.",
    icon: "Image",
    tags: ["Prompts", "Upscale", "Characters"],
    stat: "Lock the image first",
    track: "Image",
    lessons: [
      "High-Quality Realistic Visuals",
      "Accurate Facial Details",
      "Cinematic, Professional Lighting",
      "Clean, Balanced Composition",
      "Realistic Depth & Shadows",
      "Premium Visual Aesthetics",
      "Natural Body Proportions",
    ],
  },
  {
    id: "07",
    title: "AI Video Generation",
    desc: "Turn locked images into cinematic video.",
    icon: "Video",
    tags: ["Higgsfield", "Runway", "Magnific"],
    stat: "Then animate it",
    track: "Higgsfield · Runway · Magnific",
    lessons: [
      "Smooth Cinematic Motion",
      "Realistic Camera Movements",
      "Consistent Visual Quality",
      "Engaging Visual Effects",
      "Transform Ideas into Videos",
      "Quality Video Content",
    ],
  },
  {
    id: "08",
    title: "AI Workflows",
    desc: "One character, every shot, every tool.",
    icon: "Braces",
    tags: ["Workflows", "JSON", "Consistency"],
    stat: "Direct, don’t just generate",
    track: "JSON + Character Consistency",
    lessons: [
      "Prompt Structure & Shot Language",
      "JSON Prompting",
      "Character Sheet & Locking",
      "Consistent Character Across Shots",
      "Image-to-Video Pipeline",
      "Final AI Film Project",
    ],
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
    <section className="relative min-h-screen overflow-hidden bg-[#FBF8E4] px-[6%] pt-24 pb-10 text-[#1D1D1D]">
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
      <div className="relative z-10 mt-6 grid grid-cols-1 auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {skills.map((skill, i) => {
          const isSelected = selectedSkill === skill.id;

          // Cards with a lesson list show a track header and numbered lessons.
          const lessons = skill.lessons ?? [];
          const isModule = lessons.length > 0;

          const titleClass = `text-lg font-black uppercase tracking-tight transition-colors duration-300 ${
            isSelected ? "text-white" : "text-[#1D1D1D] group-hover:text-white"
          }`;

          const lessonTextClass = `text-[13px] leading-snug min-[768px]:text-[14px] min-[1024px]:text-[15px] min-[1280px]:text-[12px] min-[1440px]:text-[14px] min-[1800px]:text-[17px] transition-colors duration-300 ${
            isSelected
              ? "text-white/80"
              : "text-[#1D1D1D]/80 group-hover:text-white/80"
          }`;

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
              onClick={() => setSelectedSkill(isSelected ? null : skill.id)}
              className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border p-4.75 shadow-md transition-all duration-300 ${
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

              {/* CONTENT */}
              <div className="relative z-10 flex flex-1 flex-col">
                <p
                  className={`${isModule ? "mb-1.5" : "mb-2"} text-[10px] font-mono font-bold tracking-[2px] text-[#FFC62A]`}
                >
                  {skill.id}
                </p>

                <h3 className={`mb-2 ${titleClass}`}>{skill.title}</h3>

                {skill.subtitle && (
                  <p
                    className={`-mt-1 mb-2 text-[10px] font-mono font-bold uppercase tracking-[2px] transition-colors duration-300 ${
                      isSelected
                        ? "text-white/50"
                        : "text-[#1D1D1D]/45 group-hover:text-white/50"
                    }`}
                  >
                    {skill.subtitle}
                  </p>
                )}

                <p
                  className={`mb-2.5 text-[12px] leading-snug transition-colors duration-300 ${
                    isSelected
                      ? "text-white/60"
                      : "text-[#1D1D1D]/60 group-hover:text-white/60"
                  }`}
                >
                  {skill.desc}
                </p>

                {/* MODULE LESSONS */}
                {isModule && (
                  <div
                    className={`mb-3 border-t pt-2.5 transition-colors duration-300 ${
                      isSelected
                        ? "border-white/10"
                        : "border-[#1D1D1D]/10 group-hover:border-white/10"
                    }`}
                  >
                    {skill.track ? (
                      <p
                        className={`mb-1.5 text-[12px] font-black uppercase tracking-tight transition-colors duration-300 ${
                          isSelected
                            ? "text-white"
                            : "text-[#1D1D1D] group-hover:text-white"
                        }`}
                      >
                        {skill.track}
                      </p>
                    ) : null}

                    <ol className="space-y-2 min-[1800px]:space-y-2.5">
                      {lessons.map((lesson, li) => {
                        // Text after " · " is a muted note, e.g. "Reels · 10 industries".
                        const [name, ...note] = lesson.split(" · ");
                        return (
                          <li
                            key={lesson}
                            className="flex items-baseline gap-2.5"
                          >
                            <span className="w-6 shrink-0 text-[11px] min-[1800px]:text-[12px] font-mono font-bold text-[#FFC62A]">
                              {String(li + 1).padStart(2, "0")}
                            </span>
                            <span className={lessonTextClass}>
                              {name}
                              {note.length > 0 && (
                                <span
                                  className={
                                    isSelected
                                      ? "text-white/45"
                                      : "text-[#1D1D1D]/45 group-hover:text-white/45"
                                  }
                                >
                                  {" · "}
                                  {note.join(" · ")}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}

                      {skill.aiLesson && (
                        <li className="flex items-baseline gap-2.5">
                          <span className="w-6 shrink-0">
                            <span className="rounded bg-[#FFC62A] px-1 py-px text-[8px] font-mono font-bold text-[#1D1D1D]">
                              AI
                            </span>
                          </span>
                          <span className={lessonTextClass}>
                            {skill.aiLesson}
                          </span>
                        </li>
                      )}
                    </ol>
                  </div>
                )}

                {/* FOOTER — tags, stat and click hint, pinned to the card bottom */}
                <div className="mt-auto pt-3">
                  {/* TAGS */}
                  <div className="mb-2.5 flex flex-wrap gap-2">
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

                  <div>
                    {/* BOTTOM STAT */}
                    {skill.stat && (
                      <p
                        className={`text-[11px] font-mono uppercase tracking-[2px] transition ${
                          isSelected
                            ? "text-white/60"
                            : "text-[#1D1D1D]/60 group-hover:text-white/60"
                        }`}
                      >
                        {skill.stat}
                      </p>
                    )}

                  </div>
                </div>
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
