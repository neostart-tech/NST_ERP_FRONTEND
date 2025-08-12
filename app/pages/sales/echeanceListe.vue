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
          <i class="fas fa-add"></i> Ajouter un nouvel échéancier
        </NuxtLink>
      </div>
      
    </div>
    
    <table class="w-full border border-gray-300 rounded-lg text-sm mt-4">
      <thead class="bg-indigo-50 text-indigo-700  uppercase text-xs font-semibold">
        <tr>
          <th class="border border-gray-400 p-3 ">Client</th>
          <th class="border border-gray-400 p-3 text-center">Commande</th>
          <th class="border border-gray-400 p-3 text-center">Facture</th>
          <!-- <th class="border border-gray-400 p-3 text-center">Montant Payé</th>
          <th class="border border-gray-400 p-3 text-center">Montant Restant</th> -->
          <th class="border border-gray-400  p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-if="scheduleStore.echeancier.length === 0">
          <td colspan="6" class="p-4 text-center text-gray-500">
            Aucun échéancier disponible pour le moment.  
          </td>
        </tr> -->
        <tr v-for="schedule in scheduleStore.echeancier" :key="schedule.id" class="border-t hover:bg-gray-50 transition duration-100 ease-in-out">
          <td class="border border-gray-300 p-3 font-medium text-center  text-gray-800">{{schedule.invoice.order.client.last_name}} {{schedule.invoice.order.client.first_name_name}}</td>
          <td class="border border-gray-300 p-3 text-center text-gray-700">{{ schedule.invoice.order.id}}</td>
          <td class="border border-gray-300 p-3 text-center text-gray-700">{{ schedule.invoice.reference }}</td>
          <!-- <td class="p-3 text-center font-semibold text-green-700"> </td>
          <td class="p-3 text-center font-semibold text-red-600"></td> -->
          <td class="border border-gray-300 px-4 py-2 text-center space-x-3 flex justify-center">
            <div class="flex justify-center  relative group">
                <button @click="viewSchedule(schedule)" title="Voir" class="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                        <i class="fas fa-eye"></i>
                </button>
              <!-- <button @click="editSchedule(schedule)" title="Modifier l'échéancier"
                      class="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 ease-in-out">
                <i class="fas fa-edit"></i>
              </button> -->
              <button @click="deleteSchedule(schedule)" title="Supprimer" class="text-red-500 hover:red-blue-700 p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out">
                        <i class="fas fa-trash"></i>
                </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table> 
  </div>

  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl shadow-lg p-6 w-1/2 max-w-3xl relative">
    <h2 class="text-xl font-bold mb-4">Détails de l'échéancier</h2>

    <!-- Infos facture -->
<div class="bg-gray-100 p-4 rounded-lg">
  <h2 class="font-semibold text-lg mb-2">Détails de la Facture</h2>
  <p><strong>Référence facture :</strong> {{ selectedSchedule.invoice.reference }}</p>
  <p><strong>Date facture :</strong> {{ selectedSchedule.invoice.date }}</p>
  <p><strong>Total :</strong> {{ formatCurrency(selectedSchedule.invoice.total) }}</p>
  <p><strong>Client :</strong> 
    {{ selectedSchedule.invoice.order.client.last_name }} {{ selectedSchedule.invoice.order.client.first_name }}
  </p>
</div>

<!-- Infos commande -->
<div class="bg-gray-50 p-4 rounded-lg mt-4">
  <h2 class="font-semibold text-lg mb-2">Détails de la Commande</h2>
  <p><strong>Date :</strong> {{ selectedSchedule.invoice.order.date }}</p>
  <p><strong>Statut :</strong> {{ selectedSchedule.invoice.order.status }}</p>
</div>

<!-- Tableau des échéances -->
<div class="mt-6">
  <h3 class="font-semibold mb-2">Échéances</h3>
  <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden">
    <thead>
      <tr class="bg-gray-200 text-left">
        <th class="px-4 py-2 border border-gray-300">N°</th>
        <th class="px-4 py-2 border border-gray-300">Date</th>
        <th class="px-4 py-2 border border-gray-300">Montant</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(inst, index) in JSON.parse(selectedSchedule.installments)" :key="index" class="hover:bg-gray-50">
        <td class="px-4 py-2 border border-gray-300 text-center">{{ index + 1 }}</td>
        <td class="px-4 py-2 border border-gray-300">{{ inst.date }}</td>
        <td class="px-4 py-2 border border-gray-300">{{ formatCurrency(inst.amount) }}</td>
      </tr>
    </tbody>
  </table>
</div>


    <!-- Bouton fermer -->
    <div class="mt-6">
      <button
        type="button"
        @click="closeModal"
        class="px-4 py-2 rounded bg-blue-200 text-blue-800 hover:bg-blue-600 hover:text-white transition"
      >
        Fermer
      </button>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useScheduleStore } from '#imports'
import { onMounted } from 'vue'
const schedule = ref([])
const selectedSchedule=ref()
const showModal=ref(false)

const scheduleStore=useScheduleStore()
onMounted(()=>{
  scheduleStore.fetchSchedule()
})
//Afficher les details de chaque echeancier
function viewSchedule(schedule){
  selectedSchedule.value=schedule
  showModal.value=true
}
function closeModal(){
  showModal.value=false
  selectedSchedule.value=null
}



const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(value);
}

</script>