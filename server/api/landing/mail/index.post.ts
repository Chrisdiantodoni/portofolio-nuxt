import { db } from "~~/src/index";
import { mails } from "~~/src/db/schema/messages";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const config = useRuntimeConfig(event);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.gmailUser,
        pass: config.gmailPassword,
      },
    });

    const result = await db.insert(mails).values({
      senderName: body.name,
      senderEmail: body.email,
      subject: body.subject,
      body: body.body,
      to: "Chrisdiantodoni@gmail.com",
      status: "inbox",
      unread: false,
      date: new Date().toISOString(),
    });

    const resultTransporter = await transporter.sendMail({
      from: `"${config.gmailName}" <${config.gmailUser}>`,
      to: "Chrisdiantodoni@gmail.com",
      subject: body.subject,
      text: body.body,
      html: `<div>${body.body}</div>`,
    });
    const data = {
      result,
      ...resultTransporter,
    };

    return {
      success: true,
      result: data,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data landing page",
    });
  }
});
