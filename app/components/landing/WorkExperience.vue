<script setup lang="ts">
import type { IndexCollectionItem } from "@nuxt/content";

defineProps<{
  page: any;
}>();
</script>

<template>
  <UPageSection
    title="Work Experience"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2',
    }"
  >
    <template #description>
      <div class="flex flex-col gap-2">
        <Motion
          v-for="(experience, index) in page.work_experiences"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * Number(index) }"
          :in-view-options="{ once: true }"
          class="text-muted flex items-center text-nowrap gap-2"
        >
          <p class="text-sm">
            {{ experience.period }}
          </p>
          <USeparator />
          <ULink
            class="flex items-center gap-1"
            :to="experience.company.url || '#'"
            target="_blank"
          >
            <span class="text-sm">
              {{ experience?.role || "Role" }}
            </span>
            <div
              class="inline-flex items-center gap-1"
              :style="{ color: experience.company.color || '#fff' }"
            >
              <span class="font-medium">{{ experience.company }}</span>
              <NuxtImg
                v-if="experience.logoUrl"
                :src="experience.logoUrl"
                class="size-5 object-contain"
              />
              <UIcon v-else :name="experience.icon" />
            </div>
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped></style>
