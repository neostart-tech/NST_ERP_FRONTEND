<template>
  <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
      <i class="fas fa-truck text-indigo-600"></i>
      <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4zm-9 0h9M3 17h2M16 13h5l-1.405-4.215A1 1 0 0018.66 8H16V5a1 1 0 00-1-1H3v13h2"/>
      </svg> -->

      Générer un bordereau de livraison
    </h1>

    <div class="flex items-center space-x-[400px] ">
      <!-- Sélection commande -->
      <div>
        <label class="font-semibold mb-2">Commande <span class="text-red-700">*</span></label>
        <select v-model="selectedCommande" @change="loadCommande" class="border border-black w-full p-2 rounded-lg">
          <option value="">-- Sélectionner une commande --</option>
          <option v-for="(cmd, index) in orderStore.commande" :key="cmd.id" :value="cmd.id">
            CMD-{{ String(index + 1).padStart(3, '0') }} - {{ cmd.client.last_name }} {{ cmd.client.first_name }} 
          </option>
        </select>
      </div>

      <!-- Type de livraison -->
      <div>
        <label class="block font-semibold mb-2">Type de livraison <span class="text-red-700">*</span></label>
        <select v-model="livraisonType" class="border border-black w-full p-2 rounded-lg">
          <option value="">-- Choisir --</option>
          <option value="complete">Livraison complète</option>
          <option value="partielle">Livraison partielle</option>
        </select>
      </div>
    </div>

    <!-- Formulaire -->
    <div v-if="selectedCommande && livraisonType" class="space-y-6">
      <!-- Infos livraison -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Date de livraison</label>
          <input type="date" v-model="form.date" class="w-full border border-black p-2 rounded-md" />
        </div>
        <div>
          <label class="block mb-1">Adresse de livraison</label>
          <input type="text" v-model="form.address" class="w-full border border-black p-2 rounded-md" />
        </div>
      </div>

      <!-- Articles -->
      <div>
        <h3 class="font-semibold mb-2">Articles à livrer</h3>
        <table class="w-full border border-gray-300 text-sm rounded-md overflow-hidden">
          <thead>
            <tr class="bg-indigo-300 text-blue-700 uppercase text-xs font-semibold">
              <th class="p-2 text-center">Designation</th>
              <th class="p-2 text-center">Code Produit</th>
              <th class="p-2 text-center">N° Série</th>
              <th class="p-2 text-center">Qté commandée</th>

              <!-- Colonnes spécifiques à la livraison partielle -->
              <th v-if="livraisonType === 'partielle'" class="p-2 text-center"> Qté déjà livrée</th>
              <th
                v-if="livraisonType === 'partielle'"
                class="p-2 text-center"
              >
                Qté restante
              </th>
              <th
                v-if="livraisonType === 'partielle'"
                class="p-2 text-center"
              >
                Qté à livrer
              </th>
              <th class="p-2 text-center">Supp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.items" :key="index" class="border-t">
              <!-- Code produit (bloqué) -->
              <td><input v-model="item.designation"  class="border border-black text-center w-full p-1 rounded-md bg-gray-100 "/></td>
              <td><input v-model="item.code" class="border border-black text-center w-full p-1 rounded-md " placeholder="Saisir le code"/></td>
              <!-- Numéro de série (modifiable) -->
              <td><input v-model="item.serial" class="border border-black text-center w-full p-1 rounded-md"placeholder="Saisir numéro série"/>
              </td>
              <!-- Qté commandée (bloquée) -->
              <td> <input type="number" v-model.number="item.qtyCommandee" readonly class="border border-black text-center w-full p-1 rounded-md bg-gray-100 cursor-not-allowed"/>
              </td>
              <!-- Livraison partielle : qté déjà livrée -->
              <td v-if="livraisonType === 'partielle'">
                <input
                  type="number"
                  :value="item.qtyAlreadyDelivered"
                  readonly
                  class="border border-black text-center w-full p-1 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </td>

              <!-- Livraison partielle : qté restante -->
              <td v-if="livraisonType === 'partielle'">
                <input
                  type="number"
                  :value="Math.max(item.qtyCommandee - (item.qtyAlreadyDelivered + item.qtyToDeliver), 0)"

                  readonly
                  class="border border-black text-center w-full p-1 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </td>

              <!-- Livraison partielle : qté à livrer (modifiable, max = restante) -->
              <td v-if="livraisonType === 'partielle'">
                <input type="number" v-model.number="item.qtyToDeliver"   :max="Math.max(item.qtyCommandee - item.qtyAlreadyDelivered, 0)"
                  min="0" class="border border-black text-center w-full p-1 rounded-md" />
              </td>
         <!-- Bouton supprimer -->
              <td class="text-center">
                <button class="text-red-500 hover:text-red-700" @click="removeItem(index)"type="button" >               
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          @click="addItem"
          type="button"
          class="mt-2 px-3 py-1 bg-indigo-300 text-blue-700 rounded-md hover:bg-blue-800 hover:text-white"
        >
          <i class="fas fa-plus"></i> Ajouter un article
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-4 border-t pt-4">
      <button
        class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        type="button"
        @click="resetForm"
      >
        Annuler
      </button>
      <button
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        type="button"
        @click="generateBordereau"
      >
        Générer le bordereau
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useOrderStore } from '#imports'
import {useDeliveryStore} from '#imports'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const livraisonType = ref('')
const selectedCommande = ref('')
const form = ref({
  client: '',
  date: '',
  address: '',
  items: []
})

const orderStore = useOrderStore()

// Chargement des commandes au montage du composant
onMounted(() => {
  orderStore.fetchOrder()
})

// Quand une commande est sélectionnée, on prépare le formulaire
watch(selectedCommande, (newVal) => {
  if (!newVal) {
    form.value.items = []
    return
  }
const cmd = orderStore.commande.find(c => c.id === newVal)
  if (cmd && cmd.articles) {
    // Ici on mappe les articles de la commande
    // IMPORTANT : on suppose que tu as une fonction / store qui calcule qtyAlreadyDelivered (livraisons précédentes cumulées)
    form.value.items = cmd.articles.map(article => ({
      article_id: article.id,  // ✅
      designation: article.label,           
      code: '',            // code produit (bloqué en input)
      serial: '',                     // numéro série à saisir
      qtyCommandee: article.pivot.quantity,  // quantité commandée (bloqué)
      qtyAlreadyDelivered: article.pivot.qtyAlreadyDelivered || 0,  // quantité déjà livrée (tu dois gérer ça)
      qtyToDeliver: livraisonType.value === 'complete' 
                    ? article.pivot.quantity
                    : 0   // si livraison complète on met toute la quantité, sinon 0 à saisir
    }))
  } else {
    form.value.items = []
  }
})

//Affichage des livraisone

// Ajout et suppression d'articles dans le formulaire (optionnel selon ton besoin)
const addItem = () => form.value.items.push({
  code: '',
  serial: '',
  qtyCommandee: 1,
  qtyAlreadyDelivered: 0,
  qtyToDeliver: 0
})
const removeItem = (index) => form.value.items.splice(index, 1)

// Réinitialiser formulaire
const resetForm = () => {
  selectedCommande.value = ''
  livraisonType.value = ''
  form.value = {
    client: '',
    date: '',
    address: '',
    items: []
  }
}
// REnregistre le bordereau*
const deliveryStore=useDeliveryStore()
const generateBordereau = async () => {
  // Vérification des champs requis
  if (!selectedCommande.value || !livraisonType.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: 'Veuillez sélectionner une commande et un type de livraison.'
    })
    return
  }

  if (!form.value.date || !form.value.address) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Veuillez renseigner la date et l’adresse de livraison.'
    })
    return
  }

  if (form.value.items.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Aucun article',
      text: 'Veuillez ajouter au moins un article.'
    })
    return
  }

  // Préparer le payload
  const payload = {
    order_id: selectedCommande.value,
    delivery_date: form.value.date,
    delivery_address: form.value.address,
    delivery_type: livraisonType.value === 'partielle' ? 'partial' : 'complete',
    items: form.value.items.map(item => ({
      article_id: item.article_id,
      product_code: item.code,
      designation: item.designation,
      serial_number: item.serial,
      quantity_ordered: item.qtyCommandee,
      quantity_delivered: livraisonType.value === 'complete'
        ? item.qtyCommandee
        : item.qtyToDeliver
    }))
  }

  // Affichage confirmation avant envoi
  const confirmResult = await Swal.fire({
    title: 'Confirmer l\'enregistrement ?',
    text: 'Voulez-vous vraiment enregistrer ce bordereau ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler'
  })

  if (!confirmResult.isConfirmed) return

  try {
    // Chargement
    Swal.fire({
      title: 'Enregistrement...',
      text: 'Veuillez patienter',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await deliveryStore.addDelivery(payload)

    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Bordereau enregister avec succès.'
    })
    // router.push('/listelivraison')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text:"une erreur est survenue lors de l'enregistrement"
    })
    console.error(error)
  }
  
}

</script>
