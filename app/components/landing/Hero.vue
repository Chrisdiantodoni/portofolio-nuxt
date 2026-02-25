<script setup lang="ts">
import type { IndexCollectionItem } from "@nuxt/content";

const { global } = useAppConfig();

const props = defineProps<{
  page: any;
}>();
const { footer: socialLinks } = useNavStore();

const footer = computed(() => {
  // PENTING: Gunakan footer.value
  const social_links = socialLinks?.map((item: any) => ({
    icon: item.icon,
    to: item?.url,
    target: "_blank",
    "aria-label": `Social on ${item?.platform}`,
  }));
  return social_links ?? [];
});

const images = computed(() => {
  // 1. Ambil data projects
  // 2. Filter hanya yang memiliki image_url (tidak null/undefined/kosong)
  // 3. Map ke format yang dibutuhkan NuxtImg
  const project_images = props.page.projects
    ?.filter((item: any) => item?.image_url) // Hanya ambil yang ada gambarnya
    ?.map((item: any) => ({
      src: item?.image_url,
      alt: item?.project_name || "Project Image",
    }));

  return project_images || [];
});

console.log(props.page);
</script>

<template>
  <UPageHero
    v-if="props.page.profile"
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center',
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1,
        }"
      >
        <UColorModeAvatar
          class="size-28 ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
          :light="props.page?.profile?.avatarUrl || ''"
          :dark="props.page?.profile?.avatarUrl || ''"
          :alt="global.picture?.alt!"
        />
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1,
        }"
      >
        {{ props.page?.profile?.name || "" }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3,
        }"
      >
        <MDC :value="props?.page?.profile?.headline || ''" />

        <!-- {{ page.description }} -->
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5,
        }"
      >
        <!-- <UButton
          label="Download CV"
          color="neutral"
          :to="props.page.profile.cvUrl"
          target="_blank"
        /> -->

        <UButton
          label="Download CV"
          color="neutral"
          icon="i-heroicons-arrow-down-tray"
          trailing
          :to="props.page.profile.cvUrl"
          target="_blank"
        />
        <UButton
          :color="global.available ? 'success' : 'error'"
          variant="ghost"
          class="gap-2"
          :to="global.available ? global.meetingLink : ''"
          :label="
            global.available
              ? 'Available for new projects'
              : 'Not available at the moment'
          "
        >
          <template #leading>
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75"
                :class="
                  global.available ? 'bg-success animate-ping' : 'bg-error'
                "
              />
              <span
                class="relative inline-flex size-2 scale-90 rounded-full"
                :class="global.available ? 'bg-success' : 'bg-error'"
              />
            </span>
          </template>
        </UButton>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer"
          :key="index"
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)',
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1,
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>
    </template>

    <UMarquee
      pause-on-hover
      class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
    >
      <Motion
        v-for="(img, index) in images"
        :key="index"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: Number(index) * 0.1,
        }"
      >
        <NuxtImg
          width="234"
          height="234"
          class="rounded-lg aspect-square object-cover"
          :class="Number(index) % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          v-bind="img"
        />
      </Motion>
    </UMarquee>
  </UPageHero>
</template>
