"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "inactive";
}

const API_URL = "http://localhost:5000/api/courses";

export default function CoursesAdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authorized) {
      return;
    }

    fetchCourses();
  }, [authorized]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setStatus("active");
    setEditingCourse(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setImage(course.image);
    setStatus(course.status);
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);

    try {
      const isEditing = Boolean(editingCourse);

      const response = await adminApi(
        isEditing
          ? `/api/courses/${editingCourse?._id}`
          : "/api/courses",
        {
          method: isEditing ? "PUT" : "POST",
          requiresAuth: true,
          body: JSON.stringify({
            title,
            description,
            image,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save course");
      }

      closeForm();
      await fetchCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
      alert("Failed to save course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await adminApi(`/api/courses/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Courses
          </h1>

          <p className="mt-2 text-gray-600">
            Create, edit and delete courses.
          </p>
        </div>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Course Management
              </h2>

              <p className="text-sm text-gray-500">
                Manage the courses displayed on the TAC website.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Course
            </button>
          </div>

          {showForm && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {editingCourse
                    ? "Update the course details below."
                    : "Enter the course details below."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="course-title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Course Title
                  </label>

                  <input
                    id="course-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter course title"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="course-description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="course-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Enter course description"
                    required
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="course-image"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>

                  <input
                    id="course-image"
                    type="text"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="/images/courses/course.jpg"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="course-status"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>

                  <select
                    id="course-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value as "active" | "inactive"
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

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
                      : editingCourse
                        ? "Update Course"
                        : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading courses...
            </p>
          ) : courses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-500">
                No courses available.
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Add your first course from the admin panel.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {course.title}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {course.description}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            course.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(course)}
                            className="rounded-md border px-3 py-2 text-sm transition hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCourse(course._id)
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