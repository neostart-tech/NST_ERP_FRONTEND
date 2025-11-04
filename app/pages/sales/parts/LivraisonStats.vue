<template>
  <div class="max-w-7xl mx-auto py-8 px-4 space-y-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <i class="fas fa-truck text-indigo-600"></i> Statistiques des Livraisons
    </h1>

    <!-- Statistiques chiffrées -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-500">Total Livraisons</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Livraisons Complètes</p>
        <p class="text-2xl font-bold">{{ stats.complete }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Livraisons Partielles</p>
        <p class="text-2xl font-bold">{{ stats.partial }}</p>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Répartition par type</h2>
        <pie-chart :chart-data="pieData" :chart-options="chartOptions"/>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Quantité totale par type</h2>
        <bar-chart :chart-data="barData" :chart-options="chartOptions"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDeliveryStore } from '#imports'
import { PieChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const deliveryStore = useDeliveryStore()
const deliveries = ref([])

onMounted(async () => {
  await deliveryStore.fetchDelivery()
  deliveries.value = deliveryStore.livraison
})

// Stats
const stats = computed(() => ({
  total: deliveries.value.length,
  complete: deliveries.value.filter(d => d.delivery_type === 'complete').length,
  partial: deliveries.value.filter(d => d.delivery_type === 'partial').length
}))

// Pie chart
const pieData = computed(() => ({
  labels: ['Complète', 'Partielle'],
  datasets: [{
    data: [stats.value.complete, stats.value.partial],
    backgroundColor: ['#22c55e', '#facc15']
  }]
}))

// Bar chart: quantité totale
const barData = computed(() => {
  const completeQty = deliveries.value
    .filter(d => d.delivery_type === 'complete')
    .reduce((sum, d) => sum + (d.items?.reduce((s, i) => s + i.quantity_delivered, 0) || 0), 0)
  const partialQty = deliveries.value
    .filter(d => d.delivery_type === 'partial')
    .reduce((sum, d) => sum + (d.items?.reduce((s, i) => s + i.quantity_delivered, 0) || 0), 0)
  return {
    labels: ['Complète', 'Partielle'],
    datasets: [{
      label: 'Quantité livrée',
      data: [completeQty, partialQty],
      backgroundColor: ['#22c55e', '#facc15']
    }]
  }
})

const chartOptions = { responsive: true }
</script>
