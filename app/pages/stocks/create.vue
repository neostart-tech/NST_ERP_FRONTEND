<template>
  <div class="max-w-6xl mx-auto">
    <PageHeader
      title="Créer un Produit"
      subtitle="Ajoutez un nouveau produit à votre inventaire"
      :stats="[
        { label: 'Étape 1', color: 'bg-blue-400' },
        { label: 'Étape 2', color: 'bg-green-400' }
      ]"
    />

    <div class="max-w-4xl mx-auto mt-10 bg-white p-8 shadow-md rounded-xl">
      <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">Créer un Produit</h1>

    <!-- Étape 1 -->
    <form v-if="step === 1" @submit.prevent="submitStep1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="font-semibold">Nom du produit</label>
          <input type="text" id="name" v-model="formStep1.name" class="input" required />
        </div>

        <div>
          <label for="reference" class="font-semibold">Référence</label>
          <input type="text" id="reference" v-model="formStep1.reference" class="input" required />
        </div>

        <div class="md:col-span-2">
          <label for="description" class="font-semibold">Description</label>
          <textarea id="description" v-model="formStep1.description" class="input"></textarea>
        </div>

        <div>
          <label for="type" class="font-semibold">Type</label>
          <input type="text" id="type" v-model="formStep1.type" class="input" />
        </div>

        <div>
          <label for="brand" class="font-semibold">Marque</label>
          <input type="text" id="brand" v-model="formStep1.brand" class="input" />
        </div>

        <div>
          <label for="model" class="font-semibold">Modèle</label>
          <input type="text" id="model" v-model="formStep1.model" class="input" />
        </div>
      </div>

      <div class="mt-6 text-right">
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Suivant
        </button>
      </div>
    </form>

    <!-- Étape 2 -->
    <form v-else @submit.prevent="submitStep2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="unit_price_purchase" class="font-semibold">Prix d'achat unitaire</label>
          <input type="number" step="0.01" v-model="formStep2.unit_price_purchase" class="input" />
        </div>

        <div>
          <label for="unit_price_sale" class="font-semibold">Prix de vente unitaire</label>
          <input type="number" step="0.01" v-model="formStep2.unit_price_sale" class="input" />
        </div>

        <div>
          <label for="current_stock" class="font-semibold">Stock actuel</label>
          <input type="number" v-model="formStep2.current_stock" class="input" />
        </div>

        <div>
          <label for="min_stock_alert" class="font-semibold">Seuil d'alerte stock</label>
          <input type="number" v-model="formStep2.min_stock_alert" class="input" />
        </div>

        <div>
          <label for="min_sale_price_company" class="font-semibold">Prix de vente min</label>
          <input type="number" step="0.01" v-model="formStep2.min_sale_price_company" class="input" />
        </div>

        <div>
          <label for="max_sale_price_company" class="font-semibold">Prix de vente max</label>
          <input type="number" step="0.01" v-model="formStep2.max_sale_price_company" class="input" />
        </div>
      </div>

      <div class="mt-6 flex justify-between">
        <button type="button" @click="step = 1" class="text-gray-600 hover:underline">Retour</button>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Enregistrer</button>
      </div>
    </form>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import PageHeader from '~/app/components/ui/PageHeader.vue'

const router = useRouter()

const step = ref(1)
const productId = ref(null)

const formStep1 = ref({
  name: '',
  reference: '',
  description: '',
  type: '',
  brand: '',
  model: ''
})

const formStep2 = ref({
  unit_price_purchase: '',
  unit_price_sale: '',
  current_stock: '',
  min_stock_alert: '',
  min_sale_price_company: '',
  max_sale_price_company: ''
})

const submitStep1 = async () => {
  try {
    const response = await axios.post('/api/products-step1', formStep1.value)
    productId.value = response.data.id
    step.value = 2
  } catch (error) {
    console.error(error)
    alert('Erreur lors de l’envoi de l’étape 1')
  }
}

const submitStep2 = async () => {
  try {
    await axios.put(`/api/products-step2/${productId.value}`, formStep2.value)
    alert('Produit créé avec succès !')
    router.push('/products') // Redirection après création
  } catch (error) {
    console.error(error)
    alert('Erreur lors de l’envoi de l’étape 2')
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
