<script setup lang="ts">
import { useNavStore } from "~/stores/nav";
import { storeToRefs } from "pinia";
import type { NavigationMenuItem } from "@nuxt/ui";

const store = useNavStore();

// Gunakan await hanya jika ini di layout/page agar SSR berjalan sempurna
await store.fetchNav();

const { navbar, footer } = storeToRefs(store);

const navLinks = computed<NavigationMenuItem[]>(() => {
  // PENTING: Gunakan navbar.value
  const links = navbar.value?.map((item: any) => ({
    label: item?.label,
    to: item?.link,
  }));

  return links ?? [];
});

const socialLinks = computed(() => {
  // PENTING: Gunakan footer.value
  const social_links = footer.value?.map((item: any) => ({
    icon: item.icon,
    to: item?.url,
    target: "_blank",
    "aria-label": `Social on ${item?.platform}`,
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
