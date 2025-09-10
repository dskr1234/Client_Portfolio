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
const PREVIEW_PREFIX  = (process.env.FRONTEND_PREVIEW_PREFIX || "").trim();
const EXTRA_ORIGINS   = (process.env.CORS_ORIGIN || "")
  .split(",").map(s => s.trim()).filter(Boolean);

const normalize = (u) => {
  if (!u) return "";
  try { const { protocol, host } = new URL(u); return `${protocol}//${host}`; }
  catch { return u.replace(/\/+$/, ""); }
};
const allowOrigin = (origin) => {
  if (!origin) return true;
  const o = normalize(origin);
  if (o === normalize(FRONTEND_ORIGIN)) return true;
  if (EXTRA_ORIGINS.map(normalize).includes(o)) return true;
  try {
    const { hostname } = new URL(origin);
    if (PREVIEW_PREFIX && hostname.endsWith(".vercel.app") && hostname.startsWith(PREVIEW_PREFIX)) return true;
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
    if (!process.env.CONTACT_TO) return res.status(503).json({ error: "CONTACT_TO not configured" });
    await sendMail({
      to: process.env.CONTACT_TO,
      subject: `New portfolio message from ${data.name}`,
      replyTo: data.email,
      html: `<p><b>Name:</b> ${data.name}</p><p><b>Email:</b> ${data.email}</p><p style="white-space:pre-wrap">${data.message}</p>`,
    });
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", issues: err.issues });
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

    const now = new Date(); now.setHours(0,0,0,0);
    const year = now.getFullYear();

    const query = `
      query userProfile($username: String!, $year: Int) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStatsGlobal { acSubmissionNum { difficulty count submissions } }
          userCalendar(year: $year) { submissionCalendar }
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
    if (!r.ok) return res.status(r.status).json({ error: `leetcode responded ${r.status}` });
    const json = await r.json();

    /* ------ denominators (ALL/E/M/H) robust ------ */
    const allCountsRaw = json?.data?.allQuestionsCount || [];
    const lc = (s) => (s || "").toString().trim().toLowerCase();
    const byDiff = allCountsRaw.reduce((acc, it) => {
      const k = lc(it?.difficulty);
      if (["all","easy","medium","hard"].includes(k)) acc[k] = Number(it?.count ?? 0);
      return acc;
    }, {});
    if (byDiff.all == null) {
      byDiff.all = (byDiff.easy ?? 0) + (byDiff.medium ?? 0) + (byDiff.hard ?? 0);
    }
    const denoms = {
      all:    Number.isFinite(byDiff.all)    ? byDiff.all    : 0,
      easy:   Number.isFinite(byDiff.easy)   ? byDiff.easy   : 0,
      medium: Number.isFinite(byDiff.medium) ? byDiff.medium : 0,
      hard:   Number.isFinite(byDiff.hard)   ? byDiff.hard   : 0,
    };

    /* ------ totals (solved) ------ */
    const stats = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const get = (d) => stats.find((x) => lc(x?.difficulty) === d)?.count || 0;
    const totals = { solved: get("all"), easy: get("easy"), medium: get("medium"), hard: get("hard") };

    /* ------ submission calendar (UTC day buckets) ------ */
    const DAY = 86400;
    const calStr = json?.data?.matchedUser?.userCalendar?.submissionCalendar || "{}";
    const raw = JSON.parse(calStr); // { "<epochSecUTC>": count }
    const norm = new Map();
    for (const [k,v] of Object.entries(raw)) {
      const sec = Math.floor((Number(k) || 0) / DAY) * DAY;
      norm.set(sec, (norm.get(sec) || 0) + (Number(v) || 0));
    }

    // 72-day window (kept for small stats)
    const series72 = [];
    for (let i = 71; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const sec = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
      series72.push({ ts: d.getTime(), date: d.toISOString().slice(0,10), count: norm.get(sec) || 0 });
    }
    const maxDaily = series72.reduce((m, d) => Math.max(m, d.count), 0);
    const maxDailyDate = series72.find((d) => d.count === maxDaily)?.date || null;

    // full past-365-day calendar (like LC "past one year")
    const calYear = [];
    const start = new Date(now); start.setDate(now.getDate() - 364);
    for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
      const sec = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
      calYear.push({ date: d.toISOString().slice(0,10), count: norm.get(sec) || 0 });
    }

    // aggregates for that year window
    const yearSubmissions = calYear.reduce((s, x) => s + (x.count || 0), 0);
    const activeDays = calYear.filter((x) => (x.count || 0) > 0).length;

    // robust max streak (calendar year UTC)
    let maxStreak = 0, cur = 0;
    const startUTC = Math.floor(Date.UTC(year, 0, 1) / 1000);
    const todayUTC = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 1000);
    for (let s = startUTC; s <= todayUTC; s += DAY) {
      if ((norm.get(s) || 0) > 0) { cur++; if (cur > maxStreak) maxStreak = cur; }
      else cur = 0;
    }

    res.json({
      totals,
      denoms,
      yearSubmissions,
      activeDays,
      maxStreak,
      series: series72,
      bars: series72.map(x => x.count),
      maxDaily,
      maxDailyDate,
      calendarYear: calYear, // <— for the heatmap
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch" });
  }
});

/* ---------------- Start ---------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
