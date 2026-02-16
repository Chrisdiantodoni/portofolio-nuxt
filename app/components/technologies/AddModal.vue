<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { refDebounced } from "@vueuse/core";
import { useTechnologiesForm } from "../../composables/form/useTechnologiesForm";

const isOpen = defineModel<boolean>("open", { default: false });
const emit = defineEmits(["success"]);
type Schema = z.output<typeof schema>;

const { schema, state, resetForm } = useTechnologiesForm();

const searchTerm = ref("");
const searchTermDebounced = refDebounced(searchTerm, 200);

const props = defineProps<{
  technologyData?: {
    id: number;
    name?: string;
    icon?: string;
    description?: string;
  } | null;
}>();

const toast = useToast();

// Watch untuk populate form saat edit
watch(
  () => props.technologyData,
  (data) => {
    if (data) {
      state.name = data.name || "";
      state.icon = data.icon || "";
      state.description = data.description || "";
    }
  },
  { immediate: true },
);
watch(isOpen, (val) => {
  if (!val) {
    resetForm();
  }
});
const { data: iconsData, status } = await useFetch("/api/icons/search", {
  params: {
    q: searchTermDebounced,
  },
  lazy: true,
  watch: [searchTermDebounced],
});

// Transform data menjadi format yang sesuai untuk USelectMenu
const icons = computed(() => {
  if (!iconsData.value) return [];

  // Jika API mengembalikan array of strings: ['vue', 'react', 'nuxt']
  // Transform menjadi array of objects dengan label dan value
  return iconsData.value?.map((item) => ({
    label: item?.label,
    value: item?.icon,
    icon: item?.icon,
  }));
});

const { addNewTechnologies, updateTechnologies } = useTechnologies();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    let response;

    if (props.technologyData?.id) {
      // Update existing technology
      response = await updateTechnologies(props.technologyData?.id, event.data);

      toast.add({
        title: "Success",
        description: "Technology updated successfully",
        color: "success",
      });
    } else {
      // Create new technology
      response = await addNewTechnologies(event.data);

      toast.add({
        title: "Success",
        description: "Technology created successfully",
        color: "success",
      });
    }

    emit("success", response);
    isOpen.value = false;
    resetForm();
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: props.technologyData?.id
        ? "Failed to update technology"
        : "Failed to create technology",
      color: "error",
    });
  }
}
</script>

<template>
  <slot name="trigger">
    <UButton
      label="New Technologies"
      icon="i-lucide-plus"
      @click="isOpen = true"
    />
  </slot>

  <UModal
    v-model:open="isOpen"
    :title="props.technologyData?.id ? 'Edit Technology' : 'New Technology'"
    :description="
      props.technologyData?.id
        ? 'Update technology information'
        : 'Add a new technology to the database'
    "
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="e.g, Nuxt.js, Vue.js, React.js"
          />
        </UFormField>

        <UFormField label="Icon" name="icon">
          <USelectMenu
            v-model="state.icon"
            v-model:search-term="searchTerm"
            :items="icons as any[]"
            :loading="status === 'pending'"
            placeholder="Select Icon"
            class="w-full"
            value-attribute="value"
            option-attribute="label"
            ignore-filter
            @update:model-value="searchTerm = ''"
          >
            <template #leading>
              <UIcon
                v-if="state.icon"
                :name="state.icon"
                class="size-5 text-primary"
              />
              <UIcon v-else name="i-lucide-search" class="size-5 text-muted" />
            </template>

            <template #item="{ item }">
              <UIcon :name="item.value" class="size-5" />
              <span class="truncate">{{ item.label }}</span>
            </template>
          </USelectMenu>
        </UFormField>
        <UFormField label="Description" name="deskripsi">
          <UTextarea
            v-model="state.description"
            class="w-full"
            placeholder="e.g, Nuxt.js, Vue.js, React.js"
          />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="isOpen = false"
          />
          <UButton
            :label="props.technologyData?.id ? 'Update' : 'Create'"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
