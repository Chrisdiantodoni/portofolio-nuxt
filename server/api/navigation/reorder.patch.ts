import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { orders } = body; // Mengharapkan array: [{ id: '...', sortOrder: 1 }, ...]
    console.log({ orders });
    if (!Array.isArray(orders)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Data orders harus berupa array",
      });
    }

    // Menggunakan Transaction agar jika satu gagal, semua batal (Atomic)
    // await db.transaction(async (tx) => {
    //   for (const item of orders) {
    //     await tx
    //       .update(navigation)
    //       .set({ sortOrder: item.sortOrder })
    //       .where(eq(navigation.id, item.id));
    //   }
    // });
    await Promise.all(
      orders.map((item) =>
        db
          .update(navigation)
          .set({ sortOrder: item.sortOrder })
          .where(eq(navigation.id, item.id)),
      ),
    );

    return {
      success: true,
      message: "Urutan berhasil diperbarui",
    };
  } catch (error: any) {
    console.log({ error });
    throw createError({
      statusCode: 500,
      statusMessage: error.statusMessage || "Gagal memperbarui urutan navigasi",
    });
  }
});
