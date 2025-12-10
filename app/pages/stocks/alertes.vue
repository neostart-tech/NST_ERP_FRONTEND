<template>
  <div>
    <PageHeader
      title="Alertes Stock"
      subtitle="Surveillez les seuils critiques et les ruptures de stock"
      :stats="[
        { label: 'Ruptures', color: 'bg-red-400' },
        { label: 'Alertes', color: 'bg-yellow-400' }
      ]"
    />

    <div v-if="loading" class="text-gray-600">Chargement des alertes...</div>

    <div v-else>
      <div v-if="alerts.length === 0" class="text-green-700 font-semibold">
        Aucun produit en rupture ou en alerte.
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="alert in alerts"
          :key="alert.id"
          class="p-3 border rounded shadow"
          :class="alert.type === 'rupture' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'"
        >
          <strong>{{ alert.name }} (Réf: {{ alert.reference }})</strong><br />
          Stock actuel : {{ alert.current_stock }} (Seuil d'alerte : {{ alert.min_stock_alert }})<br />
          <div>
            Type : <span class="font-semibold" :class="alert.type === 'rupture' ? 'text-red-600' : 'text-yellow-700'">
              {{ alert.type === 'rupture' ? 'Rupture' : 'Alerte' }}
            </span>
          </div>
          <div v-if="alert.best_supplier_proposal" class="mt-1 text-sm text-gray-700">
            Meilleure proposition fournisseur : {{ alert.best_supplier_proposal.supplier_name }} à
            {{ alert.best_supplier_proposal.proposed_price }} FCFA
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import PageHeader from '~/app/components/ui/PageHeader.vue';

const alerts = ref([]);
const loading = ref(false);

const toast = useToast();

// Pour éviter plusieurs notifications sur un même produit
const notifiedProductIds = new Set();

const fetchAlerts = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/stock-alerts');
    alerts.value = res.data;

    alerts.value.forEach(alert => {
      if (alert.type === 'rupture' && !notifiedProductIds.has(alert.id)) {
        toast.error(`Le produit "${alert.name}" est en rupture de stock !`, {
          timeout: 8000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
        });
        notifiedProductIds.add(alert.id);
      }
    });
  } catch (error) {
    console.error('Erreur lors du chargement des alertes stock', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlerts();
  setInterval(fetchAlerts, 60000);
});
</script>

<style scoped>
/* Aucun problème CSS attendu */
</style>
