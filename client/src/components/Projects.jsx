// src/components/Projects.jsx
import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";

/* --- One combined project card (intro + description) --- */
function RecruiteMeeCard() {
  const title = "RecruiteMee — ATS Resume Optimization";
  const period = "Jan 2024 – Present";
  const tags = [
    "MERN",
    "React",
    "Node/Express",
    "MongoDB",
    "Razorpay",
    "S3",
    "Webhooks",
    "SaaS",
    "Referrals",
  ];

  const oneLiner =
    "ATS resume platform that rewrites/reviews resumes, takes secure payments, and tracks influencer referrals with admin controls.";

  const bullets = [
    "Built MERN app with crisp API contracts, validation, and error envelopes.",
    "Razorpay integration: orders, webhook HMAC verify, refunds, and payouts.",
    "Influencer links + dashboards with referral tracking and earnings.",
    "Admin metrics, feature flags, and moderation tools.",
    "Private S3 uploads (pre-signed), JWT w/ refresh rotation, role-based access.",
    "Caching + indexes for snappy dashboards and list views.",
  ];

  return (
    <Tilt3D>
      <div className="relative card-neo rounded-[24px] p-6 md:p-8 overflow-hidden">
        <div className="shine" />

        {/* Header */}
        <div className="flex items-start gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 mt-2 shadow-[0_0_10px_rgba(167,139,250,.9)]" />
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text)] tracking-tight">
              {title}
            </h3>
            <p className="text-[var(--text-muted)] text-sm mt-1">{period}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="pill-neo px-3 py-1 rounded-full text-xs text-[var(--text)]/85"
            >
              {t}
            </span>
          ))}
        </div>

        {/* One-liner */}
        <div className="mt-5">
          <h4 className="text-[13px] font-semibold text-[var(--text)]/90 mb-1">
            One-liner
          </h4>
          <p className="text-[var(--text-muted)] leading-relaxed">{oneLiner}</p>
        </div>

        {/* Overview bullets */}
        <div className="mt-5">
          <h4 className="text-[13px] font-semibold text-[var(--text)]/90 mb-1">
            Overview
          </h4>
          <ul className="space-y-1 list-disc list-inside text-sm text-[var(--text-muted)]">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </Tilt3D>
  );
}

/* --- Right side: live preview frame (kept the same) --- */
function LivePreview3D({ src, label }) {
  const isVideo = typeof src === "string" && src.match(/\.(mp4|webm|ogg)$/i);
  const isImage = typeof src === "string" && src.match(/\.(png|jpe?g|gif|webp|avif)$/i);

  return (
    <Tilt3D className="w-full">
      <div className="relative card-neo rounded-[24px] overflow-hidden">
        <div className="shine" />
        {isVideo ? (
          <video
            src={src}
            className="w-full h-[420px] object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : isImage ? (
          <img src={src} alt="preview" className="w-full h-[420px] object-cover" />
        ) : (
          <iframe
            src={src}
            title={label}
            loading="lazy"
            className="w-full h-[420px] bg-white"
            referrerPolicy="no-referrer"
            allow="clipboard-write; fullscreen; autoplay"
          />
        )}
      </div>
      <p className="mt-3 text-xs text-center text-white/60">{label}</p>
    </Tilt3D>
  );
}

export default function Projects() {
  // You can swap this to your live demo URL, video, or image
  const previewSrc = "https://www.recruitemee.com/";
  const previewLabel = "RecruiteMee — Live Preview";

  return (
    <Section id="projects" title="Entrepreneurial Projects">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <RecruiteMeeCard />
        <LivePreview3D src={previewSrc} label={previewLabel} />
      </div>
    </Section>
  );
}
