import nodemailer from "nodemailer";
import { mails } from "~~/src/db/schema/messages";
import { db } from "../../../src/index";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.gmailUser,
      pass: config.gmailPassword,
    },
  });

  try {
    const result = await db
      .insert(mails)
      .values({
        senderName: config.gmailName,
        senderEmail: config.gmailUser,
        subject: body.subject,
        to: body.to,
        body: body.body,
        status: "sent",
        unread: false,
        date: new Date().toISOString(),
      })
      .returning();

    const info = await transporter.sendMail({
      // Di sini kamu menggabungkan Nama dan Email
      from: `"${config.gmailName}" <${config.gmailUser}>`,
      to: body.to,
      subject: body.subject,
      text: body.body,
      html: `<div>${body.body}</div>`,
    });

    return {
      success: true,
      messageId: info.messageId,
      data: result[0],
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Gagal Kirim",
    });
  }
});
