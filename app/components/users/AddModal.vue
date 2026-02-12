<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useUserForm } from "../../composables/form/useUserForm";

const isOpen = defineModel<boolean>("open", { default: false });
const emit = defineEmits(["success"]);
type Schema = z.output<typeof schema>;

const { schema, state, resetForm } = useUserForm();

const toast = useToast();

const props = defineProps(["userData"]);

watch(
  () => props.userData,
  (newVal) => {
    if (newVal) {
      // Isi form dengan data user yang dipilih dari tabel
      state.name = newVal.name;
      state.username = newVal.username;
      state.email = newVal.email;
    }
  },
  { immediate: true },
);
watch(isOpen, (val) => {
  if (!val) {
    resetForm();
  }
});

const { addNewUser, updateUser } = useUser();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    let response;
    if (props.userData) {
      response = await updateUser(props.userData?.id, event.data);
    } else {
      response = await addNewUser(event.data);
    }
    if (response.success) {
      toast.add({
        title: "Success",
        description: props?.userData
          ? `User Updated`
          : `New User ${event.data.name} added`,
        color: "success",
      });
      isOpen.value = false;
      resetForm();
      emit("success");
    } else {
      toast.add({
        title: "Error",
        description: `Add New User Error`,
        color: "error",
      });
    }
  } catch (error) {
    toast.add({
      title: "Error",
      description: `Add New User Error`,
      color: "error",
    });
  }
}
</script>

<template>
  <slot name="trigger">
    <UButton label="New User" icon="i-lucide-plus" @click="isOpen = true" />
  </slot>
  <UModal
    v-model:open="isOpen"
    title="New User"
    description="Add a new user to the database"
  >
    <!-- <UButton label="New User" icon="i-lucide-plus" /> -->

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="e.g, Doni The Great">
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="e.g, DoniTheGreat4431"
          />
        </UFormField>
        <UFormField label="Username" name="e.g, DoniTheGreat4431">
          <UInput
            v-model="state.username"
            class="w-full"
            placeholder="e.g, DoniTheGreat4431"
          />
        </UFormField>
        <UFormField
          label="Email"
          placeholder="john.doe@example.com"
          name="email"
        >
          <UInput
            v-model="state.email"
            class="w-full"
            placeholder="e.g, DoniTheGreat@gmail.com"
          />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :label="props.userData?.id ? 'Update' : 'Create'"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
