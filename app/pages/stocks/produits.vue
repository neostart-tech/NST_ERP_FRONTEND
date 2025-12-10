<template>

  <PageHeader
    title="Gestion des Articles"
    subtitle="Gérez votre inventaire et vos produits"
    :stats="[
      { label: 'Actifs', color: 'bg-green-400' },
      { label: 'Inactifs', color: 'bg-red-400' }
    ]"
  >
    <template #actions>
      <button
        @click="openProductForm()"
        class="group px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
      >
        <div class="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center group-hover:bg-sky-200 transition-colors">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        Ajouter Produit
      </button>
    </template>
  </PageHeader>

  <!-- Section Produits -->
  <Card title="Liste des Produits">
    <template #headerActions>
      <div class="flex space-x-3">
        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
    </template>

    <!-- Tableau des produits -->
    <div class="overflow-x-auto rounded-lg shadow border border-sky-400">
      <table class="min-w-full border border-sky-400 divide-y divide-sky-400">
        <thead class="bg-sky-300">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Référence</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Prix Achat</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Prix Vente</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Prix Min</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Prix Max</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="productsLoading">
            <td colspan="9" class="px-6 py-4 text-center border-b border-sky-400">
              <div class="animate-pulse flex justify-center">
                <div class="h-4 w-4 bg-blue-500 rounded-full mx-1"></div>
                <div class="h-4 w-4 bg-blue-500 rounded-full mx-1"></div>
                <div class="h-4 w-4 bg-blue-500 rounded-full mx-1"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredProducts.length === 0">
            <td colspan="9" class="px-6 py-4 text-center text-gray-500 border-b border-sky-400">
              Aucun produit trouvé
            </td>
          </tr>
          <tr v-for="product in filteredProducts" :key="product.id" class="bg-white hover:bg-sky-100 transition-colors duration-150 border-b border-sky-400">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 border-b border-sky-400">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-sky-400">{{ product.reference }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-sky-400">{{ formatPrice(product.unit_price_purchase) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-sky-400">{{ formatPrice(product.unit_price_sale) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-sky-400">
              {{ product.current_stock }}
              <span v-if="product.min_stock_alert && product.current_stock <= product.min_stock_alert" class="ml-1 text-red-500">⚠</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-sky-400">{{ formatPrice(product.min_sale_price_company) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-sky-400">{{ formatPrice(product.max_sale_price_company) }}</td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-sky-400">
              <span :class="product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ product.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap flex gap-2 border-b border-sky-400">
              <button
                @click="openProductForm(product.id)"
                class="text-blue-600 hover:text-blue-800 cursor-pointer p-2 rounded transition action-btn"
                title="Modifier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0v2a2 2 0 002 2h2"/>
                </svg>
              </button>
              <button
                @click="confirmDelete(product.id)"
                class="text-red-600 hover:text-red-800 cursor-pointer p-2 rounded transition action-btn"
                title="Supprimer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>

  <!-- Modale de formulaire produit -->
  <div v-if="showProductFormModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <h3 class="text-lg font-bold mb-4">{{ editingProductId ? 'Modifier' : 'Ajouter' }} un produit</h3>

        <form @submit.prevent="submitProductForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne 1 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom du produit*</label>
                <input v-model="currentProduct.name" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Référence*</label>
                <input v-model="currentProduct.reference" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="currentProduct.description" rows="3" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div class="flex items-center">
                <input type="checkbox" v-model="currentProduct.is_active" id="is_active" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                <label for="is_active" class="ml-2 block text-sm text-gray-700">Produit actif</label>
              </div>
            </div>

            <!-- Colonne 2 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix d'achat (FCFA)*</label>
                <input type="number" v-model.number="currentProduct.unit_price_purchase" min="0" step="0.01" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix de vente (FCFA)*</label>
                <input type="number" v-model.number="currentProduct.unit_price_sale" min="0" step="0.01" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <p v-if="currentProduct.unit_price_sale && currentProduct.unit_price_purchase && currentProduct.unit_price_sale < currentProduct.unit_price_purchase" class="text-red-600 text-sm mt-1">
                  ⚠ Le prix de vente doit être supérieur ou égal au prix d'achat.
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock actuel*</label>
                <input type="number" v-model.number="currentProduct.current_stock" min="0" required class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Seuil d'alerte stock</label>
                <input type="number" v-model.number="currentProduct.min_stock_alert" min="0" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix min entreprise (FCFA)</label>
                <input type="number" v-model.number="currentProduct.min_sale_price_company" min="0" step="0.01" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix max entreprise (FCFA)</label>
                <input type="number" v-model.number="currentProduct.max_sale_price_company" min="0" step="0.01" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <p v-if="currentProduct.min_sale_price_company && currentProduct.max_sale_price_company && currentProduct.min_sale_price_company > currentProduct.max_sale_price_company" class="text-red-600 text-sm mt-1">
                  ⚠ Le prix minimum ne doit pas dépasser le prix maximum.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showProductFormModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" :disabled="formLoading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ formLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import Card from '~/app/components/ui/Card.vue';
import PageHeader from '~/app/components/ui/PageHeader.vue';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase || '/api';

const products = ref([]);
const productsLoading = ref(true);
const filterStatus = ref('');
const showProductFormModal = ref(false);
const editingProductId = ref(null);
const currentProduct = ref(getDefaultProduct());
const formLoading = ref(false);

const filteredProducts = computed(() => {
  let results = products.value;
  if (filterStatus.value) {
    results = results.filter(p =>
      filterStatus.value === 'active' ? p.is_active : !p.is_active
    );
  }
  return results;
});

function getDefaultProduct() {
  return {
    name: '',
    reference: '',
    description: '',
    unit_price_purchase: 0,
    unit_price_sale: 0,
    current_stock: 0,
    min_stock_alert: 0,
    min_sale_price_company: null,
    max_sale_price_company: null,
    is_active: true
  };
}

function formatPrice(price) {
  if (price === null || price === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
}

const fetchProducts = async () => {
  try {
    productsLoading.value = true;
    const data = await $fetch(`${apiBase}/products`);
    products.value = data || [];
  } catch (error) {
    console.error("Erreur chargement produits:", error);
  } finally {
    productsLoading.value = false;
  }
};

const openProductForm = (id = null) => {
  editingProductId.value = id;
  currentProduct.value = id
    ? { ...products.value.find(p => p.id === id) }
    : getDefaultProduct();
  showProductFormModal.value = true;
};

const submitProductForm = async () => {
  // ✅ Vérifications avant soumission
  if (
    currentProduct.value.min_sale_price_company &&
    currentProduct.value.max_sale_price_company &&
    currentProduct.value.min_sale_price_company > currentProduct.value.max_sale_price_company
  ) {
    alert("❌ Le prix minimum ne doit pas dépasser le prix maximum.");
    return;
  }

  if (
    currentProduct.value.unit_price_sale &&
    currentProduct.value.unit_price_purchase &&
    currentProduct.value.unit_price_sale < currentProduct.value.unit_price_purchase
  ) {
    alert("❌ Le prix de vente doit être supérieur ou égal au prix d'achat.");
    return;
  }

  formLoading.value = true;
  try {
    const url = editingProductId.value
      ? `${apiBase}/products/${editingProductId.value}`
      : `${apiBase}/products`;
    const method = editingProductId.value ? 'PUT' : 'POST';

    await $fetch(url, {
      method,
      body: currentProduct.value
    });

    await fetchProducts();
    showProductFormModal.value = false;
  } catch (error) {
    console.error("Erreur soumission formulaire:", error);
    alert("Erreur lors de l'enregistrement du produit.");
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = async (id) => {
  const confirmation = window.confirm("⚠️ Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.");
  if (!confirmation) return;

  try {
    await $fetch(`${apiBase}/products/${id}`, { method: 'DELETE' });
    alert("✅ Produit supprimé avec succès.");
    await fetchProducts();
  } catch (error) {
    console.error("Erreur suppression:", error);
    alert("❌ Impossible de supprimer ce produit. Il pourrait être lié à d'autres données.");
  }
};

onMounted(fetchProducts);
</script>

<style scoped>
.action-btn {
  position: relative;
  z-index: 10;
}

table {
  border-collapse: separate;
  border-spacing: 0;
}

.overflow-x-auto {
  max-width: 100vw;
}

th, td {
  border-right: 1px solid #0ea5e9; /* sky-400 */
}
th:last-child, td:last-child {
  border-right: none;
}
</style>
