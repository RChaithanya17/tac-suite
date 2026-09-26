"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/adminApi";

type PlacementStudent = {
  _id?: string;
  photo: string;
  name: string;
  company: string;
  role: string;
  skills: string[];
  lpa?: string;
  section: "top" | "bottom";
};

type PlacementStat = {
  _id?: string;
  value: string;
  label: string;
  highlight?: boolean;
};

const API_BASE_URL = "http://localhost:5000";

const emptyStudent: PlacementStudent = {
  photo: "",
  name: "",
  company: "",
  role: "",
  skills: [],
  lpa: "",
  section: "top",
};

const emptyStat: PlacementStat = {
  value: "",
  label: "",
  highlight: false,
};

export default function PlacementsAdminPage() {
  const [students, setStudents] = useState<PlacementStudent[]>([]);
  const [stats, setStats] = useState<PlacementStat[]>([]);

  const [studentForm, setStudentForm] =
    useState<PlacementStudent>(emptyStudent);

  const [statForm, setStatForm] =
    useState<PlacementStat>(emptyStat);

  const [editingStudentId, setEditingStudentId] =
    useState<string | null>(null);

  const [editingStatId, setEditingStatId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingStudent, setSavingStudent] = useState(false);
  const [savingStat, setSavingStat] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPlacements = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/placements/students`),
        fetch(`${API_BASE_URL}/api/placements/stats`),
      ]);

      if (!studentsResponse.ok) {
        throw new Error("Failed to load students");
      }

      if (!statsResponse.ok) {
        throw new Error("Failed to load stats");
      }

      const studentsResult = await studentsResponse.json();
      const statsResult = await statsResponse.json();

      setStudents(studentsResult.data ?? []);
      setStats(statsResult.data ?? []);
    } catch (error) {
      console.error(error);
      setError("Could not load placement data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const showSuccess = (message: string) => {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  const handleStudentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingStudent(true);
      setError("");

      const payload = {
        photo: studentForm.photo.trim(),
        name: studentForm.name.trim(),
        company: studentForm.company.trim(),
        role: studentForm.role.trim(),
        skills: studentForm.skills,
        lpa: studentForm.lpa?.trim() || undefined,
        section: studentForm.section,
      };

      const response = editingStudentId
        ? await adminApi(
            `/api/placements/students/${editingStudentId}`,
            {
              method: "PUT",
              requiresAuth: true,
              body: JSON.stringify(payload),
            }
          )
        : await adminApi("/api/placements/students", {
            method: "POST",
            requiresAuth: true,
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to save student");
      }

      showSuccess(
        editingStudentId
          ? "Placement student updated successfully."
          : "Placement student added successfully."
      );

      setStudentForm(emptyStudent);
      setEditingStudentId(null);

      await loadPlacements();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not save placement student."
      );
    } finally {
      setSavingStudent(false);
    }
  };

  const handleStatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingStat(true);
      setError("");

      const payload = {
        value: statForm.value.trim(),
        label: statForm.label.trim(),
        highlight: Boolean(statForm.highlight),
      };

      const response = editingStatId
        ? await adminApi(`/api/placements/stats/${editingStatId}`, {
            method: "PUT",
            requiresAuth: true,
            body: JSON.stringify(payload),
          })
        : await adminApi("/api/placements/stats", {
            method: "POST",
            requiresAuth: true,
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to save stat");
      }

      showSuccess(
        editingStatId
          ? "Placement stat updated successfully."
          : "Placement stat added successfully."
      );

      setStatForm(emptyStat);
      setEditingStatId(null);

      await loadPlacements();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not save placement stat."
      );
    } finally {
      setSavingStat(false);
    }
  };

  const handleDeleteStudent = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this placement student?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await adminApi(
        `/api/placements/students/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to delete student");
      }

      showSuccess("Placement student deleted successfully.");

      if (editingStudentId === id) {
        setEditingStudentId(null);
        setStudentForm(emptyStudent);
      }

      await loadPlacements();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete placement student."
      );
    }
  };

  const handleDeleteStat = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this placement stat?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await adminApi(`/api/placements/stats/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to delete stat");
      }

      showSuccess("Placement stat deleted successfully.");

      if (editingStatId === id) {
        setEditingStatId(null);
        setStatForm(emptyStat);
      }

      await loadPlacements();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete placement stat."
      );
    }
  };

  const editStudent = (student: PlacementStudent) => {
    setEditingStudentId(student._id ?? null);

    setStudentForm({
      _id: student._id,
      photo: student.photo,
      name: student.name,
      company: student.company,
      role: student.role,
      skills: [...student.skills],
      lpa: student.lpa ?? "",
      section: student.section,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const editStat = (stat: PlacementStat) => {
    setEditingStatId(stat._id ?? null);

    setStatForm({
      _id: stat._id,
      value: stat.value,
      label: stat.label,
      highlight: Boolean(stat.highlight),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelStudentEdit = () => {
    setEditingStudentId(null);
    setStudentForm(emptyStudent);
  };

  const cancelStatEdit = () => {
    setEditingStatId(null);
    setStatForm(emptyStat);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
            Admin CMS
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Placements
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Manage placement students and placement statistics.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Students
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Stats
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* STATS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Placement Statistics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the statistics displayed in the placements section.
            </p>
          </div>

          <form
            onSubmit={handleStatSubmit}
            className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[180px_1fr_auto_auto]"
          >
            <input
              type="text"
              placeholder="Value e.g. 100%"
              value={statForm.value}
              onChange={(event) =>
                setStatForm((current) => ({
                  ...current,
                  value: event.target.value,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
              required
            />

            <input
              type="text"
              placeholder="Label e.g. PLACEMENT ASSISTANCE"
              value={statForm.label}
              onChange={(event) =>
                setStatForm((current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
              required
            />

            <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={Boolean(statForm.highlight)}
                onChange={(event) =>
                  setStatForm((current) => ({
                    ...current,
                    highlight: event.target.checked,
                  }))
                }
              />

              Highlight
            </label>

            <button
              type="submit"
              disabled={savingStat}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {savingStat
                ? "Saving..."
                : editingStatId
                  ? "Update"
                  : "Add Stat"}
            </button>
          </form>

          {editingStatId && (
            <button
              type="button"
              onClick={cancelStatEdit}
              className="mt-3 text-sm font-medium text-gray-600 underline"
            >
              Cancel stat edit
            </button>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat._id}
                className={`rounded-xl border p-5 ${
                  stat.highlight
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-900"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>

                    <p
                      className={`mt-2 text-xs font-semibold uppercase tracking-wide ${
                        stat.highlight
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editStat(stat)}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteStat(stat._id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STUDENT FORM */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              {editingStudentId
                ? "Edit Placement Student"
                : "Add Placement Student"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add or update placement student information.
            </p>
          </div>

          <form
            onSubmit={handleStudentSubmit}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Photo path
              </label>

              <input
                type="text"
                placeholder="/students/1.png"
                value={studentForm.photo}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    photo: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Student Name
              </label>

              <input
                type="text"
                value={studentForm.name}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Company
              </label>

              <input
                type="text"
                value={studentForm.company}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    company: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Role
              </label>

              <input
                type="text"
                value={studentForm.role}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                LPA
              </label>

              <input
                type="text"
                placeholder="3.0"
                value={studentForm.lpa ?? ""}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    lpa: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Section
              </label>

              <select
                value={studentForm.section}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    section: event.target.value as "top" | "bottom",
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Skills
              </label>

              <input
                type="text"
                placeholder="Video Editing, Content Writing"
                value={studentForm.skills.join(", ")}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    skills: event.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="flex gap-3 pt-2 md:col-span-2">
              <button
                type="submit"
                disabled={savingStudent}
                className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {savingStudent
                  ? "Saving..."
                  : editingStudentId
                    ? "Update Student"
                    : "Add Student"}
              </button>

              {editingStudentId && (
                <button
                  type="button"
                  onClick={cancelStudentEdit}
                  className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* STUDENTS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Placement Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the students displayed on the website.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading placement students...
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
              <p className="text-sm font-medium text-gray-700">
                No placement students found.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {students.map((student) => (
                <article
                  key={student._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {student.photo ? (
                      <Image
                        src={student.photo}
                        alt={student.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {student.name}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {student.role}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {student.company}
                        </p>
                      </div>

                      {student.lpa && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-800">
                          {student.lpa} LPA
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {student.skills.map((skill, index) => (
                        <span
                          key={`${student._id}-${index}`}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {student.section}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editStudent(student)}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteStudent(student._id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}