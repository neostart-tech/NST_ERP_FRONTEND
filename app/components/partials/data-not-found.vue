<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Fond flou -->
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />

    <!-- Contenu du modal -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <Icon name="heroicons-solid:exclamation-circle" class="h-6 w-6 text-red-600" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                Ressource non trouvée
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ customMessage || "La ressource que vous cherchez n'a pas été trouvée." }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6">
          <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-center">
            <button type="button" :disabled="isLoading"
              class="inline-flex items-center w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
              @click="handleRefresh">
              <Spinner v-if="isLoading" :is-loading="isLoading" text="Rafraîchissement..." />
              <span v-else>
                <Icon name="heroicons-solid:refresh" class="h-4 w-4 mr-2" />
                Rafraîchir
              </span>
            </button>
            <button type="button"
              class="inline-flex items-center w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
              @click="goBack">
              <Icon name="heroicons-solid:arrow-left" class="h-4 w-4 mr-2" />
              Revenir en arrière
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import Spinner from './Spinner.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  customMessage: {
    type: String,
    default: ""
  },
  onRefresh: {
    type: Function,
    default: () => { }
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const goBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}

const handleRefresh = () => {
  props.onRefresh()
  emit('update:visible', false)
}
</script>
