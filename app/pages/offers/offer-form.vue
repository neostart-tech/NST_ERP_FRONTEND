<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Page Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ submission ? "Modifier l'appel d'offre" : "Nouvel appel d'offre" }}
        </h2>
        <button
          @click="navigateTo('/offers/offer-quick-stat')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
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
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            {{ tab.name }}
            <span
              v-if="tab.required && !isTabValid(tab.id)"
              class="ml-1 text-red-500"
            >
              *
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- General Tab -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <!-- offer Selection -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">
              Appel d'offres
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Référence de l'appel d'offre <RequiredField />
                </label>
                <input
                  v-model="offerFormData.number"
                  type="text"
                  required
                  class="w-full rounded-md px-3 mb-4 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Référence de l'appel d'offres"
                />
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'appel d'offre <RequiredField />
                </label>
                <input
                  v-model="offerFormData.title"
                  type="text"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Titre de l'appel d'offres"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description de l'appel d'offre
                </label>
                <textarea
                  v-model="offerFormData.description"
                  rows="3"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Description de l'appel d'offre"
                >
                </textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication
                </label>
                <input
                  v-model="offerFormData.publication_date"
                  type="date"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Date de publication de l'appel d'offre"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date limite de soumission
                </label>
                <input
                  v-model="offerFormData.submission_deadline"
                  type="datetime-local"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Entreprise -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-4">
                  Contexte de l'offre
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Type de l'offre -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Autorité contractante <RequiredField />
                    </label>
                    <select
                      v-model="enterpriseFormData.id"
                      class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une entreprise</option>
                      <option
                        v-for="enterprise in enterprises"
                        :key="enterprise.id"
                        :value="enterprise.id"
                      >
                        {{ enterprise.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Entrepise -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Projet lié à l'offre
                    </label>
                    <input
                      v-model="metadataFormData.offer_project"
                      type="text"
                      class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Projet lié à l'offre"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Bailleur
                    </label>
                    <input
                      v-model="metadataFormData.sponsor"
                      type="text"
                      class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Bailleur du projet"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Montant du budget estimé
                </label>
                <input
                  v-model="offerFormData.estimated_budget"
                  type="number"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de lots
                </label>
                <input
                  v-model="offerFormData.batch_number"
                  type="number"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prix du dossier
                </label>
                <input
                  v-model="offerFormData.file_price"
                  type="number"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date limite d'obtention du dossier
                </label>
                <input
                  v-model="offerFormData.file_obtaining_deadline"
                  type="date"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Adresse d'obtention du dossier
                </label>
                <input
                  v-model="metadataFormData.offer_pickup_address"
                  type="text"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Adresse"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Addresse de soumission de l'offre <RequiredField />
                </label>
                <input
                  v-model="offerFormData.submission_address"
                  type="text"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de dépouillement du dossier <RequiredField />
                </label>
                <input
                  v-model="metadataFormData.offer_opening_date"
                  type="datetime-local"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Garantie bancaire <RequiredField />
                </label>
                <div class="flex items-center space-x-6">
                  <label class="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      value="1"
                      v-model="metadataFormData.bank_guarentee"
                      name="bank_guarantee"
                    />
                    <span class="text-sm text-gray-700">Oui</span>
                  </label>
                  <label class="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      value="0"
                      v-model="metadataFormData.bank_guarentee"
                      name="bank_guarantee"
                    />
                    <span class="text-sm text-gray-700">Non</span>
                  </label>
                </div>
                <div v-if="metadataFormData.bank_guarentee" class="mt-3">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Montant de la garantie <RequiredField />
                  </label>
                  <input
                    v-model.number="metadataFormData.bank_guarentee_amount"
                    type="number"
                    min="0"
                    class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ex: 500000"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- type de l'offre -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">
              Contexte de l'offre
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <!-- Type de l'offre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type de l'offre <RequiredField />
                </label>
                <!-- <input
                  v-model="offerFormData.offer_type"
                  type="text"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Type de l'offre"
                /> -->
                <select
                  v-model="offerFormData.offer_type"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option
                    v-for="offerType in offerTypes"
                    :key="offerType.id"
                    :value="offerType.id"
                  >
                    {{ offerType.label }}
                  </option>
                </select>
              </div>

              <!-- Entrepise -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Projet lié à l'offre
                </label>
                <input
                  v-model="metadataFormData.offer_project"
                  type="text"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Projet lié à l'offre"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bailleur
                </label>
                <input
                  v-model="metadataFormData.sponsor"
                  type="text"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Bailleur du projet"
                />
              </div>
            </div>
          </div>

          <!--source de l'offre -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">
              Source de l'offre
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la source <RequiredField />
                </label>
                <input
                  v-model="offerFormData.source_label"
                  type="text"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Nom de la source"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Reference de la source <RequiredField />
                </label>
                <input
                  v-model="offerFormData.source_label"
                  type="text"
                  required
                  :class="[
                    'w-full rounded-md px-3 py-2 border shadow-sm focus:border-gray-500 focus:ring-gray-500',
                    validationErrors.source_label ? 'border-red-500' : 'border-gray-500',
                  ]"
                  placeholder="Reference de la source"
                />
                <p
                  v-if="validationErrors.source_label"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ validationErrors.source_label }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Information Tab -->
        <div v-if="activeTab === 'information'" class="space-y-6">
          <!-- Informations complémentaires spécifiques -->

          <!-- Exigences et consignes -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">
              Exigences et consignes
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Exigences de l'appel d'offre
                </label>
                <textarea
                  v-model="offerFormData.requirement"
                  rows="3"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Exigences, critères obligatoires, etc."
                >
                </textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Consignes d'empilation de l'appel d'offre
                </label>
                <textarea
                  v-model="offerFormData.stacking_instruction"
                  rows="3"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Consignes d'empilation de l'appel d'offre"
                >
                </textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Consignes de clarification
                </label>
                <textarea
                  v-model="metadataFormData.clarification_instruction"
                  rows="3"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Consignes de clarification (questions, modalités, délais)"
                >
                </textarea>
              </div>
            </div>
          </div>

          <!-- Période de validité -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">
              Période de validité
            </h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Période de validité (jours) *
              </label>
              <input
                v-model="offerFormData.offer_validity"
                type="number"
                min="1"
                max="365"
                required
                class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="30"
              />
              <p class="mt-2 mb-2 text-xs text-gray-500">
                Durée pendant laquelle notre offre reste valable
              </p>
            </div>
          </div>

          <!-- Commentaires -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Commentaires</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Commentaires
              </label>
              <textarea
                v-model="metadataFormData.comment"
                rows="3"
                required
                class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Commentaires"
              >
              </textarea>
            </div>
          </div>

          <!-- Statut de la soumission -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">
              Statut de la soumission
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Statut actuel
                </label>
                <select
                  v-model="submissionStatus"
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                >
                  <option value="draft">Brouillon</option>
                  <option value="ready">Prêt à soumettre</option>
                  <option value="submitted">Soumis</option>
                  <option value="acknowledged">Accusé réception</option>
                  <option value="under_review">En évaluation</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Validation Errors -->
        <div
          v-if="errors.length > 0"
          class="bg-red-50 border border-red-200 rounded-md p-4"
        >
          <div class="flex">
            <svg
              class="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Veuillez corriger les erreurs suivantes :
              </h3>
              <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
      <div class="flex space-x-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
      <div class="flex space-x-3">
        <button
          v-if="activeTab === 'general'"
          @click="nextTab"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Suivant
        </button>
        <button
          v-if="activeTab === 'information'"
          @click="handleSubmit"
          :disabled="isLoading"
          type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enregistrement...
          </span>
          <span v-else>
            {{ submission ? "Mettre à jour" : "Créer l'appel d'offre" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration du layout par défaut (avec sidebar et header)
definePageMeta({
  layout: "default",
});

import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "#app";
import { useOfferStore } from "~/app/stores/offerStore";
import { useProjectTypeStore } from "~/app/stores/ProjectType";
import RequiredField from "~/app/components/partials/RequiredField.vue";
import type { OfferType, ProjectType } from "~/models/ProjectType";
import {
  defaultMetadataFormData,
  defaultOfferFormData,
  type MetadataForm,
  type OfferForm,
  type Offer,
} from "~/models/Offer";
import {
  defaultEnterpriseFormData,
  type EnterpriseForm,
  type Entreprise,
} from "~/models/Enterprise";

interface Emits {
  (e: "close"): void;
  (e: "save", data: { offer: OfferForm; metadata: MetadataForm }): void;
}

const props = defineProps<{
  submission?: any; // À typer correctement selon votre modèle de données
}>();

const router = useRouter();
const emit = defineEmits<Emits>();

// Navigation
const navigateTo = useRouter().push;
const offerTypeStore = useOfferTypeStore();
const enterpriseStore = useEnterpriseStore();

const projectTypes = ref<ProjectType[]>([]);
const offerTypes = ref<OfferType[]>([]);
const enterprises = ref<Entreprise[]>([]);

const offerStore = useOfferStore();
const validationErrors = ref<ValidationErrors>({});

// State
const activeTab = ref("general");
const isLoading = ref(false);
const errors = ref<string[]>([]);
// Fais-moi l'état des lieux
// J'avais  bougé rapidement!!
//L'enregistrement ne passe toujours pas

onMounted(async () => {
  await offerTypeStore.fetchOfferTypes();
  offerTypes.value = offerTypeStore.offerTypes;
  await enterpriseStore.fetchEnterprises();
  enterprises.value = enterpriseStore.enterprises;
});

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

const offerFormData = reactive<ExtendedOfferForm>(defaultExtendedOfferForm());

const enterpriseFormData = reactive<EnterpriseForm>(
  defaultEnterpriseFormData()
);

const metadataFormData = reactive<MetadataForm>(defaultMetadataFormData());

const formData = reactive({
  offerId: "",
  technicalOffer: "",
  financialOffer: {
    totalAmount: 0,
    paymentTerms: "",
    currency: "EUR",
    taxIncluded: false,
  },
  costBreakdown: [
    { category: "", description: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
  ],
  deliveryPlan: {
    totalDuration: 90,
  },
  team: [
    {
      id: "",
      role: "",
      name: "",
      experience: "",
      allocation: 100,
      skills: [],
      skillsText: "",
    },
  ],
  guarantees: [""],
  validityPeriod: 30,
});

// Additional form fields
const submissionStatus = ref("draft");
const submissionDate = ref("");
const plannedStartDate = ref("");
const projectPhases = ref("");

// Tab configuration
const tabs = [
  { id: "general", name: "Général", required: true },
  { id: "information", name: "Informations complémentaires", required: true },
];

// Computed
// const availableoffers = computed(() =>
//   offerStore.offers.filter(
//     (t: Offer) =>
//       ["draft", "active"].includes(t.status) || t.id === props.submission?.id
//   )
// );

onMounted(() => {
  // Load project types
  try {
    const projectTypeStore = useProjectTypeStore();
    projectTypeStore.fetchProjectTypes();
    projectTypes.value = projectTypeStore.projectTypes;
  } catch (error) {}
});

// Initialize form data
onMounted(() => {
  if (props.submission) {
    // Load existing submission data
    formData.offerId = props.submission.id;
    formData.technicalOffer = props.submission.proposal.technicalOffer;
    formData.financialOffer = { ...props.submission.proposal.financialOffer };
    formData.deliveryPlan = { ...props.submission.proposal.deliveryPlan };
    formData.team = props.submission.proposal.team.map(
      (member: {
        id: string;
        role: string;
        name: string;
        experience?: string;
        allocation?: number;
        skills: string[];
      }) => ({
        ...member,
        skillsText: member.skills.join(", "),
      })
    );
    formData.guarantees = [...props.submission.proposal.guarantees];
    formData.validityPeriod = props.submission.proposal.validityPeriod;

    submissionStatus.value = props.submission.status;
    submissionDate.value = formatDateTimeLocal(props.submission.submittedAt);
  }
});

// Methods
const isTabValid = (tabId: string): boolean => {
  switch (tabId) {
    case "general":
      return !!(offerFormData.title && offerFormData.submission_deadline);
    case "information":
      return !!offerFormData.offer_type;
    default:
      return true;
  }
};

const nextTab = () => {
  if (activeTab.value === "general") {
    activeTab.value = "information";
  }
  console.log("Next tab: ", activeTab.value);
};

const addCostItem = () => {
  formData.costBreakdown.push({
    category: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
};

const removeCostItem = (index: number) => {
  if (formData.costBreakdown.length > 1) {
    formData.costBreakdown.splice(index, 1);
    calculateTotal();
  }
};

const calculateLineTotal = (index: number) => {
  const item = formData.costBreakdown[index];
  if (item && "quantity" in item && "unitPrice" in item) {
    item.totalPrice = item.quantity * item.unitPrice;
    calculateTotal();
  }
};

const calculateTotal = () => {
  const total = formData.costBreakdown.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  formData.financialOffer.totalAmount = total;
};

const addTeamMember = () => {
  formData.team.push({
    id: `MEMBER-${Date.now()}`,
    role: "",
    name: "",
    experience: "",
    allocation: 100,
    skills: [],
    skillsText: "",
  });
};

const removeTeamMember = (index: number) => {
  if (formData.team.length > 1) {
    formData.team.splice(index, 1);
  }
};

const addGuarantee = () => {
  formData.guarantees.push("");
};

const removeGuarantee = (index: number) => {
  if (formData.guarantees.length > 1) {
    formData.guarantees.splice(index, 1);
  }
};

const validateForm = (): boolean => {
  errors.value = [];

  // Validation des champs obligatoires
  if (!offerFormData.title?.trim()) {
    errors.value.push("Le titre de l'offre est requis");
  }

  if (!offerFormData.description?.trim()) {
    errors.value.push("La description de l'offre est requise");
  }

  if (!offerFormData.submission_deadline) {
    errors.value.push("La date limite de soumission est requise");
  }

  if (!offerFormData.offer_type) {
    errors.value.push("Le type d'offre est requis");
  }

  // Garantie bancaire obligatoire (Oui/Non)
  // if (
  //   !metadataFormData.bank_guarentee ||
  //   !["yes", "no"].includes(metadataFormData.bank_guarentee)
  // ) {
  //   errors.value.push(
  //     "Veuillez indiquer si une garantie bancaire est requise (Oui/Non)"
  //   );
  // }
  // if (metadataFormData.bank_guarentee) {
  //   if (
  //     metadataFormData.bank_guarentee_amount === undefined ||
  //     metadataFormData.bank_guarentee_amount === null ||
  //     isNaN(Number(metadataFormData.bank_guarentee_amount)) ||
  //     Number(metadataFormData.bank_guarentee_amount) <= 0
  //   ) {
  //     errors.value.push(
  //       "Le montant de la garantie doit être un nombre positif"
  //     );
  //   }
  // }

  // Validation des montants numériques
  // if (
  //   isNaN(Number(offerFormData.estimated_budget)) ||
  //   Number(offerFormData.estimated_budget) <= 0
  // ) {
  //   errors.value.push("Le budget estimé doit être un nombre positif");
  // }

  // if (isNaN(Number(offerFormData.amount)) || Number(offerFormData.amount) < 0) {
  //   errors.value.push("Le montant doit être un nombre positif ou zéro");
  // }

  // Si des erreurs sont détectées, on les affiche
  if (errors.value.length > 0) {
    useAlert().showAlert(
      "Veuillez corriger les erreurs dans le formulaire",
      "error"
    );
    return false;
  }

  return true;
};

const prepareSubmissionData = (): {
  offer: ExtendedOfferForm;
  metadata: MetadataForm;
} => {
  return {
    offer: { ...offerFormData },
    metadata: { ...metadataFormData },
  };
};

const saveDraft = async () => {
  // Save as draft without full validation
  isLoading.value = true;

  try {
    const data = prepareSubmissionData();
    emit("save", data);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  // if (validateForm()) {
  try {
    // Préparer les données du formulaire
    const offerData: OfferForm = {
      title: offerFormData.title || "",
      description: offerFormData.description || "",
      estimated_budget: offerFormData.estimated_budget || 0,
      amount: offerFormData.amount || 0,
      status: offerFormData.status || "draft",
      offer_type: offerFormData.offer_type || "",
      source_label: offerFormData.source_label || "",
      entreprise: offerFormData.entreprise || "",
      submission_deadline: offerFormData.submission_deadline || "",
      offer_validity: offerFormData.offer_validity.toString() || "",
      submission_address: offerFormData.submission_address || "",
      requirement: offerFormData.requirement || "",
      stacking_instruction: offerFormData.stacking_instruction || "",
      batch_number: offerFormData.batch_number || "",
      execution_duration: offerFormData.execution_duration || "",
      // Champs optionnels
      number: offerFormData.number,
      file_price: offerFormData.file_price,
      file_obtaining_deadline: offerFormData.file_obtaining_deadline,
      execution_batch_duration: offerFormData.execution_batch_duration,
      // Champs de date
      publication_date:
        offerFormData.publication_date || new Date().toISOString(),
    };

    // Préparer les métadonnées
    const metadata: MetadataForm = {
      ...metadataFormData,
      comment: metadataFormData.comment || "",
    };

    // Sauvegarder l'offre via le store
    await offerStore.storeOffer(offerData, metadata, enterpriseFormData);

    // Afficher un message de succès et fermer le formulaire
    useAlert().showAlert("Offre enregistrée avec succès", "success");
    emit("close");

    // Rafraîchir les données si nécessaire
    // if (router) {
    //   await router.push("/offers");
    // }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'offre :", error);

    validationErrors.value = offerStore.validationErrors;

    const errorsSize = Object.keys(validationErrors.value).length;
    useAlert().showAlert(`${errorsSize} erreur${errorsSize > 1 ? "s" : ""} sont survenues lors de l'enregistrement`, "error");
  }
};
// };

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
</script>
