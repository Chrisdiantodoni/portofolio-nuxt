import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { testimonials } from "../../../src/db/schema/testimonials";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    // 1. Ambil ID dari URL params (asumsi file bernama [id].put.ts)
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({ statusCode: 400, message: "Missing testimonial ID" });
    }

    const formData = await readMultipartFormData(event);
    const data: Record<string, any> = {};
    let imageBuffer: Buffer | null = null;

    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, message: "No data provided" });
    }

    // 2. Parsing FormData
    for (const item of formData) {
      if (item.name === "imageUrl" && item.data.length > 0) {
        // Sesuaikan dengan key yang dikirim dari frontend (tadi di onSubmit kamu pakai "imageUrl")
        imageBuffer = item.data;
      } else if (item.name) {
        data[item.name] = item.data.toString();
      }
    }

    const existingTestimonial = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, Number(id)),
    });

    // // 3. Cek data lama di database untuk backup URL gambar
    // const existingTestimonial = await db
    //   .select()
    //   .from(testimonials)
    //   .where(eq(testimonials.id, Number(id))); // atau [0] tergantung driver drizzle kamu
    if (!existingTestimonial) {
      throw createError({ statusCode: 404, message: "Testimonial not found" });
    }

    // 4. Logika Upload Image (Hanya jika ada file baru)
    let finalAvatarUrl = data?.avatarUrl || "";

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
      finalAvatarUrl = avatarResult.secure_url;
    }

    // 5. Update ke Database
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set({
        authorName: data.authorName ?? existingTestimonial.authorName,
        authorRole: data.authorRole ?? existingTestimonial.authorRole,
        authorCompany: data.authorCompany ?? existingTestimonial.authorCompany,
        content: data.content ?? existingTestimonial.content,
        avatarUrl: finalAvatarUrl,
      })
      .where(eq(testimonials.id, Number(id)))
      .returning();

    return {
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to update testimonial",
    });
  }
});
