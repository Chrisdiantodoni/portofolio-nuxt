import { db } from "../../../src/index";
import { projectTechnologies, projects } from "../../../src/db/schema/projects";
import { eq, like, sql } from "drizzle-orm";
import { slugify } from "../../utils/slugify";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, message: "No data provided" });
    }

    // 1. Ekstrak data dari MultiPart Array
    const data: Record<string, any> = {};
    let imageBuffer: Buffer | null = null;

    for (const item of formData) {
      if (item.name === "imageUrl" && item.data) {
        imageBuffer = item.data; // Simpan buffer gambar
      } else if (item.name) {
        data[item.name] = item.data.toString(); // Simpan field teks (company, role, dll)
      }
    }

    // 1. Generate slug awal dari title
    const baseSlug = slugify(data.title);

    // 2. Cari slug yang mirip di database
    // Kita cari yang depannya sama (misal: 'landing-page%')

    const existingSlugs = await db
      .select({ slug: projects.slug })
      .from(projects)
      .where(like(projects.slug, `${baseSlug}%`));

    // 3. Logika Incremental Slug (WordPress Style)
    let finalSlug = baseSlug;
    if (existingSlugs.length > 0) {
      const slugList = existingSlugs.map((s) => s.slug);
      let count = 2;

      // Terus looping sampai ketemu slug yang benar-benar belum dipakai
      while (slugList.includes(finalSlug)) {
        finalSlug = `${baseSlug}-${count}`;
        count++;
      }
    }

    let imageUrl = data.imageUrl || ""; // Default ke string kosong atau URL manual jika ada

    if (imageBuffer) {
      const imageResult = await uploadToCloudinary(imageBuffer, {
        folder: "project",
        resource_type: "image",
      });
      imageUrl = imageResult.secure_url;
    }
    // 1. Insert Proyek Utama
    const [newProject] = await db
      .insert(projects)
      .values({
        title: data.title,
        slug: finalSlug,
        imageUrl: imageUrl,
        description: data.description,
        year: parseInt(data.year),
        type: data.type,
      })
      .returning();

    // 2. Insert Teknologi secara paralel (tanpa transaksi)
    if (data.technologies && newProject) {
      const techIds = JSON.parse(data.technologies);
      console.log(techIds);
      // Buat array of promises untuk semua insert teknologi
      const techInserts = techIds.map((techId: any) =>
        db.insert(projectTechnologies).values({
          projectId: newProject.id,
          technologyId: parseInt(techId),
        }),
      );

      // Jalankan semua sekaligus
      await Promise.all(techInserts);
    }

    return {
      success: true,
      message: "Project added successfully",
      data: newProject,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Gagal menyimpan data",
    });
  }
});
