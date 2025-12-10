<template>

  <!-- Conteneur principal de la page, centré et stylisé -->
  <div class="max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">

    <!-- En-tête de la page avec un dégradé -->
    <div class="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl shadow-md p-6 text-white mb-6">
      <h2 class="text-3xl font-bold mb-1">Rapport de Bénéfices Prévisionnels</h2>
      <p class="text-teal-100">Analysez la rentabilité de chaque article de votre inventaire.</p>
    </div>

    <!-- Section du rapport -->
    <Card title="Détails des Bénéfices par Produit">

      <!-- Affichage du message de chargement ou de l'erreur -->
      <div v-if="productsLoading" class="text-center py-8">
        <p class="text-lg text-gray-600">Calcul des bénéfices en cours...</p>
      </div>

      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <!-- Tableau des produits avec les bénéfices -->
      <div v-if="!productsLoading && !errorMessage" class="overflow-x-auto rounded-lg shadow border border-teal-400">
        <table class="min-w-full border border-teal-400 divide-y divide-teal-400">
          <thead class="bg-teal-300">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Nom du produit</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Référence</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Prix d'achat</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Prix de vente</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Bénéfice unitaire</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Stock actuel</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-400">Bénéfice prévu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productsWithProfit" :key="product.id" class="bg-white hover:bg-teal-100 transition-colors duration-150 border-b border-teal-400">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 border-b border-teal-400">{{ product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500 border-b border-teal-400">{{ product.reference }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-gray-500 border-b border-teal-400">{{ formatPrice(product.unit_price_purchase) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-gray-500 border-b border-teal-400">{{ formatPrice(product.unit_price_sale) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-semibold" :class="profitColor(product.unitProfit)">
                {{ formatPrice(product.unitProfit) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-gray-500 border-b border-teal-400">{{ product.current_stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-bold" :class="profitColor(product.profit)">
                {{ formatPrice(product.profit) }}
              </td>
            </tr>
            <tr v-if="productsWithProfit.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 border-b border-teal-400">
                Aucun produit trouvé pour le calcul des bénéfices.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total des bénéfices -->
      <div class="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <p class="text-lg font-semibold text-gray-800">
          Total des bénéfices prévus :
          <span :class="profitColor(totalProfit)" class="ml-2 font-bold">{{ formatPrice(totalProfit) }}</span>
        </p>
      </div>

    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import Card from '~/app/components/ui/Card.vue';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase || '/api';

const products = ref([]);
const productsLoading = ref(true);
const errorMessage = ref('');

// Fonction pour récupérer les produits de l'API
const fetchProducts = async () => {
  productsLoading.value = true;
  errorMessage.value = '';
  try {
    const data = await $fetch(`${apiBase}/products`);
    products.value = data || [];
  } catch (error) {
    console.error("Erreur chargement produits:", error);
    errorMessage.value = "Erreur lors du chargement des produits. Veuillez vérifier la connexion à l'API.";
  } finally {
    productsLoading.value = false;
  }
};

// Calcule le bénéfice pour chaque produit
const productsWithProfit = computed(() => {
  return products.value.map(p => {
    const unitProfit = p.unit_price_sale - p.unit_price_purchase;
    const profit = unitProfit * p.current_stock;
    return {
      ...p,
      unitProfit: parseFloat(unitProfit.toFixed(2)),
      profit: parseFloat(profit.toFixed(2))
    };
  });
});

// Calcule le total des bénéfices
const totalProfit = computed(() => {
  return productsWithProfit.value.reduce((total, product) => total + product.profit, 0);
});

// Formatage du prix en FCFA
function formatPrice(price) {
  if (price === null || price === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
}

// Détermine la classe couleur pour le bénéfice
function profitColor(profit) {
  if (profit > 0) {
    return 'text-teal-600'; // remplacé le vert par bleu/teal
  } else if (profit < 0) {
    return 'text-red-600';
  } else {
    return 'text-gray-600';
  }
}

onMounted(fetchProducts);
</script>

<style scoped>
/* Styles de bordure pour le tableau */
table {
  border-collapse: separate;
  border-spacing: 0;
}
th, td {
  border-right: 1px solid #14b8a6; /* teal-400 */
}
th:last-child, td:last-child {
  border-right: none;
}
</style>
