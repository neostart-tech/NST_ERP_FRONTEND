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
        <!-- Carte Total Échéances -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-indigo-800">Total Échéances</p>
              <p class="text-2xl font-bold text-indigo-900 mt-1">{{ formatNumber(stats.totalInstallments) }}</p>
              <p class="text-xs text-indigo-600 mt-1">
                <Icon name="heroicons:calendar" class="w-3 h-3 inline mr-1" />
                Toutes échéances confondues
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-indigo-500 bg-opacity-20">
              <Icon name="heroicons:calendar" class="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <!-- Carte Échéances Payées -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-800">Échéances Payées</p>
              <p class="text-2xl font-bold text-green-900 mt-1">{{ formatNumber(stats.paidInstallments) }}</p>
              <p class="text-xs text-green-700 mt-1">
                {{ stats.totalInstallments > 0 ? Math.round((stats.paidInstallments / stats.totalInstallments) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-green-500 bg-opacity-20">
              <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Carte Échéances en Attente -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-amber-800">Échéances en Attente</p>
              <p class="text-2xl font-bold text-amber-900 mt-1">{{ formatNumber(stats.pendingInstallments) }}</p>
              <p class="text-xs text-amber-700 mt-1">
                {{ stats.totalInstallments > 0 ? Math.round((stats.pendingInstallments / stats.totalInstallments) * 100) : 0 }}% du total
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-amber-500 bg-opacity-20">
              <Icon name="heroicons:clock" class="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <!-- Carte Montant Total Dû -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-red-800">Montant Total Dû</p>
              <p class="text-2xl font-bold text-red-900 mt-1">{{ formatCurrency(stats.totalAmountDue) }}</p>
              <p class="text-xs text-red-700 mt-1">
                <Icon name="heroicons:currency-dollar" class="w-3 h-3 inline mr-1" />
                Montant total en attente
              </p>
            </div>
            <div class="p-2.5 rounded-lg bg-red-500 bg-opacity-20">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Graphique circulaire -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Répartition des paiements</h3>
            <div class="flex items-center gap-2">
              <button
                v-for="(item, index) in paymentChartData.labels"
                :key="index"
                class="flex items-center text-xs"
              >
                <span
                  class="w-3 h-3 rounded-full mr-1"
                  :style="{ backgroundColor: paymentChartData.datasets[0].backgroundColor[index] }"
                ></span>
                {{ item }}
              </button>
            </div>
          </div>
          <div class="h-64">
            <PieChart
              :chart-data="paymentChartData"
              :chart-options="pieOptions"
              class="w-full h-full"
            />
          </div>
        </div>

        <!-- Graphique à barres -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Montant dû par client</h3>
            <div class="text-xs text-gray-500">
              Top 5 des clients
            </div>
          </div>
          <div class="h-64">
            <BarChart
              :chart-data="debtChartData"
              :chart-options="barOptions"
              class="w-full h-full"
            />
          </div>
        </div>
      </div>

      <!-- Tableau des prochaines échéances -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Prochaines échéances</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
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
                  Réf. Facture
                </th>
                <th
                  scope="col"
                  class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
                >
                  Date d'échéance
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
              <tr v-for="(installment, index) in upcomingInstallments" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ installment.clientName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(installment.dueDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(installment.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(installment.paid)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ installment.paid ? 'Payé' : 'En attente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ installment.invoiceReference || 'N/A' }}
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
              <tr v-if="upcomingInstallments.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune échéance à venir
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
                Affichage de <span class="font-medium">1</span> à <span class="font-medium">5</span> sur <span class="font-medium">{{ upcomingInstallments.length }}</span> résultats
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
import { computed } from 'vue'
import { useScheduleStore } from '#imports'
import { PieChart, BarChart } from 'vue-chart-3'

const scheduleStore = useScheduleStore()

// Options communes pour les graphiques
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Données pour PieChart : payés vs en attente
const paymentChartData = computed(() => {
  const allSchedules = scheduleStore.echeancier
  let paid = 0, pending = 0
  allSchedules.forEach(schedule => {
    JSON.parse(schedule.installments).forEach(inst => {
      inst.paid ? paid++ : pending++
    })
  })

  return {
    labels: ['Payé', 'En attente'],
    datasets: [
      {
        label: 'Échéances',
        data: [paid, pending],
        backgroundColor: ['#34D399', '#FBBF24'],
      }
    ]
  }
})

// Données pour BarChart : montant dû par client
const debtChartData = computed(() => {
  const dataMap = {}
  scheduleStore.echeancier.forEach(schedule => {
    const clientName = `${schedule.invoice.order.client.last_name} ${schedule.invoice.order.client.first_name}`
    JSON.parse(schedule.installments).forEach(inst => {
      if (!inst.paid) {
        dataMap[clientName] = (dataMap[clientName] || 0) + inst.amount
      }
    })
  })

  return {
    labels: Object.keys(dataMap),
    datasets: [
      {
        label: 'Montant dû (XOF)',
        data: Object.values(dataMap),
        backgroundColor: '#F87171',
      }
    ]
  }
})
</script>
