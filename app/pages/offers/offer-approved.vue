<template>
    <div>
      <h1>Appels d'offres en attente de validation</h1>
      <ul>
        <li v-for="offer in pendingOffers" :key="offer.id" class="flex justify-between items-center border p-2 my-1 rounded">
          <div>
            <h2 class="font-bold">{{ offer.title }}</h2>
            <p>{{ offer.description }}</p>
            <small>Entreprise: {{ offer.enterprise.name }}</small>
          </div>
          <div>
            <button @click="approve(offer.id)"
                    class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Valider
            </button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useAlert } from '@/composables/useAlert' // si tu utilises un alert
  
  const pendingOffers = ref([])
  
  const fetchPendingOffers = async () => {
    const { data } = await axios.get('/api/offers/pending')
    pendingOffers.value = data.data
  }
  
  const approve = async (id) => {
    try {
      await axios.patch(`/api/offers/${id}/approve`)
      useAlert().showAlert("Offre validée avec succès", "success")
      fetchPendingOffers() // Recharge la liste après validation
    } catch (error) {
      useAlert().showAlert("Erreur lors de la validation", "error")
    }
  }
  
  onMounted(fetchPendingOffers)
  </script>
  