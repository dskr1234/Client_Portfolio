import React from "react";
import { profile } from "../lib/data";

const NAV_HEIGHT = 88;
const RAW_PDF_PATH = "/Upendra Dommaraju - ComputerScienceGraduate.pdf";
const PDF_SRC = encodeURI(RAW_PDF_PATH);
const DOWNLOAD_NAME = "Upendra_Dommaraju_Resume.pdf";

export default function Sidebar() {
  return (
    <aside
      className={`
        flex flex-col
        w-full lg:w-[320px]
        relative
        lg:fixed lg:left-0 lg:top-[${NAV_HEIGHT}px]
        lg:h-[calc(100vh-${NAV_HEIGHT}px)]
        rounded-[20px] lg:rounded-none lg:rounded-r-[28px]
        soft-2 neo p-5 z-40
        overflow-visible lg:overflow-y-auto
      `}
    >
      <Content />
    </aside>
  );
}

function Content() {
  return (
    <>
      <div className="soft-3 rounded-[24px] p-4 neo-inset">
        <img
          src="/profile_image.png"
          className="rounded-[20px] w-full aspect-[4/5] object-cover"
          alt="Profile"
        />
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-extrabold text-theme">
          {profile.name || "Upendra Dommaraju"}
        </h2>
        <p className="mt-1 text-theme-muted">
          {profile.title || "M.S. Computer Science @ University of Dayton"}
        </p>
        <p className="text-sm mt-2 text-theme-subtle">
          {profile.location || "Dayton, Ohio, USA"}
        </p>
      </div>

      <a
        href={PDF_SRC}
        download={DOWNLOAD_NAME}
        className="
          mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full
          bg-glass-soft hover:bg-[color-mix(in_oklab,var(--text)_10%,transparent)]
          text-theme dark:text-violet-200
          border border-[color-mix(in_oklab,var(--text)_12%,transparent)] dark:border-violet-400/30
          transition-all
        "
        aria-label="Download Resume PDF"
      >
        ⬇️ Download Resume
      </a>

      <a
        href={PDF_SRC}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full
                   bg-glass-soft text-theme/90 hover:text-theme
                   dark:bg-white/10 dark:text-white/90
                   border border-[color-mix(in_oklab,var(--text)_12%,transparent)] dark:border-white/15 transition"
      >
        🔍 View Resume
      </a>
    </>
  );
}
