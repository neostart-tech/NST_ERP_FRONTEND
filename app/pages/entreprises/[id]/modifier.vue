<template>
  <form @submit.prevent="saveEntreprise" class="bg-white min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- Card formulaire -->
      <div class="bg-blue-50 rounded-2xl shadow-md p-6">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h4 class="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
            Éditer une entreprise
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
            :class="{
              'w-full': $mq === 'sm',
              'order-last md:order-none': $mq === 'md' || $mq === 'lg',
            }">
            <Spinner :isLoading="isLoading" text="Enregistrement en cours ..." />
            <span v-if="!isLoading">
              Ajouter l'entreprise
            </span>
          </button>
        </div>

      </div>
    </div>
  </form>

</template>

<script setup lang="ts">
useHead({ title: "Ajouter une entreprise" });
import RequiredField from '@/components/partials/RequiredField.vue';
import Spinner from '@/components/partials/Spinner.vue';
import { navigateTo } from '#app';
import { storeToRefs } from 'pinia';
import { useEnterpriseStore } from '@/stores/EnterpriseStore';
import { defaultEnterpriseFormData, type EnterpriseForm } from '~/models/Enterprise';

const entrepriseFormData = ref<EnterpriseForm>(defaultEnterpriseFormData());
const isLoading = ref<boolean>(false);

const { validationErrors } = storeToRefs(useEnterpriseStore());
const id = useRoute().params.id as string;

const saveEntreprise = async () => {
  isLoading.value = true;
  try {
    entrepriseFormData.value = await useEnterpriseStore().updateEntreprise(id, entrepriseFormData.value);
    useAlert().showAlert("Données mise à jour avec succès", "success");
  } catch (error) {
    const errorsSize = Object.keys(validationErrors).length;
    useAlert().showAlert(
      `${errorsSize} erreur${errorsSize > 1 ? "s" : ""
      } sont survenues lors de la mise à jour`,
      "error"
    );
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  entrepriseFormData.value = await useEnterpriseStore().getOneEntreprise(id);
});

useSeoMeta({
  title: () => entrepriseFormData.value.name ? `${entrepriseFormData.value.name} - Éditer` : "Éditer une entreprise",
})

</script>