<template>
  <div class="space-y-4">
    <!-- Header avec icône et titre -->
    <div class="flex items-center space-x-3">
      <div :class="`p-2 rounded-full bg-opacity-20 ${actionConfig.bgColor}`">
        <Icon :name="actionConfig.icon" class="w-5 h-5" :class="actionConfig.iconColor" />
      </div>
      <div>
        <h3 class="text-lg font-semibold leading-6 text-gray-900">
          {{ actionConfig.label }} l'entreprise
        </h3>
        <p class="text-sm text-gray-500">
          {{ actionConfig.description }}
        </p>
      </div>
    </div>

    <!-- Informations de l'entreprise -->
    <div class="bg-gray-50 rounded-lg p-4 space-y-3">
      <div class="flex items-start justify-between">
        <div class="flex-1 space-y-2">
          <h4 class="font-medium text-gray-900">{{ enterprise.name }}</h4>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Email:</span> {{ enterprise.email || '-' }}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Téléphone:</span> {{ enterprise.phone || '-' }}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Adresse:</span> {{ enterprise.address || '-' }}
          </p>
        </div>
      </div>

      <div class="border-t pt-3 space-y-1">
        <div class="text-xs text-gray-500">
          <span class="font-medium">ID:</span> {{ enterprise.id }}
        </div>
        <div class="text-xs text-gray-500">
          <span class="font-medium">Offres actives:</span> {{ enterprise.offersCount || 0 }}
        </div>
      </div>
    </div>

    <!-- Message de confirmation -->
    <div :class="`${actionConfig.alertBg} border ${actionConfig.alertBorder} rounded-lg p-3`">
      <p :class="`text-sm ${actionConfig.alertText}`">
        <span class="font-medium">Confirmation requise:</span>
        {{ actionConfig.confirmationMessage }}
      </p>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-3 pt-4 border-t">
      <button type="button"
        :class="`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${actionConfig.buttonSecondary}`"
        @click="$emit('cancel')">
        <Icon name="heroicons:x-mark" class="w-4 h-4 mr-2" />
        Annuler
      </button>
      <button type="button"
        :class="`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${actionConfig.buttonPrimary}`"
        @click="handleConfirm">
        <Spinner v-if="isDeleting" :is-loading="isDeleting" text="Suppression en cours ..."/>
        <div v-else>
          <Icon :name="actionConfig.icon" class="w-4 h-4" />
          <span class="ml-2">{{ actionConfig.label }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Entreprise } from '~/models/Enterprise'
import Spinner from './partials/Spinner.vue';

const props = defineProps({
  action: {
    type: String,
    default: 'delete', // 'delete' | 'edit' | 'confirm'
    validator: (value: string) => ['delete', 'edit', 'confirm'].includes(value)
  },
  enterprise: {
    type: Object as () => Entreprise,
    required: true
  }
});

const isDeleting = ref(false);

const emit = defineEmits(['cancel', 'confirm']);

const handleConfirm = () => {
  emit('confirm', isDeleting);
  isDeleting.value = true;
}

// Configuration des actions
const actionConfigs = {
  delete: {
    icon: 'heroicons:trash',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-100',
    label: 'Supprimer',
    description: 'Cette action supprimera définitivement l\'entreprise.',
    buttonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
    buttonSecondary: 'text-gray-700 hover:bg-gray-100',
    alertBg: 'bg-red-50',
    alertBorder: 'border-red-200',
    alertText: 'text-red-800',
    confirmationMessage: 'Cette suppression est irréversible. Toutes les données associées seront perdues.'
  },
  confirm: {
    icon: 'heroicons:check-circle',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-100',
    label: 'Confirmer',
    description: 'Confirmer l\'action pour cette entreprise.',
    buttonPrimary: 'bg-green-600 hover:bg-green-700 text-white',
    buttonSecondary: 'text-gray-700 hover:bg-gray-100',
    alertBg: 'bg-blue-50',
    alertBorder: 'border-blue-200',
    alertText: 'text-blue-800',
    confirmationMessage: 'Souhaitez-vous confirmer cette action ?'
  }
}

const actionConfig = actionConfigs[props.action as keyof typeof actionConfigs] || actionConfigs.delete
</script>