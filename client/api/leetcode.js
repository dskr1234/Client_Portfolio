// client/api/leetcode.js
export default async function handler(req, res) {
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

    // --- main GraphQL fetch
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // these two headers matter in serverless:
        "referer": "https://leetcode.com",
        "origin": "https://leetcode.com",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({ query, variables: { username, year } }),
      cache: "no-store",
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `leetcode responded ${r.status}` });
    }

    const json = await r.json();

    const matched = json?.data?.matchedUser || {};
    const stats = matched?.submitStatsGlobal?.acSubmissionNum || [];
    const cal = matched?.userCalendar || {};
    const calendarStr = cal?.submissionCalendar || "{}";

    // ---- denominators (total problems) with fallback ----
    let allCounts = json?.data?.allQuestionsCount || [];
    if (!Array.isArray(allCounts) || allCounts.length === 0) {
      // Fallback: REST endpoint that carries totals; LC sometimes throttles allQuestionsCount for Vercel IPs
      try {
        const r2 = await fetch("https://leetcode.com/api/problems/all/", {
          headers: {
            "referer": "https://leetcode.com",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
        });
        if (r2.ok) {
          const j2 = await r2.json();
          allCounts = [
            { difficulty: "All", count: j2.num_total },
            { difficulty: "Easy", count: j2.num_easy },
            { difficulty: "Medium", count: j2.num_medium },
            { difficulty: "Hard", count: j2.num_hard },
          ];
        }
      } catch {}
    }

    const denom = (diff) =>
      allCounts.find((x) => (x.difficulty || "").toLowerCase() === diff)?.count ?? 0;

    const denoms = {
      all: denom("all"),
      easy: denom("easy"),
      medium: denom("medium"),
      hard: denom("hard"),
    };

    // solved totals
    const get = (diff) =>
      stats.find((x) => (x.difficulty || "").toLowerCase() === diff)?.count ?? 0;

    const totals = {
      solved: get("all"),
      easy: get("easy"),
      medium: get("medium"),
      hard: get("hard"),
    };

    // ---- calendar -> 72-day series (UTC-safe) ----
    const calObj = JSON.parse(calendarStr); // { "<epochSecUTC>": count }
    const DAY = 86400;

    const norm = new Map();
    for (const [k, v] of Object.entries(calObj)) {
      const sec = Number(k) || 0;
      const cnt = Number(v) || 0;
      const dayUTC = Math.floor(sec / DAY) * DAY;
      norm.set(dayUTC, (norm.get(dayUTC) || 0) + cnt);
    }

    const endLocal = new Date();
    endLocal.setHours(0, 0, 0, 0);
    const series72 = [];
    for (let i = 71; i >= 0; i--) {
      const d = new Date(endLocal);
      d.setDate(endLocal.getDate() - i);
      const utcSec = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
      const count = norm.get(utcSec) || 0;
      series72.push({ ts: d.getTime(), date: d.toISOString().slice(0, 10), count });
    }

    // yearly aggregates
    const entries = Array.from(norm.entries())
      .map(([sec, v]) => ({ sec: Number(sec), v: Number(v) || 0 }))
      .sort((a, b) => a.sec - b.sec);

    const yearSubmissions = entries.reduce((s, d) => s + d.v, 0);
    const activeDays = entries.filter((d) => d.v > 0).length;

    let maxStreak = 0,
      cur = 0;
    const startUTC = Math.floor(Date.UTC(year, 0, 1) / 1000);
    const todayUTC = Math.floor(
      Date.UTC(endLocal.getFullYear(), endLocal.getMonth(), endLocal.getDate()) / 1000
    );
    for (let s = startUTC; s <= todayUTC; s += DAY) {
      if ((norm.get(s) || 0) > 0) {
        cur += 1;
        if (cur > maxStreak) maxStreak = cur;
      } else cur = 0;
    }

    const maxDaily = series72.reduce((m, d) => Math.max(m, d.count), 0);
    const maxDailyDate = series72.find((d) => d.count === maxDaily)?.date || null;

    // Helpful cache hints for Vercel (avoid stale partials)
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");

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
}
