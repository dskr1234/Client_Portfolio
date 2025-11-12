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

// ==================== STATIC UPLOAD SETUP ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// ==================== CORS CONFIGURATION ====================
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.upendradommaraju.com",
  "https://upendradommaraju.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ==================== MONGODB CONNECTION ====================
await mongoose
  .connect(process.env.MONGODB_URI, { dbName: "clientDB" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ==================== AUTH CONFIG ====================
const BLOG_ADMIN_PASS = process.env.BLOG_ADMIN_PASS || "admin123";
const BLOG_JWT_SECRET = process.env.BLOG_JWT_SECRET || "secretkey";

const signToken = () =>
  jwt.sign({ role: "admin" }, BLOG_JWT_SECRET, { expiresIn: "2h" });

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    req.user = jwt.verify(token, BLOG_JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ==================== MULTER (FILE UPLOADS) ====================
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ✅ Helper: Get Base URL dynamically (works in Render or localhost)
function getBaseUrl(req) {
  return (
    process.env.PUBLIC_BASE_URL ||
    `${req.protocol}://${req.get("host")}`
  );
}

// ==================== FORMAT HELPERS ====================
const formatBlogList = (b) => ({
  id: String(b._id),
  title: b.title,
  preview: (b.contentHtml || "").replace(/<[^>]+>/g, "").slice(0, 300),
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

// ✅ Root Test Route
app.get("/", (_, res) => {
  res.send("✅ Blog API Running Successfully!");
});

// ✅ Login - Generate JWT Token
app.post("/api/blog/auth", (req, res) => {
  const { passcode } = req.body || {};
  if (passcode !== BLOG_ADMIN_PASS)
    return res.status(401).json({ error: "Wrong passcode" });

  res.json({ token: signToken() });
});

// ✅ Upload Image
app.post("/api/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "No file uploaded" });

  const baseUrl = getBaseUrl(req);
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({ url: imageUrl });
});

// ✅ Public - List Blogs
app.get("/api/blogs-public", async (_, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json(blogs.map(formatBlogList));
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to load blogs" });
  }
});

// ✅ Public - Single Blog
app.get("/api/blogs/:id-public", async (req, res) => {
  try {
    const b = await Blog.findById(req.params.id).lean();
    if (!b) return res.status(404).json({ error: "Not found" });
    res.json(formatBlogFull(b));
  } catch (err) {
    res.status(400).json({ error: "Invalid blog ID" });
  }
});

// ✅ Admin - List Blogs
app.get("/api/blogs", auth, async (_, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json(blogs.map(formatBlogList));
  } catch (err) {
    res.status(500).json({ error: "Error fetching admin blogs" });
  }
});

// ✅ Admin - Create Blog
app.post("/api/blogs", auth, async (req, res) => {
  const { title, contentHtml } = req.body;
  if (!title || !contentHtml)
    return res.status(400).json({ error: "Missing required fields" });

  const blog = await Blog.create({ title, contentHtml });
  res.status(201).json(formatBlogFull(blog));
});

// ✅ Admin - Update Blog
app.put("/api/blogs/:id", auth, async (req, res) => {
  const { title, contentHtml } = req.body;
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, contentHtml },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json(formatBlogFull(updated));
  } catch (err) {
    res.status(400).json({ error: "Invalid blog ID" });
  }
});

// ✅ Admin - Delete Blog
app.delete("/api/blogs/:id", auth, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid blog ID" });
  }
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
