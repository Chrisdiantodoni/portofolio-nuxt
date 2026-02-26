<script setup lang="ts">
const { data: page } = await useAsyncData<any>("projects-page", () => {
  // @ts-ignore atau cast as any
  return queryCollection("pages").path("/projects").first();
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
const { data, pending, error } = await useAsyncData("landing-project", () =>
  $fetch("/api/landing/project"),
);
const categories = [
  { label: "All Projects", key: "all", icon: "i-heroicons-squares-2x2" },
  { label: "Web", key: "web", icon: "i-heroicons-globe-alt" },
  { label: "Mobile", key: "mobile", icon: "i-heroicons-device-phone-mobile" },
  { label: "Desktop", key: "desktop", icon: "i-heroicons-computer-desktop" },
];

const selectedCategory = ref(0); // Index tab yang aktif

const projects = computed(() => {
  return (
    data?.value?.projects?.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.year,
      imageUrl: item.imageUrl || placeholder,
      slug: item.slug,
      url: `/projects/${item.slug}`,
      projectLink: item.projectLink,
      type: item.type,
      githubLink: item.githubLink,
      // Mengambil data teknologi dari relasi nested
      techs: item.technologies?.map((pt: any) => pt.technology) || [],
    })) || []
  );
});
const { global } = useAppConfig();

const seo = computed(() => data?.value?.seo);

useSeoMeta({
  title: () =>
    page.value?.seo?.title ||
    page.value?.title ||
    projects.value?.[0]?.title ||
    "Projects",
  ogTitle: () =>
    page.value?.seo?.title ||
    page.value?.title ||
    projects.value?.[0]?.title ||
    "Projects",

  // Pastikan deskripsi tidak undefined
  description: () =>
    page.value?.seo?.description ||
    page.value?.description ||
    projects.value?.[0]?.description ||
    "",
  ogDescription: () =>
    page.value?.seo?.description ||
    page.value?.description ||
    projects.value?.[0]?.description ||
    "",
  ogImage: seo?.value?.seo?.image,
});
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start',
      }"
    >
      <template #links>
        <div v-if="page.links" class="flex items-center justify-start gap-3">
          <UButton
            v-if="page.links[0]"
            v-bind="page.links[0]"
            :to="global.meetingLink"
            size="lg"
          />
          <UButton
            v-if="page.links[1]"
            v-bind="page.links[1]"
            :to="`mailto:${global.email}`"
            variant="ghost"
            color="gray"
            size="lg"
          />
        </div>
      </template>
    </UPageHero>

    <UPageSection :ui="{ container: '!pt-0' }">
      <div v-if="pending" class="space-y-12">
        <USkeleton v-for="i in 3" :key="i" class="h-64 w-full rounded-2xl" />
      </div>

      <div v-else class="space-y-16">
        <Motion
          v-for="(project, index) in projects"
          :key="project.id"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
        >
          <UPageCard
            orientation="horizontal"
            variant="naked"
            :reverse="index % 2 === 1"
            :to="project.url"
            class="group overflow-hidden transition-all duration-300"
            :ui="{
              wrapper: 'max-sm:order-last p-4 sm:p-6',
              body: 'flex-1',
            }"
          >
            <template #leading>
              <div class="flex items-center gap-3 mb-2">
                <span class="text-sm font-mono text-primary font-bold">
                  {{ project.date }}
                </span>

                <span class="w-1 h-1 rounded-full bg-gray-500" />

                <UBadge
                  size="sm"
                  variant="subtle"
                  color="neutral"
                  class="capitalize"
                >
                  <template #leading>
                    <UIcon
                      :name="
                        project.type === 'web'
                          ? 'i-heroicons-globe-alt'
                          : project.type === 'mobile'
                            ? 'i-heroicons-device-phone-mobile'
                            : project.type === 'desktop'
                              ? 'i-heroicons-computer-desktop'
                              : 'i-heroicons-puzzle-piece'
                      "
                      class="w-3 h-3"
                    />
                  </template>
                  {{ project.type }}
                </UBadge>
              </div>
            </template>

            <template #title>
              <h2
                class="text-2xl font-bold group-hover:text-primary transition-colors"
              >
                {{ project.title }}
              </h2>
            </template>

            <template #description>
              <p class="text-muted-foreground line-clamp-3 mb-4">
                {{ project.description }}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                <UBadge
                  v-for="tech in project.techs"
                  :key="tech.id"
                  class="rounded-lg px-3 py-1 text-xs font-medium transition-all /* Light Mode */ bg-gray-100/80 text-gray-700 border border-gray-200 backdrop-blur-md hover:bg-gray-200 /* Dark Mode */ dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20"
                >
                  <UIcon
                    v-if="tech.icon"
                    :name="tech.icon"
                    class="mr-1.5 w-3.5 h-3.5 flex-shrink-0"
                  />
                  {{ tech.name }}
                </UBadge>
              </div>
            </template>

            <template #footer>
              <div class="flex items-center gap-6 relative z-10 pt-4">
                <UButton
                  label="View Case Study"
                  :to="project.url"
                  color="neutral"
                  class="rounded-full px-7 py-3 transition-all duration-300 hover:ring-2 hover:ring-primary group/btn overflow-hidden"
                >
                  <template #trailing>
                    <UIcon
                      name="i-heroicons-arrow-right"
                      class="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                  </template>
                </UButton>

                <UTooltip text="Source Code">
                  <UButton
                    v-if="project.githubLink"
                    icon="i-simple-icons-github"
                    color="neutral"
                    variant="ghost"
                    size="xl"
                    :to="project.githubLink"
                    target="_blank"
                    @click.stop
                    class="hover:text-primary transition-colors"
                  />
                </UTooltip>
              </div>
            </template>
            <div
              class="relative overflow-hidden rounded-xl border border-white/5 aspect-video sm:aspect-auto sm:h-full"
            >
              <img
                :src="project.imageUrl"
                :alt="project.title"
                class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                @error="(e: any) => (e.target.src = placeholder)"
              />
              <div
                class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"
              />
            </div>
          </UPageCard>
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
