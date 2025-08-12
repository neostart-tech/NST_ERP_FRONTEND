<template>
    <main class="flex-1 p-6 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <!-- Header avec bouton d'export (modifié indigo → sky) -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 class="text-2xl font-bold text-gray-800">Calcul des Primes</h1>
          
          <button 
            @click="exportBonuses"
            class="px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Exporter les primes
          </button>
        </div>

        <!-- Filtres (modifié indigo → sky) -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-6">
          <div class="px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Filtrer les résultats</h2>
          </div>
          
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="salesperson" class="block text-sm font-medium text-gray-700 mb-1">Commercial</label>
                <select
                  id="salesperson"
                  v-model="filters.salesperson"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white"
                >
                  <option value="">Tous les commerciaux</option>
                  <option v-for="sp in salespeople" :key="sp.id" :value="sp.id">
                    {{ sp.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label for="period" class="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <select
                  id="period"
                  v-model="filters.period"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white"
                >
                  <option value="quarter">Ce trimestre</option>
                  <option value="semester">Ce semestre</option>
                  <option value="year">Cette année</option>
                  <option value="custom">Personnalisée</option>
                </select>
              </div>
              
              <div class="flex items-end">
                <button
                  @click="applyFilters"
                  class="w-full px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
                >
                  Appliquer
                </button>
              </div>
            </div>
            
            <!-- Période personnalisée -->
            <div v-if="filters.period === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="date"
                  id="start-date"
                  v-model="filters.startDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>
              
              <div>
                <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input
                  type="date"
                  id="end-date"
                  v-model="filters.endDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau des primes (modifié hover:indigo-50 → hover:sky-50) -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commercial</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Objectif</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Réalisé</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Taux</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prime</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Période</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr 
                  v-for="bonus in filteredBonuses" 
                  :key="bonus.id" 
                  class="hover:bg-sky-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" :src="bonus.avatar" :alt="bonus.name">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ bonus.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatCurrency(bonus.target) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatCurrency(bonus.achieved) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ bonus.rate }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {{ formatCurrency(bonus.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ bonus.period }}
                  </td>
                </tr>
                
                <!-- Ligne de total -->
                <tr class="bg-gray-50 font-semibold">
                  <td class="px-6 py-4 whitespace-nowrap">Total</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-900">{{ formatCurrency(totalTarget) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-900">{{ formatCurrency(totalAchieved) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap"></td>
                  <td class="px-6 py-4 whitespace-nowrap text-green-600">{{ formatCurrency(totalBonuses) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap"></td>
                </tr>
                
                <!-- Message si aucun résultat -->
                <tr v-if="filteredBonuses.length === 0">
                  <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    Aucune prime trouvée avec les filtres actuels
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
</template>

<!-- Script conservé à l'identique -->
<script setup>
import DefaultLayout from '@/layouts/default.vue'
import { ref, reactive, computed } from 'vue'

// Données des commerciaux
const salespeople = [
  { id: 1, name: 'Marie Martin' },
  { id: 2, name: 'Luc Petit' },
  { id: 3, name: 'Sophie Lambert' }
]

// Filtres
const filters = reactive({
  salesperson: '',
  period: 'quarter',
  startDate: '',
  endDate: ''
})

// Données des primes
const bonuses = [
  {
    id: 1,
    salespersonId: 1,
    name: 'Marie Martin',
    target: 120000,
    achieved: 135000,
    rate: 3,
    amount: 4050,
    period: 'Q2 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    salespersonId: 2,
    name: 'Luc Petit',
    target: 100000,
    achieved: 95000,
    rate: 2,
    amount: 1900,
    period: 'Q2 2023',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    salespersonId: 3,
    name: 'Sophie Lambert',
    target: 80000,
    achieved: 85000,
    rate: 2.5,
    amount: 2125,
    period: 'Q2 2023',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
]

// Primes filtrées
const filteredBonuses = computed(() => {
  let result = [...bonuses]
  
  // Filtre par commercial
  if (filters.salesperson) {
    result = result.filter(b => b.salespersonId === parseInt(filters.salesperson))
  }
  
  // Filtre par période (simplifié pour l'exemple)
  if (filters.period === 'semester') {
    // Logique pour le semestre
  } else if (filters.period === 'year') {
    // Logique pour l'année
  } else if (filters.period === 'custom' && filters.startDate && filters.endDate) {
    // Logique pour la période personnalisée
  }
  
  return result
})

// Totaux calculés
const totalTarget = computed(() => {
  return filteredBonuses.value.reduce((sum, b) => sum + b.target, 0)
})

const totalAchieved = computed(() => {
  return filteredBonuses.value.reduce((sum, b) => sum + b.achieved, 0)
})

const totalBonuses = computed(() => {
  return filteredBonuses.value.reduce((sum, b) => sum + b.amount, 0)
})

// Méthodes
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const applyFilters = () => {
  console.log('Filtres appliqués:', filters)
}

const exportBonuses = () => {
  alert('Export des primes en cours...')
  // Ici vous implémenteriez la logique d'export réel
}
</script>

<!-- Style conservé à l'identique -->
<style scoped>
/* Styles spécifiques si nécessaire */
</style>