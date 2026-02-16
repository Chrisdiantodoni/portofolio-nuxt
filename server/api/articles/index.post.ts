import { db } from "../../../src/index";
import { articles } from "../../../src/db/schema/articles";
import { slugify } from "../../utils/slugify";

export default defineEventHandler(async (event) => {
  try {
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

    // 1. Generate Unique Slug
    const baseSlug = slugify(data.title);
    let finalSlug = baseSlug;
    const existing = await db.query.articles.findFirst({
      where: (articles, { eq }) => eq(articles.slug, baseSlug),
    });

    if (existing) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 5)}`;
    }

    // 2. Upload to Cloudinary
    let imageUrl = "";
    if (imageBuffer) {
      const result = await uploadToCloudinary(imageBuffer, {
        folder: "articles",
      });
      imageUrl = result.secure_url;
    }

    // 3. Insert ke Database
    const [newArticle] = await db
      .insert(articles)
      .values({
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt, // Format "YYYY-MM-DD"
        slug: finalSlug,
        imageUrl: imageUrl,
      })
      .returning();

    return { success: true, data: newArticle };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
