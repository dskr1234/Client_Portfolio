
import React from 'react'
export default function Footer(){
  return (
    <footer className="mt-24 pb-10">
      <div className="container-px max-w-6xl mx-auto text-sm text-ink-muted">
        © {new Date().getFullYear()} Upendra Dommaraju. Built with React, Tailwind & Framer Motion.
      </div>
    </footer>
  )
}
