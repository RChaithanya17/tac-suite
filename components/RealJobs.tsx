"use client";

import { useEffect, useState, type ComponentType } from "react";
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
    <section className="bg-[#FBF8E4] px-[6%] py-14 text-[#1A1A1A]">
      {/* TOP — FULL-WIDTH HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-8 lg:mb-10"
      >
        <p className="text-xs uppercase tracking-[4px] text-[#C9A227]">
          {sectionContent.eyebrow}
        </p>

        <h2
          className={`${bebas.className} mt-3 text-[64px] uppercase leading-[0.92] tracking-[0.5px] sm:text-[84px] lg:text-[96px] xl:text-[112px]`}
        >
          {headingLines.map((line, index) => (
            <span
              key={`${line}-${index}`}
              className={`block whitespace-nowrap sm:inline ${
                index === headingLines.length - 1 && headingLines.length > 1
                  ? "text-[#FFC62A]"
                  : "text-[#1A1A1A]"
              }`}
            >
              {line}
              {index < headingLines.length - 1 && (
                <span className="hidden sm:inline"> </span>
              )}
            </span>
          ))}
        </h2>
      </motion.div>

      {/* BOTTOM — DIAGRAM (LEFT) + STATS (RIGHT) */}
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        {/* LEFT — TAC HUB */}
        <div className="flex flex-col items-center">
          <TacNetwork />
        </div>

        {/* RIGHT — STATS GRID (2 × 3) */}
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {placementStats.map((item, i) => (
            <motion.div
              key={item._id ?? `${item.label}-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="@container flex items-center justify-center rounded-2xl border border-[#FFC62A]/70 bg-white px-5 py-6 shadow-[0_4px_14px_rgba(255,198,42,0.12)] sm:px-6 sm:py-7"
            >
              <div className="flex items-center gap-4 @2xs:gap-5 @md:gap-6">
                {/* Number — golden yellow */}
                <h3 className="whitespace-nowrap text-[34px] font-extrabold leading-none tracking-tight text-[#FFC62A] @2xs:text-[42px] @md:text-[52px]">
                  {isWholeNumber(item.value) ? (
                    <AnimatedCounter value={item.value} />
                  ) : (
                    item.value
                  )}
                </h3>

                {/* Thin golden-yellow divider */}
                <span
                  aria-hidden="true"
                  className="w-px shrink-0 self-stretch bg-[#FFC62A]"
                />

                {/* Label — dark charcoal */}
                <p className="text-[11px] font-semibold uppercase leading-snug tracking-[1.5px] text-[#1A1A1A] @2xs:text-xs @2xs:tracking-[2px] @md:text-[13px]">
                  {splitLabel(item.label).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HELPERS ───────────────────────────────────────────── */

/* AnimatedCounter strips non-digits, so only count up whole numbers
 * ("10", "100%"); values like "₹7.2L" render as-is. */
const isWholeNumber = (value: string) => /^\D*\d+\D*$/.test(value);

/* Split a label into two balanced lines at the word break that keeps the
 * longer line shortest ("SKILLS PER / STUDENT"); one-word labels stay whole. */
function splitLabel(label: string): string[] {
  const words = label.trim().split(/\s+/);
  if (words.length < 2) return [label];

  let best = 1;
  let bestLength = Infinity;
  for (let i = 1; i < words.length; i++) {
    const longest = Math.max(
      words.slice(0, i).join(" ").length,
      words.slice(i).join(" ").length
    );
    if (longest < bestLength) {
      bestLength = longest;
      best = i;
    }
  }

  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/* ─── HUB ICONS ───────────────────────────────────────────
 * Custom 24×24 line icons matching the approved reference: charcoal
 * outlines with golden-yellow accents / pale-yellow fills. */
const ICON_INK = "#1A1A1A";
const ICON_GOLD = "#FFC62A";
const ICON_FILL = "#FFE59A";

type HubIconProps = { className?: string; strokeWidth?: number };

const hubSvgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: ICON_INK,
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Top — Students: one person in front, two partially behind. */
function PeopleIcon({ className = "" }: HubIconProps) {
  return (
    <svg {...hubSvgProps} className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6.5 20v-.8a5.5 5.5 0 0 1 11 0v.8Z" />
      <path d="M6.6 5.2a2.6 2.6 0 0 0-.4 5.1" />
      <path d="M2.2 18.2v-.6a4.1 4.1 0 0 1 2.9-3.9" />
      <path d="M17.4 5.2a2.6 2.6 0 0 1 .4 5.1" />
      <path d="M21.8 18.2v-.6a4.1 4.1 0 0 0-2.9-3.9" />
    </svg>
  );
}

/* Upper right — Skills: gear with a yellow wrench across it. */
function GearWrenchIcon({ className = "" }: HubIconProps) {
  return (
    <svg {...hubSvgProps} className={className}>
      <g transform="translate(-0.2 -0.2) scale(0.8)">
        <path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          strokeWidth={2.3}
        />
        <circle cx="12" cy="12" r="3" strokeWidth={2.3} />
      </g>
      <g transform="translate(8.9 8.9) scale(0.64)">
        <path
          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
          fill={ICON_GOLD}
          strokeWidth={2.4}
        />
      </g>
    </svg>
  );
}

/* Lower right — Jobs & Placements: briefcase with pale-yellow body. */
function BriefcaseFilledIcon({ className = "" }: HubIconProps) {
  return (
    <svg {...hubSvgProps} className={className}>
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <rect x="2.5" y="7" width="19" height="13" rx="2" fill={ICON_FILL} />
      <path d="M2.5 12.5h7.5m4 0h7.5" />
      <rect x="10" y="11" width="4" height="3.2" rx="0.6" fill="#FFFFFF" />
    </svg>
  );
}

/* Bottom — Career Growth: rising bars with a trend arrow. */
function GrowthChartIcon({ className = "" }: HubIconProps) {
  return (
    <svg {...hubSvgProps} className={className}>
      <rect x="3.5" y="15.5" width="3.6" height="5" rx="0.6" fill={ICON_FILL} />
      <rect x="10.2" y="12.5" width="3.6" height="8" rx="0.6" fill={ICON_FILL} />
      <rect x="16.9" y="9.5" width="3.6" height="11" rx="0.6" fill={ICON_FILL} />
      <path d="M3.5 11.5 8.5 7l3.5 2.6L19.5 3.5" />
      <path d="M15.2 3.5h4.3v4.3" />
    </svg>
  );
}

/* Lower left — Portfolio / Projects: open folder with pale-yellow front. */
function FolderFilledIcon({ className = "" }: HubIconProps) {
  return (
    <svg {...hubSvgProps} className={className}>
      <path d="M3.2 17.5V6a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.6.8l1 1.4a2 2 0 0 0 1.6.8h5.2a2 2 0 0 1 2 2V10" />
      <path
        d="M3.2 18.5 5.8 11.2A1.8 1.8 0 0 1 7.5 10h13.4a1 1 0 0 1 .95 1.3l-2.3 7.2A2 2 0 0 1 17.6 20H4.6a1.4 1.4 0 0 1-1.4-1.5Z"
        fill={ICON_FILL}
      />
    </svg>
  );
}

/* Upper left — Certification: scalloped badge with a yellow checkmark. */
function BadgeCheckGoldIcon({ className = "" }: HubIconProps) {
  return (
    <svg {...hubSvgProps} className={className}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m8.6 12.1 2.4 2.4 4.6-4.8" stroke={ICON_GOLD} strokeWidth={2.4} />
    </svg>
  );
}

/* Decorative TAC hub: six icon nodes with straight arrows pointing inward
 * to the centre. Purely visual — hidden from assistive tech. */
type NetworkIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

const networkNodes: { Icon: NetworkIcon; angle: number }[] = [
  { Icon: PeopleIcon, angle: -90 }, // top — students
  { Icon: GearWrenchIcon, angle: -30 }, // upper right — skills
  { Icon: BriefcaseFilledIcon, angle: 30 }, // lower right — jobs & placements
  { Icon: GrowthChartIcon, angle: 90 }, // bottom — career growth
  { Icon: FolderFilledIcon, angle: 150 }, // lower left — portfolio / projects
  { Icon: BadgeCheckGoldIcon, angle: 210 }, // upper left — certification
];

const NODE_ORBIT = 40; // node centre distance from middle, % of the box
const NODE_RADIUS = 10; // half of each node's 20% size
const HUB_RADIUS = 16; // half of the hub's 32% size

const polar = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
};

function TacNetwork() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-60 shrink-0 sm:w-64 lg:w-72 xl:w-80"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <marker
            id="tac-net-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="4.2"
            markerHeight="4.2"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10Z" fill="#C9A227" />
          </marker>
        </defs>

        {/* Straight arrows: node edge → TAC hub edge */}
        {networkNodes.map(({ angle }) => {
          const from = polar(angle, NODE_ORBIT - NODE_RADIUS - 1.5);
          const to = polar(angle, HUB_RADIUS + 1.5);
          return (
            <line
              key={angle}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#C9A227"
              strokeWidth="0.7"
              strokeLinecap="round"
              markerEnd="url(#tac-net-arrow)"
            />
          );
        })}
      </svg>

      {/* Centre hub */}
      <div className="absolute left-1/2 top-1/2 flex h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFC62A] shadow-[0_6px_18px_rgba(26,26,26,0.12)]">
        <span className="text-xl font-black leading-none tracking-tight text-[#1A1A1A] lg:text-2xl">
          TAC
        </span>
      </div>

      {/* White icon nodes */}
      {networkNodes.map(({ Icon, angle }) => {
        const { x, y } = polar(angle, NODE_ORBIT);
        return (
          <div
            key={angle}
            className="absolute flex h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-[#FFC62A] bg-white text-[#1A1A1A] shadow-[0_4px_14px_rgba(255,198,42,0.15)]"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Icon className="h-[50%] w-[50%]" strokeWidth={1.8} />
          </div>
        );
      })}
    </div>
  );
}

export default PlacementSection;