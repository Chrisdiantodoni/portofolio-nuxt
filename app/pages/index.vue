<script setup lang="ts">
const nuxtApp = useNuxtApp();

const {
  data: homeData,
  pending,
  error,
} = await useAsyncData("landing-home", () => $fetch("/api/landing/home"), {
  getCachedData: (key) => {
    const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    return cached;
  },
});
const profile = computed(() => homeData.value?.profile);
const seo = computed(() => homeData.value?.seo);

useSeoMeta({
  title: () => seo.value?.title || profile.value?.name || "Portfolio",
  description: () =>
    seo.value?.description ||
    cleanMarkdown(profile.value?.headline) ||
    "Developer Portfolio",
  ogTitle: () => seo.value?.title || profile.value?.name,
  ogImage: () => profile.value?.avatarUrl, // Tambahan standar untuk SEO
});
console.log(pending, "home");
</script>

<template>
  <div v-if="pending" class="flex h-96 items-center justify-center">
    <UIcon
      name="i-heroicons-arrow-path"
      class="animate-spin size-10 text-primary"
    />
  </div>
  <div v-else-if="error || !homeData" class="text-center py-20">
    <p>Gagal memuat data dari Neon.</p>
    <UButton label="Refresh" @click="refreshNuxtData('landing-home')" />
  </div>
  <UPage v-else :key="homeData?.profile?.id">
    <LandingHero :page="homeData" />
    <UPageSection
      :ui="{
        container: '!pt-0 lg:grid lg:grid-cols-2 lg:gap-8',
      }"
    >
      <LandingAbout :page="homeData" />
      <LandingWorkExperience :page="homeData" />
    </UPageSection>
    <LandingBlog :page="homeData" />
    <LandingTestimonials :page="homeData" />
    <LandingFAQ :page="homeData" />
  </UPage>
</template>
