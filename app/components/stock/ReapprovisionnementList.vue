<template>
    <div class="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <h2 class="text-3xl font-bold text-center text-blue-800 mb-4">Réapprovisionnement</h2>
        <p class="text-center text-gray-600 mb-8">Produits en dessous du seuil minimum. Génération rapide de commande fournisseur.</p>

        <!-- Filtres de recherche -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher un produit"
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <select
                v-model="selectedCategory"
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
                <option value="">Catégories</option>
                <option value="electronique">Électronique</option>
                <option value="bureautique">Bureautique</option>
                <option value="consommables">Consommables</option>
            </select>
            <select
                v-model="selectedStatus"
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
                <option value="">Statuts</option>
                <option value="low_stock">Seuil bas</option>
                <option value="ordered">Commandé</option>
            </select>
        </div>

        <!-- Tableau des produits à réapprovisionner -->
        <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seuil min</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="filteredProducts.length === 0 && !loading">
                        <td colspan="5" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                            Aucun produit ne nécessite de réapprovisionnement pour le moment.
                        </td>
                    </tr>
                    <tr v-for="product in filteredProducts" :key="product.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.current_stock }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.min_stock_alert }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.supplier }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                @click="commanderProduit(product)"
                                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-xs transition duration-200"
                            >
                                Commander
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Messages de chargement ou d'erreur -->
        <div v-if="loading" class="mt-6 p-4 text-center text-blue-600">
            Chargement des produits...
        </div>
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-300 text-center">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// import axios from 'axios'; // Décommenter si vous voulez utiliser Axios avec l'API réelle

// Données réactives
const products = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const loading = ref(false); // Mis à false car données simulées
const errorMessage = ref('');

// Données simulées pour les produits à réapprovisionner
const simulatedProductsToReorder = [
    { id: 1, name: 'Imprimante HP', reference: 'HP-LJ-M100', current_stock: 4, min_stock_alert: 10, supplier: 'K-LINK Togo', category: 'bureautique' },
    { id: 2, name: 'Souris sans fil', reference: 'MS-WIRELESS', current_stock: 2, min_stock_alert: 5, supplier: 'Tech Supply', category: 'electronique' },
    { id: 3, name: 'Clé USB 64Go', reference: 'USB-64GB', current_stock: 7, min_stock_alert: 10, supplier: 'Global Parts', category: 'electronique' },
    { id: 4, name: 'Ramette de papier A4', reference: 'PAPER-A4', current_stock: 10, min_stock_alert: 20, supplier: 'Office Depot', category: 'consommables' },
];

// Fonction pour simuler la récupération des produits en alerte
const fetchLowStockProductsSimulated = async () => {
    loading.value = true;
    errorMessage.value = '';
    await new Promise(resolve => setTimeout(resolve, 500)); // Simule un délai

    try {
        products.value = simulatedProductsToReorder;
    } catch (error) {
        console.error('Erreur simulée lors du chargement des produits en alerte :', error);
        errorMessage.value = 'Impossible de charger les produits en réapprovisionnement (simulé).';
    } finally {
        loading.value = false;
    }
};

// Filtrage des produits basés sur la recherche, catégorie et statut
const filteredProducts = computed(() => {
    let filtered = products.value;

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.reference.toLowerCase().includes(query)
        );
    }

    if (selectedCategory.value) {
        filtered = filtered.filter(product => product.category === selectedCategory.value);
    }

    // Le filtre de statut est plus complexe car nos données simulées n'ont pas de statut 'ordered'
    // Ici, nous filtrons juste par 'low_stock' qui est implicite pour ces produits
    if (selectedStatus.value === 'low_stock') {
        filtered = filtered.filter(product => product.current_stock <= product.min_stock_alert);
    }

    return filtered;
});

// Action de commander un produit (simulée pour l'instant)
const commanderProduit = (product) => {
    alert(`Commande de ${product.name} (Quantité: ${product.min_stock_alert - product.current_stock} pour atteindre le seuil min) auprès de ${product.supplier}.`);
    // Ici, vous implémenteriez la logique réelle de création d'une commande fournisseur
};

// Charger les produits dès que le composant est monté
onMounted(() => {
    fetchLowStockProductsSimulated();
});
</script>

<style scoped>
/* Les styles Tailwind CSS sont appliqués directement dans le template */
</style>
