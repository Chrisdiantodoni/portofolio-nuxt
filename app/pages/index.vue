<script setup lang="ts">
const nuxtApp = useNuxtApp();

const { data, status, refresh } = await useFetch("/api/landing/home");
const profile = computed(() => data.value?.profile);
const seo = computed(() => data.value?.seo);

useSeoMeta({
  title: () => seo.value?.title || profile.value?.name || "Portfolio",
  description: () =>
    seo.value?.description ||
    cleanMarkdown(profile.value?.headline) ||
    "Developer Portfolio",
  ogTitle: () => seo.value?.title || profile.value?.name,
  ogImage: () => profile.value?.avatarUrl, // Tambahan standar untuk SEO
});

const homeData = computed(() => data?.value);
</script>

<template>
  <UPage v-if="homeData">
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
