import "dotenv/config";
import { db } from "../index";
// Pastikan path ke db instance kamu benar
import { workExperience } from "../db/schema/work";

async function main() {
  console.log("🚀 Sedang menanam data (seeding)...");

  const data = [
    {
      company: "Freelance Developer",
      role: "Fullstack Developer",
      period: "2023 - Sekarang",
      description:
        "Mengerjakan berbagai proyek web menggunakan Nuxt 3, Laravel, dan Flutter. Berhasil menyelesaikan sistem akuntansi spesifik dan landing page untuk klien lokal.",
      icon: "i-lucide-code-2",
      logoUrl:
        "https://res.cloudinary.com/demo/image/upload/v1670845334/cld-sample-2.jpg",
    },
    {
      company: "PT. Kanaka Reka Bersama",
      role: "Web Developer (Contract)",
      period: "2025 - 2026",
      description:
        "Membangun dan mengelola website perusahaan menggunakan WordPress, melakukan penyesuaian layout dan optimasi performa halaman.",
      icon: "i-lucide-globe",
      logoUrl:
        "https://res.cloudinary.com/demo/image/upload/v1670845334/cld-sample-3.jpg",
    },
    {
      company: "Tech Startup Nasional",
      role: "Backend Engineer Intern",
      period: "2022 - 2023",
      description:
        "Membantu pengembangan API menggunakan Laravel dan Filament. Fokus pada manajemen database dan optimasi query.",
      icon: "i-lucide-database",
      logoUrl:
        "https://res.cloudinary.com/demo/image/upload/v1670845334/cld-sample-4.jpg",
    },
  ];

  try {
    await db.insert(workExperience).values(data);
    console.log("✅ Seeding berhasil! Data pengalaman kerja sudah masuk.");
  } catch (error) {
    console.error("❌ Seeding gagal:", error);
  } finally {
    process.exit();
  }
}

main();
