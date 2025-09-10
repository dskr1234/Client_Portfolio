// src/components/Projects.jsx
import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { ExternalLink } from "lucide-react";

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
            About
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

/* --- Right side: preview with an internal footer CTA (always clickable) --- */
function LivePreview3D({ src, label, href, ctaLabel = "Visit" }) {
  const isVideo = typeof src === "string" && src.match(/\.(mp4|webm|ogg)$/i);
  const isImage = typeof src === "string" && src.match(/\.(png|jpe?g|gif|webp|avif)$/i);
  const openHref = href || src;

  return (
    <Tilt3D className="w-full">
      <div className="relative card-neo rounded-[24px] overflow-hidden flex flex-col">
        <div className="shine" />

        {/* Frame area */}
        <div className="relative h-[420px] bg-white">
          {isVideo ? (
            <video
              src={src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : isImage ? (
            <img src={src} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <iframe
              src={src}
              title={label}
              loading="lazy"
              className="w-full h-full"
              allow="clipboard-write; fullscreen; autoplay"
            />
          )}
        </div>

        {/* Footer with centered CTA */}
        <div className="relative z-10 border-t border-white/10 bg-[rgba(255,255,255,.04)] backdrop-blur-md">
          <div className="px-4 py-3 flex items-center justify-center gap-3">
            {label && (
              <p className="text-[11px] text-white/65">{label}</p>
            )}
            {!!openHref && (
              <a
                href={openHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${ctaLabel} ${label || ""}`}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-full
                  text-xs font-medium text-[var(--text)]
                  bg-[linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08))]
                  border border-white/10 ring-1 ring-white/10
                  shadow-[0_10px_30px_rgba(0,0,0,.25)]
                  transition-transform duration-200 hover:-translate-y-[1px] focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-violet-400/60
                "
                style={{ pointerEvents: "auto" }}
              >
                {ctaLabel}
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}

export default function Projects() {
  const previewSrc = "https://www.recruitemee.com/";
  const previewLabel = "RecruiteMee — Live Preview";

  return (
    <Section id="projects" title="Entrepreneurial Projects">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <RecruiteMeeCard />
        <LivePreview3D
          src={previewSrc}
          href="https://www.recruitemee.com/"
          label={previewLabel}
          ctaLabel="Visit"
        />
      </div>
    </Section>
  );
}
