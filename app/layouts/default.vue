<script setup lang="ts">
const { data } = useFetch("/api/landing/nav");
import type { NavigationMenuItem } from "@nuxt/ui";

const navLinks = computed<NavigationMenuItem[]>(() => {
  // Jika data belum ada, kembalikan array kosong
  const links = data?.value?.data?.nav?.map((item) => ({
    label: item?.label,
    to: item?.link,
  }));

  return links ?? [];
});

const socialLinks = computed(() => {
  const social_links = data?.value?.data?.socialLinks?.map((item) => ({
    icon: item.icon,
    to: item?.url,
    target: "_blank",
    "aria-label": `Nuxt UI on ${item?.platform}`,
  }));
  return social_links ?? [];
});
</script>

<template>
  <div>
    <UContainer class="pt-10">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter :footer_links="socialLinks" />
    </UContainer>
  </div>
</template>
