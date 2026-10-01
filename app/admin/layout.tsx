"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

const isTokenValid = (token: string | null) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

interface AdminLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Courses",
    href: "/admin/courses",
  },
  {
    label: "Student Works",
    href: "/admin/student-works",
  },
  {
    label: "Tutors",
    href: "/admin/tutors",
  },
  {
    label: "Placements",
    href: "/admin/placements",
  },
  {
    label: "Skills",
    href: "/admin/skills",
  },
  {
    label: "Hero",
    href: "/admin/hero",
  },
  { 
    label: "Challenge", 
    href: "/admin/challenge", 
  },
  { 
    label: "Partners", 
    href: "/admin/partners",
   },
  {
    label: "Industries",
    href: "/admin/industries",
  },
  {
    label: "Certificate",
    href: "/admin/certificate",
  },
  {
    label: "Government Certificates",
    href: "/admin/gov-certificates",
  },
  {
    label: "Placement Section",
    href: "/admin/placement-section",
  },
  {
    label: "Footer",
    href: "/admin/footer",
  },
  {
    label: "Navbar",
    href: "/admin/navbar",
  },
];

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login" || isAuthorized) return;

    const redirectToLogin = () => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      router.replace("/admin/login");
    };

    if (!isTokenValid(localStorage.getItem("adminToken"))) {
      redirectToLogin();
      return;
    }

    // Confirm the session against the admin account in the database
    adminApi("/api/auth/me", { requiresAuth: true })
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok || !result.success) {
          redirectToLogin();
          return;
        }

        localStorage.setItem("admin", JSON.stringify(result.data));
        setIsAuthorized(true);
      })
      .catch(redirectToLogin);
  }, [pathname, router, isAuthorized]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setIsAuthorized(false);
    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") {
    return (
      <div className="text-gray-900 scheme-light">{children}</div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 scheme-light">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white">
        {/* HEADER — FIXED */}
        <div className="shrink-0 border-b border-gray-200 px-6 py-5">
          <h1 className="text-xl font-bold text-gray-900">
            TAC Admin
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Website Management
          </p>
        </div>

        {/* NAVIGATION — SCROLLABLE */}
        <nav className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* LOGOUT — ALWAYS VISIBLE */}
        <div className="shrink-0 border-t border-gray-200 bg-white p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="ml-64 min-h-screen flex-1">
        {children}
      </div>
    </div>
  );
}