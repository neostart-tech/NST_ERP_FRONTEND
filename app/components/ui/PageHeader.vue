<template>
  <div
    class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden mb-6"
  >
    <div class="absolute inset-0 opacity-10">
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
      <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
      <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
    </div>

    <div class="relative z-10">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ title }}</h1>
          <p v-if="subtitle" class="text-sky-100 text-lg">{{ subtitle }}</p>
          <div v-if="stats && stats.length > 0" class="flex items-center gap-6 mt-4 text-sm">
            <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-2">
              <div :class="`w-2 h-2 ${stat.color} rounded-full`"></div>
              <span class="text-sky-100">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div v-if="$slots.actions" class="flex flex-col sm:flex-row gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stat {
  label: string
  color: string
}

interface Props {
  title: string
  subtitle?: string
  stats?: Stat[]
}

defineProps<Props>()
</script>

