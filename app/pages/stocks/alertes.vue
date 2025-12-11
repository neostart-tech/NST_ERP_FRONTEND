<template>
	<div class="p-6 bg-gray-50 min-h-screen">
		<PageHeader
			title="Alertes de Stock"
			subtitle="Surveillez les seuils critiques et les ruptures de stock."
			:stats="headerStats"
		/>

		<div class="mt-8">
			<div v-if="loading" class="flex justify-center items-center p-10">
				<Loader message="Chargement des alertes..." />
			</div>

			<div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
				<p class="font-bold">Erreur</p>
				<p>Impossible de charger les alertes de stock. Veuillez réessayer plus tard.</p>
			</div>

			<div v-else-if="alerts.length === 0">
				<EmptyState
					title="Tout est en ordre !"
					description="Aucun produit n'est actuellement en rupture de stock ou en dessous du seuil d'alerte."
					icon="heroicons:check-badge"
					icon-color="text-green-500"
				/>
			</div>

			<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<StockAlertCard
					v-for="alert in alerts"
					:key="alert.id"
					:alert="alert"
					@commander="handleCommander"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import PageHeader from '~/app/components/ui/PageHeader.vue';
import StockAlertCard from '~/app/components/stock/StockAlertCard.vue';
import Loader from '~/app/components/Loader.vue';
import EmptyState from '~/app/components/EmptyState.vue';

const alerts = ref([]);
const loading = ref(false);
const error = ref(null);

const toast = useToast();

// Pour éviter plusieurs notifications sur un même produit
const notifiedProductIds = new Set();

const headerStats = computed(() => {
	const ruptures = alerts.value.filter(a => a.type === 'rupture').length;
	const alertes = alerts.value.filter(a => a.type === 'alerte').length;
	return [
		{ label: 'Total Alertes', value: alerts.value.length, icon: 'heroicons:bell-alert', color: 'bg-gray-100 text-gray-600' },
		{ label: 'Ruptures', value: ruptures, icon: 'heroicons:exclamation-circle', color: 'bg-red-100 text-red-600' },
		{ label: 'Seuil Critique', value: alertes, icon: 'heroicons:exclamation-triangle', color: 'bg-yellow-100 text-yellow-600' },
	];
});

const handleCommander = (productId) => {
	// Logique pour initier une commande.
	// Par exemple, rediriger vers un formulaire de commande avec l'ID du produit.
	toast.info(`Lancement d'une commande pour le produit ID: ${productId}`);
	// navigateTo(`/commandes/nouvelle?produitId=${productId}`);
};

const fetchAlerts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get('/api/stock-alerts');
    alerts.value = res.data;

    const newRuptures = alerts.value.filter(alert =>
      alert.type === 'Rupture' && !notifiedProductIds.has(alert.id)
    );

    if (newRuptures.length > 0) {
      const message = newRuptures.length === 1
        ? `Le produit "${newRuptures[0].name}" est en rupture de stock !`
        : `${newRuptures.length} produits sont en rupture de stock !`;

      toast.error(message, {
        timeout: 8000,
        closeOnClick: true,
      });

      newRuptures.forEach(alert => notifiedProductIds.add(alert.id));
    }
  } catch (error) {
    console.error('Erreur lors du chargement des alertes stock', error);
    error.value = error;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlerts();
  setInterval(fetchAlerts, 60000);
});
</script>
