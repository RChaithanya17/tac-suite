"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type PlacementStudent = {
  _id?: string;
  photo: string;
  name: string;
  company: string;
  role: string;
  skills: string[];
  lpa?: string;
  section: "top" | "bottom";
};

const API_BASE_URL = "http://localhost:5000";

function StudentCard({ student }: { student: PlacementStudent }) {
  return (
    <div className="placed-card">
      <div className="placed-panel">
        <div className="placed-name">{student.name}</div>
        <div className="placed-divider" />
        <div className="placed-company">{student.company}</div>
        <div className="placed-role">{student.role}</div>
        <div className="placed-skills-label">Additional Skills :</div>
        <div className="placed-skills">
          {student.skills.join(" || ")}
        </div>
        {student.lpa && (
          <div className="placed-lpa">{student.lpa} LPA</div>
        )}
      </div>

      <div className="placed-photo">
        <Image
          src={student.photo}
          alt={student.name}
          fill
          sizes="(min-width: 1024px) 210px, (min-width: 640px) 165px, 145px"
          className="object-cover object-[top_center]"
        />
      </div>
    </div>
  );
}

function TopCarousel({
  students,
}: {
  students: PlacementStudent[];
}) {
  const [isPaused, setIsPaused] = useState(false);

  if (students.length === 0) {
    return null;
  }

  return (
    <div
      className="relative mb-6 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-[#FBF8E4] to-transparent" />

      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-[#FBF8E4] to-transparent" />

      <div
        className="placed-track-left"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {[...students, ...students].map((student, i) => (
          <StudentCard
            key={`top-${student._id ?? student.photo}-${i}`}
            student={student}
          />
        ))}
      </div>
    </div>
  );
}

function BottomCarousel({
  students,
}: {
  students: PlacementStudent[];
}) {
  const [isPaused, setIsPaused] = useState(false);

  if (students.length === 0) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-[#FBF8E4] to-transparent" />

      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-[#FBF8E4] to-transparent" />

      <div
        className="placed-track-right"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {[...students, ...students].map((student, i) => (
          <StudentCard
            key={`bottom-${student._id ?? student.photo}-${i}`}
            student={student}
          />
        ))}
      </div>
    </div>
  );
}

export function SimpleInfiniteCarousel() {
  const [topStudents, setTopStudents] = useState<PlacementStudent[]>([]);
  const [bottomStudents, setBottomStudents] = useState<
    PlacementStudent[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/placements/students`
        );

        if (!response.ok) {
          throw new Error("Failed to load placement students");
        }

        const result = await response.json();

        const students: PlacementStudent[] = result.data ?? [];

        if (!isMounted) {
          return;
        }

        setTopStudents(
          students.filter((student) => student.section === "top")
        );

        setBottomStudents(
          students.filter((student) => student.section === "bottom")
        );
      } catch (error) {
        console.error("Failed to load placement students:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#FBF8E4] py-12 text-black">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-16 px-[5%]"
      >
        <div className="mb-4 flex items-center gap-3">
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 32, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="block h-[1.5px] bg-[#FFC62A]"
          />

          <motion.p
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-xs uppercase tracking-[4px] text-[#C9A227]"
          >
            05 / Our People
          </motion.p>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="placed-heading uppercase text-[#111]"
        >
          PLACED &<br />
          THRIVING.
        </motion.h2>
      </motion.div>

      {loading ? (
        <div className="h-12" aria-hidden="true" />
      ) : (
        <>
          <TopCarousel students={topStudents} />
          <BottomCarousel students={bottomStudents} />
        </>
      )}

      <style>{`
        @keyframes placed-scroll-left {
          0% {
            transform: translate3d(0, 0, 0);
          }

          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes placed-scroll-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }

          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .placed-track-left,
        .placed-track-right {
          display: flex;
          gap: 16px;
          align-items: center;
          width: max-content;
          padding: 10px 0;
        }

        .placed-track-left {
          animation: placed-scroll-left 40s linear infinite;
        }

        .placed-track-right {
          animation: placed-scroll-right 40s linear infinite;
        }

        .placed-card {
          --circle: 145px;
          --overlap: 42px;
          --panel-w: 205px;
          position: relative;
          width: calc(var(--circle) - var(--overlap) + var(--panel-w));
          height: calc(var(--circle) + 12px);
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .placed-card {
            --circle: 165px;
            --overlap: 50px;
            --panel-w: 250px;
          }

          .placed-track-left,
          .placed-track-right {
            gap: 20px;
          }
        }

        @media (min-width: 1024px) {
          .placed-card {
            --circle: 210px;
            --overlap: 64px;
            --panel-w: 310px;
          }

          .placed-track-left,
          .placed-track-right {
            gap: 24px;
          }
        }

        .placed-panel {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: var(--panel-w);
          height: var(--circle);
          border: 3px solid #222;
          border-radius: 16px;
          background: transparent;
          padding-left: calc(var(--overlap) + 10px);
          padding-right: 14px;
          padding-top: 14px;
          padding-bottom: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .placed-photo {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: var(--circle);
          height: var(--circle);
          border-radius: 50%;
          background: #F5C518;
          overflow: hidden;
          z-index: 2;
          flex-shrink: 0;
        }

        .placed-name {
          font-weight: 800;
          font-size: 13px;
          color: #111;
          font-family: Figtree, sans-serif;
        }

        .placed-divider {
          height: 2px;
          background: #222;
          width: 36px;
        }

        .placed-company {
          color: #C41E3A;
          font-size: 10px;
          font-weight: 600;
          font-family: Figtree, sans-serif;
        }

        .placed-role {
          font-style: italic;
          font-weight: 700;
          font-size: 11px;
          color: #111;
          font-family: Figtree, sans-serif;
        }

        .placed-skills-label {
          font-size: 8px;
          font-weight: 800;
          color: #111;
          font-family: Figtree, sans-serif;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .placed-skills {
          font-size: 9px;
          color: #444;
          font-family: Figtree, sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .placed-lpa {
          color: #C41E3A;
          font-weight: 800;
          font-size: 15px;
          font-family: Figtree, sans-serif;
        }

        @media (min-width: 640px) {
          .placed-name {
            font-size: 16px;
          }

          .placed-divider {
            width: 40px;
          }

          .placed-company {
            font-size: 12px;
          }

          .placed-role {
            font-size: 13px;
          }

          .placed-skills-label {
            font-size: 9.5px;
          }

          .placed-skills {
            font-size: 10px;
          }

          .placed-lpa {
            font-size: 18px;
          }
        }

        @media (min-width: 1024px) {
          .placed-name {
            font-size: 19px;
          }

          .placed-divider {
            width: 44px;
          }

          .placed-company {
            font-size: 14px;
          }

          .placed-role {
            font-size: 16px;
          }

          .placed-skills-label {
            font-size: 11px;
          }

          .placed-skills {
            font-size: 12px;
          }

          .placed-lpa {
            font-size: 22px;
          }
        }

        .placed-heading {
          font-size: 42px;
          line-height: 40px;
          letter-spacing: 0.5px;
        }

        @media (min-width: 640px) {
          .placed-heading {
            font-size: 58px;
            line-height: 56px;
          }
        }

        @media (min-width: 1024px) {
          .placed-heading {
            font-size: 76px;
            line-height: 72px;
          }
        }
      `}</style>
    </section>
  );
}

export default SimpleInfiniteCarousel;