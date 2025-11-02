<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Enregistrer un paiement</h2>
        
        <!-- Contenu du modal de paiement -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Échéance</label>
            <select class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option v-for="(inst, index) in installments" :key="index" :value="index">
                Échéance #{{ index + 1 }} - {{ formatDate(inst.date) }} - {{ formatCurrency(inst.amount) }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Montant</label>
            <input type="number" class="w-full border border-gray-300 rounded-md px-3 py-2">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
            <input type="date" class="w-full border border-gray-300 rounded-md px-3 py-2">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
            <select class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Virement</option>
              <option>Espèces</option>
              <option>Chèque</option>
              <option>Carte</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button @click="submitPayment" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  installments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function submitPayment() {
  // Ici vous devrez collecter les données du formulaire
  const paymentData = {
    installmentIndex: 0,
    amount: 0,
    paymentDate: new Date().toISOString(),
    method: 'Virement'
  }
  emit('submit', paymentData)
}
</script>