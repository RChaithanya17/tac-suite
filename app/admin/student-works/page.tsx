"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";

interface StudentWork {
  _id: string;
  image: string;
  text: string;
}

interface StudentWorksSettings {
  _id: string;
  heading: string;
  description: string;
  buttonText: string;
  portfolioUrl: string;
}

const API_URL = "http://localhost:5000/api/student-works";
const SETTINGS_API_URL =
  "http://localhost:5000/api/student-works-settings";

export default function StudentWorksAdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [studentWorks, setStudentWorks] =
    useState<StudentWork[]>([]);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] =
    useState<StudentWorksSettings | null>(null);

  const [settingsHeading, setSettingsHeading] = useState("");
  const [settingsDescription, setSettingsDescription] =
    useState("");
  const [settingsButtonText, setSettingsButtonText] =
    useState("");
  const [settingsPortfolioUrl, setSettingsPortfolioUrl] =
    useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingWork, setEditingWork] =
    useState<StudentWork | null>(null);

  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  const fetchStudentWorks = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setStudentWorks(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch student works:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentWorksSettings = async () => {
    try {
      const response = await fetch(SETTINGS_API_URL);
      const result = await response.json();

      if (result.success && result.data) {
        setSettings(result.data);
        setSettingsHeading(result.data.heading);
        setSettingsDescription(result.data.description);
        setSettingsButtonText(result.data.buttonText);
        setSettingsPortfolioUrl(result.data.portfolioUrl);
      }
    } catch (error) {
      console.error(
        "Failed to fetch Student Works settings:",
        error
      );
    }
  };

  useEffect(() => {
    if (!authorized) {
      return;
    }

    fetchStudentWorks();
    fetchStudentWorksSettings();
  }, [authorized]);

  const resetForm = () => {
    setImage("");
    setText("");
    setEditingWork(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (work: StudentWork) => {
    setEditingWork(work);
    setImage(work.image);
    setText(work.text);
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);

    try {
      const isEditing = Boolean(editingWork);

      const response = await adminApi(
        isEditing
          ? `/api/student-works/${editingWork?._id}`
          : "/api/student-works",
        {
          method: isEditing ? "PUT" : "POST",
          requiresAuth: true,
          body: JSON.stringify({
            image,
            text,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save student work"
        );
      }

      closeForm();
      await fetchStudentWorks();
    } catch (error) {
      console.error("Failed to save student work:", error);

      alert(
        "Failed to save student work. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSavingSettings(true);

    try {
      const response = await adminApi(
        "/api/student-works-settings",
        {
          method: "PUT",
          requiresAuth: true,
          body: JSON.stringify({
            heading: settingsHeading,
            description: settingsDescription,
            buttonText: settingsButtonText,
            portfolioUrl: settingsPortfolioUrl,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save Student Works settings"
        );
      }

      setSettings(result.data);

      setSettingsHeading(result.data.heading);
      setSettingsDescription(result.data.description);
      setSettingsButtonText(result.data.buttonText);
      setSettingsPortfolioUrl(result.data.portfolioUrl);

      alert("Student Works settings saved successfully.");
    } catch (error) {
      console.error(
        "Failed to save Student Works settings:",
        error
      );

      alert(
        "Failed to save Student Works settings. Please try again."
      );
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteWork = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student work?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await adminApi(
        `/api/student-works/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete student work"
        );
      }

      await fetchStudentWorks();
    } catch (error) {
      console.error(
        "Failed to delete student work:",
        error
      );

      alert(
        "Failed to delete student work. Please try again."
      );
    }
  };

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Checking authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Works
          </h1>

          <p className="mt-2 text-gray-600">
            Create, edit and delete student work displayed
            on the TAC website.
          </p>
        </div>

        {/* Student Works Section Settings */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Student Works Section Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the heading, description and portfolio
              button displayed in the Student Works section.
            </p>
          </div>

          <form
            onSubmit={handleSaveSettings}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="student-works-heading"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Heading
              </label>

              <input
                id="student-works-heading"
                type="text"
                value={settingsHeading}
                onChange={(event) =>
                  setSettingsHeading(event.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="student-works-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <input
                id="student-works-description"
                type="text"
                value={settingsDescription}
                onChange={(event) =>
                  setSettingsDescription(event.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="student-works-button"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Button Text
              </label>

              <input
                id="student-works-button"
                type="text"
                value={settingsButtonText}
                onChange={(event) =>
                  setSettingsButtonText(event.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="student-works-url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Portfolio URL
              </label>

              <input
                id="student-works-url"
                type="url"
                value={settingsPortfolioUrl}
                onChange={(event) =>
                  setSettingsPortfolioUrl(event.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingSettings || !settings}
                className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingSettings
                  ? "Saving..."
                  : "Save Section Settings"}
              </button>
            </div>
          </form>
        </section>

        {/* Student Work Management */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Student Work Management
              </h2>

              <p className="text-sm text-gray-500">
                Manage posters and other student work.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Student Work
            </button>
          </div>

          {showForm && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingWork
                    ? "Edit Student Work"
                    : "Add New Student Work"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {editingWork
                    ? "Update the student work details below."
                    : "Enter the student work details below."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="student-work-image"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>

                  <input
                    id="student-work-image"
                    type="text"
                    value={image}
                    onChange={(event) =>
                      setImage(event.target.value)
                    }
                    placeholder="/works/example.jpg"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Example: /works/mothish.webp
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="student-work-text"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>

                  <input
                    id="student-work-text"
                    type="text"
                    value={text}
                    onChange={(event) =>
                      setText(event.target.value)
                    }
                    placeholder="Enter student work title"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  />
                </div>

                {image && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Preview
                    </p>

                    <div className="flex h-48 w-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <img
                        src={image}
                        alt={text || "Student work preview"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingWork
                        ? "Update Student Work"
                        : "Create Student Work"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading student works...
            </p>
          ) : studentWorks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-500">
                No student works available.
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Add your first student work from the
                admin panel.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-3">
                      Preview
                    </th>

                    <th className="px-4 py-3">
                      Title
                    </th>

                    <th className="px-4 py-3">
                      Image
                    </th>

                    <th className="px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {studentWorks.map((work) => (
                    <tr
                      key={work._id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-4">
                        <div className="h-20 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                          <img
                            src={work.image}
                            alt={work.text}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-900">
                        {work.text}
                      </td>

                      <td className="max-w-xs px-4 py-4 text-sm text-gray-500">
                        <span className="break-all">
                          {work.image}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(work)
                            }
                            className="rounded-md border px-3 py-2 text-sm transition hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteWork(work._id)
                            }
                            className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}