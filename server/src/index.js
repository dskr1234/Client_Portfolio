import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { sendMail } from "./utils/mailer.js";

dotenv.config();

const app = express();
app.use(express.json());

/* ---------------- CORS ---------------- */
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "").trim();
const PREVIEW_PREFIX   = (process.env.FRONTEND_PREVIEW_PREFIX || "").trim();
const EXTRA_ORIGINS    = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const normalize = (u) => {
  if (!u) return "";
  try {
    const { protocol, host } = new URL(u);
    return `${protocol}//${host}`;
  } catch {
    return u.replace(/\/+$/, "");
  }
};

const allowOrigin = (origin) => {
  if (!origin) return true;
  const o = normalize(origin);
  if (o === normalize(FRONTEND_ORIGIN)) return true;
  if (EXTRA_ORIGINS.map(normalize).includes(o)) return true;
  try {
    const { hostname } = new URL(origin);
    if (PREVIEW_PREFIX && hostname.endsWith(".vercel.app") && hostname.startsWith(PREVIEW_PREFIX)) {
      return true;
    }
  } catch {}
  return false;
};

const corsOptions = {
  origin(origin, cb) { cb(null, allowOrigin(origin)); },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ---------------- Health ---------------- */
app.get("/", (_req, res) => res.json({ service: "portfolio-api", ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* ---------------- Contact ---------------- */
const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
});

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
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: err.issues });
    }
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

/* ---------------- LeetCode API ----------------
   GET /api/leetcode?username=<leetcode_name>
------------------------------------------------ */
app.get("/api/leetcode", async (req, res) => {
  try {
    const username = (req.query.username || "").trim();
    if (!username) return res.status(400).json({ error: "username is required" });

    const year = new Date().getFullYear();
    const query = `
      query userProfile($username: String!, $year: Int) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStatsGlobal { acSubmissionNum { difficulty count submissions } }
          userCalendar(year: $year) {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;

    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "referer": "https://leetcode.com",
        "user-agent": "Mozilla/5.0",
      },
      body: JSON.stringify({ query, variables: { username, year } }),
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `leetcode responded ${r.status}` });
    }

    const json = await r.json();

    // ---- denominators (total problems) with robust fallback ----
    const allCountsRaw = json?.data?.allQuestionsCount || [];
    const lc = (s) => (s || "").toString().trim().toLowerCase();
    const byDiff = allCountsRaw.reduce((acc, it) => {
      const key = lc(it?.difficulty);
      const count = Number(it?.count ?? 0);
      if (["all","easy","medium","hard"].includes(key)) acc[key] = count;
      return acc;
    }, {});
    if (byDiff.all == null) {
      const e = Number(byDiff.easy   ?? 0);
      const m = Number(byDiff.medium ?? 0);
      const h = Number(byDiff.hard   ?? 0);
      byDiff.all = e + m + h;
    }
    const denoms = {
      all:    Number.isFinite(byDiff.all)    ? byDiff.all    : 0,
      easy:   Number.isFinite(byDiff.easy)   ? byDiff.easy   : 0,
      medium: Number.isFinite(byDiff.medium) ? byDiff.medium : 0,
      hard:   Number.isFinite(byDiff.hard)   ? byDiff.hard   : 0,
    };

    // ---- solved totals ----
    const stats = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const get = (diff) =>
      stats.find((x) => (x.difficulty || "").toLowerCase() === diff)?.count || 0;

    const totals = {
      solved: get("all"),
      easy: get("easy"),
      medium: get("medium"),
      hard: get("hard"),
    };

    // ---- calendar -> series (UTC midnight aligned) ----
    const calendarStr = json?.data?.matchedUser?.userCalendar?.submissionCalendar || "{}";
    const calObj = JSON.parse(calendarStr);
    const DAY = 86400;

    const norm = new Map();
    for (const [k, v] of Object.entries(calObj)) {
      const sec = Number(k) || 0;
      const cnt = Number(v) || 0;
      const dayUTC = Math.floor(sec / DAY) * DAY;
      norm.set(dayUTC, (norm.get(dayUTC) || 0) + cnt);
    }

    const endLocal = new Date(); endLocal.setHours(0, 0, 0, 0);
    const series72 = [];
    for (let i = 71; i >= 0; i--) {
      const d = new Date(endLocal); d.setDate(endLocal.getDate() - i);
      const utcSec = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
      const count = norm.get(utcSec) || 0;
      series72.push({ ts: d.getTime(), date: d.toISOString().slice(0, 10), count });
    }

    const entries = Array.from(norm.entries())
      .map(([sec, v]) => ({ sec: Number(sec), v: Number(v) || 0 }))
      .sort((a, b) => a.sec - b.sec);

    const yearSubmissions = entries.reduce((s, d) => s + d.v, 0);
    const activeDays = entries.filter((d) => d.v > 0).length;

    let maxStreak = 0, cur = 0;
    const startUTC = Math.floor(Date.UTC(year, 0, 1) / 1000);
    const todayUTC = Math.floor(Date.UTC(
      endLocal.getFullYear(), endLocal.getMonth(), endLocal.getDate()
    ) / 1000);
    for (let s = startUTC; s <= todayUTC; s += DAY) {
      if ((norm.get(s) || 0) > 0) { cur += 1; if (cur > maxStreak) maxStreak = cur; }
      else cur = 0;
    }

    const maxDaily = series72.reduce((m, d) => Math.max(m, d.count), 0);
    const maxDailyDate = series72.find((d) => d.count === maxDaily)?.date || null;

    res.json({
      totals,
      denoms,
      yearSubmissions,
      activeDays,
      maxStreak,
      series: series72,
      bars: series72.map((x) => x.count),
      maxDaily,
      maxDailyDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch" });
  }
});

/* ---------------- Start ---------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
