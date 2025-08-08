<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Changer le statut
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Current Status -->
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Statut actuel
            </label>
            <span :class="getStatusBadge(currentStatus)">
              {{ getStatusText(currentStatus) }}
            </span>
          </div>

          <!-- New Status Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Nouveau statut
            </label>
            <div class="space-y-2">
              <label
                v-for="status in availableStatuses"
                :key="status.value"
                class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{
                  'border-green-500 bg-green-50': selectedStatus === status.value,
                  'border-gray-200': selectedStatus !== status.value
                }"
              >
                <input
                  v-model="selectedStatus"
                  :value="status.value"
                  type="radio"
                  class="sr-only"
                />
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      :class="{
                        'border-green-500 bg-green-500': selectedStatus === status.value,
                        'border-gray-300': selectedStatus !== status.value
                      }"
                    >
                      <div
                        v-if="selectedStatus === status.value"
                        class="w-1.5 h-1.5 bg-white rounded-full"
                      ></div>
                    </div>
                    <div>
                      <div class="flex items-center space-x-2">
                        <span :class="getStatusBadge(status.value)">
                          {{ status.label }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-500 mt-1">{{ status.description }}</p>
                    </div>
                  </div>
                  <svg
                    v-if="status.recommended"
                    class="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </label>
            </div>
          </div>

          <!-- Additional Notes -->
          <div v-if="showNotesForStatus">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              v-model="notes"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Ajoutez des notes sur ce changement de statut..."
            ></textarea>
          </div>

          <!-- Warning for specific status changes -->
          <div v-if="showWarning" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">
                  Attention
                </h3>
                <p class="mt-1 text-sm text-yellow-700">
                  {{ warningMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          @click="handleChange"
          :disabled="!selectedStatus || selectedStatus === currentStatus"
          type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmer le changement
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { offerStatus } from '@/types/offers'

// Props and Emits
interface Props {
  currentStatus: offerStatus
}

interface Emits {
  (e: 'close'): void
  (e: 'change', status: offerStatus, notes?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const selectedStatus = ref<offerStatus | ''>('')
const notes = ref('')

// Status workflow configuration
const statusWorkflow = {
  draft: ['active', 'cancelled'],
  active: ['submitted', 'cancelled'],
  submitted: ['evaluation', 'won', 'lost', 'cancelled'],
  evaluation: ['won', 'lost', 'cancelled'],
  won: ['cancelled'], // Rarely changed but possible
  lost: ['cancelled'], // Rarely changed but possible
  cancelled: [] // Final state
}

// Computed
const availableStatuses = computed(() => {
  const allowedStatuses: offerStatus[] = (statusWorkflow[props.currentStatus] || []) as offerStatus[]
  
  const statusConfigs = [
    {
      value: 'active' as offerStatus,
      label: 'Actif',
      description: 'L\'appel d\'offres est actif et peut être travaillé',
      recommended: props.currentStatus === 'draft'
    },
    {
      value: 'submitted' as offerStatus,
      label: 'Soumis',
      description: 'La proposition a été envoyée au client',
      recommended: props.currentStatus === 'active'
    },
    {
      value: 'evaluation' as offerStatus,
      label: 'En évaluation',
      description: 'Le client évalue les propositions reçues',
      recommended: false
    },
    {
      value: 'won' as offerStatus,
      label: 'Gagné',
      description: 'Notre proposition a été retenue',
      recommended: props.currentStatus === 'submitted' || props.currentStatus === 'evaluation'
    },
    {
      value: 'lost' as offerStatus,
      label: 'Perdu',
      description: 'Notre proposition n\'a pas été retenue',
      recommended: false
    },
    {
      value: 'cancelled' as offerStatus,
      label: 'Annulé',
      description: 'L\'appel d\'offres a été annulé',
      recommended: false
    }
  ]

  return statusConfigs.filter(config => allowedStatuses.includes(config.value))
})

const showNotesForStatus = computed(() => {
  return ['won', 'lost', 'cancelled'].includes(selectedStatus.value as string)
})

const showWarning = computed(() => {
  if (!selectedStatus.value) return false
  
  const finalStatuses = ['won', 'lost', 'cancelled']
  return finalStatuses.includes(selectedStatus.value)
})

const warningMessage = computed(() => {
  switch (selectedStatus.value) {
    case 'won':
      return 'Marquer comme gagné indique que le projet démarre. Assurez-vous que c\'est confirmé.'
    case 'lost':
      return 'Marquer comme perdu archive définitivement cet appel d\'offres.'
    case 'cancelled':
      return 'L\'annulation est définitive et ne peut pas être annulée.'
    default:
      return ''
  }
})

// Methods
const handleChange = () => {
  if (!selectedStatus.value) return
  
  emit('change', selectedStatus.value, notes.value || undefined)
}

const getStatusBadge = (status: offerStatus): string => {
  const badges: Record<string, string> = {
    draft: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
    active: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    submitted: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    evaluation: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800',
    won: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    lost: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    cancelled: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return badges[status] || badges['draft']
}

const getStatusText = (status: offerStatus): string => {
  const texts: Record<string, string> = {
    draft: 'Brouillon',
    active: 'Actif',
    submitted: 'Soumis',
    evaluation: 'En évaluation',
    won: 'Gagné',
    lost: 'Perdu',
    cancelled: 'Annulé'
  }
  return texts[status] || status
}
</script>