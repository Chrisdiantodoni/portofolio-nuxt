<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count?: number;
    selectedTechnologies?: any;
  }>(),
  {
    count: 0,
  },
);
const isOpen = defineModel<boolean>("open", { default: false });
const emit = defineEmits(["success"]);

const open = ref(false);

const { deleteTechnologies } = useTechnologies();
const toast = useToast();

async function onSubmit() {
  try {
    const response = await deleteTechnologies(props.selectedTechnologies?.id);
    if (response?.success) {
      toast.add({
        title: "Tech deleted",
        description: "Tech has been deleted",
        color: "success",
      });
      isOpen.value = false;
      emit("success", response);
    }
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to delete technology",
      color: "error",
    });
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="`Delete ${selectedTechnologies?.name}`"
    :description="`Are you sure, this action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="isOpen = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
