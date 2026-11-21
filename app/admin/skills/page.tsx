"use client";
import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
interface Skill {
  _id: string;
  id: string;
  title: string;
  subtitle?: string;
  desc: string;
  icon: string;
  tags: string[];
  stat: string;
  track?: string;
  lessons?: string[];
  aiLesson?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
interface SkillForm {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  tags: string;
  stat: string;
  track: string;
  lessons: string;
  aiLesson: string;
  order: string;
}
const emptyForm: SkillForm = {
  id: "",
  title: "",
  subtitle: "",
  desc: "",
  icon: "Video",
  tags: "",
  stat: "",
  track: "",
  lessons: "",
  aiLesson: "",
  order: "",
};
const iconOptions = [
  "Video",
  "Palette",
  "Sparkles",
  "Wand2",
  "PenTool",
  "Camera",
  "Handshake",
  "Megaphone",
  "ImagePlus",
  "Clapperboard",
  "Workflow",
  "Globe",
  "Image",
  "Braces",
  "Photoshop",
];
export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:5000/api/skills");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch skills");
      }
      setSkills(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch skills"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSkills();
  }, []);
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        id: form.id.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        desc: form.desc.trim(),
        icon: form.icon,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        stat: form.stat.trim(),
        track: form.track.trim(),
        lessons: form.lessons
          .split("\n")
          .map((lesson) => lesson.trim())
          .filter(Boolean),
        aiLesson: form.aiLesson.trim(),
        order: Number(form.order) || 0,
      };
      const endpoint = editingId
        ? `/api/skills/${editingId}`
        : "/api/skills";
      const method = editingId ? "PUT" : "POST";
      const response = await adminApi(endpoint, {
        method,
        requiresAuth: true,
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save skill");
      }
      setSuccess(
        editingId
          ? "Skill updated successfully."
          : "Skill added successfully."
      );
      resetForm();
      await fetchSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save skill"
      );
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = (skill: Skill) => {
    setEditingId(skill._id);
    setForm({
      id: skill.id,
      title: skill.title,
      subtitle: skill.subtitle ?? "",
      desc: skill.desc,
      icon: skill.icon,
      tags: skill.tags.join(", "),
      stat: skill.stat,
      track: skill.track ?? "",
      lessons: (skill.lessons ?? []).join("\n"),
      aiLesson: skill.aiLesson ?? "",
      order: String(skill.order ?? ""),
    });
    setError("");
    setSuccess("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );
    if (!confirmed) {
      return;
    }
    try {
      setError("");
      setSuccess("");
      const response = await adminApi(`/api/skills/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete skill");
      }
      setSuccess("Skill deleted successfully.");
      if (editingId === id) {
        resetForm();
      }
      await fetchSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete skill"
      );
    }
  };
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage the skills displayed on the website.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Skill" : "Add Skill"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the skill information."
                  : "Add a new skill to the website."}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="skill-id"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Skill ID
                </label>
                <input
                  id="skill-id"
                  type="text"
                  value={form.id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      id: event.target.value,
                    })
                  }
                  placeholder="01"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label
                  htmlFor="skill-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="skill-title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="Video Editing"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label
                  htmlFor="skill-subtitle"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Subtitle (optional)
                </label>
                <input
                  id="skill-subtitle"
                  type="text"
                  value={form.subtitle}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      subtitle: event.target.value,
                    })
                  }
                  placeholder="After Effects"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Software name shown under the heading.
                </p>
              </div>
              <div>
                <label
                  htmlFor="skill-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="skill-description"
                  value={form.desc}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      desc: event.target.value,
                    })
                  }
                  placeholder="Premiere Pro, narrative cuts, reels."
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label
                  htmlFor="skill-icon"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Icon
                </label>
                <select
                  id="skill-icon"
                  value={form.icon}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      icon: event.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="skill-tags"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tags
                </label>
                <input
                  id="skill-tags"
                  type="text"
                  value={form.tags}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      tags: event.target.value,
                    })
                  }
                  placeholder="Premiere, Reels, Cuts"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Separate tags with commas. Leave blank for no tags.
                </p>
              </div>
              <div>
                <label
                  htmlFor="skill-stat"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Stat
                </label>
                <input
                  id="skill-stat"
                  type="text"
                  value={form.stat}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      stat: event.target.value,
                    })
                  }
                  placeholder="Short-form mastery"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label
                  htmlFor="skill-track"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Module Track
                </label>
                <input
                  id="skill-track"
                  type="text"
                  value={form.track}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      track: event.target.value,
                    })
                  }
                  placeholder="Photoshop + AI"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label
                  htmlFor="skill-lessons"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Lessons
                </label>
                <textarea
                  id="skill-lessons"
                  rows={6}
                  value={form.lessons}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      lessons: event.target.value,
                    })
                  }
                  placeholder={"Movie / OTT Poster Design\nSocial Media Design"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-y"
                />
                <p className="mt-2 text-xs text-gray-500">
                  One lesson per line. Text after a middle dot ( · ) shows as a muted note. Leave blank to keep the simple card layout.
                </p>
              </div>
              <div>
                <label
                  htmlFor="skill-ai-lesson"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  AI Lesson
                </label>
                <input
                  id="skill-ai-lesson"
                  type="text"
                  value={form.aiLesson}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      aiLesson: event.target.value,
                    })
                  }
                  placeholder="Firefly · Generative Fill & Expand"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Shown after the lessons with an AI badge.
                </p>
              </div>
              <div>
                <label
                  htmlFor="skill-order"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Display Order
                </label>
                <input
                  id="skill-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      order: event.target.value,
                    })
                  }
                  placeholder="1"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Lower numbers appear first on the website.
                </p>
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Skill"
                      : "Add Skill"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                All Skills
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {skills.length} skill{skills.length === 1 ? "" : "s"}
              </p>
            </div>
            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-gray-500">
                  Loading skills...
                </p>
              </div>
            ) : skills.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">
                  No skills found.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {skill.id}
                      </span>
                      <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                        {skill.icon}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {skill.title}
                    </h3>
                    {skill.subtitle && (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                        {skill.subtitle}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {skill.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-700">
                      {skill.stat}
                    </p>
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(skill)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(skill._id)}
                        className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
