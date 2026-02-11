import { db } from "../../../src/index";
import { technologies } from "../../../src/db/schema/master";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody(event);

    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nama wajib diisi",
      });
    }

    const existingTechnolgies = await db.query.technologies.findFirst({
      where: eq(technologies.name, body.name),
    });

    if (existingTechnolgies) {
      throw createError({
        statusCode: 409,
        statusMessage: "Nama Sudah Digunakan",
      });
    }

    const [newTech] = await db
      .insert(technologies)
      .values({
        name: body.name,
        icon: body.icon,
        description: body.description,
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
