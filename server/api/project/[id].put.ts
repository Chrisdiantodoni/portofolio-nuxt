import { db } from "../../../src/index";
import { projectTechnologies, projects } from "../../../src/db/schema/projects";
import { eq, and, ne } from "drizzle-orm";
import { slugify } from "../../utils/slugify";
import { v2 as cloudinary } from "cloudinary";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) throw createError({ statusCode: 400, message: "ID is required" });

    const formData = await readMultipartFormData(event);
    if (!formData)
      throw createError({ statusCode: 400, message: "No data provided" });

    const data: Record<string, any> = {};
    let imageBuffer: Buffer | null = null;

    for (const item of formData) {
      if (item.name === "imageUrl" && item.data && item.filename) {
        imageBuffer = item.data;
      } else if (item.name) {
        data[item.name] = item.data.toString();
      }
    }

    // 1. Cari data lama untuk keperluan hapus gambar lama di Cloudinary
    const oldProject = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
    if (!oldProject)
      throw createError({ statusCode: 404, message: "Project not found" });

    // 2. Logika Slug (Hanya update slug jika title berubah)
    let finalSlug = oldProject.slug;
    if (data.title && data.title !== oldProject.title) {
      const baseSlug = slugify(data.title);
      // Cek apakah slug baru bentrok dengan project LAIN (ne = not equal ke ID sekarang)
      const existing = await db.query.projects.findFirst({
        where: and(eq(projects.slug, baseSlug), ne(projects.id, id)),
      });

      if (existing) {
        finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 5)}`;
      } else {
        finalSlug = baseSlug;
      }
    }

    // 3. Handle Cloudinary Upload
    let imageUrl = oldProject.imageUrl;
    if (imageBuffer) {
      // Hapus gambar lama jika ada
      if (oldProject.imageUrl) {
        const publicId = oldProject.imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(`project/${publicId}`);
      }

      const imageResult = await uploadToCloudinary(imageBuffer, {
        folder: "project",
        resource_type: "image",
      });
      imageUrl = imageResult.secure_url;
    }

    // 4. Update Database Proyek Utama
    const [updatedProject] = await db
      .update(projects)
      .set({
        title: data.title ?? oldProject.title,
        slug: finalSlug,
        description: data.description ?? oldProject.description,
        year: data.year ? parseInt(data.year) : oldProject.year,
        type: data.type ?? oldProject.type,
        imageUrl: imageUrl,
        githubLink: data.githubLink ?? oldProject.githubLink,
        projectLink: data.projectLink ?? oldProject.projectLink,
      })
      .where(eq(projects.id, id))
      .returning();

    // 5. Update Teknologi (Syncing)
    if (data.technologies) {
      const techIds = JSON.parse(data.technologies);

      // Cara termudah: Hapus semua relasi lama, lalu insert yang baru
      await db
        .delete(projectTechnologies)
        .where(eq(projectTechnologies.projectId, id));

      const techInserts = techIds.map((techId: any) =>
        db.insert(projectTechnologies).values({
          projectId: id,
          technologyId: parseInt(techId),
        }),
      );
      await Promise.all(techInserts);
    }

    return {
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Gagal mengupdate data",
    });
  }
});
