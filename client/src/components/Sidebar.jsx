import React from "react"
import { profile } from "../lib/data"
import { FaLinkedin, FaGithub } from "react-icons/fa"
import { SiLeetcode, SiGmail } from "react-icons/si"

const NAV_HEIGHT = 88 // match your navbar height

export default function Sidebar() {
  return (
    <aside
      className="
        hidden lg:flex lg:flex-col
        fixed left-0 top-[88px]
        w-[320px] h-[calc(100vh-88px)]
        rounded-none rounded-r-[28px]
        soft-2 neo p-5 pastel z-40
        overflow-y-auto
      "
      style={{ color: 'var(--text)' }}
    >
      <Content />
    </aside>
  )
}

function Content(){
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
        <h2 className="text-2xl font-extrabold text-[var(--text)]">{profile.name}</h2>
        <p className="mt-1" style={{ color: 'color-mix(in oklab, var(--text) 70%, transparent)'}}>
          {profile.title}
        </p>
        <p className="text-sm mt-2" style={{ color: 'color-mix(in oklab, var(--text) 60%, transparent)'}}>
          {profile.location}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
          <FaLinkedin size={20}/>
        </a>
        <a href={profile.links.leetcode} target="_blank" rel="noreferrer">
          <SiLeetcode size={20}/>
        </a>
        <a href={`mailto:${profile.links.email}`}>
          <SiGmail size={20}/>
        </a>
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          <FaGithub size={20}/>
        </a>
      </div>

      <div className="mt-6 text-sm" style={{ color: 'color-mix(in oklab, var(--text) 75%, transparent)'}}>
        <p className="leading-relaxed">
          Crafting clean UX and reliable APIs. Open to SDE-1 / full-stack roles.
        </p>
      </div>
    </>
  )
}
