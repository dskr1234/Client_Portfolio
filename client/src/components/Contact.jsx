// Contact.jsx
import React, { useState } from 'react'
import Section from './Section'
import toast, { Toaster } from 'react-hot-toast'
import { Mail, User, MessageSquare } from 'lucide-react'
import { motion, useSpring } from 'framer-motion'

/* 3D tilt wrapper */
function Tilt3D({ children, max = 10, intensity = 6 }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const tx = useSpring(0, { stiffness: 250, damping: 22 })
  const ty = useSpring(0, { stiffness: 250, damping: 22 })

  function onMove(e) {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * -2 * max)
    rx.set((py - 0.5) *  2 * max)
    tx.set((px - 0.5) * intensity)
    ty.set((py - 0.5) * intensity)
  }
  function onLeave() {
    rx.set(0); ry.set(0); tx.set(0); ty.set(0)
  }

  return (
    <motion.div
      className="perspective-1200"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, x: tx, y: ty }}
    >
      {/* no overlay blocking clicks */}
      {children}
    </motion.div>
  )
}

export default function Contact(){
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', message:'' })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try {
      const base = import.meta.env.VITE_API_BASE
      if (!base) throw new Error('VITE_API_BASE is missing. Create client/.env and restart.')

      const res = await fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      })
      let data = null
      try { data = await res.json() } catch {}
      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`
        throw new Error(msg)
      }
      toast.success('Message sent! I will get back soon.')
      setForm({ name:'', email:'', message:'' })
    } catch (err){
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section id="contact" title="Contact">
      <Toaster />
      <Tilt3D>
        <div className="soft-2 card-neo rounded-[28px] p-6 md:p-10">
          <form onSubmit={submit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-[var(--text)]">
                <User size={16}/> Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handle}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-[var(--text)]">
                <Mail size={16}/> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="Enter your email"
              />
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-[var(--text)]">
                <MessageSquare size={16}/> Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handle}
                required
                rows="6"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="Write your message..."
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </Tilt3D>
    </Section>
  )
}
