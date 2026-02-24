<script setup lang="ts">
import { format } from "date-fns";
import type { Mail } from "~/types";
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
  mail: Mail;
}>();

const emits = defineEmits(["close"]);

const toast = useToast();
const reply = ref("");
const loading = ref(false);
const loadingDraft = ref(false);
const lastSavedAt = ref<Date | null>(null);
const draftId = ref<string | number | null>(null); // Menyimpan ID draf agar tidak duplikat

const { moveToDraftWithId, moveToDraft, sentMail } = useMail();
async function saveToDatabase(isDraft: boolean = true) {
  if (!reply.value.trim()) return;

  try {
    isDraft ? (loadingDraft.value = true) : (loading.value = true);

    // Siapkan data yang akan dikirim
    const payload = {
      body: reply.value,
      subject: `Re: ${props.mail.subject}`,
      to: props.mail.senderEmail, // Tujuan balasan
      // Tambahkan field lain yang dibutuhkan schema kamu
    };

    let res;
    if (isDraft) {
      // Di dalam saveToDatabase
      res = await (draftId.value
        ? moveToDraftWithId(Number(draftId.value), payload)
        : moveToDraft(payload));
      // res sekarang berisi hasil dari API
    } else {
      // Jika kirim email beneran
      res = await sentMail(payload);
    }

    lastSavedAt.value = new Date();

    // Simpan ID draf yang baru dibuat agar auto-save berikutnya melakukan UPDATE, bukan INSERT lagi
    if (isDraft && res?.id) {
      draftId.value = res.id;
    }

    if (!isDraft) {
      toast.add({
        title: "Email sent",
        description: "Your email has been sent successfully",
        icon: "i-lucide-check-circle",
        color: "success",
      });
      reply.value = "";
      draftId.value = null; // Reset draftId setelah terkirim
      emits("close"); // Tutup panel setelah kirim
    }
  } catch (e: any) {
    console.error("Save error:", e);
    toast.add({
      title: "Error",
      description: e.statusMessage || "Failed to save",
      color: "error",
    });
  } finally {
    loadingDraft.value = false;
    loading.value = false;
  }
}

// Auto-save menggunakan debounce
const debouncedSave = useDebounceFn(() => {
  saveToDatabase(true);
}, 3000);

// Pantau perubahan input
watch(reply, (newValue) => {
  if (newValue.trim()) {
    debouncedSave();
  }
});

function onSubmit() {
  saveToDatabase(false);
}
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="mail.subject" :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>
      <template #right> </template>
    </UDashboardNavbar>

    <div class="p-4 sm:p-6 overflow-y-auto max-h-[40vh]">
      <p class="whitespace-pre-wrap">{{ mail.body }}</p>
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard
        variant="subtle"
        class="mt-auto"
        :ui="{
          header: 'flex items-center justify-between gap-1.5 text-dimmed',
        }"
      >
        <template #header>
          <div class="flex items-center gap-1.5">
            <UIcon name="i-lucide-reply" class="size-5" />
            <span class="text-sm truncate">Reply to {{ mail.senderName }}</span>
          </div>

          <span v-if="lastSavedAt" class="text-[10px] italic">
            {{
              loadingDraft
                ? "Saving..."
                : `Draft saved at ${format(lastSavedAt, "HH:mm:ss")}`
            }}
          </span>
        </template>

        <form @submit.prevent="onSubmit">
          <UTextarea
            v-model="reply"
            color="neutral"
            variant="none"
            autoresize
            placeholder="Write your reply..."
            :rows="4"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'p-0 resize-none' }"
          />

          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-2">
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                label="Save draft"
                :loading="loadingDraft"
                :disabled="!reply || loading"
                @click="saveToDatabase(true)"
              />
              <UButton
                type="submit"
                color="neutral"
                :loading="loading"
                :disabled="!reply"
                label="Send"
                icon="i-lucide-send"
              />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
