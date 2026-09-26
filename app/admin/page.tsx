"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/adminApi";

type PlacementStudent = {
  _id: string;
  photo: string;
  name: string;
  company: string;
  role: string;
  skills: string[];
  lpa?: string;
  section: "top" | "bottom";
  createdAt: string;
  updatedAt: string;
};

type PlacementStat = {
  _id: string;
  value: string;
  label: string;
  highlight?: boolean;
  createdAt: string;
  updatedAt: string;
};

type StudentForm = {
  photo: string;
  name: string;
  company: string;
  role: string;
  skills: string;
  lpa: string;
  section: "top" | "bottom";
};

type StatForm = {
  value: string;
  label: string;
  highlight: boolean;
};

const emptyStudentForm: StudentForm = {
  photo: "",
  name: "",
  company: "",
  role: "",
  skills: "",
  lpa: "",
  section: "top",
};

const emptyStatForm: StatForm = {
  value: "",
  label: "",
  highlight: false,
};

export default function AdminPlacementsPage() {
  const [students, setStudents] = useState<PlacementStudent[]>([]);
  const [stats, setStats] = useState<PlacementStat[]>([]);

  const [studentForm, setStudentForm] =
    useState<StudentForm>(emptyStudentForm);

  const [statForm, setStatForm] = useState<StatForm>(emptyStatForm);

  const [editingStudentId, setEditingStudentId] =
    useState<string | null>(null);

  const [editingStatId, setEditingStatId] =
    useState<string | null>(null);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [savingStudent, setSavingStudent] = useState(false);
  const [savingStat, setSavingStat] = useState(false);

  const [deletingStudentId, setDeletingStudentId] =
    useState<string | null>(null);

  const [deletingStatId, setDeletingStatId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const response = await fetch(
        "http://localhost:5000/api/placements/students"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch placement students");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to fetch placement students"
        );
      }

      setStudents(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load placement students"
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      const response = await fetch(
        "http://localhost:5000/api/placements/stats"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch placement stats");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to fetch placement stats"
        );
      }

      setStats(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load placement stats"
      );
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  const resetStudentForm = () => {
    setStudentForm(emptyStudentForm);
    setEditingStudentId(null);
  };

  const resetStatForm = () => {
    setStatForm(emptyStatForm);
    setEditingStatId(null);
  };

  const handleStudentSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !studentForm.photo.trim() ||
      !studentForm.name.trim() ||
      !studentForm.company.trim() ||
      !studentForm.role.trim() ||
      !studentForm.skills.trim()
    ) {
      setError(
        "Photo, name, company, role and skills are required."
      );
      return;
    }

    try {
      setSavingStudent(true);

      const endpoint = editingStudentId
        ? `/api/placements/students/${editingStudentId}`
        : "/api/placements/students";

      const method = editingStudentId ? "PUT" : "POST";

      const skills = studentForm.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await adminApi(endpoint, {
        method,
        requiresAuth: true,
        body: JSON.stringify({
          photo: studentForm.photo.trim(),
          name: studentForm.name.trim(),
          company: studentForm.company.trim(),
          role: studentForm.role.trim(),
          skills,
          lpa: studentForm.lpa.trim() || undefined,
          section: studentForm.section,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save placement student"
        );
      }

      setSuccess(
        editingStudentId
          ? "Placement student updated successfully."
          : "Placement student added successfully."
      );

      resetStudentForm();
      await fetchStudents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save placement student"
      );
    } finally {
      setSavingStudent(false);
    }
  };

  const handleStatSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!statForm.value.trim() || !statForm.label.trim()) {
      setError("Stat value and label are required.");
      return;
    }

    try {
      setSavingStat(true);

      const endpoint = editingStatId
        ? `/api/placements/stats/${editingStatId}`
        : "/api/placements/stats";

      const method = editingStatId ? "PUT" : "POST";

      const response = await adminApi(endpoint, {
        method,
        requiresAuth: true,
        body: JSON.stringify({
          value: statForm.value.trim(),
          label: statForm.label.trim(),
          highlight: statForm.highlight,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save placement stat"
        );
      }

      setSuccess(
        editingStatId
          ? "Placement stat updated successfully."
          : "Placement stat added successfully."
      );

      resetStatForm();
      await fetchStats();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save placement stat"
      );
    } finally {
      setSavingStat(false);
    }
  };

  const handleEditStudent = (student: PlacementStudent) => {
    setEditingStudentId(student._id);

    setStudentForm({
      photo: student.photo,
      name: student.name,
      company: student.company,
      role: student.role,
      skills: student.skills.join(", "),
      lpa: student.lpa || "",
      section: student.section,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEditStat = (stat: PlacementStat) => {
    setEditingStatId(stat._id);

    setStatForm({
      value: stat.value,
      label: stat.label,
      highlight: Boolean(stat.highlight),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteStudent = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this placement student?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingStudentId(id);

    try {
      const response = await adminApi(
        `/api/placements/students/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete placement student"
        );
      }

      setSuccess("Placement student deleted successfully.");

      if (editingStudentId === id) {
        resetStudentForm();
      }

      await fetchStudents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete placement student"
      );
    } finally {
      setDeletingStudentId(null);
    }
  };

  const handleDeleteStat = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this placement stat?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingStatId(id);

    try {
      const response = await adminApi(
        `/api/placements/stats/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete placement stat"
        );
      }

      setSuccess("Placement stat deleted successfully.");

      if (editingStatId === id) {
        resetStatForm();
      }

      await fetchStats();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete placement stat"
      );
    } finally {
      setDeletingStatId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Placements
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage placement students and placement statistics.
          </p>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* =====================================================
            PLACEMENT STATS
        ====================================================== */}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Placement Stats
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the statistics displayed in the placement section.
            </p>
          </div>

          <form
            onSubmit={handleStatSubmit}
            className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5"
          >
            <h3 className="mb-4 font-semibold text-gray-900">
              {editingStatId ? "Edit Stat" : "Add Stat"}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="stat-value"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Value
                </label>

                <input
                  id="stat-value"
                  type="text"
                  value={statForm.value}
                  onChange={(event) =>
                    setStatForm({
                      ...statForm,
                      value: event.target.value,
                    })
                  }
                  placeholder="₹30K"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="stat-label"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Label
                </label>

                <input
                  id="stat-label"
                  type="text"
                  value={statForm.label}
                  onChange={(event) =>
                    setStatForm({
                      ...statForm,
                      label: event.target.value,
                    })
                  }
                  placeholder="AVERAGE PACKAGE — FRESHERS"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={statForm.highlight}
                onChange={(event) =>
                  setStatForm({
                    ...statForm,
                    highlight: event.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />

              Highlight this stat
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={savingStat}
                className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingStat
                  ? "Saving..."
                  : editingStatId
                    ? "Update Stat"
                    : "Add Stat"}
              </button>

              {editingStatId && (
                <button
                  type="button"
                  onClick={resetStatForm}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {loadingStats ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading placement stats...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-xs font-medium text-gray-500">
                        {stat.label}
                      </p>
                    </div>

                    {stat.highlight && (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                        Highlight
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditStat(stat)}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteStat(stat._id)}
                      disabled={deletingStatId === stat._id}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingStatId === stat._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            PLACEMENT STUDENTS
        ====================================================== */}

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Placement Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the students displayed in the placement section.
            </p>
          </div>

          {/* STUDENT FORM */}
          <form
            onSubmit={handleStudentSubmit}
            className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5"
          >
            <h3 className="mb-4 font-semibold text-gray-900">
              {editingStudentId
                ? "Edit Placement Student"
                : "Add Placement Student"}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="student-photo"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Photo Path
                </label>

                <input
                  id="student-photo"
                  type="text"
                  value={studentForm.photo}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      photo: event.target.value,
                    })
                  }
                  placeholder="/students/1.png"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="student-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  id="student-name"
                  type="text"
                  value={studentForm.name}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Student name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="student-company"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Company
                </label>

                <input
                  id="student-company"
                  type="text"
                  value={studentForm.company}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      company: event.target.value,
                    })
                  }
                  placeholder="Company"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="student-role"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Role
                </label>

                <input
                  id="student-role"
                  type="text"
                  value={studentForm.role}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      role: event.target.value,
                    })
                  }
                  placeholder="Video Editor"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="student-skills"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>

                <input
                  id="student-skills"
                  type="text"
                  value={studentForm.skills}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      skills: event.target.value,
                    })
                  }
                  placeholder="Video Editing, Content Writing, Graphic Design"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Separate multiple skills with commas.
                </p>
              </div>

              <div>
                <label
                  htmlFor="student-lpa"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  LPA
                </label>

                <input
                  id="student-lpa"
                  type="text"
                  value={studentForm.lpa}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      lpa: event.target.value,
                    })
                  }
                  placeholder="3.0"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="student-section"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Section
                </label>

                <select
                  id="student-section"
                  value={studentForm.section}
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      section: event.target.value as "top" | "bottom",
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="top">Top Students</option>
                  <option value="bottom">Bottom Students</option>
                </select>
              </div>
            </div>

            {studentForm.photo.trim() && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Photo Preview
                </p>

                <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  <Image
                    src={studentForm.photo.trim()}
                    alt="Placement student preview"
                    fill
                    sizes="384px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={savingStudent}
                className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                  onClick={resetStudentForm}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* STUDENT LIST */}
          {loadingStudents ? (
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <Image
                      src={student.photo}
                      alt={student.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {student.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {student.company}
                        </p>
                      </div>

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {student.section === "top"
                          ? "Top"
                          : "Bottom"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      {student.role}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {student.skills.map((skill, index) => (
                        <span
                          key={`${student._id}-${index}`}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {student.lpa && (
                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        {student.lpa} LPA
                      </p>
                    )}

                    <p className="mt-3 truncate text-xs text-gray-400">
                      {student.photo}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditStudent(student)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteStudent(student._id)
                        }
                        disabled={
                          deletingStudentId === student._id
                        }
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingStudentId === student._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}