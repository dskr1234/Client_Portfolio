// client/src/components/Sidebar.jsx
import React from "react";
import { profile } from "../lib/data";

const NAV_HEIGHT = 88;

export default function Sidebar() {
  return (
    <aside
      className={`
        flex flex-col
        w-full lg:w-[320px]
        relative
        lg:fixed lg:left-0 lg:top-[${NAV_HEIGHT}px]
        lg:h-[calc(100vh-${NAV_HEIGHT}px)]
        soft-2 neo p-5 z-40
        overflow-visible lg:overflow-y-auto
        rounded-[20px] lg:rounded-none lg:rounded-r-[28px]
      `}
    >
      <Content />
    </aside>
  );
}

function Content() {
  return (
    <>
      {/* Profile Image */}
      <div className="soft-3 rounded-[24px] p-4 neo-inset">
        <img
          src="/profile_image.png"
          className="rounded-[20px] w-full aspect-[4/5] object-cover"
          alt="Profile"
        />
      </div>

      {/* Name / Title */}
      <div className="mt-5">
        <h2 className="text-2xl font-extrabold text-theme">{profile.name}</h2>
        <p className="mt-1 text-theme-muted">{profile.title}</p>
        <p className="text-sm mt-2 text-theme-subtle">{profile.location}</p>
      </div>
    </>
  );
}
