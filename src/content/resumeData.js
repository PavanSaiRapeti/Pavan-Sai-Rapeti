/**
 * ATS-oriented résumé content (sourced from Pavan_Rapeti_Resume.docx / .pdf).
 */

export const resumeMeta = {
  fullName: "Pavan Sai Rapeti",
  headline: "Full Stack Developer",
  location: "Hyderabad, India",
  email: "pavansairight@gmail.com",
  website: "https://www.pavansairapeti.com",
  websiteLabel: "www.pavansairapeti.com",
  githubUrl: "https://github.com/PavanSaiRapeti",
  githubLabel: "GitHub",
  linkedinUrl: "https://www.linkedin.com/in/pavanrapeti",
  linkedinLabel: "LinkedIn",
  get socialLabels() {
    return [this.githubLabel, this.linkedinLabel];
  },
};

export const summary = `Full Stack Developer with 6+ years of experience building scalable web applications and enterprise platforms using React.js, Next.js, TypeScript, JavaScript, Node.js, Express.js, Python, PostgreSQL, and REST/GraphQL APIs. Experienced in frontend architecture, backend services, real-time applications, network automation, API security, database design, testing, and cloud-native deployments. Proven ability to improve application performance, build reliable enterprise solutions, and collaborate with cross-functional teams in Agile environments.`;

export const skillSections = [
  {
    title: "Frontend",
    bullets: [
      "React.js, Next.js, TypeScript, JavaScript (ES6+), React Native, HTML5, CSS3",
    ],
  },
  {
    title: "UI & State",
    bullets: [
      "Redux-Saga, Tailwind CSS, Material UI, Styled Components, Storybook, React Flow",
    ],
  },
  {
    title: "Backend",
    bullets: [
      "Node.js, Express.js, Python, Flask, Java, C#, ASP.NET, REST APIs, GraphQL, WebSockets",
    ],
  },
  {
    title: "Databases",
    bullets: ["PostgreSQL, MySQL, MongoDB, SQL"],
  },
  {
    title: "Testing",
    bullets: ["Jest, React Testing Library, Cypress, Enzyme, Mocha, TDD"],
  },
  {
    title: "Cloud & DevOps",
    bullets: [
      "AWS, Google Kubernetes Engine (GKE), Docker, Kubernetes, CI/CD, Git, GitHub",
    ],
  },
  {
    title: "Networking & Automation",
    bullets: ["SSH, Telnet, SNMP, Paramiko, Netmiko"],
  },
  {
    title: "Tools & Practices",
    bullets: [
      "Vite, Webpack, Babel, ESLint, Prettier, Swagger/OpenAPI, Jira, Confluence, Scrum/Agile",
    ],
  },
];

export const experience = [
  {
    company: "TCP Network Services",
    title: "Programmer",
    dates: "May 2025 – May 2026",
    context:
      "TCP Automation Platform — Python (Flask), React, PostgreSQL, Tailwind CSS, WebSockets, Paramiko, Netmiko",
    highlights: [
      "Architected modular Flask Blueprint-based REST APIs with WebSocket communication for live progress tracking across 300+ concurrent device operations, using intelligent thread pooling to improve backup execution.",
      "Designed a responsive React frontend with React Flow and Dagre for interactive device discovery, network topology mapping, topology snapshots, and drag-and-drop editing.",
      "Implemented multi-protocol device connectivity across SSH, Telnet, and SNMP with automatic fallback, supporting 300+ device types from multiple vendors using Paramiko and Netmiko.",
      "Built a parallel command-execution engine with real-time tracking and Excel/ZIP export, supporting 50+ concurrent worker threads.",
      "Engineered JWT and Active Directory/LDAP authentication with role-based access control, rate limiting, and audit logging for enterprise security.",
      "Developed PostgreSQL database abstraction with connection pooling, transaction management, and schema migrations for high-concurrency workloads.",
      "Automated Excel compliance reporting with conditional formatting and PASS/FAIL/PARTIAL_PASS status indicators.",
      "Implemented alert aggregation, support-ticket creation with MFA, and email integration for incident response workflows.",
    ],
  },
  {
    company: "LTIMindtree",
    title: "Senior Software Engineer",
    dates: "August 2022 – March 2024",
    roles: [
      {
        summary:
          "Digital Dashboard for Nokia — React, TypeScript, JavaScript, Jest, Tailwind CSS",
        highlights: [
          "Developed and enhanced responsive dashboard experiences, including curated onboarding and A/B testing to improve customer engagement.",
          "Strengthened frontend code quality and security through library maintenance, dependency updates, and consistent development practices.",
          "Mentored interns and junior developers through code reviews, technical guidance, and frontend best practices.",
        ],
      },
      {
        summary: "Bekaert E-commerce Platform — React, TypeScript, Jest, Enzyme",
        highlights: [
          "Improved component consistency and maintainability across the e-commerce frontend through reusable React patterns and testing practices.",
          "Maintained and updated frontend libraries to support security, stability, and new product requirements.",
        ],
      },
      {
        summary:
          "MSC Direct E-commerce Migration — React, Node.js, Express.js, MySQL, GraphQL, REST APIs, Tailwind CSS",
        highlights: [
          "Led migration of an e-commerce system from PHP to React, delivering reusable component-based interfaces and responsive user experiences.",
          "Built Node.js and Express.js backend services and designed GraphQL/REST APIs for product search, order management, and shipment tracking.",
          "Documented APIs with Swagger.js and strengthened quality using Jest unit tests and Cypress end-to-end testing.",
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
          "Internal Digital Dashboard — Next.js, React, Tailwind CSS, Node.js, Express.js, GraphQL, REST APIs, Swagger.js, Jest, Cypress",
        highlights: [
          "Developed responsive web applications using React and Python, contributing to a 25% improvement in customer satisfaction.",
          "Enhanced Jest and Enzyme test coverage and practices, contributing to a 40% reduction in post-deployment bugs.",
          "Optimized GraphQL queries, improving data efficiency by 40% and reducing load times by 15%.",
        ],
      },
      {
        summary:
          "CITI Rate Entry System — React, TypeScript, C#, ASP.NET, Python, Java, Webpack, Three.js",
        highlights: [
          "Optimized frontend assets with Webpack, improving application load times by 20%.",
          "Developed 3D visualizations using Three.js within React applications.",
          "Collaborated with 5+ product managers and UX designers across 3 major React projects in Agile teams.",
          "Conducted 20+ code reviews and mentored 5 junior developers in React, TypeScript, and Python.",
        ],
      },
    ],
  },
  {
    company: "Nuvo Horizons",
    title: "Freelance Developer",
    dates: "August 2024 – December 2024",
    context:
      "Student College & Program Platform — React.js, Java, Kotlin, REST APIs, AWS, PostgreSQL, MongoDB",
    highlights: [
      "Built a platform enabling students to explore colleges and programs, review admission requirements, and submit applications.",
      "Used AWS, PostgreSQL, and MongoDB to support cloud infrastructure, registration workflows, and application data.",
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
    "TECHNICAL SKILLS",
    "",
  ];
  for (const sec of skillSections) {
    parts.push(`${sec.title}: ${sec.bullets.join("; ")}`);
  }
  parts.push("", "PROFESSIONAL EXPERIENCE", "", flattenExperienceForText());
  parts.push("EDUCATION", "");
  for (const e of education) {
    parts.push(`${e.degree} — ${e.school}, ${e.location} | ${e.year}`);
  }
  return parts.join("\n");
}
