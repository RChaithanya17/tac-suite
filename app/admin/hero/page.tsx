"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type HeroStripItem = {
  label: string;
  color: string;
  icon: string;
  order: number;
};

type HeroStat = {
  val: string;
  label: string;
  order: number;
};

type HeroData = {
  _id: string;
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

const emptyHero: HeroData = {
  _id: "",
  eyebrow: "",
  heading: "",
  highlight: "",
  outlineText: "",
  description: "",
  ctaText: "",
  videoUrl: "",
  topStripItems: [],
  bottomStripItems: [],
  stats: [],
};

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData>(emptyHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hero");

        const result = await response.json();

        if (!response.ok || !result.data) {
          throw new Error(result.message || "Failed to load Hero");
        }

        setHero(result.data);
      } catch (error) {
        console.error("Failed to load Hero:", error);
        setMessage("Failed to load Hero content.");
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  const updateField = (
    field: keyof Omit<
      HeroData,
      "topStripItems" | "bottomStripItems" | "stats"
    >,
    value: string
  ) => {
    setHero((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateStat = (
    index: number,
    field: keyof HeroStat,
    value: string
  ) => {
    setHero((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index
          ? {
              ...stat,
              [field]:
                field === "order" ? Number(value) : value,
            }
          : stat
      ),
    }));
  };

  const updateStripItem = (
    section: "topStripItems" | "bottomStripItems",
    index: number,
    field: keyof HeroStripItem,
    value: string
  ) => {
    setHero((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "order" ? Number(value) : value,
            }
          : item
      ),
    }));
  };

  const addStat = () => {
    setHero((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          val: "",
          label: "",
          order: prev.stats.length + 1,
        },
      ],
    }));
  };

  const removeStat = (index: number) => {
    setHero((prev) => ({
      ...prev,
      stats: prev.stats
        .filter((_, i) => i !== index)
        .map((stat, i) => ({
          ...stat,
          order: i + 1,
        })),
    }));
  };

  const addStripItem = (
    section: "topStripItems" | "bottomStripItems"
  ) => {
    setHero((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          label: "",
          color: "#FFC62A",
          icon: "◈",
          order: prev[section].length + 1,
        },
      ],
    }));
  };

  const removeStripItem = (
    section: "topStripItems" | "bottomStripItems",
    index: number
  ) => {
    setHero((prev) => ({
      ...prev,
      [section]: prev[section]
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          order: i + 1,
        })),
    }));
  };

  const handleSave = async () => {
    if (!hero._id) {
      setMessage("Hero ID is missing.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await adminApi(`/api/hero/${hero._id}`, {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify({
          eyebrow: hero.eyebrow,
          heading: hero.heading,
          highlight: hero.highlight,
          outlineText: hero.outlineText,
          description: hero.description,
          ctaText: hero.ctaText,
          videoUrl: hero.videoUrl,
          topStripItems: hero.topStripItems,
          bottomStripItems: hero.bottomStripItems,
          stats: hero.stats,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save Hero");
      }

      setHero(result.data);
      setMessage("Hero content saved successfully.");
    } catch (error) {
      console.error("Save Hero error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save Hero content."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 text-[#1D1D1D]">
        <p className="text-sm font-medium text-black/50">
          Loading Hero content...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 text-[#1D1D1D] md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px] text-[#FFC62A]">
              TAC CMS
            </p>

            <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              Hero
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/50">
              Manage the content displayed in the main TAC website Hero
              section.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#1D1D1D] px-6 py-3 text-xs font-bold uppercase tracking-[2px] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Hero"}
          </button>
        </div>

        {/* STATUS */}
        {message && (
          <div
            className={`mb-6 rounded-md border px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* MAIN HERO CONTENT */}
        <section className="mb-8 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-black uppercase">
              Main Content
            </h2>

            <p className="mt-1 text-xs text-black/40">
              These fields control the main text and CTA in the Hero.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Eyebrow"
              value={hero.eyebrow}
              onChange={(value) =>
                updateField("eyebrow", value)
              }
            />

            <Field
              label="Heading"
              value={hero.heading}
              onChange={(value) =>
                updateField("heading", value)
              }
            />

            <Field
              label="Highlight"
              value={hero.highlight}
              onChange={(value) =>
                updateField("highlight", value)
              }
            />

            <Field
              label="Outline Text"
              value={hero.outlineText}
              onChange={(value) =>
                updateField("outlineText", value)
              }
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[2px] text-black/50">
                Description
              </label>

              <textarea
                value={hero.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                rows={4}
                className="w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/15"
              />
            </div>

            <Field
              label="CTA Text"
              value={hero.ctaText}
              onChange={(value) =>
                updateField("ctaText", value)
              }
            />

            <Field
              label="YouTube Video URL"
              value={hero.videoUrl}
              onChange={(value) =>
                updateField("videoUrl", value)
              }
            />
          </div>
        </section>

        {/* STATS */}
        <section className="mb-8 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase">
                Hero Stats
              </h2>

              <p className="mt-1 text-xs text-black/40">
                Manage the statistics shown below the CTA.
              </p>
            </div>

            <button
              type="button"
              onClick={addStat}
              className="rounded-md border border-black/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[1.5px] transition hover:border-[#FFC62A] hover:bg-[#FFC62A]/10"
            >
              + Add Stat
            </button>
          </div>

          <div className="space-y-4">
            {hero.stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg border border-black/10 bg-[#FBF8E4]/40 p-4"
              >
                <div className="grid gap-4 md:grid-cols-[120px_1fr_100px_auto]">
                  <Field
                    label="Value"
                    value={stat.val}
                    onChange={(value) =>
                      updateStat(index, "val", value)
                    }
                  />

                  <Field
                    label="Label"
                    value={stat.label}
                    onChange={(value) =>
                      updateStat(index, "label", value)
                    }
                  />

                  <Field
                    label="Order"
                    type="number"
                    value={String(stat.order)}
                    onChange={(value) =>
                      updateStat(index, "order", value)
                    }
                  />

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="w-full rounded-md border border-red-200 px-4 py-3 text-[10px] font-bold uppercase tracking-[1px] text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {hero.stats.length === 0 && (
              <EmptyMessage text="No Hero stats added." />
            )}
          </div>
        </section>

        {/* TOP STRIP */}
        <StripSection
          title="Top Scrolling Strip"
          description="Items displayed in the upper scrolling strip."
          items={hero.topStripItems}
          onAdd={() => addStripItem("topStripItems")}
          onUpdate={(index, field, value) =>
            updateStripItem(
              "topStripItems",
              index,
              field,
              value
            )
          }
          onRemove={(index) =>
            removeStripItem("topStripItems", index)
          }
        />

        {/* BOTTOM STRIP */}
        <StripSection
          title="Bottom Scrolling Strip"
          description="Items displayed in the lower scrolling strip."
          items={hero.bottomStripItems}
          onAdd={() => addStripItem("bottomStripItems")}
          onUpdate={(index, field, value) =>
            updateStripItem(
              "bottomStripItems",
              index,
              field,
              value
            )
          }
          onRemove={(index) =>
            removeStripItem("bottomStripItems", index)
          }
        />

        {/* BOTTOM SAVE */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#1D1D1D] px-8 py-4 text-xs font-bold uppercase tracking-[2px] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Hero"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[2px] text-black/50">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/15"
      />
    </div>
  );
}

/* ───────────────────────────────────────────── */

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-black/10 px-5 py-8 text-center text-sm text-black/40">
      {text}
    </div>
  );
}

/* ───────────────────────────────────────────── */

function StripSection({
  title,
  description,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  description: string;
  items: HeroStripItem[];
  onAdd: () => void;
  onUpdate: (
    index: number,
    field: keyof HeroStripItem,
    value: string
  ) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="mb-8 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black uppercase">
            {title}
          </h2>

          <p className="mt-1 text-xs text-black/40">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-md border border-black/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[1.5px] transition hover:border-[#FFC62A] hover:bg-[#FFC62A]/10"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-black/10 bg-[#FBF8E4]/40 p-4"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_150px_100px_80px_auto]">
              <Field
                label="Label"
                value={item.label}
                onChange={(value) =>
                  onUpdate(index, "label", value)
                }
              />

              <Field
                label="Color"
                value={item.color}
                onChange={(value) =>
                  onUpdate(index, "color", value)
                }
              />

              <Field
                label="Icon"
                value={item.icon}
                onChange={(value) =>
                  onUpdate(index, "icon", value)
                }
              />

              <Field
                label="Order"
                type="number"
                value={String(item.order)}
                onChange={(value) =>
                  onUpdate(index, "order", value)
                }
              />

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="w-full rounded-md border border-red-200 px-3 py-3 text-[10px] font-bold uppercase tracking-[1px] text-red-500 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* PREVIEW */}
            <div className="mt-4 flex items-center gap-3 border-t border-black/5 pt-3">
              <span
                className="text-lg"
                style={{ color: item.color }}
              >
                {item.icon}
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[2px] text-black/50">
                {item.label || "Untitled Item"}
              </span>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <EmptyMessage text="No strip items added." />
        )}
      </div>
    </section>
  );
}