import "dotenv/config";

import { db } from "../index";
// Pastikan path ke db instance kamu benar
import { articles } from "../db/schema/articles";

async function seed() {
  await db.insert(articles).values([
    {
      title: "Menata Workspace Minimalis di MacBook Air",
      description:
        "Review setup menggunakan Legion laptop, external monitor, dan Tony Tony Chopper figurine untuk produktivitas maksimal.",
      publishedAt: "2026-02-12",
      slug: "workspace-minimalis-macbook-air",
      imageUrl:
        "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=400&auto=format&fit=crop",
    },
    {
      title: "Troubleshooting Flutter iOS Build di Xcode 15",
      description:
        "Menyelesaikan masalah Firebase Core dan CocoaPods yang sering terjadi saat build aplikasi pooling-app-mobile-v2.",
      publishedAt: "2026-01-22",
      slug: "troubleshooting-flutter-ios-xcode",
      imageUrl:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400&auto=format&fit=crop",
    },
  ]);
  console.log("Seed data articles berhasil!");
}

seed();
