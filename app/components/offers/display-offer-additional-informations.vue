<template>
  <div class="space-y-6">
    <div class="bg-blue-50 rounded-lg p-4">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Exigences de l'appel d'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100 min-h-[80px]">
            {{ offer.requirement || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Consignes d'empilage de l'appel d'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100 min-h-[80px]">
            {{ offer.stacking_instruction || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Consignes de clarification
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100 min-h-[80px]">
            {{ offer.metaData?.clarification_instruction || 'Non spécifié' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Période de validité -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Période de validité
      </h4>
      <div>
        <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
          {{ offer.offer_validity ? offer.offer_validity + ' jours' : 'Non spécifié' }}
        </div>
        <p class="mt-2 mb-2 text-xs text-gray-500">
          Durée pendant laquelle notre offre reste valable
        </p>
      </div>
    </div>

    <!-- Commentaires -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Commentaires</h4>
      <div>
        <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100 min-h-[80px]">
          {{ offer.metaData?.comment || 'Aucun commentaire' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  offer: {
    type: Object,
    required: true,
    default: () => ({})
  }
});
</script>