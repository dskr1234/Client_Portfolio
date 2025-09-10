// client/api/leetcode.js
export default async function handler(req, res) {
  try {
    const username = (req.query.username || "").trim();
    if (!username) return res.status(400).json({ error: "username is required" });

    const year = new Date().getFullYear();
    const yearPrev = year - 1;

    const query = `
      query userProfile($username: String!, $year: Int, $yearPrev: Int) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStatsGlobal { acSubmissionNum { difficulty count submissions } }

          calThis: userCalendar(year: $year) {
            streak
            totalActiveDays
            submissionCalendar
          }
          calPrev: userCalendar(year: $yearPrev) {
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
        "origin": "https://leetcode.com",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({ query, variables: { username, year, yearPrev } }),
      cache: "no-store",
    });

    if (!r.ok) return res.status(r.status).json({ error: `leetcode responded ${r.status}` });

    const json = await r.json();

    // ---------- totals (denominators) with REST fallback ----------
    let allCounts = json?.data?.allQuestionsCount || [];
    if (!Array.isArray(allCounts) || allCounts.length === 0) {
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

    // ---------- solved counts ----------
    const stats = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const get = (diff) =>
      stats.find((x) => (x.difficulty || "").toLowerCase() === diff)?.count ?? 0;

    const totals = {
      solved: get("all"),
      easy: get("easy"),
      medium: get("medium"),
      hard: get("hard"),
    };

    // ---------- normalize both calendars into one day map (UTC keyed) ----------
    const calThis = json?.data?.matchedUser?.calThis?.submissionCalendar || "{}";
    const calPrev = json?.data?.matchedUser?.calPrev?.submissionCalendar || "{}";

    const DAY = 86400;
    const norm = new Map();
    const addCal = (str) => {
      const obj = JSON.parse(str || "{}");
      for (const [k, v] of Object.entries(obj)) {
        const sec = Number(k) || 0;
        const cnt = Number(v) || 0;
        const dayUTC = Math.floor(sec / DAY) * DAY;
        norm.set(dayUTC, (norm.get(dayUTC) || 0) + cnt);
      }
    };
    addCal(calPrev);
    addCal(calThis);

    // ---------- 72-day series (for your smaller chart/summary) ----------
    const endLocal = new Date(); endLocal.setHours(0, 0, 0, 0);
    const series72 = [];
    for (let i = 71; i >= 0; i--) {
      const d = new Date(endLocal); d.setDate(endLocal.getDate() - i);
      const utcSec = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
      series72.push({ ts: d.getTime(), date: d.toISOString().slice(0, 10), count: norm.get(utcSec) || 0 });
    }

    // ---------- rolling 53-week calendar (like LC "past one year") ----------
    // last column = current week (Sun→Sat)
    const weekStartLocal = new Date(endLocal);
    weekStartLocal.setDate(endLocal.getDate() - endLocal.getDay());
    const startLocal = new Date(weekStartLocal);
    startLocal.setDate(weekStartLocal.getDate() - 52 * 7); // 53 columns
    const calendarYear = [];
    let rollingSubmissions = 0;
    let rollingActiveDays = 0;
    let maxDaily = 0;
    let maxDailyDate = null;

    for (let i = 0; i < 53 * 7; i++) {
      const d = new Date(startLocal); d.setDate(startLocal.getDate() + i);
      const utcSec = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
      const count = norm.get(utcSec) || 0;
      calendarYear.push({ date: d.toISOString().slice(0, 10), count });

      rollingSubmissions += count;
      if (count > 0) rollingActiveDays += 1;
      if (count > maxDaily) { maxDaily = count; maxDailyDate = d.toISOString().slice(0, 10); }
    }

    // ---------- YTD aggregates (current calendar year only) ----------
    const calThisObj = JSON.parse(calThis || "{}");
    const ytdSubmissions = Object.values(calThisObj).reduce((s, v) => s + (Number(v) || 0), 0);
    const ytdActiveDays = Object.values(calThisObj).filter((v) => (Number(v) || 0) > 0).length;

    // streak across this calendar year
    let maxStreak = 0, cur = 0;
    const startUTC = Math.floor(Date.UTC(year, 0, 1) / 1000);
    const todayUTC = Math.floor(Date.UTC(endLocal.getFullYear(), endLocal.getMonth(), endLocal.getDate()) / 1000);
    for (let s = startUTC; s <= todayUTC; s += DAY) {
      if ((norm.get(s) || 0) > 0) { cur += 1; if (cur > maxStreak) maxStreak = cur; }
      else cur = 0;
    }

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    res.json({
      totals,
      denoms,

      // cards
      yearSubmissions: ytdSubmissions,
      activeDays: ytdActiveDays,
      maxStreak,

      // heatmap data
      calendarYear,                 // 53 * 7 items: { date, count }
      rollingSubmissions,           // for "past one year" summary
      rollingActiveDays,
      maxDaily,
      maxDailyDate,

      // compat
      series: series72,
      bars: series72.map((x) => x.count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch" });
  }
}
