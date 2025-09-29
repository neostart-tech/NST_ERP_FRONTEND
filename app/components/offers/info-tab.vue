<template>
  <div class="space-y-6">
    <div class="bg-blue-50 rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-900 mb-4">Exigences et consignes</h3>
      <div class="space-y-4">
        <!-- Requirements Section -->
          <h4 class="text-sm font-medium text-gray-900 mb-4">Exigences de l'appel d'offre</h4>
          <div class="space-y-3">
            <div
              v-for="(requirement, index) in offerFormData.requirements"
              :key="index"
              class="flex items-center space-x-2"
            >
              <input
                v-model="offerFormData.requirements[index]"
                type="text"
                class="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Décrivez une exigence..."
              />
              <button
                @click="removeRequirement(index)"
                type="button"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
            <button
              @click="addRequirement"
              type="button"
              class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Ajouter une exigence
            </button>
          </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Consignes d'empilation de l'appel d'offre
          </label>
          <textarea v-model="offerFormData.stacking_instruction" rows="3" required :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.stacking_instruction ? 'border-red-500' : '',
          ]" placeholder="Consignes d'empilation de l'appel d'offre"></textarea>
          <p v-if="validationErrors.stacking_instruction" class="text-red-500 text-sm mt-1">
            {{ validationErrors.stacking_instruction }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Consignes de clarification
          </label>
          <textarea v-model="metadataFormData.clarification_instruction" rows="3" required :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.clarification_instruction ? 'border-red-500' : '',
          ]" placeholder="Consignes de clarification (questions, modalités, délais)"></textarea>
          <p v-if="validationErrors.clarification_instruction" class="text-red-500 text-sm mt-1">
            {{ validationErrors.clarification_instruction }}
          </p>
        </div>
      </div>
    </div>

    <!-- Période de validité -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Période de validité <RequiredField />
      </h4>
      <div>
        <input v-model="offerFormData.offer_validity" type="text" required :class="[
          'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
          validationErrors.offer_validity ? 'border-red-500' : '',
        ]" placeholder="30" />
        <p class="mt-2 mb-2 text-xs text-gray-500">
          Durée pendant laquelle notre offre reste valable
        </p>
        <p v-if="validationErrors.offer_validity" class="text-red-500 text-sm mt-1">
          {{ validationErrors.offer_validity }}
        </p>
      </div>
    </div>

    <!-- Commentaires -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Commentaires</h4>
      <div>
        <textarea v-model="metadataFormData.comment" rows="3" required :class="[
          'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
          validationErrors.comment ? 'border-red-500' : '',
        ]" placeholder="Commentaires"></textarea>
        <p v-if="validationErrors.comment" class="text-red-500 text-sm mt-1">
          {{ validationErrors.comment }}
        </p>
      </div>
    </div>

    <!-- Statut de la soumission -->
    <!-- <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Statut de la soumission
      </h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Statut actuel
          </label>
          <select v-model="submissionStatus"
            class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500">
            <option value="draft">Brouillon</option>
            <option value="ready">Prêt à soumettre</option>
            <option value="submitted">Soumis</option>
            <option value="acknowledged">Accusé réception</option>
            <option value="under_review">En évaluation</option>
          </select>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { defaultMetadataFormData, defaultOfferFormData, type MetadataForm, type OfferForm } from "~/models/Offer";
import RequiredField from "../partials/RequiredField.vue";

const offerFormData = defineModel<OfferForm>("offerFormData", {
  default: defaultOfferFormData(),
  required: true,
});

const metadataFormData = defineModel<MetadataForm>("metadataFormData", {
  default: defaultMetadataFormData(),
  required: true,
});

const { validationErrors } = storeToRefs(useOfferStore());

const addRequirement = () => {
  if (!Array.isArray(offerFormData.value.requirements)) {
    offerFormData.value.requirements = [];
  }
  offerFormData.value.requirements.push("");
};

const removeRequirement = (index: number) => {
  if (Array.isArray(offerFormData.value.requirements)) {
    offerFormData.value.requirements.splice(index, 1);
  }
};
</script>
