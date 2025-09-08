// server/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { sendMail } from "./utils/mailer.js";

dotenv.config();

const app = express();
app.use(express.json());

// ---- CORS (allow localhost + vercel) ----
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN, // e.g. https://client-portfolio-self.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // SSR/cURL
      cb(null, ALLOWED_ORIGINS.includes(origin));
    },
  })
);

// ---- Health ----
app.get("/", (_req, res) => res.json({ service: "portfolio-api", ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---- Schema ----
const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
});

// ---- Contact ----
app.post("/api/contact", async (req, res) => {
  try {
    const data = ContactSchema.parse(req.body);

    if (!process.env.CONTACT_TO) {
      return res.status(503).json({ error: "CONTACT_TO not configured" });
    }

    await sendMail({
      to: process.env.CONTACT_TO,
      subject: `New portfolio message from ${data.name}`,
      replyTo: data.email,
      html: `
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p style="white-space:pre-wrap">${data.message}</p>
      `,
    });

    return res.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: err.issues });
    }
    console.error("MAIL ERROR:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// ---- Start ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
