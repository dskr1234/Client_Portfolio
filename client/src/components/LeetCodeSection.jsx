import React, { useEffect, useMemo, useState } from "react";
import Tilt3D from "./Tilt3D";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { GaugeCircle, Smile, Flame, CalendarDays, Timer, Send, ExternalLink } from "lucide-react";

/* count up */
function CountUp({ to = 0, className = "" }) {
  const mv = useMotionValue(0);
  const shown = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const c = animate(mv, to, { duration: 1, ease: "easeOut" });
    return () => c.stop();
  }, [to]);
  return <motion.span className={className}>{shown}</motion.span>;
}

/* gauge */
function Gauge3D({ value = 0, denom }) {
  const total = (typeof denom === "number" ? denom : undefined) || Math.max(1000, value);
  const pct = Math.max(0, Math.min(100, Math.round((value / total) * 100)));
  return (
    <Tilt3D className="h-full">
      <div className="relative overflow-hidden card-neo rounded-[24px] p-6 grid place-items-center">
        <div className="shine" />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[24px] p-[1px] opacity-30
                     bg-[conic-gradient(from_0deg,rgba(99,102,241,.5),rgba(168,85,247,.5),rgba(34,211,238,.45),rgba(99,102,241,.5))]
                     [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                     [mask-composite:exclude] animate-spin-slow"
        />
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,.06)" className="dark:stroke-[rgba(255,255,255,.08)]" strokeWidth="3" />
            <defs>
              <linearGradient id="lcGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(167,139,250)" />
                <stop offset="100%" stopColor="rgb(34,211,238)" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="20" cy="20" r="16" fill="none" stroke="url(#lcGrad)" strokeLinecap="round" strokeWidth="3"
              initial={{ pathLength: 0 }} animate={{ pathLength: pct / 100 }} transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <CountUp to={value} className="text-3xl font-extrabold text-theme" />
              <div className="text-xs text-theme-muted">
                {"Solved"}
                {denom !== undefined && denom !== null ? ` / ${denom}` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}

function StatCard({ label, value, denom, Icon }) {
  return (
    <Tilt3D max={10} intensity={6} pop={8} className="h-full">
      <div className="relative overflow-hidden card-neo rounded-2xl p-4">
        <div className="shine" />
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="p-2 rounded-lg bg-gradient-to-r from-violet-400/85 to-fuchsia-500/85 text-white shadow-md">
            <Icon size={14} />
          </span>
          <span className="text-theme-muted">{label}</span>
        </div>
        <div className="text-2xl font-semibold text-theme leading-tight">
          <CountUp to={value ?? 0} />
          {denom !== undefined && denom !== null ? (
            <span className="text-sm text-theme-subtle"> / {denom}</span>
          ) : null}
        </div>
      </div>
    </Tilt3D>
  );
}

/* map 72-day series -> 12 weeks x 7 rows (GitHub-style) */
function useWeeklyHeatmap(series) {
  // Build a map dateStr -> count for O(1) lookups
  const byDate = new Map(series.map(d => [d.date, d.count]));
  const last = series[series.length - 1]?.ts ? new Date(series[series.length - 1].ts) : new Date();
  last.setHours(0,0,0,0);

  // We want 12 columns (weeks), left -> right old -> new
  const weeks = Array.from({ length: 12 }, () => Array(7).fill(0));
  const labels = Array(12).fill(""); // month labels per column

  // Start from 11 weeks ago, fill day by day
  const start = new Date(last);
  start.setDate(start.getDate() - (12 * 7 - 1)); // 83 days back

  for (let i = 0; i < 12 * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const weekIdx = Math.floor(i / 7);
    const dayIdx = d.getDay(); // 0..6 (Sun..Sat)
    const key = d.toISOString().slice(0, 10);
    weeks[weekIdx][dayIdx] = byDate.get(key) || 0;

    // month label once per column (when Monday or first day)
    if (dayIdx === 1 || i === 0) {
      const label = d.toLocaleString(undefined, { month: "short" });
      // Only set if month changed vs previous column
      if (weekIdx === 0 || labels[weekIdx - 1] !== label) labels[weekIdx] = label;
    }
  }

  return { weeks, labels };
}

export default function LeetCodeSection() {
  const [data, setData] = useState(null);
  const username = import.meta.env.VITE_LEETCODE_USER;

  useEffect(() => {
    const go = async () => {
      try {
        if (!username) return;
        const r = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}`);
        const j = await r.json();
        setData(j);
      } catch (e) {
        console.error(e);
      }
    };
    go();
  }, [username]);

  const series = useMemo(() => {
    if (Array.isArray(data?.series)) return data.series;
    const b = data?.bars ?? Array.from({ length: 72 }, () => 0);
    const end = new Date(); end.setHours(0,0,0,0);
    return b.map((v, i) => {
      const d = new Date(end); d.setDate(end.getDate() - (71 - i));
      return { ts: d.getTime(), date: d.toISOString().slice(0,10), count: v };
    });
  }, [data]);

  const bars   = series.map(s => s.count);
  const totals = data?.totals  || { solved: 0, easy: 0, medium: 0, hard: 0 };
  const denoms = data?.denoms  || {};

  const { weeks, labels: monthLabels } = useWeeklyHeatmap(series);

  const maxDaily = data?.maxDaily ?? Math.max(0, ...bars);
  const maxDailyDate = data?.maxDailyDate || series[bars.indexOf(maxDaily)]?.date || null;

  const totalInWindow = bars.reduce((s, v) => s + v, 0);
  const activeDaysWindow = bars.filter(v => v > 0).length;

  // color for blocks
  const cellClass = (v) =>
    v >= 10 ? "bg-fuchsia-500/85" :
    v >= 6  ? "bg-violet-500/80"  :
    v >= 3  ? "bg-violet-400/70"  :
    v >= 1  ? "bg-violet-300/50 dark:bg-violet-300/40" :
              "bg-black/5 dark:bg-white/10";

  return (
    <section id="leetcode" className="soft-2 rounded-[28px] neo p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-theme">
          <span className="p-2 rounded-lg bg-gradient-to-r from-violet-400/85 to-fuchsia-500/85 text-white shadow-md">
            <GaugeCircle size={14} />
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">LeetCode Dashboard</h3>
        </div>
        {!!username && (
          <a
            className="inline-flex items-center gap-1 text-sm text-theme-muted hover:underline"
            href={`https://leetcode.com/${username}/`}
            target="_blank"
            rel="noreferrer"
          >
            View Profile <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <Gauge3D value={totals.solved} denom={denoms?.all ?? null} />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Easy"   value={totals.easy}   denom={denoms?.easy   ?? null} Icon={Smile} />
          <StatCard label="Medium" value={totals.medium} denom={denoms?.medium ?? null} Icon={GaugeCircle} />
          <StatCard label="Hard"   value={totals.hard}   denom={denoms?.hard   ?? null} Icon={Flame} />
          <StatCard label="Active Days" value={data?.activeDays} Icon={CalendarDays} />
          <StatCard label="Max Streak"  value={data?.maxStreak}  Icon={Timer} />
          <StatCard label="Submissions (YTD)" value={data?.yearSubmissions} Icon={Send} />
        </div>
      </div>

      {/* === Heatmap (12 weeks x 7 rows) === */}
      <Tilt3D className="mt-6">
        <div className="relative overflow-hidden card-neo rounded-[20px] p-5">
          <div className="shine" />

          <div className="flex items-start gap-4">
            {/* grid */}
            <div className="grid grid-cols-12 gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-rows-7 gap-1">
                  {week.map((v, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.95, y: 4 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-12%" }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`${cellClass(v)} w-3.5 h-3.5 rounded-[4px]`}
                      title={`${v} submission${v === 1 ? "" : "s"}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* legend */}
            <div className="hidden sm:block text-[10px] text-theme-subtle mt-1">
              <div className="mb-1">Less</div>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-black/5 dark:bg-white/10" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-violet-300/50 dark:bg-violet-300/40" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-violet-400/70" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-violet-500/80" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-fuchsia-500/85" />
              </div>
              <div className="mt-1">More</div>
            </div>
          </div>

          {/* month labels under grid */}
          <div className="mt-2 grid grid-cols-12 text-[10px] text-theme-subtle">
            {monthLabels.map((m, i) => (
              <div key={i} className="text-center">{m}</div>
            ))}
          </div>

          {/* Submission Track summary */}
          <div className="mt-3 text-xs text-theme-subtle">
            <span className="font-semibold text-theme">Submission Track:</span>{" "}
            {totalInWindow} total · {activeDaysWindow} active days · max/day {maxDaily}
            {maxDailyDate ? ` on ${new Date(maxDailyDate).toLocaleDateString()}` : ""}
          </div>
        </div>
      </Tilt3D>
    </section>
  );
}
