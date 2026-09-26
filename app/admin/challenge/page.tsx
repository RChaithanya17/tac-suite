"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type ChallengeStep = {
  num: string;
  title: string;
  desc: string;
};

type ChallengeData = {
  _id?: string;
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  steps: ChallengeStep[];
};

const emptyChallenge: ChallengeData = {
  eyebrow: "",
  heading: "",
  description: "",
  buttonText: "",
  steps: [
    { num: "01", title: "", desc: "" },
    { num: "02", title: "", desc: "" },
    { num: "03", title: "", desc: "" },
    { num: "04", title: "", desc: "" },
  ],
};

export default function ChallengeAdminPage() {
  const [challenge, setChallenge] =
    useState<ChallengeData>(emptyChallenge);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/challenge"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load Challenge"
          );
        }

        setChallenge(result.data);
      } catch (error) {
        console.error("Failed to load Challenge:", error);
        setMessage("Failed to load Challenge.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  const handleMainChange = (
    field: keyof Omit<ChallengeData, "_id" | "steps">,
    value: string
  ) => {
    setChallenge((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleStepChange = (
    index: number,
    field: keyof ChallengeStep,
    value: string
  ) => {
    setChallenge((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) =>
        stepIndex === index
          ? {
              ...step,
              [field]: value,
            }
          : step
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await adminApi("/api/challenge", {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify({
          eyebrow: challenge.eyebrow,
          heading: challenge.heading,
          description: challenge.description,
          buttonText: challenge.buttonText,
          steps: challenge.steps,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update Challenge"
        );
      }

      setChallenge(result.data);
      setMessage("Challenge updated successfully.");
    } catch (error) {
      console.error("Failed to save Challenge:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save Challenge."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading Challenge...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Challenge
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the ₹1 lakh challenge section displayed on the website.
        </p>
      </div>

      <div className="max-w-5xl space-y-6">
        {/* Main Challenge Content */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Main Content
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Eyebrow
              </label>

              <input
                type="text"
                value={challenge.eyebrow}
                onChange={(event) =>
                  handleMainChange(
                    "eyebrow",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Heading
              </label>

              <textarea
                value={challenge.heading}
                onChange={(event) =>
                  handleMainChange(
                    "heading",
                    event.target.value
                  )
                }
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-400">
                Use a new line if you want the heading displayed on two
                lines.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={challenge.description}
                onChange={(event) =>
                  handleMainChange(
                    "description",
                    event.target.value
                  )
                }
                rows={5}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Text
              </label>

              <input
                type="text"
                value={challenge.buttonText}
                onChange={(event) =>
                  handleMainChange(
                    "buttonText",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Challenge Steps */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Challenge Steps
          </h2>

          <div className="space-y-6">
            {challenge.steps.map((step, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    Step {index + 1}
                  </h3>

                  <span className="text-sm font-semibold text-gray-500">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Number
                    </label>

                    <input
                      type="text"
                      value={step.num}
                      onChange={(event) =>
                        handleStepChange(
                          index,
                          "num",
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title
                    </label>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(event) =>
                        handleStepChange(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      value={step.desc}
                      onChange={(event) =>
                        handleStepChange(
                          index,
                          "desc",
                          event.target.value
                        )
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between">
          {message ? (
            <p className="text-sm text-gray-600">
              {message}
            </p>
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