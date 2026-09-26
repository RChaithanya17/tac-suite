"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  bottomStripItems as fallbackBottomStripItems,
  heroStats as fallbackHeroStats,
  topStripItems as fallbackTopStripItems,
} from "@/data/hero";
import { initialLeadFormData, submitLeadForm, type LeadFormData } from "@/lib/leadForm";
import { AnimatedCounter } from "@/components/AnimatedCounter";

type HeroStripItem = {
  label: string;
  color: string;
  icon: string;
  order?: number;
};

type HeroStat = {
  val: string;
  label: string;
  order?: number;
};

type HeroCMSData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  outlineText: string;
  description: string;
  ctaText: string;
  videoUrl: string;
  topStripItems: HeroStripItem[];
  bottomStripItems: HeroStripItem[];
  stats: HeroStat[];
};

/* ─── INFINITE STRIP ─────────────────────────────────────── */

function InfiniteStrip({
  items,
  direction = "left",
  speed = 35,
}: {
  items: HeroStripItem[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);

  const doubled = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "max-content",
          animation: `strip-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{
              y: -4,
              scale: 1.035,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(26,26,26,0.06)",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: "2px",
              padding: "11px 22px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              cursor: "default",
              transition:
                "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,198,42,0.12)";
              e.currentTarget.style.borderColor =
                "rgba(255,198,42,0.45)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(255,198,42,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "rgba(26,26,26,0.06)";
              e.currentTarget.style.borderColor =
                "rgba(26,26,26,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Skill icon */}

            <motion.span
              whileHover={{
                scale: 1.2,
                rotate: 4,
              }}
              transition={{
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                color: item.color,
                display: "inline-flex",
                transformOrigin: "center",
              }}
            >
              {item.icon}
            </motion.span>

            {/* Skill name */}

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(26,26,26,0.55)",
                transition: "color 0.25s ease",
              }}
              className="group-hover:text-[#1A1A1A]"
            >
              {item.label}
            </span>

            {/* Tiny hover indicator */}

            <span
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#FFC62A",
                boxShadow: "0 0 8px rgba(255,198,42,0.7)",
                marginLeft: "2px",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const getYoutubeVideoId = (url: string): string => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").split("/")[0];
    }

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v") ?? "";
    }

    const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
    return embedMatch?.[1] ?? "";
  } catch {
    return "";
  }
};

const getYoutubeEmbedUrl = (url: string): string => {
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return "https://www.youtube.com/embed/Sj5ty8jFp48?autoplay=1&mute=1&controls=0&loop=1&playlist=Sj5ty8jFp48";
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
};

/* ─── TV / MONITOR COMPONENT ─────────────────────────────── */

function TelevisionPlayer({ videoUrl }: { videoUrl: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(true);

      setTimeout(() => {
        setFlicker(false);
      }, 80);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() =>
        window.open(videoUrl, "_blank")
      }
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        cursor: "pointer",
        filter:
          "drop-shadow(0 32px 64px rgba(0,0,0,0.22)) drop-shadow(0 8px 24px rgba(255,198,42,0.08))",
      }}
    >
      {/* ── TV OUTER BODY ── */}

      <div
        style={{
          background:
            "linear-gradient(145deg, #2a2820 0%, #1a1812 40%, #222018 100%)",
          borderRadius: "16px 16px 12px 12px",
          padding: "18px 18px 0 18px",
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -2px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          position: "relative",
        }}
      >
        {/* Brand badge top-left */}

        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "18px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#FFC62A",
            opacity: 0.7,
          }}
        >
          TAC · STUDIO
        </div>

        {/* Status LED */}

        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "18px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 6px rgba(74,222,128,0.8)",
              animation: "led-pulse 2s ease-in-out infinite",
            }}
          />

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "7px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            LIVE
          </span>
        </div>

        {/* ── SCREEN BEZEL ── */}

        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            background: "#000",
            aspectRatio: "16/10",
            boxShadow:
              "inset 0 0 0 2px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.6)",
          }}
        >
          <iframe
            src={getYoutubeEmbedUrl(videoUrl)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "none",
            }}
            allow="autoplay; encrypted-media"
          />

          {/* Hover Watch Full Video */}

          {isHovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                padding: "12px",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  background: "#FFC62A",
                  color: "#000",
                  padding: "12px 20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                ▶ Watch Full Video
              </div>
            </div>
          )}

          {/* Scanlines overlay */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* CRT vignette */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          {/* Flicker flash */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.03)",
              opacity: flicker ? 1 : 0,
              transition: flicker ? "none" : "opacity 0.08s",
              pointerEvents: "none",
              zIndex: 4,
            }}
          />

          {/* Corner reflections */}

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "40%",
              height: "30%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Bottom HUD bar */}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "8px 12px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 6,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "8px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#FFC62A",
              }}
            />

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "8px",
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.35)",
              }}
            />
          </div>
        </div>

        {/* ── TV CHIN / BOTTOM PANEL ── */}

        <div
          style={{
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            paddingBottom: "4px",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
              }}
            />
          ))}

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3a3828, #1a1812)",
              border: "1px solid rgba(255,255,255,0.1)",
              margin: "0 6px",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />

          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── TV NECK + BASE ── */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "22px",
            background: "linear-gradient(to bottom, #1a1812, #222018)",
            clipPath: "polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)",
          }}
        />

        <div
          style={{
            width: "200px",
            height: "12px",
            background: "linear-gradient(145deg, #2a2820, #1a1812)",
            borderRadius: "6px 6px 4px 4px",
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        />
      </div>

      <style>{`
        @keyframes led-pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 6px rgba(74,222,128,0.8);
          }

          50% {
            opacity: 0.5;
            box-shadow: 0 0 3px rgba(74,222,128,0.4);
          }
        }

        @keyframes strip-left {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333%);
          }
        }

        @keyframes strip-right {
          from {
            transform: translateX(-33.333%);
          }

          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ─── HERO SECTION ───────────────────────────────────────── */

export function HeroSection() {
  const [hero, setHero] = useState<HeroCMSData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<LeadFormData>(initialLeadFormData);

  /* Load Hero content from the CMS.
   * The existing local data remains the fallback so the public Hero
   * keeps working even if the backend is temporarily unavailable.
   */
  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hero");
        const result = await response.json();

        if (response.ok && result?.data) {
          setHero(result.data as HeroCMSData);
        }
      } catch (error) {
        console.error("Failed to load Hero content:", error);
      }
    };

    loadHero();
  }, []);

  /* Lock body scroll when modal is open */

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      await submitLeadForm(formData, window.location.href);

      setSubmitted(true);

      setFormData(initialLeadFormData);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);

    setTimeout(() => {
      setSubmitted(false);

      setFormData(initialLeadFormData);
    }, 300);
  };

  return (
    <>
      <section
        className="min-h-screen bg-[#FBF8E4] text-[#1A1A1A] flex flex-col lg:flex-row pt-[70px] pb-16 lg:pb-0 overflow-x-hidden relative"
        style={{
        marginLeft: "-1px",
        backgroundImage: `
        linear-gradient(
        rgba(26,26,26,0.025) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(26,26,26,0.025) 1px,
        transparent 1px
      )
     `,
      backgroundSize: "48px 48px",
      }}
      >
        {/* ══ LEFT CONTENT ══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full lg:w-1/2 flex flex-col justify-center px-[6%]"
          >

              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
                 }}
                className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[2px] text-[#1A1A1A]/40 sm:gap-4 sm:tracking-[3px]"
                >
                <span className="block h-[1px] w-10 shrink-0 bg-[#FFC62A]" />
                {hero?.eyebrow ?? "THE ART CODE — MADHAPUR, HYDERABAD"}
                </motion.p>

              <h1 className="leading-[1.0] font-black tracking-tight uppercase">
  <span className="block text-[38px] sm:text-[44px] md:text-[64px]">
    {hero?.heading ?? "LEARN"}
  </span>

  <span className="block text-[38px] sm:text-[44px] md:text-[64px] text-[#FFC62A]">
    {hero?.highlight ?? "8 SKILLS."}
  </span>

  <motion.span
    whileHover={{
      y: -2,
      scale: 1.01,
    }}
    transition={{
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="block text-[38px] sm:text-[44px] md:text-[64px] text-transparent cursor-default transition-all duration-300"
    style={{
      WebkitTextStroke: "1.5px rgba(26,26,26,0.2)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.webkitTextStroke =
        "1.5px rgba(255,198,42,0.55)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.webkitTextStroke =
        "1.5px rgba(26,26,26,0.2)";
    }}
  >
    {hero?.outlineText ?? "ONE COURSE."}
  </motion.span>
</h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 text-[#1A1A1A]/60 max-w-md text-[15px] leading-[1.8] font-medium"
            >
            {hero?.description ??
              "India's first 8-in-1 creative suite program. Shoot content. Design brands. Edit reels. Land jobs. Crack freelance gigs. Build your ₹1L/month career."}
          </motion.p>

          {/* ══ CTA + STATS ══ */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-10 mt-10"
          >

            {/* ───────── PREMIUM CTA ───────── */}

            <div className="flex gap-4 flex-wrap">

              <motion.button
                onClick={() => setOpen(true)}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden bg-[#1D1D1D] text-[#FBF8E4] px-10 py-4 text-[12px] font-bold tracking-[2px] uppercase cursor-pointer flex items-center gap-4 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_14px_30px_rgba(255,198,42,0.18)] transition-shadow duration-300"
              >

                {/* Yellow hover sweep */}

                <span className="absolute inset-0 bg-[#FFC62A] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                {/* Button text */}

                <span className="relative z-10 group-hover:text-[#1D1D1D] transition-colors duration-300">
                  {hero?.ctaText ?? "ENROLL IN NEXT BATCH"}
                </span>

                {/* Arrow */}

                <span className="relative z-10 text-[#FFC62A] group-hover:text-[#1D1D1D] group-hover:translate-x-1 transition-all duration-300 text-base">
                  →
                </span>

              </motion.button>

            </div>

            {/* ───────── STATS ───────── */}

            <div className="grid grid-cols-2 gap-y-6 gap-x-8 md:flex md:items-center md:gap-8 border-t border-[#1D1D1D]/10 pt-8 max-w-xl">

              {(hero?.stats ?? fallbackHeroStats).map((s, i) => (

                <motion.div
                  key={s.label}
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-center justify-between cursor-default"
                >

                  <div className="flex flex-col">

                    {/* Number */}

                    <motion.span
                      whileHover={{
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="origin-left text-[32px] md:text-[40px] font-black leading-none text-[#FFC62A] transition-all duration-300"
                    >
                      <AnimatedCounter value={s.val} />
                    </motion.span>

                    {/* Label */}

                    <span className="text-[8px] md:text-[9px] tracking-[2px] uppercase font-bold text-[#1A1A1A]/40 mt-1 group-hover:text-[#1A1A1A]/70 transition-colors duration-300">
                      {s.label}
                    </span>

                    {/* Tiny yellow indicator */}

                    <span className="mt-2 w-0 h-[2px] bg-[#FFC62A] group-hover:w-6 transition-all duration-300" />

                  </div>

                  {/* Divider */}

                  {i < 3 && (
                    <div className="hidden md:block w-[1px] h-10 bg-[#1D1D1D]/10 ml-8 group-hover:bg-[#FFC62A]/40 transition-colors duration-300" />
                  )}

                </motion.div>

              ))}

            </div>

          </motion.div>

        </motion.div>

        {/* ══ RIGHT: TV + STRIPS ══ */}

        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 shrink-0 gap-8 mt-12 lg:mt-0 px-[6%] lg:px-0">

        {/* ── AMBIENT TV GLOW ── */}

       <div
        className="absolute pointer-events-none"
        style={{
        width: "520px",
        height: "420px",
        background:
        "radial-gradient(circle, rgba(255,198,42,0.14) 0%, rgba(255,198,42,0.06) 38%, transparent 72%)",
         filter: "blur(22px)",
        opacity: 0.75,
        zIndex: 0,
         }}
       />

          {/* TOP STRIP — right to left */}

          <InfiniteStrip
            items={hero?.topStripItems ?? fallbackTopStripItems}
            direction="left"
            speed={30}
          />

          {/* TELEVISION */}

          <motion.div
             initial={{ opacity: 0, y: 20 }}
              animate={{
              opacity: 1,
              y: [0, -6, 0],
             }}
             transition={{
             opacity: {
             duration: 0.8,
             ease: [0.22, 1, 0.36, 1],
            },
            y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            },
            }}
           className="px-2 w-[78%]"
       >
           <TelevisionPlayer
              videoUrl={
                hero?.videoUrl ??
                "https://youtu.be/Sj5ty8jFp48?si=-toioADM788nzUiY"
              }
            />
           </motion.div>

          {/* BOTTOM STRIP — left to right */}

          <InfiniteStrip
            items={hero?.bottomStripItems ?? fallbackBottomStripItems}
            direction="right"
            speed={28}
          />

        </div>

      </section>

      {/* ───────── APPLY MODAL ───────── */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >

            <motion.div
              initial={{
                scale: 0.92,
                y: 24,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
              }}
              exit={{
                scale: 0.92,
                y: 24,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="bg-[#FBF8E4] text-[#1A1A1A] w-full max-w-md p-8 rounded-lg shadow-2xl relative"
            >

              {/* Close */}

              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="absolute top-4 right-4 text-black/40 hover:text-black text-xl leading-none transition-colors"
              >
                ✕
              </button>

              <AnimatePresence mode="wait">

                {submitted ? (

                  /* ───────── SUCCESS STATE ───────── */

                  <motion.div
                    key="success"
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="text-center py-10"
                  >

                    <div className="text-5xl mb-4">
                      🎉
                    </div>

                    <h2 className="text-3xl font-black mb-3 tracking-wide">
                      You&apos;re In!
                    </h2>

                    <p className="text-sm text-black/60 leading-relaxed">
                      Application received! We&apos;ll reach out shortly.
                      <br />
                      Please check your email.
                    </p>

                    <button
                      onClick={closeModal}
                      className="mt-8 bg-[#1D1D1D] text-white px-10 py-3 text-[11px] font-bold tracking-[2px] uppercase hover:bg-black transition-all active:scale-95"
                    >
                      CLOSE
                    </button>

                  </motion.div>

                ) : (

                  /* ───────── FORM STATE ───────── */

                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >

                    <h2 className="text-2xl font-black mb-1 tracking-wide">
                      APPLY NOW
                    </h2>

                    <p className="text-xs text-black/50 mb-6 tracking-wide uppercase">
                      Fill in your details to get started
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                    >

                      {/* Name */}

                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="modal-input"
                      />

                      {/* Email */}

                      <input
                        required
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="modal-input"
                      />

                      {/* Phone */}

                      <input
                        required
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        pattern="[0-9+\-\s]{7,15}"
                        title="Enter a valid phone number"
                        className="modal-input"
                      />

                      {/* Age + Qualification */}

                      <div className="flex gap-4">

                        <input
                          required
                          name="age"
                          type="number"
                          min={15}
                          max={60}
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Age"
                          className="modal-input w-1/3"
                        />

                        <input
                          required
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          placeholder="Qualification"
                          className="modal-input w-2/3"
                        />

                      </div>

                      {/* Submit */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="relative bg-[#1D1D1D] text-white py-4 text-sm font-bold tracking-[2px] uppercase mt-2 hover:bg-black transition-all active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                      >

                        <AnimatePresence mode="wait">

                          {loading ? (

                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >

                              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                              Submitting...

                            </motion.span>

                          ) : (

                            <motion.span
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              Submit Application
                            </motion.span>

                          )}

                        </AnimatePresence>

                      </button>

                    </form>

                  </motion.div>

                )}

              </AnimatePresence>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* ───────── MODAL STYLES ───────── */}

      <style jsx>{`
        .modal-input {
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          border-radius: 2px;
          width: 100%;
        }

        .modal-input:focus {
          border-color: #ffc62a;
          box-shadow: 0 0 0 3px rgba(255, 198, 42, 0.15);
        }

        .modal-input::placeholder {
          color: rgba(0, 0, 0, 0.35);
        }
      `}</style>

    </>
  );
}
