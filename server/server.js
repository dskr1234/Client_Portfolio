// server/server.js
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
app.use(express.json({ limit: "5mb" }));

// ✅ Static Upload Directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // React local
  "https://your-deployed-site.com", // Production URL
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ MongoDB Connection
await mongoose
  .connect(process.env.MONGODB_URI, { dbName: "clientDB" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Auth Setup
const BLOG_ADMIN_PASS = process.env.BLOG_ADMIN_PASS || "admin123";
const BLOG_JWT_SECRET = process.env.BLOG_JWT_SECRET || "secretkey";

const signToken = () =>
  jwt.sign({ role: "admin" }, BLOG_JWT_SECRET, { expiresIn: "2h" });

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

// ✅ Multer Setup (for images)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ✅ Format Helpers
const formatBlogList = (b) => ({
  id: String(b._id),
  title: b.title,
  preview: (b.contentHtml || "").replace(/<[^>]+>/g, "").slice(0, 200),
  contentHtml: b.contentHtml,
  createdAt: b.createdAt,
});

const formatBlogFull = (b) => ({
  id: String(b._id),
  title: b.title,
  contentHtml: b.contentHtml,
  createdAt: b.createdAt,
  updatedAt: b.updatedAt,
});

// ==================== ROUTES ====================

// ✅ Login - Generate Token
app.post("/api/blog/auth", (req, res) => {
  if ((req.body?.passcode || "") !== BLOG_ADMIN_PASS)
    return res.status(401).json({ error: "Wrong passcode" });
  res.json({ token: signToken() });
});

// ✅ Upload Image
app.post("/api/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  res.json({ url });
});

// ✅ Public - List Blogs
app.get("/api/blogs-public", async (_, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(blogs.map(formatBlogList));
});

// ✅ Public - Single Blog
app.get("/api/blogs/:id-public", async (req, res) => {
  const b = await Blog.findById(req.params.id).lean();
  if (!b) return res.status(404).json({ error: "Not found" });
  res.json(formatBlogFull(b));
});

// ✅ Admin - List Blogs
app.get("/api/blogs", auth, async (_, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(blogs.map(formatBlogList));
});

// ✅ Admin - Create Blog
app.post("/api/blogs", auth, async (req, res) => {
  const { title, contentHtml } = req.body;
  if (!title || !contentHtml)
    return res.status(400).json({ error: "Missing fields" });
  const blog = await Blog.create({ title, contentHtml });
  res.status(201).json(formatBlogFull(blog));
});

// ✅ Admin - Update Blog
app.put("/api/blogs/:id", auth, async (req, res) => {
  const { title, contentHtml } = req.body;
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, contentHtml },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Blog not found" });
  res.json(formatBlogFull(updated));
});

// ✅ Admin - Delete Blog
app.delete("/api/blogs/:id", auth, async (req, res) => {
  const deleted = await Blog.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Blog not found" });
  res.json({ success: true });
});

// ✅ Root Test
app.get("/", (_, res) => {
  res.send("✅ Blog API Running Successfully");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
