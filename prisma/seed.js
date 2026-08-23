/* Seed the MySQL database with real work projects.
   Usage: npm run db:seed  */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const projects = [
  {
    title: "CRM Platform",
    slug: "crm-platform",
    category: "Business App",
    description:
      "Customer relationship management platform — leads, customers, follow-ups, reporting dashboards and role-based access control for sales teams.",
    tech: "PHP, Laravel, jQuery, MySQL",
    demoUrl: null,
    repoUrl: null,
    accent: "#ff2d20",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "Service Management System (Mini ERP)",
    slug: "service-management-mini-erp",
    category: "ERP",
    description:
      "Mini ERP covering service requests, workflows, invoicing and inventory — streamlining day-to-day operations end to end.",
    tech: "Laravel, PHP, React, MySQL",
    demoUrl: null,
    repoUrl: null,
    accent: "#3b82f6",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "HRM System",
    slug: "hrm-system",
    category: "Business App",
    description:
      "Human resource management with employee records, attendance tracking, leave workflows and payroll-ready reporting.",
    tech: "PHP, Laravel, jQuery, MySQL",
    demoUrl: null,
    repoUrl: null,
    accent: "#60a5fa",
    featured: false,
    sortOrder: 3,
  },
  {
    title: "MSME Administration Portal",
    slug: "msme-administration-portal",
    category: "Administration Portal",
    description:
      "Administration portal for the MSME program — data management, verification workflows and exportable reporting systems.",
    tech: "Laravel, PHP, MySQL, REST API",
    demoUrl: null,
    repoUrl: null,
    accent: "#38bdf8",
    featured: false,
    sortOrder: 4,
  },
  {
    title: "Meeting Agenda Management",
    slug: "meeting-agenda-system",
    category: "Business App",
    description:
      "Plan meetings, manage agendas, minutes and follow-up actions across departments — with automated notifications.",
    tech: "PHP, Laravel, React, MySQL",
    demoUrl: null,
    repoUrl: null,
    accent: "#f59e0b",
    featured: false,
    sortOrder: 5,
  },
  {
    title: "Lucky Draw Management",
    slug: "lucky-draw-system",
    category: "Event System",
    description:
      "Draw management system for the NPTDC – Thukha Taw Win Housing Project — entrants, draw events, winners and audit-friendly logs.",
    tech: "PHP, Laravel, jQuery, MySQL",
    demoUrl: null,
    repoUrl: null,
    accent: "#34d399",
    featured: false,
    sortOrder: 6,
  },
];

async function main() {
  console.log("Seeding projects…");
  await prisma.project.deleteMany();
  await prisma.project.createMany({ data: projects });
  const counts = await Promise.all([prisma.project.count(), prisma.message.count()]);
  console.log(`Done ✔  projects: ${counts[0]}, messages: ${counts[1]}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
