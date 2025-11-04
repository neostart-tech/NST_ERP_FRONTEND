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
const cancel = () => {
  router.push('/sales')
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>