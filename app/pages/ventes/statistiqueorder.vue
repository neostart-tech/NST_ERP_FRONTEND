<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Statistiques des Commandes</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pie Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Répartition par statut</h2>
        <pie-chart :chart-data="pieData" :chart-options="pieOptions" />
      </div>

      <!-- Bar Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Nombre de commandes</h2>
        <bar-chart :chart-data="barData" :chart-options="barOptions" />
      </div>
    </div>

    <!-- Statistiques numériques -->
    <div class="grid grid-cols-4 gap-4 mt-6">
      <div class="bg-gray-300 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-500">Total Commandes</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">En Cours</p>
        <p class="text-2xl font-bold text-yellow-700">{{ stats.pending }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Livrées</p>
        <p class="text-2xl font-bold text-green-700">{{ stats.delivered }}</p>
      </div>
      <div class="bg-red-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Annulées</p>
        <p class="text-2xl font-bold text-red-700">{{ stats.canceled }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { PieChart, BarChart } from 'vue-chart-3'
import { useOrderStore } from '~/app/stores/Sale/OrderStore'

Chart.register(...registerables)

const orderStore = useOrderStore()
const orders = ref([])

const stats = ref({
  total: 0,
  pending: 0,
  delivered: 0,
  canceled: 0
})

// PIE CHART
const pieData = ref({
  labels: ['En Cours', 'Livrées', 'Annulées'],
  datasets: [
    {
      label: 'Commandes',
      data: [],
      backgroundColor: ['#facc15', '#22c55e', '#ef4444'],
      borderColor: ['#fbbf24', '#16a34a', '#dc2626'],
      borderWidth: 2
    }
  ]
})

const pieOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } }
}

// BAR CHART
const barData = ref({
  labels: ['En Cours', 'Livrées', 'Annulées'],
  datasets: [
    {
      label: 'Nombre de commandes',
      data: [],
      backgroundColor: ['#facc15', '#22c55e', '#ef4444']
    }
  ]
})

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
}

onMounted(async () => {
  await orderStore.fetchOrder()
  orders.value = orderStore.commande
  computeStats()
})

const computeStats = () => {
  stats.value.total = orders.value.length
  stats.value.pending = orders.value.filter(o => o.status === 'pending').length
  stats.value.delivered = orders.value.filter(o => o.status === 'delivered').length
  stats.value.canceled = orders.value.filter(o => o.status === 'canceled').length

  pieData.value.datasets[0].data = [stats.value.pending, stats.value.delivered, stats.value.canceled]
  barData.value.datasets[0].data = [stats.value.pending, stats.value.delivered, stats.value.canceled]
}
</script>

<style scoped>
/* Hover cards statistiques */
.grid > div:hover {
  transform: translateY(-3px);
  transition: 0.3s;
}
</style>
