"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type NavigationLink = {
  label: string;
  href: string;
};

type NavbarData = {
  announcement: string;
  navigationLinks: NavigationLink[];
};

const defaultNavbar: NavbarData = {
  announcement: "",
  navigationLinks: [],
};

export default function NavbarAdminPage() {
  const [navbar, setNavbar] = useState<NavbarData>(defaultNavbar);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadNavbar = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/navbar");

        if (!response.ok) {
          throw new Error("Failed to load navbar");
        }

        const result = await response.json();

        if (result.data) {
          setNavbar({
            announcement: result.data.announcement ?? "",
            navigationLinks: result.data.navigationLinks ?? [],
          });
        }
      } catch (error) {
        console.error("Failed to load navbar:", error);
        setMessage("Failed to load navbar content.");
      } finally {
        setLoading(false);
      }
    };

    loadNavbar();
  }, []);

  const updateAnnouncement = (value: string) => {
    setNavbar((prev) => ({
      ...prev,
      announcement: value,
    }));
  };

  const updateLink = (
    index: number,
    field: keyof NavigationLink,
    value: string
  ) => {
    setNavbar((prev) => ({
      ...prev,
      navigationLinks: prev.navigationLinks.map((link, i) =>
        i === index
          ? {
              ...link,
              [field]: value,
            }
          : link
      ),
    }));
  };

  const addLink = () => {
    setNavbar((prev) => ({
      ...prev,
      navigationLinks: [
        ...prev.navigationLinks,
        {
          label: "",
          href: "",
        },
      ],
    }));
  };

  const removeLink = (index: number) => {
    setNavbar((prev) => ({
      ...prev,
      navigationLinks: prev.navigationLinks.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const saveNavbar = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await adminApi("/api/navbar", {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify(navbar),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save navbar");
      }

      setNavbar({
        announcement: result.data.announcement ?? "",
        navigationLinks: result.data.navigationLinks ?? [],
      });

      setMessage("Navbar updated successfully.");
    } catch (error) {
      console.error("Failed to save navbar:", error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to save navbar.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-500">
          Loading navbar...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Navbar
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the announcement bar and navigation links shown on
          the public website.
        </p>
      </div>

      <div className="space-y-6">
        {/* Announcement */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">
            Announcement
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Text displayed in the yellow announcement strip.
          </p>

          <input
            type="text"
            value={navbar.announcement}
            onChange={(e) =>
              updateAnnouncement(e.target.value)
            }
            placeholder="BATCH 10 • ENROLLMENTS OPEN"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
          />
        </section>

        {/* Navigation Links */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Navigation Links
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the links shown in the desktop and mobile
                navigation.
              </p>
            </div>

            <button
              type="button"
              onClick={addLink}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            >
              + Add Link
            </button>
          </div>

          <div className="space-y-4">
            {navbar.navigationLinks.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                No navigation links added.
              </div>
            ) : (
              navbar.navigationLinks.map((link, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Link {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-xs font-semibold text-red-600 transition hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Label
                      </label>

                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          updateLink(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Skills"
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        URL
                      </label>

                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) =>
                          updateLink(
                            index,
                            "href",
                            e.target.value
                          )
                        }
                        placeholder="/#skills"
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#FFC62A] focus:ring-2 focus:ring-[#FFC62A]/20"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6">
          <div>
            {message && (
              <p
                className={`text-sm font-medium ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={saveNavbar}
            disabled={saving}
            className="rounded-md bg-[#FFC62A] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#FFD45C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}