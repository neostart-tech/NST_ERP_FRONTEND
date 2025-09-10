<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Page Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Disponibilité des documents
        </h2>
        <button
          @click="navigateTo('/offers')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Retour à la liste
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Offer Information -->
      <div class="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informations de l'appel d'offre</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Référence</label>
            <p class="text-sm text-gray-900">{{ offerData.number }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Titre</label>
            <p class="text-sm text-gray-900">{{ offerData.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date limite de soumission</label>
            <p class="text-sm text-gray-900">{{ formatDate(offerData.submission_deadline) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Budget estimé</label>
            <p class="text-sm text-gray-900">{{ formatCurrency(offerData.estimated_budget) }}</p>
          </div>
        </div>
      </div>

      <!-- Documents Availability Status -->
      <div class="bg-white rounded-lg border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">État de disponibilité des documents</h3>
              <p class="text-sm text-gray-600 mt-1">Vérifiez le statut de chaque document requis pour votre soumission</p>
            </div>
            <button
              @click="showAddDocumentModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter une pièce
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="(document, index) in documentsAvailability" :key="index" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4 flex-1">
                  <div class="flex-shrink-0 mt-1">
                    <div v-if="document.status === 'available'" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div v-else-if="document.status === 'missing'" class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div v-else class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h4 class="text-sm font-medium text-gray-900">{{ document.name }}</h4>
                      <div v-if="document.required" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Requis
                      </div>
                      <div v-if="document.isCustom" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Ajouté
                      </div>
                    </div>
                    <p class="text-sm text-gray-500 mb-3">{{ document.description }}</p>
                    
                    <!-- Disponibilité et validation -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                        <div class="flex items-center space-x-4">
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              :value="true"
                              v-model="document.isAvailable"
                              @change="updateDocumentAvailability(index)"
                              class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Disponible</span>
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              :value="false"
                              v-model="document.isAvailable"
                              @change="updateDocumentAvailability(index)"
                              class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Non disponible</span>
                          </label>
                        </div>
                      </div>
                      
                      <div v-if="document.isAvailable">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Validité</label>
                        <div class="flex items-center space-x-4">
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              :value="true"
                              v-model="document.isValid"
                              class="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Valide</span>
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              :value="false"
                              v-model="document.isValid"
                              class="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Non valide</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Date limite de demande si non valide -->
                    <div v-if="document.isAvailable && document.isValid === false" class="mt-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Date limite de demande</label>
                      <input
                        type="date"
                        v-model="document.requestDeadline"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        :min="new Date().toISOString().split('T')[0]"
                      />
                    </div>
                    
                    <!-- Upload de document -->
                    <div v-if="document.isAvailable" class="mt-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Document</label>
                      <div class="space-y-2">
                        <div v-if="document.uploadedFile" class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                          <div class="flex items-center space-x-3">
                            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-sm font-medium text-green-800">{{ document.uploadedFile?.name || 'Fichier' }}</span>
                          </div>
                          <button
                            @click="removeUploadedFile(index)"
                            class="text-red-600 hover:text-red-800"
                            title="Supprimer le fichier"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <div class="text-center">
                            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div class="mt-2">
                              <label :for="'file-upload-' + index" class="cursor-pointer">
                                <span class="text-sm font-medium text-blue-600 hover:text-blue-500">
                                  Cliquez pour télécharger
                                </span>
                                <span class="text-sm text-gray-500"> ou glissez-déposez</span>
                              </label>
                              <input
                                :id="'file-upload-' + index"
                                type="file"
                                @change="handleFileUpload($event, index)"
                                class="sr-only"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                            </div>
                            <p class="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    v-if="document.isCustom"
                    @click="removeDocument(index)"
                    class="text-red-600 hover:text-red-800"
                    title="Supprimer ce document"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Résumé</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ availableCount }}</p>
                <p class="text-xs text-gray-500">Disponibles</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ inProgressCount }}</p>
                <p class="text-xs text-gray-500">En cours</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ missingCount }}</p>
                <p class="text-xs text-gray-500">Manquants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <button
          @click="navigateTo('/offers')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Retour
        </button>
        
        <div class="flex space-x-3">
          <button
            v-if="allDocumentsAvailable"
            @click="proceedToLotsConfiguration"
            type="button"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Configurer les lots
          </button>
          
          <button
            v-else
            @click="saveProgress"
            type="button"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Sauvegarder le progrès
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter un document -->
    <div v-if="showAddDocumentModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showAddDocumentModal = false"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Ajouter une nouvelle pièce
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom du document</label>
                    <input
                      v-model="newDocument.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ex: Certificat de conformité"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      v-model="newDocument.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Description détaillée du document..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="newDocument.required"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">Document requis</span>
                    </label>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                    <div class="flex items-center space-x-4">
                      <label class="inline-flex items-center">
                        <input
                          type="radio"
                          :value="true"
                          v-model="newDocument.isAvailable"
                          class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Disponible</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input
                          type="radio"
                          :value="false"
                          v-model="newDocument.isAvailable"
                          class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Non disponible</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="newDocument.isAvailable">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Validité</label>
                    <div class="flex items-center space-x-4">
                      <label class="inline-flex items-center">
                        <input
                          type="radio"
                          :value="true"
                          v-model="newDocument.isValid"
                          class="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Valide</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input
                          type="radio"
                          :value="false"
                          v-model="newDocument.isValid"
                          class="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Non valide</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="newDocument.isAvailable && newDocument.isValid === false">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date limite de demande</label>
                    <input
                      v-model="newDocument.requestDeadline"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      :min="new Date().toISOString().split('T')[0]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="addNewDocument"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Ajouter
            </button>
            <button
              @click="showAddDocumentModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icons } from '~/utils/icons';

definePageMeta({
  layout: 'default'
});

import { ref, computed, reactive, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';

// Interfaces
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface Document {
  name: string;
  description: string;
  required: boolean;
  status: 'available' | 'missing' | 'in-progress';
  isAvailable: boolean;
  isValid: boolean | null;
  requestDeadline: string | null;
  isCustom: boolean;
  uploadedFile: UploadedFile | null;
}

interface NewDocument {
  name: string;
  description: string;
  required: boolean;
  isAvailable: boolean;
  isValid: boolean | null;
  requestDeadline: string | null;
}

interface OfferData {
  id: string;
  number: string;
  title: string;
  description: string;
  submission_deadline: string;
  estimated_budget: number;
  status: string;
}

const router = useRouter();
const navigateTo = router.push;

// Route params
const route = useRoute();
const offerId = route.params.id as string;

// State
const isLoading = ref(false);
const showAddDocumentModal = ref(false);

// Mock offer data
const offerData = reactive<OfferData>({
  id: '',
  number: '',
  title: '',
  description: '',
  submission_deadline: '',
  estimated_budget: 0,
  status: ''
});

// Documents availability status
const documentsAvailability = ref<Document[]>([
  {
    name: 'Attestation de conformité fiscale',
    description: 'Attestation de conformité fiscale délivrée par l\'administration fiscale',
    required: true,
    status: 'available', // 'available', 'missing', 'in-progress'
    isAvailable: true,
    isValid: true,
    requestDeadline: null,
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Attestation de conformité sociale',
    description: 'Attestation de conformité sociale délivrée par la CNSS',
    required: true,
    status: 'available',
    isAvailable: true,
    isValid: true,
    requestDeadline: null,
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Extrait Kbis ou équivalent',
    description: 'Extrait Kbis ou document équivalent de moins de 3 mois',
    required: true,
    status: 'missing',
    isAvailable: false,
    isValid: null,
    requestDeadline: null,
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Certificat de qualification',
    description: 'Certificat de qualification professionnelle dans le domaine concerné',
    required: true,
    status: 'in-progress',
    isAvailable: true,
    isValid: false,
    requestDeadline: '2024-12-15',
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Références de travaux similaires',
    description: 'Liste des références de travaux similaires réalisés',
    required: false,
    status: 'available',
    isAvailable: true,
    isValid: true,
    requestDeadline: null,
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Garantie bancaire',
    description: 'Garantie bancaire si requise par l\'appel d\'offres',
    required: false,
    status: 'missing',
    isAvailable: false,
    isValid: null,
    requestDeadline: null,
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Offre technique',
    description: 'Document détaillant l\'approche technique et méthodologique',
    required: true,
    status: 'in-progress',
    isAvailable: true,
    isValid: false,
    requestDeadline: '2024-12-20',
    isCustom: false,
    uploadedFile: null
  },
  {
    name: 'Offre financière',
    description: 'Document détaillant le prix et les conditions financières',
    required: true,
    status: 'missing',
    isAvailable: false,
    isValid: null,
    requestDeadline: null,
    isCustom: false,
    uploadedFile: null
  }
]);

// Nouveau document à ajouter
const newDocument = ref<NewDocument>({
  name: '',
  description: '',
  required: false,
  isAvailable: true,
  isValid: true,
  requestDeadline: null
});

// Computed properties
const availableCount = computed(() => {
  return documentsAvailability.value.filter(doc => doc.isAvailable && doc.isValid).length;
});

const inProgressCount = computed(() => {
  return documentsAvailability.value.filter(doc => doc.isAvailable && doc.isValid === false).length;
});

const missingCount = computed(() => {
  return documentsAvailability.value.filter(doc => !doc.isAvailable).length;
});

const allDocumentsAvailable = computed(() => {
  return documentsAvailability.value
    .filter(doc => doc.required)
    .every(doc => doc.isAvailable && doc.isValid);
});

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount);
};

const loadOfferData = async () => {
  try {
    isLoading.value = true;
    // Mock data for example
    Object.assign(offerData, {
      id: offerId,
      number: 'AO-2024-001',
      title: 'Fourniture de matériel informatique',
      description: 'Fourniture de matériel informatique pour l\'administration',
      submission_deadline: '2024-12-31T23:59:59',
      estimated_budget: 50000,
      status: 'active'
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error);
  } finally {
    isLoading.value = false;
  }
};

const updateDocumentStatus = (index: number, status: 'available' | 'missing' | 'in-progress') => {
  const doc = documentsAvailability.value[index];
  if (doc) {
    doc.status = status;
  }
};

const updateDocumentAvailability = (index: number) => {
  const doc = documentsAvailability.value[index];
  if (!doc) return;
  
  if (doc.isAvailable) {
    doc.status = doc.isValid ? 'available' : 'in-progress';
  } else {
    doc.status = 'missing';
    doc.isValid = null;
    doc.requestDeadline = null;
  }
};

const addNewDocument = () => {
  if (!newDocument.value.name.trim()) {
    alert('Veuillez saisir le nom du document');
    return;
  }
  
  const document: Document = {
    name: newDocument.value.name,
    description: newDocument.value.description,
    required: newDocument.value.required,
    status: newDocument.value.isAvailable ? (newDocument.value.isValid ? 'available' : 'in-progress') : 'missing',
    isAvailable: newDocument.value.isAvailable,
    isValid: newDocument.value.isValid,
    requestDeadline: newDocument.value.requestDeadline,
    isCustom: true,
    uploadedFile: null
  };
  
  documentsAvailability.value.push(document);
  
  // Réinitialiser le formulaire
  newDocument.value = {
    name: '',
    description: '',
    required: false,
    isAvailable: true,
    isValid: true,
    requestDeadline: null
  };
  
  showAddDocumentModal.value = false;
};

const removeDocument = (index: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    documentsAvailability.value.splice(index, 1);
  }
};

const handleFileUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Vérifier la taille du fichier (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    alert('Le fichier est trop volumineux. Taille maximum : 10MB');
    return;
  }
  
  // Vérifier le type de fichier
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, JPG, PNG');
    return;
  }
  
  const doc = documentsAvailability.value[index];
  if (doc) {
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    doc.uploadedFile = uploadedFile;
  }
};

const removeUploadedFile = (index: number) => {
  const doc = documentsAvailability.value[index];
  if (doc) {
    doc.uploadedFile = null;
  }
};

const proceedToLotsConfiguration = () => {
  // Rediriger vers la page de configuration des lots
  navigateTo(`/offers/${offerId}/lots-configuration`);
};

const proceedToFinalSubmission = () => {
  // Rediriger vers la page de soumission finale
  navigateTo(`/offers/${offerId}/final-submission`);
};

const saveProgress = async () => {
  try {
    isLoading.value = true;
    
    const progressData = {
      offerId: offerId,
      documentsStatus: documentsAvailability.value,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Progrès sauvegardé:', progressData);
    // Ici vous pouvez ajouter la logique pour sauvegarder en base de données
    
    // Afficher un message de succès
    alert('Progrès sauvegardé avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du progrès:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadOfferData();
});
</script>