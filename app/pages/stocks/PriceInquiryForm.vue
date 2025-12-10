<template>
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <h2 class="text-2xl font-bold mb-4 text-blue-700">Saisie d'une proposition de prix</h2>

    <form @submit.prevent="submitForm">
      <!-- Produit -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Produit</label>
        <select v-model="form.product_id" class="w-full mt-1 border rounded p-2">
          <option disabled value="">-- Sélectionner --</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      <!-- Fournisseur -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Fournisseur</label>
        <select v-model="form.supplier_id" class="w-full mt-1 border rounded p-2">
          <option disabled value="">-- Sélectionner --</option>
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }}
          </option>
        </select>
      </div>

      <!-- Prix proposé -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Prix proposé (FCFA)</label>
        <input type="number" v-model="form.unit_price" step="0.01" class="w-full mt-1 border rounded p-2" />
      </div>

      <!-- Conditions de paiement -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Conditions de paiement</label>
        <input type="text" v-model="form.payment_terms" class="w-full mt-1 border rounded p-2" />
      </div>

      <!-- Commentaires -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Commentaires</label>
        <textarea v-model="form.comments" class="w-full mt-1 border rounded p-2" rows="3"></textarea>
      </div>

      <!-- Soumettre -->
      <div class="text-right">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer
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
  supplier_id: '',
  unit_price: '',
  payment_terms: '',
  comments: '',
})

const products = ref([])
const suppliers = ref([])
const successMessage = ref('')

const fetchData = async () => {
  try {
    const [productsRes, suppliersRes] = await Promise.all([
      axios.get('/api/products'),
      axios.get('/api/suppliers'),
    ])
    products.value = productsRes.data
    suppliers.value = suppliersRes.data
  } catch (error) {
    console.error('Erreur chargement produits/fournisseurs', error)
  }
}

const submitForm = async () => {
  try {
    await axios.post('/api/price-inquiries', form.value)
    successMessage.value = 'Proposition enregistrée avec succès !'

    // Réinitialiser le formulaire
    form.value = {
      product_id: '',
      supplier_id: '',
      unit_price: '',
      payment_terms: '',
      comments: '',
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire', error)
  }
}

onMounted(fetchData)
</script>
