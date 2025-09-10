<template>
  <form class="bg-white min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Card infos entreprise -->
      <div class="bg-blue-50 rounded-2xl shadow-md p-6">
        <!-- Header avec état de chargement -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h4 v-if="!isLoading" class="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
            Détails d'une entreprise
          </h4>
          <div v-else class="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4 md:mb-0"></div>
          
          <button @click="navigateTo(AppUrl.ENTREPRISE_INDEX)" type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
            <Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5 mr-2" />
            Retour à la liste
          </button>
        </div>

        <!-- Informations avec états de chargement -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nom -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
            </label>
            <input v-if="!isLoading" v-model="entreprise.name" type="text" readonly :class="inputClass" />
            <div v-else class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Email -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email de l'entreprise
            </label>
            <input v-if="!isLoading" v-model="entreprise.email" type="email" readonly :class="inputClass" />
            <div v-else class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Téléphone -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input v-if="!isLoading" v-model="entreprise.phone" type="text" readonly :class="inputClass" />
            <div v-else class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Adresse -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Adresse de l'entreprise
            </label>
            <input v-if="!isLoading" v-model="entreprise.address" type="text" readonly :class="inputClass" />
            <div v-else class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Bouton éditer (toujours visible mais désactivé pendant le chargement) -->
      <div class="flex justify-center md:justify-end">
        <NuxtLink 
          :to="AppUrl.parameterize(AppUrl.ENTREPRISE_EDIT, id)"
          class="mt-3 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50"
          :class="{
            'w-full': $mq === 'sm',
            'order-last md:order-none': $mq === 'md' || $mq === 'lg',
            'pointer-events-none opacity-70': isLoading
          }">
          <span class="flex items-center">
            <Icon name="heroicons:pencil-20-solid" class="w-5 h-5 mr-2" />
            Éditer l'entreprise
          </span>
        </NuxtLink>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { defaultEntreprise, type Entreprise } from '~/models/Enterprise';
import { navigateTo } from '#app';
import { Icon } from '#components';

const entreprise = ref<Entreprise>(defaultEntreprise());
const inputClass = "w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";

const id = useRoute().params.id as string;
const entrepriseStore = useEnterpriseStore();
const isLoading = ref(true); // État de chargement local

onMounted(async () => {
  try {
    isLoading.value = true;
    entreprise.value = await entrepriseStore.getOneEntreprise(id);
  } catch (error) {
    useAlert().showAlert("Une erreur est survenue lors de la récupération de la ressource", "error");
  } finally {
    isLoading.value = false;
  }
});

useSeoMeta({ 
  title: () => isLoading.value ? "Chargement..." : entreprise.value.name ?? "Détails d'une entreprise" 
});
</script>