<template>
  <div class="min-h-screen flex items-center justify-center bg-[#93C5FD]">
    <div class="flex w-full max-w-4xl min-h-[250px] overflow-hidden bg-white rounded-lg shadow-xl">
      <!-- Côté gauche - Logo -->
      <div class="hidden md:flex md:w-1/2 bg-sky-800 text-white flex-col justify-center items-center p-8">
        <div class="space-y-4 text-center">
          <h1 class="text-4xl font-bold tracking-tight">Neo-ERP</h1>
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
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                id="email" 
                v-model="credentials.email" 
                type="email" 
                placeholder="Email"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>
          
          <!-- Champ Mot de passe -->
          <div class="space-y-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
                </svg>
              </div>
              <input 
                id="password" 
                v-model="credentials.password" 
                type="password" 
                placeholder="Mot de passe"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>
          
          <!-- Options -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember" 
                type="checkbox"
                v-model="rememberMe"
                class="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
              />
              <label for="remember" class="block ml-2 text-sm text-gray-600">Se souvenir de moi</label>
            </div>
            <div>
              <a href="#" class="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-200">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
          
          <!-- Bouton de connexion -->
          <div class="flex justify-center">
            <button 
              type="submit"
              class="flex items-center justify-center w-80 text-center bg-sky-800 hover:bg-sky-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              :disabled="isLoading"
            >
              <Spinner :is-loading="isLoading" />
              {{ isLoading ? 'Connexion en cours...' : 'Connexion' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '../../components/partials/Spinner.vue';
import { createDefaultLoginCredential, type LoginCredential } from '~~/models/User';

definePageMeta({
  layout: false
})

const isLoading = ref<boolean>(false);
const credentials = ref<LoginCredential>(createDefaultLoginCredential());

const handleLogin = async () => {
	isLoading.value = true;
	try {
		await useAuthStore().login(credentials.value);
		credentials.value = createDefaultLoginCredential();
		await navigateTo(AppUrl.TENDERS_TASK_FORM);
	} catch (error) {
		console.log("Error while authenticating:", error);
		alert(error);
	} finally {
		isLoading.value = false;
	}
}
</script>


