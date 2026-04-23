"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  BarChart3,
  Briefcase,
  FileText,
  LogOut,
  MessageSquareMore,
  PlusCircle,
  Settings,
  Star,
  Trash2,
  Upload,
  Wrench
} from "lucide-react";
import { siteContent } from "@/lib/site-data";

const ADMIN_SESSION_KEY = "lakshya_admin_session";
const ADMIN_DATA_KEY = "lakshya_admin_dashboard_data";

const blankForms = {
  projects: { title: "", description: "", techStack: "", category: "", imageUrl: "", liveUrl: "", githubUrl: "", impact: "", status: "active" },
  services: { title: "", description: "", icon: "" },
  testimonials: { name: "", role: "", quote: "", rating: 5 },
  blogs: { title: "", excerpt: "", content: "", slug: "", category: "" },
  settings: { email: "lakshyayadav314@gmail.com", phone: "+91 8569934323", linkedin: "", github: "", instagram: "", whatsapp: "https://wa.me/918569934323", calendly: "", resumeUrl: "/resume.pdf" }
};

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultData() {
  return {
    leads: [],
    projects: [],
    services: siteContent.services.map((item) => ({ ...item, _id: createId("service") })),
    testimonials: siteContent.testimonials.map((item) => ({ ...item, _id: createId("testimonial") })),
    blogs: siteContent.blog.map((item) => ({ ...item, _id: createId("blog"), slug: item.title.toLowerCase().replace(/\s+/g, "-"), content: item.excerpt })),
    settings: { ...blankForms.settings }
  };
}

function readAdminData() {
  if (typeof window === "undefined") return createDefaultData();

  const raw = window.localStorage.getItem(ADMIN_DATA_KEY);
  if (!raw) return createDefaultData();

  try {
    return JSON.parse(raw);
  } catch {
    return createDefaultData();
  }
}

function writeAdminData(data) {
  window.localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
}

function computeDashboard(data) {
  const leadBreakdownMap = data.leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalLeads: data.leads.length,
    newInquiries: data.leads.filter((lead) => lead.status === "new").length,
    activeProjects: data.projects.filter((project) => project.status !== "completed").length,
    completedProjects: data.projects.filter((project) => project.status === "completed").length,
    testimonialsCount: data.testimonials.length,
    blogCount: data.blogs.length,
    leadBreakdown: Object.entries(leadBreakdownMap).map(([key, count]) => ({ _id: key, count }))
  };
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl ${className}`}>{children}</div>;
}

export function AdminDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") || "overview";
  const [collections, setCollections] = useState(createDefaultData());
  const [forms, setForms] = useState(blankForms);
  const [statusFilter, setStatusFilter] = useState("all");
  const [session, setSession] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    setSession(window.localStorage.getItem(ADMIN_SESSION_KEY) || "");
    const data = readAdminData();
    setCollections(data);
    setForms((current) => ({
      ...current,
      settings: data.settings || blankForms.settings
    }));
  }, []);

  const dashboard = useMemo(() => computeDashboard(collections), [collections]);

  const filteredLeads = useMemo(() => {
    if (statusFilter === "all") return collections.leads;
    return collections.leads.filter((lead) => lead.status === statusFilter);
  }, [collections.leads, statusFilter]);

  const updateCollections = (updater, successMessage = "") => {
    setCollections((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      writeAdminData(next);
      return next;
    });

    if (successMessage) setMessage(successMessage);
  };

  const submitResource = (resource, body) => {
    const payload = {
      ...body,
      _id: createId(resource.slice(0, -1)),
      createdAt: new Date().toISOString()
    };

    if (resource === "projects") {
      payload.techStack = typeof body.techStack === "string"
        ? body.techStack.split(",").map((item) => item.trim()).filter(Boolean)
        : body.techStack || [];
      payload.status = body.status || "active";
    }

    updateCollections(
      (current) => ({ ...current, [resource]: [payload, ...current[resource]] }),
      `${resource.slice(0, -1)} saved successfully.`
    );
    setForms((current) => ({ ...current, [resource]: blankForms[resource] }));
  };

  const deleteResource = (resource, id) => {
    updateCollections(
      (current) => ({ ...current, [resource]: current[resource].filter((item) => item._id !== id) }),
      `${resource.slice(0, -1)} deleted.`
    );
  };

  const updateLeadStatus = (id, status) => {
    updateCollections(
      (current) => ({
        ...current,
        leads: current.leads.map((lead) => (lead._id === id ? { ...lead, status } : lead))
      }),
      "Lead status updated."
    );
  };

  const saveSettings = () => {
    updateCollections(
      (current) => ({ ...current, settings: forms.settings }),
      "Contact settings updated."
    );
  };

  const uploadFile = async (file, onSuccess) => {
    if (!file) return;

    setUploading(file.name);

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("File upload failed"));
      reader.readAsDataURL(file);
    });

    onSuccess(dataUrl);
    setUploading("");
    setMessage(`Attached ${file.name}`);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin");
  };

  if (!session) {
    return (
      <Card>
        <p className="text-lg font-semibold">Admin session not found.</p>
        <p className="mt-2 text-white/60">Log in from the admin page to access the dashboard.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Command Center</p>
          <h1 className="mt-2 text-3xl font-semibold">Portfolio Business Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {message ? <p className="rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">{message}</p> : null}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </Card>

      {(activeTab === "overview" || activeTab === "analytics") && (
        <div className="grid gap-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Total Leads", value: dashboard.totalLeads, icon: MessageSquareMore },
              { label: "New Inquiries", value: dashboard.newInquiries, icon: Activity },
              { label: "Active Projects", value: dashboard.activeProjects, icon: Briefcase },
              { label: "Completed Projects", value: dashboard.completedProjects, icon: BarChart3 },
              { label: "Testimonials", value: dashboard.testimonialsCount, icon: Star },
              { label: "Blog Posts", value: dashboard.blogCount, icon: FileText }
            ].map((item) => (
              <Card key={item.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50">{item.label}</p>
                    <p className="mt-3 text-4xl font-semibold">{item.value}</p>
                  </div>
                  <item.icon className="text-accent" />
                </div>
              </Card>
            ))}
          </div>
          <Card>
            <h2 className="text-xl font-semibold">Analytics Snapshot</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {(dashboard.leadBreakdown.length ? dashboard.leadBreakdown : [{ _id: "new", count: 0 }]).map((item) => (
                <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/50">{item._id || "unknown"}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.count}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "leads" && (
        <Card>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Lead Management</h2>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-white/10 bg-[#0d1621] px-4 py-3 text-sm outline-none"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="grid gap-4">
            {filteredLeads.length ? filteredLeads.map((lead) => (
              <div key={lead._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{lead.name}</p>
                    <p className="text-sm text-white/50">
                      {lead.email} • {lead.company || "Independent"} • {lead.projectType || "General"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["new", "contacted", "closed"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateLeadStatus(lead._id, status)}
                        className={`rounded-full px-3 py-2 text-xs ${lead.status === status ? "bg-accent text-ink" : "bg-white/5 text-white/70"}`}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => deleteResource("leads", lead._id)}
                      className="rounded-full bg-red-500/15 px-3 py-2 text-xs text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/70">{lead.message}</p>
              </div>
            )) : <p className="text-white/60">No leads saved yet.</p>}
          </div>
        </Card>
      )}

      {["projects", "services", "testimonials", "blogs"].includes(activeTab) && (
        <CrudSection
          activeTab={activeTab}
          forms={forms}
          setForms={setForms}
          collections={collections}
          submitResource={submitResource}
          deleteResource={deleteResource}
          uploadFile={uploadFile}
          uploading={uploading}
          setMessage={setMessage}
        />
      )}

      {activeTab === "settings" && (
        <Card>
          <div className="flex items-center gap-3">
            <Settings className="text-accent" />
            <h2 className="text-2xl font-semibold">Contact Settings & Resume</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.entries(forms.settings).map(([key, value]) => (
              <input
                key={key}
                value={value || ""}
                onChange={(event) =>
                  setForms((current) => ({
                    ...current,
                    settings: { ...current.settings, [key]: event.target.value }
                  }))
                }
                placeholder={key}
                className="rounded-2xl border border-white/10 bg-[#0d1621] px-4 py-4 text-sm outline-none"
              />
            ))}
          </div>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75">
            <Upload size={16} />
            {uploading || "Attach resume file"}
            <input
              type="file"
              className="hidden"
              onChange={async (event) => {
                try {
                  await uploadFile(event.target.files?.[0], (url) =>
                    setForms((current) => ({
                      ...current,
                      settings: { ...current.settings, resumeUrl: url }
                    }))
                  );
                } catch (error) {
                  setMessage(error.message);
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={saveSettings}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"
          >
            <Upload size={16} />
            Save Settings
          </button>
        </Card>
      )}
    </div>
  );
}

function CrudSection({ activeTab, forms, setForms, collections, submitResource, deleteResource, uploadFile, uploading, setMessage }) {
  const config = {
    projects: {
      title: "Portfolio Management",
      icon: Briefcase,
      fields: ["title", "description", "techStack", "category", "imageUrl", "liveUrl", "githubUrl", "impact", "status"]
    },
    services: {
      title: "Services Management",
      icon: Wrench,
      fields: ["title", "description", "icon"]
    },
    testimonials: {
      title: "Testimonials Management",
      icon: Star,
      fields: ["name", "role", "quote", "rating"]
    },
    blogs: {
      title: "Blog Management",
      icon: FileText,
      fields: ["title", "excerpt", "content", "slug", "category"]
    }
  }[activeTab];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="flex items-center gap-3">
          <config.icon className="text-accent" />
          <h2 className="text-2xl font-semibold">{config.title}</h2>
        </div>
        <div className="mt-6 grid gap-4">
          {config.fields.map((field) =>
            field === "description" || field === "quote" || field === "content" || field === "impact" ? (
              <textarea
                key={field}
                value={forms[activeTab][field]}
                onChange={(event) =>
                  setForms((current) => ({
                    ...current,
                    [activeTab]: { ...current[activeTab], [field]: event.target.value }
                  }))
                }
                placeholder={field}
                className="min-h-[120px] rounded-2xl border border-white/10 bg-[#0d1621] px-4 py-4 text-sm outline-none"
              />
            ) : (
              <input
                key={field}
                value={forms[activeTab][field]}
                onChange={(event) =>
                  setForms((current) => ({
                    ...current,
                    [activeTab]: { ...current[activeTab], [field]: event.target.value }
                  }))
                }
                placeholder={field}
                className="rounded-2xl border border-white/10 bg-[#0d1621] px-4 py-4 text-sm outline-none"
              />
            )
          )}
        </div>
        {activeTab === "projects" ? (
          <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75">
            <Upload size={16} />
            {uploading || "Attach project image"}
            <input
              type="file"
              className="hidden"
              onChange={async (event) => {
                try {
                  await uploadFile(event.target.files?.[0], (url) =>
                    setForms((current) => ({
                      ...current,
                      projects: { ...current.projects, imageUrl: url }
                    }))
                  );
                } catch (error) {
                  setMessage(error.message);
                }
              }}
            />
          </label>
        ) : null}
        <button
          type="button"
          onClick={() => submitResource(activeTab, forms[activeTab])}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"
        >
          <PlusCircle size={16} />
          Save {activeTab.slice(0, -1)}
        </button>
      </Card>
      <Card>
        <h3 className="text-xl font-semibold">Existing {activeTab}</h3>
        <div className="mt-6 grid gap-4">
          {collections[activeTab].length ? collections[activeTab].map((item) => (
            <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.title || item.name}</p>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {item.description || item.quote || item.excerpt}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteResource(activeTab, item._id)}
                  className="rounded-full bg-red-500/15 p-3 text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : <p className="text-white/60">No {activeTab} saved yet.</p>}
        </div>
      </Card>
    </div>
  );
}
