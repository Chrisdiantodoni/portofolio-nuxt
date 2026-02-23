import { db } from "../../../src/index";
import { pages } from "../../../src/db/schema/pages";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // 1. Ambil ID dari URL params
  const id = getRouterParam(event, "id");
  if (!id)
    throw createError({ statusCode: 400, statusMessage: "ID is required" });

  const formData = await readMultipartFormData(event);
  if (!formData)
    throw createError({ statusCode: 400, statusMessage: "No data provided" });

  const payload: any = { seo: {} };
  let imageBuffer: Buffer | null = null;
  const oldSeo = await db.query.pages.findFirst({
    where: eq(pages.id, Number(id)),
  });

  let currentImageUrl = oldSeo?.seo?.image ?? "";

  // 2. Mapping data dari FormData
  for (const item of formData) {
    const key = item.name;
    if (!key) continue;

    // Cek jika ada file baru di-upload
    if (key === "seo[image]" && item.filename && item.data.length > 0) {
      imageBuffer = item.data;
    } else {
      const value = item.data.toString();

      if (key === "title") payload.title = value;
      if (key === "slug") payload.slug = value;
      if (key === "content") payload.content = value;
      if (key === "seo[title]") payload.seo.title = value;
      if (key === "seo[description]") payload.seo.description = value;

      // Simpan URL lama sebagai fallback jika tidak ada upload baru
      if (key === "seo[image]") currentImageUrl = value;
    }
  }

  // 3. Logika Update Gambar ke Cloudinary
  if (imageBuffer) {
    try {
      const uploadResult = (await uploadToCloudinary(imageBuffer, {
        folder: "seo/og-images",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 630, crop: "fill", gravity: "center" },
          { fetch_format: "auto", quality: "auto" },
        ],
      })) as any;

      payload.seo.image = uploadResult.secure_url;
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Cloudinary Update Failed",
      });
    }
  } else {
    // Jika tidak ada upload file baru, gunakan URL string yang dikirim (URL lama)
    payload.seo.image = currentImageUrl;
  }

  // 4. Update Database menggunakan Drizzle
  try {
    const result = await db
      .update(pages)
      .set({
        ...payload,
      })
      .where(eq(pages.id, Number(id)))
      .returning();

    if (result.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Page not found" });
    }

    return result[0];
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message,
    });
  }
});
