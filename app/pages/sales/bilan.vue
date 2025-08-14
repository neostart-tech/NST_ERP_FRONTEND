<template>
  <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header et filtres -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-8 gap-4">
      <h1 class="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
        <i class="fas fa-chart-line text-indigo-600"></i> Bilan des ventes
      </h1>
      <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        <div class="flex items-center">
          <input 
            type="date" 
            v-model="startDate" 
            class="border rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
          />
          <span class="mx-2">-</span>
          <input 
            type="date" 
            v-model="endDate" 
            class="border rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
          />
        </div>
        <button 
          @click="filterData" 
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition duration-150 ease-in-out w-full sm:w-auto"
        >
          Filtrer
        </button>
      </div>
    </div>

    <!-- Statistiques intégrées -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="(stat, index) in statCards" 
        :key="index"
        :class="`bg-${stat.color}-50 rounded-lg p-6 flex flex-col shadow-sm border border-${stat.color}-100`"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
            <p class="mt-1 text-2xl font-semibold" :class="`text-${stat.color}-700`">
              {{ stat.value }}
            </p>
          </div>
          <div :class="`bg-${stat.color}-100 rounded-full p-3`">
            <i :class="`fas fa-${stat.icon} text-${stat.color}-600 text-lg`"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphique -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Évolution des ventes</h2>
        <div class="flex space-x-2">
          <button 
            @click="setTimeRange('month')" 
            :class="{'bg-indigo-100 text-indigo-700': timeRange === 'month'}" 
            class="px-3 py-1 text-sm rounded hover:bg-indigo-50"
          >
            Mensuel
          </button>
          <button 
            @click="setTimeRange('year')" 
            :class="{'bg-indigo-100 text-indigo-700': timeRange === 'year'}" 
            class="px-3 py-1 text-sm rounded hover:bg-indigo-50"
          >
            Annuel
          </button>
        </div>
      </div>
      <div class="h-80">
        <LineChart :chart-data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Top Clients -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-bold mb-4">Top Clients (par montant total)</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant total</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(client, index) in topClients" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-medium">{{ client.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                    <div class="text-sm text-gray-500">{{ client.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ client.ordersCount }} commandes
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                {{ formatCurrency(client.totalAmount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

// Initialisation de Chart.js
Chart.register(...registerables)

// Configuration des dates
const timeRange = ref('month')
const startDate = ref('')
const endDate = ref('')

// Formatage monétaire
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(value)
}

// Données statistiques
const stats = ref({
  totalSales: 128,
  totalAmount: 1250000,
  totalMargin: 187500,
  activeClients: 54
})

// Cartes de statistiques intégrées
const statCards = computed(() => [
  {
    title: 'Total Ventes',
    value: stats.value.totalSales,
    icon: 'shopping-cart',
    color: 'indigo'
  },
  {
    title: 'Montant TTC',
    value: formatCurrency(stats.value.totalAmount),
    icon: 'dollar-sign',
    color: 'green'
  },
  {
    title: 'Marge brute',
    value: formatCurrency(stats.value.totalMargin),
    icon: 'percent',
    color: 'yellow'
  },
  {
    title: 'Clients actifs',
    value: stats.value.activeClients,
    icon: 'users',
    color: 'blue'
  }
])

// Top clients
const topClients = ref([
  { 
    name: 'Jean Dupont', 
    email: 'jean.dupont@example.com',
    ordersCount: 12, 
    totalAmount: 250000 
  },
  { 
    name: 'Marie Durant', 
    email: 'marie.durant@example.com',
    ordersCount: 9, 
    totalAmount: 180000 
  },
  { 
    name: 'Paul Martin', 
    email: 'paul.martin@example.com',
    ordersCount: 7, 
    totalAmount: 140000 
  },
  { 
    name: 'Sophie Leroy', 
    email: 'sophie.leroy@example.com',
    ordersCount: 5, 
    totalAmount: 120000 
  }
])

// Données du graphique
const monthlyData = [200000, 180000, 220000, 150000, 240000, 250000, 230000, 260000, 280000, 300000, 320000, 350000]
const yearlyData = [1200000, 1500000, 1800000, 2100000, 2500000]

const chartData = computed(() => {
  const labels = timeRange.value === 'month' 
    ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    : ['2020', '2021', '2022', '2023', '2024']
  
  const data = timeRange.value === 'month' ? monthlyData : yearlyData

  return {
    labels,
    datasets: [
      {
        label: 'Montant des ventes (XOF)',
        data,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointHoverRadius: 5
      }
    ]
  }
})

// Options du graphique
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      },
      ticks: {
        callback: (value) => formatCurrency(value)
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
})

// Fonctions
const setTimeRange = (range) => {
  timeRange.value = range
}

const filterData = () => {
  console.log('Filtrer les données de', startDate.value, 'à', endDate.value)
  // Ici vous pourriez faire un appel API ou filtrer les données locales
}

// Initialisation des dates
onMounted(() => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  
  endDate.value = today.toISOString().split('T')[0]
  startDate.value = firstDay.toISOString().split('T')[0]
})
</script>