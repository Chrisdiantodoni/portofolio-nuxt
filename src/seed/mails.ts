import "dotenv/config";

import { db } from "../index";
import { mails } from "../db/schema/messages";

async function seed() {
  console.log("🌱 Seeding database...");

  const dummyMails = [
    {
      senderName: "Jordan Smith",
      senderEmail: "jordan.smith@example.com",
      senderAvatarSrc: "https://i.pravatar.cc/150?u=jordan",
      subject: "Project Update: Q1 Goals",
      body: "Hi Team, I've attached the latest report regarding our Q1 goals. Please review it before our meeting tomorrow. Best, Jordan.",
      unread: true,
      date: new Date().toISOString(),
    },
    {
      senderName: "Sarah Connor",
      senderEmail: "sarah.c@techcorp.io",
      senderAvatarSrc: "https://i.pravatar.cc/150?u=sarah",
      subject: "Question about the new UI",
      body: "Hey! I was looking at the new Dashboard UI and I have some feedback regarding the color palette. Can we jump on a quick call?",
      unread: false,
      date: new Date(Date.now() - 3600000).toISOString(), // 1 jam yang lalu
    },
    {
      senderName: "GitHub",
      senderEmail: "noreply@github.com",
      senderAvatarSrc:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      subject: "[Security] Alert: New sign-in to your account",
      body: "A new sign-in was detected on your account from a Chrome browser on Windows. If this wasn't you, please secure your account.",
      unread: true,
      date: new Date(Date.now() - 86400000).toISOString(), // 1 hari yang lalu
    },
    {
      senderName: "Amazon Web Services",
      senderEmail: "no-reply-aws@amazon.com",
      senderAvatarSrc: null, // Contoh tanpa avatar
      subject: "Your Monthly AWS Bill",
      body: "Your invoice for the month of January is now available. The total amount due is $12.45. Thank you for using AWS.",
      unread: false,
      date: new Date(Date.now() - 172800000).toISOString(), // 2 hari yang lalu
    },
  ];

  try {
    // Optional: Bersihkan tabel sebelum seeding (Hati-hati di production!)
    // await db.delete(mails);

    await db.insert(mails).values(dummyMails);
    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    // Tutup koneksi jika perlu (tergantung driver db kamu)
    process.exit(0);
  }
}

seed();
