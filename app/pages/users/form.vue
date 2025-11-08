<template>
  
    <main class="flex-1 p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <!-- En-tête avec le même style que la sidebar -->
        <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-sky-800 to-sky-700">
          <h1 class="text-2xl font-bold text-white">{{ userId ? 'Modifier' : 'Créer' }} un utilisateur</h1>
        </div>

        <form class="space-y-6 p-6" @submit.prevent="submitForm">
          <!-- Section Informations personnelles -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Informations personnelles</span>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">Prénom <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="first-name"
                  v-model="user.firstName"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Nom <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="last-name"
                  v-model="user.lastName"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="user.phone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="login" class="block text-sm font-medium text-gray-700 mb-1">Identifiant <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="login"
                  v-model="user.login"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div class="md:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                <input
                  type="email"
                  id="email"
                  v-model="user.email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea
                  id="address"
                  v-model="user.address"
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                ></textarea>
              </div>

              <div class="md:col-span-2">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  {{ userId ? 'Nouveau mot de passe' : 'Mot de passe' }}
                  <span v-if="!userId" class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="user.password"
                  :required="!userId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
                <p v-if="userId" class="mt-1 text-xs text-gray-500">Laissez vide pour ne pas modifier</p>
              </div>
            </div>
          </div>

          <!-- Section Professionnelle -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Informations professionnelles</span>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="hired-year" class="block text-sm font-medium text-gray-700 mb-1">Année d'embauche</label>
                <input
                  type="number"
                  id="hired-year"
                  v-model="user.hiredYear"
                  min="2000"
                  max="2099"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="commission" class="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
                <input
                  type="number"
                  id="commission"
                  v-model="user.commission"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="prime" class="block text-sm font-medium text-gray-700 mb-1">Prime</label>
                <input
                  type="number"
                  id="bonus"
                  v-model="user.bonus"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="objectif" class="block text-sm font-medium text-gray-700 mb-1">Objectif</label>
                <input
                  type="number"
                  id="target"
                  v-model="user.target"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div class="md:col-span-2">
                <label for="chiffre-affaire" class="block text-sm font-medium text-gray-700 mb-1">Chiffre d'affaire</label>
                <input
                  type="number"
                  id="turnover"
                  v-model="user.turnover"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Section Rôle et permissions -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Rôle </span>
            </h2>
            
            <div class="space-y-6">
              <fieldset>
                <legend class="text-base font-medium text-gray-900 mb-3">Rôle <span class="text-red-500">*</span></legend>
                <div class="space-y-3">
                  <div class="flex items-center p-3 rounded-lg hover:bg-sky-50 transition-colors duration-200">
                    <input
                      id="role-admin"
                      v-model="user.role"
                      type="radio"
                      value="Admin"
                      class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                    >
                    <label for="role-admin" class="ml-3 block text-sm font-medium text-gray-700">
                      <span class="font-semibold">Administrateur</span>
                      <p class="text-xs text-gray-500 mt-1">Accès complet à toutes les fonctionnalités</p>
                    </label>
                  </div>

                  <div class="flex items-center p-3 rounded-lg hover:bg-sky-50 transition-colors duration-200">
                    <input
                      id="role-commercial"
                      v-model="user.role"
                      type="radio"
                      value="Commercial"
                      class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                    >
                    <label for="role-commercial" class="ml-3 block text-sm font-medium text-gray-700">
                      <span class="font-semibold">Commercial</span>
                      <p class="text-xs text-gray-500 mt-1">Accès à la gestion des clients et ventes</p>
                    </label>
                  </div>

                  <div class="flex items-center p-3 rounded-lg hover:bg-sky-50 transition-colors duration-200">
                    <input
                      id="role-user"
                      v-model="user.role"
                      type="radio"
                      value="Utilisateur"
                      class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                    >
                    <label for="role-user" class="ml-3 block text-sm font-medium text-gray-700">
                      <span class="font-semibold">Responsable Recouvrement</span>
                      <p class="text-xs text-gray-500 mt-1">Accès à la gestion du recouvrement</p>
                    </label>
                  </div>
                </div>
              </fieldset>

              
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="cancel"
              class="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              {{ userId ? 'Mettre à jour' : 'Créer l\'utilisateur' }}
            </button>
          </div>
        </form>
      </div>
    </main>
 
</template>

<script setup>
import DefaultLayout from '@/layouts/default.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '~/app/stores/_user'
const userStore = useUserStore()


const route = useRoute()
const router = useRouter()
const userId = route.query.id

// Données utilisateur




const user = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  login: '',
  commission: 0,
  hiredYear: new Date().getFullYear(),
  hasChangedPassword: false,
  bonus: 0,
  target: 0,
  turnover: 0,
  role: 'Utilisateur',
  
})



// Soumission du formulaire
const submitForm = async () => {
  const payload = {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
    phone: user.phone,
    address: user.address,
    login: user.login,
    commission: user.commission,
    hired_year: `${user.hiredYear}-01-01 00:00:00`,
    has_changed_password: user.hasChangedPassword,
    bonus: user.bonus,
    target: user.target,
    turnover: user.turnover,
    role: user.role,
  }

  try {
    if (userId) {
      await userStore.updateUser(userId, payload)
      alert('✅ Utilisateur mis à jour avec succès !')
    } else {
      await userStore.createUser(payload)
      alert('✅ Utilisateur créé avec succès !')
    }
    router.push('/users')
  } catch (error) {
    console.error(userStore.error)
    alert(`❌ ${error.message}`)
  }

   try {
    if (userId) {
      await userStore.updateUser(userId, payload);
    } else {
      // Création + envoi email
      await userStore.createUser(payload);
      
      // Message plus complet
      alert(`✅ Utilisateur créé. Un email a été envoyé à ${user.email}`);
    }
    router.push('/users');
  } catch (error) {
    alert(`❌ Erreur : ${userStore.error?.message || error.message}`);
    console.error('Détails:', userStore.error);
  }
}



// Annulation
const cancel = () => {
  router.push('/users')
}
</script>

<style scoped>
/* Styles pour correspondre à la sidebar */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="tel"],
textarea,
select {
  @apply transition-all duration-200;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
input[type="number"]:focus,
input[type="tel"]:focus,
textarea:focus,
select:focus {
  @apply ring-2 ring-sky-500 border-sky-500 shadow-sm;
}

/* Animation pour les sections */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Style pour les cases à cocher et radio */
input[type="checkbox"],
input[type="radio"] {
  @apply transition-all duration-200;
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
  @apply bg-sky-600 border-sky-600;
}

/* Style pour les boutons radio */
.radio-option {
  @apply transition-all duration-200;
}

.radio-option:hover {
  @apply bg-sky-50;
}
</style>