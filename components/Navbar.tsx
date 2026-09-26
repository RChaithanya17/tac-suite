"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  initialLeadFormData,
  submitLeadForm,
  type LeadFormData,
} from "@/lib/leadForm";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  type NavigationLink = {
  label: string;
  href: string;
};

type NavbarData = {
  announcement: string;
  navigationLinks: NavigationLink[];
};

const [navbarData, setNavbarData] = useState<NavbarData>({
  announcement: "BATCH 10 • ENROLLMENTS OPEN",
  navigationLinks: [],
});

  const [formData, setFormData] =
    useState<LeadFormData>(initialLeadFormData);

  // Scroll states
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
  let isMounted = true;

  const loadNavbar = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/navbar"
      );

      if (!response.ok) {
        throw new Error("Failed to load navbar");
      }

      const result = await response.json();

      if (!isMounted || !result.data) return;

      setNavbarData({
        announcement:
          result.data.announcement ??
          "BATCH 10 • ENROLLMENTS OPEN",
        navigationLinks:
          result.data.navigationLinks ?? [],
      });
    } catch (error) {
      console.error("Failed to load navbar:", error);
    }
  };

  loadNavbar();

  return () => {
    isMounted = false;
  };
}, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
        setIsCompact(false);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > 200
      ) {
        setIsVisible(false);
        setMobileOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        setIsCompact(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Lock body scroll when modal or mobile menu is open
  useEffect(() => {
    if (open || mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileOpen(false);

    const hash = href.replace("/#", "");
    const el = document.getElementById(hash);

    if (el) {
      e.preventDefault();

      const navHeight = isCompact ? 65 : 85;

      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        navHeight -
        16;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
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
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="fixed top-0 left-0 w-full z-50"
      >
        <motion.nav
          animate={{
            height: isCompact ? 65 : 85,
            backgroundColor: isCompact
              ? "rgba(15, 17, 19, 0.98)"
              : "rgba(15, 17, 19, 0.94)",
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="relative w-full backdrop-blur-xl border-b border-white/10 flex flex-col"
        >
          {/* ===================================================== */}
          {/* SMALL BATCH ANNOUNCEMENT */}
          {/* ===================================================== */}

          <div className="h-6 w-full shrink-0 flex items-center justify-center bg-[#FFC62A] px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D1D1D]" />

              <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-[1.8px] uppercase text-[#1D1D1D]">
               {navbarData.announcement}
              </span>
            </div>
          </div>

          {/* ===================================================== */}
          {/* NAV CONTENT */}
          {/* ===================================================== */}

          <div className="flex-1 flex items-center">
            <div className="w-full px-6 lg:px-8 flex items-center justify-between">
              {/* ================================================= */}
              {/* LOGO */}
              {/* ================================================= */}

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="flex items-center gap-3 text-white transition-all duration-300"
              >
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={160}
                  height={40}
                  className={`object-contain ${
                    isCompact ? "h-8" : "h-10"
                  }`}
                />
              </button>

              {/* ================================================= */}
              {/* RIGHT SIDE */}
              {/* ================================================= */}

              <div className="flex items-center gap-6 lg:gap-10">
                {/* =============================================== */}
                {/* DESKTOP LINKS */}
                {/* =============================================== */}

                <div className="hidden lg:flex items-center gap-10 text-[11px] tracking-[3px] uppercase text-white/70 font-bold">
                  {navbarData.navigationLinks.map(
                    ({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        onClick={(e) =>
                          handleNavClick(e, href)
                        }
                        className="hover:text-[#FFC62A] transition-colors duration-200"
                      >
                        {label}
                      </a>
                    )
                  )}
                </div>

                {/* =============================================== */}
                {/* APPLY BUTTON */}
                {/* =============================================== */}

                <button
                  onClick={() => setOpen(true)}
                  className={`hidden md:block bg-[#FFC62A] text-black font-black tracking-[2px] rounded-sm hover:bg-[#FFE8A3] active:scale-95 transition-all duration-200 ${
                    isCompact
                      ? "px-5 py-2 text-[10px]"
                      : "px-8 py-3 text-[11px]"
                  }`}
                >
                  APPLY NOW
                </button>

                {/* =============================================== */}
                {/* HAMBURGER */}
                {/* =============================================== */}

                <button
                  onClick={() =>
                    setMobileOpen((v) => !v)
                  }
                  aria-label="Toggle menu"
                  className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 z-10"
                >
                  <motion.span
                    animate={
                      mobileOpen
                        ? {
                            rotate: 45,
                            y: 7,
                          }
                        : {
                            rotate: 0,
                            y: 0,
                          }
                    }
                    className="block h-[2px] w-full bg-white origin-center transition-all"
                  />

                  <motion.span
                    animate={
                      mobileOpen
                        ? { opacity: 0 }
                        : { opacity: 1 }
                    }
                    className="block h-[2px] w-full bg-white"
                  />

                  <motion.span
                    animate={
                      mobileOpen
                        ? {
                            rotate: -45,
                            y: -7,
                          }
                        : {
                            rotate: 0,
                            y: 0,
                          }
                    }
                    className="block h-[2px] w-full bg-white origin-center"
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.nav>
      </motion.header>

      {/* ========================================================= */}
      {/* MOBILE MENU */}
      {/* ========================================================= */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.25,
            }}
            className={`fixed left-0 w-full z-40 bg-[#0F1113]/95 backdrop-blur-xl border-b border-white/10 flex flex-col items-center gap-0 lg:hidden transition-all duration-300 ${
              isCompact
                ? "top-[65px]"
                : "top-[85px]"
            }`}
          >
            {navbarData.navigationLinks.map(
              ({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={(e) =>
                    handleNavClick(e, href)
                  }
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.06,
                  }}
                  className="w-full text-center py-5 text-[12px] tracking-[3px] uppercase font-bold text-white/90 hover:text-[#FFC62A] hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  {label}
                </motion.a>
              )
            )}

            <div className="py-6">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setOpen(true);
                }}
                className="bg-[#FFC62A] text-black font-black text-[11px] tracking-[2px] px-10 py-3 rounded-sm hover:bg-[#FFE8A3] active:scale-95 transition-all"
              >
                APPLY NOW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* APPLY MODAL */}
      {/* ========================================================= */}

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
              {/* CLOSE */}

              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="absolute top-4 right-4 text-black/40 hover:text-black text-xl leading-none transition-colors"
              >
                ✕
              </button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ================================================= */
                  /* SUCCESS */
                  /* ================================================= */

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
                      Application received!
                      We&apos;ll reach out shortly.
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
                  /* ================================================= */
                  /* FORM */
                  /* ================================================= */

                  <motion.div
                    key="form"
                    initial={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <h2 className="text-2xl font-black mb-1 tracking-wide">
                      APPLY NOW
                    </h2>

                    <p className="text-xs text-black/50 mb-6 tracking-wide uppercase">
                      Fill in your details to get
                      started
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                    >
                      {/* NAME */}

                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="modal-input"
                      />

                      {/* EMAIL */}

                      <input
                        required
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="modal-input"
                      />

                      {/* PHONE */}

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

                      {/* AGE + QUALIFICATION */}

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

                      {/* SUBMIT */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="relative bg-[#1D1D1D] text-white py-4 text-sm font-bold tracking-[2px] uppercase mt-2 hover:bg-black transition-all active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <AnimatePresence mode="wait">
                          {loading ? (
                            <motion.span
                              key="loading"
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                              }}
                              exit={{
                                opacity: 0,
                              }}
                              className="flex items-center justify-center gap-2"
                            >
                              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                              Submitting...
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                              }}
                              exit={{
                                opacity: 0,
                              }}
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

      {/* ========================================================= */}
      {/* MODAL INPUT STYLES */}
      {/* ========================================================= */}

      <style jsx>{`
        .modal-input {
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
          border-radius: 2px;
          width: 100%;
        }

        .modal-input:focus {
          border-color: #ffc62a;
          box-shadow:
            0 0 0 3px
            rgba(255, 198, 42, 0.15);
        }

        .modal-input::placeholder {
          color: rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </>
  );
}