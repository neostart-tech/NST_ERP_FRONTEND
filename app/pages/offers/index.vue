<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Soumissions d'offres</h1>
      <button
        @click="showSubmissionForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Nouvelle soumission
      </button>
    </div>

    <!-- Liste des soumissions (à implémenter) -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Liste des soumissions
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Voici la liste de toutes vos soumissions d'offres.
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <!-- Contenu de la liste à implémenter -->
        <div class="py-12 text-center text-gray-500">
          <p>Utilisez le bouton "Nouvelle soumission" pour commencer.</p>
        </div>
      </div>
    </div>

    <!-- Modal du formulaire de soumission -->
    <div v-if="showSubmissionForm" class="fixed inset-0 z-50">
      <SubmissionForm @close="showSubmissionForm = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SubmissionForm from './submission-form.vue';

definePageMeta({
  layout: 'default',
});

const showSubmissionForm = ref(false);
</script>
