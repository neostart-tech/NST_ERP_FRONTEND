<template>
  <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
      <i class="fas fa-calendar-alt"></i> Créer un Échéancier
    </h1>

    <!-- Sélection facture -->
    <div>
      <select
        v-model="factureSelectionnee"
        class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Sélectionner la facture</option>
        <option  v-for="invoice in invoiceStore.facture"  :key="invoice.id" :value="invoice" >
          {{ invoice.reference }} - {{ invoice.order.client.first_name }} {{ invoice.order.client.last_name }}
         </option>
      </select>
    </div>

    <!-- Infos Facture -->
    <div v-if="factureSelectionnee" class="bg-gray-100 p-4 rounded-lg">
      <h2 class="font-semibold text-lg mb-2">Détails de la Facture</h2>
      <p>
        <strong>Client :</strong> {{ factureSelectionnee.order.client.last_name }}   {{ factureSelectionnee.order.client.first_name }}
      </p>
      <p><strong>Commande :</strong> {{ factureSelectionnee.order.reference }}</p>
      <p>
        <strong>Total à payer :</strong> {{ formatCurrency(factureSelectionnee.total) }}
      </p>
    </div>

    <!-- Paramètres échéancier -->
    <div>
      <div class="flex items-center gap-10">
        <!-- Périodicité -->
        <div>
          <label class="block font-medium mb-1">Périodicité (en jours)</label>
          <input type="number" v-model.number="periodicite" min="7" class="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-500" />
        </div>

        <!-- Nombre d'échéances -->
        <div>
          <label class="block font-medium mb-1">Nombre d'échéances</label>
          <input type="number" v-model.number="nombreEcheances" min="1" max="12"
            class="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-500"/>
        </div>
      </div>

      <!-- Aperçu échéancier modifiable -->
      <div
        v-if="factureSelectionnee && apercu.length > 0"
        class="bg-gray-50 p-4 rounded-lg mt-4"
      >
        <h2 class="font-semibold mb-2">Aperçu de l'échéancier</h2>
        <table class="min-w-full border">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-400 px-4 py-2">N°</th>
              <th class="border border-gray-400 px-4 py-2">Montant</th>
              <th class="border border-gray-400 px-4 py-2">Date Échéance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(echeance, index) in apercu" :key="index">
              <td class="border border-gray-400 text-center px-4 py-2"> {{ index + 1 }} </td>
              <td class="border border-gray-400 px-4 py-2 text-center">
                <input type="number" v-model.number="echeance.montant" @input="ajusterMontants(index)" class="bg-gray-50 text-center"/>
              </td>
              <td class="border border-gray-400 px-4 py-2 text-center">
                <input type="date" v-model="echeance.date":min="today"class="bg-gray-50 text-center" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bouton Valider -->
      <div class="flex justify-end mt-4">
        <button type="button" @click="validerEcheancier" :disabled="Math.abs(totalRestant) > 0.01"
          :class="{
            'bg-indigo-600 hover:bg-indigo-700': Math.abs(totalRestant) <= 0.01,
            'bg-gray-400 cursor-not-allowed': Math.abs(totalRestant) > 0.01
          }"
          class="text-white px-4 py-2 rounded transition-colors">
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useInvoiceStore } from "#imports";
import { useScheduleStore } from "#imports";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const invoiceStore = useInvoiceStore();
const scheduleStore = useScheduleStore();
const factureSelectionnee = ref(null);
const periodicite = ref(11);
const nombreEcheances = ref(3);
const apercu = ref([]);

// Date du jour (format YYYY-MM-DD pour input[type=date])
const today = new Date().toISOString().split("T")[0];

// Charger les factures
onMounted(() => {
  invoiceStore.fetchInvoice();
});

// Calcul du total restant
const totalRestant = computed(() => {
  if (!factureSelectionnee.value) return 0;
  const totalEcheances = apercu.value.reduce(
    (sum, e) => sum + Number(e.montant || 0),
    0
  );
  return factureSelectionnee.value.total - totalEcheances;
});

// Générer l'aperçu
watch([factureSelectionnee, periodicite, nombreEcheances], () => {
  genererApercu();
}, { immediate: true });

function genererApercu() {
  if (
    !factureSelectionnee.value ||
    nombreEcheances.value < 1 ||
    periodicite.value < 1
  ) {
    apercu.value = [];
    return;
  }

  const montantInitial = Math.floor(
    factureSelectionnee.value.total / nombreEcheances.value
  );
  const dateDebut = new Date();

  apercu.value = Array.from({ length: nombreEcheances.value }, (_, i) => {
    const dateEcheance = new Date(dateDebut);
    dateEcheance.setDate(
      dateEcheance.getDate() + periodicite.value * (i + 1)
    );
    const formattedDate = dateEcheance.toISOString().split("T")[0];
    return {
      montant:
        i === nombreEcheances.value - 1
          ? factureSelectionnee.value.total - montantInitial * i
          : montantInitial,
      date: formattedDate,
    };
  });
}

function ajusterMontants(indexModifie) {
  if (!factureSelectionnee.value || apercu.value.length < 2) return;

  const total = factureSelectionnee.value.total;

  let totalPrecedent = 0;
  for (let i = 0; i <= indexModifie; i++) {
    totalPrecedent += Number(apercu.value[i].montant) || 0;
  }

  const resteARepartir = total - totalPrecedent;
  const nbEcheancesRestantes = apercu.value.length - indexModifie - 1;

  if (nbEcheancesRestantes > 0) {
    const nouveauMontant = resteARepartir / nbEcheancesRestantes;
    for (let i = indexModifie + 1; i < apercu.value.length; i++) {
      apercu.value[i].montant = nouveauMontant;
    }
  }

  const totalActuel = apercu.value.reduce(
    (sum, e) => sum + Number(e.montant || 0),
    0
  );
  const difference = total - totalActuel;
  if (Math.abs(difference) > 0.01) {
    apercu.value[apercu.value.length - 1].montant += difference;
  }
}

async function validerEcheancier() {
  if (Math.abs(totalRestant.value) > 0.01) {
    Swal.fire({
      icon: "warning",
      title: "Erreur",
      text: "La somme des échéances ne correspond pas au total de la facture.",
    });
    return;
  }

  // Vérif des dates
  for (let i = 0; i < apercu.value.length; i++) {
    if (apercu.value[i].date < today) {
      Swal.fire({
        icon: "error",
        title: "Date invalide",
        text: `L'échéance N°${i + 1} ne peut pas être antérieure à aujourd'hui.`,
      });
      return;
    }
    if (i > 0 && apercu.value[i].date < apercu.value[i - 1].date) {
      Swal.fire({
        icon: "error",
        title: "Dates incohérentes",
        text: `L'échéance N°${i + 1} ne peut pas être avant l'échéance précédente.`,
      });
      return;
    }
  }

  const payload = {
    invoice_id: factureSelectionnee.value.id,
    installments: apercu.value.map((e) => ({
      amount: Number(e.montant),
      date: e.date,
    })),
  };

  try {
    await scheduleStore.addSchedule(payload);
    Swal.fire({
      icon: "success",
      title: "Succès",
      text: "Échéancier validé et enregistré avec succès",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      router.push(AppUrl.SCHEDULEINFO);
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement ", error);
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Une erreur est survenue lors de l'enregistrement",
    });
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(amount);
}
</script>
