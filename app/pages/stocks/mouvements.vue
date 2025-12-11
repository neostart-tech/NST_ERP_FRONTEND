<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Carte Total Mouvements -->
      <div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-sky-900">Total Mouvements</p>
            <p class="text-3xl font-bold text-sky-900 mt-2">
              {{ stats.totalMovements || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-sky-500">
            <Icon name="heroicons:arrow-path" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Carte Entrées -->
      <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-emerald-900">Entrées</p>
            <p class="text-3xl font-bold text-emerald-900 mt-2">
              {{ stats.entries || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-emerald-500">
            <Icon name="heroicons:arrow-down-tray" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Carte Sorties -->
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-amber-900">Sorties</p>
            <p class="text-3xl font-bold text-amber-900 mt-2">
              {{ stats.exits || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-amber-500">
            <Icon name="heroicons:arrow-up-tray" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Carte Ajustements -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-900">Ajustements</p>
            <p class="text-3xl font-bold text-purple-900 mt-2">
              {{ stats.adjustments || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-purple-500">
            <Icon name="heroicons:adjustments-horizontal" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900">Gestion des Mouvements de Stock</h1>
      <div class="mt-4 sm:mt-0">
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <Icon name="heroicons:arrow-path" class="h-5 w-5 mr-2" />
          {{ loading ? 'Chargement...' : 'Rafraîchir' }}
        </button>
      </div>
    </div>

      <div class="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        
        <!-- Formulaire d'enregistrement de mouvement -->
        <div class="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              <Icon name="heroicons:plus-circle" class="h-5 w-5 inline-block mr-2 text-blue-600" />
              Enregistrer un Nouveau Mouvement
            </h3>
            <button
              type="button"
              @click="showMovementForm = !showMovementForm"
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span v-if="showMovementForm">
                <Icon name="heroicons:chevron-up" class="h-4 w-4 mr-1" /> Réduire
              </span>
              <span v-else>
                <Icon name="heroicons:chevron-down" class="h-4 w-4 mr-1" /> Afficher
              </span>
            </button>
          </div>

          <form @submit.prevent="addMovement" v-if="showMovementForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label for="productSelect" class="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <select
                  id="productSelect"
                  v-model="newMovement.product_id"
                  required
                  class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="" disabled>Sélectionner un produit</option>
                  <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                    {{ product.name }} (Stock: {{ product.current_stock }})
                  </option>
                </select>
              </div>
              <div>
                <label for="movementType" class="block text-sm font-medium text-gray-700 mb-1">Type de Mouvement</label>
                <select
                  id="movementType"
                  v-model="newMovement.movement_type"
                  required
                  class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="" disabled>Sélectionner un type</option>
                  <option value="entry">Entrée (Achat/Retour)</option>
                  <option value="exit">Sortie (Vente/Perte)</option>
                  <option value="adjustment_positive">Ajustement Positif</option>
                  <option value="adjustment_negative">Ajustement Négatif</option>
                </select>
              </div>
              <div>
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input
                  type="number"
                  id="quantity"
                  v-model.number="newMovement.quantity"
                  required
                  min="1"
                  class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">Raison (Optionnel)</label>
                <input
                  type="text"
                  id="reason"
                  v-model="newMovement.reason"
                  class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            <div v-if="formMessage" :class="formMessageClass" class="p-3 mb-4 rounded-md text-sm">
              {{ formMessage }}
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="formLoading"
                class="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ formLoading ? 'Enregistrement...' : 'Enregistrer Mouvement' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Historique des mouvements de stock -->
        <div class="p-6 bg-white rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <Icon name="heroicons:clock" class="h-5 w-5 inline-block mr-2 text-blue-600" />
            Historique des Mouvements
          </h3>

          <!-- Filtres pour l'historique -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              v-model="historyFilterProduct"
              class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">Tous les produits</option>
              <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
            <select
              v-model="historyFilterType"
              class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">Tous les types</option>
              <option value="entry">Entrée</option>
              <option value="exit">Sortie</option>
              <option value="adjustment_positive">Ajustement Positif</option>
              <option value="adjustment_negative">Ajustement Négatif</option>
            </select>
            <input
              type="date"
              v-model="historyFilterDate"
              class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <Icon name="heroicons:calendar" class="h-4 w-4 mr-1" />
                      Date
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <Icon name="heroicons:cube" class="h-4 w-4 mr-1" />
                      Produit
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <Icon name="heroicons:tag" class="h-4 w-4 mr-1" />
                      Type
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <Icon name="heroicons:cube-transparent" class="h-4 w-4 mr-1" />
                      Quantité
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="h-4 w-4 mr-1" />
                      Raison
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredMovements.length === 0">
                  <td colspan="5" class="px-6 py-4 whitespace-nowrap text-center text-gray-500 border-b border-gray-200 italic">
                    Aucun mouvement trouvé.
                  </td>
                </tr>
                <tr
                  v-for="movement in filteredMovements"
                  :key="movement.id"
                  class="bg-white hover:bg-sky-100 transition-colors duration-150 border-b border-gray-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium border-b border-gray-200">
                    {{ formatDate(movement.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {{ getProductName(movement.product_id) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getMovementTypeLabel(movement.movement_type).class">
                      <Icon :name="getMovementTypeLabel(movement.movement_type).icon" class="h-3.5 w-3.5 mr-1" />
                      {{ getMovementTypeLabel(movement.movement_type).text }}
                    </span>
                  </td>
                  <td
                    :class="[
                      'px-6 py-4 whitespace-nowrap text-sm font-semibold border-b border-gray-200',
                      movement.movement_type === 'entry' || movement.movement_type === 'adjustment_positive'
                        ? 'text-green-700'
                        : 'text-red-600',
                    ]"
                  >
                    {{ movement.movement_type === 'entry' || movement.movement_type === 'adjustment_positive' ? '+' : '-' }}
                    {{ movement.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 italic border-b border-gray-200">
                    {{ movement.reason || '-' }}
                  </td>
                </tr>
              </tbody>
              <tr
                v-for="(total, productId) in productStockSummary"
                :key="'summary-' + productId"
                class="bg-blue-100 font-semibold text-sm"
              >
                <td colspan="2" class="px-6 py-2">
                  Total pour {{ getProductName(Number(productId)) }}
                </td>
                <td colspan="3" class="px-6 py-2 text-right text-blue-800">
                  {{ total < 0 ? 0 : total }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Mouvements de Stock - Neo Start Tech',
});

const availableProducts = ref([]);
const stockMovements = ref([]);

// État du formulaire
const showMovementForm = ref(true);
const newMovement = ref({
  product_id: '',
  movement_type: '',
  quantity: null,
  reason: '',
});

// Statistiques
const stats = ref({
  totalMovements: 0,
  entries: 0,
  exits: 0,
  adjustments: 0
});

const formLoading = ref(false);
const toast = useToast();
const formMessage = ref('');
const formMessageClass = ref('');

const historyFilterProduct = ref('');
const historyFilterType = ref('');
const historyFilterDate = ref('');

const movementTypeLabels = {
  entry: 'Entrée',
  exit: 'Sortie',
  adjustment_positive: 'Ajustement positif',
  adjustment_negative: 'Ajustement négatif',
};

const getMovementTypeLabel = (type) => {
  const labels = {
    'entry': { text: 'Entrée', icon: 'heroicons:arrow-down-tray', color: 'green' },
    'exit': { text: 'Sortie', icon: 'heroicons:arrow-up-tray', color: 'red' },
    'adjustment_positive': { text: 'Ajustement +', icon: 'heroicons:plus-circle', color: 'blue' },
    'adjustment_negative': { text: 'Ajustement -', icon: 'heroicons:minus-circle', color: 'orange' }
  };

  const movement = labels[type] || { text: type, icon: 'heroicons:question-mark-circle', color: 'gray' };

  return {
    ...movement,
    class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${movement.color}-100 text-${movement.color}-800`
  };
};

const getProductName = (productId) => {
  const product = availableProducts.value.find((p) => p.id === productId);
  return product ? product.name : 'Produit inconnu';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date invalide';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Date invalide';
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('fr-FR', options);
};

const fetchAvailableProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    availableProducts.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des produits :', error);
  }
};

const fetchStockMovements = async () => {
  try {
    const response = await axios.get('/api/stock-movements');
    stockMovements.value = response.data.data || response.data;

    // Mise à jour des statistiques
    updateStats(stockMovements.value);
  } catch (error) {
    console.error('Erreur lors du chargement des mouvements :', error);
  }
};

// Mettre à jour les statistiques
const updateStats = (movements) => {
  stats.value = {
    totalMovements: movements.length,
    entries: movements.filter(m => m.movement_type === 'entry').length,
    exits: movements.filter(m => m.movement_type === 'exit').length,
    adjustments: movements.filter(m => m.movement_type.includes('adjustment')).length
  };
};

const loading = ref(false);
const refreshData = async () => {
  loading.value = true;
  await fetchAvailableProducts();
  await fetchStockMovements();
  loading.value = false;
};

const addMovement = async () => {
  formLoading.value = true;
  formMessage.value = '';
  formMessageClass.value = '';

  try {
    if (!newMovement.value.product_id || !newMovement.value.movement_type || newMovement.value.quantity <= 0) {
      throw new Error('Veuillez remplir tous les champs obligatoires.');
    }

    const response = await axios.post('/api/stock-movements', newMovement.value);

    const updatedMovement = response.data.movement;
    const productIndex = availableProducts.value.findIndex(p => p.id === updatedMovement.product_id);
    if (productIndex !== -1) {
      await fetchAvailableProducts();
    }

    await fetchStockMovements();

    toast.success('Mouvement enregistré avec succès !');

    resetForm();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du mouvement :', error);
    if (error.response?.status === 400 && error.response?.data?.error) {
      formMessage.value = error.response.data.error;
    } else {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement du mouvement.');
    }
    formMessageClass.value = 'bg-red-100 text-red-800';
  } finally {
    formLoading.value = false;
  }
};

const resetForm = () => {
  newMovement.value = {
    product_id: '',
    movement_type: '',
    quantity: null,
    reason: '',
  };
  setTimeout(() => {
    formMessage.value = '';
  }, 3000);
};

const filteredMovements = computed(() => {
  let filtered = stockMovements.value;

  if (historyFilterProduct.value) {
    filtered = filtered.filter((m) => m.product_id === historyFilterProduct.value);
  }
  if (historyFilterType.value) {
    filtered = filtered.filter((m) => m.movement_type === historyFilterType.value);
  }
  if (historyFilterDate.value) {
    filtered = filtered.filter((m) =>
      m.created_at.startsWith(historyFilterDate.value)
    );
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const productStockSummary = computed(() => {
  const realStockMap = {};

  stockMovements.value.forEach((m) => {
    const id = m.product_id;
    if (!realStockMap[id]) realStockMap[id] = 0;

    const qte = Number(m.quantity || 0);
    if (['entry', 'adjustment_positive'].includes(m.movement_type)) {
      realStockMap[id] += qte;
    } else if (['exit', 'adjustment_negative'].includes(m.movement_type)) {
      realStockMap[id] -= qte;
    }
  });

  return realStockMap;
});

onMounted(async () => {
  await refreshData();
  setInterval(() => {
    refreshData();
  }, 30000);
});
</script>

<style scoped>
/* Styles pour les entêtes de tableau */
th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

/* Styles pour les cellules du tableau */
td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200;
}

/* Style pour les lignes du tableau */
tbody tr {
  @apply hover:bg-gray-50 transition-colors duration-150;
}

/* Style pour les boutons d'action */
.action-btn {
  @apply p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200;
}

/* Style pour les badges de statut */
.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* Style pour les champs de formulaire */
input,
select {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm;
}

/* Style pour les boutons */
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700 focus:ring-gray-500;
}

/* Animation de chargement */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Styles spécifiques pour le tableau */
th:last-child,
td:last-child {
  border-right: none;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.overflow-x-auto {
  max-width: 100%;
  overflow-x: auto;
}

thead tr th:first-child {
  border-top-left-radius: 0.375rem;
}

thead tr th:last-child {
  border-top-right-radius: 0.375rem;
}

tbody tr:hover {
  background-color: #f8fafc;
}
</style>
