<template>
  <div class="p-4 bg-white rounded-xl shadow-md">
    <h2 class="text-xl font-bold mb-4 text-blue-700">Comparatif des propositions</h2>

    <table class="w-full table-auto border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">#</th>
          <th class="p-2 border">Fournisseur</th>
          <th class="p-2 border">Pays / Ville</th>
          <th class="p-2 border">Prix (unité)</th>
          <th class="p-2 border">Conditions de paiement</th>
          <th class="p-2 border">Délais</th>
          <th class="p-2 border">Commentaires</th>
          <!-- <th class="p-2 border">Quantité</th> -->
          <th class="p-2 border">Sélection</th>
          <th class="p-2 border">Total (€)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proposal, index) in proposalStore.proposals" :key="proposal.id">
          <td class="p-2 border">{{ index + 1 }}</td>
          <td class="p-2 border">
            <a
              :href="`/suppliers/${proposal.supplier.id}`"
              target="_blank"
              class="text-blue-600 hover:underline"
            >
              {{ proposal.supplier.name }}
            </a>
          </td>
          <td class="p-2 border">{{ proposal.supplier.city }} -- {{ proposal.supplier.country}}</td>
          <td class="p-2 border text-right">{{ proposal.unit_price}}€</td>
          <td class="p-2 border">{{ proposal.payment_condition }}</td>
          <td class="p-2 border"> Indéfini</td>
          <td class="p-2 border">{{ proposal.comments }}</td>

          <!-- <td class="p-2 border text-center">
            <input
              type="number"
              min="1"
              :disabled="!selectedIds.has(proposal.id)"
              v-model.number="quantities[proposal.id]"
              class="w-20 p-1 border rounded text-right"
            />
          </td> -->

          <td class="p-2 border text-center">
            <input
              type="checkbox"
              :value="proposal.id"
              @change="toggleSelection(proposal.id)"
              :checked="selectedIds.has(proposal.id)"
            />
          </td>

          <td class="p-2 border text-right">
           {{ proposal.total_cost_of_return_per_unit  }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-between items-center">
      <div>
        <strong>Total global :</strong>
        <!-- {{ totalGlobal.toFixed(2) }} € -->
      </div>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        :disabled="selectedIds.size === 0"
        @click="generatePurchaseOrder"
      >
        <!-- Générer bon de commande ({{ selectedIds.size }}) -->
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useSupplierProposalsStore } from '#imports'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  }
})

const proposals = ref([])
// Utilisation d'un Set pour gérer la sélection des propositions
const selectedIds = reactive(new Set())
// Quantités par proposition id (initialisées à 1 par défaut)
const quantities = reactive({})

const proposalStore=useSupplierProposalsStore()
onMounted(()=> {
  proposalStore.fetchProposals()
})
// onMounted(async () => {
//   try {
//     const response = await axios.get(`/api/price-inquiries/${props.productId}`)
//     proposals.value = response.data

//     // Initialiser quantités à 1 pour chaque proposition
//     proposals.value.forEach(p => {
//       quantities[p.id] = 1
//     })
//   } catch (error) {
//     console.error('Erreur lors du chargement des propositions:', error)
//   }
// })

function toggleSelection(id) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id)
  } else {
    selectedIds.add(id)
  }
}

// Calcul du total global sur toutes les propositions sélectionnées
const totalGlobal = computed(() => {
  let total = 0
  selectedIds.forEach(id => {
    const proposal = proposals.value.find(p => p.id === id)
    if (proposal) {
      const qty = quantities[id] ?? 1
      total += proposal.unit_price * qty
    }
  })
  return total
})

const generatePurchaseOrder = () => {
  // Préparer les données à envoyer: id + quantité
  const selections = []
  selectedIds.forEach(id => {
    selections.push({
      proposal_id: id,
      quantity: quantities[id] || 1,
    })
  })

  // Émettre un événement au parent pour générer la commande
  // ou appeler directement une API ici si tu préfères
  // Ex: emit('generate-order', selections)
  console.log('Données pour bon de commande:', selections)
  alert('Fonction génération bon de commande déclenchée (voir console)')
}
</script>
