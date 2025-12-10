<template>
  <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
    <!-- En-tête du tableau avec recherche et filtres -->
    <div v-if="showHeader" class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Barre de recherche -->
        <div v-if="showSearch" class="flex-1 max-w-md">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Filtres personnalisés -->
        <div v-if="$slots.filters" class="flex items-center space-x-3">
          <slot name="filters" />
        </div>

        <!-- Actions principales -->
        <div v-if="$slots.actions" class="flex items-center space-x-3">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <slot name="header" />
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <slot name="body" />
        </tbody>
      </table>
    </div>

    <!-- État vide -->
    <div v-if="!loading && (!data || data.length === 0)" class="px-6 py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyTitle }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ emptyDescription }}</p>
      <div v-if="$slots.emptyAction" class="mt-6">
        <slot name="emptyAction" />
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="px-6 py-12 text-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Chargement...
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && totalPages > 1" class="px-6 py-3 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Affichage de <span class="font-medium">{{ startIndex + 1 }}</span> à <span class="font-medium">{{ endIndex }}</span> sur <span class="font-medium">{{ totalItems }}</span> résultats
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span class="px-3 py-1 text-sm text-gray-700">
            Page {{ currentPage }} sur {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  data?: any[]
  loading?: boolean
  showHeader?: boolean
  showSearch?: boolean
  showPagination?: boolean
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  itemsPerPage?: number
  currentPage?: number
  totalItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  showHeader: true,
  showSearch: true,
  showPagination: false,
  searchPlaceholder: 'Rechercher...',
  emptyTitle: 'Aucun résultat',
  emptyDescription: 'Aucune donnée à afficher pour le moment.',
  itemsPerPage: 10,
  currentPage: 1,
  totalItems: 0
})

const emit = defineEmits<{
  search: [query: string]
  pageChange: [page: number]
}>()

const searchQuery = ref('')

// Pagination
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + props.itemsPerPage, props.totalItems))

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('pageChange', props.currentPage + 1)
  }
}

// Recherche
watch(searchQuery, (newQuery) => {
  emit('search', newQuery)
})
</script>

