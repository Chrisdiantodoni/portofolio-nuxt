import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { testimonials } from "../../../src/db/schema/testimonials";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const formData = await readMultipartFormData(event);
    const data: Record<string, any> = {};
    let imageBuffer: Buffer | null = null;

    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, message: "No data provided" });
    }
    for (const item of formData) {
      if (item.name === "avatarUrl" && item.data) {
        imageBuffer = item.data; // Simpan buffer gambar
      } else if (item.name) {
        data[item.name] = item.data.toString(); // Simpan field teks (company, role, dll)
      }
    }
    let avatarUrl = "";
    if (imageBuffer) {
      const avatarResult = (await uploadToCloudinary(imageBuffer, {
        folder: "portfolio/avatars",
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "thumb", gravity: "face" },
          { radius: "max" },
          { fetch_format: "png" },
        ],
      })) as any;
      avatarUrl = avatarResult.secure_url;
    }
    const [newTech] = await db
      .insert(testimonials)
      .values({
        authorName: data?.authorName ?? "",
        authorRole: data?.authorRole ?? "",
        authorCompany: data?.authorCompany ?? "",
        content: data?.content ?? "",
        avatarUrl: avatarUrl,
      })
      .returning();

    return {
      success: true,
      message: "Technologies added Successfully",
      data: newTech,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
      // Jangan return objek biasa di sini, harus throw createError
      // supaya interceptor onResponseError di api.ts bisa jalan
    });
  }
});
