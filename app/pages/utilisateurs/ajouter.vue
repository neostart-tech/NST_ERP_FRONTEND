<template>
  <form @submit.prevent="saveUser" class="bg-white min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- Card formulaire -->
      <div class="bg-blue-50 rounded-2xl shadow-md p-6">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h4 class="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
            Ajouter un utilisateur
          </h4>
          <button @click="navigateTo('/utilisateurs')" type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
            <Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5 mr-2" />
            Retour à la liste
          </button>
        </div>

        <!-- Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom
              <RequiredField />
            </label>
            <input v-model="userForm.lastName" name="lastName" type="text" required :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.last_name ? 'border-red-500' : '',
            ]" placeholder="Nom de l'utilisateur" />
            <p v-if="validationErrors.last_name" class="text-red-500 text-sm mt-1">
              {{ validationErrors.last_name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prénoms
              <RequiredField />
            </label>
            <input v-model="userForm.firstName" name="first_name" type="text" required :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.first_name ? 'border-red-500' : '',
            ]" placeholder="Prénoms de l'utilisateur" />
            <p v-if="validationErrors.first_name" class="text-red-500 text-sm mt-1">
              {{ validationErrors.first_name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
              <RequiredField />
            </label>
            <input v-model="userForm.email" name="email" type="email" required :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.email ? 'border-red-500' : '',
            ]" placeholder="Email de l'utilisateur" />
            <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
              {{ validationErrors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input v-model="userForm.phone" name="phone" type="text" :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.phone ? 'border-red-500' : '',
            ]" placeholder="Numéro de téléphone" />
            <p v-if="validationErrors.phone" class="text-red-500 text-sm mt-1">
              {{ validationErrors.phone }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur (Pseudo)
              <RequiredField />
            </label>
            <input v-model="userForm.login" name="login" type="text" required :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.login ? 'border-red-500' : '',
            ]" placeholder="Nom d'utilisateur" />
            <p v-if="validationErrors.login" class="text-red-500 text-sm mt-1">
              {{ validationErrors.login }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Année d'embauche
            </label>
            <input v-model="userForm.hiredYear" type="date" :class="[
              'w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              validationErrors.hired_year ? 'border-red-500' : '',
            ]" placeholder="Année d'embauche" />
            <p v-if="validationErrors.hired_year" class="text-red-500 text-sm mt-1">
              {{ validationErrors.hired_year }}
            </p>
          </div>
        </div>

        <!-- Bouton submit -->
        <div class="flex justify-center md:justify-end mt-6">
          <button type="submit"
            class="w-full md:w-auto px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center"
            :disabled="isLoading">
            <Spinner :isLoading="isLoading" text="Enregistrement en cours..." v-if="isLoading" />
            <span v-else>
              Ajouter l'utilisateur
            </span>
          </button>
        </div>

      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
useHead({title: "Ajouter un utilisateur"});
import Spinner from '~/app/components/partials/Spinner.vue';
import { createDefaultUserForm, type UserCreateForm } from '~/models/User';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { validationErrors } = storeToRefs(useUserStore());
const userForm = ref<UserCreateForm>(createDefaultUserForm());
const  isLoading = ref<boolean>(false);

const saveUser = async () => {
  isLoading.value = true;
  try {
    await userStore.store(userForm.value);
    useAlert().showAlert("L'utilisateur a été ajouté avec succès", "success");
    userForm.value = createDefaultUserForm();
  } catch (error) {
    const errorLength = Object.keys(validationErrors.value).length;
    let alertText = "Une erreur est survenue lors de l'ajout de l'utilisateur";
    if (errorLength > 1) {
      alertText = errorLength + " erreurs sont survenues lors de l'ajout de l'utilisateur";
    }
    useAlert().showAlert(alertText, "error");
  } finally {
    isLoading.value =false;
  }
};
</script>
