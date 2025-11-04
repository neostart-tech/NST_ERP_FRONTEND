<template>
  <main class="flex-1 p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 class="text-2xl font-bold text-gray-800">Calcul des Commissions</h1>
        
        
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Commerciaux</p>
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
              <p class="text-sm font-medium text-gray-600">CA Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalRevenue) }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Commissions Totales</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalCommissions) }}</p>
            </div>
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

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
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>
            
            <div class="flex items-end">
              <button
                @click="applyFilters"
                class="w-full px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
          
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

      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commercial</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CA Simulé</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Taux</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commission</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr 
                v-for="commission in filteredCommissions" 
                :key="commission.id + commission.date" 
                class="hover:bg-sky-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold">
                        {{ getInitials(commission.first_name, commission.last_name) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ commission.first_name }} {{ commission.last_name }}
                      </div>
                      <div class="text-sm text-gray-500">{{ commission.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatCurrency(commission.simulatedRevenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ commission.rate }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {{ formatCurrency(commission.commission) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ commission.date }}
                </td>
              </tr>
              
              <tr v-if="filteredCommissions.length > 0" class="bg-gray-50 font-semibold">
                <td class="px-6 py-4 whitespace-nowrap">Total</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">{{ formatCurrency(totalRevenue) }}</td>
                <td class="px-6 py-4 whitespace-nowrap"></td>
                <td class="px-6 py-4 whitespace-nowrap text-green-600">{{ formatCurrency(totalCommissions) }}</td>
                <td class="px-6 py-4 whitespace-nowrap"></td>
              </tr>
              
              <tr v-if="filteredCommissions.length === 0">
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  Aucune commission trouvée avec les filtres actuels
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

const allCommissions = ref([])
const filters = reactive({
  salesperson: '',
  period: 'month',
  startDate: '',
  endDate: ''
})

const commercials = computed(() => {
  if (!userStore.users || !Array.isArray(userStore.users)) return []
  return userStore.users.filter(user => 
    user.role && user.role.toLowerCase() === 'commercial'
  )
})

// Les commissions filtrées sont basées sur les filtres appliqués
const filteredCommissions = computed(() => {
  let result = [...allCommissions.value]
  
  // Filtre par commercial
  if (filters.salesperson) {
    result = result.filter(c => c.id === parseInt(filters.salesperson))
  }
  
  // Filtre par période
  const startDate = filters.startDate ? new Date(filters.startDate) : null
  const endDate = filters.endDate ? new Date(filters.endDate) : null

  result = result.filter(c => {
    const commissionDate = new Date(c.date)
    const isAfterStart = !startDate || commissionDate >= startDate
    const isBeforeEnd = !endDate || commissionDate <= endDate
    return isAfterStart && isBeforeEnd
  })
  
  return result
})

// Fonctions de calcul des totaux
const totalRevenue = computed(() => {
  return filteredCommissions.value.reduce((sum, c) => sum + c.simulatedRevenue, 0)
})

const totalCommissions = computed(() => {
  return filteredCommissions.value.reduce((sum, c) => sum + c.commission, 0)
})

// Fonction pour générer des commissions simulées
const generateSimulatedCommissions = () => {
  const commissions = []
  if (!commercials.value.length) return []

  const today = new Date()
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

  for (let d = oneYearAgo; d <= today; d.setDate(d.getDate() + 1)) {
    commercials.value.forEach(commercial => {
      if (Math.random() > 0.9) { 
        const simulatedRevenue = Math.round(500 + Math.random() * 5000)
        const rate = 5
        const commission = simulatedRevenue * (rate / 100)
        
        commissions.push({
          id: parseInt(commercial.id), // <-- Correction ici pour s'assurer que l'ID est un nombre
          first_name: commercial.first_name,
          last_name: commercial.last_name,
          email: commercial.email,
          simulatedRevenue,
          rate,
          commission: Math.round(commission),
          date: d.toISOString().split('T')[0]
        })
      }
    })
  }
  return commissions
}

// Gérer la logique de mise à jour des dates
const applyFilters = () => {
  if (filters.period === 'custom') {
    return; // Pas de changement de date si c'est une période personnalisée
  }
  
  const today = new Date()
  const start = new Date()
  const end = new Date()

  switch (filters.period) {
    case 'month':
      start.setDate(1)
      break
    case 'quarter':
      const currentMonth = today.getMonth()
      const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3
      start.setMonth(startMonthOfQuarter, 1)
      break
    case 'year':
      start.setMonth(0, 1)
      break
  }
  
  filters.startDate = start.toISOString().split('T')[0]
  filters.endDate = end.toISOString().split('T')[0]
}

// Fonctions utilitaires
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const exportCommissions = () => {
  alert('Export des commissions en cours...')
}

// Initialisation des données au chargement
onMounted(async () => {
  await userStore.fetchUsers()
  allCommissions.value = generateSimulatedCommissions()
  applyFilters() // Appliquer les filtres initiaux (Ce mois) au chargement
})
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>