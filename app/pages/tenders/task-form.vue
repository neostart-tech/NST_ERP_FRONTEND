<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-[#00000065] bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ task ? 'Modifier la tâche' : 'Nouvelle tâche' }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Informations de base</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la tâche *
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ex: Analyser le cahier des charges"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Description * </label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Décrivez la tâche en détail..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Assignment and Planning -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Affectation et planning</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Assigné à * </label>
                <select
                  v-model="formData.assignedTo"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Choisir une personne</option>
                  <option v-for="person in teamMembers" :key="person" :value="person">
                    {{ person }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Priorité * </label>
                <select
                  v-model="formData.priority"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date d'échéance *
                </label>
                <input
                  v-model="formData.dueDate"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temps estimé (heures) *
                </label>
                <input
                  v-model="formData.estimatedHours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          <!-- Dependencies -->
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Dépendances</h4>
            <div class="space-y-3">
              <p class="text-sm text-gray-600">
                Sélectionnez les tâches qui doivent être terminées avant celle-ci :
              </p>

              <div v-if="availableTasks.length === 0" class="text-sm text-gray-500 italic">
                Aucune autre tâche disponible pour ce projet
              </div>

              <div v-else class="space-y-2 max-h-32 overflow-y-auto">
                <label
                  v-for="availableTask in availableTasks"
                  :key="availableTask.id"
                  class="flex items-center p-2 hover:bg-purple-100 rounded cursor-pointer"
                >
                  <input
                    :value="availableTask.id"
                    v-model="formData.dependencies"
                    type="checkbox"
                    class="rounded px-3 py-2 border border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ availableTask.title }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Étiquettes</h4>
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ tag }}
                  <button
                    @click="removeTag(index)"
                    type="button"
                    class="ml-1 text-green-600 hover:text-green-800"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </span>
              </div>

              <div class="flex items-center space-x-2">
                <input
                  v-model="newTag"
                  @keyup.enter="addTag"
                  type="text"
                  class="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ajouter une étiquette..."
                />
                <button
                  @click="addTag"
                  type="button"
                  class="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Ajouter
                </button>
              </div>

              <!-- Suggested Tags -->
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="suggestion in suggestedTags"
                  :key="suggestion"
                  @click="addSuggestedTag(suggestion)"
                  type="button"
                  class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                >
                  + {{ suggestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
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
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enregistrement...
          </span>
          <span v-else>
            {{ task ? 'Mettre à jour' : 'Créer la tâche' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTenderStore } from '../../stores/tenderStore';
import type { ProjectTask, TaskFormData, TaskPriority } from '../../../types/tenders';

// Props and Emits
interface Props {
  tenderId: string
  task?: ProjectTask | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: TaskFormData & { tenderId: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tendersStore = useTenderStore()

// State
const isLoading = ref(false)
const errors = ref<string[]>([])
const newTag = ref('')

// Form data - Following domain-first approach
const formData = ref<TaskFormData>({
  title: '',
  description: '',
  assignedTo: '',
  dueDate: '',
  estimatedHours: 8,
  priority: 'medium' as TaskPriority,
  dependencies: [],
  tags: [],
})

// Team members - In real app, this would come from a store or API
const teamMembers = [
  'Jean Dupont',
  'Marie Martin',
  'Pierre Durand',
  'Sophie Blanc',
  'Michel Moreau',
  'Élise Bernard',
  'Thomas Petit',
  'Laura Simon',
]

// Suggested tags based on common task categories
const suggestedTags = computed(() => {
  const allSuggestions = [
    'Analyse',
    'Rédaction',
    'Technique',
    'Commercial',
    'Révision',
    'Recherche',
    'Présentation',
    'Coordination',
  ]
  return allSuggestions.filter((tag) => !formData.value.tags.includes(tag))
})

// Available tasks for dependencies (exclude current task)
const availableTasks = computed(() => {
  const allTasks = tendersStore.getTenderTasks(props.tenderId)
  return allTasks.filter((task) => task.id !== props.task?.id)
})

// Initialize form with existing task data if editing
onMounted(() => {
  if (props.task) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      assignedTo: props.task.assignedTo,
      dueDate: formatDateTimeLocal(props.task.dueDate),
      estimatedHours: props.task.estimatedHours,
      priority: props.task.priority,
      dependencies: [...props.task.dependencies],
      tags: [...props.task.tags],
    }
  } else {
    // Set default due date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(17, 0, 0, 0) // Default to 5 PM
    formData.value.dueDate = formatDateTimeLocal(tomorrow.toISOString())
  }
})

// Methods
const validateForm = (): boolean => {
  errors.value = []

  if (!formData.value.title.trim()) {
    errors.value.push('Le titre est obligatoire')
  }

  if (!formData.value.description.trim()) {
    errors.value.push('La description est obligatoire')
  }

  if (!formData.value.assignedTo.trim()) {
    errors.value.push("L'assignation est obligatoire")
  }

  if (!formData.value.dueDate) {
    errors.value.push("La date d'échéance est obligatoire")
  } else {
    const dueDate = new Date(formData.value.dueDate)
    const now = new Date()
    if (dueDate <= now) {
      errors.value.push("La date d'échéance doit être dans le futur")
    }
  }

  if (!formData.value.estimatedHours || formData.value.estimatedHours <= 0) {
    errors.value.push('Le temps estimé doit être supérieur à 0')
  }

  return errors.value.length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Convert deadline back to ISO string
    const submitData: TaskFormData & { tenderId: string } = {
      ...formData.value,
      tenderId: props.tenderId,
      dueDate: new Date(formData.value.dueDate).toISOString(),
    }

    if (props.task) {
      // Update existing task
      await tendersStore.updateTask(props.task.id, submitData)
    } else {
      // Create new task
      await tendersStore.createTask(submitData)
    }

    emit('save', submitData)
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    errors.value.push("Une erreur est survenue lors de l'enregistrement")
  } finally {
    isLoading.value = false
  }
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const addSuggestedTag = (tag: string) => {
  if (!formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
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
