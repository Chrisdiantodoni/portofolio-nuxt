// server/api/mails/[id]/trash.delete.ts
import { db } from "../../../../src/index";
import { mails } from "~~/src/db/schema/messages";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const config = useRuntimeConfig(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID tidak ditemukan",
    });
  }
  try {
    const result = await db
      .update(mails)
      .set({
        senderName: config.gmailName,
        senderEmail: config.gmailUser,
        to: body.to,
        subject: body.subject,
        body: body.body,
        unread: false,
        status: "draft",
        date: new Date().toISOString(),
      })
      .where(eq(mails.id, Number(id)))
      .returning();

    return {
      success: true,
      statusCode: 200,
      message: `Mail ${id} moved to draft`,
      id: id,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Gagal mengupdate status baca",
    });
  }
});
