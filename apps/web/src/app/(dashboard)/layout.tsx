"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MessageCircle,
  Leaf,
  Pill,
  CalendarDays,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/remedies", label: "Remedies", icon: Leaf },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen" style={{ background: "var(--color-surface)" }}>
      {/* ─── Mobile Overlay ──────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "var(--color-surface-overlay)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed md:static z-50 h-full flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          width: "var(--sidebar-width)",
          background: "var(--color-surface-secondary)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))" }}
          >
            N
          </div>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            NurseAda
          </span>
          <button
            className="ml-auto md:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} style={{ color: "var(--color-text-secondary)" }} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? "var(--color-brand-500)" : "transparent",
                  color: isActive ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--color-border)" }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-all hover:opacity-80"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div
          className="md:hidden flex items-center px-4 py-3"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu size={22} style={{ color: "var(--color-text-primary)" }} />
          </button>
          <span
            className="ml-3 font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            NurseAda
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
