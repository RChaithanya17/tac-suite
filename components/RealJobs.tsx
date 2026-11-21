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

        {/* RIGHT — STATS PANEL (3 × 2, one connected block).
         * The 1px gaps over a tinted background form the dividers; the
         * middle column is golden yellow in both rows. */}
        <div className="grid auto-rows-fr grid-cols-1 gap-px overflow-hidden rounded-[24px] bg-[#1A1A1A]/10 sm:grid-cols-3">
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
              className={`flex flex-col items-center justify-center px-4 py-8 text-center lg:px-6 lg:py-10 ${
                i % 3 === 1 ? "bg-[#F4D03F]" : "bg-[#FFFDF5]"
              }`}
            >
              <h3 className="mb-2 whitespace-nowrap text-4xl font-extrabold tracking-tight text-[#1A1A1A] lg:text-5xl">
                {isWholeNumber(item.value) ? (
                  <AnimatedCounter value={item.value} />
                ) : (
                  item.value
                )}
              </h3>

              <p className="text-[10px] font-semibold uppercase leading-snug tracking-[2px] text-[#1A1A1A]/60 lg:text-xs lg:tracking-[3px]">
                {item.label}
              </p>
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
    <svg {...hubSvgProps} aria-hidden="true" className={className}>
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
    <svg {...hubSvgProps} aria-hidden="true" className={className}>
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
    <svg {...hubSvgProps} aria-hidden="true" className={className}>
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
    <svg {...hubSvgProps} aria-hidden="true" className={className}>
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
    <svg {...hubSvgProps} aria-hidden="true" className={className}>
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
    <svg {...hubSvgProps} aria-hidden="true" className={className}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m8.6 12.1 2.4 2.4 4.6-4.8" stroke={ICON_GOLD} strokeWidth={2.4} />
    </svg>
  );
}

/* TAC hub: six labelled icon nodes with straight arrows pointing inward
 * to the centre. Sizes are % of the square box and text uses container
 * units (cqw), so the whole diagram scales as one piece. */
type NetworkIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

const networkNodes: { Icon: NetworkIcon; angle: number; label: string[] }[] = [
  { Icon: PeopleIcon, angle: -90, label: ["Training"] }, // top
  { Icon: GearWrenchIcon, angle: -30, label: ["Skills"] }, // upper right
  { Icon: BriefcaseFilledIcon, angle: 30, label: ["Jobs &", "Placements"] }, // lower right
  { Icon: GrowthChartIcon, angle: 90, label: ["Career", "Growth"] }, // bottom
  { Icon: FolderFilledIcon, angle: 150, label: ["Portfolio /", "Projects"] }, // lower left
  { Icon: BadgeCheckGoldIcon, angle: 210, label: ["Certification"] }, // upper left
];

const NODE_ORBIT = 37; // node centre distance from middle, % of the box
const NODE_RADIUS = 13; // half of each node's 26% size
const HUB_RADIUS = 13.5; // half of the hub's 27% size

const polar = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
};

function TacNetwork() {
  return (
    <div className="@container relative mx-auto aspect-square w-full max-w-85 shrink-0 sm:max-w-95 xl:max-w-110">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
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
      <div className="absolute left-1/2 top-1/2 flex h-[27%] w-[27%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFC62A] shadow-[0_6px_18px_rgba(26,26,26,0.12)]">
        <span className="text-[7.5cqw] font-black leading-none tracking-tight text-[#1A1A1A]">
          TAC
        </span>
      </div>

      {/* White labelled icon nodes */}
      {networkNodes.map(({ Icon, angle, label }) => {
        const { x, y } = polar(angle, NODE_ORBIT);
        return (
          <div
            key={angle}
            className="absolute flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[1.2cqw] rounded-full border-2 border-[#FFC62A] bg-white text-[#1A1A1A] shadow-[0_4px_14px_rgba(255,198,42,0.18)]"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Icon className="h-[8.5cqw] w-[8.5cqw] shrink-0" strokeWidth={1.8} />
            <span className="text-center text-[3.1cqw] font-semibold leading-[1.15] text-[#1A1A1A]">
              {label.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default PlacementSection;