// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Blog from "./src/models/Blog.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "4mb" }));

// ---------------------- PATHS / STATIC ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use("/uploads", express.static(uploadDir));

const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");

// ---------------------- ✅ CORS FIX ----------------------
const allowedOrigins = [
  "http://localhost:5173",             // Local frontend
  "https://www.upendradommaraju.com",  // Production domain frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handles OPTIONS preflight requests
app.options("*", cors());

// ---------------------- ✅ DATABASE ----------------------
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is missing in environment!");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.MONGODB_DB || undefined,
});

// ---------------------- AUTH ----------------------
const BLOG_ADMIN_PASS = process.env.BLOG_ADMIN_PASS || "";
const BLOG_JWT_SECRET = process.env.BLOG_JWT_SECRET || "dev-secret";

const signToken = () => jwt.sign({ role: "admin" }, BLOG_JWT_SECRET, { expiresIn: "2h" });

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, BLOG_JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ---------------------- MULTER (File Upload to /uploads) ----------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ---------------------- RESPONSE HELPERS ----------------------
const formatBlogList = (b) => ({
  id: String(b._id),
  title: b.title,
  preview: (b.contentHtml || "").replace(/<[^>]+>/g, "").slice(0, 200),
  createdAt: b.createdAt.getTime(),
});

const formatBlogFull = (b) => ({
  id: String(b._id),
  title: b.title,
  contentHtml: b.contentHtml,
  createdAt: b.createdAt.getTime(),
  updatedAt: b.updatedAt.getTime(),
});

// ---------------------- API ROUTES ----------------------

// Login (Admin)
app.post("/api/blog/auth", (req, res) => {
  if (!BLOG_ADMIN_PASS) {
    return res.status(503).json({ error: "BLOG_ADMIN_PASS not set" });
  }
  if (req.body?.passcode !== BLOG_ADMIN_PASS) {
    return res.status(401).json({ error: "Wrong passcode" });
  }
  res.json({ token: signToken() });
});

// Upload image from blog editor
app.post("/api/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const pathPart = `/uploads/${req.file.filename}`;
  res.json({ url: `${PUBLIC_BASE_URL}${pathPart}`, path: pathPart });
});

// Public list of blogs
app.get("/api/blogs-public", async (_req, res) => {
  const rows = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(rows.map(formatBlogList));
});

// Public view of a blog
app.get("/api/blogs/:id-public", async (req, res) => {
  const blog = await Blog.findById(req.params.id).lean();
  if (!blog) return res.status(404).json({ error: "Not found" });
  res.json(formatBlogFull(blog));
});

// Admin - list of blogs
app.get("/api/blogs", auth, async (_req, res) => {
  const rows = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(rows.map(formatBlogList));
});

// Create a blog
app.post("/api/blogs", auth, async (req, res) => {
  const { title = "", contentHtml = "" } = req.body;
  if (!title.trim()) return res.status(400).json({ error: "Title required" });
  if (!contentHtml.trim()) return res.status(400).json({ error: "Content required" });

  const created = await Blog.create({ title: title.trim(), contentHtml });
  res.status(201).json(formatBlogFull(created));
});

// Update a blog
app.put("/api/blogs/:id", auth, async (req, res) => {
  const row = await Blog.findById(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });

  if (typeof req.body.title === "string") row.title = req.body.title.trim();
  if (typeof req.body.contentHtml === "string") row.contentHtml = req.body.contentHtml;
  await row.save();

  res.json(formatBlogFull(row));
});

// Delete a blog
app.delete("/api/blogs/:id", auth, async (req, res) => {
  await Blog.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---------------------- SERVER START ----------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
