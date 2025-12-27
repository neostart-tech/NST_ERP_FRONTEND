<template>
  <div class="min-h-screen flex items-center justify-center bg-[#93C5FD] px-4 sm:px-6 lg:px-0">
    <div class="flex w-full max-w-4xl min-h-[250px] overflow-hidden bg-white rounded-lg shadow-xl">
      <!-- Côté gauche - Logo -->
      <div class="hidden md:flex md:w-1/2 bg-sky-800 text-white flex-col justify-center items-center p-8">
        <div class="space-y-4 text-center">
          <h1 class="text-4xl font-bold tracking-tight">Neo-ERP</h1>
          <Icon name="heroicons-outline:rectangle-group" size="96" />
        </div>
      </div>

      <!-- Côté droit - Formulaire avec animation -->
      <div class="w-full p-8 md:w-1/2 md:p-12 transform transition-all duration-500 hover:scale-[1.005]">
        <div class="mb-10 text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h2>
          <p class="text-gray-500">Connectez-vous pour accéder à votre compte</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Champ Email -->
          <div class="space-y-2">
            <div class="relative">
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Icon name="heroicons:envelope-20-solid" class="w-5 h-5" aria-hidden="true" />
              </span>
              <input id="email" v-model="credentials.email" type="email" placeholder="Email"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                autocomplete="email"
                required />
            </div>
            <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
              {{ validationErrors.email }}
            </p>
          </div>


          <!-- Champ Mot de passe -->
          <div class="space-y-2">
            <div class="relative">
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Icon name="heroicons:lock-closed-20-solid" class="w-5 h-5" aria-hidden="true" />
              </span>
              <input id="password" v-model="credentials.password" type="password" placeholder="Mot de passe" :class="[
                'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition',
                validationErrors.password ? 'border-red-500' : '',
              ]" autocomplete="current-password" required />
            </div>
            <p v-if="validationErrors.password" class="text-red-500 text-sm mt-1">
              {{ validationErrors.password }}
            </p>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-end">
            <div>
              <a href="#" class="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-200">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <!-- Bouton de connexion -->
          <div class="flex justify-center">
            <button type="submit"
              class="flex items-center justify-center w-full md:w-80 text-center bg-sky-800 hover:bg-sky-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              :disabled="isLoading">
              <Spinner :is-loading="isLoading" />
              <span class="ml-3">{{ isLoading ? 'Connexion en cours...' : 'Connexion' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/partials/Spinner.vue';
import { createDefaultLoginCredential, type LoginCredential } from '~/models/User';

definePageMeta({ layout: false });
useHead({ title: "Connexion" });

const isLoading = ref<boolean>(false);
const credentials = ref<LoginCredential>(createDefaultLoginCredential());
const { validationErrors } = storeToRefs(useAuthStore());

const handleLogin = async () => {
  isLoading.value = true;
  try {
    await useAuthStore().login(credentials.value);
    credentials.value = createDefaultLoginCredential();
    await navigateTo(AppUrl.DASHBOARD);
  } catch (error) {
    console.log("Error while authenticating:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>
