<template>
  <!-- Je crée l'interface principale avec un fond dégradé élégant -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
    <!-- ==================== -->
    <!-- CONTENU PRINCIPAL -->
    <!-- ==================== -->
    <div class="container mx-auto px-4 py-8">
      <!-- Section en-tête avec statistiques -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
          <!-- Titre et description -->
          <div>
            <h2 class="text-3xl font-bold text-slate-800 mb-2">Gestion des Équipements</h2>
            <p class="text-slate-600 text-lg">Surveillez et gérez votre parc matériel en temps réel</p>
          </div>

          <!-- Bouton d'ajout d'équipement -->
          <button
            @click="openAddModal"
            class="group bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl flex items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="bg-white/20 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="font-semibold">Nouvel Équipement</span>
          </button>
        </div>

        <!-- ==================== -->
        <!-- CARTES DE STATISTIQUES -->
        <!-- ==================== -->
        <!-- Je crée 4 cartes pour afficher les statistiques principales -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <!-- Carte : Total des équipements -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600">Total Équipements</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">{{ equipmentsCount }}</p>
              </div>
              <div class="p-3 rounded-xl bg-blue-50">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Carte : Équipements réseau -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600">Équipements Réseau</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">{{ networkCount }}</p>
              </div>
              <div class="p-3 rounded-xl bg-emerald-50">
                <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Carte : Équipements hors réseau -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600">Hors Réseau</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">{{ nonNetworkCount }}</p>
              </div>
              <div class="p-3 rounded-xl bg-amber-50">
                <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Carte : Équipements en service -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600">En Service</p>
                <p class="text-3xl font-bold text-slate-800 mt-2">{{ equipmentsCount }}</p>
              </div>
              <div class="p-3 rounded-xl bg-green-50">
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== -->
      <!-- SECTION FILTRES -->
      <!-- ==================== -->
      <!-- Je crée une section pour filtrer et rechercher les équipements -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filtres et Recherche
          </h3>
          <!-- Bouton de réinitialisation des filtres -->
          <button
            @click="resetFilters"
            class="text-sm text-slate-600 hover:text-blue-600 flex items-center transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réinitialiser
          </button>
        </div>

        <!-- Grille de filtres -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Filtre par type d'équipement -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Type d'équipement</label>
            <select
              v-model="filterType"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">Tous les types</option>
              <option value="Réseau">Réseau</option>
              <option value="Non réseau">Non réseau</option>
            </select>
          </div>

          <!-- Filtre par marque -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Marque</label>
            <select
              v-model="filterBrand"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">Toutes les marques</option>
              <option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>

          <!-- Champ de recherche texte -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Recherche</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Modèle, série, fabricant..."
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
            >
          </div>

          <!-- Bouton d'export -->
          <div class="flex items-end">
            <button
              @click="exportData"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exporter
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== -->
      <!-- TABLEAU DES ÉQUIPEMENTS -->
      <!-- ==================== -->
      <!-- Je crée un tableau responsive pour afficher la liste des équipements -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <!-- En-tête du tableau avec dégradé -->
              <tr class="bg-gradient-to-r from-blue-500 to-emerald-500">
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Photo</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Marque</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Fabricant</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Modèle</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">N° de série</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/50">
              <!-- Je boucle sur chaque équipement filtré -->
              <tr
                v-for="equipment in filteredEquipments"
                :key="equipment.id"
                class="hover:bg-blue-50/30 transition-colors duration-150 group"
              >
                <!-- Cellule photo avec aperçu cliquable -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-12 w-12 rounded-xl overflow-hidden cursor-pointer border-2 border-slate-200 group-hover:border-blue-300 transition-all duration-300" @click="openPhotoModal(equipment.photo)">
                    <!-- Affichage de la photo ou placeholder -->
                    <img
                      v-if="equipment.photo"
                      :src="`http://127.0.0.1:8000/storage/${equipment.photo}`"
                      class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      alt="Photo équipement"
                    >
                    <div v-else class="h-full w-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
                      <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </td>

                <!-- Type d'équipement avec badge coloré -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1.5 rounded-full text-xs font-semibold"
                    :class="equipment.type === 'Réseau'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
                  >
                    {{ equipment.type }}
                  </span>
                </td>

                <!-- Informations de base -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{{ equipment.brand }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{{ equipment.manufacturer || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ equipment.model }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700 bg-slate-50/50 rounded-lg">{{ equipment.serial_number }}</td>

                <!-- Boutons d'actions -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <!-- Bouton Voir -->
                    <button
                      @click="viewEquipment(equipment)"
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 group/btn"
                      title="Voir plus"
                    >
                      <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <!-- Bouton Modifier -->
                    <button
                      @click="editEquipment(equipment)"
                      class="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200 group/btn"
                      title="Modifier"
                    >
                      <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <!-- Bouton Générer PDF -->
                    <button
                      @click="generateEquipmentSheet(equipment)"
                      class="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200 group/btn"
                      title="Générer PDF"
                    >
                      <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <!-- Bouton Supprimer -->
                    <button
                      @click="confirmDelete(equipment)"
                      class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 group/btn"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Message quand aucun équipement n'est trouvé -->
              <tr v-if="filteredEquipments.length === 0">
                <td colspan="8" class="px-6 py-8 text-center">
                  <div class="flex flex-col items-center justify-center text-slate-500">
                    <svg class="w-16 h-16 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-lg font-medium text-slate-600">Aucun équipement trouvé</p>
                    <p class="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- MODAL AJOUT/MODIFICATION -->
    <!-- ==================== -->
    <!-- Je crée un modal pour ajouter ou modifier un équipement -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <!-- En-tête du modal avec dégradé -->
        <div class="bg-gradient-to-r from-blue-500 to-emerald-500 p-8">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="bg-white/20 p-3 rounded-2xl mr-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-white">
                  {{ isEditing ? 'Modifier l\'équipement' : 'Nouvel Équipement' }}
                </h2>
                <p class="text-white/80 mt-1">{{ isEditing ? 'Mettez à jour les informations de l\'équipement' : 'Ajoutez un nouvel équipement à votre parc' }}</p>
              </div>
            </div>
            <!-- Bouton de fermeture -->
            <button @click="closeModal" class="text-white/80 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 p-2 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Corps du formulaire -->
        <div class="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
          <form @submit.prevent="submitForm" class="space-y-8" enctype="multipart/form-data">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Champs communs à tous les équipements -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Type d'équipement *</label>
                <select
                  v-model="formData.type"
                  @change="toggleNetworkFields"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="Réseau">Réseau</option>
                  <option value="Non réseau">Non réseau</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Marque *</label>
                <input
                  v-model="formData.brand"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Fabricant</label>
                <input
                  v-model="formData.manufacturer"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Modèle *</label>
                <input
                  v-model="formData.model"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Numéro de série *</label>
                <input
                  v-model="formData.serial_number"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Prix du diagnostic (fcfa)</label>
                <input
                  v-model="formData.diagnostic_price"
                  type="number"
                  step="0.01"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <!-- Champs spécifiques aux équipements réseau -->
              <div v-if="showNetworkFields">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Rôle</label>
                <input
                  v-model="formData.role"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <div v-if="showNetworkFields">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Adresse MAC</label>
                <input
                  v-model="formData.mac_address"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <div v-if="showNetworkFields">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Adresse IP</label>
                <input
                  v-model="formData.ip_address"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <!-- Champs spécifiques aux équipements non-réseau -->
              <div v-if="!showNetworkFields">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Nom</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
              </div>

              <!-- Caractéristiques techniques -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Caractéristiques</label>
                <textarea
                  v-model="formData.characteristics"
                  rows="3"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                ></textarea>
              </div>

              <!-- Section Informations de la société -->
              <div class="md:col-span-2 border-t border-slate-200 pt-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Informations de la société
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Nom de la société *</label>
                    <input
                      v-model="formData.company_name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Adresse *</label>
                    <input
                      v-model="formData.company_address"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Code postal *</label>
                    <input
                      v-model="formData.company_zipCode"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Ville *</label>
                    <input
                      v-model="formData.company_city"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                  </div>
                </div>
              </div>

              <!-- Upload de photo -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Photo de l'équipement</label>
                <div class="mt-2 flex items-center">
                  <!-- Aperçu de la photo -->
                  <img
                    v-if="formData.photoPreview"
                    :src="formData.photoPreview"
                    class="h-24 w-24 object-cover rounded-xl border-2 border-slate-200 mr-4 cursor-pointer hover:border-blue-300 transition-colors duration-200"
                    @click="openPhotoModal(formData.photoPreview)"
                  >
                  <!-- Input file caché -->
                  <input
                    type="file"
                    ref="photoInput"
                    @change="handlePhotoUpload"
                    accept="image/*"
                    class="hidden"
                  >
                  <!-- Bouton pour déclencher l'upload -->
                  <button
                    type="button"
                    @click="$refs.photoInput.click()"
                    class="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl border border-slate-300 transition-colors duration-300 flex items-center"
                  >
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formData.photoPreview ? 'Changer la photo' : 'Ajouter une photo' }}
                  </button>
                  <!-- Bouton pour supprimer la photo -->
                  <button
                    v-if="formData.photoPreview"
                    type="button"
                    @click="removePhoto"
                    class="ml-4 text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition-colors duration-200"
                  >
                    <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>

              <!-- Commentaires -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Commentaires</label>
                <textarea
                  v-model="formData.comment"
                  rows="3"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                ></textarea>
              </div>
            </div>

            <!-- Boutons d'action du formulaire -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all shadow-sm"
              >
                {{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
              </button>
              <!-- Bouton pour générer la fiche PDF en mode édition -->
              <button
                v-if="isEditing"
                type="button"
                @click="generateEquipmentSheet(formData)"
                class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Générer la fiche
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- MODAL VISUALISATION -->
    <!-- ==================== -->
    <!-- Je crée un modal détaillé pour visualiser un équipement -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <!-- En-tête avec bandeau dégradé -->
        <div class="bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-8">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <!-- Logo de l'entreprise -->
              <div class="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mr-6">
                <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold">{{ viewedEquipment.company_name }}</h2>
                <p class="text-white/80 text-lg mt-1">{{ viewedEquipment.company_address }}</p>
                <p class="text-white/80">{{ viewedEquipment.company_zipCode }} {{ viewedEquipment.company_city }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-white/80">Fiche Technique</div>
              <div class="text-2xl font-bold">ÉQUIPEMENT #{{ viewedEquipment.id }}</div>
              <div class="text-xs text-white/80 mt-2">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
            </div>
          </div>
        </div>

        <!-- Corps de la fiche technique -->
        <div class="p-8 max-h-[calc(95vh-200px)] overflow-y-auto">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Colonne gauche - Photo et identification -->
            <div class="w-full lg:w-2/5 space-y-6">
              <!-- Photo de l'équipement -->
              <div class="bg-slate-50 rounded-2xl border-2 border-slate-200 p-6 h-80 flex items-center justify-center">
                <img v-if="viewedEquipment.photo"
                     :src="`http://127.0.0.1:8000/storage/${viewedEquipment.photo}`"
                     class="max-h-full max-w-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                     @click="openPhotoModal(`http://127.0.0.1:8000/storage/${viewedEquipment.photo}`)">
                <div v-else class="text-center text-slate-400">
                  <svg class="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-3 text-sm font-medium">Aucune image disponible</p>
                </div>
              </div>

              <!-- Fiche d'identité de l'équipement -->
              <div class="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div class="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4">
                  <h3 class="text-lg font-bold text-white flex items-center">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Identification
                  </h3>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</p>
                      <p class="mt-2 font-bold flex items-center">
                        <!-- Point coloré selon le type -->
                        <span class="inline-block w-3 h-3 rounded-full mr-2"
                              :class="viewedEquipment.type === 'Réseau' ? 'bg-blue-500' : 'bg-emerald-500'"></span>
                        {{ viewedEquipment.type }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">N° de série</p>
                      <p class="mt-2 font-mono font-bold text-slate-800">{{ viewedEquipment.serial_number }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Marque</p>
                      <p class="mt-2 font-bold text-slate-800">{{ viewedEquipment.brand }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fabricant</p>
                      <p class="mt-2 font-bold text-slate-800">{{ viewedEquipment.manufacturer || '-' }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Modèle</p>
                      <p class="mt-2 font-bold text-slate-800">{{ viewedEquipment.model }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prix Diagnostic</p>
                      <p class="mt-2 font-bold" :class="viewedEquipment.diagnostic_price ? 'text-emerald-600' : 'text-slate-400'">
                        {{ viewedEquipment.diagnostic_price ? viewedEquipment.diagnostic_price + ' fcfa' : 'Non renseigné' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne droite - Détails techniques -->
            <div class="w-full lg:w-3/5">
              <!-- Onglets de navigation -->
              <div class="border-b border-slate-200 mb-8">
                <nav class="-mb-px flex space-x-8">
                  <button class="border-b-2 border-blue-500 text-blue-600 px-1 py-4 text-sm font-bold">Spécifications Techniques</button>
                </nav>
              </div>

              <!-- Contenu des onglets -->
              <div class="space-y-8">
                <!-- Section Configuration -->
                <div>
                  <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <div class="bg-blue-500 p-2 rounded-lg mr-3">
                      <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Configuration
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Informations spécifiques réseau -->
                    <div v-if="viewedEquipment.type === 'Réseau'" class="space-y-4">
                      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rôle</p>
                        <p class="mt-1 text-sm font-medium text-slate-800">{{ viewedEquipment.role || 'Non spécifié' }}</p>
                      </div>
                      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Adresse MAC</p>
                        <p class="mt-1 font-mono text-sm font-medium text-slate-800">{{ viewedEquipment.mac_address || 'Non spécifié' }}</p>
                      </div>
                      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Adresse IP</p>
                        <p class="mt-1 font-mono text-sm font-medium text-slate-800">{{ viewedEquipment.ip_address || 'Non spécifié' }}</p>
                      </div>
                    </div>
                    <!-- Informations spécifiques non-réseau -->
                    <div v-if="viewedEquipment.type === 'Non réseau' && viewedEquipment.name" class="space-y-4">
                      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</p>
                        <p class="mt-1 text-sm font-medium text-slate-800">{{ viewedEquipment.name }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section Caractéristiques techniques -->
                <div>
                  <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <div class="bg-emerald-500 p-2 rounded-lg mr-3">
                      <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Caractéristiques Techniques
                  </h3>
                  <div class="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                    <p class="text-sm text-slate-700 whitespace-pre-line leading-relaxed" v-if="viewedEquipment.characteristics">
                      {{ viewedEquipment.characteristics }}
                    </p>
                    <p class="text-sm text-slate-400 italic text-center py-8" v-else>
                      <svg class="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Aucune caractéristique technique renseignée
                    </p>
                  </div>
                </div>

                <!-- Section Commentaires -->
                <div>
                  <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <div class="bg-amber-500 p-2 rounded-lg mr-3">
                      <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    Commentaires
                  </h3>
                  <div class="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                    <p class="text-sm text-slate-700 whitespace-pre-line leading-relaxed" v-if="viewedEquipment.comment">
                      {{ viewedEquipment.comment }}
                    </p>
                    <p class="text-sm text-slate-400 italic text-center py-8" v-else>
                      <svg class="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Aucun commentaire
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pied de page du modal -->
        <div class="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div class="text-sm text-slate-500">
              <p>Document généré le {{ new Date().toLocaleDateString('fr-FR') }} • Système de Gestion Technique v2.0</p>
            </div>
            <div class="flex space-x-3">
              <!-- Bouton pour exporter en PDF -->
              <button
                @click="generateEquipmentSheet(viewedEquipment)"
                class="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:shadow-md transition-all duration-300"
              >
                <svg class="-ml-1 mr-2 h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter PDF
              </button>
              <!-- Bouton pour fermer le modal -->
              <button
                @click="closeViewModal"
                class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- MODAL PHOTO -->
    <!-- ==================== -->
    <!-- Je crée un modal pour afficher les photos en grand format -->
    <div v-if="showPhotoModal" class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="relative max-w-6xl max-h-full">
        <!-- Bouton de fermeture -->
        <button
          @click="closePhotoModal"
          class="absolute -top-16 right-0 text-white hover:text-slate-300 transition-colors duration-200 bg-black/50 hover:bg-black/70 p-3 rounded-2xl"
        >
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Affichage de la photo -->
        <img :src="selectedPhoto" class="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl">
      </div>
    </div>

    <!-- ==================== -->
    <!-- MODAL CONFIRMATION SUPPRESSION -->
    <!-- ==================== -->
    <!-- Je crée un modal de confirmation pour la suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div class="flex items-center mb-6">
          <!-- Icône d'alerte -->
          <div class="bg-red-100 p-3 rounded-2xl mr-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-slate-800">Confirmer la suppression</h2>
            <p class="text-slate-600 mt-1">Action irréversible</p>
          </div>
        </div>

        <!-- Message de confirmation -->
        <div class="mb-8">
          <p class="text-slate-700 leading-relaxed">Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est définitive et toutes les données associées seront perdues.</p>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end space-x-4">
          <button
            @click="closeDeleteModal"
            class="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="deleteEquipment"
            class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Gestion des Équipements" });
// ==================== //
// IMPORTS ET CONFIGURATION //
// ==================== //

// Je importe les fonctions de Vue pour la réactivité
import { ref, computed, onMounted } from 'vue';
// Je importe le store pour gérer les équipements

// Je importe la bibliothèque pour générer des PDF
import { jsPDF } from 'jspdf';
import { useEquipmentStore } from '~/app/stores/Maintenance/EquipmentStore';
import { equipmentFormData } from '~/models/Equipment';
import type { Equipment } from '~/models/Equipment';

// ==================== //
// INITIALISATION DU STORE //
// ==================== //

// Je initialise le store des équipements
const EquipmentStore = useEquipmentStore();
const generateEquipmentSheet = EquipmentStore.generateEquipmentSheet;
const { equipments } = storeToRefs(EquipmentStore);

// États pour contrôler l'affichage des modales
const showModal = ref(false);           // Modal ajout/modification
const showViewModal = ref(false);       // Modal visualisation
const showPhotoModal = ref(false);      // Modal photo
const showDeleteModal = ref(false);     // Modal confirmation suppression
const isEditing = ref(false);           // Mode édition ou ajout

// États pour les filtres
const filterType = ref('');             // Filtre par type d'équipement
const filterBrand = ref('');            // Filtre par marque
const searchQuery = ref('');            // Recherche texte

// Données du formulaire
const formData = ref<Equipment>(equipmentFormData());

// États pour la gestion des données
const viewedEquipment = ref({});        // Équipement en cours de visualisation
const selectedPhoto = ref('');          // Photo sélectionnée pour affichage
const equipmentToDelete = ref(null);    // ID de l'équipement à supprimer
const showNetworkFields = ref(false);   // Afficher les champs réseau

// Référence pour l'input file
const photoInput = ref(null);

// ==================== //
// PROPRIÉTÉS CALCULÉES //
// ==================== //

// Je filtre les équipements selon les critères de recherche
const filteredEquipments = computed(() => {

  // Je applique les filtres
  return equipments.value.filter(equipment => {
    const matchesType = filterType.value ? equipment.type === filterType.value : true;
    const matchesBrand = filterBrand.value ? equipment.brand === filterBrand.value : true;
    const matchesSearch = searchQuery.value ?
      Object.values(equipment).some(value =>
        value && value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
      ) : true;

    return matchesType && matchesBrand && matchesSearch;
  });
});

// Je calcule le nombre total d'équipements
const equipmentsCount = computed(() => {
  return equipments.value?.length || 0;
});

// Je calcule le nombre d'équipements réseau
const networkCount = computed(() => {
  const allEquipments = equipments.value || [];
  return allEquipments.filter(e => e.type === 'Réseau').length;
});

// Je calcule le nombre d'équipements non-réseau
const nonNetworkCount = computed(() => {
  const allEquipments = equipments.value || [];
  return allEquipments.filter(_ => _.type === 'Non réseau').length;
});

// Je récupère la liste unique des marques
const uniqueBrands = computed(() => {
  const allEquipments = equipments.value || [];
  const brands = [...new Set(allEquipments.map(_ => _.brand).filter(Boolean))];
  return brands.sort();
});

// ==================== //
// MÉTHODES PRINCIPALES //
// ==================== //

// Je ouvre le modal pour ajouter un nouvel équipement
const openAddModal = () => {
  resetForm();
  isEditing.value = false;
  showModal.value = true;
};

// Je prépare le modal pour modifier un équipement existant
const editEquipment = (equipment: Equipment) => {
  // Je copie les données de l'équipement dans le formulaire
  formData.value = {
    ...equipment,
    photo: null,
    photoPreview: equipment.photo ? `http://127.0.0.1:8000/storage/${equipment.photo}` : ''
  };
  isEditing.value = true;
  showNetworkFields.value = equipment.type === 'Réseau';
  showModal.value = true;
};

// Je ouvre le modal de visualisation d'un équipement
const viewEquipment = (equipment) => {
  viewedEquipment.value = { ...equipment };
  showViewModal.value = true;
};

// Je confirme la suppression d'un équipement
const confirmDelete = (equipment) => {
  equipmentToDelete.value = equipment.id;
  showDeleteModal.value = true;
};

// Je supprime effectivement l'équipement
const deleteEquipment = async () => {
  try {
    await EquipmentStore.deleteEquipment(equipmentToDelete.value);
    closeDeleteModal();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

// ==================== //
// MÉTHODES DE GESTION DES MODALES //
// ==================== //

// Je ferme le modal d'ajout/modification
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

// Je ferme le modal de visualisation
const closeViewModal = () => {
  showViewModal.value = false;
};

// Je ferme le modal de photo
const closePhotoModal = () => {
  showPhotoModal.value = false;
};

// Je ferme le modal de confirmation de suppression
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  equipmentToDelete.value = null;
};

// ==================== //
// MÉTHODES DU FORMULAIRE //
// ==================== //

// Je réinitialise le formulaire
const resetForm = () => {
  formData.value = {
    id: null,
    type: '',
    brand: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    diagnostic_price: '',
    name: '',
    role: '',
    mac_address: '',
    ip_address: '',
    characteristics: '',
    company_name: '',
    company_address: '',
    company_zipCode: '',
    company_city: '',
    comment: '',
    photo: null,
    photoPreview: ''
  };
  showNetworkFields.value = false;
};

// Je bascule l'affichage des champs réseau/non-réseau
const toggleNetworkFields = () => {
  showNetworkFields.value = formData.value.type === 'Réseau';
};

// Je gère l'upload de photo
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.photo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Je supprime la photo sélectionnée
const removePhoto = () => {
  formData.value.photoPreview = '';
  formData.value.photo = null;
  if (photoInput.value) {
    photoInput.value.value = '';
  }
};

// Je ouvre le modal photo avec l'image sélectionnée
const openPhotoModal = (photoUrl) => {
  selectedPhoto.value = photoUrl;
  showPhotoModal.value = true;
};

// ==================== //
// MÉTHODES DE GESTION DES DONNÉES //
// ==================== //

// Je construis les données FormData pour l'envoi au serveur
const buildFormData = () => {
  const data = new FormData();

  // Champs communs
  data.append("type", formData.value.type);
  data.append("brand", formData.value.brand);
  data.append("manufacturer", formData.value.manufacturer);
  data.append("model", formData.value.model);
  data.append("serial_number", formData.value.serial_number);
  data.append("diagnostic_price", formData.value.diagnostic_price || '');
  data.append("name", formData.value.name);
  data.append("role", formData.value.role);
  data.append("mac_address", formData.value.mac_address);
  data.append("ip_address", formData.value.ip_address);
  data.append("characteristics", formData.value.characteristics);
  data.append("company_name", formData.value.company_name);
  data.append("company_address", formData.value.company_address);
  data.append("company_zipCode", formData.value.company_zipCode);
  data.append("company_city", formData.value.company_city);
  data.append("comment", formData.value.comment);

  // Photo uniquement si c'est un fichier
  if (formData.value.photo instanceof File) {
    data.append("photo", formData.value.photo);
  }

  // Pour la modification, j'ajoute la méthode PUT
  if (isEditing.value) {
    data.append('_method', 'PUT');
  }

  return data;
};

// Je soumets le formulaire (ajout ou modification)
const submitForm = async () => {
  try {
    const data = buildFormData();

    if (isEditing.value) {
      await EquipmentStore.updateEquipment(formData.value.id, data);
    } else {
      await EquipmentStore.addEquipment(data);
    }

    closeModal();
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
  }
};

// ==================== //
// MÉTHODES UTILITAIRES //
// ==================== //

// Je réinitialise tous les filtres
const resetFilters = () => {
  filterType.value = '';
  filterBrand.value = '';
  searchQuery.value = '';
};

// Je exporte les données (fonction à implémenter)
const exportData = () => {
  console.log('Export data functionality');
};

// ==================== //
// GÉNÉRATION DE PDF //
// ==================== //

// Je génère une fiche technique PDF pour un équipement

// ==================== //
// INITIALISATION //
// ==================== //

// Je charge les équipements au montage du composant
onMounted(() => {
  EquipmentStore.fetchEquipments();
});
</script>

<style scoped>
/* ==================== */
/* STYLES PERSONNALISÉS */
/* ==================== */

/* Animation de survol pour les éléments interactifs */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

/* Effet de verre pour les éléments translucides */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
