<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { mapContentNavigation } from "@nuxt/ui/utils/content";
import { findPageBreadcrumb } from "@nuxt/content/utils";

const route = useRoute();

// Ambil slug artikel dari path, misal: /blog/judul-artikel -> judul-artikel
const slug = route.params.slug || route.path.split("/").pop();

const { data: page } = await useAsyncData(route.path, () =>
  $fetch(`/api/landing/${slug}/blog`),
);

if (!page.value)
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
// const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
//   queryCollectionItemSurroundings("blog", route.path, {
//     fields: ["description"],
//   }),
// );

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation", ref([]));
const blogNavigation = computed(
  () => navigation.value.find((item) => item.path === "/blog")?.children || [],
);

const breadcrumb = computed(() =>
  mapContentNavigation(
    findPageBreadcrumb(blogNavigation?.value, page.value?.path),
  ).map(({ icon, ...link }) => link),
);

if (page.value.image) {
  defineOgImage({ url: page.value.image });
} else {
  defineOgImageComponent(
    "Blog",
    {
      headline: breadcrumb.value.map((item) => item.label).join(" > "),
    },
    {
      fonts: ["Geist:400", "Geist:600"],
    },
  );
}

const title = page.value?.seo?.title || page.value?.title;
const description = page.value?.seo?.description || page.value?.description;

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title,
});

const articleLink = computed(() => `${window?.location}`);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const blogResult = page?.value;

const blog = computed(() => {
  const profile = {
    date: blogResult.publishedAt,
    description: blogResult.description,
    title: blogResult.title,
    image: blogResult.imageUrl,
    body: blogResult.body,
  };
  return profile;
});
</script>

<template>
  <UContainer class="py-10 max-w-6xl">
    <UPage v-if="blog">
      <ULink to="/blog" class="text-sm flex items-center gap-1">
        <UIcon name="lucide:chevron-left" />
        Blog
      </ULink>
      <div class="flex flex-col gap-3 mt-8">
        <div class="flex text-xs text-muted items-center justify-center gap-2">
          <span v-if="blog.date">
            {{ formatDate(blog.date) }}
          </span>
          <!-- <span v-if="page.date && page.minRead"> - </span> -->
          <!-- <span v-if="page.minRead"> {{ page.minRead }} MIN READ </span> -->
        </div>
        <NuxtImg
          :src="blog.image"
          :alt="blog.title"
          class="rounded-lg w-full h-[300px] object-cover object-center"
        />
        <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
          {{ blog.title }}
        </h1>
        <p class="text-muted text-center max-w-2xl mx-auto">
          {{ blog.description }}
        </p>
        <!-- <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              v-bind="blog.author"
            />
          </div> -->
      </div>
      <UPageBody class="max-w-3xl mx-auto">
        <MDC v-if="page.body" :value="page?.body || ''" />

        <div class="flex items-center justify-end gap-2 text-sm text-muted">
          <UButton
            size="sm"
            variant="link"
            color="neutral"
            label="Copy link"
            @click="
              copyToClipboard(articleLink, 'Article link copied to clipboard')
            "
          />
        </div>
        <UContentSurround :surround="page.surround" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
