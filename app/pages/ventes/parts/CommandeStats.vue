<template>
  <div class="space-y-6">
    <!-- Titre avec indicateur de chargement -->
    <div v-if="loading" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Carte Total -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-indigo-800">Total Commandes</p>
              <p class="text-2xl font-bold text-indigo-900 mt-1">{{ formatNumber(stats.total) }}</p>
              <p class="text-xs text-indigo-600 mt-1">
                <span :class="stats.total > 0 ? 'text-green-500' : 'text-gray-500'">
                  <Icon :name="stats.total > 0 ? 'heroicons:arrow-trending-up' : 'heroicons:minus'" class="w-3 h-3 inline mr-1" />
                  {{ stats.total > 0 ? 'En hausse' : 'Stable' }}
                </span>
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-indigo-500 bg-opacity-20">
              <Icon name="heroicons:shopping-cart" class="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <!-- Carte En Cours -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-amber-800">En Cours</p>
              <p class="text-2xl font-bold text-amber-900 mt-1">{{ formatNumber(stats.pending) }}</p>
              <p class="text-xs text-amber-700 mt-1">
                {{ stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-amber-500 bg-opacity-20">
              <Icon name="heroicons:clock" class="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <!-- Carte Livrées -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-800">Livrées</p>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ formatNumber(stats.delivered) }}</p>
              <p class="text-xs text-green-700 mt-1">
                {{ stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-green-500 bg-opacity-20">
              <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Carte Annulées -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-red-800">Annulées</p>
              <p class="text-2xl font-bold text-red-900 mt-1">{{ formatNumber(stats.canceled) }}</p>
              <p class="text-xs text-red-700 mt-1">
                {{ stats.total > 0 ? Math.round((stats.canceled / stats.total) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-red-500 bg-opacity-20">
              <Icon name="heroicons:x-circle" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Graphique circulaire -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Répartition par statut</h3>
            <div class="flex items-center gap-2">
              <button
                v-for="(item, index) in pieData.labels"
                :key="index"
                class="flex items-center text-xs"
              >
                <span
                  class="w-3 h-3 rounded-full mr-1"
                  :style="{ backgroundColor: pieData.datasets[0].backgroundColor[index] }"
                ></span>
                {{ item }}
              </button>
            </div>
          </div>
          <div class="h-64">
            <pie-chart
              :chart-data="pieData"
              :chart-options="{
                ...pieOptions,
                plugins: {
                  ...pieOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }"
              class="w-full h-full"
            />
          </div>
        </div>

        <!-- Graphique à barres -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Évolution mensuelle</h3>
          <div class="h-64">
            <bar-chart
              :chart-data="barData"
              :chart-options="{
                ...barOptions,
                plugins: {
                  ...barOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                      }
                    }
                  }
                }
              }"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>

      <!-- Tableau des dernières commandes -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Dernières commandes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
                  N° Commande
                </th>
                <th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
                  Client
                </th>
                <th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
                  Date
                </th>
                <th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
                  Montant
                </th>
                <th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
                  Statut
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(order, index) in latestOrders" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ order.reference || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.client?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(order.total || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusBadgeClass(order.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                  </button>
                  <button class="text-gray-500 hover:text-gray-700">
                    <Icon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="latestOrders.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Précédent
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">1</span> à <span class="font-medium">5</span> sur <span class="font-medium">{{ latestOrders.length }}</span> résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Précédent</span>
                  <Icon name="heroicons:chevron-left" class="h-5 w-5" />
                </button>
                <button aria-current="page" class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Suivant</span>
                  <Icon name="heroicons:chevron-right" class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { PieChart, BarChart } from 'vue-chart-3'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useOrderStore } from '~/app/stores/Sale/OrderStore'

Chart.register(...registerables)

const orderStore = useOrderStore()
const orders = ref([])
const loading = ref(true)

const stats = ref({
  total: 0,
  pending: 0,
  delivered: 0,
  canceled: 0
})

// Récupérer les 5 dernières commandes
const latestOrders = computed(() => {
  return [...orders.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

// Données des graphiques
const pieData = ref({
  labels: ['En Cours', 'Livrées', 'Annulées'],
  datasets: [
    {
      label: 'Commandes',
      data: [],
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 10,
      borderRadius: 4
    }
  ]
})

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const value = context.raw;
          const percentage = Math.round((value / total) * 100);
          return `${context.label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '65%',
  spacing: 5
}

// Données pour le graphique à barres (exemple avec des données mensuelles)
const barData = ref({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [
    {
      label: 'Commandes créées',
      data: Array(12).fill(0).map(() => Math.floor(Math.random() * 20) + 5),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
      borderSkipped: false,
      barPercentage: 0.8,
      categoryPercentage: 0.8
    }
  ]
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,
        font: {
          family: 'Inter',
          size: 12
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      }
    }
  }
}

// Fonctions utilitaires
const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-amber-100 text-amber-800',
    delivered: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.default
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En Cours',
    delivered: 'Livrée',
    canceled: 'Annulée'
  }
  return labels[status] || status
}

// Récupération des données
onMounted(async () => {
  try {
    loading.value = true
    await orderStore.fetchOrder()
    orders.value = orderStore.commande
    computeStats()
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  } finally {
    loading.value = false
  }
})

const computeStats = () => {
  stats.value.total = orders.value.length
  stats.value.pending = orders.value.filter(o => o.status === 'pending').length
  stats.value.delivered = orders.value.filter(o => o.status === 'delivered').length
  stats.value.canceled = orders.value.filter(o => o.status === 'canceled').length

  // Mise à jour des données du graphique circulaire
  pieData.value.datasets[0].data = [
    stats.value.pending,
    stats.value.delivered,
    stats.value.canceled
  ]

  // Mise à jour des données du graphique à barres (exemple avec des données mensuelles)
  const currentMonth = new Date().getMonth()
  const monthlyData = Array(12).fill(0)

  orders.value.forEach(order => {
    const month = new Date(order.date).getMonth()
    monthlyData[month]++
  })

  barData.value.datasets[0].data = monthlyData
}
</script>

<style scoped>
/* Animation de chargement */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Transition pour les cartes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Style personnalisé pour la barre de défilement */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Amélioration de la lisibilité sur mobile */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .p-5 {
    padding: 1rem;
  }

  .grid > div {
    margin-bottom: 0.75rem;
  }
}
</style>
