<template>
  <div class="max-w-4xl mx-auto bg-indigo-50 shadow-lg rounded-lg p-6 space-y-6">
    <h1 class="text-2xl font-bold mb-4 flex items-center gap-2">
      <i class="fas fa-file-invoice"></i> Générer une facture
    </h1>

     <div class="flex items-center space-x-[250px]">
        <!-- Commande -->
         <div class="w-80 ">
          <label class="block mb-1">Choisir la commande <span class="text-red-700">*</span></label>
          <select v-model="selectedCommande"class="text-center border border-black w-full p-2 rounded-lg">
          <option value="">Sélectionner la commande</option>
          <option v-for="(cmd,index) in orderStoreValidate.commande" :key="cmd.id" :value="cmd.id">
           {{ 'CMD ' + String(orderStore.commande.length - index).padStart(3, '0') }} - {{ cmd.client.last_name }} {{ cmd.client.first_name }}
          </option>
        </select>

        </div>
        <!-- Sélection type de facture -->
        <div class="w-80">
          <label class="block font-semibold mb-2">Type de facture <span class="text-red-700">*</span></label>
          <select v-model="factureType" class=" text-center border border-black w-full p-2 rounded-lg">
            <option value="">Choisir le type de facture</option>
            <option value="definitive">Facture Définitive</option>
            <option value="acompte">Facture Acompte</option>
          </select>
        </div>
     </div>
    <!-- Formulaire dynamique -->
    <div v-if="factureType && selectedCommande ">
          <!-- Dates -->
      <div class="grid grid-cols-2 w-1/3 mt-3">
        <div>
          <label>Date d’émission</label>
          <input type="date" v-model="form.date" class="border border-gray-400 w-full p-2 rounded-lg" />
        </div>
      </div>

      <!-- Articles -->
      <div class="mt-4">
        <h3 class="font-semibold mb-2">Articles</h3>
        <table class="border border-gray-400 w-full text-sm">
          <thead>
            <tr class="bg-gray-200">
              <th class="border px-2 text-center">Désignation</th>
              <th class="border px-2 text-center">Qté</th>
              <th class="border px-2 text-center">PU</th>
              <th class="border px-2 text-center">Total</th>
              <th class="border px-2 text-center">Supp</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in form.items" :key="index" >
            <td><input v-model="item.name" class="border border-gray-300 w-full" /></td>
            <td><input v-model.number="item.qty" type="number" class="border w-full text-center" /></td>
            <td><input v-model.number="item.price" type="number" class="border w-full text-center" /></td>
            <td class="text-center">{{ (item.qty * item.price).toFixed(2) }}FCFA</td>
            <td class="text-center">
              <button class="text-red-500" @click="removeItem(index)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>

        </table>
        <button @click="addItem" class="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg">
          <i class="fas fa-plus"></i> Ajouter
        </button>
      </div>
       <div v-if="factureType ==='definitive'" class="flex flex-col items-center ">
          <label class="block mb-1 font-semibold">Remise (%)</label>
          <input type="number" v-model.number="remisePercent"  max="100" class="border p-2 rounded w-24 text-center" />
      </div>

      <!-- Cas spécifique : Acompte -->
      <div v-if="factureType === 'acompte'" class=" flex  space-x-14 items-center mt-4 bg-yellow-50 p-3 rounded-lg">
        <div class="flex flex-col items-center">
          <label class="block mb-1 font-semibold">Pourcentage d’acompte (%)</label>
          <input type="number" v-model.number="acomptePercent"  max="100" class="border p-2 rounded w-24 text-center" />
        </div>
        <div class="flex flex-col items-center ">
          <label class="block mb-1 font-semibold">Remise (%)</label>
          <input type="number" v-model.number="acompteRemisePercent"  max="100" class="border p-2 rounded w-24 text-center" />
        </div>
      </div>

      <!-- Totaux -->
      <div class="text-right space-y-2 mt-4">
        <!-- Si Définitive -->
        <div v-if="factureType === 'definitive'">
          <p class="text-lg font-bold">Total HT : <strong>{{ subtotal.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg font-bold">Remise({{ remisePercent }}%): <strong>{{ totalRemise.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg font-bold">Total Net HT : <strong>{{ totalNet.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg font-bold">TVA ({{ tvaRate }}%) : <strong>{{ tvaAmount.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg font-bold">Total TTC : {{ total.toFixed(2) }}FCFA</p>
        </div>

        <!-- Si Acompte -->
        <div v-if="factureType === 'acompte'">
          <p class="text-lg ">Total HT : <strong>{{ subtotal.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg ">Remise HT({{ acompteRemisePercent }}%) : <strong>{{ acompteRemise.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg ">Total HT Net : <strong>{{acompteNet.toFixed(2) }}</strong>FCFA</p>
          <p class="text-lg ">Acompte HT ({{ acomptePercent }}%) : <strong>{{ acompteHT.toFixed(2) }}FCFA</strong></p>
          <p class="text-lg ">TVA ({{ tvaRate }}%) sur acompte : <strong>{{ acompteTVA.toFixed(2) }}FCFA</strong></p>
          <p class="text-lg ">Montant Acompte TTC : {{ acompteTTC.toFixed(2) }}FCFA</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
      <button @click="goback" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-800 hover:text-black">Annuler</button>
      <button @click="submitInvoice" class="px-4 py-2 bg-green-600 text-white rounded-lg hove:bg-green-800 hover:text-black">Enregistrer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '#imports'
import {useInvoiceStore} from '#imports'
import { onMounted } from 'vue'
import { watch } from 'vue'
import Swal from 'sweetalert2'

definePageMeta({ layout: 'default' })
const router = useRouter()

const factureType = ref('')
const form = ref({
  client: '',
 date: new Date().toISOString().slice(0, 10),
  items: [{ name: '', qty: 1, price: 0 }]
})
const selectedCommande = ref('')
//Avec cette fonction utiliser le  @change="loadCommandeDetails" dans le select pour surveiller son comportement
// const loadCommandeDetails = () => {
//   const cmd = orderStore.commande.find(c => c.id === selectedCommande.value);
//   if (cmd && cmd.articles) {
//     form.value.items = cmd.articles.map(article => ({
//       name: article.label,
//       qty: article.pivot.quantity,
//       price: parseFloat(article.price)
//     }));
//   }
// };

watch(selectedCommande, (newVal) => {
  if (!newVal) {
    form.value.items = []
    return
  }
  const cmd = orderStore.commande.find(c => c.id === newVal)
  if (cmd && cmd.articles) {
    form.value.items = cmd.articles.map(article => ({
      name: article.label,
      qty: article.pivot.quantity,
      price: parseFloat(article.price)
    }))
  } else {
    form.value.items = []
  }
})

// Afficher les commandes passées par les clients
const orderStore=useOrderStore()
const orderStoreValidate=useOrderStore()
onMounted(()=>{
  orderStore.fetchOrder()
  orderStoreValidate.fetchOrderValidate()
})

// Valider les factures :enregistrer
const invoiceStore=useInvoiceStore()
const submitInvoice= async ()=>{
  if (!selectedCommande.value || form.value.items.length === 0) {
    Swal.fire({
      icon:'warning',
      title:'erreur',
      text:'Veuilez selectionner une commande et avoir au moins un article'
    })
    return
  }

  const cmd = orderStore.commande.find(c => c.id === selectedCommande.value)
  const payload={
    clientId:cmd ? cmd.client.id : null,
    orderId:selectedCommande.value,
    invoiceType: factureType.value,
    date: form.value.date,
    remisePercent: factureType.value === 'definitive' ? remisePercent.value : acompteRemisePercent.value,
    acomptePercent: factureType.value === 'acompte' ? acomptePercent.value : null, // ✅ utile pour acompte
    items:form.value.items.map(item=>({
      productName:item.name,
      quantity:item.qty,
      unitPrice:item.price
    })),
    invoiceTypeId: factureType.value 

  }
  try{
    await invoiceStore.addInvoice(payload)
    router.push(AppUrl.INVOICEINFO)

   Swal.fire({
    icon:'success',
    title:'succès',
    text:'Facture enregistréé avec succès',
    time:2000,
    showConfirmButton:false,

   })
    
    // Réinitialiser le formulaire
  form.value = { client: '', date: '', items: [] }
  selectedCommande.value = ''
  factureType.value = ''
  remisePercent.value = 0;
    acomptePercent.value = 0;
    acompteRemisePercent.value = 0;
  }catch(error){
    Swal.fire({
      icon:'error',
      title:'erreur',
      text:"Une erreur est survenue lors de l'enregistrement de votre facture"
    })
    console.error(error)
  }
}

// annuler l'enregistrement
const goback=()=>{
  router.push(AppUrl.INVOICEINFO)

}



const tvaRate = ref(18)
const acomptePercent = ref(0)
const remisePercent=ref(0)
const acompteRemisePercent=ref(0)

// Totaux Définitive
const subtotal = computed(() => form.value.items.reduce((s, i) => s + (i.qty * i.price), 0))
const totalRemise=computed(()=>(subtotal.value * remisePercent.value)/100)
const totalNet =computed(()=>subtotal.value - totalRemise.value)
const tvaAmount = computed(() => (totalNet.value * tvaRate.value) / 100)
const total = computed(() => totalNet.value + tvaAmount.value)

// Totaux Acompte
const acompteRemise = computed(() => (subtotal.value * acompteRemisePercent.value) / 100)
const acompteNet = computed(() => (subtotal.value - acompteRemise.value) )
const acompteHT = computed(() => (acompteNet.value * acomptePercent.value) / 100)
const acompteTVA = computed(() => (acompteHT.value * tvaRate.value) / 100)
const acompteTTC = computed(() => acompteHT.value + acompteTVA.value)

// Méthodes
const addItem = () => form.value.items.push({ name: '', qty: 1, price: 0 })
const removeItem = (index) => form.value.items.splice(index, 1)
</script>
