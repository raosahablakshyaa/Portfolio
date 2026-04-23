const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { AdminUser, Service, Project, Testimonial, Blog, ContactSettings } = require("./models");

async function ensureDefaultAdmin() {
  const adminEmail = "lakshyayadav314@gmail.com";
  const adminPassword = "Raosahab_lakshya@2506";
  let existing = await AdminUser.findOne({ email: adminEmail });

  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    existing = await AdminUser.create({
      email: adminEmail,
      passwordHash,
      name: "Lakshya Yadav"
    });
  } else {
    existing.name = "Lakshya Yadav";
    existing.passwordHash = await bcrypt.hash(adminPassword, 10);
    await existing.save();
  }

  return existing;
}

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

async function sendLeadNotification(lead) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "lakshyayadav314@gmail.com";

  const transport = nodemailer.createTransport({
    jsonTransport: true
  });

  await transport.sendMail({
    to: adminEmail,
    from: adminEmail,
    subject: `New project inquiry from ${lead.name}`,
    text: `${lead.name} (${lead.email}) submitted a ${lead.projectType || "general"} inquiry.\n\n${lead.message}`
  });
}

async function seedBaseContent() {
  await Project.deleteMany({
    title: {
      $in: ["AI Sales Automation Suite", "Premium Founder Portfolio", "SaaS Admin Intelligence Panel"]
    }
  });

  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany([
      { title: "Full Stack Website Development", description: "Premium websites, apps, and custom experiences." },
      { title: "AI Automation Solutions", description: "Workflow automation, AI copilots, and smart integrations." },
      { title: "Admin Dashboard Development", description: "Secure dashboards for analytics, CRM, and operations." }
    ]);
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany([
      {
        name: "Aarav Mehta",
        role: "Startup Founder",
        quote: "The final delivery felt like a high-end studio product, not a generic freelancer build.",
        rating: 5
      }
    ]);
  }

  if ((await Blog.countDocuments()) === 0) {
    await Blog.insertMany([
      {
        title: "How Premium Developer Portfolios Win Better Clients",
        slug: "premium-developer-portfolios",
        excerpt: "How trust, clarity, and positioning increase project quality.",
        content: "Draft post content.",
        category: "Portfolio"
      }
    ]);
  }

  await ContactSettings.updateOne(
    {},
    {
      email: "lakshyayadav314@gmail.com",
      phone: "+91 8569934323",
      linkedin: "https://linkedin.com/",
      github: "https://github.com/",
      instagram: "https://instagram.com/",
      whatsapp: "https://wa.me/918569934323",
      calendly: "https://calendly.com/",
      resumeUrl: "/resume.pdf"
    },
    { upsert: true }
  );
}

function normalizePayload(resource, payload) {
  if (resource === "projects") {
    return {
      ...payload,
      techStack: typeof payload.techStack === "string"
        ? payload.techStack.split(",").map((item) => item.trim()).filter(Boolean)
        : payload.techStack
    };
  }

  return payload;
}

module.exports = {
  ensureDefaultAdmin,
  createToken,
  sendLeadNotification,
  seedBaseContent,
  normalizePayload
};
