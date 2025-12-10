<template>
    <div class="p-8 bg-gray-100 min-h-screen">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

        <!-- Section des cartes de statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <!-- Carte 1: Valeur Totale du Stock -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-500 font-medium">Valeur Totale du Stock</p>
                    <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ formatPrice(totalStockValue) }}</h3>
                    <p class="text-xs text-gray-600">{{ totalProducts }} produits en stock</p>
                </div>
                <div class="flex items-center text-blue-500 text-sm font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    Stock
                </div>
            </div>

            <!-- Carte 2: Bénéfices Potentiels -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-500 font-medium">Bénéfices Potentiels</p>
                    <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ formatPrice(totalPotentialProfit) }}</h3>
                    <p class="text-xs text-gray-600">Marge sur stock actuel</p>
                </div>
                <div class="flex items-center text-green-500 text-sm font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path></svg>
                    +{{ profitPercentage }}%
                </div>
            </div>

            <!-- Carte 3: Alertes Stock -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-500 font-medium">Alertes Stock</p>
                    <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ stockAlerts.length }}</h3>
                    <p class="text-xs text-gray-600">Produits en alerte</p>
                </div>
                <div class="flex items-center text-red-500 text-sm font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    Attention
                </div>
            </div>

            <!-- Carte 4: Produits Actifs -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-500 font-medium">Produits Actifs</p>
                    <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ activeProducts }}</h3>
                    <p class="text-xs text-gray-600">Sur {{ totalProducts }} total</p>
                </div>
                <div class="flex items-center text-blue-500 text-sm font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    {{ activePercentage }}%
                </div>
            </div>
        </div>

        <!-- Section des Alertes Stock -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800">Alertes Stock</h2>
                <NuxtLink to="/alertes" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    Voir tout
                    <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </NuxtLink>
            </div>
            
            <div v-if="loading" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p class="text-gray-500 mt-2">Chargement des alertes...</p>
            </div>
            
            <div v-else-if="stockAlerts.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <p class="text-green-700 font-semibold">Aucune alerte stock</p>
                <p class="text-gray-500 text-sm">Tous vos produits sont bien approvisionnés</p>
            </div>
            
            <div v-else class="space-y-3">
                <div v-for="alert in stockAlerts.slice(0, 5)" :key="alert.id" 
                     class="p-4 border rounded-lg"
                     :class="alert.type === 'rupture' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="font-semibold text-gray-800">{{ alert.name }}</h4>
                            <p class="text-sm text-gray-600">Stock: {{ alert.current_stock }} / Seuil: {{ alert.min_stock_alert }}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-semibold rounded-full"
                              :class="alert.type === 'rupture' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'">
                            {{ alert.type === 'rupture' ? 'Rupture' : 'Alerte' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section Graphique et Performance -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <!-- Graphique de répartition -->
            <StockChart :products="products" :loading="loading" />
            
            <!-- Performance du Stock -->
            <PerformanceStats :products="products" :loading="loading" />
        </div>
        
        <!-- Section Top Produits par Valeur -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800">Top Produits par Valeur</h2>
                <NuxtLink to="/produits" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    Voir tous les produits
                    <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </NuxtLink>
            </div>
            
            <div v-if="loading" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p class="text-gray-500 mt-2">Chargement des produits...</p>
            </div>
            
            <div v-else class="space-y-4">
                <div v-for="(product, index) in topProductsByValue" :key="product.id" 
                     class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div class="flex items-center space-x-4">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-sm font-semibold text-blue-600">{{ index + 1 }}</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">{{ product.name }}</h4>
                            <p class="text-sm text-gray-600">Stock: {{ product.current_stock }} unités</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-gray-800">{{ formatPrice(product.stockValue) }}</p>
                        <p class="text-sm text-gray-500">Prix: {{ formatPrice(product.unit_price_sale) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section Actions Rapides -->
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actions Rapides</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NuxtLink to="/produits" class="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg shadow transition duration-200 text-center">
                    <span class="font-semibold">Gérer les Produits</span>
                </NuxtLink>
                <NuxtLink to="/mouvements" class="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg shadow transition duration-200 text-center">
                    <span class="font-semibold">Mouvements Stock</span>
                </NuxtLink>
                <NuxtLink to="/alertes" class="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg shadow transition duration-200 text-center">
                    <span class="font-semibold">Voir Alertes</span>
                </NuxtLink>
                <NuxtLink to="/marges" class="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg shadow transition duration-200 text-center">
                    <span class="font-semibold">Analyser Marges</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import axios from 'axios';
import StockChart from './StockChart.vue';
import PerformanceStats from './PerformanceStats.vue';

const config = useRuntimeConfig();
const apiBase = config.public.apiBase || '/api';

// Données réactives
const products = ref([]);
const stockAlerts = ref([]);
const loading = ref(true);

// Formatage des prix
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
};

// Calculs des statistiques
const totalProducts = computed(() => products.value.length);

const activeProducts = computed(() => 
    products.value.filter(p => p.is_active).length
);

const activePercentage = computed(() => 
    totalProducts.value > 0 ? Math.round((activeProducts.value / totalProducts.value) * 100) : 0
);

const totalStockValue = computed(() => 
    products.value.reduce((total, product) => {
        return total + (product.current_stock * product.unit_price_sale);
    }, 0)
);

const totalPotentialProfit = computed(() => 
    products.value.reduce((total, product) => {
        const unitProfit = product.unit_price_sale - product.unit_price_purchase;
        return total + (unitProfit * product.current_stock);
    }, 0)
);

const profitPercentage = computed(() => {
    if (totalStockValue.value === 0) return 0;
    return Math.round((totalPotentialProfit.value / totalStockValue.value) * 100);
});

const topProductsByValue = computed(() => {
    return products.value
        .map(product => ({
            ...product,
            stockValue: product.current_stock * product.unit_price_sale
        }))
        .sort((a, b) => b.stockValue - a.stockValue)
        .slice(0, 5);
});

// Fonctions pour récupérer les données
const fetchProducts = async () => {
    try {
        const response = await axios.get(`${apiBase}/products`);
        products.value = response.data || [];
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        products.value = [];
    }
};

const fetchStockAlerts = async () => {
    try {
        const response = await axios.get(`${apiBase}/stock-alerts`);
        stockAlerts.value = response.data || [];
    } catch (error) {
        console.error('Erreur lors du chargement des alertes:', error);
        stockAlerts.value = [];
    }
};

const fetchDashboardData = async () => {
    loading.value = true;
    try {
        await Promise.all([fetchProducts(), fetchStockAlerts()]);
    } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
    } finally {
        loading.value = false;
    }
};

// Charger les données au montage du composant
onMounted(() => {
    fetchDashboardData();
    
    // Rafraîchir les données toutes les 5 minutes
    setInterval(fetchDashboardData, 300000);
});
</script>

<style scoped>
/* Les styles Tailwind CSS sont appliqués directement dans le template */
</style>
