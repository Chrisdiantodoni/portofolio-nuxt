export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w-]+/g, "") // Hapus karakter non-word (kecuali -)
    .replace(/--+/g, "-") // Ganti double dash jadi single dash
    .replace(/^-+/, "") // Hapus dash di awal
    .replace(/-+$/, ""); // Hapus dash di akhir
};
