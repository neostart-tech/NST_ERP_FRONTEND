<template>
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">Répartition du Stock</h2>
            <div class="flex space-x-2">
                <button 
                    @click="chartType = 'value'"
                    :class="chartType === 'value' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                    Par Valeur
                </button>
                <button 
                    @click="chartType = 'quantity'"
                    :class="chartType === 'quantity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
                    class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                    Par Quantité
                </button>
            </div>
        </div>
        
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Chargement du graphique...</p>
        </div>
        
        <div v-else-if="chartData.length === 0" class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <p class="text-gray-500 font-medium">Aucune donnée disponible</p>
            <p class="text-gray-400 text-sm">Ajoutez des produits pour voir les statistiques</p>
        </div>
        
        <div v-else class="space-y-4">
            <!-- Graphique en barres -->
            <div class="h-64 flex items-end justify-between space-x-2">
                <div 
                    v-for="(item, index) in chartData" 
                    :key="index"
                    class="flex-1 flex flex-col items-center"
                >
                    <div 
                        class="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                        :style="{ height: `${item.percentage}%` }"
                        :title="`${item.name}: ${formatValue(item.value)}`"
                    ></div>
                    <div class="mt-2 text-center">
                        <p class="text-xs font-medium text-gray-700 truncate w-full">{{ item.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatValue(item.value) }}</p>
                    </div>
                </div>
            </div>
            
            <!-- Légende -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
                <div 
                    v-for="(item, index) in chartData" 
                    :key="index"
                    class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                >
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-700 truncate">{{ item.name }}</p>
                        <p class="text-xs text-gray-500">{{ item.percentage.toFixed(1) }}%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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

const chartType = ref('value');

// Formatage des valeurs
const formatValue = (value) => {
    if (chartType.value === 'value') {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value);
    } else {
        return `${value} unités`;
    }
};

// Calcul des données du graphique
const chartData = computed(() => {
    if (!props.products || props.products.length === 0) return [];
    
    let data = [];
    
    if (chartType.value === 'value') {
        // Par valeur de stock
        data = props.products
            .map(product => ({
                name: product.name,
                value: product.current_stock * product.unit_price_sale
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    } else {
        // Par quantité
        data = props.products
            .map(product => ({
                name: product.name,
                value: product.current_stock
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }
    
    // Calculer les pourcentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return data.map(item => ({
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0
    }));
});

// Réinitialiser le type de graphique quand les produits changent
watch(() => props.products, () => {
    if (props.products.length === 0) {
        chartType.value = 'value';
    }
});
</script>

<style scoped>
/* Styles pour les transitions fluides */
.transition-all {
    transition: all 0.3s ease-in-out;
}
</style>

