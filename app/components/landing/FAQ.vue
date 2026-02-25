<script setup lang="ts">
const props = defineProps<{
  page: {
    faqs: Array<{
      question: string;
      answer: string;
      category: string;
    }>;
  };
}>();

const items = computed(() => {
  if (!props.page?.faqs) return [];
  const categories = [...new Set(props.page.faqs.map((f) => f.category))];

  return categories.map((cat) => ({
    label: cat,
    key: cat.toLowerCase().replace(/\s+/g, "-"),
    questions: props.page.faqs
      .filter((f) => f.category === cat)
      .map((f) => ({
        label: f.question,
        content: f.answer,
      })),
  }));
});

const ui = {
  root: "flex items-center gap-4 w-full",
  list: "relative flex bg-transparent dark:bg-transparent gap-2 px-0",
  indicator:
    "absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60",
  trigger:
    "px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted",
  label: "truncate",
};
</script>

<template>
  <UPageSection
    title="Frequently Asked Questions"
    description="Answers to common questions about my process and services."
    :ui="{
      container: 'px-0 !pt-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted',
    }"
  >
    <UTabs :items orientation="horizontal" :ui>
      <template #content="{ item }">
        <UAccordion
          trailing-icon="lucide:plus"
          :items="item.questions"
          :unmount-on-hide="false"
          :ui="{
            item: 'border-none',
            trigger:
              'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50 text-base',
            trailingIcon:
              'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135 text-base text-muted',
          }"
        >
          <template #body="{ item: _item }">
            <MDC :value="_item.content" unwrap="p" class="px-4" />
          </template>
        </UAccordion>
      </template>
    </UTabs>
  </UPageSection>
</template>
