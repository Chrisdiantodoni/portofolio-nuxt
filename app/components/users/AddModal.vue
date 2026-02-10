<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  name: z.string().min(2, "Too short"),
  email: z.string().email("Invalid email"),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  email: "",
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: `New customer ${event.data.name} added`,
    color: "success",
  });
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New User"
    description="Add a new user to the database"
  >
    <UButton label="New User" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Username" name="e.g, DoniTheGreat4431">
          <UInput
            v-model="state.name"
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
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
