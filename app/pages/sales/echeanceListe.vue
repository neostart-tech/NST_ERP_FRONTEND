<template>
  <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center border-b pb-4 mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
        <i class="fas fa-hand-sparkles text-indigo-600"></i> Vos Échéanciers
      </h1>
      <NuxtLink :to="AppUrl.SCHEDULE" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-150 ease-in-out">
        <i class="fas fa-add"></i> Ajouter un nouvel échéancier
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-indigo-50 p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-indigo-700">Total Échéanciers</p>
          <p class="text-2xl font-bold text-indigo-800">{{ stats.totalSchedules }}</p>
        </div>
        <i class="fas fa-clipboard-list text-4xl text-indigo-400"></i>
      </div>

      <div class="bg-blue-50 p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-blue-700">Montant Total Dû</p>
          <p class="text-2xl font-bold text-blue-800">{{ formatCurrency(stats.totalDue) }}</p>
        </div>
        <i class="fas fa-money-bill-wave text-4xl text-blue-400"></i>
      </div>

      <div class="bg-green-50 p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-green-700">Montant Total Payé</p>
          <p class="text-2xl font-bold text-green-800">{{ formatCurrency(stats.totalPaid) }}</p>
        </div>
        <i class="fas fa-check-circle text-4xl text-green-400"></i>
      </div>
    </div>
    
    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <i class="fas fa-table"></i> Vue d'ensemble des échéances
    </h2> 
    
    <div class="bg-white shadow rounded-lg overflow-x-auto">
      <table class="w-full text-sm border border-gray-200">
        <thead class="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th class="border border-gray-200 p-3 text-center">Client</th>
            <th class="border border-gray-200 p-3 text-center">Facture</th>
            <th class="border border-gray-200 p-3 text-center">Montant Total</th>
            <th class="border border-gray-200 p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="scheduleStore.echeancier.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">
              Aucun échéancier disponible pour le moment.
            </td>
          </tr>
          <tr v-for="schedule in scheduleStore.echeancier" :key="schedule.id" class="border-t hover:bg-gray-50 transition duration-100 ease-in-out">
            <td class="p-3 border  text-center text-gray-800">{{schedule.invoice.order.client.last_name}} {{schedule.invoice.order.client.first_name}}</td>
            <td class="p-3 border text-center text-gray-700">{{ schedule.invoice.reference }}</td>
            <td class="p-3 border text-center font-semibold">{{ formatCurrency(schedule.invoice.total) }}</td>
            <td class="p-3 border text-center space-x-3 flex justify-center">
              <button @click="viewSchedule(schedule)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div> 
  </div>

  <div v-if="showModal && selectedSchedule" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-1/2 max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4 text-indigo-700">Détails de l'échéancier</h2>
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
        <i class="fas fa-times"></i>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-6">
        <p><strong>Référence facture :</strong> {{ selectedSchedule.invoice.reference }}</p>
        <p><strong>Client :</strong> {{ selectedSchedule.invoice.order.client.last_name }} {{ selectedSchedule.invoice.order.client.first_name }}</p>
        <p><strong>Total Facture :</strong> {{ formatCurrency(selectedSchedule.invoice.total) }}</p>
        <p><strong>Commande :{{ selectedSchedule.invoice.order.reference }}</strong> </p>
        <p><strong>Date de création :</strong> {{ formatDate(selectedSchedule.invoice.order.date) }}</p>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg mb-2">Échéances de paiement</h3>
        <table class="w-full text-sm border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 border border-gray-200">N°</th>
              <th class="p-2 border border-gray-200">Date</th>
              <th class="p-2 border border-gray-200 text-center">Montant</th>
              <th class="p-2 border border-gray-200 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(installment, index) in JSON.parse(selectedSchedule.installments)" :key="index" class="hover:bg-gray-50">
              <td class="p-2 border border-gray-200 text-center">{{ index + 1 }}</td>
              <td class="p-2 border border-gray-200">{{ formatDate(installment.date) }}</td>
              <td class="p-2 border border-gray-200 text-center">{{ formatCurrency(installment.amount) }}</td>
              <td class="p-2 border border-gray-200 text-center">
                 <span :class="installmentStatusClass(installment.paid)" class="px-2 py-1 rounded text-xs font-bold">
                    {{ installmentStatus(installment.paid) }}
                 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 text-right">
        <button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useScheduleStore } from '#imports'
import Swal from 'sweetalert2'

const selectedSchedule = ref(null)
const showModal = ref(false)

const scheduleStore = useScheduleStore()

onMounted(() => {
  scheduleStore.fetchSchedule()
})

const stats = computed(() => {
  const allSchedules = scheduleStore.echeancier
  let totalDue = 0
  let totalPaid = 0
  
  allSchedules.forEach(schedule => {
    const installments = JSON.parse(schedule.installments)
    installments.forEach(inst => {
      totalDue += inst.amount
      if (inst.paid) {
        totalPaid += inst.amount
      }
    })
  })

  return {
    totalSchedules: allSchedules.length,
    totalDue,
    totalPaid,
  }
})

function viewSchedule(schedule) {
  selectedSchedule.value = schedule
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedSchedule.value = null
}



const installmentStatus = (isPaid) => {
  return isPaid ? 'Payé' : 'En attente'
}

const installmentStatusClass = (isPaid) => {
  return isPaid ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(value);
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
}
</script>