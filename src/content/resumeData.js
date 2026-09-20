/**
 * ATS-oriented résumé content (sourced from PavanSaiRapeti_FullStackDeveloper_Resume 1.docx).
 * Phone omitted by request.
 */

export const resumeMeta = {
  fullName: "Pavan Sai Rapeti",
  headline: "Full Stack Developer",
  location: "Mississauga, Ontario, Canada",
  email: "pavansairapeti28@gmail.com",
  website: "https://www.pavansairapeti.com",
  websiteLabel: "www.pavansairapeti.com",
  githubUrl: "https://github.com/PavanSaiRapeti",
  linkedinUrl: "https://www.linkedin.com/in/pavanrapeti",
};

export const summary = `Full Stack Developer with 6+ years of hands-on experience in building dynamic and responsive web applications using React.js, Next.js, Tailwind CSS, PostgreSQL, Express.js, and Node.js, C#, ASP.NET. Passionate about delivering exceptional customer experiences through innovative and efficient solutions. Technical expertise, combined with creativity and a commitment to quality, enables effective contribution to any development team. Eager to apply full-stack experience to drive success in cutting-edge projects.`;

export const skillSections = [
  {
    title: "Frontend Technologies",
    bullets: [
      "Core Frontend: React, Next.js, TypeScript, JavaScript (ES6+).",
      "State Management: Redux Saga.",
      "Styling & UI Libraries: Tailwind CSS, Material UI, Styled Components.",
      "Component Development: Storybook.",
      "Performance Optimization: Code Splitting, Lazy Loading, React Suspense, Server Components.",
      "Testing & Debugging: Jest, React Testing Library, Cypress, Enzyme, Mocha.",
      "Build Tools & Tooling: NPM, Vite, Babel, ESLint, Prettier.",
      "Mobile & Cross-Platform: React Native.",
    ],
  },
  {
    title: "Development & Best Practices",
    bullets: [
      "Backend Technologies: Node.js, Express.js, MongoDB, REST APIs, GraphQL, PostgreSQL, SQL, Python, Java, C#, ASP.NET.",
      "Cloud and infrastructure: Google Kubernetes Engine (GKE), AWS, Docker, Kubernetes, Micro-Frontends.",
      "Testing & Debugging: Jest, Cypress, TDD (Test-Driven Development).",
      "Version Control & CI/CD: Git, GitHub, CI/CD Pipelines.",
      "Design Systems & Documentation: Storybook, Swagger JS.",
      "Agile Development: Scrum, Jira, Confluence.",
    ],
  },
];

export const experience = [
  {
    company: "TCP Network Services",
    title: "Programmer",
    dates: "May 2025 – Present",
    context:
      "TCP Automation Platform — network device management and automation for configuration backups, command execution, and topology visualization. Tech stack: Python (Flask), React, PostgreSQL, Tailwind CSS, WebSockets, Paramiko, Netmiko, SSH/Telnet.",
    highlights: [
      "Architected a modular Flask Blueprint-based REST API with real-time WebSocket communication, enabling live progress tracking for 300+ concurrent device operations and reducing backup execution time through intelligent thread pooling.",
      "Designed a responsive React frontend with dynamic network topology visualization using React Flow and Dagre, with interactive device discovery, mapping, and topology snapshots with drag-and-drop editing.",
      "Implemented multi-protocol device connectivity (SSH/Telnet/SNMP) with automatic fallback mechanisms, supporting 300+ network device types from multiple vendors via Paramiko and Netmiko.",
      "Built a command execution engine with parallel multi-device orchestration, real-time execution tracking, and Excel/ZIP export, supporting 50+ concurrent worker threads.",
      "Engineered JWT + Active Directory/LDAP authentication with role-based access control (user/admin/dbadmin), rate limiting, and audit trail logging for enterprise security compliance.",
      "Developed PostgreSQL database abstraction with connection pooling, transaction management, and schema migrations for high-concurrency workloads.",
      "Created automated Excel report generation with conditional formatting and color-coded status (PASS/FAIL/PARTIAL_PASS) for device compliance visibility.",
      "Implemented alerting and notification aggregation, support ticket creation with MFA, and email integration for incident response.",
    ],
  },
  {
    company: "LTIMindtree",
    title: "Senior Software Engineer",
    dates: "August 2022 – March 2024",
    roles: [
      {
        summary:
          "Digital Dashboard for Nokia — frontend architecture and UX. Tech stack: React, TypeScript, JavaScript, Jest, Tailwind CSS.",
        highlights: [
          "Boosted customer engagement and conversions through curated onboarding and A/B testing.",
          "Strengthened code quality and security; reduced vulnerabilities and improved consistency.",
          "Maintained and updated code libraries for security and features.",
          "Mentored interns and junior developers.",
        ],
      },
      {
        summary: "Enhanced Bekaert’s e-commerce platform. Tech stack: React, TypeScript, Jest, Enzyme.",
        highlights: [
          "Improved code consistency and maintainability across the platform.",
          "Maintained and updated code libraries.",
        ],
      },
      {
        summary:
          "Led migration for MSC Direct’s e-commerce system (PHP to React). Tech stack: React, Node.js, Express.js, C#, ASP.NET, MySQL, GraphQL, REST APIs.",
        highlights: [
          "Delivered a dynamic UI with React’s component-based architecture.",
          "Styled the frontend with Tailwind CSS for responsiveness and modern design.",
          "Built Node.js and Express.js backend, optimizing server-side performance.",
          "Designed GraphQL and RESTful APIs for product search, order management, and shipment tracking.",
          "Documented APIs with Swagger.js.",
          "Strengthened testing with Jest (unit) and Cypress (E2E).",
        ],
      },
    ],
  },
  {
    company: "Tata Consultancy Services (TCS)",
    title: "System Engineer",
    dates: "January 2020 – August 2022",
    roles: [
      {
        summary:
          "Internal digital dashboard for company portal. Tech stack: Next.js, React, Tailwind CSS, Node.js, Express.js, GraphQL, RESTful APIs, Swagger.js, Jest, Cypress.",
        highlights: [
          "Developed a responsive web app with React and Python, improving customer satisfaction by 25%.",
          "Enhanced unit tests with Jest and Enzyme, reducing post-deployment bugs by 40%.",
          "Maintained and updated code libraries for efficiency.",
          "Optimized GraphQL queries, improving data efficiency by 40% and cutting load times by 15%.",
        ],
      },
      {
        summary:
          "Rate Entry System for CITI. Tech stack: React, TypeScript, C#, ASP.NET, Python, Java.",
        highlights: [
          "Optimized assets with Webpack, improving load times by 20%.",
          "Developed 3D visualizations with Three.js in React applications.",
          "Collaborated with 5+ product managers and UX designers in Agile for 3 major React projects.",
          "Conducted 20+ code reviews and mentored 5 junior developers in React, TypeScript, and Python.",
        ],
      },
    ],
  },
  {
    company: "Nuvo Horizons",
    title: "Freelancing",
    dates: "August 2024 – December 2024",
    highlights: [
      "Built a platform for students to explore colleges and programs, view admission requirements, and apply — React.js, Java, Kotlin, REST APIs.",
      "Used AWS, PostgreSQL, and MongoDB for cloud infrastructure and data, supporting registration and applications.",
    ],
  },
];

export const education = [
  {
    degree: "Computer Application Development",
    school: "Conestoga College",
    location: "Waterloo, ON, Canada",
    year: "2024",
  },
  {
    degree: "B.Tech (Mechanical Engineering)",
    school: "GMR Institute of Technology",
    location: "India",
    year: "2019",
  },
];

function flattenExperienceForText() {
  const lines = [];
  for (const job of experience) {
    lines.push(`${job.title} | ${job.company} | ${job.dates}`);
    if (job.context) lines.push(job.context);
    if (job.highlights) {
      for (const h of job.highlights) lines.push(`• ${h}`);
    }
    if (job.roles) {
      for (const r of job.roles) {
        lines.push(r.summary);
        for (const h of r.highlights || []) lines.push(`• ${h}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function buildResumePlainText() {
  const m = resumeMeta;
  const parts = [
    m.fullName,
    m.headline,
    "",
    `${m.location} | ${m.email}`,
    m.websiteLabel,
    m.socialLabels.join(" | "),
    "",
    "PROFESSIONAL SUMMARY",
    summary,
    "",
    "TECHNICAL SKILLS & EXPERTISE",
    "",
  ];
  for (const sec of skillSections) {
    parts.push(sec.title.toUpperCase());
    for (const b of sec.bullets) parts.push(`• ${b}`);
    parts.push("");
  }
  parts.push("PROFESSIONAL EXPERIENCE", "", flattenExperienceForText());
  parts.push("EDUCATION", "");
  for (const e of education) {
    parts.push(`${e.degree} — ${e.school}, ${e.location} (${e.year})`);
  }
  return parts.join("\n");
}
