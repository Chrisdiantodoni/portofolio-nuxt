export default defineEventHandler(async (event) => {
  try {
    const { q } = getQuery(event);
    if (!q) return [];

    // Mencari icon dari API resmi Iconify
    const response = await $fetch<{ icons: string[] }>(
      `https://api.iconify.design/search?query=${q}&limit=20`,
    );

    // Kita kembalikan format yang mudah dibaca Nuxt UI (i-nama-icon)
    return response.icons.map((icon) => ({
      label: icon,
      icon: `i-${icon.replace(":", "-")}`,
    }));
  } catch (error) {
    console.log(error);
    return;
  }
});
