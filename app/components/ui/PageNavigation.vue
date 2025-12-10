<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="inline-flex items-center">
        <!-- Séparateur -->
        <div v-if="index > 0" class="flex items-center">
          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>

        <!-- Lien ou texte -->
        <NuxtLink
          v-if="item.path && index < breadcrumbs.length - 1"
          :to="item.path"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          <component
            v-if="item.icon"
            :is="item.icon"
            class="w-4 h-4 mr-2"
          />
          {{ item.label }}
        </NuxtLink>
        
        <span
          v-else
          class="inline-flex items-center text-sm font-medium text-gray-500"
        >
          <component
            v-if="item.icon"
            :is="item.icon"
            class="w-4 h-4 mr-2"
          />
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  path?: string
  icon?: any
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

