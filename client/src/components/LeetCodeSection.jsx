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
        <span aria-hidden className="pointer-events-none absolute -inset-px rounded-[24px] p-[1px] opacity-30 bg-[conic-gradient(from_0deg,rgba(99,102,241,.5),rgba(168,85,247,.5),rgba(34,211,238,.45),rgba(99,102,241,.5))] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] animate-spin-slow" />
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,.06)" className="dark:stroke-[rgba(255,255,255,.08)]" strokeWidth="3" />
            <defs>
              <linearGradient id="lcGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(167,139,250)" />
                <stop offset="100%" stopColor="rgb(34,211,238)" />
              </linearGradient>
            </defs>
            <motion.circle cx="20" cy="20" r="16" fill="none" stroke="url(#lcGrad)" strokeLinecap="round" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: pct / 100 }} transition={{ duration: 1.2, ease: "easeOut" }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <CountUp to={value} className="text-3xl font-extrabold text-theme" />
              <div className="text-xs text-theme-muted">
                {"Solved"}{denom !== undefined && denom !== null ? ` / ${denom}` : ""}
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

/* === Build week-aligned grid from 53*7 rolling array === */
function useYearHeatmap(calendarYear) {
  // Make lookup for counts
  const map = new Map((calendarYear || []).map((d) => [d.date, d.count]));

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const start = new Date(weekStart); start.setDate(weekStart.getDate() - 52 * 7);
  const cols = 53;

  const weeks = Array.from({ length: cols }, () => Array(7).fill(null));
  const monthLabels = Array(cols).fill("");

  for (let w = 0; w < cols; w++) {
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
      const key = dt.toISOString().slice(0, 10);
      const v = map.get(key) || 0;
      weeks[w][d] = { v, date: key, isToday: dt.getTime() === today.getTime() };
    }
    const first = new Date(start); first.setDate(start.getDate() + w * 7);
    const prev = new Date(start); prev.setDate(start.getDate() + (w - 1) * 7);
    const label = first.toLocaleString(undefined, { month: "short" });
    if (w === 0 || label !== prev.toLocaleString(undefined, { month: "short" })) monthLabels[w] = label;
  }
  return { weeks, monthLabels };
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
      } catch (e) { console.error(e); }
    };
    go();
  }, [username]);

  const totals = data?.totals || { solved: 0, easy: 0, medium: 0, hard: 0 };
  const denoms = data?.denoms || {};

  // **use rolling calendar from API**
  const { weeks, monthLabels } = useYearHeatmap(data?.calendarYear || []);

  const maxDaily = data?.maxDaily ?? 0;
  const maxDailyDate = data?.maxDailyDate || null;

  const rollingSubmissions = data?.rollingSubmissions ?? 0;
  const rollingActiveDays = data?.rollingActiveDays ?? 0;

  const cellClass = (v) =>
    v >= 10 ? "bg-emerald-600/90" :
    v >= 6  ? "bg-emerald-500/85" :
    v >= 3  ? "bg-emerald-400/70" :
    v >= 1  ? "bg-emerald-300/50 dark:bg-emerald-300/40" :
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
          <a className="inline-flex items-center gap-1 text-sm text-theme-muted hover:underline" href={`https://leetcode.com/${username}/`} target="_blank" rel="noreferrer">
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

      {/* ===== Rolling 1-year heatmap (53 weeks × 7 rows) ===== */}
      <Tilt3D className="mt-6">
        <div className="relative overflow-hidden card-neo rounded-[20px] p-5">
          <div className="shine" />

          <div className="flex items-start gap-4">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0,1fr))`, gap: "4px" }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-rows-7 gap-1">
                  {week.map((cell, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.95, y: 4 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-12%" }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className={`${cellClass(cell.v)} w-3.5 h-3.5 rounded-[4px] ${cell.isToday ? "ring-2 ring-[var(--ring)]" : ""}`}
                      title={`${cell.date}: ${cell.v} submission${cell.v === 1 ? "" : "s"}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="hidden sm:block text-[10px] text-theme-subtle mt-1">
              <div className="mb-1">Less</div>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-black/5 dark:bg-white/10" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-emerald-300/50 dark:bg-emerald-300/40" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-emerald-400/70" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-emerald-500/85" />
                <div className="w-3.5 h-3.5 rounded-[4px] bg-emerald-600/90" />
              </div>
              <div className="mt-1">More</div>
            </div>
          </div>

          {/* month ticks */}
          <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${monthLabels.length}, minmax(0,1fr))` }}>
            {monthLabels.map((m, i) => (
              <div key={i} className="text-center text-[10px] text-theme-subtle">{m}</div>
            ))}
          </div>

          {/* summary line for rolling window */}
          <div className="mt-3 text-xs text-theme-subtle">
            <span className="font-semibold text-theme">{rollingSubmissions}</span> submissions in the past one year
            <span className="mx-2">•</span>
            Total active days: <span className="font-semibold text-theme">{rollingActiveDays}</span>
            {maxDaily ? <><span className="mx-2">•</span>Max/day {maxDaily}{maxDailyDate ? ` on ${new Date(maxDailyDate).toLocaleDateString()}` : ""}</> : null}
          </div>
        </div>
      </Tilt3D>
    </section>
  );
}
