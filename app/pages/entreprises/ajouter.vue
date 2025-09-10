<template>
  <form @submit.prevent="saveEntreprise" class="bg-white min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- Card formulaire -->
      <div class="bg-blue-50 rounded-2xl shadow-md p-6">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h4 class="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
            Ajouter une entreprise
          </h4>
          <button @click="navigateTo(AppUrl.ENTREPRISE_INDEX)" type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
            <Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5 mr-2" />
            Retour à la liste
          </button>
        </div>

        <!-- Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
              <RequiredField />
            </label>
            <input v-model="entrepriseFormData.name" type="text" name="company" required :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.name ? 'border-red-500' : '',
            ]" placeholder="Nom de l'entreprise" />
            <p v-if="validationErrors.name" class="text-red-500 text-sm mt-1">
              {{ validationErrors.name }}
            </p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email de l'entreprise
              <RequiredField />
            </label>
            <input v-model="entrepriseFormData.email" type="email" required name="email" :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.email ? 'border-red-500' : '',
            ]" placeholder="Email de l'entreprise" />
            <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
              {{ validationErrors.email }}
            </p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
              <RequiredField />
            </label>
            <input v-model="entrepriseFormData.phone" type="text" name="phone" :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.phone ? 'border-red-500' : '',
            ]" placeholder="Numéro de téléphone" />
            <p v-if="validationErrors.phone" class="text-red-500 text-sm mt-1">
              {{ validationErrors.phone }}
            </p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Adresse de l'entreprise
            </label>
            <input v-model="entrepriseFormData.address" type="text" required name="address" :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.address ? 'border-red-500' : '',
            ]" placeholder="Adresse de l'entreprise" />
            <p v-if="validationErrors.address" class="text-red-500 text-sm mt-1">
              {{ validationErrors.address }}
            </p>
          </div>

        </div>

        <!-- Bouton submit -->
        <div class="flex justify-center md:justify-end mt-6">
          <button type="submit"
            class="w-full md:w-auto px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center"
            :disabled="isLoading"
            :class="{
              'w-full': $mq === 'sm',
              'order-last md:order-none': $mq === 'md' || $mq === 'lg',
            }">
            <Spinner :isLoading="isLoading" text="Enregistrement en cours ..." v-if="isLoading"/>
            <span v-else>
              Ajouter l'entreprise
            </span>
          </button>
        </div>

      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import Spinner from '~/app/components/partials/Spinner.vue';
import { defaultEnterpriseFormData, type EnterpriseForm } from '~/models/Enterprise';

const entrepriseStore = useEnterpriseStore();
const { validationErrors, isLoading } = storeToRefs(entrepriseStore);
const entrepriseFormData = ref<EnterpriseForm>(defaultEnterpriseFormData());

const saveEntreprise = async () => {
  try {
    await entrepriseStore.saveEnterprise(entrepriseFormData.value);
    useAlert().showAlert("L'entreprise a été ajoutée avec succès", "success");
  } catch (error) {
    const errorLength = Object.keys(validationErrors.value).length;
    let alertText = "Une erreur est survenue lors de l'ajout de l'entreprise";
    if (errorLength > 1) {
      alertText = errorLength + " erreurs sont survenues lors de l'ajout de l'entreprise";
    }
    useAlert().showAlert(alertText, "error");
  }
};

</script>