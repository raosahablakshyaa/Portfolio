const mongoose = require("mongoose");

const timestampOptions = { timestamps: true };

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Lakshya Admin" }
  },
  timestampOptions
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    projectType: String,
    budget: String,
    deadline: String,
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" }
  },
  timestampOptions
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    category: String,
    imageUrl: String,
    liveUrl: String,
    githubUrl: String,
    impact: String,
    status: { type: String, enum: ["active", "completed"], default: "active" }
  },
  timestampOptions
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: String
  },
  timestampOptions
);

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: String,
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 }
  },
  timestampOptions
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    category: String,
    published: { type: Boolean, default: true }
  },
  timestampOptions
);

const contactSettingsSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    instagram: String,
    whatsapp: String,
    calendly: String,
    resumeUrl: String
  },
  timestampOptions
);

module.exports = {
  AdminUser: mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema),
  Lead: mongoose.models.Lead || mongoose.model("Lead", leadSchema),
  Project: mongoose.models.Project || mongoose.model("Project", projectSchema),
  Service: mongoose.models.Service || mongoose.model("Service", serviceSchema),
  Testimonial: mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema),
  Blog: mongoose.models.Blog || mongoose.model("Blog", blogSchema),
  ContactSettings:
    mongoose.models.ContactSettings || mongoose.model("ContactSettings", contactSettingsSchema)
};
