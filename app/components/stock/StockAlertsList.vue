<template>
    <div class="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <h2 class="text-3xl font-bold text-center text-blue-800 mb-8">Alertes de Stock</h2>

        <div v-if="loading" class="text-center text-blue-600 py-8">
            Chargement des alertes de stock...
        </div>

        <div v-else-if="errorMessage" class="p-4 bg-red-100 text-red-800 rounded-md border border-red-300 text-center">
            {{ errorMessage }}
        </div>

        <div v-else-if="alerts.length === 0" class="p-4 bg-gray-50 text-gray-600 rounded-md border border-gray-300 text-center">
            Aucune alerte de stock à afficher pour le moment.
        </div>

        <div v-else>
            <StockAlertCard
                v-for="alert in alerts"
                :key="alert.id"
                :alert="alert"
                @commander="handleCommander"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import axios from 'axios'; // Décommenter si vous voulez utiliser Axios avec l'API réelle
// L'auto-importation de StockAlertCard fonctionne car il est dans components/stock/

const alerts = ref([]);
const loading = ref(false); // Mis à false car données simulées
const errorMessage = ref('');

// Données simulées pour les alertes de stock
const simulatedProducts = [
    { id: 1, name: 'Toner Samsung 305', current_stock: 0, min_stock_alert: 6 }, // Rupture
    { id: 2, name: 'Clavier Mécanique RGB', current_stock: 3, min_stock_alert: 7 }, // Alerte
    { id: 3, name: 'Souris Ergonomique', current_stock: 1, min_stock_alert: 1 }, // Rupture (si seuil atteint ou dépassé)
    { id: 4, name: 'Écran 27 pouces 4K', current_stock: 12, min_stock_alert: 5 }, // Info (stock suffisant)
    { id: 5, name: 'Câble HDMI 2m', current_stock: 4, min_stock_alert: 5 }, // Alerte
];

// Fonction pour simuler la récupération des alertes de stock
const fetchStockAlertsSimulated = async () => {
    loading.value = true;
    errorMessage.value = '';
    await new Promise(resolve => setTimeout(resolve, 500)); // Simule un délai

    try {
        alerts.value = simulatedProducts.map(product => {
            let type = 'Info'; // Par défaut
            if (product.current_stock === 0) {
                type = 'Rupture';
            } else if (product.current_stock <= product.min_stock_alert) {
                type = 'Alerte';
            }

            return {
                id: product.id,
                type: type,
                productName: product.name,
                currentStock: product.current_stock,
                minStockAlert: product.min_stock_alert,
                productId: product.id,
            };
        });
    } catch (error) {
        console.error('Erreur simulée lors du chargement des alertes :', error);
        errorMessage.value = 'Impossible de charger les alertes de stock (simulé).';
    } finally {
        loading.value = false;
    }
};

// Gérer l'événement 'commander' émis par StockAlertCard
const handleCommander = (productId) => {
    alert(`Action 'Commander' déclenchée pour le produit ID: ${productId}.`);
    // Ici, vous redirigeriez vers le formulaire de commande ou ouvririez une modale.
    // useRouter().push(`/commandes/create?productId=${productId}`);
};

// Charger les alertes dès que le composant est monté
onMounted(() => {
    fetchStockAlertsSimulated();
});
</script>

<style scoped>
/* Aucun style spécifique ici, Tailwind CSS est suffisant */
</style>
