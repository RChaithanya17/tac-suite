"use client";

import { useEffect, useState } from "react";
import { courses as fallbackCourses } from "@/data/courses";

const API_BASE_URL = "http://localhost:5000";

type CourseFromAPI = {
  _id?: string;
  title?: string;
  name?: string;
};

export function CourseSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [courseList, setCourseList] = useState<string[]>(
    fallbackCourses
  );

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/courses`
        );

        if (!response.ok) {
          throw new Error("Failed to load courses");
        }

        const result = await response.json();

        if (!isMounted) {
          return;
        }

        const apiCourses: CourseFromAPI[] = result.data ?? [];

        const titles = apiCourses
          .map((course) => course.title ?? course.name ?? "")
          .filter(Boolean);

        if (titles.length > 0) {
          setCourseList(titles);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full overflow-hidden border-y border-[#FFC62A]/10 bg-[#1A1A1A]">
      <div className="relative flex">
        {/* TRACK */}
        <div
          className="flex whitespace-nowrap animate-marquee"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...courseList, ...courseList].map((course, i) => (
            <div
              key={`${course}-${i}`}
              className="flex items-center gap-3 px-8 py-4 text-[11px] font-mono uppercase tracking-[3px] text-[#FFF9E6]/60"
            >
              {/* DOT */}
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFC62A]" />

              {/* TEXT */}
              {course}
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}