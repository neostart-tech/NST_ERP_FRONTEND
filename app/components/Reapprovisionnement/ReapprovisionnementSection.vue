<template>
  <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-200 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold text-blue-700 mb-6">Réapprovisionnement</h2>

    <form @submit.prevent="submitReapprovisionnement" class="space-y-4">

      <!-- Sélection du produit -->
      <div>
        <label for="product_id" class="block text-sm font-medium text-gray-700">Produit</label>
        <select
          v-model="form.product_id"
          id="product_id"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="" disabled>-- Sélectionner un produit --</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} (Stock actuel : {{ product.current_stock }})
          </option>
        </select>
      </div>

      <!-- Numéro de lot -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Numéro de lot</label>
        <input
          type="text"
          v-model="form.batch_number"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Ex: LOT2025A"
          required
        />
      </div>

      <!-- Numéro de série -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Numéro de série</label>
        <input
          type="text"
          v-model="form.serial_number"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Ex: SN-445-A78"
        />
      </div>

      <!-- Quantité -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Quantité</label>
        <input
          type="number"
          v-model="form.quantity"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
          min="1"
        />
      </div>

      <!-- Coût de revient unitaire -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Coût de revient unitaire</label>
        <input
          type="number"
          v-model="form.cost_of_return_per_unit"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
          min="0"
          step="0.01"
        />
      </div>

      <!-- Date d’expiration -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Date d’expiration</label>
        <input
          type="date"
          v-model="form.expiration_date"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <!-- Localisation -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Localisation</label>
        <input
          type="text"
          v-model="form.location"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Ex: Entrepôt A1"
        />
      </div>

      <!-- Bouton Soumettre -->
      <div class="pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
        >
          {{ loading ? 'Traitement...' : 'Enregistrer le réapprovisionnement' }}
        </button>
      </div>
    </form>

    <!-- Message de succès -->
    <div v-if="successMessage" class="mt-4 text-green-600 font-medium">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({
  product_id: '',
  batch_number: '',
  serial_number: '',
  quantity: 1,
  cost_of_return_per_unit: 0.0,
  expiration_date: '',
  location: '',
})

const products = ref([])
const loading = ref(false)
const successMessage = ref('')

const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products') // à adapter selon ta route
    products.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
  }
}

const submitReapprovisionnement = async () => {
  loading.value = true
  successMessage.value = ''
  try {
    await axios.post('/api/replenishment', form.value)
    successMessage.value = 'Réapprovisionnement enregistré avec succès.'
    // Réinitialisation du formulaire
    form.value = {
      product_id: '',
      batch_number: '',
      serial_number: '',
      quantity: 1,
      cost_of_return_per_unit: 0.0,
      expiration_date: '',
      location: '',
    }
    fetchProducts() // Met à jour le stock affiché
  } catch (error) {
    console.error('Erreur lors du réapprovisionnement:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Utilise Tailwind CSS - aucun style spécifique nécessaire */
</style>