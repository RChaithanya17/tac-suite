"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type Sector = {
  count: string;
  label: string;
  color: string;
};

type WhoGetsPlacedData = {
  eyebrow: string;
  heading: string;
  movieLabel: string;
  logo: string;
  logoAlt: string;
  movieParagraphs: string[];
  sectorsEyebrow: string;
  companiesHeading: string;
  sectors: Sector[];
  callout: string;
};

type TextField = Exclude<
  keyof WhoGetsPlacedData,
  "movieParagraphs" | "sectors"
>;

const emptyContent: WhoGetsPlacedData = {
  eyebrow: "",
  heading: "",
  movieLabel: "",
  logo: "",
  logoAlt: "",
  movieParagraphs: [""],
  sectorsEyebrow: "",
  companiesHeading: "",
  sectors: [],
  callout: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}

export default function WhoGetsPlacedAdminPage() {
  const [content, setContent] =
    useState<WhoGetsPlacedData>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminApi("/api/who-gets-placed");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load section");
        }

        if (result.data) {
          setContent({ ...emptyContent, ...result.data });
        }
      } catch (error) {
        console.error("Failed to load Who Gets Placed section:", error);
        setMessage("Failed to load the section content.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setField = (field: TextField, value: string) =>
    setContent((current) => ({ ...current, [field]: value }));

  const setParagraph = (index: number, value: string) =>
    setContent((current) => ({
      ...current,
      movieParagraphs: current.movieParagraphs.map((p, i) =>
        i === index ? value : p
      ),
    }));

  const addParagraph = () =>
    setContent((current) => ({
      ...current,
      movieParagraphs: [...current.movieParagraphs, ""],
    }));

  const removeParagraph = (index: number) =>
    setContent((current) => ({
      ...current,
      movieParagraphs: current.movieParagraphs.filter((_, i) => i !== index),
    }));

  const setSector = (index: number, field: keyof Sector, value: string) =>
    setContent((current) => ({
      ...current,
      sectors: current.sectors.map((sector, i) =>
        i === index ? { ...sector, [field]: value } : sector
      ),
    }));

  const addSector = () =>
    setContent((current) => ({
      ...current,
      sectors: [...current.sectors, { count: "", label: "", color: "#FE5517" }],
    }));

  const removeSector = (index: number) =>
    setContent((current) => ({
      ...current,
      sectors: current.sectors.filter((_, i) => i !== index),
    }));

  const moveSector = (index: number, direction: -1 | 1) =>
    setContent((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.sectors.length) return current;
      const sectors = [...current.sectors];
      [sectors[index], sectors[target]] = [sectors[target], sectors[index]];
      return { ...current, sectors };
    });

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const payload: WhoGetsPlacedData = {
        eyebrow: content.eyebrow.trim(),
        heading: content.heading.trim(),
        movieLabel: content.movieLabel.trim(),
        logo: content.logo.trim(),
        logoAlt: content.logoAlt.trim(),
        movieParagraphs: content.movieParagraphs
          .map((p) => p.trim())
          .filter(Boolean),
        sectorsEyebrow: content.sectorsEyebrow.trim(),
        companiesHeading: content.companiesHeading.trim(),
        sectors: content.sectors
          .map((s) => ({
            count: s.count.trim(),
            label: s.label.trim(),
            color: s.color.trim() || "#FE5517",
          }))
          .filter((s) => s.count && s.label),
        callout: content.callout.trim(),
      };

      const required: [string, string][] = [
        ["Eyebrow", payload.eyebrow],
        ["Heading", payload.heading],
        ["Movie card label", payload.movieLabel],
        ["Sectors eyebrow", payload.sectorsEyebrow],
        ["Companies heading", payload.companiesHeading],
      ];
      const missing = required.filter(([, value]) => !value);
      if (missing.length) {
        throw new Error(
          `Please fill in: ${missing.map(([name]) => name).join(", ")}.`
        );
      }

      const response = await adminApi("/api/who-gets-placed", {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save section");
      }

      setContent({ ...emptyContent, ...result.data });
      setMessage("Section updated successfully.");
    } catch (error) {
      console.error("Failed to save Who Gets Placed section:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to save section."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading section...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Who Gets Placed
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the &quot;Who gets placed - and where?&quot; section shown
          after Real Jobs. Real Money. on the website. Wrap words in
          **double asterisks** to show them in bold.
        </p>
      </div>

      <div className="max-w-5xl space-y-6">
        {/* Heading */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Heading
          </h2>

          <div className="space-y-5">
            <Field label="Eyebrow" hint="Small orange text above the heading.">
              <input
                type="text"
                value={content.eyebrow}
                onChange={(e) => setField("eyebrow", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Heading">
              <input
                type="text"
                value={content.heading}
                onChange={(e) => setField("heading", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Movie industry card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Dark Card (Movie Industry)
          </h2>

          <div className="space-y-5">
            <Field label="Card Label">
              <input
                type="text"
                value={content.movieLabel}
                onChange={(e) => setField("movieLabel", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-start">
              <Field
                label="Logo Path"
                hint="Image in the public folder, e.g. /companies/logo.webp. Leave blank to hide the logo."
              >
                <input
                  type="text"
                  value={content.logo}
                  placeholder="/companies/logo.webp"
                  onChange={(e) => setField("logo", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Logo Alt Text" hint="Company name, for accessibility.">
                <input
                  type="text"
                  value={content.logoAlt}
                  onChange={(e) => setField("logoAlt", e.target.value)}
                  className={inputClass}
                />
              </Field>

              {content.logo ? (
                <div className="flex h-20.5 w-36 items-center justify-center rounded-lg border border-gray-200 bg-white p-2 md:mt-7">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.logo}
                    alt={content.logoAlt || "Logo preview"}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : null}
            </div>

            <div>
              <label className={labelClass}>Paragraphs</label>

              <div className="space-y-3">
                {content.movieParagraphs.map((paragraph, index) => (
                  <div key={index} className="flex gap-3">
                    <textarea
                      value={paragraph}
                      onChange={(e) => setParagraph(index, e.target.value)}
                      rows={2}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="h-fit rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Example: Posters for **Netflix** and **Warner Bros.** projects.
              </p>

              <button
                type="button"
                onClick={addParagraph}
                className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black"
              >
                + Add Paragraph
              </button>
            </div>
          </div>
        </div>

        {/* Sectors card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            White Card (Companies &amp; Sectors)
          </h2>

          <div className="space-y-5">
            <Field label="Card Eyebrow">
              <input
                type="text"
                value={content.sectorsEyebrow}
                onChange={(e) => setField("sectorsEyebrow", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Big Heading" hint='For example "40+ companies".'>
              <input
                type="text"
                value={content.companiesHeading}
                onChange={(e) => setField("companiesHeading", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div>
              <label className={labelClass}>Sectors</label>

              <div className="space-y-3">
                {content.sectors.map((sector, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto_5rem_1fr] items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:grid-cols-[auto_5rem_1fr_auto]"
                  >
                    <input
                      type="color"
                      value={sector.color}
                      onChange={(e) => setSector(index, "color", e.target.value)}
                      aria-label="Dot colour"
                      className="h-10 w-10 cursor-pointer rounded border border-gray-300 bg-white p-0.5"
                    />
                    <input
                      type="text"
                      value={sector.count}
                      placeholder="15"
                      onChange={(e) => setSector(index, "count", e.target.value)}
                      aria-label="Number"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={sector.label}
                      placeholder="Media, creative and marketing"
                      onChange={(e) => setSector(index, "label", e.target.value)}
                      aria-label="Sector name"
                      className={inputClass}
                    />
                    <div className="col-span-3 flex gap-2 md:col-span-1">
                      <button
                        type="button"
                        onClick={() => moveSector(index, -1)}
                        disabled={index === 0}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-black disabled:opacity-40"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSector(index, 1)}
                        disabled={index === content.sectors.length - 1}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-black disabled:opacity-40"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSector(index)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSector}
                className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black"
              >
                + Add Sector
              </button>
            </div>
          </div>
        </div>

        {/* Callout */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Orange Banner
          </h2>

          <Field label="Banner Text" hint="Leave blank to hide the banner.">
            <input
              type="text"
              value={content.callout}
              onChange={(e) => setField("callout", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between">
          {message ? (
            <p className="text-sm text-gray-600">{message}</p>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
