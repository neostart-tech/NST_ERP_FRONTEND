<template>
  <div class="min-h-full bg-gray-100">
    <!-- En-tête de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-600">{{ subtitle }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="px-6 py-6">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

