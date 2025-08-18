<template>
  <main class="flex-1 p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec bouton d'export -->
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

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Commerciaux</p>
              <p class="text-2xl font-bold text-gray-900">{{ commercials.length }}</p>
            </div>
            <div class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Objectifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalTarget) }}</p>
            </div>
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Réalisé</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalAchieved) }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Primes Totales</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalBonuses) }}</p>
            </div>
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
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
                <option v-for="commercial in commercials" :key="commercial.id" :value="commercial.id">
                  {{ commercial.first_name }} {{ commercial.last_name }}
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

      <!-- Tableau des primes -->
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
                      <!-- Avatar avec initiales -->
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold">
                        {{ getInitials(bonus.first_name, bonus.last_name) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ bonus.first_name }} {{ bonus.last_name }}
                      </div>
                      <div class="text-sm text-gray-500">{{ bonus.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatCurrency(bonus.target) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatCurrency(bonus.achieved) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getAchievementBadge(bonus.achievementRate)">
                    {{ bonus.achievementRate }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {{ formatCurrency(bonus.bonusAmount) }}
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getAchievementBadge(overallAchievementRate)">
                    {{ overallAchievementRate }}%
                  </span>
                </td>
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Filtres
const filters = reactive({
  salesperson: '',
  period: 'quarter',
  startDate: '',
  endDate: ''
})

// Computed pour obtenir les commerciaux
const commercials = computed(() => {
  if (!userStore.users?.users) return []
  return userStore.users.users.filter(user => 
    user.role.toLowerCase() === 'commercial'
  )
})

// Générer des primes simulées basées sur les vrais commerciaux
const simulatedBonuses = computed(() => {
  return commercials.value.map((commercial, index) => {
    // Simulation d'objectifs et de réalisations
    const baseTarget = 80000 + (index * 20000) + Math.random() * 10000
    const target = Math.round(baseTarget)
    
    // Simulation du taux de réalisation (70% à 130%)
    const achievementMultiplier = 0.7 + Math.random() * 0.6
    const achieved = Math.round(target * achievementMultiplier)
    const achievementRate = Math.round((achieved / target) * 100)
    
    // Calcul de la prime (bonus si > 100% de l'objectif)
    let bonusAmount = 0
    if (achieved > target) {
      const surplus = achieved - target
      bonusAmount = Math.round(surplus * 0.03) // 3% du surplus comme prime
    }
    
    return {
      id: commercial.id,
      first_name: commercial.first_name,
      last_name: commercial.last_name,
      email: commercial.email,
      target: target,
      achieved: achieved,
      achievementRate: achievementRate,
      bonusAmount: bonusAmount,
      period: getCurrentQuarter()
    }
  })
})

// Primes filtrées
const filteredBonuses = computed(() => {
  let result = [...simulatedBonuses.value]
  
  // Filtre par commercial
  if (filters.salesperson) {
    result = result.filter(b => b.id === parseInt(filters.salesperson))
  }
  
  // Ici vous pouvez ajouter d'autres filtres selon vos besoins
  
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
  return filteredBonuses.value.reduce((sum, b) => sum + b.bonusAmount, 0)
})

const overallAchievementRate = computed(() => {
  if (totalTarget.value === 0) return 0
  return Math.round((totalAchieved.value / totalTarget.value) * 100)
})

// Fonctions utilitaires
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

const getAchievementBadge = (rate) => {
  if (rate >= 100) {
    return 'bg-green-100 text-green-800'
  } else if (rate >= 80) {
    return 'bg-yellow-100 text-yellow-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}

const getCurrentQuarter = () => {
  const now = new Date()
  const quarter = Math.floor((now.getMonth() + 3) / 3)
  return `T${quarter} ${now.getFullYear()}`
}

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

// Charger les utilisateurs au montage
onMounted(() => {
  userStore.fetchUsers()
})
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>