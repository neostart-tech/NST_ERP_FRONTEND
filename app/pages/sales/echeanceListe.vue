<template>
  <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
    <div class="border-b pb-4 mb-4">
      <h1 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
        <i class="fas fa-hand-sparkles"></i> Bienvenue ! Vos Échéanciers
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-indigo-50 p-5 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-indigo-700">Total Échéanciers</p>
          <p class="text-2xl font-bold text-indigo-800"></p>
        </div>
        <i class="fas fa-clipboard-list text-4xl text-indigo-400"></i>
      </div>

      <div class="bg-blue-50 p-5 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-blue-700">Montant Total Dû</p>
          <p class="text-2xl font-bold text-blue-800"></p>
        </div>
        <i class="fas fa-money-bill-wave text-4xl text-blue-400"></i>
      </div>

      <div class="bg-green-50 p-5 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-green-700">Montant Total Payé</p>
          <p class="text-2xl font-bold text-green-800"></p>
        </div>
        <i class="fas fa-check-circle text-4xl text-green-400"></i>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class=" flex items-end">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-table"></i> Vue d'ensemble des échéances
        </h2>     
      </div>
      <div class="flex justify-end mt-6">
        <NuxtLink :to="AppUrl.SCHEDULE" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition duration-150 ease-in-out">
          <i class="fas fa-plus-circle"></i> Ajouter un nouvel échéancier
        </NuxtLink>
      </div>
      
    </div>
    
    <table class="w-full border border-gray-300 rounded-lg text-sm mt-4">
      <thead class="bg-indigo-50 text-indigo-700  uppercase text-xs font-semibold">
        <tr>
          <th class="p-3 ">Client</th>
          <th class="p-3 text-center">Commande</th>
          <th class="p-3 text-center">Facture</th>
          <th class="p-3 text-center">Montant Payé</th>
          <th class="p-3 text-center">Montant Restant</th>
          <th class="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="schedules.length === 0">
          <td colspan="6" class="p-4 text-center text-gray-500">
            Aucun échéancier disponible pour le moment.
            <button @click="addNewSchedule" class="ml-2 px-3 py-1 bg-indigo-500 text-white rounded-md text-xs hover:bg-indigo-600 transition">
              Créer un premier échéancier
            </button>
          </td>
        </tr>
        <tr v-else v-for="schedule in schedules" :key="schedule.id" class="border-t hover:bg-gray-50 transition duration-100 ease-in-out">
          <td class="p-3 font-medium text-gray-800">{{ schedule.client }}</td>
          <td class="p-3 text-center text-gray-700">{{ schedule.orderId }}</td>
          <td class="p-3 text-center text-gray-700">{{ schedule.invoiceId }}</td>
          <td class="p-3 text-center font-semibold text-green-700">
            {{ formatCurrency(schedule.paidAmount) }}
          </td>
          <td class="p-3 text-center font-semibold text-red-600">
            {{ formatCurrency(schedule.totalAmount - schedule.paidAmount) }}
          </td>
          <td class="p-3 text-center">
            <div class="flex justify-center gap-2">
              <button @click="viewScheduleDetails(schedule.id)" title="Voir les détails"
                      class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-150 ease-in-out">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editSchedule(schedule.id)" title="Modifier l'échéancier"
                      class="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 ease-in-out">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteSchedule(schedule.id)" title="Supprimer l'échéancier"
                      class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition duration-150 ease-in-out">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'



definePageMeta({ layout: 'default' })




const schedules = ref([
  {
    id: 'sch-001',
    client: 'Client A (Alpha)',
    orderId: 'CMD-001',
    invoiceId: 'FAC-001',
    totalAmount: 300000,
    paidAmount: 150000,
    numberOfInstallments: 3,
    
    installments: [
      { dueDate: '2025-08-05', amount: 100000, paid: 100000 },
      { dueDate: '2025-09-05', amount: 100000, paid: 50000 },
      { dueDate: '2025-10-05', amount: 100000, paid: 0 }
    ]
  },
  {
    id: 'sch-002',
    client: 'Client B (Beta)',
    orderId: 'CMD-002',
    invoiceId: 'FAC-002',
    totalAmount: 500000,
    paidAmount: 500000,
    numberOfInstallments: 2,
    installments: [
      { dueDate: '2025-07-10', amount: 250000, paid: 250000 },
      { dueDate: '2025-08-10', amount: 250000, paid: 250000 }
    ]
  },
  {
    id: 'sch-003',
    client: 'Client C (Gamma)',
    orderId: 'CMD-003',
    invoiceId: 'FAC-003',
    totalAmount: 100000,
    paidAmount: 0,
    numberOfInstallments: 1,
    installments: [
      { dueDate: '2025-07-20', amount: 100000, paid: 0 }
    ]
  },
  {
    id: 'sch-004',
    client: 'Client D (Delta)',
    orderId: 'CMD-004',
    invoiceId: 'FAC-004',
    totalAmount: 200000,
    paidAmount: 20000,
    numberOfInstallments: 2,
    installments: [
      { dueDate: '2025-08-15', amount: 100000, paid: 20000 },
      { dueDate: '2025-09-15', amount: 100000, paid: 0 }
    ]
  }
])


const totalDue = computed(() =>
  schedules.value.reduce((sum, schedule) => sum + schedule.totalAmount, 0)
)

const totalPaid = computed(() =>
  schedules.value.reduce((sum, schedule) => sum + schedule.paidAmount, 0)
)


const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0 // No decimal places for XOF
  }).format(value);
}

</script>