<script setup lang="ts">
const props = defineProps<{
  page: {
    testimonials?: {
      authorName: string;
      authorRole: string;
      authorCompany: string | null; // tambah | null
      content: string;
      avatarUrl: string | null; // tambah | null
    }[];
  };
}>();

const testimonialItems = computed(() => {
  const testimonials = props.page?.testimonials?.map((t) => ({
    quote: t.content,
    author: {
      name: t.authorName,
      description: `${t.authorRole}${t.authorCompany ? ` at ${t.authorCompany}` : ""}`,
      avatar: {
        src: t.avatarUrl,
      },
    },
  }));
  return testimonials || [];
});
</script>

<template>
  <UPageSection
    :ui="{
      container: 'px-0 !pt-0',
    }"
  >
    <UCarousel
      v-if="testimonialItems.length > 0"
      v-slot="{ item }"
      :items="testimonialItems"
      :autoplay="{ delay: 4000 }"
      loop
      dots
      :ui="{
        viewport:
          '-mx-4 sm:-mx-12 lg:-mx-16 bg-neutral-50/50 dark:bg-white/5 max-w-full',
      }"
    >
      <UPageCTA
        :description="item.quote"
        variant="naked"
        class="rounded-none w-full"
        :ui="{
          container: 'sm:py-12 lg:py-12 sm:gap-8',
          description: '!text-base text-balance italic font-medium',
        }"
      >
        <UUser
          v-bind="item.author"
          size="xl"
          class="justify-center"
          :avatar="{ src: item.author.avatar.src || undefined }"
        />
      </UPageCTA>
    </UCarousel>

    <div v-else class="py-12 text-center text-muted-foreground text-sm italic">
      No testimonials available at the moment.
    </div>
  </UPageSection>
</template>
