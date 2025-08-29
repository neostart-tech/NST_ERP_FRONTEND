<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
    
    <!-- Titre -->
    <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
      <i class="fas fa-chart-line text-indigo-600"></i> Statistiques
    </h1>

    <!-- Sélecteur de partie -->
    <div class="flex items-center gap-4 border-b pb-4">
      <button
        v-for="part in parts"
        :key="part.value"
        @click="selectedPart = part.value"
        :class="selectedPart === part.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'"
        class="px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 hover:text-white transition"
      >
        {{ part.label }}
      </button>
    </div>

    <!-- Filtres de date -->
    <div class="flex flex-col sm:flex-row items-center gap-4 border-b pb-4">
      <input type="date" v-model="startDate" class="border rounded-md p-2 shadow-sm w-full sm:w-auto"/>
      <span>-</span>
      <input type="date" v-model="endDate" class="border rounded-md p-2 shadow-sm w-full sm:w-auto"/>
      <button
        @click="filterData"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition"
      >
        Filtrer
      </button>
    </div>

    <!-- Composant dynamique -->
    <component :is="currentComponent" :start-date="startDate" :end-date="endDate" />
    
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'

// Define the parts
const parts = [
  { label: 'Proforma', value: 'proforma' },
  { label: 'Commande', value: 'commande' },
  { label: 'Facture', value: 'facture' },
  { label: 'Livraison', value: 'livraison' },
  { label: 'Échéancier', value: 'echeancier' }
]

const selectedPart = ref('proforma')

// Dates
const startDate = ref('')
const endDate = ref('')

// Corrected dynamic component logic
const currentComponent = computed(() => {
  switch(selectedPart.value) {
    case 'proforma':
      return defineAsyncComponent(() => import('./parts/ProformaStats.vue'))
    case 'commande':
      return defineAsyncComponent(() => import('./parts/CommandeStats.vue'))
    case 'facture':
      return defineAsyncComponent(() => import('./parts/FactureStats.vue'))
    case 'livraison':
      return defineAsyncComponent(() => import('./parts/LivraisonStats.vue'))
    case 'echeancier':
      return defineAsyncComponent(() => import('./parts/EcheancierStats.vue'))
    default:
      return null // Return null if no part is selected
  }
})

// Filter data
const filterData = () => {
  console.log('Filtrer', selectedPart.value, 'de', startDate.value, 'à', endDate.value)
}
</script>