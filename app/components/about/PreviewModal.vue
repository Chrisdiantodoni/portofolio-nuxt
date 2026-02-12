<script setup lang="ts">
import { useAboutForm } from "~/composables/form/useAboutForm";

const isPreviewOpen = ref(false);
const props = defineProps<{
  state: any;
}>();
</script>

<template>
  <div class="flex justify-end gap-3 pt-4">
    <slot name="trigger">
      <UButton
        color="info"
        variant="ghost"
        icon="i-lucide-eye"
        @click="isPreviewOpen = true"
      >
        Preview
      </UButton>
    </slot>
    <UButton type="submit"> Save Changes </UButton>
  </div>

  <UModal v-model:open="isPreviewOpen" fullscreen>
    <template #header>
      <div class="flex items-center justify-end">
        <h3 class="font-bold">About Page Preview</h3>
        <UButton
          color="info"
          variant="ghost"
          icon="i-lucide-x"
          @click="isPreviewOpen = false"
        />
      </div>
    </template>
    <template #body>
      <div class="max-w-3xl mx-auto py-10">
        <h1 class="text-4xl font-bold mb-4 text-white">
          {{ props.state.name ?? "TEST" }}
        </h1>
        <div
          class="text-xl text-gray-600 mb-8"
          v-html="props.state.headline"
        ></div>

        <UDivider class="my-8" />

        <article class="prose dark:prose-invert max-w-none">
          <div v-html="state.about_page"></div>
        </article>
      </div>
    </template>
  </UModal>
</template>
