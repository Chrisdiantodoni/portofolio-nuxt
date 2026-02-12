import { db } from "../../../src/index";
import { profile } from "../../../src/db/schema/profile";
import { eq } from "drizzle-orm";
import { cloudinary } from "../../utils/cloudinary";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, message: "No data provided" });
    }

    const data: Record<string, string> = {};
    let avatarBuffer: Buffer | null = null;
    let cvBuffer: Buffer | null = null;

    // 1. Ekstrak Data dengan Validasi Buffer
    for (const item of formData) {
      if (!item.name) continue;

      // Cek apakah data valid (bukan string "null" atau "undefined")
      const rawValue = item.data.toString("utf-8");
      const isValidValue =
        rawValue !== "undefined" && rawValue !== "null" && rawValue !== "";

      if (item.name === "avatarUrl" && item.filename && item.data.length > 10) {
        avatarBuffer = item.data;
      } else if (
        item.name === "cvUrl" &&
        item.filename &&
        item.data.length > 10
      ) {
        cvBuffer = item.data;
      } else if (isValidValue && !item.filename) {
        data[item.name] = rawValue;
      }
    }

    // Helper Upload
    const uploadToCloudinary = (buffer: Buffer, options: any) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer);
      });
    };

    // Ambil data lama dulu untuk fallback URL
    const [existing] = await db
      .select()
      .from(profile)
      .where(eq(profile.id, 1))
      .limit(1);

    // 2. Upload Avatar (Jika ada buffer baru)
    let avatarUrl = existing?.avatarUrl || "";
    if (avatarBuffer) {
      const avatarResult = (await uploadToCloudinary(avatarBuffer, {
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

    // 3. Upload CV (Jika ada buffer baru)
    let cvUrl = existing?.cvUrl || null;
    if (cvBuffer) {
      const cvResult = (await uploadToCloudinary(cvBuffer, {
        folder: "portfolio/resumes",
        resource_type: "raw",
        format: "pdf",
      })) as any;
      cvUrl = cvResult.secure_url;
    }

    // 4. Susun Data untuk Drizzle
    const profileData = {
      name: data.name ?? existing?.name ?? "",
      email: data.email ?? existing?.email ?? "",
      location: data.location ?? existing?.location ?? "",
      status: data.status ?? existing?.status ?? "",
      headline: data.headline ?? existing?.headline ?? "",
      shortBio: data.shortBio ?? existing?.shortBio ?? "",
      longBio: data.longBio ?? existing?.longBio ?? "",
      about_page: data.about_page ?? existing?.about_page ?? "",
      avatarUrl: avatarUrl,
      cvUrl: cvUrl,
    };

    let result;
    if (existing) {
      [result] = await db
        .update(profile)
        .set(profileData)
        .where(eq(profile.id, 1))
        .returning();
    } else {
      [result] = await db.insert(profile).values(profileData).returning();
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Profile update error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to update profile",
    });
  }
});
