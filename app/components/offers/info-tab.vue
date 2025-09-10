<template>
  <div class="space-y-6">
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">
        Exigences et consignes
      </h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Exigences de l'appel d'offre
          </label>
          <textarea v-model="offerFormData.requirement" rows="3" required :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.requirement ? 'border-red-500' : '',
          ]" placeholder="Exigences, critères obligatoires, etc."></textarea>
          <p v-if="validationErrors.requirement" class="text-red-500 text-sm mt-1">
            {{ validationErrors.requirement }}
          </p>
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
});

const { validationErrors } = storeToRefs(useOfferStore());
</script>
