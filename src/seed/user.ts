import "dotenv/config";
import { users } from "../db/schema/schema";
import bcrypt from "bcrypt"; // Import ini
import { db } from "../index";

export const seedUsers = async () => {
  console.log("🌱 Seeding users...");

  // 1. Tentukan password mentah yang mau dipakai
  const plainPassword = "password";

  // 2. Hash password tersebut (Salt rounds 10 adalah standar)
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 3. Masukkan ke database
  await db.insert(users).values({
    name: "admin",
    email: "admin@example.com", // Email login nanti
    password: hashedPassword, // <-- Simpan HASIL HASH-nya, bukan "password123"
    username: "admin",
  });

  console.log("✅ User created!");
  console.log(`Login Email: admin@example.com`);
  console.log(`Login Pass : ${plainPassword}`); // Biar kamu gak lupa pas mau tes login

  process.exit(0);
};

seedUsers().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
