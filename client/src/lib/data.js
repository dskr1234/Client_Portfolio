export const profile = {
  name: "Upendra Dommaraju",
  title: "M.S. Computer Science @ University of Dayton",
  location: "Dayton, Ohio, USA",
  resumeFile: "/resume/Upendra_Dommaraju_Resume.pdf", // <-- used by Sidebar download
  about:
    "Graduate student with strong full-stack MERN skills and industry experience at Accenture. Passionate about performant UIs, reliable APIs, and clean architecture.",
  links: {
    email: "uppiupendra13@gmail.com",
    phone: "937-608-2488",
    linkedin: "https://www.linkedin.com/in/upendradommaraju/",
    leetcode: "https://leetcode.com/u/Uppi_007/",
    github: "https://github.com/uppi07",
  },
}

export const experience = [
  {
    role: "Associate Software Engineer",
    company: "Accenture",
    period: "Mar 2022 – Dec 2023",
    stack: ["React", "Node.js", "SQL", "AWS"],
    bullets: [
      "Delivered 3 enterprise web apps in Agile, 2 weeks ahead of deadlines.",
      "Improved API latency by 30% and optimized SQL queries to 500ms.",
      "Resolved 15+ major UI/UX issues boosting satisfaction by 25%.",
    ],
     logo: '/Exp_Com_Logo.png'
  },
]

export  const projects = [
  {
    name: "RecruiteMee — ATS Resume Optimization",
    period: "Jan 2024 – Present",
    tags: ["MERN", "Payments", "SaaS", "Razorpay", "Referral"],
    link: "https://recruitemee.com",
    preview: "https://recruitemee.com",  // or "/demo.mp4" or "/screenshot.png"
    description:
      "ATS-optimized resume platform with free review funnel, influencer referral system, INR/USD pricing, secure payments, and admin dashboards.",
    points: [
      "Built Node/Express APIs with crisp contracts & caching",
      "Integrated Razorpay; handled paise/cents & currency toggles",
      "Influencer dashboards + referral tracking & payouts",
      "React + motion UI, glassy theme, responsive"
    ]
  }
]


export const skills = {
  languages: ["JavaScript (ES6+)", "Python", "HTML", "CSS", "SQL", "MongoDB"],
  frameworks: ["React", "Node", "Express", "Django", "Bootstrap", "NumPy", "Pandas", "PyTest"],
  tools: ["Git", "GitHub", "VS Code", "MySQL", "PostgreSQL", "REST APIs", "CI/CD", "AWS", "Agile/Scrum"],
}

export const education = [
  {
    school: "University of Dayton",
    degree: "M.S. in Computer Science",
    info: "GPA 3.6 (4.0 in first two semesters) • Jan 2024 – Dec 2025",
    coursework: ["Advanced Programming & Data Structures", "Software Engineering"],
     logo: '/Dayton.png'
  },
  {
    school: "Bharath University, Chennai",
    degree: "B.Tech in Computer Science & Engineering",
    info: "2018 – 2022",
    coursework: ["Data Structures", "Operating Systems", "DBMS", "Networks"],
    logo: '/Bharath.png'
  },
  {
    school: "Narayana Junior College, Tirupati",
    degree: "MPC",
    info: "2016 – 2018",
    coursework: ["Fundamentals of General Science"],
    logo: '/Narayana.png'
  },
]
