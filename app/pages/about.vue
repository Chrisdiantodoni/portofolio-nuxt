<script setup lang="ts">
const { data: page } = await useAsyncData<any>("about", () => {
  // @ts-ignore atau cast as any
  return queryCollection("about").first();
});

const { data, pending } = await useAsyncData("about-page", () =>
  $fetch("/api/landing/about"),
);

const seo = computed(() => data?.value?.seo);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: seo?.value?.title || page.value?.title,
  ogTitle: seo?.value?.seo?.title || page.value?.title,
  description: seo?.value?.description || page.value?.description,
  ogDescription: seo?.value?.seo?.description || page.value?.description,
  ogImage: seo?.value?.seo?.image,
});

const placeholder =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";

const about = computed(() => {
  const profile = {
    description: data?.value?.about?.longBio,
    content: data?.value?.about?.about_page ?? "",
    image: {
      src: data?.value?.about?.aboutImgUrl ?? "",
      alt: data?.value?.about?.name,
    },
    images: data?.value?.projects
      ?.map((item) => ({
        src: item?.imageUrl ?? "",
        alt: item?.title,
      }))
      .filter((filter) => filter?.src != null),
  };
  return profile;
});

console.log({ about });
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="about.description"
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start',
      }"
    >
      <UColorModeAvatar
        class="sm:rotate-4 size-36 rounded-lg ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
        :light="about.image.src"
        :dark="about.image.src"
        :alt="about.image.alt"
      />
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0',
      }"
    >
      <MDC :value="about.content" unwrap="p" />
      <div
        class="flex flex-row justify-center items-center py-10 space-x-[-2rem]"
      >
        <PolaroidItem
          v-for="(image, index) in about.images"
          :key="index"
          :image="image"
          :index="Number(index)"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
