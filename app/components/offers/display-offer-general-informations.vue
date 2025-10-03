<template>
  <div class="space-y-6">
    <!-- offer Selection -->
    <div class="bg-blue-50 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Référence de l'appel d'offre
          </label>
          <div class="w-full rounded-md px-3 mb-4 py-2 border border-gray-300 bg-gray-100">
            {{ offer.number || 'Non spécifié' }}
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'appel d'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.title || 'Non spécifié' }}
          </div>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description de l'appel d'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100 min-h-[80px]">
            {{ offer.description || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date de publication
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
						{{ formatDate(offer.publication_date) || 'Non spécifié' }}
            <!-- {{ formatDateTime(offer.publication_date) || 'Non spécifié' }} -->
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date limite de soumission
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ formatDateTime(offer.submission_deadline) || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Montant du budget estimé
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.estimated_budget ? formatNumber(offer.estimated_budget) + ' FCFA' : 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre de lots
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.batch_number || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Prix du dossier
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.file_price ? formatNumber(offer.file_price) + ' FCFA' : 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date limite d'obtention du dossier
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ formatDate(offer.file_obtaining_deadline) || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Adresse d'obtention du dossier
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.metadata?.tender_pickup_address || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Adresse de soumission de l'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.submission_address || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date et heure de dépouillement du dossier
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ formatDateTime(offer.metadata?.tender_opening_date) || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Garantie bancaire
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.metadata?.has_bank_guarentee ? 'Oui' : 'Non' }}
          </div>

          <div v-if="offer.metadata?.has_bank_guarentee" class="mt-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Montant de la garantie
            </label>
            <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
              {{ offer.metadata?.bank_guarentee ? formatNumber(offer.metadata.bank_guarentee) + ' FCFA' : 'Non spécifié' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contexte de l'offre -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Contexte de l'offre
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Autorité contractante
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.enterprise?.name || 'Non spécifié' }}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type de l'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.offer_type?.label || 'Non spécifié' }}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Projet lié à l'offre
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.metadata?.offer_project || 'Non spécifié' }}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bailleur
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.metadata?.sponsor || 'Non spécifié' }}
          </div>
        </div>
      </div>
    </div>

    <!--source de l'offre -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Source de l'offre
      </h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nom de la source
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.offer_source?.label || 'Non spécifié' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Reference de la source
          </label>
          <div class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-100">
            {{ offer.offer_source?.reference || 'Non spécifié' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  offer: {
    type: Object,
      required: true,
      default: () => ({})
    }
  });

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
	console.log(date);
  return date.toLocaleDateString('fr-FR');
};

// const formatDate = (dateString: string): string => {
//   if (!dateString) return '';
//   const date = new Date(dateString.replace(' ', 'T'));
//   console.log(date);
//   if (isNaN(date.getTime())) return ''; // sécurité
//   return date.toLocaleDateString('fr-FR');
// };


const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('fr-FR');
};

const formatNumber = (number: number): string => {
  if (!number) return '0';
  return new Intl.NumberFormat('fr-FR').format(number);
}

</script>
