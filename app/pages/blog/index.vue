<script setup lang="ts">
const { data, pending } = await useAsyncData("blog-list", () =>
  $fetch("/api/landing/blog"),
);
const { data: page } = await useAsyncData<any>("blog-page", () => {
  // @ts-ignore atau cast as any
  return queryCollection("pages").path("/blog").first();
});
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
const placeholder =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";

const seo = computed(() => data?.value?.seo);

const posts = computed(() => {
  const list_posts = data?.value?.articles?.map((item) => ({
    title: item?.title,
    description: item?.description,
    image: item?.imageUrl ?? placeholder,
    date: item?.publishedAt,
    path: `/blog/${item?.slug}`,
    to: `/blog/${item?.slug}`,
  }));
  return list_posts || [];
});

useSeoMeta({
  title: seo?.value?.title || page.value?.title,
  ogTitle: seo?.value?.seo?.title || page.value?.title,
  description: seo?.value?.description || page.value?.description,
  ogDescription: seo?.value?.seo?.description || page.value?.description,
  ogImage: seo?.value?.seo?.image || posts.value[0]?.image,
});
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start',
      }"
    />
    <UPageSection
      :ui="{
        container: '!pt-0',
      }"
    >
      <UBlogPosts orientation="vertical">
        <Motion
          v-for="(post, index) in posts"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.2 * index }"
          :in-view-options="{ once: true }"
        >
          <UBlogPost
            variant="naked"
            orientation="horizontal"
            v-bind="post"
            :ui="{
              root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
              image:
                'group-hover/blog-post:scale-105 rounded-lg shadow-lg border-4 border-muted ring-2 ring-default',
              header:
                index % 2 === 0
                  ? 'sm:-rotate-1 overflow-visible'
                  : 'sm:rotate-1 overflow-visible',
            }"
          />
        </Motion>
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
