import { db } from "../../../src/index";
import { mails } from "../../../src/db/schema/messages";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig(event);

  try {
    const result = await db
      .insert(mails)
      .values({
        senderName: config.gmailName,
        senderEmail: config.gmailUser,
        subject: body.subject,
        body: body.body,
        to: body.to,
        status: body.status || "draft", // default ke draft jika tidak dikirim
        unread: false, // kalau kita yang kirim/draf, tentu sudah terbaca
        date: new Date().toISOString(),
      })
      .returning();

    return result[0];
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
