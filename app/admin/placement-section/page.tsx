"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type PlacementSection = {
  _id: string;
  eyebrow: string;
  heading: string;
  description: string;
};

export default function PlacementSectionAdminPage() {
  const [section, setSection] = useState<PlacementSection | null>(null);

  const [eyebrow, setEyebrow] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSection = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminApi("/api/placement-section");

        if (!response.ok) {
          throw new Error("Failed to load placement section");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Placement section data not found");
        }

        const data = result.data;

        setSection(data);
        setEyebrow(data.eyebrow);
        setHeading(data.heading);
        setDescription(data.description);
      } catch (err) {
        console.error("Failed to load placement section:", err);
        setError("Failed to load placement section.");
      } finally {
        setLoading(false);
      }
    };

    loadSection();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!section) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await adminApi(
        `/api/placement-section/${section._id}`,
        {
          method: "PUT",
          requiresAuth: true,
          body: JSON.stringify({
            eyebrow,
            heading,
            description,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update placement section"
        );
      }

      setSection(result.data);

      setEyebrow(result.data.eyebrow);
      setHeading(result.data.heading);
      setDescription(result.data.description);

      setMessage("Placement section updated successfully.");
    } catch (err) {
      console.error("Failed to update placement section:", err);
      setError("Failed to update placement section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading placement section...</p>
      </div>
    );
  }

  if (error && !section) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[3px] text-yellow-600">
          Website Content
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Placement Section
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Manage the text content displayed in the Real Jobs. Real Money.
          section of the website.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EYEBROW */}
          <div>
            <label
              htmlFor="eyebrow"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Eyebrow Text
            </label>

            <input
              id="eyebrow"
              type="text"
              value={eyebrow}
              onChange={(event) => setEyebrow(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              placeholder="★ FIRST REAL PLACEMENT CERTIFICATE"
              required
            />

            <p className="mt-2 text-xs text-gray-400">
              Small text displayed above the main heading.
            </p>
          </div>

          {/* HEADING */}
          <div>
            <label
              htmlFor="heading"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Main Heading
            </label>

            <textarea
              id="heading"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              placeholder={"REAL JOBS.\nREAL MONEY."}
              required
            />

            <p className="mt-2 text-xs text-gray-400">
              You can use a new line between the two heading lines.
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              placeholder="Numbers from Cohort 1 and 2..."
              required
            />

            <p className="mt-2 text-xs text-gray-400">
              Description displayed below the main heading.
            </p>
          </div>

          {/* MESSAGES */}
          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* SAVE */}
          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#FFC62A] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#eeb51c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}