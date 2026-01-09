<template>
  <main class="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="relative mb-8">
        <div
          class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden"
        >
          <div class="absolute inset-0 opacity-10">
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
            <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
            <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
          </div>

          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 class="text-3xl font-bold mb-2">Gestion des Clients</h1>
                <p class="text-sky-100 text-lg">Gérez votre portefeuille clients et suivez leurs informations</p>
                <div class="flex items-center gap-6 mt-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span class="text-sky-100">{{ kpis.clientsActifs }} Clients Actifs</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span class="text-sky-100">{{ kpis.nouveauxClients }} Nouveaux (7j)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <span class="text-sky-100">{{ kpis.clientsEntreprises }} Entreprises</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-3">
                <NuxtLink
                  to="/clients/form"
                  class="group px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
                >
                  <div
                    class="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center group-hover:bg-sky-200 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  Ajouter un Client
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Clients</p>
              <p class="text-3xl font-bold text-gray-900">{{ kpis.clientsActifs }}</p>
            </div>
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Clients Particuliers</p>
              <p class="text-3xl font-bold text-gray-900">{{ individualClientsCount }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Clients Moraux</p>
              <p class="text-3xl font-bold text-gray-900">{{ moralClientsCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Liste des clients</h2>
              <p class="text-gray-600 text-sm mt-1">{{ filteredClients.length }} client(s) affiché(s)</p>
            </div>

            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Rechercher un client..."
                class="w-full sm:w-80 pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-700 bg-white"
              />
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="heroicons:search" class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="client in filteredClients"
                :key="client.id"
                class="hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-300 group"
              >
                <td class="px-8 py-6 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-0">
                      <div class="text-sm font-bold text-gray-900">{{ client.name}}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap">
                  <span
                    class="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full"
                  >
                    {{ client.client_type }}
                  </span>
                </td>
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="text-sm text-gray-500 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {{ client.email }}
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="text-sm text-gray-500 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {{ client.phone }}
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewClient(client.id)"
                      class="group p-2 text-sky-600 hover:text-white hover:bg-sky-600 rounded-lg transition-all duration-200 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      <span class="hidden group-hover:inline text-xs">Voir</span>
                    </button>
                    <button
                      @click="$router.push(`/clients/edit/${client.id}`)"
                      class="group p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.232z"
                        ></path>
                      </svg>
                      <span class="hidden group-hover:inline text-xs">Modifier</span>
                    </button>
                    <button
                      @click="confirmDelete(client.id)"
                      class="group p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      <span class="hidden group-hover:inline text-xs">Supprimer</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p class="text-gray-500 text-lg font-medium">Aucun client trouvé</p>
                    <p class="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</p>

        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
            :disabled="isLoading"
          >
            Annuler
          </button>
          <button
            @click="deleteClient"
            class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Suppression...</span>
            <span v-else>Supprimer</span>
            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useClientStore } from '#imports';

const clientStore = useClientStore();

const searchTerm = ref('');
const showDeleteModal = ref(false);
const clientToDelete = ref(null);
const isLoading = ref(false);

const kpis = reactive({
  clientsActifs: 0,
  nouveauxClients: 0,
  clientsEntreprises: 0
});

// Utilisez filteredClients dans la boucle v-for
const filteredClients = computed(() => {
  const clients = clientStore.clients ?? [];
  if (!searchTerm.value) return clients;
  return clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const individualClientsCount = computed(() => {
  const clients = clientStore.clients ?? [];
  return clients.filter(client =>
    client.client_type && (
      client.client_type.toLowerCase() === 'particulier' ||
      client.client_type.toLowerCase() === 'individual' ||
      client.client_type === 'Personne Physique'
    )
  ).length;
});

const moralClientsCount = computed(() => {
  const clients = clientStore.clients ?? [];
  return clients.filter(client =>
    client.client_type && (
      client.client_type.toLowerCase() === 'moral' ||
      client.client_type.toLowerCase() === 'company' ||
      client.client_type === 'Entreprise' ||
      client.client_type === 'Personne Morale'
    )
  ).length;
});

onMounted(async () => {
  try {
    await clientStore.fetchAll();

    const clients = clientStore.clients ?? [];

    kpis.clientsActifs = clients.length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    kpis.nouveauxClients = clients.filter(c => {
      const createdAt = new Date(c.created_at);
      return createdAt >= sevenDaysAgo;
    }).length;

    kpis.clientsEntreprises = clients.filter(c => c.client_type === 'Entreprise').length;
  } catch (error) {
    console.error('Erreur chargement clients:', error);
  }
});

const viewClient = async (id) => {
  try {
    await clientStore.fetchClient(id);
    window.location.href = `/clients/${id}`;
  } catch (error) {
    console.error('Erreur lors du chargement du client:', error);
    alert('Impossible de charger les détails du client');
  }
};

const editClient = (id) => {
  window.location.href = `/clients/${id}/edit`;
};

const confirmDelete = (id) => {
  clientToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteClient = async () => {
  if (!clientToDelete.value) return;

  isLoading.value = true;
  try {
    await clientStore.deleteClient(clientToDelete.value);
    alert('Client supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    alert('Erreur lors de la suppression du client: ' + (error.message || 'Erreur inconnue'));
  } finally {
    showDeleteModal.value = false;
    clientToDelete.value = null;
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Animation pour les cartes de statistiques */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover .group-hover\:inline {
  animation: slideInUp 0.2s ease-out;
}

/* Effet de survol pour les lignes du tableau */
.group:hover {
  box-shadow: 0 4px 15px -4px rgba(59, 130, 246, 0.15);
}

/* Style pour les boutons d'action */
.group:hover .group-hover\:bg-sky-600,
.group:hover .group-hover\:bg-red-600,
.group:hover .group-hover\:bg-indigo-600 {
  transform: scale(1.05);
}
</style>
