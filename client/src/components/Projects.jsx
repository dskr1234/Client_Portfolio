import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { ExternalLink } from "lucide-react";
import FoodSyncTimeline from "./FoodSyncTimeline";

function RecruiteMeeCard() {
  const title = "RecruiteMee — ATS Resume Optimization";
  const period = "Jan 2024 – Present";
  const tags = [
    "MERN", "React", "Node/Express", "MongoDB",
    "Razorpay", "S3", "Webhooks", "SaaS", "Referral System"
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
      <div className="relative card-neo rounded-[24px] p-6 md:p-8 overflow-hidden h-full">
        <div className="shine pointer-events-none" />
        <div className="flex items-start gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 mt-2 shadow-[0_0_10px_rgba(167,139,250,.9)]" />
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text)] tracking-tight">
              {title}
            </h3>
            <p className="text-[var(--text-muted)] text-sm mt-1">{period}</p>
          </div>
        </div>
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
        <div className="mt-5">
          <h4 className="text-[13px] font-semibold text-[var(--text)]/90 mb-1">
            About
          </h4>
          <p className="text-[var(--text-muted)] leading-relaxed">{oneLiner}</p>
        </div>
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

function LivePreview3D({ src, label }) {
  return (
    <Tilt3D className="w-full h-full">
      <div className="relative card-neo rounded-[24px] overflow-hidden w-full h-full">
        <div className="shine" />
        <iframe
          src={src}
          title={label || "Project preview"}
          loading="lazy"
          className="w-full h-[500px] md:h-[600px] bg-white"
          referrerPolicy="no-referrer"
          allow="clipboard-write; fullscreen; autoplay"
        />
      </div>
      {label && (
        <p className="mt-3 text-xs text-center text-white/60">{label}</p>
      )}
    </Tilt3D>
  );
}

function VisitButton({ href, label = "Visit" }) {
  return (
    <div className="mt-3 flex justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-[var(--text)] bg-[linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08))] border border-white/10 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-transform duration-200 hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
      >
        {label}
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

export default function Projects() {
  const previewSrc = "https://www.recruitemee.com/";
  const previewLabel = "RecruiteMee — Live Preview";

  const srsDoc = `${window.location.origin}/docs/FoodSync_SRS.pdf`;
  const sddDoc = `${window.location.origin}/docs/FoodSync_SDD.pdf`;

  return (
    <Section id="projects" title="Entrepreneurial Projects">
      
      {/* RecruiteMee Project */}
      <div className="grid lg:grid-cols-2 gap-10 items-stretch mb-12">
        <RecruiteMeeCard />
        <div className="flex flex-col h-full">
          <LivePreview3D src={previewSrc} label={previewLabel} />
          <VisitButton href={previewSrc} label="Visit" />
        </div>
      </div>

      {/* FoodSync Project */}
      <Tilt3D>
        <div className="relative card-neo rounded-[24px] p-6 md:p-8 overflow-hidden">
          <div className="shine pointer-events-none" />

          <h3 className="text-2xl font-bold text-center mb-4 text-[var(--text)]">
            🌱 FoodSync — Reducing Food Waste with Tech
          </h3>
          <p className="text-center text-[var(--text-muted)] max-w-2xl mx-auto mb-6">
            A MERN-based platform connecting restaurants, event organizers, and households with NGOs & volunteers
            to donate surplus food, track logistics, and minimize wastage.
          </p>

          <FoodSyncTimeline />

          <div className="flex gap-6 mt-6 justify-center">
            <a
              href={srsDoc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-violet-500 hover:underline"
            >
              📄 View SRS Document
            </a>
            <a
              href={sddDoc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-violet-500 hover:underline"
            >
              📄 View SDD Document
            </a>
          </div>
        </div>
      </Tilt3D>
    </Section>
  );
}
