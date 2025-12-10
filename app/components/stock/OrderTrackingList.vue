<template>
    <div class="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <h2 class="text-3xl font-bold text-center text-blue-800 mb-4">Suivi des Commandes</h2>
        <p class="text-center text-gray-600 mb-8">Visualisez toutes les commandes clients ou fournisseurs avec leur statut et détail complet.</p>

        <!-- Filtres de recherche -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher commande"
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <select
                v-model="selectedStatus"
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
                <option value="">Statuts</option>
                <option value="En cours">En cours</option>
                <option value="Livrée">Livrée</option>
                <option value="Annulée">Annulée</option>
                <!-- Ajoutez d'autres statuts selon votre backend -->
            </select>
            <input
                type="date"
                v-model="selectedDate"
                class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
        </div>

        <!-- Tableau des commandes -->
        <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client/Fournisseur</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="filteredOrders.length === 0 && !loading">
                        <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                            Aucune commande trouvée.
                        </td>
                    </tr>
                    <tr v-for="order in filteredOrders" :key="order.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.orderNumber }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.partyName }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.amount }} FCFA</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                {{ order.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                @click="viewDetails(order.id)"
                                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-xs transition duration-200"
                            >
                                Détails
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Messages de chargement ou d'erreur -->
        <div v-if="loading" class="mt-6 p-4 text-center text-blue-600">
            Chargement des commandes...
        </div>
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-300 text-center">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// import axios from 'axios'; // Décommenter si vous voulez utiliser Axios avec l'API réelle
// import { useRouter } from 'vue-router'; // Décommenter si vous utilisez useRouter

// const router = useRouter(); // Décommenter si vous utilisez useRouter

// Données réactives
const orders = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDate = ref('');
const loading = ref(false); // Mis à false car données simulées
const errorMessage = ref('');

// Données simulées pour les commandes
const simulatedOrders = [
    { id: 1, orderNumber: 'CMD-1001', partyName: 'Entreprise Alpha', date: '2025-07-13', amount: 245000, status: 'En cours' },
    { id: 2, orderNumber: 'CMD-1002', partyName: 'Client Beta', date: '2025-07-12', amount: 12000, status: 'Livrée' },
    { id: 3, orderNumber: 'PO-2025-001', partyName: 'Fournisseur Gamma', date: '2025-07-10', amount: 50000, status: 'En cours' },
    { id: 4, orderNumber: 'CMD-1003', partyName: 'Client Delta', date: '2025-07-11', amount: 75000, status: 'Annulée' },
    { id: 5, orderNumber: 'PO-2025-002', partyName: 'Fournisseur Epsilon', date: '2025-07-08', amount: 120000, status: 'Livrée' },
];

// Fonction pour simuler la récupération des commandes
const fetchOrdersSimulated = async () => {
    loading.value = true;
    errorMessage.value = '';
    await new Promise(resolve => setTimeout(resolve, 500)); // Simule un délai

    try {
        orders.value = simulatedOrders;
    } catch (error) {
        console.error('Erreur simulée lors du chargement des commandes :', error);
        errorMessage.value = 'Impossible de charger les commandes (simulé).';
    } finally {
        loading.value = false;
    }
};

// Filtrage des commandes
const filteredOrders = computed(() => {
    let filtered = orders.value;

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(order =>
            order.orderNumber.toLowerCase().includes(query) ||
            order.partyName.toLowerCase().includes(query)
        );
    }

    if (selectedStatus.value) {
        filtered = filtered.filter(order => order.status === selectedStatus.value);
    }

    if (selectedDate.value) {
        filtered = filtered.filter(order => order.date === selectedDate.value);
    }

    return filtered;
});

// Détermine les classes CSS pour le statut
const getStatusClass = (status) => {
    switch (status) {
        case 'En cours':
            return 'bg-yellow-100 text-yellow-800';
        case 'Livrée':
            return 'bg-green-100 text-green-800';
        case 'Annulée':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Action de voir les détails d'une commande (simulée)
const viewDetails = (orderId) => {
    alert(`Afficher les détails de la commande ID: ${orderId}`);
    // Ici, vous redirigeriez vers une page de détails de commande
    // router.push(`/commandes/${orderId}`);
};

// Charger les commandes dès que le composant est monté
onMounted(() => {
    fetchOrdersSimulated();
});
</script>

<style scoped>
/* Les styles Tailwind CSS sont appliqués directement dans le template */
</style>
