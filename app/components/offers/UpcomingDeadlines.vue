<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-medium text-gray-900">Délais à venir</h3>
      <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {{ deadlines.length }}
      </span>
    </div>
    
    <div v-if="deadlines.length === 0" class="text-sm text-gray-500">
      Aucun délai à venir
    </div>
    
    <ul v-else class="space-y-3">
      <li v-for="deadline in deadlines" :key="deadline.id" 
          class="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">{{ deadline.title || 'Sans titre' }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="font-medium">Échéance:</span> 
              {{ formatDate(deadline.deadline) }}
            </p>
          </div>
          <span :class="getStatusBadgeClass(deadline.status)" class="text-xs font-medium px-2 py-0.5 rounded-full">
            {{ getStatusLabel(deadline.status) }}
          </span>
        </div>
        <div class="mt-2 flex justify-end">
          <button @click="navigateToOffer(deadline.id)" 
                  class="text-xs text-blue-600 hover:text-blue-800 flex items-center">
            Voir l'offre
            <svg class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  deadlines: {
    type: Array as () => Array<{
      id: string;
      title: string;
      deadline: string;
      status: string;
    }>,
    required: true,
    default: () => []
  }
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: 'Brouillon',
    submitted: 'Soumis',
    in_review: 'En revue',
    won: 'Gagné',
    lost: 'Perdu',
    archived: 'Archivé'
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    in_review: 'bg-yellow-100 text-yellow-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    archived: 'bg-gray-100 text-gray-600'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const navigateToOffer = (id: string) => {
  router.push(`/offers/${id}`);
};
</script>
