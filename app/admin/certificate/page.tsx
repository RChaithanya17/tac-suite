"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type CertificateFeature = {
  title: string;
  desc: string;
};

type Certificate = {
  _id: string;
  heading: string;
  description: string;

  issuerName: string;
  certificateSubtitle: string;
  certificateDescription: string;

  issuedBy: string;
  recognition: string;
  status: string;

  certificateImage: string;

  badgeText: string;

  features: CertificateFeature[];

  packageText: string;
  packageDescription: string;
};

const emptyFeature: CertificateFeature = {
  title: "",
  desc: "",
};

const emptyCertificate: Omit<Certificate, "_id"> = {
  heading: "",
  description: "",
  issuerName: "",
  certificateSubtitle: "",
  certificateDescription: "",
  issuedBy: "",
  recognition: "",
  status: "",
  certificateImage: "",
  badgeText: "",
  features: [],
  packageText: "",
  packageDescription: "",
};

export default function CertificateAdminPage() {
  const [certificate, setCertificate] = useState<
    Certificate | null
  >(null);

  const [form, setForm] = useState<
    Omit<Certificate, "_id">
  >(emptyCertificate);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/certificate"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load certificate"
        );
      }

      const data: Certificate = result.data;

      setCertificate(data);

      setForm({
        heading: data.heading,
        description: data.description,
        issuerName: data.issuerName,
        certificateSubtitle: data.certificateSubtitle,
        certificateDescription: data.certificateDescription,
        issuedBy: data.issuedBy,
        recognition: data.recognition,
        status: data.status,
        certificateImage: data.certificateImage,
        badgeText: data.badgeText,
        features: data.features || [],
        packageText: data.packageText,
        packageDescription: data.packageDescription,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load certificate"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof Omit<Certificate, "_id">,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateFeature = (
    index: number,
    field: keyof CertificateFeature,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      features: previous.features.map((feature, featureIndex) =>
        featureIndex === index
          ? {
              ...feature,
              [field]: value,
            }
          : feature
      ),
    }));
  };

  const addFeature = () => {
    setForm((previous) => ({
      ...previous,
      features: [...previous.features, { ...emptyFeature }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((previous) => ({
      ...previous,
      features: previous.features.filter(
        (_, featureIndex) => featureIndex !== index
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!certificate?._id) {
      setError("Certificate record not found.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await adminApi(
        `/api/certificate/${certificate._id}`,
        {
          method: "PUT",
          requiresAuth: true,
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update certificate"
        );
      }

      setCertificate(result.data);

      setForm({
        heading: result.data.heading,
        description: result.data.description,
        issuerName: result.data.issuerName,
        certificateSubtitle:
          result.data.certificateSubtitle,
        certificateDescription:
          result.data.certificateDescription,
        issuedBy: result.data.issuedBy,
        recognition: result.data.recognition,
        status: result.data.status,
        certificateImage: result.data.certificateImage,
        badgeText: result.data.badgeText,
        features: result.data.features || [],
        packageText: result.data.packageText,
        packageDescription:
          result.data.packageDescription,
      });

      setMessage("Certificate updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update certificate"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading certificate...
        </p>
      </div>
    );
  }

  if (error && !certificate) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchCertificate}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#FFC62A]">
            Website CMS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Certificate
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage the Certificate section content displayed
            on the public TAC website.
          </p>
        </div>

        {/* STATUS MESSAGES */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && certificate && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MAIN HEADING */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Main Content
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Heading
                </label>

                <input
                  type="text"
                  value={form.heading}
                  onChange={(event) =>
                    updateField(
                      "heading",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={4}
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>
            </div>
          </section>

          {/* CERTIFICATE INFORMATION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Certificate Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Issuer Name
                </label>

                <input
                  type="text"
                  value={form.issuerName}
                  onChange={(event) =>
                    updateField(
                      "issuerName",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Certificate Subtitle
                </label>

                <input
                  type="text"
                  value={form.certificateSubtitle}
                  onChange={(event) =>
                    updateField(
                      "certificateSubtitle",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Certificate Description
                </label>

                <textarea
                  value={form.certificateDescription}
                  onChange={(event) =>
                    updateField(
                      "certificateDescription",
                      event.target.value
                    )
                  }
                  rows={4}
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>
            </div>
          </section>

          {/* RECOGNITION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Recognition Details
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Issued By
                </label>

                <input
                  type="text"
                  value={form.issuedBy}
                  onChange={(event) =>
                    updateField(
                      "issuedBy",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Recognition
                </label>

                <input
                  type="text"
                  value={form.recognition}
                  onChange={(event) =>
                    updateField(
                      "recognition",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <input
                  type="text"
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>
            </div>
          </section>

          {/* IMAGE + BADGE */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Certificate Display
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Certificate Image Path
                </label>

                <input
                  type="text"
                  value={form.certificateImage}
                  onChange={(event) =>
                    updateField(
                      "certificateImage",
                      event.target.value
                    )
                  }
                  placeholder="/certificate.webp"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Example: /certificate.webp
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Badge Text
                </label>

                <input
                  type="text"
                  value={form.badgeText}
                  onChange={(event) =>
                    updateField(
                      "badgeText",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              {form.certificateImage && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Image Preview
                  </p>

                  <img
                    src={form.certificateImage}
                    alt="Certificate preview"
                    className="max-h-72 w-full rounded-lg object-contain"
                  />
                </div>
              )}
            </div>
          </section>

          {/* FEATURES */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Certificate Features
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the feature points shown beside the
                  certificate.
                </p>
              </div>

              <button
                type="button"
                onClick={addFeature}
                className="shrink-0 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black"
              >
                + Add Feature
              </button>
            </div>

            <div className="space-y-5">
              {form.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">
                      Feature {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-sm font-medium text-red-500 transition hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Title
                      </label>

                      <input
                        type="text"
                        value={feature.title}
                        onChange={(event) =>
                          updateFeature(
                            index,
                            "title",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                      </label>

                      <textarea
                        value={feature.desc}
                        onChange={(event) =>
                          updateFeature(
                            index,
                            "desc",
                            event.target.value
                          )
                        }
                        rows={3}
                        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {form.features.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No features added yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* PACKAGE */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Package Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Package Text
                </label>

                <input
                  type="text"
                  value={form.packageText}
                  onChange={(event) =>
                    updateField(
                      "packageText",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Package Description
                </label>

                <textarea
                  value={form.packageDescription}
                  onChange={(event) =>
                    updateField(
                      "packageDescription",
                      event.target.value
                    )
                  }
                  rows={3}
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                />
              </div>
            </div>
          </section>

          {/* SAVE */}
          <div className="sticky bottom-4 z-10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#FFC62A] px-7 py-3.5 text-sm font-bold text-black shadow-lg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}