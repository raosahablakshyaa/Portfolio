"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

const initialState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budget: "",
  deadline: "",
  message: ""
};

export function LeadFormClient() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your inquiry..." });

    try {
      await apiFetch("/public/leads", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setForm(initialState);
      setStatus({ type: "success", message: "Inquiry submitted successfully. Lakshya will get back to you soon." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
      {[
        { name: "name", placeholder: "Name" },
        { name: "email", placeholder: "Email", type: "email" },
        { name: "phone", placeholder: "Phone" },
        { name: "company", placeholder: "Company" },
        { name: "projectType", placeholder: "Project Type" },
        { name: "budget", placeholder: "Budget" },
        { name: "deadline", placeholder: "Deadline" }
      ].map((field) => (
        <input
          key={field.name}
          required={field.name === "name" || field.name === "email" || field.name === "projectType"}
          name={field.name}
          type={field.type || "text"}
          value={form[field.name]}
          onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
          placeholder={field.placeholder}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-accent/40"
        />
      ))}
      <textarea
        required
        name="message"
        value={form.message}
        onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        placeholder="Tell me about your idea, goals, audience, and timeline."
        className="min-h-[160px] rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-accent/40 md:col-span-2"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink md:col-span-2"
      >
        Send Inquiry
        <ArrowRight size={16} />
      </button>
      {status.message ? (
        <p className={`text-sm md:col-span-2 ${status.type === "error" ? "text-red-300" : "text-accent"}`}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
