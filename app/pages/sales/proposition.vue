<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
    <h2 class="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
      <i class="fas fa-file-invoice"></i> Enregistrer une Facture Proforma
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Client -->
      <div class="flex items-center justify-between ">
        <!-- <div class="w-72"> -->
          <!-- <label for="client" class="block font-medium mb-1">Client</label>
          <select
            id="client"
            v-model="form.clientId"
            required
            class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500"
          > -->
            <!-- <option value="">-- Sélectionner un client --</option>
            <option v-for="client in clientStore.clients" :key="client.id" :value="client.id">
              {{client.first_name}} {{client.last_name}}
            </option> -->
            <!-- Options dynamiques ici -->
          <!-- </select>
        </div> -->
        <!-- Client -->
<div class="w-72 relative">
  <label for="client" class="block font-medium mb-1">Client</label>
  <input 
    id="client"
    type="text"
    v-model="searchClient"
    @input="filterClients"
    @focus="showClientSuggestions = true"
    placeholder="Rechercher un client..."
    class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500"
  />

  <!-- Suggestions -->
  <ul 
    v-if="showClientSuggestions && filteredClients.length" 
    class="absolute bg-white border border-gray-300 rounded w-full mt-1 shadow-lg z-10 max-h-40 overflow-auto"
  >
    <li 
      v-for="client in filteredClients" 
      :key="client.id" 
      @click="selectClient(client)" 
      class="p-2 hover:bg-indigo-100 cursor-pointer"
    >
      {{ client.first_name }} {{ client.last_name }}
    </li>
  </ul>
</div>
        <div class=" w-80 block font-medium mb-1">
          <div class="flex flex-col flex-1">
            <label for="object">Objet</label>
          <input type="text" v-model="form.object" id="object"  class="border border-gray-400 w-full rounded p-2 focus:ring-2 focus:ring-indigo-500">
          </div>
        </div>
      </div>

      <!-- Section Articles -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-lg">Articles</h3>
          <button
            type="button"
            @click="addItem"
            class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            <i class="fas fa-plus mr-1"></i> Ajouter un article
          </button>
        </div>

        <div v-if="form.items.length === 0" class="py-8 text-center border-2 border-dashed border-gray-300 rounded text-gray-500">
          Aucun article ajouté.
        </div>

        <!-- Liste des articles -->
        <div v-for="(item, idx) in form.items" :key="idx" class="border p-4 rounded mb-4 bg-gray-50">
          <div class="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <!-- Produit/Service -->
            <div class="md:col-span-2 relative">
            <label class="block text-sm font-medium mb-1">Désignation</label>
            <input type="text" v-model="item.productName" @input="filterArticles(item.productName)" @focus="showSuggestions = true" placeholder="Nom du produit ou article"
              class="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"/>

            <!-- Liste des suggestions -->
            <ul v-if="showSuggestions && filteredArticles.length" class="absolute bg-white border border-gray-300 rounded w-full mt-1 shadow-lg z-10">
              <li v-for="article in filteredArticles":key="article.id" @click="selectArticle(article, idx)"class="p-2 hover:bg-indigo-100 cursor-pointer">
                {{ article.label }} - {{ formatCurrency(article.price) }}
              </li>
            </ul>
          </div>
          <!-- Quantité -->
            <div>
              <label class="block text-sm font-medium mb-1">Quantité</label>
              <input type="number" v-model.number="item.quantity" min="1" required class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500"/>
            </div>

            <!-- Prix unitaire HT -->
            <div>
              <label class="block text-sm font-medium mb-1">Prix unitaire </label>
              <input type="number" v-model.number="item.unitPrice" min="3500" required class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500"/>
            </div>

            <!-- Total HT -->
            <div class="flex flex-col items-center">
              <label class="block text-sm font-medium mb-1">Total </label>
              <div class="bg-white border border-gray-300 rounded px-3 py-2 w-full text-center font-semibold">
                {{ formatCurrency(item.quantity * item.unitPrice) }}
              </div>
            </div>

            <!-- Supprimer -->
            <div class="flex justify-center">
              <button
                type="button"
                @click="removeItem(idx)"
                class="text-red-600 hover:text-red-800"
                title="Supprimer cet article"
              >
                <i class="fas fa-trash text-xl"></i>
                <!-- <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zM4 7h16" />
                </svg> -->

              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Totaux -->
      <div v-if="form.items.length > 0" class="bg-gray-100 p-4 rounded text-right space-y-1 font-semibold">
        <div>Total HT : {{ formatCurrency(totalHT) }}</div>
        <div>TVA (18%) : {{ formatCurrency(totalTVA) }}</div>
        <div class="text-indigo-700 text-lg font-bold">Total TTC : {{ formatCurrency(totalTTC) }}</div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-4 border-t border-gray-300">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          :disabled="form.items.length === 0"
        >
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '~/app/stores/sale/client'
import { useArticleStore } from '#imports'
import { useProformaStore } from '#imports'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'

const router = useRouter()

const form = ref({
  clientId: '',
  object:'',
  notes: '',
  items: [] // { productName, quantity, unitPrice }
})

// Ajouter un article
const addItem = () => {
  form.value.items.push({
    productName: '',
    quantity: 1,
    unitPrice: 0
  })
}

// Supprimer un article
const removeItem = (index) => {
  form.value.items.splice(index, 1)
}
const clientStore=useClientStore()
const articleStore=useArticleStore()
onMounted(()=> {
  clientStore.fetchClients()
  articleStore.fetchArticle()
})

const showSuggestions = ref(false)
const filteredArticles = ref([])
const filterArticles = (query) => {
  if (!query) {
    filteredArticles.value = []
    return
  }
  filteredArticles.value = articleStore.articles.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  )
}

const selectArticle = (article, idx) => {
  form.value.items[idx].productName = article.label
  form.value.items[idx].unitPrice = parseInt(article.price)
  showSuggestions.value = false
}


// Calculs totaux
const totalHT = computed(() =>
  form.value.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
)
const totalTVA = computed(() => totalHT.value * 0.18)
const totalTTC = computed(() => totalHT.value + totalTVA.value)

// Format monétaire
const formatCurrency = (amount) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })
}

// Retour à la page précédente
const goBack = () => {
  router.push(AppUrl.PROPO)
}

// // Simulation soumission (à remplacer par backend)
// const handleSubmit = () => {
//   alert('Proforma enregistrée avec succès ')
//   form.value = { clientId: '', notes: '', items: [] }
// }
// Gestion de la soumission du formulaire
const proformaStore=useProformaStore()
const handleSubmit = async () => {
  // Chargement
  //   Swal.fire({
  //     title: 'Enregistrement...',
  //     text: 'Veuillez patienter',
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading()
  //     }
  //   })
  const response = await proformaStore.addProforma(form.value);
  // alert('Proforma enregistrée avec succès ');
  Swal.fire({
    icon:'success',
    title:'Succès',
    text:'Proforma enregistrée avec succès',
    timer:2000,
    showConfirmButton:false ,
  }).then(()=>{
    router.push(AppUrl.INFOPROPO)
  })
  form.value = { clientId: '',object:'', items: [] }; // reset formulaire 
};
const searchClient = ref("")
const showClientSuggestions = ref(false)
const filteredClients = ref([])

// Filtrer les clients
const filterClients = () => {
  if (!searchClient.value) {
    filteredClients.value = []
    return
  }
  filteredClients.value = clientStore.clients.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchClient.value.toLowerCase())
  )
}

// Sélection d’un client
const selectClient = (client) => {
  form.value.clientId = client.id  // on stocke l'id pour l'enregistrement
  searchClient.value = `${client.first_name} ${client.last_name}` // affichage dans le champ
  showClientSuggestions.value = false
}

</script>
