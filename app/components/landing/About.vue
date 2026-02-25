<script setup lang="ts">
import type { IndexCollectionItem } from "@nuxt/content";

defineProps<{
  page: any;
}>();
</script>

<template>
  <UPageSection
    title="About Me"
    :ui="{
      container: '!p-0',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
    }"
  >
    <template #description>
      <div class="text-left mt-3 text-sm sm:text-md lg:text-sm text-muted">
        <MDC :value="page?.profile?.shortBio || ''" />
      </div>
    </template>
  </UPageSection>
</template>

<style scoped></style>
