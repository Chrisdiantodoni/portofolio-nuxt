<script setup lang="ts">
const route = useRoute();

const {
  data: project,
  pending,
  error,
} = await useFetch(`/api/landing/${route.params.slug}/project`, {
  key: `project-detail-${route.params.slug}`,
});

if (error.value || !project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project tidak ditemukan",
    fatal: true,
  });
}

// SEO Meta
useSeoMeta({
  title: () => `${project.value?.title} | Portfolio`,
  description: () => project.value?.description,
});

const techStack = computed(() => {
  return project.value?.technologies?.map((t: any) => t.technology) || [];
});

const projectTypeLabel = computed(() => {
  const map: Record<string, string> = {
    web: "Web App",
    mobile: "Mobile App",
    desktop: "Desktop App",
    game: "Game",
  };
  return map[project.value?.type ?? "web"] ?? project.value?.type;
});

console.log(project);
</script>

<template>
  <UContainer class="py-20 max-w-6xl">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary"
      />
    </div>

    <div v-else-if="project" class="space-y-12">
      <!-- Header -->
      <header class="space-y-4">
        <div class="flex items-center gap-2 text-sm">
          <UBadge variant="subtle" size="md">
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
              class="w-3.5 h-3.5 mr-1"
            />
            {{ projectTypeLabel }}
          </UBadge>

          <span class="text-gray-400">•</span>
          <span class="text-gray-500 dark:text-gray-400 font-medium">
            {{ project.year }}
          </span>

          <span class="text-gray-400">•</span>
          <UBadge
            :color="project.isActive ? 'success' : 'error'"
            variant="soft"
            size="sm"
          >
            <span
              class="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
              :class="project.isActive ? 'bg-green-500' : 'bg-red-500'"
            />
            {{ project.isActive ? "Active" : "Inactive" }}
          </UBadge>
        </div>

        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div class="max-w-2xl">
            <h1
              class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {{ project.title }}
            </h1>
            <p
              class="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              {{ project.description }}
            </p>
          </div>

          <div class="flex gap-3 shrink-0">
            <UButton
              v-if="project.projectLink"
              :to="project.projectLink"
              target="_blank"
              icon="i-heroicons-arrow-top-right-on-square"
              size="xl"
              label="Live Demo"
            />
            <UButton
              v-if="project.githubLink"
              :to="project.githubLink"
              target="_blank"
              icon="i-simple-icons-github"
              color="neutral"
              variant="ghost"
              size="xl"
              label="GitHub"
            />
            <UTooltip
              v-if="!project.projectLink && !project.githubLink"
              text="No links available"
            >
              <UButton
                icon="i-heroicons-link-slash"
                color="neutral"
                variant="soft"
                size="xl"
                disabled
                label="No Links"
              />
            </UTooltip>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="grid lg:grid-cols-3 gap-10">
        <!-- Left: Image + Overview -->
        <div class="lg:col-span-2 space-y-10">
          <!-- Project Image -->
          <div
            class="relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-900"
          >
            <NuxtImg
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.title"
              class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              v-else
              class="w-full h-64 flex flex-col items-center justify-center text-gray-400 gap-3"
            >
              <UIcon name="i-heroicons-photo" class="w-12 h-12" />
              <span class="text-sm">No image available</span>
            </div>
          </div>

          <!-- Project Overview -->
          <div class="prose dark:prose-invert max-w-none">
            <h3 class="text-2xl font-bold">Project Overview</h3>
            <p>
              <strong>{{ project.title }}</strong> adalah proyek
              {{ projectTypeLabel?.toLowerCase() }} yang dirilis pada tahun
              {{ project.year }}. {{ project.description }}
            </p>
            <p v-if="techStack.length > 0">
              Proyek ini dibangun menggunakan
              {{ techStack.map((t: any) => t.name).join(", ") }} untuk
              memastikan kualitas dan performa terbaik.
            </p>
          </div>
        </div>

        <!-- Right: Sidebar -->
        <aside class="space-y-6">
          <!-- Project Info Card -->
          <UCard>
            <template #header>
              <h4
                class="font-bold text-xs uppercase tracking-widest text-gray-400"
              >
                Project Info
              </h4>
            </template>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Status</span>
                <UBadge
                  :color="project.isActive ? 'success' : 'error'"
                  variant="soft"
                  size="xs"
                >
                  {{ project.isActive ? "Active" : "Inactive" }}
                </UBadge>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-500">Type</span>
                <UBadge variant="subtle" size="xs">
                  {{ projectTypeLabel }}
                </UBadge>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-500">Year</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ project.year }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-500">Views</span>
                <div class="flex items-center gap-1.5">
                  <UIcon
                    name="i-heroicons-eye"
                    class="w-3.5 h-3.5 text-gray-400"
                  />
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ project.viewCount }}
                  </span>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Links Card -->
          <UCard v-if="project.projectLink || project.githubLink">
            <template #header>
              <h4
                class="font-bold text-xs uppercase tracking-widest text-gray-400"
              >
                Links
              </h4>
            </template>

            <div class="space-y-2">
              <UButton
                v-if="project.projectLink"
                :to="project.projectLink"
                target="_blank"
                icon="i-heroicons-arrow-top-right-on-square"
                variant="soft"
                block
                size="sm"
                label="Live Demo"
                class="justify-start"
              />
              <UButton
                v-if="project.githubLink"
                :to="project.githubLink"
                target="_blank"
                icon="i-simple-icons-github"
                color="neutral"
                variant="ghost"
                block
                size="sm"
                label="View on GitHub"
                class="justify-start"
              />
            </div>
          </UCard>

          <!-- Tech Stack Card -->
          <UCard>
            <template #header>
              <h4
                class="font-bold text-xs uppercase tracking-widest text-gray-400"
              >
                Tech Stack
              </h4>
            </template>

            <div v-if="techStack.length > 0" class="flex flex-wrap gap-2">
              <UTooltip
                v-for="tech in techStack"
                :key="tech.id"
                :text="tech.description || tech.name"
              >
                <div
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium transition-all hover:border-primary hover:bg-primary/5 cursor-default"
                >
                  <UIcon
                    :name="tech.icon || 'i-heroicons-cpu-chip'"
                    class="w-3.5 h-3.5 text-primary shrink-0"
                  />
                  {{ tech.name }}
                </div>
              </UTooltip>
            </div>

            <p v-else class="text-sm text-gray-400 italic">
              No technologies listed.
            </p>
          </UCard>
        </aside>
      </div>
    </div>
  </UContainer>
</template>
