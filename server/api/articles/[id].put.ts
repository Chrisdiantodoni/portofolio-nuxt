import { db } from "../../../src/index";
import { articles } from "../../../src/db/schema/articles";
import { eq, and, ne } from "drizzle-orm";
import { slugify } from "../../utils/slugify";
import { v2 as cloudinary } from "cloudinary";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) throw createError({ statusCode: 400, message: "ID Required" });

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

    // 1. Ambil data lama
    const oldArticle = await db.query.articles.findFirst({
      where: eq(articles.id, parseInt(id)),
    });
    if (!oldArticle)
      throw createError({ statusCode: 404, message: "Article not found" });

    // 2. Update Slug jika Title Berubah
    let finalSlug = oldArticle.slug;
    if (data.title && data.title !== oldArticle.title) {
      const baseSlug = slugify(data.title);
      const conflict = await db.query.articles.findFirst({
        where: and(eq(articles.slug, baseSlug), ne(articles.id, parseInt(id))),
      });
      finalSlug = conflict
        ? `${baseSlug}-${Date.now().toString().slice(-3)}`
        : baseSlug;
    }

    // 3. Handle Image (Replace if new)
    let imageUrl = oldArticle.imageUrl;
    if (imageBuffer) {
      // Hapus yang lama di Cloudinary jika ada
      if (oldArticle.imageUrl) {
        const publicId = oldArticle.imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(`articles/${publicId}`);
      }
      const result = await uploadToCloudinary(imageBuffer, {
        folder: "articles",
      });
      imageUrl = result.secure_url;
    }

    // 4. Execute Update
    const [updated] = await db
      .update(articles)
      .set({
        title: data.title ?? oldArticle.title,
        description: data.description ?? oldArticle.description,
        publishedAt: data.publishedAt ?? oldArticle.publishedAt,
        slug: finalSlug,
        imageUrl: imageUrl,
      })
      .where(eq(articles.id, parseInt(id)))
      .returning();

    return { success: true, data: updated };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
