const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { requireAuth } = require("./middleware/auth");
const { AdminUser, Blog, ContactSettings, Lead, Project, Service, Testimonial } = require("./models");
const { createToken, normalizePayload, sendLeadNotification } = require("./utils");

const app = express();
const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.7.8.139:3000",
    "null"
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.options("*", cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  return res.json({
    token: createToken(user),
    user: { email: user.email, name: user.name }
  });
});

app.use((error, req, res, next) => {
  if (error?.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ message: error.message });
  }

  return next(error);
});

app.post("/api/public/leads", async (req, res) => {
  const lead = await Lead.create(req.body);
  await sendLeadNotification(lead);
  return res.status(201).json({ data: lead, message: "Inquiry submitted." });
});

app.get("/api/public/content", async (_, res) => {
  const [projects, services, testimonials, blogs, settings] = await Promise.all([
    Project.find().sort({ createdAt: -1 }),
    Service.find().sort({ createdAt: -1 }),
    Testimonial.find().sort({ createdAt: -1 }),
    Blog.find({ published: true }).sort({ createdAt: -1 }),
    ContactSettings.findOne().sort({ createdAt: -1 })
  ]);

  res.json({ data: { projects, services, testimonials, blogs, settings } });
});

app.get("/api/dashboard", requireAuth, async (_, res) => {
  const [totalLeads, newInquiries, activeProjects, completedProjects, testimonialsCount, blogCount, leadBreakdown] =
    await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Project.countDocuments({ status: "active" }),
      Project.countDocuments({ status: "completed" }),
      Testimonial.countDocuments(),
      Blog.countDocuments(),
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

  res.json({
    data: {
      totalLeads,
      newInquiries,
      activeProjects,
      completedProjects,
      testimonialsCount,
      blogCount,
      leadBreakdown
    }
  });
});

function collectionRouter(model, resourceName) {
  const router = express.Router();

  router.get("/", requireAuth, async (_, res) => {
    const data = await model.find().sort({ createdAt: -1 });
    res.json({ data });
  });

  router.post("/", requireAuth, async (req, res) => {
    const data = await model.create(normalizePayload(resourceName, req.body));
    res.status(201).json({ data });
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    await model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  });

  return router;
}

app.use("/api/projects", collectionRouter(Project, "projects"));
app.use("/api/services", collectionRouter(Service, "services"));
app.use("/api/testimonials", collectionRouter(Testimonial, "testimonials"));
app.use("/api/blogs", collectionRouter(Blog, "blogs"));

app.get("/api/leads", requireAuth, async (_, res) => {
  const data = await Lead.find().sort({ createdAt: -1 });
  res.json({ data });
});

app.patch("/api/leads/:id", requireAuth, async (req, res) => {
  const data = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ data });
});

app.delete("/api/leads/:id", requireAuth, async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.get("/api/settings", requireAuth, async (_, res) => {
  const data = await ContactSettings.findOne().sort({ createdAt: -1 });
  res.json({ data });
});

app.put("/api/settings", requireAuth, async (req, res) => {
  const existing = await ContactSettings.findOne();
  const data = existing
    ? await ContactSettings.findByIdAndUpdate(existing._id, req.body, { new: true })
    : await ContactSettings.create(req.body);
  res.json({ data });
});

app.post("/api/uploads", requireAuth, upload.single("file"), async (req, res) => {
  res.status(201).json({
    data: {
      fileName: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    }
  });
});

module.exports = app;
