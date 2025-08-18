<template>
  <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Enregistrer une commande</h2>

    <!-- Sélection Proforma -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Facture Pro Forma <span class="text-yellow-300">*</span>
      </label>
      <select v-model="selectedQuote" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500">
        <option value="">-- Aucune sélection --</option>
        <option
          v-for="proforma in proformaStore.proforma"
          :key="proforma.id"
          :value="proforma.id"
        >
          {{ proforma.reference }} : {{ proforma.client.last_name }} {{ proforma.client.first_name }} - {{ proforma.object }}
        </option>
      </select>
    </div>

    <!-- Sélection Client (visible si pas de proforma) -->
    <div v-if="!selectedQuote">
      <label class="block text-sm font-medium text-gray-700 mb-1">Client <span class="text-red-500">*</span></label>
      <select v-model="selectedClient" class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500">
        <option value="">-- Sélectionner un client --</option>
        <option v-for="client in clientStore.clients" :key="client.id" :value="client.id">
          {{ client.last_name }} {{ client.first_name }}
        </option>
      </select>
      <p v-if="clientError" class="text-red-500 text-sm mt-1">{{ clientError }}</p>
    </div>

    <!-- Fichier bon de commande -->
    <div class="border border-dashed border-gray-300 rounded-lg p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Joindre le bon de commande (optionnel)</label>
      <div class="flex items-center gap-4">
        <label class="cursor-pointer">
          <span class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">Sélectionner un fichier</span>
          <input type="file" @change="handleFileUpload" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" />
        </label>
        <span v-if="fileName" class="text-sm text-gray-600">
          {{ fileName }}
          <button @click="removeFile" class="ml-2 text-red-500 font-bold">X</button>
        </span>
      </div>
    </div>

    <!-- Tableau Articles -->
    <div>
      <h3 class="text-lg font-semibold mb-3">Articles</h3>
      <table class="w-full border border-gray-300 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="border px-2 py-1 text-center">Désignation *</th>
            <th class="border px-2 py-1 text-center">Qté *</th>
            <th class="border px-2 py-1 text-center">PU (FCFA) *</th>
            <th class="border px-2 py-1 text-center">Total (FCFA)</th>
            <th class="border px-2 py-1 text-center">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.items" :key="index">
            <td class="border relative">
              <input
                type="text"
                v-model="item.name"
                @input="filterArticles(index)"
                @blur="validateArticle(index)"
                class="w-full text-center"
                placeholder="Saisir un article..."
                
              />
              <ul v-if="item.showSuggestions" class="absolute bg-white border border-gray-300 w-full z-50 max-h-40 overflow-auto">
                <li
                  v-for="article in item.filteredArticles"
                  :key="article.id"
                  @click="selectArticle(index, article)"
                  class="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {{ article.label }}
                </li>
              </ul>
             
            </td>
            <td class="border">
              <input
                type="number"
                min="1"
                v-model.number="item.qty"
                class="w-full text-center"
                
              />
            </td>
            <td class="border">
              <input
                type="number"
                min="0"
                v-model.number="item.price"
                class="w-full text-center"
                
              />
            </td>
            <td class="border text-center">{{ (item.qty * item.price) }}</td>
            <td class="border text-center">
              <button @click="removeItem(index)" class="text-red-500" :disabled="selectedQuote !== ''" title="Supprimer cet article">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        @click="addItem"
        class="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
       ><i class="fas fa-add"></i> Ajouter</button>
      <p v-if="itemsError" class="text-red-500 mt-2">{{ itemsError }}</p>
    </div>

    <!-- Totaux -->
    <div class="p-4 rounded-lg text-right">
      <p>Sous-total : <span class="font-semibold">{{ formatCurrency(subtotal) }} FCFA</span></p>
      <p>TVA ({{ taux }}%) : <span class="font-semibold">{{ formatCurrency(tvaAmount) }}</span></p>
      <p class="text-lg font-bold">Total TTC : {{ formatCurrency(total)}}</p>
    </div>

    <!-- Boutons -->
    <div class="flex justify-end gap-4">
      <button @click="resetForm" class="px-4 py-2 bg-gray-200 rounded">Annuler</button>
      <button
        @click="submitOrder"
        :disabled="isSubmitting"
        class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {{ isSubmitting ? 'En cours...' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useClientStore } from '#imports'
import { useProformaStore } from '#imports'
import { useArticleStore } from '#imports'
import { useOrderStore } from '#imports'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const selectedQuote = ref('')
const selectedClient = ref('')
const fileName = ref('')
const file = ref(null)
const isSubmitting = ref(false)
const clientError = ref('')
const itemsError = ref('')

const taux = 18

const proformaStore = useProformaStore()
const clientStore = useClientStore()
const articleStore = useArticleStore()
const orderStore = useOrderStore()
const router = useRouter()


const form = ref({
  items: [{ name: '', qty: 1, price: 0, article_id: null, showSuggestions: false, filteredArticles: [], error: '' }]
})

// Charge les données à l'ouverture
onMounted(() => {
  proformaStore.fetchProformaValidate()
  clientStore.fetchClients()
  articleStore.fetchArticle()
})

// Quand on change la proforma, on charge ses articles et le client
watch(selectedQuote, (newVal) => {
  if (!newVal) {
    // Reset form items + client
    form.value.items = [{ name: '', qty: 1, price: 0, article_id: null, showSuggestions: false, filteredArticles: [], error: '' }]
    selectedClient.value = ''
    clientError.value = ''
    itemsError.value = ''
    return
  }

  const proforma = proformaStore.proforma.find(p => p.id === newVal)
  if (proforma && proforma.articles && proforma.client) {
    selectedClient.value = proforma.client.id // on set client (hidden)
    form.value.items = proforma.articles.map(article => ({
      name: article.label,
      qty: article.pivot.quantity,
      price: article.pivot.unit_price,
      article_id: article.id,
      showSuggestions: false,
      filteredArticles: [],
      error: ''
    }))
    clientError.value = ''
    itemsError.value = ''
  }
})

// Filtrer les articles pour autocomplétion
const filterArticles = (index) => {
  const search = form.value.items[index].name.toLowerCase()
  if (search.length > 0) {
    form.value.items[index].filteredArticles = articleStore.articles.filter(a =>
      a.label.toLowerCase().includes(search)
    )
    form.value.items[index].showSuggestions = true
  } else {
    form.value.items[index].showSuggestions = false
  }
}


// Sélectionner un article dans les suggestions
const selectArticle = (index, article) => {
  form.value.items[index].name = article.label
  form.value.items[index].article_id = article.id
  form.value.items[index].price = article.price
  form.value.items[index].showSuggestions = false
  form.value.items[index].error = ''
}

// Validation automatique sur blur (recherche exacte)
const validateArticle = (index) => {
  const inputName = form.value.items[index].name.trim().toLowerCase()
  const found = articleStore.articles.find(a => a.label.toLowerCase() === inputName)
  if (found) {
    form.value.items[index].article_id = found.id
    form.value.items[index].price = found.price
    form.value.items[index].error = ''
  } else {
    form.value.items[index].article_id = null
    form.value.items[index].error = 'Article invalide'
  }
}

// Ajouter une ligne d’article vide
const addItem = () => {
  form.value.items.push({ name: '', qty: 1, price: 0, article_id: null, showSuggestions: false, filteredArticles: [], error: '' })
}

// Supprimer une ligne d’article
const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

// Reset complet du formulaire
const resetForm = () => {
  selectedQuote.value = ''
  selectedClient.value = ''
  fileName.value = ''
  file.value = null
  clientError.value = ''
  itemsError.value = ''
  form.value.items = [{ name: '', qty: 1, price: 0, article_id: null, showSuggestions: false, filteredArticles: [], error: '' }]
}

// Gestion du fichier (UI uniquement)
const handleFileUpload = (e) => {
  const selectedFile = e.target.files[0]
  if (selectedFile) {
    fileName.value = selectedFile.name
    file.value = selectedFile
  }
}

const removeFile = () => {
  fileName.value = ''
  file.value = null
}

function formatCurrency(amount){
  return new Intl.NumberFormat('fr-FR',{
    style:'currency',
    currency:'XOF',
  }).format(amount)
}

// Calculs des totaux
const subtotal = computed(() =>
  form.value.items.reduce((acc, i) => acc + (i.qty * i.price), 0)
)
const tvaAmount = computed(() => subtotal.value * taux / 100)
const total = computed(() => subtotal.value + tvaAmount.value)

// Validation et soumission
const submitOrder = async () => {
  if (isSubmitting.value) return

  clientError.value = ''
  itemsError.value = ''

  // Validation client obligatoire si pas de proforma
  if (!selectedQuote.value && !selectedClient.value) {
    // alert('Veuillez sélectionner un client.')
    Swal.fire({
      icon:'error',
      title:'Attention',
      text:'Veuillez sélectionner un client ou une proforma.'
    })
    return
  }

  // Validation articles
  if (form.value.items.length === 0) {
    // itemsError.value = 'Veuillez ajouter au moins un article.'
    Swal.fire({
      icon:'warning',
      title:'Erreur',
      text:'Veuillez ajouter au moins un article.'
    })
    return
  }

  for (const item of form.value.items) {
    if (!item.article_id || item.error) {
      // alert('Veuillez ajouter au moins un article.')
      Swal.fire({
      icon:'warning',
      title:'Erreur',
      text:'Veuillez ajouter au moins un article.'
    })
      
    return
    }
    if (item.qty < 1) {
      // alert('Quantité doit etre au moins 1.')
       Swal.fire({
      icon:'warning',
      title:'Erreur',
      text:'Quantité doit etre positive (>1).'
    })
      
    return
    }
    if (item.price < 0) {
      // alert('Le prix doit etre positif')
      Swal.fire({
      icon:'warning',
      title:'Erreur',
      text:'Le prix doit etre positive (>1).'
      })
    return
    }
  }

  isSubmitting.value = true

  const payload = {
    client_id: selectedClient.value || null,
    proforma_id: selectedQuote.value || null,
    date: new Date().toISOString().split('T')[0],
    comment: form.value.notes || '',
    items: form.value.items.map(i => ({
      article_id: i.article_id,
      quantity: i.qty,
      unit_price: i.price
    }))
  }

  try {
    // Chargement
    // Swal.fire({
    //   title: 'Enregistrement...',
    //   text: 'Veuillez patienter',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })
    const response = await orderStore.addOrder(payload)
    console.log('Commande enregistrée:', response)
    // alert('Votre commande a été enregistrée avec succès !')
    Swal.fire({
      icon:'success',
      title:'Succès',
      text:'Votre commande a été enregistrée avec succès !',
      timer:2000,
      showConfirmButton:false

    })
     router.push(AppUrl.ORDERINFO)  
    resetForm()
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    //  alert('Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.')
    Swal.fire({
      icon:'error',
      title:'Erreur',
      text:error
      })
  } finally {
    isSubmitting.value = false
  }
}
</script>
