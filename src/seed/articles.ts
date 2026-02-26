import { db } from "../index";
import { articles } from "../db/schema/articles";

export const seedArticles = async () => {
  console.log("Seed started...");

  const data = [
    {
      title: "Membangun Home Server dengan Cloudflare Tunnel",
      slug: "membangun-home-server-cloudflare",
      description:
        "Cara praktis membuat server lokal bisa diakses publik tanpa buka port router.",
      publishedAt: new Date().toISOString(),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
      body: `
# Membangun Home Server

Selamat datang di panduan membangun home server! Menggunakan **Cloudflare Tunnel** adalah cara paling aman karena:

1. **Tanpa Port Forwarding**: Kamu tidak perlu utak-atik router IndiHome.
2. **Support CGNAT**: Tetap jalan meski IP publik kamu berubah-ubah.
3. **Gratis SSL**: Otomatis dapat HTTPS dari Cloudflare.

### Persiapan
* PC/Laptop bekas atau Raspberry Pi.
* Domain yang sudah terhubung ke Cloudflare.
* Koneksi internet stabil.

\`\`\`bash
# Jalankan perintah ini untuk install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
\`\`\`

> "Home server adalah langkah awal menuju kedaulatan data pribadi."
      `.trim(),
    },
    {
      title: "Optimasi Nuxt 3 dengan Drizzle ORM",
      slug: "optimasi-nuxt3-drizzle",
      description: "Meningkatkan performa query database pada aplikasi Nuxt 3.",
      publishedAt: new Date().toISOString(),
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      body: `
# Nuxt 3 + Drizzle

Drizzle ORM sangat ringan dan memberikan pengalaman *type-safety* yang luar biasa.

### Keunggulan
- **TypeScript First**: Tidak perlu generate types manual.
- **SQL-like**: Syntax yang sangat familiar bagi pengguna SQL.
- **Lightweight**: Ukuran bundle sangat kecil.

Contoh query sederhana:
| Method | Fungsi |
| :--- | :--- |
| \`findFirst\` | Mengambil satu data |
| \`findMany\` | Mengambil banyak data |

Semoga bermanfaat!
      `.trim(),
    },
  ];

  try {
    // Gunakan delete untuk membersihkan data lama jika perlu
    // await db.delete(articles);

    await db.insert(articles).values(data);
    console.log("Seed finished successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
  }
};
