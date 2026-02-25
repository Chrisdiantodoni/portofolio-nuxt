import { db } from "../db";
import { seedUsers } from "./user";
import { seedArticles } from "./articles";
import { seedMails } from "./mails";
import { seedWorks } from "./works";
import { seedTestimonials } from "./testimonial";
import { seedFaqs } from "./faqs";
import { seedProjects } from "./projects";

async function main() {
  console.log("🚀 Starting seed process...");

  try {
    // Gunakan urutan yang logis (User dulu, baru artikel/work yang refer ke user)
    // await seedUsers();
    // await seedWorks();
    // await seedArticles();
    // await seedMails();
    // await seedTestimonials();
    await seedProjects();
    // await seedFaqs();

    console.log("✅ All data seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  } finally {
    // Tutup koneksi jika perlu (tergantung driver Turso kamu)
    // client.close();
  }
}

main();
