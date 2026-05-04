<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">📊 Tableau de bord</h1>
              <p class="text-sky-100 text-lg">Vue d'ensemble de votre activité</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Key indicators -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">Total équipements</p>
              <p class="text-3xl font-bold text-sky-800">{{ stats.equipments }}</p>
            </div>
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">Pannes en cours</p>
              <p class="text-3xl font-bold text-amber-600">{{ stats.ongoingBreakdowns }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">Contrats actifs</p>
              <p class="text-3xl font-bold text-emerald-700">{{ stats.activeContracts }}</p>
            </div>
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">CA du mois</p>
              <p class="text-3xl font-bold text-purple-700">{{ formatPrice(stats.monthlyRevenue) }} FCFA</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <p class="mt-3 text-gray-500">Chargement des données...</p>
      </div>

      <div v-else>
        <!-- Charts row -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          <!-- Recurring breakdowns -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔧</span>
                <h2 class="text-xl font-bold text-gray-900">Top 5 pannes récurrentes</h2>
              </div>
            </div>
            <div class="p-6">
              <div v-for="breakdown in recurringBreakdowns" :key="breakdown.name" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">{{ breakdown.name }}</span>
                  <span class="font-semibold text-sky-600">{{ breakdown.count }}x</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-sky-500 to-sky-700 h-2 rounded-full" :style="{ width: breakdown.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue and alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Monthly revenue chart -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📈</span>
                <h2 class="text-xl font-bold text-gray-900">Évolution du CA mensuel</h2>
              </div>
            </div>
            <div class="p-6">
              <!-- Chart container with fixed height -->
              <div class="relative h-64">
                <div v-if="monthlyRevenueWithHeights.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-400">
                  <p>Aucune donnée disponible</p>
                </div>
                <div v-else class="flex items-end space-x-2 h-full">
                  <div v-for="(month, index) in monthlyRevenueWithHeights" :key="month.name || index" class="flex-1 flex flex-col items-center group h-full justify-end">
                    <div class="relative w-full flex justify-center">
                      <div 
                        class="bg-gradient-to-t from-amber-500 to-amber-600 rounded-t transition-all duration-300 hover:from-amber-600 hover:to-amber-700" 
                        :style="{ height: month.height + 'px', width: '100%', maxWidth: '60px' }"
                      ></div>
                      <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                        {{ formatPrice(month.amount) }} FCFA
                      </div>
                    </div>
                    <div class="text-xs mt-2 font-medium text-gray-600 text-center">{{ month.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <span class="text-2xl">⚠️</span>
                <h2 class="text-xl font-bold text-gray-900">Alertes récentes</h2>
              </div>
            </div>
            <div class="p-6">
              <div v-if="alerts.length === 0" class="text-center py-8 text-gray-400 italic">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-5xl">⭐</span>
                  <p>Aucune alerte</p>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div v-for="(alert, index) in alerts" :key="index" class="flex items-center gap-3 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl hover:bg-amber-100 transition">
                  <span class="text-amber-600 text-lg">⚠️</span>
                  <span class="text-gray-700 font-medium">{{ alert.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
}

// States
const loading = ref(false)
const stats = ref({
  equipments: 0,
  ongoingBreakdowns: 0,
  activeContracts: 0,
  monthlyRevenue: 0
})

const recurringBreakdowns = ref([])
const rawMonthlyRevenue = ref([])
const alerts = ref([])

// Computed property to dynamically calculate bar heights based on max revenue
const monthlyRevenueWithHeights = computed(() => {
  if (!rawMonthlyRevenue.value.length) return []
  
  // Find the maximum amount
  const maxAmount = Math.max(...rawMonthlyRevenue.value.map(m => m.amount || 0))
  
  // Maximum bar height in pixels (leaving room for labels)
  const maxHeight = 200
  
  // Calculate height for each month proportionally
  return rawMonthlyRevenue.value.map(month => ({
    ...month,
    height: maxAmount > 0 ? (month.amount / maxAmount) * maxHeight : 0
  }))
})

// API Functions
const fetchStats = async () => {
  try {
    const response = await api.get('/dashboard/stats')
    stats.value = response.data
  } catch (error) {
    console.error("Erreur chargement stats:", error)
  }
}

const fetchRecurringBreakdowns = async () => {
  try {
    const response = await api.get('/dashboard/recurring-breakdowns')
    recurringBreakdowns.value = response.data.data || []
  } catch (error) {
    console.error("Erreur chargement pannes récurrentes:", error)
    recurringBreakdowns.value = [
      { name: "Carte mère défectueuse", count: 23, percentage: 100 },
      { name: "Disque dur défaillant", count: 18, percentage: 78 },
      { name: "Surchauffe processeur", count: 14, percentage: 61 },
      { name: "Problème alimentation", count: 9, percentage: 39 },
      { name: "Panne écran", count: 7, percentage: 30 }
    ]
  }
}

const fetchMonthlyRevenue = async () => {
  try {
    const response = await api.get('/dashboard/monthly-revenue')
    rawMonthlyRevenue.value = response.data.data || []
  } catch (error) {
    console.error("Erreur chargement CA mensuel:", error)
    // Données mockées sans height fixe
    rawMonthlyRevenue.value = [
      { name: "Jan", amount: 850000 },
      { name: "Fév", amount: 1200000 },
      { name: "Mar", amount: 1050000 },
      { name: "Avr", amount: 1350000 },
      { name: "Mai", amount: 1520000 },
      { name: "Juin", amount: 1850000 },
      { name: "Juil", amount: 1700000 },
      { name: "Aoû", amount: 1960000 },
      { name: "Sep", amount: 2070000 },
      { name: "Oct", amount: 2400000 },
      { name: "Nov", amount: 2620000 },
      { name: "Déc", amount: 3050000 }
    ]
  }
}

const fetchAlerts = async () => {
  try {
    const response = await api.get('/dashboard/alerts')
    alerts.value = response.data.data || []
  } catch (error) {
    console.error("Erreur chargement alertes:", error)
    alerts.value = [
      { message: "Dupont SA - contrat expire dans 5 jours", type: "warning" },
      { message: "3 équipements hors service chez TechCorp", type: "danger" },
      { message: "Panne #1452 en attente de validation depuis 48h", type: "danger" }
    ]
  }
}

const fetchAllData = async () => {
  loading.value = true
  await Promise.all([
    fetchStats(),
    fetchRecurringBreakdowns(),
    fetchMonthlyRevenue(),
    fetchAlerts()
  ])
  loading.value = false
}

onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
/* Optional: Add smooth transitions for height changes */
.bg-gradient-to-t {
  transition: height 0.3s ease;
}
</style>