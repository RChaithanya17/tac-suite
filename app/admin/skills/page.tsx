"use client";
import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
interface Skill {
  _id: string;
  id: string;
  title: string;
  desc: string;
  icon: string;
  tags: string[];
  stat: string;
  createdAt: string;
  updatedAt: string;
}
interface SkillForm {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tags: string;
  stat: string;
}
const emptyForm: SkillForm = {
  id: "",
  title: "",
  desc: "",
  icon: "Video",
  tags: "",
  stat: "",
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
        desc: form.desc.trim(),
        icon: form.icon,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        stat: form.stat.trim(),
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
      desc: skill.desc,
      icon: skill.icon,
      tags: skill.tags.join(", "),
      stat: skill.stat,
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
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Separate tags with commas.
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
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
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
