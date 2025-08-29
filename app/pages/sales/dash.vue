<template>
  <div class="bg-gray-100 min-h-screen p-6 sm:p-10 md:p-16">
    <!-- En-tête du Tableau de Bord -->
    <header class="mb-10 text-center">
      <h1 class="text-5xl font-extrabold text-gray-800">Tableau de Bord</h1>
      <p class="text-lg text-gray-500 mt-2">Aperçu rapide et élégant de vos données commerciales</p>
    </header>

    <!-- Affichage du chargement -->
    <div v-if="loading" class="text-center text-gray-500 text-xl font-semibold p-20">
      <div class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
      <p class="mt-4">Chargement des données...</p>
    </div>

    <!-- Contenu principal une fois chargé -->
    <div v-else class="space-y-12">
      <!-- Section des Statistiques Principales (KPIs) -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div class="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-2xl shadow-xl text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 class="text-xl font-semibold">Clients</h2>
          <p class="text-5xl font-bold mt-2">{{ kpis.clientsTotal }}</p>
        </div>
        <div class="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-2xl shadow-xl text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 class="text-xl font-semibold">Proformas</h2>
          <p class="text-5xl font-bold mt-2">{{ kpis.proformasTotal }}</p>
        </div>
        <div class="bg-gradient-to-br from-purple-400 to-purple-600 p-8 rounded-2xl shadow-xl text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 class="text-xl font-semibold">Commandes</h2>
          <p class="text-5xl font-bold mt-2">{{ kpis.ordersTotal }}</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-2xl shadow-xl text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 class="text-xl font-semibold">Livraisons</h2>
          <p class="text-5xl font-bold mt-2">{{ kpis.deliveriesTotal }}</p>
        </div>
        <div class="bg-gradient-to-br from-red-400 to-red-600 p-8 rounded-2xl shadow-xl text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 class="text-xl font-semibold">Factures</h2>
          <p class="text-5xl font-bold mt-2">{{ kpis.invoicesTotal }}</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-400 to-indigo-600 p-8 rounded-2xl shadow-xl text-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 class="text-xl font-semibold">Échéanciers</h2>
          <p class="text-5xl font-bold mt-2">{{ kpis.schedulesTotal }}</p>
        </div>
      </section>

      <!-- Section des Graphiques (Bar Chart et Donut Chart personnalisés) -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Graphique des Commandes par Statut -->
        <div class="bg-white p-8 rounded-2xl shadow-xl">
          <h2 class="text-2xl font-bold text-gray-700 mb-6">Commandes par Statut</h2>
          <div class="flex items-end h-72">
            <div v-for="(value, label) in commandeChartData" :key="label" class="relative flex-1 flex flex-col justify-end items-center mx-1">
              <div :style="{ height: (value / kpis.ordersTotal) * 100 + '%' }" :class="`w-2/3 rounded-xl transition-all duration-500 ease-in-out transform hover:scale-105 ` + getBarColor(label)"></div>
              <span class="absolute top-0 mt-2 text-sm font-bold text-gray-700">{{ value }}</span>
              <span class="mt-2 text-sm text-gray-500">{{ label }}</span>
            </div>
          </div>
          <div class="flex justify-around mt-6">
            <span class="flex items-center text-sm text-gray-600"><span class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>En attente</span>
            <span class="flex items-center text-sm text-gray-600"><span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Livrées</span>
            <span class="flex items-center text-sm text-gray-600"><span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Annulées</span>
          </div>
        </div>

        <!-- Graphique de la Répartition des Clients -->
        <div class="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center">
          <h2 class="text-2xl font-bold text-gray-700 mb-6">Répartition des clients</h2>
          <div class="w-48 h-48 relative">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="10"></circle>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" stroke-width="10" :stroke-dasharray="clientMoralPercent + ' ' + (100 - clientMoralPercent)" stroke-linecap="round" transform="rotate(-90 50 50)"></circle>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
              {{ kpis.clientsTotal }}
            </div>
          </div>
          <div class="mt-8 flex justify-around w-full">
            <span class="flex items-center text-lg font-medium text-gray-600">
              <span class="w-4 h-4 rounded-full bg-blue-500 mr-2"></span> Physiques: {{ clientChartData.physiques }}
            </span>
            <span class="flex items-center text-lg font-medium text-gray-600">
              <span class="w-4 h-4 rounded-full bg-gray-300 mr-2"></span> Moraux: {{ clientChartData.moraux }}
            </span>
          </div>
        </div>
      </section>

      <!-- Section des Dernières Proformas -->
      <section class="bg-white p-8 rounded-2xl shadow-xl">
        <h2 class="text-2xl font-bold text-gray-700 mb-6">Dernières Proformas</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th class="p-4 font-semibold text-gray-700">N°</th>
                <th class="p-4 font-semibold text-gray-700">Client</th>
                <th class="p-4 font-semibold text-gray-700">Date</th>
                <th class="p-4 font-semibold text-gray-700 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in latestProformas" :key="p.id" class="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-150 ease-in-out">
                <td class="p-4">{{ p.numero }}</td>
                <td class="p-4">{{ p.client?.nom || '—' }}</td>
                <td class="p-4">{{ p.date }}</td>
                <td class="p-4 text-right font-medium text-gray-900">{{ p.montant }} F</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// État de chargement initial
const loading = ref(true);

// Données simulées pour la démonstration
const clientStore = ref({
  list: [],
  stat: { physique: 0, moral: 0 }
});

const proformaStore = ref({ list: [] });
const commandeStore = ref({ list: [] });
const livraisonStore = ref({ list: [] });
const factureStore = ref({ list: [] });
const echeancierStore = ref({ list: [] });

// Fonction pour simuler le chargement des données
const fetchData = async () => {
  // Simule une requête réseau de 1,5 secondes
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Remplissage des stores avec des données simulées
  clientStore.value.list = [
    { type: 'physique', id: 1 }, { type: 'moral', id: 2 }, { type: 'physique', id: 3 },
    { type: 'moral', id: 4 }, { type: 'physique', id: 5 }, { type: 'physique', id: 6 }
  ];
  clientStore.value.stat = {
    physique: clientStore.value.list.filter(c => c.type === 'physique').length,
    moral: clientStore.value.list.filter(c => c.type === 'moral').length
  };

  proformaStore.value.list = [
    { id: 1, numero: 'P-001', client: { nom: 'Client A' }, date: '2023-01-25', montant: 50000 },
    { id: 2, numero: 'P-002', client: { nom: 'Client B' }, date: '2023-01-20', montant: 75000 },
    { id: 3, numero: 'P-003', client: { nom: 'Client C' }, date: '2023-01-28', montant: 30000 },
    { id: 4, numero: 'P-004', client: { nom: 'Client D' }, date: '2023-01-15', montant: 120000 },
    { id: 5, numero: 'P-005', client: { nom: 'Client E' }, date: '2023-01-10', montant: 45000 }
  ];

  commandeStore.value.list = [
    { status: 'pending' }, { status: 'delivered' }, { status: 'pending' }, { status: 'canceled' },
    { status: 'delivered' }, { status: 'delivered' }
  ];

  livraisonStore.value.list = new Array(5).fill({});
  factureStore.value.list = new Array(4).fill({});
  echeancierStore.value.list = new Array(7).fill({});

  // Le chargement est terminé
  loading.value = false;
};

// Appel de la fonction de chargement au montage du composant
onMounted(fetchData);

// Calcul des KPIs dynamiques
const kpis = computed(() => ({
  clientsTotal: (clientStore.value.list || []).length,
  proformasTotal: (proformaStore.value.list || []).length,
  ordersTotal: (commandeStore.value.list || []).length,
  deliveriesTotal: (livraisonStore.value.list || []).length,
  invoicesTotal: (factureStore.value.list || []).length,
  schedulesTotal: (echeancierStore.value.list || []).length
}));

// Obtention des 5 dernières proformas, triées par date
const latestProformas = computed(() =>
  (proformaStore.value.list || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
);

// Données pour le graphique à barres des commandes
const commandeChartData = computed(() => {
  const commandes = commandeStore.value.list || [];
  const pending   = commandes.filter(c => c.status === 'pending').length;
  const delivered = commandes.filter(c => c.status === 'delivered').length;
  const canceled  = commandes.filter(c => c.status === 'canceled').length;
  return {
    "En attente": pending,
    "Livrées": delivered,
    "Annulées": canceled
  };
});

// Aide à la coloration des barres de graphique
const getBarColor = (label) => {
  switch (label) {
    case "En attente":
      return "bg-yellow-400";
    case "Livrées":
      return "bg-green-500";
    case "Annulées":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

// Données pour le graphique des clients (anneau)
const clientChartData = computed(() => ({
  physiques: clientStore.value.stat.physique,
  moraux: clientStore.value.stat.moral
}));

// Calcul du pourcentage pour le graphique en anneau
const clientMoralPercent = computed(() => {
  const total = kpis.value.clientsTotal;
  return total > 0 ? (clientChartData.value.moraux / total) * 100 : 0;
});
</script>
