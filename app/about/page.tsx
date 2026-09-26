"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Bebas_Neue } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const stats = [
  { num: "2000+", label: "CREATORS BUILT" },
  { num: "95%", label: "CAREER SUCCESS RATE" },
  { num: "50+", label: "INDUSTRY CONNECTIONS" },
  { num: "6+", label: "YEARS OF EXPERIENCE" },
];

const pillars = [
  {
    title: "SKILL TO INCOME",
    desc: "We focus on turning skills into income with real-world deliverables.",
  },
  {
    title: "REAL PROJECTS",
    desc: "Work on actual projects that build your portfolio.",
  },
  {
    title: "CREATOR MINDSET",
    desc: "Learn how to create content that performs and grows..",
  },
  {
    title: "INDUSTRY SYSTEM",
    desc: "Learn workflows used by agencies and creators.",
  },
];

export default function AboutPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    qualification: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1500));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] text-[#EDEDED] font-sans pt-[120px] pb-24 px-[6%] md:px-[8%]">
        {/* HERO */}
        <section className="max-w-[900px] mb-16 md:mb-24">
          <h1 className={`${bebas.className} text-[56px] sm:text-[72px] md:text-[88px] leading-[0.95]`}>
            WE BUILD <br /> <span style={{ color: "#C9A227" }}>CREATORS</span>
          </h1>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 md:mb-28">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-8 rounded-[16px] bg-[#111] border border-white/5 text-center hover:border-[#C9A227]/30 transition duration-300"
            >
              <h3 className="text-4xl font-extrabold text-[#C9A227] mb-2">{s.num}</h3>
              <p className="text-xs text-white/50 tracking-[1px] uppercase font-medium">{s.label}</p>
            </div>
          ))}
        </section>

        {/* PILLARS */}
        <section className="mb-20 md:mb-28">
          <h2 className={`${bebas.className} text-[36px] md:text-[48px] tracking-wide mb-8`}>
            WHAT MAKES US DIFFERENT
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-[#111] p-8 rounded-[16px] border border-white/5 hover:border-[#C9A227]/30 transition duration-300"
              >
                <h3 className="text-[#C9A227] font-bold text-lg mb-3 tracking-wide">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="w-full max-w-[600px] mx-auto bg-[#111] p-6 sm:p-10 md:p-[60px] rounded-[20px] border border-white/5 shadow-2xl">
          {submitted ? (
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold mb-3">ðŸŽ‰ You&apos;re In!</h2>
              <p className="text-white/60">We&apos;ll contact you soon.</p>
            </div>
          ) : (
            <>
              <h2 className={`${bebas.className} text-[36px] md:text-[42px] tracking-wide mb-2`}>
                GET STARTED
              </h2>

              <p className="text-white/50 text-xs uppercase tracking-[2px] mb-8">
                Fill your details and begin your journey.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <input name="name" placeholder="Full Name" onChange={handleChange} required className="input" />
                <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className="input" />
                <input name="phone" placeholder="Phone Number" onChange={handleChange} required className="input" />

                <div className="flex gap-4">
                  <input name="age" type="number" placeholder="Age" onChange={handleChange} required className="input w-1/3" />
                  <input name="qualification" placeholder="Qualification" onChange={handleChange} required className="input w-2/3" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#C9A227] text-black py-4 font-bold text-sm tracking-[2px] uppercase mt-4 hover:bg-[#FFE8A3] active:scale-95 transition-all duration-200"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .input {
          padding: 12px 16px;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          outline: none;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input:focus {
          border-color: #c9a227;
        }
      `}</style>
    </>
  );
}
