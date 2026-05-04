<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES ÉQUIPEMENTS ==================== -->
      <div v-if="!selectedEquipment">
        <!-- Header dégradé sky -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">📦 Gestion des équipements</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez tout votre parc matériel</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouvel équipement
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre de recherche et filtres -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="relative flex-1">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Rechercher un équipement..." 
                @input="handleSearch"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select v-model="filters.status" @change="applyFilters" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white min-w-[180px]">
              <option value="">Tous les statuts</option>
              <option value="in_service">En service</option>
              <option value="broken">En panne</option>
              <option value="repairing">En réparation</option>
              <option value="out_of_service">Hors service</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement des équipements...</p>
        </div>

        <!-- Tableau des équipements -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-12">N°</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom équipement</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">Photos</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Marque/Modèle</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28">N° série</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">Qté</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-36">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(equipment, index) in equipments" :key="equipment.id" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{{ equipment.customerName }}</td>
                  <td class="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{{ equipment.equipmentName }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1">
                      <div class="flex -space-x-2">
                        <img v-for="(photo, idx) in (equipment.photos || []).slice(0, 2)" :key="idx" :src="photo" class="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" @error="(e) => e.target.src = '/default-avatar.png'">
                        <span v-if="(equipment.photos || []).length > 2" class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-medium">+{{ equipment.photos.length - 2 }}</span>
                        <span v-else-if="!(equipment.photos || []).length" class="text-gray-400 text-xs ml-2">Aucune</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{{ equipment.brand }} {{ equipment.model }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ equipment.serialNumber }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ equipment.quantity }}</td>
                  <td class="px-4 py-3">
                    <span :class="getStatusClass(equipment.status)" class="px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                      {{ formatStatus(equipment.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2 flex-wrap">
                      <button @click="viewEquipment(equipment.id)" class="text-sky-600 hover:text-sky-800 font-medium text-sm">Voir</button>
                      <button @click="editEquipment(equipment)" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Modifier</button>
                      <button @click="deleteEquipment(equipment.id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Supprimer</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ equipments.length }} sur {{ pagination.total }} équipements
            </div>
            <div class="flex gap-2">
              <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Précédent
              </button>
              <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                Page {{ pagination.current_page }} / {{ pagination.last_page }}
              </span>
              <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Suivant
              </button>
            </div>
          </div>
        </div>

        <!-- Modal formulaire -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingEquipment ? 'Modifier l\'équipement' : 'Nouvel équipement' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveEquipment">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                    <select v-model="form.customer_id" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                      <option value="">Sélectionner un client</option>
                      <option v-for="c in customersList" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipement *</label>
                    <input v-model="form.equipment_name" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" placeholder="Ex: PC Bureau, Serveur, Imprimante...">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type d'équipement *</label>
                    <select v-model="form.type" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                      <option value="network">Réseau</option>
                      <option value="non_network">Non réseau</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                    <input v-model="form.brand" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Modèle *</label>
                    <input v-model="form.model" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de série *</label>
                    <input v-model="form.serial_number" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
                    <input v-model="form.quantity" type="number" min="1" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date d'enregistrement</label>
                    <input v-model="form.registration_date" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
                    <select v-model="form.status" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                      <option value="in_service">En service</option>
                      <option value="broken">En panne</option>
                      <option value="repairing">En réparation</option>
                      <option value="out_of_service">Hors service</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <textarea v-model="form.comment" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></textarea>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Photos (plusieurs possibles)</label>
                    <input type="file" multiple accept="image/*" @change="handlePhotosUpload" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                    <div v-if="form.photosPreview && form.photosPreview.length" class="flex gap-2 mt-3 flex-wrap">
                      <div v-for="(photo, idx) in form.photosPreview" :key="idx" class="relative">
                        <img :src="photo" class="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm">
                        <button type="button" @click="removePhoto(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 transition">×</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end gap-3 mt-6">
                  <button type="button" @click="closeForm" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50">
                    {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== FICHE ÉQUIPEMENT DÉTAILLÉE ==================== -->
      <div v-else-if="selectedEquipment" class="space-y-6">
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <!-- En-tête équipement -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start flex-wrap gap-4">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="openEditForm" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">Modifier</button>
                <button @click="deleteEquipmentFromDetail" class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm">Supprimer</button>
                <button @click="reportBreakdown(selectedEquipment.id)" class="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-sm">⚠️ Panne</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ selectedEquipment.equipmentName }}</h1>
              <p class="text-gray-600 mt-1">{{ selectedEquipment.brand }} {{ selectedEquipment.model }}</p>
              <p class="text-gray-500 text-sm mt-0.5">Client: {{ selectedEquipment.customerName }} • N° série: {{ selectedEquipment.serialNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Grille des informations -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">📋 Informations</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Nom équipement:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.equipmentName }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Marque:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.brand }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Modèle:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.model }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Type:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.type }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">N° série:</span> <span class="font-medium text-gray-800 font-mono">{{ selectedEquipment.serialNumber }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Quantité:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.quantity }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Statut:</span> <span :class="getStatusClass(selectedEquipment.status)" class="font-semibold px-2 py-1 rounded-full text-xs">{{ formatStatus(selectedEquipment.status) }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Sous contrat:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.underContract ? 'Oui' : 'Non' }}</span></div>
              <div class="border-b border-gray-100 pb-2"><span class="text-gray-500">Date enregistrement:</span> <span class="font-medium text-gray-800">{{ selectedEquipment.registrationDate }}</span></div>
              <div class="col-span-2"><span class="text-gray-500">Commentaire:</span> <p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedEquipment.comment || 'Aucun' }}</p></div>
            </div>
          </div>
        </div>

        <!-- Photos -->
        <div v-if="selectedEquipment.photos && selectedEquipment.photos.length" class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">📸 Photos</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-4 gap-4">
              <div v-for="(photo, idx) in selectedEquipment.photos" :key="idx">
                <img :src="photo" class="w-32 h-32 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-80 transition shadow-sm" @click="openPhotoModal(photo)" @error="(e) => e.target.src = '/default-avatar.png'">
              </div>
            </div>
          </div>
        </div>

        <!-- Historique des pannes -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          
          <div class="p-6">
            <div v-if="selectedEquipment.breakdowns && selectedEquipment.breakdowns.length" class="space-y-3">
              <div v-for="bd in selectedEquipment.breakdowns.slice(0, 3)" :key="bd.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                <div class="flex justify-between items-start">
                  <div><p class="font-semibold text-gray-900">{{ bd.date }} - {{ bd.status }}</p><p class="text-sm text-gray-500 mt-1">{{ bd.issue }}</p><p class="text-sm text-gray-500">Technicien: {{ bd.technician }}</p></div>
                  <span :class="bd.resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-1 rounded-full text-xs font-semibold">{{ bd.resolved ? 'Résolu' : 'En cours' }}</span>
                </div>
                <button @click="viewBreakdown(bd.id)" class="text-sky-600 text-sm font-medium mt-2 hover:underline">Voir le détail →</button>
              </div>
            </div>
            <p v-else class="text-gray-400 italic text-center py-4">Aucune panne signalée</p>
            <button v-if="selectedEquipment.breakdowns && selectedEquipment.breakdowns.length > 3" @click="openBreakdownsModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">
              Voir tout l'historique ({{ selectedEquipment.breakdowns.length }} pannes) →
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== MODALS ==================== -->
      
      <!-- Modal Historique complet des pannes -->
      <div v-if="showBreakdownsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showBreakdownsModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Historique complet des pannes</h3>
            <button @click="showBreakdownsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="(bd, idx) in selectedEquipment?.breakdowns" :key="bd.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <div class="flex justify-between items-start">
                <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ bd.date }} - {{ bd.status }}</p>
                <span :class="bd.resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-1 rounded-full text-xs font-semibold">{{ bd.resolved ? 'Résolu' : 'En cours' }}</span>
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <p><span class="text-gray-500">Problème:</span> {{ bd.issue }}</p>
                <p><span class="text-gray-500">Diagnostic:</span> {{ bd.diagnosis || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Solution:</span> {{ bd.solution || 'Non spécifiée' }}</p>
                <p><span class="text-gray-500">Technicien:</span> {{ bd.technician }}</p>
                <p><span class="text-gray-500">Durée:</span> {{ bd.duration || 0 }} heures</p>
                <p><span class="text-gray-500">Coût:</span> {{ bd.cost || 0 }} FCFA</p>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showBreakdownsModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal Photo -->
      <div v-if="showPhotoModal" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" @click.self="showPhotoModal = false">
        <div class="relative">
          <img :src="selectedPhoto" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl">
          <button @click="showPhotoModal = false" class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">&times;</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'multipart/form-data', 
    'Accept': 'application/json' 
  }
})

// Helper pour l'URL des photos
const getPhotoUrl = (photo) => {
  if (!photo) return '/default-avatar.png'
  if (photo.startsWith('http')) return photo
  if (photo.startsWith('/storage')) return photo
  return photo
}

// === FONCTIONS POUR LA GESTION DES STATUTS ===
const getStatusClass = (status) => {
  if (status === 'En service' || status === 'in_service') return 'bg-emerald-100 text-emerald-700'
  if (status === 'En panne' || status === 'broken') return 'bg-red-100 text-red-700'
  if (status === 'En réparation' || status === 'repairing') return 'bg-orange-100 text-orange-700'
  if (status === 'Hors service' || status === 'out_of_service') return 'bg-gray-100 text-gray-700'
  return 'bg-gray-100 text-gray-700'
}

const formatStatus = (status) => {
  if (status === 'in_service') return 'En service'
  if (status === 'broken') return 'En panne'
  if (status === 'repairing') return 'En réparation'
  if (status === 'out_of_service') return 'Hors service'
  return status || 'Non défini'
}

// États
const searchQuery = ref("")
const filters = ref({ status: "" })
const selectedEquipment = ref(null)
const equipments = ref([])
const customersList = ref([])
const loading = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)

const pagination = ref({ 
  current_page: 1, 
  last_page: 1, 
  total: 0, 
  per_page: 15 
})

const showModal = ref(false)
const editingEquipment = ref(null)
const form = ref({ 
  customer_id: "", 
  equipment_name: "",
  type: "non_network", 
  brand: "", 
  model: "", 
  serial_number: "", 
  quantity: 1, 
  registration_date: new Date().toISOString().split('T')[0], 
  status: "in_service", 
  comment: "", 
  photos: [], 
  photosPreview: [] 
})

const showBreakdownsModal = ref(false)
const showPhotoModal = ref(false)
const selectedPhoto = ref("")

let searchTimeout = null

// Navigation
const navigateTo = (path) => {
  router.push(path)
}

// ----- API FUNCTIONS -----
const fetchEquipments = async () => {
  loading.value = true
  try {
    const response = await api.get('/equipment', {
      params: { 
        search: searchQuery.value, 
        status: filters.value.status, 
        per_page: pagination.value.per_page, 
        page: pagination.value.current_page 
      }
    })
    equipments.value = response.data.data || []
    pagination.value = response.data.meta
  } catch (error) { 
    console.error("Erreur chargement équipements:", error)
    alert("Erreur lors du chargement des équipements") 
  } finally { 
    loading.value = false 
  }
}

const fetchCustomersList = async () => {
  try {
    const response = await api.get('/equipment/customers/list')
    customersList.value = response.data.data || []
  } catch (error) { 
    console.error("Erreur chargement clients:", error)
    alert("Erreur lors du chargement de la liste des clients")
  }
}

const fetchEquipmentDetail = async (id) => {
  loadingDetail.value = true
  try {
    const response = await api.get(`/equipment/${id}`)
    selectedEquipment.value = response.data.data
  } catch (error) { 
    console.error("Erreur chargement détails:", error)
    alert("Erreur lors du chargement des détails de l'équipement") 
  } finally { 
    loadingDetail.value = false 
  }
}

const saveEquipment = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    
    formData.append('customer_id', form.value.customer_id)
    formData.append('equipment_name', form.value.equipment_name)
    formData.append('type', form.value.type)
    formData.append('brand', form.value.brand)
    formData.append('model', form.value.model)
    formData.append('serial_number', form.value.serial_number)
    formData.append('quantity', form.value.quantity)
    formData.append('status', form.value.status)
    
    if (form.value.registration_date) {
      formData.append('registration_date', form.value.registration_date)
    }
    if (form.value.comment) {
      formData.append('comment', form.value.comment)
    }
    
    if (form.value.photos && form.value.photos.length > 0) {
      for (let i = 0; i < form.value.photos.length; i++) {
        if (form.value.photos[i] instanceof File) {
          formData.append('photos[]', form.value.photos[i])
        }
      }
    }
    
    let response
    if (editingEquipment.value) {
      formData.append('_method', 'PUT')
      response = await api.post(`/equipment/${editingEquipment.value.id}`, formData)
    } else {
      response = await api.post('/equipment', formData)
    }
    
    if (response.data.success) {
      alert(response.data.message || 'Équipement enregistré avec succès')
      await fetchEquipments()
      closeForm()
      if (selectedEquipment.value && editingEquipment.value) {
        await fetchEquipmentDetail(selectedEquipment.value.id)
      }
    }
  } catch (error) {
    console.error("Erreur sauvegarde:", error)
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      alert(errors.join('\n'))
    } else if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert("Erreur lors de l'enregistrement")
    }
  } finally { 
    saving.value = false 
  }
}

const deleteEquipment = async (id) => {
  if (!confirm("Supprimer cet équipement ?")) return
  loading.value = true
  try {
    await api.delete(`/equipment/${id}`)
    alert("Équipement supprimé avec succès")
    await fetchEquipments()
    if (selectedEquipment.value?.id === id) {
      selectedEquipment.value = null
    }
  } catch (error) { 
    console.error("Erreur suppression:", error)
    alert("Erreur lors de la suppression") 
  } finally { 
    loading.value = false 
  }
}

// ----- UI FUNCTIONS -----
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { 
    pagination.value.current_page = 1
    fetchEquipments() 
  }, 500)
}

const applyFilters = () => { 
  pagination.value.current_page = 1
  fetchEquipments() 
}

const changePage = (page) => { 
  if (page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  fetchEquipments() 
}

const openForm = () => { 
  editingEquipment.value = null
  form.value = { 
    customer_id: "", 
    equipment_name: "",
    type: "non_network", 
    brand: "", 
    model: "", 
    serial_number: "", 
    quantity: 1, 
    registration_date: new Date().toISOString().split('T')[0], 
    status: "in_service", 
    comment: "", 
    photos: [], 
    photosPreview: [] 
  }
  showModal.value = true 
}

const editEquipment = (equipment) => { 
  editingEquipment.value = equipment
  
  let statusValue = 'in_service'
  if (equipment.status === 'En service') statusValue = 'in_service'
  else if (equipment.status === 'En panne') statusValue = 'broken'
  else if (equipment.status === 'En réparation') statusValue = 'repairing'
  else if (equipment.status === 'Hors service') statusValue = 'out_of_service'
  
  let typeValue = 'non_network'
  if (equipment.type === 'Réseau') typeValue = 'network'
  else if (equipment.type === 'Non réseau') typeValue = 'non_network'
  else if (equipment.type === 'Autre') typeValue = 'other'
  
  form.value = { 
    customer_id: equipment.customerId,
    equipment_name: equipment.equipmentName || '',
    type: typeValue,
    brand: equipment.brand,
    model: equipment.model,
    serial_number: equipment.serialNumber,
    quantity: equipment.quantity,
    registration_date: equipment.registrationDate,
    status: statusValue,
    comment: equipment.comment || "",
    photos: [],
    photosPreview: equipment.photos || []
  }
  showModal.value = true 
}

const closeForm = () => { 
  showModal.value = false
  editingEquipment.value = null 
}

const viewEquipment = async (id) => { 
  await fetchEquipmentDetail(id) 
}

const goBackToList = () => { 
  selectedEquipment.value = null
  fetchEquipments() 
}

const deleteEquipmentFromDetail = () => { 
  if (selectedEquipment.value) {
    deleteEquipment(selectedEquipment.value.id)
  }
}

const openEditForm = () => { 
  editEquipment(selectedEquipment.value)
  showModal.value = true 
}

const handlePhotosUpload = (event) => {
  const files = Array.from(event.target.files)
  form.value.photos = files
  const previews = []
  files.forEach(file => { 
    const reader = new FileReader()
    reader.onload = (e) => { 
      previews.push(e.target.result)
      if (previews.length === files.length) {
        form.value.photosPreview = previews
      }
    }
    reader.readAsDataURL(file) 
  })
}

const removePhoto = (index) => { 
  form.value.photosPreview.splice(index, 1)
  form.value.photos.splice(index, 1) 
}

const reportBreakdown = (id) => { 
  navigateTo(`/breakdowns?equipmentId=${id}`) 
}

const viewBreakdown = (id) => { 
  navigateTo(`/breakdowns/${id}`) 
}

const openPhotoModal = (photo) => { 
  selectedPhoto.value = photo
  showPhotoModal.value = true 
}

const openBreakdownsModal = () => { 
  showBreakdownsModal.value = true 
}

// Chargement initial
onMounted(() => { 
  fetchEquipments()
  fetchCustomersList()
})
</script>