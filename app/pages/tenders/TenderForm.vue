<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-[#00000060] flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ tender ? 'Modifier l\'Appel d\'Offres' : 'Nouvel Appel d\'Offres' }}
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
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information Section -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Informations générales</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Référence *
                </label>
                <input
                  v-model="formData.reference"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ex: AO-2025-001"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Priorité *
                </label>
                <select
                  v-model="formData.priority"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="critical">Critique</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Titre descriptif de l'appel d'offres"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Description détaillée de l'appel d'offres"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Publisher Information Section -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Éditeur et source</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Éditeur *
                </label>
                <input
                  v-model="formData.publisher"
                  type="text"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nom de l'organisation"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <select
                  v-model="formData.source"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Choisir une source</option>
                  <option value="Site web officiel">Site web officiel</option>
                  <option value="Contact direct">Contact direct</option>
                  <option value="Partenaire">Partenaire</option>
                  <option value="Veille concurrentielle">Veille concurrentielle</option>
                  <option value="Réseau professionnel">Réseau professionnel</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Secteur *
                </label>
                <select
                  v-model="formData.sector"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Choisir un secteur</option>
                  <option value="Administration publique">Administration publique</option>
                  <option value="Banque et Finance">Banque et Finance</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Santé">Santé</option>
                  <option value="Industrie">Industrie</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Transport">Transport</option>
                  <option value="Télécommunications">Télécommunications</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  v-model="formData.location"
                  type="text"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ville, Région, Pays"
                />
              </div>
            </div>
          </div>

          <!-- Timing and Value Section -->
          <div class="bg-amber-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Échéance et valeur</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date limite de soumission *
                </label>
                <input
                  v-model="formData.deadline"
                  type="datetime-local"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Valeur estimée (€) *
                </label>
                <input
                  v-model="formData.estimatedValue"
                  type="number"
                  min="0"
                  step="100"
                  required
                  class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <!-- Requirements Section -->
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Exigences</h4>
            <div class="space-y-3">
              <div v-for="(requirement, index) in formData.requirements" :key="index" class="flex items-center space-x-2">
                <input
                  v-model="formData.requirements[index]"
                  type="text"
                  class="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Décrivez une exigence..."
                />
                <button
                  @click="removeRequirement(index)"
                  type="button"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              <button
                @click="addRequirement"
                type="button"
                class="inline-flex items-center text-sm text-green-600 hover:text-green-800"
              >
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Ajouter une exigence
              </button>
            </div>
          </div>

          <!-- Tags Section -->
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Étiquettes</h4>
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {{ tag }}
                  <button
                    @click="removeTag(index)"
                    type="button"
                    class="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model="newTag"
                  @keyup.enter="addTag"
                  type="text"
                  class="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ajouter une étiquette..."
                />
                <button
                  @click="addTag"
                  type="button"
                  class="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Veuillez corriger les erreurs suivantes :
                </h3>
                <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
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
          @click="handleSubmit"
          type="button"
          :disabled="isLoading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enregistrement...
          </span>
          <span v-else>
            {{ tender ? 'Mettre à jour' : 'Créer' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Tender, TenderFormData, TenderPriority } from '@/types/tenders'

// Props and Emits
interface Props {
  tender?: Tender | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: TenderFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form state
const isLoading = ref(false)
const errors = ref<string[]>([])
const newTag = ref('')

// Form data - Following domain-first approach
const formData = ref<TenderFormData>({
  reference: '',
  title: '',
  description: '',
  source: '',
  publisher: '',
  deadline: '',
  estimatedValue: 0,
  sector: '',
  location: '',
  priority: 'medium' as TenderPriority,
  requirements: [''],
  tags: []
})

// Initialize form with existing tender data if editing
onMounted(() => {
  if (props.tender) {
    formData.value = {
      reference: props.tender.reference,
      title: props.tender.title,
      description: props.tender.description,
      source: props.tender.source,
      publisher: props.tender.publisher,
      deadline: formatDateTimeLocal(props.tender.deadline),
      estimatedValue: props.tender.estimatedValue,
      sector: props.tender.sector,
      location: props.tender.location,
      priority: props.tender.priority,
      requirements: props.tender.requirements.length > 0 ? props.tender.requirements : [''],
      tags: [...props.tender.tags]
    }
  }
})

// Methods
const validateForm = (): boolean => {
  errors.value = []

  if (!formData.value.reference.trim()) {
    errors.value.push('La référence est obligatoire')
  }

  if (!formData.value.title.trim()) {
    errors.value.push('Le titre est obligatoire')
  }

  if (!formData.value.description.trim()) {
    errors.value.push('La description est obligatoire')
  }

  if (!formData.value.source.trim()) {
    errors.value.push('La source est obligatoire')
  }

  if (!formData.value.publisher.trim()) {
    errors.value.push('L\'éditeur est obligatoire')
  }

  if (!formData.value.deadline) {
    errors.value.push('La date limite est obligatoire')
  } else {
    const deadlineDate = new Date(formData.value.deadline)
    const now = new Date()
    if (deadlineDate <= now) {
      errors.value.push('La date limite doit être dans le futur')
    }
  }

  if (!formData.value.estimatedValue || formData.value.estimatedValue <= 0) {
    errors.value.push('La valeur estimée doit être supérieure à 0')
  }

  if (!formData.value.sector.trim()) {
    errors.value.push('Le secteur est obligatoire')
  }

  if (!formData.value.location.trim()) {
    errors.value.push('La localisation est obligatoire')
  }

  // Clean up empty requirements
  formData.value.requirements = formData.value.requirements.filter(req => req.trim() !== '')

  return errors.value.length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Convert deadline back to ISO string
    const submitData: TenderFormData = {
      ...formData.value,
      deadline: new Date(formData.value.deadline).toISOString()
    }

    emit('save', submitData)
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    errors.value.push('Une erreur est survenue lors de l\'enregistrement')
  } finally {
    isLoading.value = false
  }
}

const addRequirement = () => {
  formData.value.requirements.push('')
}

const removeRequirement = (index: number) => {
  if (formData.value.requirements.length > 1) {
    formData.value.requirements.splice(index, 1)
  }
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
</script>