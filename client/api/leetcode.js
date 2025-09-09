// /api/leetcode.js
export default async function handler(req, res) {
  try {
    const username = (req.query.username || "").trim();
    if (!username) return res.status(400).json({ error: "username is required" });

    const year = new Date().getFullYear();
    const query = `
      query userProfile($username: String!, $year: Int) {
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
        referer: "https://leetcode.com",
        "user-agent": "Mozilla/5.0",
      },
      body: JSON.stringify({ query, variables: { username, year } }),
    });
    const json = await r.json();

    const matched = json?.data?.matchedUser || {};
    const stats = matched?.submitStatsGlobal?.acSubmissionNum || [];
    const cal = matched?.userCalendar || {};
    const calendarStr = cal?.submissionCalendar || "{}";

    const get = (diff) =>
      stats.find((x) => x.difficulty?.toLowerCase() === diff)?.count || 0;

    const totals = {
      solved: get("all"),
      easy: get("easy"),
      medium: get("medium"),
      hard: get("hard"),
    };

    // submissionCalendar: { "<epochSecondsDayStart>": count, ... }
    const calObj = JSON.parse(calendarStr);

    // Build a contiguous 72-day series ending today (so month labels line up)
    const end = new Date(); end.setHours(0, 0, 0, 0);
    const series72 = [];
    for (let i = 71; i >= 0; i--) {
      const d = new Date(end); d.setDate(end.getDate() - i);
      const tsSec = Math.floor(d.getTime() / 1000);
      const count = Number(calObj[tsSec] || 0);
      series72.push({
        ts: d.getTime(),
        date: d.toISOString().slice(0, 10), // YYYY-MM-DD
        count,
      });
    }

    // Aggregates
    const entries = Object.entries(calObj).map(([ts, v]) => ({ ts: Number(ts) * 1000, v: Number(v) || 0 }));
    const yearSubmissions = entries.reduce((s, d) => s + d.v, 0);
    const activeDays = entries.filter((d) => d.v > 0).length;

    let maxStreak = 0, cur = 0;
    // compute streak over the whole year (contiguity in calendar)
    // Walk day-by-day from Jan 1 to today for safer streak calc
    const yStart = new Date(year, 0, 1); yStart.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    for (let d = new Date(yStart); d <= today; d.setDate(d.getDate() + 1)) {
      const c = Number(calObj[Math.floor(d.getTime()/1000)] || 0);
      if (c > 0) { cur += 1; maxStreak = Math.max(maxStreak, cur); }
      else cur = 0;
    }

    const maxDaily = series72.reduce((m, d) => Math.max(m, d.count), 0);
    const maxDailyDate = series72.find((d) => d.count === maxDaily)?.date || null;

    return res.status(200).json({
      totals,
      yearSubmissions,
      activeDays,
      maxStreak,
      bars: series72.map((x) => x.count),  // still provided for backward compat
      series: series72,                    // NEW: [{ts, date, count}]
      maxDaily,
      maxDailyDate,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "failed to fetch" });
  }
}
