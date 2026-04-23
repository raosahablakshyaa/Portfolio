"use client";

import Link from "next/link";
import { BarChart3, Briefcase, FileText, LayoutDashboard, MessageSquareMore, Settings, ShieldCheck, Star, Wrench } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard?tab=leads", label: "Leads", icon: MessageSquareMore },
  { href: "/admin/dashboard?tab=projects", label: "Projects", icon: Briefcase },
  { href: "/admin/dashboard?tab=services", label: "Services", icon: Wrench },
  { href: "/admin/dashboard?tab=testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/dashboard?tab=blogs", label: "Blog", icon: FileText },
  { href: "/admin/dashboard?tab=analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/dashboard?tab=settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-[#081018] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-accent/15 p-3 text-accent">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm text-white/50">Lakshya Yadav</p>
              <p className="font-semibold">Admin Panel</p>
            </div>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
