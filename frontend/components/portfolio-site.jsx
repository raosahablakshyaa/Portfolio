"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Star
} from "lucide-react";
import { siteContent, metrics } from "@/lib/site-data";
import { LeadFormClient } from "@/components/lead-form-client";
import { ThemeToggle } from "@/components/theme-toggle";

const ADMIN_DATA_KEY = "lakshya_admin_dashboard_data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay }
  })
};

function SectionTitle({ eyebrow, title, copy }) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-white/70 md:text-lg">{copy}</p>
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-panel backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function PortfolioSite() {
  const [dynamicContent, setDynamicContent] = useState({
    projects: siteContent.projects,
    services: siteContent.services,
    testimonials: siteContent.testimonials,
    blogs: siteContent.blog,
    settings: siteContent.social
  });

  useEffect(() => {
    const syncFromLocalData = () => {
      try {
        const raw = window.localStorage.getItem(ADMIN_DATA_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        setDynamicContent({
          projects: parsed.projects?.length ? parsed.projects : siteContent.projects,
          services: parsed.services?.length ? parsed.services : siteContent.services,
          testimonials: parsed.testimonials?.length ? parsed.testimonials : siteContent.testimonials,
          blogs: parsed.blogs?.length ? parsed.blogs : siteContent.blog,
          settings: parsed.settings || siteContent.social
        });
      } catch {
        setDynamicContent({
          projects: siteContent.projects,
          services: siteContent.services,
          testimonials: siteContent.testimonials,
          blogs: siteContent.blog,
          settings: siteContent.social
        });
      }
    };

    syncFromLocalData();
    window.addEventListener("storage", syncFromLocalData);
    window.addEventListener("focus", syncFromLocalData);

    return () => {
      window.removeEventListener("storage", syncFromLocalData);
      window.removeEventListener("focus", syncFromLocalData);
    };
  }, []);

  return (
    <main className="relative overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,240,200,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,142,124,0.12),transparent_28%)]" />
      <section className="relative mx-auto min-h-screen max-w-7xl px-6 pb-16 pt-8 md:px-10">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm text-white/50">Lakshya Yadav</p>
            <p className="text-lg font-semibold text-white">Freelance Developer & AI Engineer</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/admin"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:border-accent/50 hover:text-white"
            >
              Admin Login
            </Link>
          </div>
        </motion.header>

        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.05}
            variants={fadeUp}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
              <Sparkles size={16} />
              Premium engineering for ambitious founders and teams
            </span>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl">
                {siteContent.tagline}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
                {siteContent.intro}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-[1.02]"
              >
                Hire Me
                <ArrowRight size={16} />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/40 hover:bg-white/10"
              >
                View Projects
              </a>
              <a
                href={siteContent.social.calendly}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/15"
              >
                Book a Call
                <CalendarDays size={16} />
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial="hidden"
                  animate="visible"
                  custom={0.1 + index * 0.08}
                  variants={fadeUp}
                >
                  <GlassCard>
                    <p className="text-3xl font-semibold text-white">{metric.value}</p>
                    <p className="mt-2 text-sm text-white/60">{metric.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
            className="relative"
          >
            <div className="absolute inset-0 scale-95 rounded-[36px] bg-gradient-to-br from-accent/20 via-transparent to-coral/20 blur-3xl" />
            <GlassCard className="relative overflow-hidden border-white/15 p-0">
              <div className="bg-hero-grid p-8">
                <div className="rounded-[28px] border border-white/10 bg-ink/80 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">Selected positioning</p>
                      <p className="text-xl font-semibold text-white">High-ticket web + AI partner</p>
                    </div>
                    <BadgeCheck className="text-accent" />
                  </div>
                  <div className="space-y-4">
                    {[
                      "Web platforms that feel premium and convert seriously",
                      "AI workflows that reduce manual operations",
                      "Recruiter-friendly presentation for internship applications"
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                        <p className="text-sm leading-7 text-white/75">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionTitle
          eyebrow="About"
          title="Engineered for trust, clarity, and modern product execution"
          copy={siteContent.about}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-2xl font-semibold text-white">Profile</h3>
            <p className="mt-4 text-white/70">{siteContent.intro}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {["Full-Stack Systems", "AI Integrations", "Product UI", "Automation Flows", "Admin Panels", "Growth-Focused Design"].map(
                (skill) => (
                  <div
                    key={skill}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    {skill}
                  </div>
                )
              )}
            </div>
          </GlassCard>
          <GlassCard className="grid gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Education & Experience</h3>
              <ul className="mt-4 space-y-3 text-white/70">
                {[...siteContent.education, ...siteContent.experience].map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Certifications & Goals</h3>
              <ul className="mt-4 space-y-3 text-white/70">
                {siteContent.certifications.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 p-4 text-gold/90">
                {siteContent.internshipGoals}
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionTitle
          eyebrow="Services"
          title="Premium execution across product, web, and AI systems"
          copy="Structured to help founders and businesses move faster with modern engineering, conversion-aware interfaces, and durable operational systems."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dynamicContent.services.map((service, index) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index * 0.05}
              variants={fadeUp}
            >
              <GlassCard className="h-full">
                <BriefcaseBusiness className="text-accent" />
                <h3 className="mt-5 text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{service.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionTitle
          eyebrow="Projects"
          title="Selected work that combines polish, systems thinking, and business impact"
          copy="Every project is positioned to communicate capability, trust, and measurable value instead of just listing code."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {dynamicContent.projects.length ? dynamicContent.projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index * 0.08}
              variants={fadeUp}
            >
              <GlassCard className="h-full overflow-hidden p-0">
                <div className="relative h-60">
                  <Image
                    src={project.image || project.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-accent">{project.category}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tech || project.techStack || []).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent/90">
                    {project.impact}
                  </p>
                  <div className="mt-6 flex gap-4 text-sm text-white/80">
                    <a href={project.liveUrl} className="inline-flex items-center gap-2 hover:text-accent">
                      <Globe size={16} />
                      Live Demo
                    </a>
                    <a href={project.githubUrl} className="inline-flex items-center gap-2 hover:text-accent">
                      <Github size={16} />
                      GitHub
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )) : (
            <GlassCard className="lg:col-span-3">
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Projects</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Real case studies are being prepared</h3>
              <p className="mt-4 max-w-2xl text-white/70">
                The dummy showcase has been removed. Add your live projects from the admin panel and they will appear here automatically.
              </p>
            </GlassCard>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionTitle
          eyebrow="Testimonials"
          title="Proof that the work feels premium in the real world"
          copy="Strong presentation matters, but client confidence comes from outcomes, communication, and execution quality."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {dynamicContent.testimonials.map((testimonial) => (
            <GlassCard key={testimonial.name}>
              <div className="flex gap-1 text-gold">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-base leading-8 text-white/75">"{testimonial.quote}"</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/50">{testimonial.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard>
            <SectionTitle
              eyebrow="Internships"
              title="Open to elite internship opportunities"
              copy="This section is designed for recruiters who want a clear snapshot of technical depth, growth mindset, and readiness for high-learning environments."
            />
            <div className="mt-8 space-y-4">
              {[
                "Available for remote and hybrid internship opportunities",
                "Focused on software engineering, AI engineering, and product engineering roles",
                "Interested in top-tier early career programs including Google STEP and global product teams"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>
            <a
              href="/resume.pdf"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              <Download size={16} />
              Download Resume
            </a>
          </GlassCard>

          <LeadForm />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionTitle
          eyebrow="Insights"
          title="Thoughtful writing for authority, search visibility, and trust"
          copy="A strong blog adds credibility for both clients and recruiters by showing how you think, communicate, and solve problems."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {dynamicContent.blogs.map((post) => (
            <GlassCard key={post.title}>
              <BookOpenText className="text-accent" />
              <h3 className="mt-4 text-xl font-semibold text-white">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{post.excerpt}</p>
              <button className="mt-6 inline-flex items-center gap-2 text-sm text-accent">
                Read Article
                <ArrowRight size={16} />
              </button>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <GlassCard className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-accent">Contact</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">
              Let’s build something that looks world-class and performs like it.
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              Reach out for client work, collaborations, consulting, or internship opportunities.
            </p>
            <div className="mt-8 grid gap-4">
                {[
                { icon: Mail, label: dynamicContent.settings.email || siteContent.social.email, href: `mailto:${dynamicContent.settings.email || siteContent.social.email}` },
                { icon: PhoneCall, label: dynamicContent.settings.phone || siteContent.social.phone, href: dynamicContent.settings.whatsapp || siteContent.social.whatsapp },
                { icon: MessageCircle, label: "WhatsApp", href: dynamicContent.settings.whatsapp || siteContent.social.whatsapp },
                { icon: Linkedin, label: "LinkedIn", href: dynamicContent.settings.linkedin || siteContent.social.linkedin },
                { icon: Github, label: "GitHub", href: dynamicContent.settings.github || siteContent.social.github },
                { icon: Instagram, label: "Instagram", href: dynamicContent.settings.instagram || siteContent.social.instagram },
                { icon: CalendarDays, label: "Calendly", href: dynamicContent.settings.calendly || siteContent.social.calendly }
              ].map((item) => (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white/80 transition hover:border-accent/40 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ArrowRight size={16} />
                </a>
              ))}
            </div>
          </div>
          <GlassCard className="bg-white/[0.03]">
            <p className="text-sm uppercase tracking-[0.35em] text-accent">Availability</p>
            <div className="mt-4 grid gap-4">
              {[
                "Freelance projects",
                "Long-term product partnerships",
                "Portfolio/recruiter conversations",
                "Remote internship opportunities"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] border border-gold/20 bg-gold/10 p-6 text-gold/90">
              <p className="text-sm uppercase tracking-[0.25em]">Response promise</p>
              <p className="mt-3 text-lg">
                Clear communication, structured scope discussion, and a premium delivery mindset from the first conversation.
              </p>
            </div>
          </GlassCard>
        </GlassCard>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/45 md:px-10">
        <p>© 2026 Lakshya Yadav. Designed for premium client trust, serious product work, and career growth.</p>
      </footer>
    </main>
  );
}

function LeadForm() {
  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <PhoneCall className="text-accent" />
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Lead Form</p>
          <h3 className="text-2xl font-semibold text-white">Start a project conversation</h3>
        </div>
      </div>
      <LeadFormClient />
    </GlassCard>
  );
}
