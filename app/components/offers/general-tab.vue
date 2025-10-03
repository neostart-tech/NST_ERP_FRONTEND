<template>
  <div class="space-y-6">
    <!-- offer Selection -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Appel d'offres</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Référence de l'appel d'offre
            <RequiredField />
          </label>
          <input v-model="offerFormData.number" type="text" required :class="[
            'w-full rounded-md px-3 mb-4 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.number ? 'border-red-500' : '',
          ]" placeholder="Référence de l'appel d'offres" />
          <p v-if="validationErrors.number" class="text-red-500 text-sm mt-1">
            {{ validationErrors.number }}
          </p>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'appel d'offre
            <RequiredField />
          </label>
          <input v-model="offerFormData.title" type="text" required :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.title ? 'border-red-500' : '',
          ]" placeholder="Titre de l'appel d'offres" />
          <p v-if="validationErrors.title" class="text-red-500 text-sm mt-1">
            {{ validationErrors.title }}
          </p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description de l'appel d'offre
          </label>
          <textarea v-model="offerFormData.description" rows="3" required :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.description ? 'border-red-500' : '',
          ]" placeholder="Description de l'appel d'offre">
          </textarea>
          <p v-if="validationErrors.description" class="text-red-500 text-sm mt-1">
            {{ validationErrors.description }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date de publication
          </label>
          <input v-model="offerFormData.publication_date"  type="date" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.publication_date ? 'border-red-500' : '',
          ]" placeholder="Date de publication de l'appel d'offre" />
          <p v-if="validationErrors.publication_date" class="text-red-500 text-sm mt-1">
            {{ validationErrors.publication_date }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date limite de soumission
          </label>
          <input v-model="offerFormData.submission_deadline" type="datetime-local" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.submission_deadline ? 'border-red-500' : '',
          ]" placeholder="Date limite de soumission de l'appel d'offre" />
          <p v-if="validationErrors.submission_deadline" class="text-red-500 text-sm mt-1">
            {{ validationErrors.submission_deadline }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Montant du budget estimé
          </label>
          <input v-model="offerFormData.estimated_budget" type="number" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.estimated_budget ? 'border-red-500' : '',
          ]" placeholder="50000" />
          <p v-if="validationErrors.estimated_budget" class="text-red-500 text-sm mt-1">
            {{ validationErrors.estimated_budget }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre de lots
          </label>
          <input v-model="offerFormData.batch_number" type="number" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.batch_number ? 'border-red-500' : '',
          ]" placeholder="50000" />
          <p v-if="validationErrors.batch_number" class="text-red-500 text-sm mt-1">
            {{ validationErrors.batch_number }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Prix du dossier
          </label>
          <input v-model="offerFormData.file_price" type="number" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.file_price ? 'border-red-500' : '',
          ]" placeholder="50000" />
          <p v-if="validationErrors.file_price" class="text-red-500 text-sm mt-1">
            {{ validationErrors.file_price }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date limite d'obtention du dossier
          </label>
          <input v-model="offerFormData.file_obtaining_deadline" type="date" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.file_obtaining_deadline ? 'border-red-500' : '',
          ]" placeholder="50000" />
          <p v-if="validationErrors.file_obtaining_deadline" class="text-red-500 text-sm mt-1">
            {{ validationErrors.file_obtaining_deadline }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Adresse d'obtention du dossier
          </label>
          <input v-model="metadataFormData.tender_pickup_address" type="text" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.tender_pickup_address ? 'border-red-500' : '',
          ]" placeholder="Adresse" />
          <p v-if="validationErrors.tender_pickup_address" class="text-red-500 text-sm mt-1">
            {{ validationErrors.tender_pickup_address }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Adresse de soumission de l'offre
            <RequiredField />
          </label>
          <input v-model="offerFormData.submission_address" type="text" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.submission_address ? 'border-red-500' : '',
          ]" placeholder="Adresse de soumission" />
          <p v-if="validationErrors.submission_address" class="text-red-500 text-sm mt-1">
            {{ validationErrors.submission_address }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date et heure de dépouillement du dossier
            <RequiredField />
          </label>
          <input v-model="metadataFormData.tender_opening_date" type="datetime-local" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.tender_opening_date ? 'border-red-500' : '',
          ]" placeholder="50000" />
          <p v-if="validationErrors.tender_opening_date" class="text-red-500 text-sm mt-1">
            {{ validationErrors.tender_opening_date }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Garantie bancaire
            <RequiredField />
          </label>
          <div class="flex items-center space-x-6">
            <label class="inline-flex items-center space-x-2">
              <input type="radio" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" value="1"
                v-model="metadataFormData.bank_guarentee" name="bank_guarantee" />
              <span class="text-sm text-gray-700">Oui</span>
            </label>
            <label class="inline-flex items-center space-x-2">
              <input type="radio" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" value="0"
                v-model="metadataFormData.bank_guarentee" name="bank_guarantee" />
              <span class="text-sm text-gray-700">Non</span>
            </label>
          </div>
          <div v-if="metadataFormData.bank_guarentee_amount == 1" class="mt-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Montant de la garantie
              <RequiredField />
            </label>
            <input v-model.number="metadataFormData.bank_guarentee_amount" type="number" min="0"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: 500000" />
          </div>
          <p v-if="validationErrors.bank_guarentee_amount" class="text-red-500 text-sm mt-1">
            {{ validationErrors.bank_guarentee_amount }}
          </p>
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
            <RequiredField />
          </label>
          <select v-model="offerFormData.enterprise_id" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.enterprise_id ? 'border-red-500' : '',
          ]">
            <option value="">Sélectionner une entreprise</option>
            <option v-for="enterprise in enterprises" :key="enterprise.id" :value="enterprise.id">
              {{ enterprise.name }}
            </option>
          </select>
          <p v-if="validationErrors.enterprise_id" class="text-red-500 text-sm mt-1">
            {{ validationErrors.enterprise_id }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type de l'offre
            <RequiredField />
          </label>
          <select v-model="offerFormData.offer_type"
            class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="">Sélectionner un type</option>
            <option v-for="offerType in offerTypes" :key="offerType.id" :value="offerType.id">
              {{ offerType.label }}
            </option>
          </select>
          <p v-if="validationErrors.offer_type" class="text-red-500 text-sm mt-1">
            {{ validationErrors.offer_type }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Projet lié à l'offre
          </label>
          <input v-model="metadataFormData.offer_project" type="text" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.offer_project ? 'border-red-500' : '',
          ]" placeholder="Projet lié à l'offre" />
          <p v-if="validationErrors.offer_project" class="text-red-500 text-sm mt-1">
            {{ validationErrors.offer_project }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bailleur
          </label>
          <input v-model="metadataFormData.sponsor" type="text" :class="[
            'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
            validationErrors.sponsor ? 'border-red-500' : '',
          ]" placeholder="Bailleur du projet" />
          <p v-if="validationErrors.sponsor" class="text-red-500 text-sm mt-1">
            {{ validationErrors.sponsor }}
          </p>
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
            <RequiredField />
          </label>
          <input v-model="offerFormData.source_label" type="text" required
            class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            placeholder="Nom de la source" />
          <p v-if="validationErrors.source_label" class="text-red-500 text-sm mt-1">
            {{ validationErrors.source_label }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Reference de la source
            <RequiredField />
          </label>
          <input v-model="offerFormData.source_reference" type="text" required :class="[
            'w-full rounded-md px-3 py-2 border shadow-sm focus:border-gray-500 focus:ring-gray-500',
            validationErrors.source_reference
              ? 'border-red-500'
              : 'border-gray-500',
          ]" placeholder="Reference de la source" />
          <p v-if="validationErrors.source_reference" class="text-red-500 text-sm mt-1">
            {{ validationErrors.source_reference }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RequiredField from "~/app/components/partials/RequiredField.vue";
import type { OfferType } from "~/models/ProjectType";
import { defaultMetadataFormData, defaultOfferFormData, type MetadataForm, type OfferForm } from "~/models/Offer";
import type { Entreprise } from "~/models/Enterprise";

const offerFormData = defineModel<OfferForm>("offerFormData", {
  default: defaultOfferFormData(),
  required: true,
});

const metadataFormData = defineModel<MetadataForm>("metadataFormData", {
  default: defaultMetadataFormData(),
});

const { validationErrors } = storeToRefs(useOfferStore());

const offerTypes = ref<OfferType[]>([]);
const enterprises = ref<Entreprise[]>([]);

onMounted(async () => {
  await useOfferTypeStore().fetchOfferTypes();
  offerTypes.value = useOfferTypeStore().offerTypes;
  await useEnterpriseStore().fetchEnterprises();
  enterprises.value = useEnterpriseStore().enterprises;
});

watch(metadataFormData, () => {
	console.log(metadataFormData.value.bank_guarentee)
}, { deep: true })

</script>
