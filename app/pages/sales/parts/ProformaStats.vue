<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Statistiques des Proformas</h1>

    <!-- GRAPHIQUES -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Pie Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Répartition par statut</h2>
        <pie-chart :chart-data="pieData" :chart-options="pieOptions" />
      </div>

      <!-- Bar Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Nombre de Proformas</h2>
        <bar-chart :chart-data="barData" :chart-options="barOptions" />
      </div>
      
    </div>

    <!-- STATS NUMÉRIQUES -->
    <div class="grid grid-cols-4 gap-4 mt-6">
      <div class="bg-gray-300 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-500">Total Proformas</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Draft</p>
        <p class="text-2xl font-bold text-yellow-700">{{ stats.draft }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Validés</p>
        <p class="text-2xl font-bold text-green-700">{{ stats.validated }}</p>
      </div>
      <div class="bg-red-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Rejetés</p>
        <p class="text-2xl font-bold text-red-700">{{ stats.rejected }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProformaStore } from '~/app/stores/proforma'
import { Chart, registerables } from 'chart.js'
import { PieChart, BarChart } from 'vue-chart-3'

Chart.register(...registerables)

const proformaStore = useProformaStore()
const proformas = ref([])
const stats = ref({ total: 0, draft: 0, validated: 0, rejected: 0 })

// PIE CHART
const pieData = ref({
  labels: ['Draft', 'Validés', 'Rejetés'],
  datasets: [
    {
      label: 'Proformas',
      data: [],
      backgroundColor: ['#facc15', '#22c55e', '#ef4444'], // jaune, vert, rouge
      borderColor: ['#fbbf24', '#16a34a', '#dc2626'],
      borderWidth: 2
    }
  ]
})

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom', labels: { font: { size: 14 } } },
    tooltip: { enabled: true }
  }
}

// BAR CHART
const barData = ref({
  labels: ['Draft', 'Validés', 'Rejetés'],
  datasets: [
    {
      label: 'Nombre de Proformas',
      data: [],
      backgroundColor: ['#facc15', '#22c55e', '#ef4444']
    }
  ]
})

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } }
  }
}

// FETCH DATA
onMounted(async () => {
  await proformaStore.fetchProforma()
  proformas.value = proformaStore.proforma
  computeStats()
})

const computeStats = () => {
  stats.value.total = proformas.value.length
  stats.value.draft = proformas.value.filter(p => p.status === 'draft').length
  stats.value.validated = proformas.value.filter(p => p.status === 'validated').length
  stats.value.rejected = proformas.value.filter(p => p.status === 'rejected').length

  pieData.value.datasets[0].data = [stats.value.draft, stats.value.validated, stats.value.rejected]
  barData.value.datasets[0].data = [stats.value.draft, stats.value.validated, stats.value.rejected]
}
</script>

<style scoped>
/* Effet hover pour cartes statistiques */
.grid > div:hover {
  transform: translateY(-3px);
  transition: 0.3s;
}
</style>
