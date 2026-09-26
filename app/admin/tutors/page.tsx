"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

interface Tutor {
  _id: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface TutorForm {
  image: string;
}

const emptyForm: TutorForm = {
  image: "",
};

export default function TutorsAdminPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [form, setForm] = useState<TutorForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/tutors");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch tutors");
      }

      setTutors(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch tutors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
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
      const endpoint = editingId
        ? `/api/tutors/${editingId}`
        : "/api/tutors";

      const method = editingId ? "PUT" : "POST";

      const response = await adminApi(endpoint, {
        method,
        requiresAuth: true,
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save tutor");
      }

      setSuccess(
        editingId
          ? "Tutor updated successfully."
          : "Tutor added successfully."
      );

      resetForm();
      await fetchTutors();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save tutor"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tutor: Tutor) => {
    setEditingId(tutor._id);
    setForm({
      image: tutor.image,
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
      "Are you sure you want to delete this tutor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await adminApi(`/api/tutors/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete tutor");
      }

      setSuccess("Tutor deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchTutors();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete tutor"
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tutors</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage the tutor images displayed on the website.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Tutor" : "Add Tutor"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the tutor image."
                  : "Add a new tutor image."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="tutor-image"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Image Path
                </label>

                <input
                  id="tutor-image"
                  type="text"
                  value={form.image}
                  onChange={(event) =>
                    setForm({
                      image: event.target.value,
                    })
                  }
                  placeholder="/tutors/tutor1.jpg"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Example: /tutors/tutor1.jpg
                </p>
              </div>

              {form.image && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Preview
                  </p>

                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={form.image}
                      alt="Tutor preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}

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
                      ? "Update Tutor"
                      : "Add Tutor"}
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
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  All Tutors
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {tutors.length} tutor{tutors.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-gray-500">
                  Loading tutors...
                </p>
              </div>
            ) : tutors.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">
                  No tutors found.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {tutors.map((tutor, index) => (
                  <div
                    key={tutor._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image
                        src={tutor.image}
                        alt={`Tutor ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="p-4">
                      <p className="truncate text-xs text-gray-500">
                        {tutor.image}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(tutor)}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(tutor._id)}
                          className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
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