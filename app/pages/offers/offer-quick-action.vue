<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
    
    <div class="space-y-3">
      <!-- Create New offer -->
      <button
        @click="createNewoffer"
        class="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
      >
        <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900">Nouvel Appel d'Offres</p>
          <p class="text-xs text-gray-500">Créer un nouveau dossier</p>
        </div>
      </button>

      <!-- View All offers -->
      <router-link
        to="/offers"
        class="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
      >
        <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900">Voir Tous les AO</p>
          <p class="text-xs text-gray-500">Liste complète et filtrage</p>
        </div>
      </router-link>

      <!-- View Submissions -->
      <router-link
        to="/offers/submissions"
        class="w-full flex items-center space-x-3 p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group"
      >
        <div class="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:bg-yellow-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900">Soumissions</p>
          <p class="text-xs text-gray-500">Gérer les propositions</p>
        </div>
      </router-link>

      <!-- View Projects -->
      <router-link
        to="/offers/projects"
        class="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
      >
        <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900">Pilotage Projets</p>
          <p class="text-xs text-gray-500">Tâches et planning</p>
        </div>
      </router-link>

      <!-- Search offers -->
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="performSearch"
          @focus="showSearchResults = true"
          @blur="hideSearchResults"
          type="text"
          placeholder="Rechercher un appel d'offres..."
          class="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- Search Results Dropdown -->
        <div
          v-if="showSearchResults && (searchResults.length > 0 || searchQuery.length > 0)"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          <div v-if="isSearching" class="p-3 text-center text-gray-500">
            <svg class="animate-spin h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          
          <div v-else-if="searchResults.length > 0" class="py-1">
            <div
              v-for="offer in searchResults"
              :key="offer.id"
              @mousedown="selectoffer(offer)"
              class="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center space-x-2">
                <div :class="getofferStatusDot(offer.status)" class="w-2 h-2 rounded-full flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ offer.title }}</p>
                  <p class="text-xs text-gray-500">{{ offer.reference }} • {{ offer.publisher }}</p>
                </div>
                <span :class="getofferStatusBadge(offer.status)" class="text-xs">
                  {{ getofferStatusText(offer.status) }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-else-if="searchQuery.length > 0" class="p-3 text-center text-gray-500 text-sm">
            Aucun résultat trouvé pour "{{ searchQuery }}"
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-3 mt-4">
        <div class="bg-gray-50 rounded-lg p-3 text-center">
          <p class="text-lg font-bold text-gray-900">{{ urgentDeadlines }}</p>
          <p class="text-xs text-gray-500">Échéances urgentes</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-center">
          <p class="text-lg font-bold text-gray-900">{{ pendingTasks }}</p>
          <p class="text-xs text-gray-500">Tâches en attente</p>
        </div>
      </div>

      <!-- Export/Import Actions -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Import/Export</h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="exportData"
            :disabled="isExporting"
            class="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            <svg v-if="isExporting" class="animate-spin h-3 w-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isExporting ? 'Export...' : 'Exporter' }}
          </button>
          
          <label class="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer text-center">
            <input
              ref="fileInput"
              type="file"
              accept=".csv,.xlsx,.json"
              @change="importData"
              class="hidden"
            >
            Importer
          </label>
        </div>
      </div>

      <!-- Templates -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Modèles</h4>
        <div class="space-y-2">
          <button
            @click="downloadTemplate('submission')"
            class="w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            📄 Modèle de soumission
          </button>
          <button
            @click="downloadTemplate('financial')"
            class="w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            💰 Modèle financier
          </button>
          <button
            @click="downloadTemplate('technical')"
            class="w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            🔧 Modèle technique
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useoffersStore } from '@/stores/offers'
import { offersService } from '@/services/offersService'
import type { offer } from '@/types/offers'

const router = useRouter()
const offersStore = useoffersStore()

// Reactive state
const searchQuery = ref('')
const searchResults = ref<offer[]>([])
const showSearchResults = ref(false)
const isSearching = ref(false)
const isExporting = ref(false)
const fileInput = ref<HTMLInputElement>()

// Computed values
const urgentDeadlines = computed(() => {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  
  return offersStore.getoffers().filter(offer => {
    const deadline = new Date(offer.deadline)
    return deadline <= threeDaysFromNow && deadline > now && offer.status === 'active'
  }).length
})

const pendingTasks = computed(() => {
  return offersStore.getAllTasks().filter(task => 
    task.status === 'todo' || task.status === 'in_progress'
  ).length
})

// Methods
const createNewoffer = () => {
  router.push('/offers?action=create')
}

const performSearch = async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    // In a real application, this would call the API
    // For now, we'll search through the store
    const alloffers = offersStore.getoffers()
    searchResults.value = alloffers.filter(offer =>
      offer.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      offer.reference.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      offer.publisher.toLowerCase().includes(searchQuery.value.toLowerCase())
    ).slice(0, 5)
  } catch (error) {
    console.error('Error searching offers:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const selectoffer = (offer: offer) => {
  router.push(`/offers/${offer.id}`)
  searchQuery.value = ''
  showSearchResults.value = false
}

const hideSearchResults = () => {
  // Delay hiding to allow for click events
  setTimeout(() => {
    showSearchResults.value = false
  }, 150)
}

const exportData = async () => {
  isExporting.value = true
  try {
    const blob = await offersService.exportoffersReport('excel')
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `appels-offres-${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting data:', error)
    // Show error notification here
  } finally {
    isExporting.value = false
  }
}

const importData = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  try {
    // Here you would implement the import logic
    console.log('Importing file:', file.name)
    // Show success notification
  } catch (error) {
    console.error('Error importing data:', error)
    // Show error notification
  } finally {
    // Reset the input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const downloadTemplate = async (templateType: 'submission' | 'financial' | 'technical') => {
  try {
    const blob = await offersService.downloadTemplate(templateType)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `modele-${templateType}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading template:', error)
    // Show error notification here
  }
}

// Status helpers
const getofferStatusDot = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-400',
    active: 'bg-blue-500',
    submitted: 'bg-yellow-500',
    evaluation: 'bg-purple-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
    cancelled: 'bg-gray-300'
  }
  return colors[status] || 'bg-gray-400'
}

const getofferStatusBadge = (status: string): string => {
  const badges: Record<string, string> = {
    draft: 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800',
    active: 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
    submitted: 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800',
    evaluation: 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800',
    won: 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800',
    lost: 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800',
    cancelled: 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800'
  }
  return badges[status] || badges['draft']
}

const getofferStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    draft: 'Brouillon',
    active: 'Actif',
    submitted: 'Soumis',
    evaluation: 'Évaluation',
    won: 'Gagné',
    lost: 'Perdu',
    cancelled: 'Annulé'
  }
  return texts[status] || status
}

// Initialize component
onMounted(() => {
  // Any initialization logic here
})
</script>