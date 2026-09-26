"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type GovCertificate = {
  _id: string;
  src: string;
  label: string;
  sub: string;
  order: number;
};

const emptyForm = {
  src: "",
  label: "",
  sub: "",
  order: 1,
};

export default function GovCertificatesAdminPage() {
  const [certificates, setCertificates] = useState<
    GovCertificate[]
  >([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/gov-certificates"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load government certificates"
        );
      }

      setCertificates(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load government certificates"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      src: "",
      label: "",
      sub: "",
      order: certificates.length + 1,
    });

    setEditingId(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const endpoint = editingId
        ? `/api/gov-certificates/${editingId}`
        : "/api/gov-certificates";

      const method = editingId ? "PUT" : "POST";

      const response = await adminApi(endpoint, {
        method,
        requiresAuth: true,
        body: JSON.stringify({
          ...form,
          order: Number(form.order),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save government certificate"
        );
      }

      setMessage(
        editingId
          ? "Government certificate updated successfully."
          : "Government certificate added successfully."
      );

      resetForm();

      await fetchCertificates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save government certificate"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (certificate: GovCertificate) => {
    setEditingId(certificate._id);

    setForm({
      src: certificate.src,
      label: certificate.label,
      sub: certificate.sub,
      order: certificate.order,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this government certificate?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await adminApi(
        `/api/gov-certificates/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete government certificate"
        );
      }

      setMessage(
        "Government certificate deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchCertificates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete government certificate"
      );
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#FFC62A]">
            Website CMS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Government Certificates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage the official recognition certificates shown
            on the TAC website.
          </p>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId
                  ? "Edit Government Certificate"
                  : "Add Government Certificate"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the image, title, subtitle and display
                order.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image Path
              </label>

              <input
                type="text"
                required
                value={form.src}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    src: event.target.value,
                  }))
                }
                placeholder="/dpiit.png"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Label
              </label>

              <input
                type="text"
                required
                value={form.label}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    label: event.target.value,
                  }))
                }
                placeholder="MSME Registered"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subtitle
              </label>

              <input
                type="text"
                required
                value={form.sub}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    sub: event.target.value,
                  }))
                }
                placeholder="Ministry of MSME, Govt. of India"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Display Order
              </label>

              <input
                type="number"
                required
                min={1}
                value={form.order}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    order: Number(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#FFC62A] px-6 py-3 text-sm font-bold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Certificate"
                    : "Add Certificate"}
              </button>
            </div>
          </form>
        </section>

        {/* CERTIFICATE LIST */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Certificates
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {certificates.length} certificate
              {certificates.length === 1 ? "" : "s"} currently
              stored.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Loading certificates...
            </p>
          ) : certificates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-sm text-gray-500">
                No government certificates found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...certificates]
                .sort((a, b) => a.order - b.order)
                .map((certificate) => (
                  <div
                    key={certificate._id}
                    className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center"
                  >
                    {/* IMAGE */}
                    <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-3 md:w-36">
                      <img
                        src={certificate.src}
                        alt={certificate.label}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
                          #{certificate.order}
                        </span>

                        <h3 className="font-semibold text-gray-900">
                          {certificate.label}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-500">
                        {certificate.sub}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {certificate.src}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(certificate)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(certificate._id)
                        }
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
  );
}