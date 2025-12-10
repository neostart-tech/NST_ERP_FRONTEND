<template>
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Performance du Stock</h2>
        
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Chargement des statistiques...</p>
        </div>
        
        <div v-else class="space-y-6">
            <!-- Rotation du stock -->
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">Rotation du Stock</p>
                        <p class="text-sm text-gray-600">Moyenne des produits</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-blue-600">{{ averageStockRotation.toFixed(1) }}</p>
                    <p class="text-xs text-gray-500">jours</p>
                </div>
            </div>
            
            <!-- Marge moyenne -->
            <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">Marge Moyenne</p>
                        <p class="text-sm text-gray-600">Par produit</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-green-600">{{ averageMargin.toFixed(1) }}%</p>
                    <p class="text-xs text-gray-500">moyenne</p>
                </div>
            </div>
            
            <!-- Produits en rupture -->
            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">Produits en Rupture</p>
                        <p class="text-sm text-gray-600">Stock à zéro</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-red-600">{{ outOfStockCount }}</p>
                    <p class="text-xs text-gray-500">produits</p>
                </div>
            </div>
            
            <!-- Produits en alerte -->
            <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">Produits en Alerte</p>
                        <p class="text-sm text-gray-600">Sous le seuil</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-yellow-600">{{ lowStockCount }}</p>
                    <p class="text-xs text-gray-500">produits</p>
                </div>
            </div>
        </div>
        
        <!-- Résumé des indicateurs -->
        <div v-if="!loading" class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Indicateurs Clés</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <p class="text-2xl font-bold text-blue-600">{{ stockEfficiency.toFixed(1) }}%</p>
                    <p class="text-xs text-gray-600">Efficacité Stock</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <p class="text-2xl font-bold text-green-600">{{ profitabilityIndex.toFixed(1) }}</p>
                    <p class="text-xs text-gray-600">Indice Rentabilité</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    products: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

// Calculs des statistiques de performance
const averageStockRotation = computed(() => {
    if (!props.products || props.products.length === 0) return 0;
    
    // Simulation de la rotation du stock (en jours)
    // Dans un vrai système, cela viendrait des mouvements de stock
    const totalStock = props.products.reduce((sum, product) => sum + product.current_stock, 0);
    const averageStock = totalStock / props.products.length;
    
    // Simulation basée sur la valeur moyenne du stock
    return averageStock > 0 ? 30 / (averageStock / 10) : 0;
});

const averageMargin = computed(() => {
    if (!props.products || props.products.length === 0) return 0;
    
    const margins = props.products
        .filter(product => product.unit_price_sale > 0 && product.unit_price_purchase > 0)
        .map(product => {
            const margin = product.unit_price_sale - product.unit_price_purchase;
            return (margin / product.unit_price_sale) * 100;
        });
    
    return margins.length > 0 ? margins.reduce((sum, margin) => sum + margin, 0) / margins.length : 0;
});

const outOfStockCount = computed(() => {
    if (!props.products) return 0;
    return props.products.filter(product => product.current_stock === 0).length;
});

const lowStockCount = computed(() => {
    if (!props.products) return 0;
    return props.products.filter(product => 
        product.current_stock > 0 && 
        product.current_stock <= product.min_stock_alert
    ).length;
});

const stockEfficiency = computed(() => {
    if (!props.products || props.products.length === 0) return 0;
    
    const activeProducts = props.products.filter(product => product.is_active);
    const wellStockedProducts = activeProducts.filter(product => 
        product.current_stock > product.min_stock_alert
    );
    
    return activeProducts.length > 0 ? (wellStockedProducts.length / activeProducts.length) * 100 : 0;
});

const profitabilityIndex = computed(() => {
    if (!props.products || props.products.length === 0) return 0;
    
    const totalValue = props.products.reduce((sum, product) => 
        sum + (product.current_stock * product.unit_price_sale), 0
    );
    
    const totalCost = props.products.reduce((sum, product) => 
        sum + (product.current_stock * product.unit_price_purchase), 0
    );
    
    return totalCost > 0 ? totalValue / totalCost : 0;
});
</script>

<style scoped>
/* Styles pour les animations */
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>

