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
        <!-- Carte Total Factures -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-indigo-800">Total Factures</p>
              <p class="text-2xl font-bold text-indigo-900 mt-1">{{ formatNumber(stats.total) }}</p>
              <p class="text-xs text-indigo-600 mt-1">
                <span :class="stats.total > 0 ? 'text-green-500' : 'text-gray-500'">
                  <Icon :name="stats.total > 0 ? 'heroicons:arrow-trending-up' : 'heroicons:minus'" class="w-3 h-3 inline mr-1" />
                  {{ stats.total > 0 ? 'En hausse' : 'Stable' }}
                </span>
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-indigo-500 bg-opacity-20">
              <Icon name="heroicons:document-text" class="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <!-- Carte Factures Payées -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-800">Payées</p>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ formatCurrency(stats.paidAmount) }}</p>
              <p class="text-xs text-green-700 mt-1">
                {{ stats.totalAmount > 0 ? Math.round((stats.paidAmount / stats.totalAmount) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-green-500 bg-opacity-20">
              <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Carte Factures En attente -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-amber-800">En attente</p>
              <p class="text-2xl font-bold text-amber-900 mt-1">{{ formatCurrency(stats.pendingAmount) }}</p>
              <p class="text-xs text-amber-700 mt-1">
                {{ stats.totalAmount > 0 ? Math.round((stats.pendingAmount / stats.totalAmount) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-amber-500 bg-opacity-20">
              <Icon name="heroicons:clock" class="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <!-- Carte Montant Total -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-800">Montant total</p>
              <p class="text-2xl font-bold text-purple-900 mt-1">{{ formatCurrency(stats.totalAmount) }}</p>
              <p class="text-xs text-purple-700 mt-1">
                <Icon name="heroicons:currency-dollar" class="w-3 h-3 inline mr-1" />
                Toutes factures confondues
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-purple-500 bg-opacity-20">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-purple-600" />
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
                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
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
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Montant par statut</h3>
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
                        return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
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

      <!-- Tableau des dernières factures -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Dernières factures</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
                  N° Facture
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
              <tr v-for="(invoice, index) in latestInvoices" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ invoice.reference || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ invoice.client?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(invoice.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(invoice.total || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusBadgeClass(invoice.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ getStatusLabel(invoice.status) }}
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
              <tr v-if="latestInvoices.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune facture trouvée
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
                Affichage de <span class="font-medium">1</span> à <span class="font-medium">5</span> sur <span class="font-medium">{{ latestInvoices.length }}</span> résultats
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
import { useInvoiceStore } from '#imports'
import { PieChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

Chart.register(...registerables)

const invoiceStore = useInvoiceStore()
const invoices = ref([])
const loading = ref(true)

// Récupérer les 5 dernières factures
const latestInvoices = computed(() => {
  return [...invoices.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

// Calcul des stats globales
const stats = computed(() => {
  const paid = invoices.value.filter(i => i.status === 'paid')
  const pending = invoices.value.filter(i => i.status === 'pending')
  const other = invoices.value.filter(i => i.status !== 'paid' && i.status !== 'pending')

  return {
    total: invoices.value.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    otherCount: other.length,
    paidAmount: paid.reduce((sum, i) => sum + (i.total || 0), 0),
    pendingAmount: pending.reduce((sum, i) => sum + (i.total || 0), 0),
    otherAmount: other.reduce((sum, i) => sum + (i.total || 0), 0),
    totalAmount: invoices.value.reduce((sum, i) => sum + (i.total || 0), 0)
  }
})

// Données pour le PieChart
const pieData = computed(() => ({
  labels: ['Payées', 'En attente', 'Autres'],
  datasets: [{
    label: 'Montant',
    data: [
      stats.value.paidAmount,
      stats.value.pendingAmount,
      stats.value.otherAmount
    ],
    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverOffset: 10,
    borderRadius: 4
  }]
}))

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
          return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '65%',
  spacing: 5
}

// Données pour le BarChart
const barData = computed(() => ({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [
    {
      label: 'Montant des factures',
      data: Array(12).fill(0).map(() => Math.floor(Math.random() * 5000000) + 1000000),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
      borderSkipped: false,
      barPercentage: 0.8,
      categoryPercentage: 0.8
    }
  ]
}))

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
          return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
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
        font: {
          family: 'Inter',
          size: 12
        },
        callback: function(value) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value;
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
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    canceled: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    default: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || classes.default
}

const getStatusLabel = (status) => {
  const labels = {
    paid: 'Payée',
    pending: 'En attente',
    canceled: 'Annulée',
    draft: 'Brouillon'
  }
  return labels[status] || status
}

// Récupération des données
onMounted(async () => {
  try {
    loading.value = true
    await invoiceStore.fetchInvoice()
    invoices.value = invoiceStore.facture || []
  } catch (error) {
    console.error('Erreur lors du chargement des factures:', error)
  } finally {
    loading.value = false
  }
})
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
