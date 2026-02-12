import { db } from "../../../src/index";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.profile.findFirst();

    return {
      success: true,
      message: "Get Data Profile",
      data: data,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data",
    });
  }
});
