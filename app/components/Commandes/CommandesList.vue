<template>
  <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h1 class="text-3xl font-bold mb-6 text-blue-800">Suivi des Commandes</h1>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher une commande..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
      <select
        v-model="selectedStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      >
        <option value="">Tous les statuts</option>
        <option>En cours</option>
        <option>Livrée</option>
        <option>Annulée</option>
        <option>En attente</option>
      </select>
      <input
        v-model="selectedDate"
        type="date"
        class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
    </div>

    <!-- Liste des commandes -->
    <div v-if="loading" class="text-center text-blue-600 font-medium py-8">Chargement des commandes...</div>
    <div v-else-if="errorMessage" class="text-center text-red-500 font-medium py-8">{{ errorMessage }}</div>
    <div v-else-if="filteredOrders.length === 0" class="text-center text-gray-500 py-8">Aucune commande trouvée.</div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Commande</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fournisseur</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Montant</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 text-sm font-medium text-gray-900">#{{ order.id }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(order.order_date) }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ order.supplier?.name ?? 'N/A' }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ formatCurrency(order.total_amount) }}</td>
            <td class="px-4 py-3">
              <span :class="['text-xs font-medium px-2 py-1 rounded-full', getStatusClass(order.status)]">
                {{ order.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <CrudButtons
                :show-view="true"
                @view="viewDetails(order.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import CrudButtons from '~/components/ui/CrudButtons.vue';

const orders = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDate = ref('');
const loading = ref(false);
const errorMessage = ref('');

const toast = useToast();

const fetchOrders = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get('http://localhost:8000/api/purchase-orders');
    orders.value = response.data.data ?? response.data;
    toast.success('Commandes chargées avec succès ✅');
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Erreur lors de la récupération des commandes.';
    toast.error('Erreur lors du chargement des commandes ❌');
  } finally {
    loading.value = false;
  }
};

const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.supplier?.name?.toLowerCase().includes(q)
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value);
  }

  if (selectedDate.value) {
    filtered = filtered.filter(order => order.order_date === selectedDate.value);
  }

  return filtered;
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
};

const getStatusClass = (status) => {
  switch (status) {
    case 'En cours':
      return 'bg-yellow-100 text-yellow-800';
    case 'Livrée':
      return 'bg-green-100 text-green-800';
    case 'Annulée':
      return 'bg-red-100 text-red-800';
    case 'En attente':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const viewDetails = (id) => {
  alert(`Voir les détails de la commande #${id}`);
};

onMounted(() => {
  fetchOrders();
});
</script>
