# MERN Portfolio — University of Dayton (USA)

A **professional, high‑polish** portfolio built on the **MERN stack** with **advanced CSS + Tailwind**, **Framer Motion animations**, and a **dark/light theme toggle**. Includes an Express server with a secure **contact API** (Nodemailer + Zod validation). Designed for **top‑tier presentation**, **performance**, and **deployability** (Vercel/Netlify + Render/Railway).

> Primary profile: **M.S. in Computer Science, University of Dayton, Ohio (USA)** — high‑profile, recruiter‑ready portfolio.

---

## ✨ Highlights

- **Modern UI/UX**: TailwindCSS, custom tokens, micro‑interactions, parallax hero, glassmorphism cards.
- **Motion**: Framer Motion page/section transitions, intersection‑based reveals.
- **Theming**: Class‑based dark/light toggle persisted in `localStorage`.
- **Performance**: Route‑level code splitting via `React.lazy`, image lazy‑loading, prefetch hints, tree‑shaken builds (Vite).
- **Accessibility**: Focus rings, skip‑to‑content, semantic HTML, ARIA labels.
- **Backend**: Express + Nodemailer contact endpoint with Zod validation and CORS.
- **SEO**: OpenGraph/Twitter meta, structured data, favicons.

**Content attribution**: profile sections are populated from the provided resume. fileciteturn0file0

---

## 🧱 Project Structure

```
mern-portfolio/
├── client/             # React + Vite + Tailwind + Framer Motion
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/tailwind.css
│       ├── lib/data.js
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── About.jsx
│           ├── Experience.jsx
│           ├── Projects.jsx
│           ├── Skills.jsx
│           ├── Education.jsx
│           ├── Contact.jsx
│           ├── Footer.jsx
│           ├── ThemeToggle.jsx
│           └── Section.jsx
└── server/             # Express + Nodemailer
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.js
        ├── routes/contact.js
        └── utils/mailer.js
```

---

## 🚀 Quick Start

### 1) Client (React)
```bash
cd client
npm i
npm run dev
```

### 2) Server (Express)
```bash
cd server
npm i
cp .env.example .env
# Set SMTP creds and CORS_ORIGIN to your client URL
npm run dev
```

### 3) Production
- **Frontend**: Deploy `client` to Vercel/Netlify (Vite build).
- **Backend**: Deploy `server` to Render/Railway/Fly. Set envs.
- **CORS**: set `CORS_ORIGIN` to your deployed frontend URL.

---

## 🔧 Environment Variables (server)
See `server/.env.example`.

---

## 🧪 Testing & Linting
- Light smoke tests via `npm run build` on client.
- Zod schema guards in server API.

---

## 📄 License
MIT (free to customize). 
