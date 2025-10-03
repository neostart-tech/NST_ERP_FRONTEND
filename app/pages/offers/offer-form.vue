<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Page Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Nouvel appel d'offre
        </h2>
        <button @click="navigateTo('/offers/offer-quick-stat')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Icon name="heroicons-solid:chevron-left" class="w-5 h-5 mr-2" />
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
            <span v-if="tab.required && !isTabValid(tab.id)" class="ml-1 text-red-500">
              *
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- General Tab -->
        <GeneralTab v-if="activeTab === 'general'"
          v-model:offer-form-data="offerFormData"
          v-model:metadata-form-data="metadataFormData"
        />

        <!-- Information Tab -->
        <InfoTab v-if="activeTab === 'information'"
          v-model:offer-form-data="offerFormData"
          v-model:metadata-form-data="metadataFormData"
        />
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
      <div class="flex space-x-3">
        <button type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Annuler
        </button>
      </div>
      <div class="flex space-x-3">
        <button v-if="activeTab === 'general'" @click="nextTab" type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Suivant
        </button>
        <button v-if="activeTab === 'information'" @click="handleSubmit" :disabled="isSubmitting" type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          <Spinner :isLoading="isSubmitting" text="Enregistrement en cours ..." />
          <span v-if="!isSubmitting">
            Créer l'appel d'offre
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useOfferStore } from "~/app/stores/offerStore";
import {
  defaultMetadataFormData,
  defaultOfferFormData,
  type MetadataForm,
  type OfferForm,
} from "~/models/Offer";
import Spinner from "~/app/components/partials/Spinner.vue";
import { Icon } from "#components";
import GeneralTab from "~/app/components/offers/general-tab.vue";
import InfoTab from "~/app/components/offers/info-tab.vue";

const isSubmitting = ref(false);

const offerStore = useOfferStore();
const validationErrors = ref<ValidationErrors>({});

// State
const activeTab = ref("general");

// Form data
interface ExtendedOfferForm extends OfferForm {
  number: string;
  file_price: number;
  file_obtaining_deadline: string;
  execution_batch_duration: string;
  publication_date: string;
}

const defaultExtendedOfferForm = (): ExtendedOfferForm => ({
  ...defaultOfferFormData(),
  number: "",
  file_price: 0,
  file_obtaining_deadline: "",
  execution_batch_duration: "",
  publication_date: new Date().toISOString(),
});

const offerFormData = ref<ExtendedOfferForm>(defaultExtendedOfferForm());
const metadataFormData = ref<MetadataForm>(defaultMetadataFormData());

// Tab configuration
const tabs = [
  { id: "general", name: "Général", required: true },
  { id: "information", name: "Informations complémentaires", required: true },
];

// Methods
const isTabValid = (tabId: string): boolean => {
  switch (tabId) {
    case "general":
      return !!(offerFormData.value.title && offerFormData.value.submission_deadline);
    case "information":
      return !!offerFormData.value.offer_type;
    default:
      return true;
  }
};

const nextTab = () => {
  if (activeTab.value === "general") {
    activeTab.value = "information";
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await offerStore.storeOffer(offerFormData.value, metadataFormData.value);
    useAlert().showAlert("Offre enregistrée avec succès", "success");
    navigateTo('/offers/offer-quick-stat');
  } catch (error) {
		console.log(error)
    validationErrors.value = offerStore.validationErrors;
    const errorsSize = Object.keys(validationErrors.value).length;
    useAlert().showAlert(
      `${errorsSize} erreur${errorsSize > 1 ? "s" : ""
      } sont survenues lors de l'enregistrement`,
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>


