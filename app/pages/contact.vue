<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  senderName: z.string().min(2, "Name must be at least 2 characters"),
  senderEmail: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  senderName: undefined,
  senderEmail: undefined,
  subject: undefined,
  body: undefined,
});

const loading = ref(false);
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await $fetch("/api/mails", {
      method: "POST",
      body: event.data,
    });
    toast.add({
      title: "Message sent!",
      description: "I'll get back to you as soon as possible.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    Object.keys(state).forEach((key) => {
      state[key as keyof Schema] = undefined;
    });
  } catch {
    toast.add({
      title: "Failed to send",
      description: "Something went wrong. Please try again.",
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UPage>
    <UPageHero
      title="Let's Work Together"
      description="Have a project in mind or just want to say hello? I'm always open to new opportunities and collaborations."
      :ui="{
        title: 'text-left !mx-0',
        description: 'text-left !mx-0',
      }"
    />

    <UPageSection :ui="{ container: '!pt-8 pb-24' }">
      <div class="grid lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-4 space-y-6">
          <UCard>
            <h3
              class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6"
            >
              Contact Info
            </h3>

            <div class="space-y-5">
              <div class="flex items-center gap-4 group">
                <div
                  class="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0"
                >
                  <UIcon name="i-heroicons-envelope" class="w-5 h-5 block" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-muted">Email</span>
                  <a
                    href="mailto:contact@domain.com"
                    class="text-sm font-medium hover:text-primary transition-colors"
                    >contact@domain.com</a
                  >
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div
                  class="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0"
                >
                  <UIcon name="i-heroicons-map-pin" class="w-5 h-5 block" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-muted">Location</span>
                  <span class="text-sm font-medium">Jakarta, Indonesia</span>
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-5">
              <UButton
                icon="i-simple-icons-github"
                color="info"
                variant="ghost"
                to="#"
                target="_blank"
              />
              <UButton
                icon="i-simple-icons-linkedin"
                color="info"
                variant="ghost"
                to="#"
                target="_blank"
              />
              <UButton
                icon="i-simple-icons-x"
                color="info"
                variant="ghost"
                to="#"
                target="_blank"
              />
            </div>
          </UCard>

          <div
            class="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex gap-4 items-center"
          >
            <UIcon
              name="i-heroicons-bolt"
              class="w-6 h-6 text-primary flex-shrink-0"
            />
            <p class="text-sm font-medium text-primary/90">
              Typical response time:
              <span class="font-bold text-primary">24h</span>
            </p>
          </div>
        </div>

        <div class="lg:col-span-8">
          <UForm :schema="schema" :state="state" @submit="onSubmit">
            <UCard>
              <div class="grid sm:grid-cols-2 gap-6 mb-6">
                <UFormField label="Full Name" name="senderName">
                  <UInput
                    v-model="state.senderName"
                    icon="i-heroicons-user"
                    placeholder="John Doe"
                    size="lg"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Email Address" name="senderEmail">
                  <UInput
                    v-model="state.senderEmail"
                    icon="i-heroicons-envelope"
                    type="email"
                    placeholder="john@example.com"
                    size="lg"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Subject" name="subject" class="mb-6">
                <UInput
                  v-model="state.subject"
                  icon="i-heroicons-tag"
                  placeholder="Project Inquiry"
                  class="w-full"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Message" name="body" class="mb-8">
                <UTextarea
                  v-model="state.body"
                  class="w-full"
                  :rows="6"
                  placeholder="How can I help you?"
                  size="lg"
                />
              </UFormField>

              <div class="flex justify-end">
                <UButton
                  type="submit"
                  :loading="loading"
                  size="xl"
                  class="px-8 rounded-xl"
                  label="Send Message"
                >
                  <template #trailing>
                    <UIcon
                      name="i-heroicons-paper-airplane"
                      class="w-5 h-5 rotate-45"
                    />
                  </template>
                </UButton>
              </div>
            </UCard>
          </UForm>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<style scoped>
/* Optional: Add subtle animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
