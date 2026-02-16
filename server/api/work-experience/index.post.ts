import { db } from "../../../src/index";
import { workExperience } from "../../../src/db/schema/work";
import { uploadToCloudinary } from "../../utils/cloudinary";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: "No data provided" });
    }

    // 1. Ekstrak data dari MultiPart Array
    const data: Record<string, any> = {};
    let logoBuffer: Buffer | null = null;

    for (const item of formData) {
      if (item.name === "logoUrl" && item.data) {
        logoBuffer = item.data; // Simpan buffer gambar
      } else if (item.name) {
        data[item.name] = item.data.toString(); // Simpan field teks (company, role, dll)
      }
    }

    // 2. Proses Upload Cloudinary jika ada gambar
    let logoUrl = data.logoUrl || ""; // Default ke string kosong atau URL manual jika ada
    if (logoBuffer) {
      const logoResult = await uploadToCloudinary(logoBuffer, {
        folder: "Work",
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "thumb" }],
      });
      logoUrl = logoResult.secure_url;
    }

    // 3. Simpan ke Database (Sesuai Skema: company, role, period, description, logoUrl)
    const [result] = await db
      .insert(workExperience)
      .values({
        company: data.company,
        role: data.role,
        period: data.period,
        description: data.description || "",
        logoUrl: logoUrl,
      })
      .returning();

    return {
      success: true,
      message: "Work Experience added successfully",
      data: result, // Tadi kamu panggil 'data', harusnya 'result' hasil insert
    };
  } catch (error: any) {
    console.log({ error });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Gagal menyimpan data",
    });
  }
});
