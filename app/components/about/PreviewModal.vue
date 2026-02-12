<script setup lang="ts">
import { marked } from "marked";

const isPreviewOpen = ref(false);
const props = defineProps<{
  state: any;
}>();

// Gunakan gfm (GitHub Flavored Markdown) agar list lebih stabil
const renderMd = (text: string) => (text ? marked(text, { gfm: true }) : "");

const renderedMarkdownHeadline = computed(() => renderMd(props.state.headline));
const renderedMarkdownShortBio = computed(() => renderMd(props.state.shortBio));
const renderedMarkdownLongBio = computed(() => renderMd(props.state.longBio));
const renderedMarkdownAboutPage = computed(() =>
  renderMd(props.state.about_page),
);
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
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold">Preview Profile</h3>
              <p class="text-sm text-gray-500">
                Live preview of your markdown content.
              </p>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              @click="isPreviewOpen = false"
            />
          </div>
        </template>

        <div class="max-w-4xl mx-auto py-10 px-6 overflow-y-auto">
          <div class="mb-10 text-center">
            <h1 class="text-5xl font-extrabold mb-4 text-white">
              {{ props.state.name || "Untitled Profile" }}
            </h1>
            <div
              class="prose prose-invert max-w-none text-xl text-gray-400 prose-p:leading-relaxed"
              v-html="renderedMarkdownHeadline"
            />
          </div>

          <template
            v-for="section in [
              { label: 'Short Bio', content: renderedMarkdownShortBio },
              { label: 'Long Bio', content: renderedMarkdownLongBio },
              {
                label: 'About Page Content',
                content: renderedMarkdownAboutPage,
              },
            ]"
            :key="section.label"
          >
            <USeparator :label="section.label" class="my-10" />
            <MDC :value="section.content" />
            <!-- <div
              class="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-p:leading-7 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-gray-300 prose-li:my-1 prose-strong:text-white"
              v-html="section.content"
            /> -->
          </template>

          <div class="mt-16 flex justify-center">
            <UButton
              color="neutral"
              variant="soft"
              size="lg"
              @click="isPreviewOpen = false"
            >
              Back to Editor
            </UButton>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
