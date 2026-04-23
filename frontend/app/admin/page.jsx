"use client";

import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

const ADMIN_EMAIL = "lakshyayadav314@gmail.com";
const ADMIN_PASSWORD = "Raosahab_lakshya@2506";
const ADMIN_SESSION_KEY = "lakshya_admin_session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.email.trim().toLowerCase() === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      router.push("/admin/dashboard");
      return;
    }

    setError("Invalid admin credentials.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#081018] px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-white shadow-panel backdrop-blur-2xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-accent/15 p-4 text-accent">
            <ShieldCheck />
          </div>
          <div>
            <p className="text-sm text-white/50">Secure access</p>
            <h1 className="text-2xl font-semibold">Admin Login</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="email"
            placeholder="Admin email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm outline-none"
          />
          <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">
            <LockKeyhole size={16} />
            Sign In
          </button>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>
      </div>
    </main>
  );
}
