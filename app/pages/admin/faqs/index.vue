<script setup lang="ts">
import { useFaqForm } from "~/composables/form/useFaqsForm";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
type Schema = z.output<typeof schema>;
definePageMeta({
  title: "Faqs",
});
const { state, schema, resetForm } = useFaqForm();
const toast = useToast();

const isOpen = ref(false);
const isEditing = ref(false);
const selectedId = ref<number | null>(null);

// Contoh Kategori untuk Dropdown
const categories = ["Services & Process", "Pricing", "Technical", "General"];

// Fetch Data
const { data, refresh } = await useFetch("/api/faqs");

const faqs = computed(() => data?.value?.data || []);

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "question", header: "Question", class: "w-[40%]" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "actions", header: "Actions" },
];

const openCreate = () => {
  isEditing.value = false;
  resetForm();
  isOpen.value = true;
};

const openEdit = (row: any) => {
  isEditing.value = true;
  selectedId.value = row.id;
  state.question = row.question;
  state.answer = row.answer;
  state.category = row.category;
  isOpen.value = true;
};

const { addNewFaq, updateFaq } = useFaq();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    if (isEditing.value) {
      await updateFaq(Number(selectedId.value), event.data);
    } else {
      await addNewFaq(event.data);
    }
    toast.add({ title: "Success!", color: "success" });
    isOpen.value = false;
    refresh();
  } catch (e) {
    toast.add({ title: "Error saving data", color: "error" });
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Manage FAQs</h1>
        <p class="text-sm text-gray-500">
          Atur pertanyaan yang sering diajukan oleh user.
        </p>
      </div>
      <UButton icon="i-lucide-plus" label="Add FAQ" @click="openCreate" />
    </div>

    <UCard>
      <UTable :data="faqs || []" :columns="columns">
        <template #category-cell="{ row }">
          <UBadge variant="subtle" color="primary">{{
            row.original.category
          }}</UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              @click="openEdit(row.original)"
            />
            <UButton icon="i-lucide-trash" variant="ghost" color="error" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="isOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              {{ isEditing ? "Edit FAQ" : "Create FAQ" }}
            </h3>
          </template>

          <UForm
            :schema="schema"
            :state="state"
            @submit="onSubmit"
            class="space-y-4"
          >
            <UFormField label="Category" name="category">
              <USelect
                v-model="state.category"
                :items="categories"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Question" name="question">
              <UInput
                v-model="state.question"
                placeholder="How to..."
                class="w-full"
              />
            </UFormField>

            <UFormField label="Answer" name="answer">
              <UTextarea
                v-model="state.answer"
                :rows="5"
                placeholder="The answer is..."
                class="w-full"
              />
            </UFormField>

            <div class="flex justify-end gap-3 pt-4">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="isOpen = false"
              />
              <UButton type="submit" label="Save FAQ" />
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
