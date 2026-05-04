<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES TECHNICIENS ==================== -->
      <div v-if="!selectedTechnician">
        <!-- Header dégradé sky -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">👨‍🔧 Gestion des techniciens</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez votre équipe technique</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouveau technicien
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre de recherche -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un technicien..." 
              @input="handleSearch"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement des techniciens...</p>
        </div>

        <!-- Tableau des techniciens -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Photo</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Spécialité</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(technician, index) in technicians" :key="technician.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-6 py-4">
                    <img :src="technician.photo || '/default-avatar.png'" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" @error="(e) => e.target.src = '/default-avatar.png'">
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ technician.name }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">{{ technician.specialty }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="{
                      'bg-emerald-100 text-emerald-700': technician.status === 'available',
                      'bg-orange-100 text-orange-700': technician.status === 'on_intervention',
                      'bg-red-100 text-red-700': technician.status === 'absent',
                      'bg-gray-100 text-gray-700': technician.status === 'on_leave'
                    }" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ technician.status === 'available' ? 'Disponible' : 
                         technician.status === 'on_intervention' ? 'En intervention' : 
                         technician.status === 'on_leave' ? 'En congé' : 'Absent' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ technician.phone }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ technician.email }}</td>
                  <td class="px-6 py-4 space-x-3">
                    <button @click="viewTechnician(technician.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                    <button @click="editTechnician(technician)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                    <button @click="deleteTechnician(technician.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ technicians.length }} sur {{ pagination.total }} techniciens
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

        <!-- Modal formulaire (structure IDENTIQUE à l'original) -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingTechnician ? 'Modifier le technicien' : 'Nouveau technicien' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveTechnician">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input v-model="form.name" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input v-model="form.email" type="email" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input v-model="form.phone" type="tel" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Spécialité *</label>
                    <input v-model="form.specialty" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                    <input type="file" @change="handlePhotoUpload" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                    <div v-if="form.photoPreview" class="mt-2">
                      <img :src="form.photoPreview" class="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-sm">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">CNI *</label>
                    <input type="file" @change="handleCniUpload" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                    <div v-if="form.cni_path && typeof form.cni_path === 'string'" class="mt-1 text-sm text-sky-600">
                      Fichier: {{ form.cni_path.split('/').pop() }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date d'embauche *</label>
                    <input v-model="form.hire_date" type="date" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
                    <select v-model="form.status" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500">
                      <option value="available">Disponible</option>
                      <option value="on_intervention">En intervention</option>
                      <option value="on_leave">En congé</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                    <textarea v-model="form.address" required rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent"></textarea>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
                    <textarea v-model="form.note" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent"></textarea>
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

      <!-- ==================== FICHE TECHNICIEN DÉTAILLÉE ==================== -->
      <div v-else-if="selectedTechnician" class="space-y-6">
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <!-- En-tête -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start flex-wrap gap-4">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="exportTechnicianPdf" class="px-3 py-1.5 bg-white text-sky-700 rounded-lg font-medium hover:bg-sky-50 transition text-sm">📄 Export PDF</button>
                <button @click="openEditForm" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">Modifier</button>
                <button @click="deleteTechnicianFromDetail" class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm">Supprimer</button>
                <button v-if="selectedTechnician.cni_path" @click="openCniModal(selectedTechnician.cni_path)" class="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition text-sm">📄 Voir CNI</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="flex gap-5">
              <img :src="selectedTechnician.photo || '/default-avatar.png'" class="w-20 h-20 rounded-full object-cover border-2 border-sky-200 shadow-md" @error="(e) => e.target.src = '/default-avatar.png'">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ selectedTechnician.name }}</h1>
                <p class="text-gray-600 mt-1">{{ selectedTechnician.specialty }} • {{ selectedTechnician.email }} • {{ selectedTechnician.phone }}</p>
                <p class="text-gray-500 text-sm mt-0.5">Embauché le {{ selectedTechnician.hire_date }}</p>
                <p class="text-gray-500 text-sm">{{ selectedTechnician.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques et interventions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Statistiques -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📊 Statistiques</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between items-center border-b border-gray-100 pb-3">
                <span class="text-gray-600">Nombre total d'interventions</span>
                <span class="font-bold text-2xl text-sky-700">{{ selectedTechnician.stats?.total || 0 }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-100 pb-3">
                <span class="text-gray-600">Interventions en cours</span>
                <span class="font-bold text-2xl text-orange-600">{{ getCurrentInterventionsCount() }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-100 pb-3">
                <span class="text-gray-600">Taux de résolution</span>
                <span class="font-bold text-2xl text-emerald-600">{{ selectedTechnician.stats?.resolutionRate || 0 }}%</span>
              </div>
              <div class="flex justify-between items-center border-b border-gray-100 pb-3">
                <span class="text-gray-600">Délai moyen d'intervention</span>
                <span class="font-bold text-2xl text-sky-700">{{ selectedTechnician.stats?.avgTime || 0 }} heures</span>
              </div>
            </div>
          </div>

          <!-- Interventions en cours -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">🔧 Interventions en cours</h2>
            </div>
            <div class="p-6">
              <div v-if="getCurrentInterventionsList().length > 0" class="space-y-3">
                <div v-for="inv in getCurrentInterventionsList().slice(0, 3)" :key="inv.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-semibold text-gray-900">{{ inv.customer?.name || 'N/A' }} - {{ inv.equipment?.brand }} {{ inv.equipment?.model }}</p>
                      <p class="text-sm text-gray-500 mt-1">Début: {{ inv.intervention_start_date || inv.created_at?.split('T')[0] }}</p>
                    </div>
                    <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">En cours</span>
                  </div>
                  <button @click="viewBreakdown(inv.id)" class="text-sky-600 text-sm font-medium mt-2 hover:underline">Voir le détail →</button>
                </div>
              </div>
              <p v-else class="text-gray-400 italic text-center py-4">Aucune intervention en cours</p>
              <button v-if="getCurrentInterventionsList().length > 3" @click="openCurrentInterventionsModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">
                Voir plus ({{ getCurrentInterventionsList().length - 3 }} supplémentaires) →
              </button>
            </div>
          </div>
        </div>

        <!-- Historique des interventions -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <h2 class="text-xl font-bold text-gray-900">📋 Historique des interventions</h2>
            <button @click="exportHistoryPdf" class="text-sky-600 text-sm font-medium hover:underline">📄 Exporter l'historique</button>
          </div>
          <div class="p-6">
            <div v-if="getBreakdownsList().length > 0" class="space-y-3">
              <div v-for="inv in getBreakdownsList().slice(0, 5)" :key="inv.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold text-gray-900">{{ inv.created_at?.split('T')[0] }} - {{ inv.customer?.name || 'N/A' }}</p>
                    <p class="text-sm text-gray-500 mt-1">Équipement: {{ inv.equipment?.brand }} {{ inv.equipment?.model }}</p>
                    <p class="text-sm text-gray-500">Durée: {{ inv.duration || 'Non calculée' }} heures</p>
                  </div>
                  <span :class="inv.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ inv.status === 'closed' ? 'Résolu' : 'En cours' }}
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-400 italic text-center py-4">Aucun historique</p>
            <button v-if="getBreakdownsList().length > 5" @click="openHistoryModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">
              Voir tout l'historique ({{ getBreakdownsList().length }} interventions) →
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== MODALS ==================== -->

      <!-- Modal Interventions en cours -->
      <div v-if="showCurrentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showCurrentModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Toutes les interventions en cours</h3>
            <button @click="showCurrentModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="(inv, idx) in getCurrentInterventionsList()" :key="inv.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <div class="flex justify-between items-start">
                <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ inv.customer?.name || 'N/A' }} - {{ inv.equipment?.brand }} {{ inv.equipment?.model }}</p>
                <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">En cours</span>
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <p><span class="text-gray-500">Date début:</span> {{ inv.intervention_start_date || inv.created_at?.split('T')[0] }}</p>
                <p><span class="text-gray-500">Défauts signalés:</span> {{ inv.reported_issues || 'Non spécifié' }}</p>
              </div>
              <button @click="viewBreakdown(inv.id)" class="text-sky-600 text-sm font-medium mt-2 hover:underline">Voir le détail de la panne →</button>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showCurrentModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal Historique complet -->
      <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showHistoryModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Historique complet des interventions</h3>
            <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="(inv, idx) in getBreakdownsList()" :key="inv.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <div class="flex justify-between items-start">
                <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ inv.created_at?.split('T')[0] }} - {{ inv.customer?.name || 'N/A' }}</p>
                <span :class="inv.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                  {{ inv.status === 'closed' ? 'Résolu' : 'En cours' }}
                </span>
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <p><span class="text-gray-500">Équipement:</span> {{ inv.equipment?.brand }} {{ inv.equipment?.model }}</p>
                <p><span class="text-gray-500">Défauts signalés:</span> {{ inv.reported_issues || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Défauts constatés:</span> {{ inv.observed_issues || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Tâches effectuées:</span> {{ inv.tasks_performed || 'Non spécifié' }}</p>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showHistoryModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Fermer</button>
          </div>
        </div>
      </div>

      <!-- MODAL POUR VOIR LA CNI -->
      <div v-if="showCniModal" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" @click.self="showCniModal = false">
        <div class="relative">
          <img :src="selectedCniImage" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl">
          <button @click="showCniModal = false" class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">&times;</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import axios from 'axios'

// Configuration Axios
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
    }
})

// Router
const router = useRouter()

// Helper pour l'URL des photos
const getPhotoUrl = (photo) => {
    if (!photo) return '/default-avatar.png'
    if (photo.startsWith('http')) return photo
    if (photo.startsWith('/storage')) return photo
    return photo
}

// États
const searchQuery = ref("")
const selectedTechnician = ref(null)
const technicians = ref([])
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
const editingTechnician = ref(null)
const form = ref({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    photo: null,
    photoPreview: null,
    cni_path: null,
    hire_date: "",
    status: "available",
    address: "",
    note: ""
})

const showCurrentModal = ref(false)
const showHistoryModal = ref(false)

// États pour la CNI
const showCniModal = ref(false)
const selectedCniImage = ref("")

let searchTimeout = null

// Fonctions helpers pour sécuriser l'accès aux données
const getCurrentInterventionsList = () => {
    if (selectedTechnician.value && selectedTechnician.value.current_interventions) {
        return selectedTechnician.value.current_interventions
    }
    return []
}

const getCurrentInterventionsCount = () => {
    return getCurrentInterventionsList().length
}

const getBreakdownsList = () => {
    if (selectedTechnician.value && selectedTechnician.value.breakdowns) {
        return selectedTechnician.value.breakdowns
    }
    return []
}

// Navigation
const navigateTo = (path) => {
    router.push(path)
}

// Fonction pour ouvrir la CNI en grand
const openCniModal = (cniUrl) => {
    selectedCniImage.value = getPhotoUrl(cniUrl)
    showCniModal.value = true
}

// ----- Fonctions API -----
const fetchTechnicians = async () => {
    loading.value = true
    try {
        const response = await api.get('/technicians', {
            params: {
                search: searchQuery.value,
                per_page: pagination.value.per_page,
                page: pagination.value.current_page
            }
        })
        technicians.value = response.data.data
        pagination.value = {
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            total: response.data.meta.total,
            per_page: response.data.meta.per_page
        }
    } catch (error) {
        console.error("Erreur chargement techniciens:", error)
        alert("Erreur lors du chargement des techniciens")
    } finally {
        loading.value = false
    }
}

const fetchTechnicianDetail = async (id) => {
    loadingDetail.value = true
    try {
        const response = await api.get(`/technicians/${id}`)
        selectedTechnician.value = response.data.data
        console.log("Détail chargé:", selectedTechnician.value)
    } catch (error) {
        console.error("Erreur chargement détail:", error)
        alert("Erreur lors du chargement des détails")
    } finally {
        loadingDetail.value = false
    }
}

const saveTechnician = async () => {
    saving.value = true
    try {
        const formData = new FormData()

        const fieldsToSend = ['name', 'email', 'phone', 'specialty', 'hire_date', 'status', 'address', 'note']
        
        fieldsToSend.forEach(key => {
            if (form.value[key] !== null && form.value[key] !== undefined && form.value[key] !== '') {
                formData.append(key, form.value[key])
            }
        })

        if (form.value.photo && form.value.photo instanceof File) {
            formData.append('photo', form.value.photo)
        }
        if (form.value.cni_path && form.value.cni_path instanceof File) {
            formData.append('cni_path', form.value.cni_path)
        }

        let response
        if (editingTechnician.value) {
            formData.append('_method', 'PUT')
            response = await api.post(`/technicians/${editingTechnician.value.id}`, formData)
        } else {
            response = await api.post('/technicians', formData)
        }

        if (response.data.success) {
            alert(response.data.message || 'Technicien enregistré avec succès')
            await fetchTechnicians()
            closeForm()
            if (selectedTechnician.value && editingTechnician.value) {
                await fetchTechnicianDetail(selectedTechnician.value.id)
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

const deleteTechnician = async (id) => {
    if (!confirm("Supprimer ce technicien ?")) return

    loading.value = true
    try {
        await api.delete(`/technicians/${id}`)
        alert("Technicien supprimé avec succès")
        await fetchTechnicians()
        if (selectedTechnician.value?.id === id) {
            selectedTechnician.value = null
        }
    } catch (error) {
        console.error("Erreur suppression:", error)
        alert("Erreur lors de la suppression")
    } finally {
        loading.value = false
    }
}

// ----- Fonctions UI -----
const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        pagination.value.current_page = 1
        fetchTechnicians()
    }, 500)
}

const changePage = (page) => {
    if (page < 1 || page > pagination.value.last_page) return
    pagination.value.current_page = page
    fetchTechnicians()
}

const openForm = () => {
    editingTechnician.value = null
    form.value = {
        name: "",
        email: "",
        phone: "",
        specialty: "",
        photo: null,
        photoPreview: null,
        cni_path: null,
        hire_date: "",
        status: "available",
        address: "",
        note: ""
    }
    showModal.value = true
}

const editTechnician = (technician) => {
    editingTechnician.value = technician
    form.value = {
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        specialty: technician.specialty,
        photo: null,
        photoPreview: technician.photo,
        cni_path: technician.cni_path,
        hire_date: technician.hire_date,
        status: technician.status,
        address: technician.address,
        note: technician.note || ""
    }
    showModal.value = true
}

const closeForm = () => {
    showModal.value = false
    editingTechnician.value = null
}

const viewTechnician = async (id) => {
    await fetchTechnicianDetail(id)
}

const goBackToList = () => {
    selectedTechnician.value = null
    fetchTechnicians()
}

const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        form.value.photo = file
        const reader = new FileReader()
        reader.onload = (e) => {
            form.value.photoPreview = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const handleCniUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        form.value.cni_path = file
    }
}

const deleteTechnicianFromDetail = () => {
    if (selectedTechnician.value) {
        deleteTechnician(selectedTechnician.value.id)
    }
}

const openEditForm = () => {
    editTechnician(selectedTechnician.value)
    showModal.value = true
}

const viewBreakdown = (id) => {
    navigateTo(`/breakdowns/${id}`)
}

const exportTechnicianPdf = () => {
    const printWindow = window.open('', '_blank')
    const statusLabel = selectedTechnician.value.status === 'available' ? 'Disponible' : 
                        selectedTechnician.value.status === 'on_intervention' ? 'En intervention' : 
                        selectedTechnician.value.status === 'on_leave' ? 'En congé' : 'Absent'
    
    const cniHtml = selectedTechnician.value.cni_path ? 
        `<div class="info-row"><strong>CNI / Pièce d'identité:</strong> <a href="${getPhotoUrl(selectedTechnician.value.cni_path)}" target="_blank">Voir le document</a></div>` : ''
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><title>Fiche Technicien - ${selectedTechnician.value.name}</title><meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0284c7; }
            .section { margin-bottom: 25px; }
            .section-title { color: #0284c7; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
        </style>
        </head>
        <body>
            <div class="header"><h1>NEO START TECH</h1><p>Fiche Technicien</p></div>
            <div class="section"><div class="section-title">📋 Informations technicien</div>
                <div class="info-row"><strong>Nom:</strong> ${selectedTechnician.value.name}</div>
                <div class="info-row"><strong>Spécialité:</strong> ${selectedTechnician.value.specialty}</div>
                <div class="info-row"><strong>Email:</strong> ${selectedTechnician.value.email}</div>
                <div class="info-row"><strong>Téléphone:</strong> ${selectedTechnician.value.phone}</div>
                <div class="info-row"><strong>Statut:</strong> ${statusLabel}</div>
                <div class="info-row"><strong>Date d'embauche:</strong> ${selectedTechnician.value.hire_date}</div>
                <div class="info-row"><strong>Adresse:</strong> ${selectedTechnician.value.address}</div>
                <div class="info-row"><strong>Note:</strong> ${selectedTechnician.value.note || 'Aucune'}</div>
                ${cniHtml}
            </div>
            <div class="section"><div class="section-title">📊 Statistiques</div>
                <div class="info-row"><strong>Total interventions:</strong> ${selectedTechnician.value.stats?.total || 0}</div>
                <div class="info-row"><strong>Taux de résolution:</strong> ${selectedTechnician.value.stats?.resolutionRate || 0}%</div>
                <div class="info-row"><strong>Délai moyen:</strong> ${selectedTechnician.value.stats?.avgTime || 0} heures</div>
            </div>
            <div class="footer"><p>Document généré automatiquement par Neo Start Tech - ${new Date().toLocaleString()}</p></div>
        </body>
        </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
}

const exportHistoryPdf = () => {
    const printWindow = window.open('', '_blank')
    let historyHtml = ''
    getBreakdownsList().forEach((inv, idx) => {
        historyHtml += `
            <div class="border rounded-lg p-4 mb-4">
                <p class="font-bold">${idx + 1}. ${inv.created_at?.split('T')[0]} - ${inv.customer?.name || 'N/A'}</p>
                <p><strong>Équipement:</strong> ${inv.equipment?.brand} ${inv.equipment?.model}</p>
                <p><strong>Défauts signalés:</strong> ${inv.reported_issues || 'Non spécifié'}</p>
                <p><strong>Défauts constatés:</strong> ${inv.observed_issues || 'Non spécifié'}</p>
                <p><strong>Tâches effectuées:</strong> ${inv.tasks_performed || 'Non spécifié'}</p>
                <p><strong>Statut:</strong> ${inv.status === 'closed' ? 'Résolu' : 'En cours'}</p>
            </div>
        `
    })
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><title>Historique des interventions - ${selectedTechnician.value.name}</title><meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0284c7; }
            .border { border: 1px solid #ddd; }
            .rounded-lg { border-radius: 8px; }
            .p-4 { padding: 16px; }
            .mb-4 { margin-bottom: 16px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
        </style>
        </head>
        <body>
            <div class="header"><h1>NEO START TECH</h1><p>Historique des interventions - ${selectedTechnician.value.name}</p></div>
            ${historyHtml}
            <div class="footer"><p>Document généré automatiquement par Neo Start Tech - ${new Date().toLocaleString()}</p></div>
        </body>
        </html>
    `
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
}

const openCurrentInterventionsModal = () => {
    showCurrentModal.value = trues
}

const openHistoryModal = () => {
    showHistoryModal.value = true
}

// Chargement initial
onMounted(() => {
    fetchTechnicians()
})
</script>