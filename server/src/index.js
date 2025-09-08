import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());

// ---- CORS (allow localhost + your Vercel domain) ----
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN, // e.g. https://your-frontend.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // SSR/cURL, allow
      return cb(null, ALLOWED_ORIGINS.includes(origin));
    },
  })
);

// ---- Health check (Render pings this) ----
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---- Validation schema ----
const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
});

// ---- (Optional) Email transport (use if you want email delivery) ----
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// ---- Contact endpoint ----
app.post("/api/contact", async (req, res) => {
  try {
    const data = ContactSchema.parse(req.body);

    // if email is configured, send mail — otherwise just echo ok
    if (transporter && process.env.CONTACT_TO) {
      await transporter.sendMail({
        from: `"Portfolio Bot" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO, // where you receive the message
        replyTo: data.email,
        subject: `New portfolio message from ${data.name}`,
        text: data.message,
        html: `<p><b>Name:</b> ${data.name}</p>
               <p><b>Email:</b> ${data.email}</p>
               <p style="white-space:pre-wrap">${data.message}</p>`,
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: err.issues });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---- Start server (Render sets PORT) ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
