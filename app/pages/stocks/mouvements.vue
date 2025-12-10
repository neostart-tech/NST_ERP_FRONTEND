<template>
  <div class="flex-1 p-8 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Nouveau header avec dégradé bleu -->
      <div class="mb-8 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
          <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
          <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
        </div>

        <div class="relative z-10">
          <h2 class="text-3xl font-bold mb-2">Gestion des Mouvements de Stock</h2>
          <p class="text-sky-100 text-lg">Gérez les entrées et sorties de votre inventaire</p>
          
          <div class="flex items-center gap-6 mt-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span class="text-sky-100">Actifs</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-red-400 rounded-full"></div>
              <span class="text-sky-100">Inactifs</span>
            </div>
          </div>
        </div>
      </div>

      <!-- VOTRE CODE ORIGINAL INTACT CI-DESSOUS -->
      <div class="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <div class="flex justify-center mb-6">
          <button
            @click="refreshData"
            :disabled="loading"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Chargement...' : 'Rafraîchir Produits & Mouvements' }}
          </button>
        </div>

        <!-- Formulaire d'enregistrement de mouvement - TOUS VOS CHAMPS CONSERVÉS -->
        <div class="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Enregistrer un Nouveau Mouvement</h3>
          <form @submit.prevent="addMovement">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

        <!-- Historique des mouvements de stock - TOUTES LES COLONNES CONSERVÉES -->
        <div class="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Historique des Mouvements</h3>

          <!-- Filtres pour l'historique -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

          <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead class="bg-sky-300">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-gray-200">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-gray-200">Produit</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-gray-200">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-gray-200">Quantité</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-gray-200">Raison</th>
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium border-b border-gray-200">
                    {{ getMovementTypeLabel(movement.movement_type) }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Mouvements de Stock - Neo Start Tech',
});

const availableProducts = ref([]);
const stockMovements = ref([]);

const newMovement = ref({
  product_id: '',
  movement_type: '',
  quantity: null,
  reason: '',
});

const formLoading = ref(false);
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

const getMovementTypeLabel = (type) => movementTypeLabels[type] || type;

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
  } catch (error) {
    console.error('Erreur lors du chargement des mouvements :', error);
  }
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

    formMessage.value = 'Mouvement enregistré avec succès !';
    formMessageClass.value = 'bg-green-100 text-green-800';

    resetForm();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du mouvement :', error);
    if (error.response?.status === 400 && error.response?.data?.error) {
      formMessage.value = error.response.data.error; 
    } else {
      formMessage.value = error.response?.data?.message || 'Erreur lors de l\'enregistrement du mouvement.';
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
table {
  border-collapse: separate;
  border-spacing: 0;
}

.overflow-x-auto {
  max-width: 100vw;
}

th, td {
  border-right: 1px solid #e5e7eb;
}
th:last-child, td:last-child {
  border-right: none;
}

thead tr th {
  border-radius: 0.375rem 0.375rem 0 0;
}

tbody tr {
  background-color: white;
  transition: background-color 0.15s ease-in-out;
}

tbody tr:hover {
  background-color: #e0f2fe;
}
</style>