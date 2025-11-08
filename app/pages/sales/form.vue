<template>

    <main class="flex-1 p-6 bg-gray-50 min-h-screen">
      <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <!-- En-tête -->
        <div class="px-6 py-5 border-b border-gray-100 bg-white">
          <h1 class="text-2xl font-bold text-gray-800">
            {{ salespersonId ? 'Modifier le commercial' : 'Créer un nouveau commercial' }}
          </h1>
        </div>

        <!-- Formulaire -->
        <form class="space-y-6 p-6" @submit.prevent="submitForm">
          <!-- Section Informations personnelles -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Informations personnelles</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  id="first-name"
                  v-model="salesperson.firstName"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  id="last-name"
                  v-model="salesperson.lastName"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>

              <div class="md:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="salesperson.email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>

              <div class="md:col-span-2">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="salesperson.phone"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Section Paramètres commerciaux -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Paramètres commerciaux</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="commission-rate" class="block text-sm font-medium text-gray-700 mb-1">Taux de commission (%)</label>
                <input
                  type="number"
                  id="commission-rate"
                  v-model="salesperson.commissionRate"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="monthly-target" class="block text-sm font-medium text-gray-700 mb-1">Objectif mensuel (€)</label>
                <input
                  type="number"
                  id="monthly-target"
                  v-model="salesperson.monthlyTarget"
                  min="0"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>

              <div class="md:col-span-2">
                <label for="clients" class="block text-sm font-medium text-gray-700 mb-1">Clients attribués</label>
                <select
                  id="clients"
                  v-model="salesperson.assignedClients"
                  multiple
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                >
                  <option v-for="client in availableClients" :key="client.id" :value="client.id">
                    {{ client.name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Maintenez Ctrl (Windows) ou Commande (Mac) pour sélectionner plusieurs clients</p>
              </div>

              <div>
                <label for="bonus" class="block text-sm font-medium text-gray-700 mb-1">Prime mensuelle (€)</label>
                <input
                  type="number"
                  id="bonus"
                  v-model="salesperson.monthlyBonus"
                  min="0"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="commission-type" class="block text-sm font-medium text-gray-700 mb-1">Type de commission</label>
                <select
                  id="commission-type"
                  v-model="salesperson.commissionType"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                >
                  <option value="percentage">Pourcentage des ventes</option>
                  <option value="fixed">Montant fixe par vente</option>
                  <option value="tiered">Tranches de commission</option>
                </select>
              </div>

              <div v-if="salesperson.commissionType === 'tiered'" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tranches de commission</label>
                <div class="space-y-3">
                  <div v-for="(tier, index) in salesperson.commissionTiers" :key="index" class="flex items-center space-x-2">
                    <input
                      type="number"
                      v-model="tier.minAmount"
                      placeholder="Montant min"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                    <span class="text-gray-500">-</span>
                    <input
                      type="number"
                      v-model="tier.maxAmount"
                      placeholder="Montant max"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                    <input
                      type="number"
                      v-model="tier.rate"
                      placeholder="%"
                      step="0.1"
                      class="w-20 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                    <button
                      type="button"
                      @click="removeTier(index)"
                      class="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addTier"
                    class="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Ajouter une tranche
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="cancel"
              class="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {{ salespersonId ? 'Mettre à jour' : 'Créer le commercial' }}
            </button>
          </div>
        </form>
      </div>
    </main>

</template>

<script setup>
import DefaultLayout from '@/layouts/default.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const salespersonId = route.query.id

// Données disponibles
const availableClients = ref([
  { id: 1, name: 'Client 1' },
  { id: 2, name: 'Client 2' },
  { id: 3, name: 'Client 3' },
  { id: 4, name: 'Client 4' },
  { id: 5, name: 'Client 5' }
])

// Données du commercial
const salesperson = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  commissionRate: 5,
  monthlyTarget: 10000,
  monthlyBonus: 0,
  commissionType: 'percentage',
  commissionTiers: [
    { minAmount: 0, maxAmount: 10000, rate: 5 },
    { minAmount: 10001, maxAmount: 50000, rate: 7 },
    { minAmount: 50001, maxAmount: null, rate: 10 }
  ],
  assignedClients: []
})

// Charger les données si en mode édition
onMounted(() => {
  if (salespersonId) {
    // Simuler le chargement des données depuis une API
    setTimeout(() => {
      Object.assign(salesperson, {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '+228 90 12 34 56',
        commissionRate: 5,
        monthlyTarget: 125000,
        assignedClients: [1, 3]
      })
    }, 300)
  }
})

// Soumission du formulaire
const submitForm = () => {
  console.log('Salesperson data:', salesperson)
  alert(salespersonId ? 'Commercial mis à jour avec succès!' : 'Commercial créé avec succès!')
  router.push('/sales')
}

// Annulation
const addTier = () => {
  const lastTier = [...salesperson.commissionTiers].pop()
  const newMin = lastTier ? lastTier.maxAmount + 1 : 0
  salesperson.commissionTiers.push({
    minAmount: newMin,
    maxAmount: null,
    rate: lastTier ? lastTier.rate : 5
  })
}

const removeTier = (index) => {
  if (salesperson.commissionTiers.length > 1) {
    salesperson.commissionTiers.splice(index, 1)
  }
}

const cancel = () => {
  router.push('/sales')
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
