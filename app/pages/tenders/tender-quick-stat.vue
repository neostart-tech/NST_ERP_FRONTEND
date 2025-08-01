<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <div class="flex space-x-2">
        <button
          @click="refreshData"
          :disabled="isLoading"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          :class="{ 'animate-spin': isLoading }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
        <router-link
          to="/tenders"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Quick Metrics Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="text-center p-3 bg-blue-50 rounded-lg">
        <p class="text-2xl font-bold text-blue-600">{{ metrics.totalTenders }}</p>
        <p class="text-xs text-blue-800">Total</p>
      </div>
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <p class="text-2xl font-bold text-green-600">{{ metrics.activeTenders }}</p>
        <p class="text-xs text-green-800">Actifs</p>
      </div>
      <div class="text-center p-3 bg-yellow-50 rounded-lg">
        <p class="text-2xl font-bold text-yellow-600">{{ metrics.submittedTenders }}</p>
        <p class="text-xs text-yellow-800">Soumis</p>
      </div>
      <div class="text-center p-3 bg-purple-50 rounded-lg">
        <p class="text-2xl font-bold text-purple-600">{{ successRateFormatted }}%</p>
        <p class="text-xs text-purple-800">Succès</p>
      </div>
    </div>

    <!-- Success Rate Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Taux de réussite</span>
        <span>{{ successRateFormatted }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${Math.min(metrics.successRate, 100)}%` }"
        ></div>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Valeur Totale</p>
        <p class="text-lg font-bold text-gray-900">{{ formatCurrency(metrics.totalValue) }}</p>
      </div>
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <p class="text-sm text-green-600">Valeur Gagnée</p>
        <p class="text-lg font-bold text-green-600">{{ formatCurrency(metrics.wonValue) }}</p>
      </div>
      <div class="text-center p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-600">En Attente</p>
        <p class="text-lg font-bold text-blue-600">{{ formatCurrency(metrics.pendingValue) }}</p>
      </div>
    </div>

    <!-- Recent Tenders -->
    <div v-if="showRecentTenders && recentTenders.length > 0">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Appels d'Offres Récents</h4>
      <div class="space-y-2">
        <div
          v-for="tender in recentTenders.slice(0, 3)"
          :key="tender.id"
          class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          @click="$router.push(`/tenders/${tender.id}`)"
        >
          <div
            :class="getTenderStatusDot(tender.status)"
            class="w-2 h-2 rounded-full flex-shrink-0"
          ></div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ tender.title }}</p>
            <p class="text-xs text-gray-500">
              {{ tender.reference }} • {{ formatRelativeDate(tender.updatedAt) }}
            </p>
          </div>
          <div class="text-xs text-gray-500">
            {{ formatCurrency(tender.estimatedValue) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Deadlines -->
    <div v-if="showUpcomingDeadlines && upcomingDeadlines.length > 0" class="mt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Échéances Proches</h4>
      <div class="space-y-2">
        <div
          v-for="tender in upcomingDeadlines.slice(0, 3)"
          :key="tender.id"
          class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          @click="$router.push(`/tenders/${tender.id}`)"
        >
          <div class="flex items-center space-x-3">
            <div
              :class="getUrgencyDot(tender.deadline)"
              class="w-2 h-2 rounded-full flex-shrink-0"
            ></div>
            <div>
              <p class="text-sm font-medium text-gray-900 truncate">{{ tender.title }}</p>
              <p class="text-xs text-gray-500">{{ tender.reference }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium" :class="getDeadlineColor(tender.deadline)">
              {{ formatDate(tender.deadline) }}
            </p>
            <p class="text-xs text-gray-500">{{ getDaysUntilDeadline(tender.deadline) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="metrics.totalTenders === 0" class="text-center py-8">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun appel d'offres</h3>
      <p class="mt-1 text-sm text-gray-500">Commencez par créer votre premier appel d'offres.</p>
      <div class="mt-6">
        <router-link
          to="/tenders"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Créer un Appel d'Offres
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTendersStore } from '@/stores/tenders'
import type { Tender, TenderMetrics } from '@/types/tenders'

interface Props {
  title?: string
  showRecentTenders?: boolean
  showUpcomingDeadlines?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // in minutes
}

const props = withDefaults(defineProps<Props>(), {
  title: "Appels d'Offres - Vue d'ensemble",
  showRecentTenders: true,
  showUpcomingDeadlines: true,
  autoRefresh: false,
  refreshInterval: 5,
})

const tendersStore = useTendersStore()
const isLoading = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | null = null

// Computed values
const metrics = computed((): TenderMetrics => tendersStore.metrics)

const successRateFormatted = computed(() =>
  metrics.value.successRate ? metrics.value.successRate.toFixed(1) : '0.0',
)

const recentTenders = computed((): Tender[] => {
  return tendersStore
    .getTenders()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
})

const upcomingDeadlines = computed((): Tender[] => {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return tendersStore
    .getTenders()
    .filter((tender) => {
      const deadline = new Date(tender.deadline)
      return deadline > now && deadline <= thirtyDaysFromNow && tender.status === 'active'
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)
})

// Methods
const refreshData = async () => {
  isLoading.value = true
  try {
    await tendersStore.fetchTenders()
    await tendersStore.fetchMetrics()
  } catch (error) {
    console.error('Error refreshing tender data:', error)
  } finally {
    isLoading.value = false
  }
}

const setupAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshTimer = setInterval(refreshData, props.refreshInterval * 60 * 1000)
  }
}

const clearAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Status and urgency helpers
const getTenderStatusDot = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-400',
    active: 'bg-blue-500',
    submitted: 'bg-yellow-500',
    evaluation: 'bg-purple-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
    cancelled: 'bg-gray-300',
  }
  return colors[status] || 'bg-gray-400'
}

const getUrgencyDot = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 3) return 'bg-red-500'
  if (diffDays <= 7) return 'bg-orange-500'
  if (diffDays <= 14) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getDeadlineColor = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 3) return 'text-red-600'
  if (diffDays <= 7) return 'text-orange-600'
  return 'text-gray-900'
}

const getDaysUntilDeadline = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Demain'
  if (diffDays < 0) return 'Échue'
  return `${diffDays}j`
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  })
}

const formatRelativeDate = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `${diffDays}j`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`
  return `${Math.floor(diffDays / 30)}mois`
}

// Lifecycle hooks
onMounted(() => {
  refreshData()
  setupAutoRefresh()
})

onUnmounted(() => {
  clearAutoRefresh()
})
</script>
