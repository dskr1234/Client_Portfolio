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
  const total = denom || Math.max(1000, value);
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
              <div className="text-xs text-theme-muted">Solved{denom ? ` / ${denom}` : ""}</div>
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
          {typeof denom === "number" ? (
            <span className="text-sm text-theme-subtle"> / {denom}</span>
          ) : null}
        </div>
      </div>
    </Tilt3D>
  );
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

  const monthLabels = useMemo(() => {
    const COLS = 12, step = 6;
    const labels = [];
    for (let c = 0; c < COLS; c++) {
      const idx = c * step;
      const dt = new Date(series[idx]?.ts || Date.now());
      const prevIdx = (c - 1) * step;
      const prevMonth = c > 0 ? new Date(series[prevIdx]?.ts || Date.now()).getMonth() : null;
      const label = dt.toLocaleString(undefined, { month: "short" });
      labels.push(dt.getMonth() !== prevMonth || c === 0 ? label : "");
    }
    return labels;
  }, [series]);

  const maxDaily = data?.maxDaily ?? Math.max(0, ...bars);
  const maxDailyDate = data?.maxDailyDate || series[bars.indexOf(maxDaily)]?.date || null;

  // submission track summary for the 72-day window
  const totalInWindow = bars.reduce((s, v) => s + v, 0);
  const activeDaysWindow = bars.filter(v => v > 0).length;

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
        <Gauge3D value={totals.solved} denom={denoms.all} />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Easy"   value={totals.easy}   denom={denoms.easy}   Icon={Smile} />
          <StatCard label="Medium" value={totals.medium} denom={denoms.medium} Icon={GaugeCircle} />
          <StatCard label="Hard"   value={totals.hard}   denom={denoms.hard}   Icon={Flame} />
          <StatCard label="Active Days" value={data?.activeDays} Icon={CalendarDays} />
          <StatCard label="Max Streak"  value={data?.maxStreak}  Icon={Timer} />
          <StatCard label="Submissions (YTD)" value={data?.yearSubmissions} Icon={Send} />
        </div>
      </div>

      <Tilt3D className="mt-6">
        <div className="relative overflow-hidden card-neo rounded-[20px] p-4">
          <div className="shine" />

          <div className="grid grid-cols-12 gap-1">
            {bars.map((v, i) => {
              const cls =
                v > 7 ? "bg-violet-400/80" :
                v > 3 ? "bg-violet-400/55" :
                v > 0 ? "bg-black/10 dark:bg-white/20" :
                        "bg-black/5 dark:bg-white/10";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.22, delay: i * 0.012, ease: "easeOut" }}
                  className={`${cls} h-3 rounded`}
                  title={`${series[i]?.date || ""}: ${v} submission${v === 1 ? "" : "s"}`}
                />
              );
            })}
          </div>

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
