"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tutors as staticTutors } from "@/data/tutors";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

type Tutor = {
  _id?: string;
  image: string;
};

const API_BASE_URL = "http://localhost:5000";

export default function TutorsSection() {
  const [tutorList, setTutorList] = useState<Tutor[]>(staticTutors);
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch tutors from the backend
  useEffect(() => {
    let cancelled = false;

    const fetchTutors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tutors`);

        if (!response.ok) {
          throw new Error("Failed to fetch tutors");
        }

        const result = await response.json();

        if (
          !cancelled &&
          result.success &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setTutorList(result.data);
          setIndex(0);
        }
      } catch (error) {
        console.error("Failed to load tutors from backend:", error);
        // Keep the existing static tutors as fallback.
      }
    };

    fetchTutors();

    return () => {
      cancelled = true;
    };
  }, []);

  const next = () => {
    if (tutorList.length === 0) return;

    setIndex((prev) => (prev + 1) % tutorList.length);
  };

  const prev = () => {
    if (tutorList.length === 0) return;

    setIndex(
      (prev) => (prev - 1 + tutorList.length) % tutorList.length
    );
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isHovering || tutorList.length <= 1) return;

    const interval = setInterval(next, 3800);

    return () => clearInterval(interval);
  }, [index, isHovering, tutorList.length]);

  const getStyles = (i: number) => {
    const total = tutorList.length;

    if (total === 0) {
      return {
        x: 0,
        scale: 1,
        opacity: 0,
        filter: "blur(0px)",
        zIndex: 0,
        rotateY: 0,
      };
    }

    const diff = (i - index + total) % total;

    if (diff === 0)
      return {
        x: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 10,
        rotateY: 0,
      };

    if (diff === 1)
      return {
        x: isMobile ? 150 : 460,
        scale: isMobile ? 0.72 : 0.82,
        opacity: 0.5,
        filter: "blur(4px)",
        zIndex: 5,
        rotateY: -12,
      };

    if (diff === total - 1)
      return {
        x: isMobile ? -150 : -460,
        scale: isMobile ? 0.72 : 0.82,
        opacity: 0.5,
        filter: "blur(4px)",
        zIndex: 5,
        rotateY: 12,
      };

    return {
      x: diff > 1 ? (isMobile ? 240 : 600) : isMobile ? -240 : -600,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      filter: "blur(12px)",
      rotateY: 0,
    };
  };

  return (
    <section className="w-full pt-8 pb-12 bg-[#FBF8E4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 px-4"
        >
          <h2
            className={`${bebas.className} text-[56px] sm:text-[80px] md:text-[110px] leading-[0.9] tracking-tighter uppercase text-[#1d1d1d]`}
          >
            TAC <span className="text-[#FFC62A]">Tutors</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 text-gray-500 font-medium text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Master the art of cinematic storytelling with mentorship from
            industry professionals shaping the future of content.
          </motion.p>
        </motion.div>

        {/* CAROUSEL */}
        <div
          className="relative h-[250px] sm:h-[350px] md:h-[450px] flex items-center justify-center [perspective:1200px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-50 pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto bg-white/40 backdrop-blur-md hover:bg-white text-black p-3 md:p-5 rounded-full shadow-xl transition-all duration-300 active:scale-90 border border-black/5"
            >
              <ChevronLeft size={isMobile ? 18 : 24} />
            </button>

            <button
              onClick={next}
              className="pointer-events-auto bg-white/40 backdrop-blur-md hover:bg-white text-black p-3 md:p-5 rounded-full shadow-xl transition-all duration-300 active:scale-90 border border-black/5"
            >
              <ChevronRight size={isMobile ? 18 : 24} />
            </button>
          </div>

          {/* IMAGES */}
          <div className="relative w-full h-full flex items-center justify-center">
            {tutorList.map((tutor, i) => {
              const style = getStyles(i);

              const isActive =
                (i - index + tutorList.length) % tutorList.length === 0;

              return (
                <motion.div
                  key={tutor._id ?? tutor.image}
                  animate={style}
                  transition={{
                    duration: 0.7,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="absolute cursor-pointer"
                  style={{
                    zIndex: style.zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => setIndex(i)}
                >
                  <motion.div
                    whileHover={isActive ? { y: -10 } : {}}
                    className="relative group"
                  >
                    <div className="relative w-[270px] h-[170px] sm:w-[480px] sm:h-[280px] md:w-[680px] md:h-[380px]">
                      <Image
                        src={tutor.image}
                        alt="TAC tutor"
                        fill
                        sizes="(min-width: 1024px) 680px, (min-width: 640px) 480px, 270px"
                        className={`object-cover rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 ${
                          isActive
                            ? "ring-4 md:ring-8 ring-white/50"
                            : "grayscale-[20%]"
                        }`}
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* INDICATORS */}
        <div className="flex justify-center mt-10 gap-3">
          {tutorList.map((tutor, i) => (
            <button
              key={tutor._id ?? tutor.image}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index
                  ? "bg-black w-14"
                  : "bg-black/10 w-3 hover:bg-black/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}