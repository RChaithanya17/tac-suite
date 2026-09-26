"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

type Industry = {
  _id: string;
  id: string;
  title: string;
  image: string;
  order: number;
};

type IndustryForm = {
  id: string;
  title: string;
  image: string;
  order: string;
};

const emptyForm: IndustryForm = {
  id: "",
  title: "",
  image: "",
  order: "",
};

export default function IndustriesAdminPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IndustryForm>(emptyForm);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/industries");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch industries");
      }

      setIndustries(result.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load industries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      id: String(industries.length + 1).padStart(2, "0"),
      order: String(industries.length + 1),
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (industry: Industry) => {
    setEditingId(industry._id);

    setForm({
      id: industry.id,
      title: industry.title,
      image: industry.image,
      order: String(industry.order),
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.id.trim() || !form.title.trim() || !form.image.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    const order = Number(form.order);

    if (!Number.isFinite(order) || order < 1) {
      setError("Order must be a valid number.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        id: form.id.trim(),
        title: form.title.trim(),
        image: form.image.trim(),
        order,
      };

      const response = editingId
        ? await adminApi(`/api/industries/${editingId}`, {
            method: "PUT",
            requiresAuth: true,
            body: JSON.stringify(payload),
          })
        : await adminApi("/api/industries", {
            method: "POST",
            requiresAuth: true,
            body: JSON.stringify(payload),
          });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save industry");
      }

      await fetchIndustries();

      setSuccess(
        editingId
          ? "Industry updated successfully."
          : "Industry added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save industry.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (industry: Industry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${industry.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await adminApi(
        `/api/industries/${industry._id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete industry");
      }

      await fetchIndustries();

      setSuccess("Industry deleted successfully.");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete industry.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-[#FFC62A]">
              TAC CMS
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#171717]">
              Industries
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the industries displayed on the website.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
          >
            <Plus size={18} />
            Add Industry
          </button>
        </div>

        {/* STATUS */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#171717]">
                  {editingId ? "Edit Industry" : "Add Industry"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the industry information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                {/* ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    ID
                  </label>

                  <input
                    type="text"
                    value={form.id}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        id: event.target.value,
                      }))
                    }
                    placeholder="01"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                  />
                </div>

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Title
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Food & Beverage"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                  />
                </div>

                {/* IMAGE */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Image Path
                  </label>

                  <input
                    type="text"
                    value={form.image}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        image: event.target.value,
                      }))
                    }
                    placeholder="/industries/01.webp"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Example: /industries/01.webp
                  </p>
                </div>

                {/* ORDER */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        order: event.target.value,
                      }))
                    }
                    placeholder="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FFC62A] px-5 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#eab41f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Industry"
                      : "Save Industry"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* INDUSTRIES */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#171717]">
                  Industry List
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {industries.length} industries currently in the CMS.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Loading industries...
            </div>
          ) : industries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                No industries found.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-4 rounded-lg bg-[#171717] px-4 py-2 text-sm font-semibold text-white"
              >
                Add First Industry
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {industries.map((industry) => (
                <div
                  key={industry._id}
                  className="flex flex-col gap-5 px-6 py-5 transition hover:bg-gray-50 md:flex-row md:items-center"
                >
                  {/* IMAGE */}
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#111]">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FFC62A]/15 px-2.5 py-1 text-xs font-bold text-[#9a7200]">
                        #{industry.order}
                      </span>

                      <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-400">
                        {industry.id}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#171717]">
                      {industry.title}
                    </h3>

                    <p className="mt-1 break-all text-xs text-gray-400">
                      {industry.image}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(industry)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#FFC62A] hover:bg-[#FFC62A]/10"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(industry)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}