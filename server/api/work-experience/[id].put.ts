import { db } from "../../../src/index";
import { workExperience } from "../../../src/db/schema/work";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // 1. Ambil ID dari router param
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: "ID is required" });
    }

    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: "No data provided" });
    }

    // 2. Ekstrak data dari MultiPart Array
    const data: Record<string, any> = {};
    let logoBuffer: Buffer | null = null;
    let hasNewFile = false;

    for (const item of formData) {
      if (item.name === "logoUrl" && item.filename && item.data.length > 0) {
        // Cek apakah item ini benar-benar file baru (punya filename dan buffer tidak kosong)
        logoBuffer = item.data;
        hasNewFile = true;
      } else if (item.name) {
        data[item.name] = item.data.toString();
      }
    }

    // 3. Logika penentuan URL Logo
    let finalLogoUrl = data.logoUrl; // Default ke string URL lama yang dikirim form

    if (hasNewFile && logoBuffer) {
      const logoResult = await uploadToCloudinary(logoBuffer, {
        folder: "Work",
        resource_type: "image",
        transformation: [{ width: 500, height: 500, fetch_format: "png" }],
      });
      finalLogoUrl = logoResult.secure_url;
    }

    // 4. Eksekusi Update ke Database
    const [result] = await db
      .update(workExperience)
      .set({
        company: data.company,
        role: data.role,
        period: data.period,
        description: data.description || "",
        logoUrl: finalLogoUrl,
      })
      .where(eq(workExperience.id, Number(id)))
      .returning();

    if (!result) {
      throw createError({ statusCode: 404, statusMessage: "Data not found" });
    }

    return {
      success: true,
      message: "Work Experience updated successfully",
      data: result,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Gagal memperbarui data",
    });
  }
});
