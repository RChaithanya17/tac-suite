"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  href: string;
};

type FooterContact = {
  addressLines: string[];
  phone: string;
  phoneHref: string;
  admissionsEmail: string;
  admissionsEmailHref: string;
};

type FooterBadge = {
  label: string;
};

type FooterData = {
  _id: string;
  socialLinks: SocialLink[];
  footerContact: FooterContact;
  courseAboutLinks: FooterLink[];
  legalLinks: FooterLink[];
  footerBadges: FooterBadge[];
  copyright: string;
  marketingStatement: string;
};

const emptyFooter: FooterData = {
  _id: "",
  socialLinks: [],
  footerContact: {
    addressLines: ["", "", "", ""],
    phone: "",
    phoneHref: "",
    admissionsEmail: "",
    admissionsEmailHref: "",
  },
  courseAboutLinks: [],
  legalLinks: [],
  footerBadges: [],
  copyright: "",
  marketingStatement: "",
};

export default function FooterAdminPage() {
  const [footer, setFooter] = useState<FooterData>(emptyFooter);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFooter = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminApi("/api/footer");

        if (!response.ok) {
          throw new Error("Failed to load footer");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Footer data not found");
        }

        setFooter(result.data);
      } catch (err) {
        console.error("Failed to load footer:", err);
        setError("Failed to load footer content.");
      } finally {
        setLoading(false);
      }
    };

    loadFooter();
  }, []);

  const updateAddressLine = (
    index: number,
    value: string
  ) => {
    setFooter((current) => {
      const addressLines = [...current.footerContact.addressLines];

      addressLines[index] = value;

      return {
        ...current,
        footerContact: {
          ...current.footerContact,
          addressLines,
        },
      };
    });
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setFooter((current) => {
      const socialLinks = [...current.socialLinks];

      socialLinks[index] = {
        ...socialLinks[index],
        [field]: value,
      };

      return {
        ...current,
        socialLinks,
      };
    });
  };

  const updateCourseAboutLink = (
    index: number,
    field: keyof FooterLink,
    value: string
  ) => {
    setFooter((current) => {
      const courseAboutLinks = [...current.courseAboutLinks];

      courseAboutLinks[index] = {
        ...courseAboutLinks[index],
        [field]: value,
      };

      return {
        ...current,
        courseAboutLinks,
      };
    });
  };

  const updateLegalLink = (
    index: number,
    field: keyof FooterLink,
    value: string
  ) => {
    setFooter((current) => {
      const legalLinks = [...current.legalLinks];

      legalLinks[index] = {
        ...legalLinks[index],
        [field]: value,
      };

      return {
        ...current,
        legalLinks,
      };
    });
  };

  const updateBadge = (
    index: number,
    value: string
  ) => {
    setFooter((current) => {
      const footerBadges = [...current.footerBadges];

      footerBadges[index] = {
        ...footerBadges[index],
        label: value,
      };

      return {
        ...current,
        footerBadges,
      };
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!footer._id) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await adminApi(
        `/api/footer/${footer._id}`,
        {
          method: "PUT",
          requiresAuth: true,
          body: JSON.stringify({
            socialLinks: footer.socialLinks,
            footerContact: footer.footerContact,
            courseAboutLinks: footer.courseAboutLinks,
            legalLinks: footer.legalLinks,
            footerBadges: footer.footerBadges,
            copyright: footer.copyright,
            marketingStatement: footer.marketingStatement,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update footer"
        );
      }

      setFooter(result.data);
      setMessage("Footer updated successfully.");
    } catch (err) {
      console.error("Failed to update footer:", err);
      setError("Failed to update footer.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">
          Loading footer...
        </p>
      </div>
    );
  }

  if (error && !footer._id) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[3px] text-yellow-600">
          Website Content
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Footer
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Manage the content displayed in the website footer.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl space-y-6"
      >
        {/* SOCIAL LINKS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Social Links
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Manage the social media links shown at the top of the footer.
          </p>

          <div className="space-y-5">
            {footer.socialLinks.map((link, index) => (
              <div
                key={index}
                className="grid gap-4 md:grid-cols-2"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Label
                  </label>

                  <input
                    type="text"
                    value={link.label}
                    onChange={(event) =>
                      updateSocialLink(
                        index,
                        "label",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    URL
                  </label>

                  <input
                    type="url"
                    value={link.href}
                    onChange={(event) =>
                      updateSocialLink(
                        index,
                        "href",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Contact Information
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Manage the address, phone number and admissions email.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Address
              </label>

              <div className="space-y-3">
                {footer.footerContact.addressLines.map(
                  (line, index) => (
                    <input
                      key={index}
                      type="text"
                      value={line}
                      onChange={(event) =>
                        updateAddressLine(
                          index,
                          event.target.value
                        )
                      }
                      placeholder={`Address line ${index + 1}`}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  )
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Phone
                </label>

                <input
                  type="text"
                  value={footer.footerContact.phone}
                  onChange={(event) =>
                    setFooter((current) => ({
                      ...current,
                      footerContact: {
                        ...current.footerContact,
                        phone: event.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Phone Link
                </label>

                <input
                  type="text"
                  value={footer.footerContact.phoneHref}
                  onChange={(event) =>
                    setFooter((current) => ({
                      ...current,
                      footerContact: {
                        ...current.footerContact,
                        phoneHref: event.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Admissions Email
                </label>

                <input
                  type="email"
                  value={footer.footerContact.admissionsEmail}
                  onChange={(event) =>
                    setFooter((current) => ({
                      ...current,
                      footerContact: {
                        ...current.footerContact,
                        admissionsEmail: event.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Admissions Email Link
                </label>

                <input
                  type="text"
                  value={footer.footerContact.admissionsEmailHref}
                  onChange={(event) =>
                    setFooter((current) => ({
                      ...current,
                      footerContact: {
                        ...current.footerContact,
                        admissionsEmailHref:
                          event.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* COURSE / ABOUT LINKS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Course & About Links
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Manage the navigation links shown in the middle of the footer.
          </p>

          <div className="space-y-5">
            {footer.courseAboutLinks.map(
              (link, index) => (
                <div
                  key={index}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Label
                    </label>

                    <input
                      type="text"
                      value={link.label}
                      onChange={(event) =>
                        updateCourseAboutLink(
                          index,
                          "label",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      URL
                    </label>

                    <input
                      type="text"
                      value={link.href}
                      onChange={(event) =>
                        updateCourseAboutLink(
                          index,
                          "href",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* LEGAL LINKS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Legal Links
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Manage the legal navigation links.
          </p>

          <div className="space-y-5">
            {footer.legalLinks.map(
              (link, index) => (
                <div
                  key={index}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Label
                    </label>

                    <input
                      type="text"
                      value={link.label}
                      onChange={(event) =>
                        updateLegalLink(
                          index,
                          "label",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      URL
                    </label>

                    <input
                      type="text"
                      value={link.href}
                      onChange={(event) =>
                        updateLegalLink(
                          index,
                          "href",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* BADGES */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Footer Badges
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Manage the badges displayed at the bottom of the footer.
          </p>

          <div className="space-y-4">
            {footer.footerBadges.map(
              (badge, index) => (
                <div key={index}>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Badge {index + 1}
                  </label>

                  <input
                    type="text"
                    value={badge.label}
                    onChange={(event) =>
                      updateBadge(
                        index,
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>
              )
            )}
          </div>
        </section>

        {/* FOOTER COPY */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Footer Copy
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Manage the copyright and marketing statement.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Copyright
              </label>

              <input
                type="text"
                value={footer.copyright}
                onChange={(event) =>
                  setFooter((current) => ({
                    ...current,
                    copyright: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Marketing Statement
              </label>

              <textarea
                value={footer.marketingStatement}
                onChange={(event) =>
                  setFooter((current) => ({
                    ...current,
                    marketingStatement:
                      event.target.value,
                  }))
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              />
            </div>
          </div>
        </section>

        {/* MESSAGES */}
        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* SAVE */}
        <div className="flex justify-end rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#FFC62A] px-7 py-3 text-sm font-bold text-black transition hover:bg-[#eeb51c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}