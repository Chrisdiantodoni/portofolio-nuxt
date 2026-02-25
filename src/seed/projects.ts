import { projects, projectTechnologies } from "../db/schema/projects";
import { technologies } from "../db/schema/master";
import { db } from "../index";
import { eq } from "drizzle-orm";

export const seedProjects = async () => {
  console.log("🌱 Seeding Technologies & Projects...");

  // 1. Seed Master Technologies
  const techData = [
    {
      name: "Nuxt 3",
      icon: "i-simple-icons-nuxtdotjs",
      description: "The Intuitive Vue Framework",
    },
    {
      name: "Vue.js",
      icon: "i-simple-icons-vuedotjs",
      description: "The Progressive JavaScript Framework",
    },
    {
      name: "TypeScript",
      icon: "i-simple-icons-typescript",
      description: "JavaScript with syntax for types",
    },
    {
      name: "Tailwind CSS",
      icon: "i-simple-icons-tailwindcss",
      description: "A utility-first CSS framework",
    },
    {
      name: "Drizzle ORM",
      icon: "i-simple-icons-drizzle",
      description: "TypeScript ORM for SQL databases",
    },
    {
      name: "Turso",
      icon: "i-simple-icons-sqlite",
      description: "SQLite for the Edge",
    },
  ];

  await db.insert(technologies).values(techData).onConflictDoNothing();
  console.log("✅ Technologies seeded");

  // Ambil ID tech untuk relasi nanti
  const allTechs = await db.select().from(technologies);
  const getTechId = (name: string) => allTechs.find((t) => t.name === name)?.id;

  // 2. Seed Projects
  const projectData = [
    {
      title: "Personal Portfolio v2",
      description:
        "A high-performance portfolio website built with Nuxt 3, Turso, and Drizzle ORM.",
      projectLink: "https://portfolio.com",
      githubLink: "https://github.com/user/portfolio",
      type: "web" as const,
      year: 2024,
      slug: "personal-portfolio-v2",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    },
    {
      title: "E-Commerce Mobile App",
      description:
        "Cross-platform mobile shopping experience with real-time inventory.",
      projectLink: null,
      githubLink: "https://github.com/user/shop-app",
      type: "mobile" as const,
      year: 2023,
      slug: "ecommerce-mobile-app",
      imageUrl:
        "https://images.unsplash.com/photo-1512428559083-a4d51031f557?w=800",
    },
  ];

  for (const p of projectData) {
    // Insert project dan dapatkan datanya untuk ambil ID (UUID)
    const insertedProject = await db
      .insert(projects)
      .values(p)
      .returning()
      .onConflictDoUpdate({
        target: projects.slug,
        set: { description: p.description },
      });

    const projectId = insertedProject[0].id;

    // 3. Link Technologies ke Project (Pivot Table)
    if (p.slug === "personal-portfolio-v2") {
      const techNames = ["Nuxt 3", "TypeScript", "Turso", "Drizzle ORM"];
      const pivotValues = techNames.map((name) => ({
        projectId: projectId,
        technologyId: getTechId(name)!,
      }));
      await db.insert(projectTechnologies).values(pivotValues);
    } else {
      const techNames = ["Vue.js", "Tailwind CSS"];
      const pivotValues = techNames.map((name) => ({
        projectId: projectId,
        technologyId: getTechId(name)!,
      }));
      await db.insert(projectTechnologies).values(pivotValues);
    }
  }

  console.log("✅ Projects & Pivot Relations seeded successfully!");
};
