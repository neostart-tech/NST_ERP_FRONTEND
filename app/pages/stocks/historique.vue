<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Historique des mouvements</h2>
          <p class="text-gray-500">Entrées / Sorties / Ajustements par produit, avec filtres, tri et pagination.</p>
        </div>
        <div class="flex items-center gap-2">
          <select v-model="perPage" class="border rounded-lg px-3 py-2">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <button @click="fetchHistory(1)" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Actualiser
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Produit</label>
          <select v-model="filters.product_id" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.movement_type" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            <option value="entry">Entrée</option>
            <option value="exit">Sortie</option>
            <option value="adjustment">Ajustement</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
          <select v-model="filters.user_id" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date début</label>
          <input type="date" v-model="filters.date_from" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
          <input type="date" v-model="filters.date_to" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Raison (contient)</label>
          <input type="text" v-model="filters.reason" placeholder="ex: réassort, vente, retour…" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type de document lié</label>
          <input type="text" v-model="filters.related_document_type" placeholder="ex: App\\Models\\PurchaseOrder" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID document lié</label>
          <input type="number" v-model.number="filters.related_document_id" class="w-full border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button @click="fetchHistory(1)" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          🔍 Appliquer les filtres
        </button>
        <button @click="resetFilters" class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
          ♻️ Réinitialiser
        </button>
      </div>

      <!-- Tableau -->
      <div class="mt-6 overflow-x-auto rounded-2xl border border-gray-200">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-sm text-gray-700">
              <SortableTh label="Date" field="created_at" :sort-by="sortBy" :sort-dir="sortDir" @sort="onSort" />
              <th class="px-4 py-3">Produit</th>
              <SortableTh label="Type" field="movement_type" :sort-by="sortBy" :sort-dir="sortDir" @sort="onSort" />
              <SortableTh label="Quantité" field="quantity" :sort-by="sortBy" :sort-dir="sortDir" @sort="onSort" />
              <th class="px-4 py-3">Raison</th>
              <th class="px-4 py-3">Doc lié</th>
              <th class="px-4 py-3">Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in history.data" :key="m.id" class="border-t text-sm hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                {{ formatDateTime(m.created_at) }}
              </td>
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">{{ m.product?.name || '—' }}</div>
                <div class="text-gray-500 text-xs">#{{ m.product_id }}</div>
              </td>
              <td class="px-4 py-3">
                <span :class="badgeClass(m.movement_type)" class="px-2 py-1 rounded-full text-xs font-semibold">
                  {{ typeLabel(m.movement_type) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="qtyClass(m.movement_type)" class="font-semibold">
                  {{ displayQuantity(m.movement_type, m.quantity) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-gray-800">{{ m.reason || '—' }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="text-gray-800">
                  <span v-if="m.related_document_type">{{ shortDocType(m.related_document_type) }}</span>
                  <span v-else>—</span>
                </div>
                <div v-if="m.related_document_id" class="text-gray-500 text-xs">ID: {{ m.related_document_id }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-gray-800">{{ m.user?.name || '—' }}</div>
                <div v-if="m.user_id" class="text-gray-500 text-xs">#{{ m.user_id }}</div>
              </td>
            </tr>

            <tr v-if="!loading && (!history.data || history.data.length === 0)">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                Aucun mouvement trouvé avec ces critères.
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="loading" class="p-6 text-center text-gray-500">Chargement…</div>
      </div>

      <!-- Pagination -->
      <div v-if="history.meta" class="mt-6 flex items-center justify-between">
        <button
          class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          :disabled="history.meta.current_page <= 1"
          @click="changePage(history.meta.current_page - 1)"
        >
          ⬅ Précédent
        </button>

        <div class="text-gray-600">
          Page {{ history.meta.current_page }} / {{ history.meta.last_page }}
          <span class="mx-2">•</span>
          Total: {{ history.meta.total }}
        </div>

        <button
          class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          :disabled="history.meta.current_page >= history.meta.last_page"
          @click="changePage(history.meta.current_page + 1)"
        >
          Suivant ➡
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Petit composant interne pour trier par header
const SortableTh = {
  props: ['label', 'field', 'sortBy', 'sortDir'],
  emits: ['sort'],
  template: `
    <th class="px-4 py-3 cursor-pointer select-none" @click="$emit('sort', field)">
      <div class="flex items-center gap-1">
        <span>{{ label }}</span>
        <svg v-if="sortBy === field && sortDir === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M3 12l7-8 7 8H3z"/></svg>
        <svg v-else-if="sortBy === field && sortDir === 'desc'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M17 8l-7 8-7-8h14z"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-30" viewBox="0 0 20 20" fill="currentColor"><path d="M3 12l7-8 7 8H3z"/></svg>
      </div>
    </th>
  `
};

const history = ref({ data: [], meta: null, links: null });
const products = ref([]);
const users = ref([]);
const loading = ref(false);

const filters = ref({
  product_id: '',
  movement_type: '',
  user_id: '',
  date_from: '',
  date_to: '',
  reason: '',
  related_document_type: '',
  related_document_id: ''
});

const sortBy = ref('created_at');
const sortDir = ref('desc');
const perPage = ref(20);

function formatDateTime(dt) {
  try {
    return new Date(dt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return dt;
  }
}
function typeLabel(t) {
  if (t === 'entry') return 'Entrée';
  if (t === 'exit') return 'Sortie';
  if (t === 'adjustment') return 'Ajustement';
  return t || '—';
}
function badgeClass(t) {
  if (t === 'entry') return 'bg-green-100 text-green-700';
  if (t === 'exit') return 'bg-red-100 text-red-700';
  if (t === 'adjustment') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
}
function qtyClass(t) {
  if (t === 'entry') return 'text-green-700';
  if (t === 'exit') return 'text-red-700';
  if (t === 'adjustment') return 'text-yellow-700';
  return 'text-gray-800';
}
function displayQuantity(t, q) {
  const n = Number(q ?? 0);
  if (t === 'entry') return `+${n}`;
  if (t === 'exit') return `-${n}`;
  return `${n}`;
}
function shortDocType(type) {
  if (!type) return '';
  // garder seulement la dernière partie du FQCN
  const parts = String(type).split('\\');
  return parts[parts.length - 1];
}

async function fetchProducts() {
  try {
    products.value = await $fetch('/api/products/minimal');
  } catch {
    // fallback si l'endpoint minimal n'existe pas
    try {
      const full = await $fetch('/api/products');
      products.value = (full || []).map(p => ({ id: p.id, name: p.name }));
    } catch {}
  }
}

async function fetchUsers() {
  try {
    users.value = await $fetch('/api/users/minimal');
  } catch {
    users.value = [];
  }
}

async function fetchHistory(page = 1) {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('per_page', String(perPage.value));
    params.set('sort_by', sortBy.value);
    params.set('sort_dir', sortDir.value);

    Object.entries(filters.value).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params.set(k, String(v));
    });

    history.value = await $fetch(`/api/stock-history?${params.toString()}`);
  } catch (e) {
    console.error('Erreur fetchHistory', e);
    history.value = { data: [], meta: null, links: null };
  } finally {
    loading.value = false;
  }
}

function onSort(field) {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDir.value = 'asc';
  }
  fetchHistory(1);
}

function changePage(page) {
  fetchHistory(page);
}

function resetFilters() {
  filters.value = {
    product_id: '',
    movement_type: '',
    user_id: '',
    date_from: '',
    date_to: '',
    reason: '',
    related_document_type: '',
    related_document_id: ''
  };
  sortBy.value = 'created_at';
  sortDir.value = 'desc';
  fetchHistory(1);
}

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchUsers()]);
  await fetchHistory(1);
});
</script>

<style scoped>
/* Optionnel : petits raffinements */
</style>
