export const cleanMarkdown = (md: string | undefined | null) => {
  if (!md) return "";

  return (
    md
      // 1. Hapus Headers (#)
      .replace(/^#+\s+/gm, "")
      // 2. Hapus Bold/Italic (** atau __ atau *)
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // 3. Hapus Links ([teks](url)) -> ambil teksnya saja
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      // 4. Hapus Blockquotes (>)
      .replace(/^\s*>\s+/gm, "")
      // 5. Hapus Inline Code (`)
      .replace(/`(.+?)`/g, "$1")
      // 6. Hapus baris kosong atau entitas HTML (&nbsp;, \r, \n)
      .replace(/&nbsp;/g, " ")
      .replace(/\r?\n|\r/g, " ")
      // 7. Bersihkan spasi ganda
      .replace(/\s+/g, " ")
      .trim()
  );
};
