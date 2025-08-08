<template>
  <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
      <i class="fas fa-calendar-alt"></i> Créer un Échéancier
    </h1>

    <!--  Choix la facture -->
    <div>
      <label class="block font-medium mb-1">Rechercher une facture</label>
      <input list="factures" v-model="selectedFactureId"  @change="chargerFacture" placeholder="Ex: FAC-2025-001" class="border border-black rounded w-full p-2"/>
      <datalist id="factures">
        <option v-for="facture in factures" :key="facture.id" :value="facture.id">
          {{ facture.id }} - {{ facture.client }}
        </option>
      </datalist>
    </div>

    <!--  Infos Facture -->
    <div v-if="factureSelectionnee" class="bg-gray-100 p-4 rounded-lg">
      <h2 class="font-semibold text-lg mb-2">Détails de la Facture</h2>
      <p><strong>Client :</strong> {{ factureSelectionnee.client }}</p>
      <p><strong>Commande :</strong> {{ factureSelectionnee.commande }}</p>
      <p><strong>Total à payer :</strong> {{ factureSelectionnee.montant }} FCFA</p>
    </div>

    <!-- Paramètres échéancier -->
    <div v-if="factureSelectionnee">
        <div class=" flex  items-center">
            <!-- Périodicité -->
            <div>
                <label class="block font-medium mb-1">Périodicité (en jours)</label>
                <input type="number" v-model="periodicite" min="7" class="border border-black  rounded w-full p-2" />
            </div>

            <!-- Nombre d'échéances -->
            <div class="ml-80">
                <label class="block font-medium mb-1">Nombre d’échéances</label>
                <input type="number" v-model="nombreEcheances" min="2" max="10" class="border border-black  rounded w-full p-2" />
            </div>

        </div>
      
        <!-- Aperçu de la facture et ses details -->
        <div v-if="apercu.length" class="bg-gray-50 p-4 rounded-lg mt-4">
            <h2 class="font-semibold mb-2">Aperçu de l’échéancier</h2>
            <table class="table-auto w-full border">
            <thead>
                <tr class="bg-gray-200">
                <th class="border  border-gray-400 px-4 py-2">N°</th>
                <th class="border border-gray-400 px-4 py-2">Montant</th>
                <th class="border border-gray-400  ">Date Échéance</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(echeance, index) in apercu" :key="index">
                <td class="border border-gray-400  text-center px-4 py-2">{{ index + 1 }}</td>
                <td class="border border-gray-400 text-center px-4 py-2">{{ echeance.montant }} FCFA</td>
                <td class="border border-gray-400 text-center  px-4 py-2">{{ echeance.date }}</td>
                </tr>
            </tbody>
            </table>
        </div>

        <!-- Bouton Valider -->
        <div class="flex justify-end mt-4">
            <button type="button" @click="validerEcheancier"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Valider
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const factures = ref([
  { id: 'FAC-2025-001', client: 'Jean Dupont', commande: 'CMD-1001', montant: 120000 },
  { id: 'FAC-2025-002', client: 'Amina Traoré', commande: 'CMD-1002', montant: 85000 }
])

const selectedFactureId = ref('')
const factureSelectionnee = ref(null)
const periodicite = ref(15)
const nombreEcheances = ref(3)
const apercu = ref([])

function chargerFacture() {
  factureSelectionnee.value = factures.value.find(f => f.id === selectedFactureId.value) || null
  apercu.value = []
}

// Watchers pour mise à jour automatique de l’aperçu
watch([factureSelectionnee, periodicite, nombreEcheances], () => {
  genererApercu()
})

function genererApercu() {
  if (!factureSelectionnee.value || nombreEcheances.value < 1 || periodicite.value < 1) {
    apercu.value = []
    return
  }
  apercu.value = []
  const montantParTranche = (factureSelectionnee.value.montant / nombreEcheances.value).toFixed(2)
  const dateDebut = new Date()
  for (let i = 0; i < nombreEcheances.value; i++) {
    const dateEcheance = new Date(dateDebut)
    dateEcheance.setDate(dateEcheance.getDate() + (periodicite.value * (i + 1)))
    apercu.value.push({
      montant: montantParTranche,
      date: dateEcheance.toLocaleDateString()
    })
  }
}

function validerEcheancier() {
  if (!apercu.value.length) {
    alert('Veuillez renseigner les paramètres avant de valider.')
    return
  }
  alert('Échéancier validé et enregistré !')
  console.log('Échéancier :', apercu.value)
}
</script>
