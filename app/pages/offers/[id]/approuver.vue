<template>
  <div class="bg-white rounded-lg shadow overflow-hidden p-6">
    <!-- Page Header -->
    <div class="py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Informations de l'appel d'offre
        </h2>
        <button @click="navigateTo(AppUrl.OFFERS)"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
          Retour à la liste
        </button>
      </div>
    </div>

    <!-- Modal Body with Tabs -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 bg-gray-50">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- General Tab -->
        <DisplayOfferGeneralInformations :offer="offerData" v-if="activeTab === 'general'" />

        <!-- Information Tab -->
        <DisplayOfferAdditionalInformations :offer="offerData" v-if="activeTab === 'information'" />
      </div>
    </div>

    <!-- Submission Decision -->
    <div class="bg-gray-50 rounded-lg p-6 my-6" v-if="useAuthStore().user?.role === UserRole.ADMIN">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Décision de soumission</h3>
      <div class="space-y-4">
        <div class="flex items-center space-x-6">
          <label class="inline-flex items-center space-x-2">
            <input type="radio" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" value="yes"
              v-model="submissionDecision" name="submission_decision" />
            <span class="text-sm font-medium text-gray-700">Oui, je souhaite soumettre une offre</span>
          </label>
          <label class="inline-flex items-center space-x-2">
            <input type="radio" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" value="no"
              v-model="submissionDecision" name="submission_decision" />
            <span class="text-sm font-medium text-gray-700">Non, je ne souhaite pas soumettre</span>
          </label>
        </div>
        <!--
        <div v-if="submissionDecision === 'yes'" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Motif de la soumission
          </label>
          <textarea v-model="submissionMotif" rows="3"
            class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Expliquez pourquoi vous souhaitez soumettre une offre..."></textarea>
        </div>

        <div v-if="submissionDecision === 'no'" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Motif du refus
          </label>
          <textarea v-model="refusalMotif" rows="3"
            class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Expliquez pourquoi vous ne souhaitez pas soumettre d'offre..."></textarea>
        </div> -->
      </div>
    </div>

    <!-- Required Documents Check -->
    <!-- <div v-if="submissionDecision === 'yes'" class="bg-yellow-50 rounded-lg p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Vérification des pièces à fournir</h3>
      <div class="space-y-4">
        <div class="text-sm text-gray-700 mb-4">
          <p class="font-medium">Avant de procéder à la soumission, vérifiez que vous disposez des documents suivants :
          </p>
        </div>

        <div class="space-y-3">
          <div v-for="(document, index) in requiredDocuments" :key="index" class="flex items-center space-x-3">
            <input type="checkbox" :id="'doc-' + index" v-model="document.checked"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label :for="'doc-' + index" class="text-sm text-gray-700">
              <span class="font-medium">{{ document.name }}</span>
              <span v-if="document.required" class="text-red-500 ml-1">*</span>
              <span v-if="document.description" class="block text-xs text-gray-500 mt-1">{{ document.description
              }}</span>
            </label>
          </div>
        </div>

        <div v-if="missingRequiredDocuments.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Documents manquants requis :</h3>
              <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                <li v-for="doc in missingRequiredDocuments" :key="doc.name">{{ doc.name }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="allRequiredDocumentsChecked" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clip-rule="evenodd">
              </path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Tous les documents requis sont disponibles</h3>
              <p class="mt-1 text-sm text-green-700">Vous pouvez maintenant procéder à la soumission de votre offre.</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Action Buttons -->
    <div class="flex justify-between pt-6 border-t border-gray-200">
      <button @click="navigateTo(AppUrl.OFFERS)" type="button"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        Annuler
      </button>

      <div class="flex space-x-3">
        <button v-if="submissionDecision === 'yes'" @click="showConfirmationModal = true" type="button"
          :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Procéder à la soumission
        </button>

        <button v-if="submissionDecision === 'no'" @click="saveDecision" :disabled="isLoading" type="button"
          class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
          Enregistrer la décision
        </button>
      </div>
    </div>
    <!-- </div> -->

    <!-- Modal de confirmation -->
    <div v-if="showConfirmationModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showConfirmationModal = false">
        </div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Confirmer la soumission
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir procéder à la soumission de votre offre ?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="appreciateOffer" type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Confirmer
            </button>
            <button @click="showConfirmationModal = false" type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DataNotFound :visible="_server404" v-on:refresh="loadOffer" :is-loading="isLoading" />
</template>

<script setup lang="ts">
import {UserRole} from "~/models/User";

definePageMeta({
  layout: 'default'
});

import { ref, computed, onMounted } from "vue";
import { useRouter } from '#app';
import { defaultOfferData } from "~/models/Offer";
import { useOfferStore } from "~/app/stores/offerStore";
import { useAlert } from "~/app/composables/useAlert";
import DisplayOfferGeneralInformations from "@/components/offers/display-offer-general-informations.vue";
import DisplayOfferAdditionalInformations from "~/app/components/offers/display-offer-additional-informations.vue";
import DataNotFound from "~/app/components/partials/data-not-found.vue";

const router = useRouter();
const navigateTo = useRouter().push;

const activeTab = ref("general");

// Route params
const route = useRoute();
const offerId = route.params.id as string;

// State
const submissionDecision = ref<'yes' | 'no' | null>(null);
const submissionMotif = ref('');
const refusalMotif = ref('');
const isLoading = ref(false);
const _server404 = ref(false);
const showConfirmationModal = ref(false);

const offerStore = useOfferStore();
// Mock offer data
const offerData = ref(defaultOfferData());

const loadOffer = async () => {
  try {
    isLoading.value = true;
    offerData.value = await offerStore.getOneOffer(offerId);
    _server404.value = false;
  } catch (error) {
    useAlert().showAlert("Une erreur est survenue lors de la récupération de la ressource", "error");
    _server404.value = true;
  } finally {
    isLoading.value = false;
  }
}
onMounted(() => {
  loadOffer();
});

// Required documents list
const requiredDocuments = ref([
  {
    name: 'Relevé d\'identité bancaire',
    description: 'Relevé destiné à confirmer la capacité de paiement',
    required: true,
    checked: false
  },
  {
    name: 'Carte d\'immatriculation fiscale',
    description: 'Carte d\'immatriculation fiscale servant à identifier l\'entreprise',
    required: true,
    checked: false
  },
  {
    name: 'Attestation de régularité fiscale',
    description: 'Attestation stipulant que vous êtes en règle avec ladministration fiscale',
    required: true,
    checked: false
  },
  {
    name: 'Garantie bancaire',
    description: 'Garantie bancaire si requise par l\'appel d\'offres',
    required: false,
    checked: false
  },
  {
    name: 'Offre technique',
    description: 'Document détaillant l\'approche technique et méthodologique',
    required: true,
    checked: false
  },
  {
    name: 'Offre financière',
    description: 'Document détaillant le prix et les conditions financières',
    required: true,
    checked: false
  }
]);

// Computed properties
const missingRequiredDocuments = computed(() => {
  return requiredDocuments.value
    .filter(doc => doc.required && !doc.checked)
    .map(doc => ({ name: doc.name }));
});

const allRequiredDocumentsChecked = computed(() => {
  return requiredDocuments.value
    .filter(doc => doc.required)
    .every(doc => doc.checked);
});

const tabs = [
  { id: "general", name: "Général", required: true },
  { id: "information", name: "Informations complémentaires", required: true },
];

const appreciateOffer = async () => {
  try {
    isLoading.value = true;
    offerData.value = await offerStore.appreciateOffer(offerId, submissionDecision.value!);
		navigateTo('/offers/offer-quick-stat')
  } catch (error) {
    useAlert().showAlert("Une erreur est survenue lors de l'appréciation de l'offre", "error");
    console.error('Erreur lors de l\'appréciation de l\'offre:', error);
  } finally {
    isLoading.value = false;
    showConfirmationModal.value = false;
  }
}

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount);
};

const confirmSubmission = () => {
  showConfirmationModal.value = false;
  // Rediriger vers la page de disponibilité des documents
  navigateTo(`/offers/${offerId}/documents-availability`);
};

const saveDecision = async () => {
  try {
    isLoading.value = true;

    const decisionData = {
      offerId: offerId,
      decision: submissionDecision.value,
      motif: submissionDecision.value === 'yes' ? submissionMotif.value : refusalMotif.value,
      documents: requiredDocuments.value.filter(doc => doc.checked).map(doc => doc.name)
    };

    console.log('Décision sauvegardée:', decisionData);
    navigateTo('/offers');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la décision:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
