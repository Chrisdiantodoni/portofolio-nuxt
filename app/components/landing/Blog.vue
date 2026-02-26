<script setup lang="ts">
defineProps<{
  page: any;
}>();
</script>

<template>
  <UPageSection
    v-if="page?.articles?.length > 0"
    title="Latest Article"
    description="Some of my recent thoughts"
    :ui="{
      container: 'px-0 !pt-0 sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted',
    }"
  >
    <UBlogPosts orientation="vertical" class="gap-4 lg:gap-y-4">
      <UBlogPost
        v-for="(post, index) in page.articles"
        :key="index"
        orientation="horizontal"
        variant="naked"
        :description="post.description"
        v-bind="post"
        :date="formatDate(post.publishedAt)"
        :to="`/blog/${post.slug}`"
        :ui="{
          root: 'group relative lg:items-start lg:flex ring-0 hover:ring-0',
          body: '!px-0',
          header: 'hidden',
        }"
      >
        <template #footer>
          <UButton
            size="xs"
            variant="link"
            class="px-0 gap-0"
            label="Read Article"
          >
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </template>
          </UButton>
        </template>
      </UBlogPost>
    </UBlogPosts>
  </UPageSection>
</template>
