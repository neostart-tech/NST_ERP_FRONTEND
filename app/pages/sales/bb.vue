<script setup>
import { onMounted, ref } from "vue"
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

// Données simulées
const salesData = {
  totalSales: 1245,
  totalAmount: 15750000,
  growthRate: 12.5,
  activeClients: 89,
  monthlyData: [
    { month: 'Jan', sales: 850000, orders: 85 },
    { month: 'Fév', sales: 1200000, orders: 95 },
    { month: 'Mar', sales: 1400000, orders: 110 },
    { month: 'Avr', sales: 1100000, orders: 88 },
    { month: 'Mai', sales: 1600000, orders: 125 },
    { month: 'Juin', sales: 1800000, orders: 140 },
    { month: 'Juil', sales: 1500000, orders: 118 },
    { month: 'Août', sales: 1350000, orders: 105 },
    { month: 'Sep', sales: 1450000, orders: 115 },
    { month: 'Oct', sales: 1700000, orders: 135 },
    { month: 'Nov', sales: 1550000, orders: 122 },
    { month: 'Déc', sales: 1200000, orders: 102 }
  ],
  topClients: [
    { name: 'SARL COMMERCE PLUS', orders: 45, amount: 2850000 },
    { name: 'ETS BAKAYOKO', orders: 38, amount: 2400000 },
    { name: 'GLOBAL TRADING', orders: 32, amount: 1950000 },
    { name: 'MARKET CENTER', orders: 28, amount: 1750000 },
    { name: 'BUSINESS CORP', orders: 25, amount: 1600000 }
  ],
  topProducts: [
    { name: 'Produit A', quantity: 450 },
    { name: 'Produit B', quantity: 380 },
    { name: 'Produit C', quantity: 320 },
    { name: 'Produit D', quantity: 280 },
    { name: 'Produit E', quantity: 240 }
  ]
}

const salesChartRef = ref(null)
const productsChartRef = ref(null)

function formatNumber(num) {
  return num.toLocaleString("fr-FR")
}

onMounted(() => {
  // Graphique des ventes
  new Chart(salesChartRef.value.getContext("2d"), {
    type: "line",
    data: {
      labels: salesData.monthlyData.map(i => i.month),
      datasets: [
        {
          label: "Ventes (FCFA)",
          data: salesData.monthlyData.map(i => i.sales),
          borderColor: "rgb(79, 70, 229)",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          tension: 0.4,
          fill: true
        },
        {
          label: "Nombre de commandes",
          data: salesData.monthlyData.map(i => i.orders),
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
      scales: {
        y: { position: "left" },
        y1: { position: "right", grid: { drawOnChartArea: false } }
      }
    }
  })

  // Graphique des produits
  new Chart(productsChartRef.value.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: salesData.topProducts.map(i => i.name),
      datasets: [
        {
          data: salesData.topProducts.map(i => i.quantity),
          backgroundColor: [
            "rgba(79, 70, 229, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(139, 92, 246, 0.8)"
          ]
        }
      ]
    },
    options: { plugins: { legend: { position: "right" } } }
  })
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-8">
    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-8">
      <!-- Titre -->
      <div class="flex justify-between items-center border-b pb-3">
        <h1 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <i class="fas fa-chart-line"></i> Bilan des ventes
        </h1>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-indigo-50 rounded-lg p-4 flex flex-col items-center text-indigo-700 shadow">
          <i class="fas fa-shopping-cart text-3xl mb-2"></i>
          <p class="text-sm font-semibold">Total Ventes</p>
          <p class="text-xl font-bold">{{ salesData.totalSales }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4 flex flex-col items-center text-green-700 shadow">
          <i class="fas fa-dollar-sign text-3xl mb-2"></i>
          <p class="text-sm font-semibold">Montant TTC</p>
          <p class="text-xl font-bold">{{ formatNumber(salesData.totalAmount) }} FCFA</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 flex flex-col items-center text-yellow-700 shadow">
          <i class="fas fa-percent text-3xl mb-2"></i>
          <p class="text-sm font-semibold">Croissance</p>
          <p class="text-xl font-bold">+{{ salesData.growthRate }}%</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center text-blue-700 shadow">
          <i class="fas fa-users text-3xl mb-2"></i>
          <p class="text-sm font-semibold">Clients actifs</p>
          <p class="text-xl font-bold">{{ salesData.activeClients }}</p>
        </div>
      </div>

      <!-- Graphique ventes -->
      <div class="bg-gray-50 p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-3">Évolution des ventes</h2>
        <canvas ref="salesChartRef" width="400" height="200"></canvas>
      </div>

      <!-- Tableau Top clients -->
      <div class="bg-gray-50 p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-3">Top Clients</h2>
        <table class="w-full border text-sm bg-white">
          <thead class="bg-indigo-100 text-indigo-700">
            <tr>
              <th class="border p-3 text-left">Client</th>
              <th class="border p-3 text-center">Commandes</th>
              <th class="border p-3 text-right">Montant total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(client, i) in salesData.topClients"
              :key="i"
              :class="i % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
            >
              <td class="p-3 border font-medium">{{ client.name }}</td>
              <td class="border p-3 text-center">{{ client.orders }}</td>
              <td class="border p-3 text-right font-semibold">
                {{ formatNumber(client.amount) }} FCFA
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Graphique produits -->
      <div class="bg-gray-50 p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-3">Produits les plus vendus</h2>
        <canvas ref="productsChartRef" width="400" height="200"></canvas>
      </div>
    </div>
  </div>
</template>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
</style>
