import { db } from "../../../src/index";
import { pages } from "../../../src/db/schema/pages";
import { uploadToCloudinary } from "../../utils/cloudinary";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData)
    throw createError({ statusCode: 400, statusMessage: "No data provided" });

  const payload: any = { seo: {} };
  let imageBuffer: Buffer | null = null;
  let existingImageUrl = "";

  // 1. Loop pertama untuk ambil data teks dan buffer gambar
  for (const item of formData) {
    const key = item.name;

    if (!key) continue;

    // Jika ini adalah file image
    if (key === "seo[image]" && item.filename) {
      imageBuffer = item.data; // Simpan buffer untuk diupload nanti
    } else {
      // Jika ini data teks biasa
      const value = item.data.toString();

      if (key === "title") payload.title = value;
      if (key === "slug") payload.slug = value;
      if (key === "content") payload.content = value;
      if (key === "seo[title]") payload.seo.title = value;
      if (key === "seo[description]") payload.seo.description = value;
      if (key === "seo[image]") existingImageUrl = value; // Simpan URL lama jika ada
    }
  }

  // 2. Proses Upload ke Cloudinary jika ada buffer baru
  if (imageBuffer) {
    try {
      const uploadResult = (await uploadToCloudinary(imageBuffer, {
        folder: "seo/og-images",
        resource_type: "image",
        // Sesuaikan transformasi untuk OG Image (biasanya 1200x630)
        transformation: [
          { width: 1200, height: 630, crop: "fill", gravity: "center" },
          { fetch_format: "auto", quality: "auto" },
        ],
      })) as any;

      payload.seo.image = uploadResult.secure_url;
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Cloudinary Upload Failed",
      });
    }
  } else {
    // Jika tidak ada upload baru, pakai URL lama (untuk update/PUT)
    payload.seo.image = existingImageUrl;
  }

  // 3. Simpan ke Database
  try {
    const result = await db.insert(pages).values(payload).returning();
    return result[0];
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
