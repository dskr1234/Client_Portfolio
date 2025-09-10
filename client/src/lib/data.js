// ---------- Profile ----------
export const profile = {
  name: "Upendra Dommaraju",
  title: "M.S. Computer Science @ University of Dayton",
  location: "Dayton, Ohio, USA",
  resumeFile: "/resume/Upendra_Dommaraju_Resume.pdf",
  about:
    "Graduate student with strong full-stack MERN skills and industry experience at Accenture. Passionate about performant UIs, reliable APIs, and clean architecture.",
  links: {
    email: "uppiupendra13@gmail.com",
    phone: "937-608-2488",
    linkedin: "https://www.linkedin.com/in/upendradommaraju/",
    leetcode: "https://leetcode.com/u/Uppi_007/",
    github: "https://github.com/uppi07",
  },
};

// ---------- Experience ----------
export const freelance = {
  role: "Freelance Full-Stack Developer",
  company: "Self-Employed",
  period: "Remote — ongoing",
  location: "Remote",
  type: "Contract",
  stack: ["JavaScript", "React", "Node.js", "REST APIs", "SQL", "Git", "Agile"],
  bullets: [
    "Delivered 3 enterprise web apps with an Agile team, released 2 weeks ahead of deadlines and strong stakeholder feedback.",
    "Resolved 15+ major UI/UX issues (React, responsiveness, cross-browser), boosting user satisfaction by ~25%.",
    "Optimized APIs & SQL queries, cutting average latency from ~800ms → ~500ms (≈30% faster).",
    "Improved scalability by ~50% via modularized frontend, better API integrations, and streamlined CI/CD.",
    "Partnered with cross-functional teams to ship 5+ user-facing features; QA defects down ~20%.",
  ],
  logo: "/Exp_Com_Logo.png",
};

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
    logo: "/Exp_Com_Logo.png",
  },
];

// ---------- Projects (unchanged, kept here for completeness) ----------
export const projects = [
  {
    name: "RecruiteMee — ATS Resume Optimization",
    period: "Jan 2024 – Present",
    tags: ["MERN", "Payments", "SaaS", "Razorpay", "Referral"],
    link: "https://recruitemee.com",
    preview: "https://recruitemee.com",
    description:
      "ATS-optimized resume platform with free review funnel, influencer referral system, INR/USD pricing, secure payments, and admin dashboards.",
    points: [
      "Built Node/Express APIs with crisp contracts & caching",
      "Integrated Razorpay; handled paise/cents & currency toggles",
      "Influencer dashboards + referral tracking & payouts",
      "React + motion UI, glassy theme, responsive",
    ],
  },
];

// ---------- Skills ----------
export const skills = {
  languages: ["JavaScript (ES6+)", "Python", "HTML", "CSS", "SQL", "MongoDB"],
  frameworks: ["React", "Node", "Express", "Django", "Bootstrap", "NumPy", "Pandas", "PyTest"],
  tools: ["Git", "GitHub", "VS Code", "MySQL", "PostgreSQL", "REST APIs", "CI/CD", "AWS", "Agile/Scrum"],
};

// ---------- Education ----------
export const education = [
  {
    school: "University of Dayton",
    degree: "M.S. in Computer Science",
    start: "Jan 2024",
    end: "Dec 2025",
    gpaText: "GPA 3.6 / 4.0",
    info: "Graduate coursework and research focused on systems, AI and software engineering.",
    coursework: [
      "CPS 501 – Advanced Programming & Data Structures",
      "CPS 542 – Database Management Systems I",
      "CPS 518 – Software Engineering",
      "CPS 592 – Data Science Pattern Recognition",
      "CPS 584 – Advanced Intelligent Systems & Deep Learning",
      "CPS 536 – Operating Systems",
      "CPS 622 – Software Project Management",
      "CPS 530 – Algorithm Design",
      "CPS 592 – Web Application Development And Hacking",
    ],
    logo: "/Dayton.png",
  },
  {
    school: "Bharath University, Chennai",
    degree: "B.Tech in Computer Science & Engineering",
    start: "2018",
    end: "2022",
    gpaText: "CGPA 8.44 / 10",
    info: "Core CS foundation with hands-on labs and projects.",
    coursework: [
      "U18PCCS402 – Design and Analysis of Algorithm",
      "U18ESCS101 – Problem Solving & Python Programming",
      "U18PCCS504 – Computer Networks",
      "U18PECS062 – Blockchain Technology",
      "U18PECS013 – Data Warehousing and Data Mining",
      "U18PCCS701 – Big Data Analytics",
      "U180EEC006 – Basics of Internet of Things",
      "U18PCCS3L2 – Object Oriented Programming Lab",
      "U18PCCS6L2 – Object Oriented Software Engineering Lab",
      "U18PECS052 – Web Security",
    ],
    logo: "/Bharath.png",
  },
  {
    school: "Narayana Junior College, Tirupati",
    degree: "MPC (Maths, Physics, Chemistry)",
    start: "2016",
    end: "2018",
    gpaText: "",
    info:
      "Specialized in Mathematics, Physics, and Chemistry — strengthened analytical and quantitative foundations for CS.",
    coursework: ["Mathematics", "Physics", "Chemistry"],
    logo: "/Narayana.png",
  },
];
