"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type Partner = {
  name: string;
};

type PartnersData = {
  heading: string;
  partners: Partner[];
};

export default function PartnersAdminPage() {
  const [data, setData] = useState<PartnersData>({
    heading: "",
    partners: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/partners");

        if (!response.ok) {
          throw new Error("Failed to load partners");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setData({
            heading: result.data.heading,
            partners: result.data.partners,
          });
        }
      } catch (error) {
        console.error("Failed to load partners:", error);
        setMessage("Failed to load partners.");
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  const updatePartner = (index: number, name: string) => {
    setData((current) => ({
      ...current,
      partners: current.partners.map((partner, i) =>
        i === index ? { ...partner, name } : partner
      ),
    }));
  };

  const addPartner = () => {
    setData((current) => ({
      ...current,
      partners: [...current.partners, { name: "" }],
    }));
  };

  const removePartner = (index: number) => {
    setData((current) => ({
      ...current,
      partners: current.partners.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await adminApi("/api/partners", {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save partners");
      }

      setData({
        heading: result.data.heading,
        partners: result.data.partners,
      });

      setMessage("Partners updated successfully.");
    } catch (error) {
      console.error("Failed to save partners:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save partners."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading Partners...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Partners
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage the associated studios, agencies and hiring partners.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Heading */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Section Heading
          </label>

          <input
            type="text"
            value={data.heading}
            onChange={(event) =>
              setData((current) => ({
                ...current,
                heading: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500"
          />
        </div>

        {/* Partners */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Partner Names
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Add, edit or remove partner names.
              </p>
            </div>

            <button
              type="button"
              onClick={addPartner}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Add Partner
            </button>
          </div>

          <div className="space-y-3">
            {data.partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <span className="w-8 text-sm text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  type="text"
                  value={partner.name}
                  onChange={(event) =>
                    updatePartner(index, event.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500"
                />

                <button
                  type="button"
                  onClick={() => removePartner(index)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between">
          <p
            className={`text-sm ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}