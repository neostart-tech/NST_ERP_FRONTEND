<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <!-- Pie chart : Paiements -->
    <div class="bg-white p-4 rounded shadow">
      <h3 class="text-lg font-semibold mb-2">Répartition Paiements</h3>
      <PieChart :chart-data="paymentChartData" :chart-options="chartOptions"/>
    </div>

    <!-- Bar chart : Clients endettés -->
    <div class="bg-white p-4 rounded shadow">
      <h3 class="text-lg font-semibold mb-2">Montant dû par client</h3>
      <BarChart :chart-data="debtChartData" :chart-options="chartOptions"/>
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
