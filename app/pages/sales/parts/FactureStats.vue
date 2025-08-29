<template>
  <div class="max-w-7xl mx-auto py-8 px-4 space-y-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <i class="fas fa-chart-line text-indigo-600"></i> Statistiques des Factures
    </h1>

    <!-- Statistiques chiffrées -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gray-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-500">Total Factures</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Payées</p>
        <p class="text-2xl font-bold">{{ formatCurrency(stats.paidAmount) }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">En attente</p>
        <p class="text-2xl font-bold">{{ formatCurrency(stats.pendingAmount) }}</p>
      </div>
      <div class="bg-purple-200 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-600">Montant total</p>
        <p class="text-2xl font-bold">{{ formatCurrency(stats.totalAmount) }}</p>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Graphique circulaire -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Répartition par statut</h2>
        <pie-chart :chart-data="pieData" :chart-options="chartOptions"/>
      </div>

      <!-- Graphique en barres -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Montant des factures par statut</h2>
        <bar-chart :chart-data="barData" :chart-options="chartOptions"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInvoiceStore } from '#imports'
import { PieChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const invoiceStore = useInvoiceStore()
const invoices = ref([])

onMounted(async () => {
  await invoiceStore.fetchInvoice()
  invoices.value = invoiceStore.facture
})

// Calcul des stats globales
const stats = computed(() => {
  const paid = invoices.value.filter(i => i.status === 'paid')
  const pending = invoices.value.filter(i => i.status === 'pending')
  return {
    total: invoices.value.length,
    paidAmount: paid.reduce((sum, i) => sum + i.total, 0),
    pendingAmount: pending.reduce((sum, i) => sum + i.total, 0),
    totalAmount: invoices.value.reduce((sum, i) => sum + i.total, 0)
  }
})

// Données pour le PieChart
const pieData = computed(() => ({
  labels: ['Payées', 'En attente', 'Autres'],
  datasets: [{
    data: [
      stats.value.paidAmount,
      stats.value.pendingAmount,
      stats.value.totalAmount - (stats.value.paidAmount + stats.value.pendingAmount)
    ],
    backgroundColor: ['#22c55e', '#facc15', '#ef4444']
  }]
}))

// Données pour le BarChart
const barData = computed(() => ({
  labels: ['Payées', 'En attente', 'Total'],
  datasets: [{
    label: 'Montant XOF',
    data: [stats.value.paidAmount, stats.value.pendingAmount, stats.value.totalAmount],
    backgroundColor: ['#22c55e', '#facc15', '#4f46e5']
  }]
}))

const chartOptions = { responsive: true }

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
}
</script>

<style scoped>
.grid > div:hover {
  transform: translateY(-3px);
  transition: 0.3s;
}
</style>
