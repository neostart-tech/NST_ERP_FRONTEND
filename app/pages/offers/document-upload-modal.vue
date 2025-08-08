<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-[#00000070]  flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Téléverser un document</h3>
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
          <!-- File Upload Section -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-4">
              Fichier à téléverser *
            </label>

            <!-- Drop Zone -->
            <div
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              :class="{ 'border-green-400 bg-green-50': isDragging }"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.zip"
                @change="handleFileSelect"
                class="hidden"
              />

              <div v-if="selectedFiles.length === 0">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">
                  <span class="font-medium text-green-600 hover:text-green-500"
                    >Cliquez pour sélectionner</span
                  >
                  ou glissez-déposez vos fichiers ici
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  PDF, DOC, XLS, PPT, images, ZIP jusqu'à 10MB par fichier
                </p>
              </div>

              <!-- Selected Files Preview -->
              <div v-else class="space-y-3">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <svg
                        class="h-8 w-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <button
                    @click.stop="removeFile(index)"
                    type="button"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>

                <button
                  @click.stop="addMoreFiles"
                  type="button"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Ajouter d'autres fichiers
                </button>
              </div>
            </div>
          </div>

          <!-- Document Metadata -->
          <div v-if="selectedFiles.length > 0" class="space-y-6">
            <!-- offer Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Appel d'offres * </label>
              <select
                v-model="formData.offerId"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Sélectionner un appel d'offres</option>
                <option
                  v-for="offer in offersStore.offers"
                  :key="offer.id"
                  :value="offer.id"
                >
                  {{ offer.reference }} - {{ offer.title }}
                </option>
              </select>
            </div>

            <!-- Document Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de document *
              </label>
              <select
                v-model="formData.type"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Choisir un type</option>
                <option value="cahier_charges">Cahier des charges</option>
                <option value="reglement">Règlement</option>
                <option value="plans">Plans</option>
                <option value="annexe">Annexe</option>
                <option value="specification">Spécification technique</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Catégorie * </label>
              <select
                v-model="formData.category"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Choisir une catégorie</option>
                <option value="required">Obligatoire</option>
                <option value="optional">Optionnel</option>
                <option value="reference">Référence</option>
                <option value="template">Modèle</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Description </label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Description du document (optionnel)"
              ></textarea>
            </div>

            <!-- Required Document Toggle -->
            <div class="flex items-center">
              <input
                v-model="formData.isRequired"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Ce document est obligatoire pour la soumission
              </label>
            </div>

            <!-- Upload Progress -->
            <div v-if="isUploading" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-700">Téléchargement en cours...</span>
                <span class="text-gray-500">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
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
          :disabled="selectedFiles.length === 0 || isUploading"
          type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="isUploading" class="flex items-center">
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
            Téléchargement...
          </span>
          <span v-else> Télécharger {{ selectedFiles.length }} fichier(s) </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useoffersStore } from '@/stores/offers'
import type { DocumentType, DocumentCategory } from '@/types/offers'

// Props and Emits
interface Emits {
  (e: 'close'): void
  (e: 'uploaded', documents: any[]): void
}

const emit = defineEmits<Emits>()
const offersStore = useoffersStore()

// State
const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const errors = ref<string[]>([])

// Form data
const formData = reactive({
  offerId: '',
  type: '' as DocumentType | '',
  category: '' as DocumentCategory | '',
  description: '',
  isRequired: false,
})

// File constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/zip',
]

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const addMoreFiles = () => {
  triggerFileInput()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const validFiles: File[] = []
  const newErrors: string[] = []

  files.forEach((file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      newErrors.push(`${file.name}: Fichier trop volumineux (max 10MB)`)
      return
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      newErrors.push(`${file.name}: Type de fichier non autorisé`)
      return
    }

    // Check if file already selected
    if (selectedFiles.value.some((f) => f.name === file.name && f.size === file.size)) {
      newErrors.push(`${file.name}: Fichier déjà sélectionné`)
      return
    }

    validFiles.push(file)
  })

  // Add valid files
  selectedFiles.value.push(...validFiles)

  // Update errors
  errors.value = errors.value.filter((e) => !e.includes('Fichier'))
  errors.value.push(...newErrors)

  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)

  // Clear file-related errors if no files
  if (selectedFiles.value.length === 0) {
    errors.value = errors.value.filter((e) => !e.includes('Fichier'))
  }
}

const validateForm = (): boolean => {
  errors.value = []

  if (selectedFiles.value.length === 0) {
    errors.value.push('Au moins un fichier doit être sélectionné')
  }

  if (!formData.offerId) {
    errors.value.push("L'appel d'offres est obligatoire")
  }

  if (!formData.type) {
    errors.value.push('Le type de document est obligatoire')
  }

  if (!formData.category) {
    errors.value.push('La catégorie est obligatoire')
  }

  return errors.value.length === 0
}

const simulateUpload = async (files: File[]): Promise<any[]> => {
  isUploading.value = true
  uploadProgress.value = 0

  // Simulate upload progress
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  let uploadedSize = 0

  const uploadedDocuments = []

  for (const file of files) {
    // Simulate file upload
    const chunks = Math.ceil(file.size / (1024 * 1024)) // 1MB chunks
    for (let i = 0; i < chunks; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      uploadedSize += Math.min(1024 * 1024, file.size - i * 1024 * 1024)
      uploadProgress.value = Math.round((uploadedSize / totalSize) * 100)
    }

    // Create mock document object
    const document = {
      id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      offerId: formData.offerId,
      name: file.name,
      type: formData.type,
      category: formData.category,
      fileUrl: URL.createObjectURL(file), // In real app, this would be the server URL
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      version: 1,
      isRequired: formData.isRequired,
      description: formData.description || undefined,
    }

    uploadedDocuments.push(document)
  }

  isUploading.value = false
  return uploadedDocuments
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const uploadedDocuments = await simulateUpload(selectedFiles.value)

    // Add documents to the offer
    const offer = offersStore.getofferById(formData.offerId)
    if (offer) {
      offer.documents.push(...uploadedDocuments)
    }

    emit('uploaded', uploadedDocuments)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    errors.value.push('Une erreur est survenue lors du téléchargement')
  }
}

const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

// Drag and drop handlers
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}
</script>
