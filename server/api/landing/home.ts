import { db } from "../../../src/index";
// Import schema kamu di sini agar bisa digunakan dalam query
// import { projects, experiences, blogs, testimonials, faqs } from '~~/src/db/schema';
import { eq } from "drizzle-orm";
import { pages } from "~~/src/db/schema/schema";

export default defineEventHandler(async (event) => {
  try {
    // Kita jalankan semua query secara bersamaan (Parallel) agar lebih cepat
    const [
      profile,
      allProjects,
      allExperiences,
      allBlogs,
      allTestimonials,
      allFaqs,
      seo,
    ] = await Promise.all([
      db.query.profile.findFirst(),
      db.query.projects.findMany({
        orderBy: (projects, { desc }) => [desc(projects.year)],
        limit: 6, // Biasanya di home hanya tampilkan beberapa
      }),
      db.query.workExperience.findMany({
        orderBy: (exp, { desc }) => [desc(exp.period)],
      }),
      db.query.articles.findMany({
        limit: 3,
        orderBy: (blogs, { desc }) => [desc(blogs.publishedAt)],
      }),
      db.query.testimonials.findMany(),
      db.query.faqs.findMany(),
      db.query.pages.findFirst({ where: eq(pages.slug, "home") }),
    ]);

    return {
      success: true,
      profile: profile || null,
      projects: allProjects || [],
      work_experiences: allExperiences || [],
      blogs: allBlogs || [],
      testimonials: allTestimonials || [],
      faqs: allFaqs || [],
      seo: seo || null,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data landing page",
    });
  }
});
