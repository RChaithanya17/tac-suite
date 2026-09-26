"use client";

import { Bebas_Neue } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { challengeSteps } from "@/data/challenge";
import {
  initialLeadFormData,
  submitLeadForm,
  type LeadFormData,
} from "@/lib/leadForm";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

type ChallengeStep = {
  num: string;
  title: string;
  desc: string;
};

type ChallengeData = {
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  steps: ChallengeStep[];
};

const fallbackChallenge: ChallengeData = {
  eyebrow: "06 / The Challenge",
  heading: "₹1 LAKH\nCHALLENGE",
  description:
    "After month 12, our students hit ₹1 lakh/month. Not a promise — a system. Portfolio → Job → Freelance gigs → Repeat clients → Scale.",
  buttonText: "Join The Challenge",
  steps: challengeSteps,
};

export function ChallengeSection() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] =
    useState<LeadFormData>(initialLeadFormData);

  const [challengeData, setChallengeData] =
    useState<ChallengeData>(fallbackChallenge); 

  useEffect(() => {
  const loadChallenge = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/challenge"
      );

      if (!response.ok) {
        throw new Error("Failed to load Challenge");
      }

      const result = await response.json();

      if (result.success && result.data) {
        setChallengeData(result.data);
      }
    } catch (error) {
      console.error("Failed to load Challenge:", error);
    }
  };

  loadChallenge();
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      {/* INPUT STYLES — always mounted, never inside the conditional */}
      <style>{`
        .modal-input {
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding: 12px;
          font-size: 14px;
          background: white;
          outline: none;
          border-radius: 6px;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          display: block;
        }

        .modal-input:focus {
          border-color: #c9a227;
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
        }

        .modal-input::placeholder {
          color: rgba(0, 0, 0, 0.35);
        }
      `}</style>

      <section className="bg-[#FBF8E4] px-[6%] py-28 text-black">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-6 text-xs uppercase tracking-[5px] text-[#C9A227]">
              {challengeData.eyebrow}
            </p>

            <h2
              className={`${bebas.className} mb-6 text-[56px] uppercase leading-[52px] text-[#111] sm:text-[76px] sm:leading-[72px] md:text-[110px] md:leading-[100px]`}
              style={{
                letterSpacing: "1px",
              }}
            >
             {challengeData.heading}
            </h2>

            <p className="mb-8 max-w-md leading-relaxed text-black/60">
                 {challengeData.description}
            </p>

            <motion.button
              onClick={() => setOpen(true)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-[10px] bg-[#1D1D1D] px-8 py-4 text-sm uppercase tracking-[3px] text-white"
            >
              {/* YELLOW HOVER SWEEP */}
              <span className="absolute inset-0 translate-x-[-101%] bg-[#FFC62A] transition-transform duration-300 ease-out group-hover:translate-x-0" />

              {/* BUTTON CONTENT */}
              <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-[#1D1D1D]">
                <span>{challengeData.buttonText}</span>

                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </motion.button>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {challengeData.steps.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-[18px] border border-black/10 bg-[#FFFDF5] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#C9A227] hover:shadow-[0_10px_40px_rgba(201,162,39,0.3)]"
              >
                <p className="mb-3 text-3xl font-bold text-black/20">
                  {item.num}
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-black/60">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-999 flex items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* MODAL BOX */}
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl p-8 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FBF8E4, #f3efd9)",
            }}
          >
            {/* CLOSE */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-xl leading-none text-black/40 transition-colors hover:text-black"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-10 text-center">
                <div className="mb-3 text-4xl">🎉</div>

                <h2 className="mb-2 text-2xl font-bold">
                  You&apos;re In!
                </h2>

                <p className="mb-6 text-sm text-black/60">
                  We&apos;ll contact you shortly.
                </p>

                <button
                  onClick={closeModal}
                  className="rounded-md bg-[#1D1D1D] px-8 py-3 text-sm font-bold uppercase tracking-[2px] text-white transition-all hover:bg-black"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold tracking-wide text-black">
                  APPLY NOW
                </h2>

                <p className="mb-6 text-xs uppercase tracking-[2px] text-black/50">
                  Start your journey
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="modal-input"
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="modal-input"
                  />

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="modal-input"
                  />

                  <div className="flex gap-3">
                    <input
                      name="age"
                      type="number"
                      placeholder="Age"
                      min={15}
                      max={60}
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className="modal-input"
                      style={{ width: "33%" }}
                    />

                    <input
                      name="qualification"
                      placeholder="Qualification"
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                      className="modal-input"
                      style={{ width: "67%" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#1D1D1D] py-3 text-sm font-bold uppercase tracking-[2px] text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}