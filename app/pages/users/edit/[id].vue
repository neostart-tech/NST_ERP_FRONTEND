<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- En-tête -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Modifier l'utilisateur</h1>
            <p class="text-gray-600">Mettez à jour les informations de l'utilisateur</p>
          </div>
          <button 
            @click="$router.push('/users')" 
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste
          </button>
        </div>

        <!-- Messages d'état -->
        <div v-if="userStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ userStore.error }}
        </div>
        
        <div v-if="message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {{ message }}
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="!userStore.loading && form" class="bg-white rounded-2xl shadow-xl p-6">
        <form @submit.prevent="submitForm">
          <!-- Informations personnelles -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  id="first_name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  v-model="form.last_name"
                  type="text"
                  id="last_name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="login" class="block text-sm font-medium text-gray-700 mb-2">Login *</label>
                <input
                  v-model="form.login"
                  type="text"
                  id="login"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="role" class="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                <select
                  v-model="form.role"
                  id="role"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
                  <option value="Admin">Admin</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Responsable Recouvrement">Responsable Recouvrement</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Adresse -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Adresse</h2>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <textarea
                v-model="form.address"
                id="address"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
              ></textarea>
            </div>
          </div>

          <!-- Informations professionnelles -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="hired_year" class="block text-sm font-medium text-gray-700 mb-2">Date d'embauche *</label>
                <input
                  v-model="form.hired_year"
                  type="datetime-local"
                  id="hired_year"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="commission" class="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
                <input
                  v-model="form.commission"
                  type="number"
                  id="commission"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="bonus" class="block text-sm font-medium text-gray-700 mb-2">Bonus</label>
                <input
                  v-model="form.bonus"
                  type="number"
                  id="bonus"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="target" class="block text-sm font-medium text-gray-700 mb-2">Objectif</label>
                <input
                  v-model="form.target"
                  type="number"
                  id="target"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="turnover" class="block text-sm font-medium text-gray-700 mb-2">Chiffre d'affaires</label>
                <input
                  v-model="form.turnover"
                  type="number"
                  id="turnover"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Mot de passe (optionnel) -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Mot de passe</h2>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
              <input
                v-model="form.password"
                type="password"
                id="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
              >
            </div>
          </div>

          <!-- Statut -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Statut</h2>
            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                id="is_active"
                :true-value="true"
                :false-value="false"
                class="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
              >
              <label for="is_active" class="ml-2 block text-sm text-gray-900">Utilisateur actif</label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$router.push('/users')"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="userStore.loading"
              class="px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Mettre à jour</span>
              <svg v-if="userStore.loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Squelette de chargement -->
      <div v-if="userStore.loading" class="bg-white rounded-2xl shadow-xl p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-gray-200 rounded w-1/3"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const message = ref('');
const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  login: '',
  role: '',
  commission: null,
  hired_year: '',
  bonus: null,
  target: null,
  turnover: null,
  password: '',
  is_active: true
});

// Charger les données de l'utilisateur
onMounted(async () => {
  try {
    const userData = await userStore.fetchUser(route.params.id);
    
    // Mapper les données de l'utilisateur vers le formulaire
    Object.assign(form, {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone || '',
      address: userData.address || '',
      login: userData.login,
      role: userData.role,
      commission: userData.commission,
      hired_year: userData.hired_year ? new Date(userData.hired_year).toISOString().slice(0, 16) : '',
      bonus: userData.bonus,
      target: userData.target,
      turnover: userData.turnover,
      is_active: userData.is_active !== undefined ? userData.is_active : true
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'utilisateur:', error);
  }
});

// Soumettre le formulaire
const submitForm = async () => {
  try {
    // Créer une copie des données sans le mot de passe s'il est vide
    const formData = { ...form };
    if (!formData.password) {
      delete formData.password;
    }
    
    await userStore.updateUser(route.params.id, formData);
    
    message.value = 'Utilisateur mis à jour avec succès';
    
    // Redirection après un délai
    setTimeout(() => {
      router.push('/users');
    }, 1500);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  }
};
</script>