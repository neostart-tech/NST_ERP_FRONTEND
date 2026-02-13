<template>
  <div class="p-6 space-y-6">
    <!-- En-tête avec titre -->
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Statistiques des Proformas</h1>
		</div>

    <!-- GRAPHIQUES -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Pie Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Répartition par statut</h2>
        <pie-chart :chart-data="pieData" :chart-options="pieOptions" class="w-full h-64" />
      </div>

      <!-- Bar Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Nombre de Proformas</h2>
        <bar-chart :chart-data="barData" :chart-options="barOptions" class="w-full h-64" />
      </div>
    </div>

    <!-- STATS NUMÉRIQUES -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Carte Total Proformas -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-900">Total Proformas</p>
            <p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.total || 0 }}</p>
          </div>
          <div class="p-3 rounded-lg bg-blue-500">
            <Icon name="heroicons:document-text" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Carte Draft -->
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-amber-900">Brouillons</p>
            <p class="text-3xl font-bold text-amber-900 mt-2">{{ stats.draft || 0 }}</p>
            <p class="text-xs text-amber-700 mt-1">
              {{ stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0 }}% du total
            </p>
          </div>
          <div class="p-3 rounded-lg bg-amber-500">
            <Icon name="heroicons:document-duplicate" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Carte Validés -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-900">Validés</p>
            <p class="text-3xl font-bold text-green-900 mt-2">{{ stats.validated || 0 }}</p>
            <p class="text-xs text-green-700 mt-1">
              {{ stats.total > 0 ? Math.round((stats.validated / stats.total) * 100) : 0 }}% du total
            </p>
          </div>
          <div class="p-3 rounded-lg bg-green-500">
            <Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Carte Rejetés -->
      <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-red-900">Rejetés</p>
            <p class="text-3xl font-bold text-red-900 mt-2">{{ stats.rejected || 0 }}</p>
            <p class="text-xs text-red-700 mt-1">
              {{ stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0 }}% du total
            </p>
          </div>
          <div class="p-3 rounded-lg bg-red-500">
            <Icon name="heroicons:x-circle" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProformaStore } from '@/stores/Stock/ProformaStore.ts'
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
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444'], // jaune-ambre, vert-émeraude, rouge
      borderColor: ['#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2,
      hoverOffset: 8
    }
  ]
})

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: 'Inter',
          size: 12
        },
        padding: 20
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  },
  cutout: '70%',
  borderRadius: 8,
  spacing: 4
}

// BAR CHART
const barData = ref({
  labels: ['Draft', 'Validés', 'Rejetés'],
  datasets: [
    {
      label: 'Nombre de Proformas',
      data: [],
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    }
  ]
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `${context.parsed.y} ${context.parsed.y > 1 ? 'proformas' : 'proforma'}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: {
          family: 'Inter',
          size: 12
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      }
    },
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
    }
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
