<template>
  <!-- Je crée la structure principale de l'application avec un fond dégradé bleu-vert -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans">
    
    <!-- Header avec dégradé bleu-vert amélioré -->
    <header class="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 shadow-2xl relative overflow-hidden">
      <!-- Je crée un effet de flou en arrière-plan pour le header -->
      <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center relative z-10">
        <div class="flex items-center space-x-4">
          <!-- Logo animé avec des barres colorées qui rebondissent -->
          <div class="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-lg">
            <div class="flex space-x-1">
              <div class="w-2 h-6 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-6 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-6 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white drop-shadow-lg">Gestion des Techniciens</h1>
            <p class="text-blue-100 text-sm font-light">Gérez votre équipe technique efficacement</p>
          </div>
        </div>
        <!-- Bouton pour ouvrir le modal d'ajout de technicien -->
        <button 
          @click="openAddModal"
          class="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border border-white/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="font-semibold">Ajouter un Technicien</span>
        </button>
      </div>
    </header>

    <!-- Contenu principal de l'application -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Barre de recherche avec style -->
      <div class="mb-8 relative max-w-md mx-auto">
        <div class="relative">
          <!-- Icône de recherche -->
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <!-- Champ de recherche lié à la variable searchQuery -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un technicien..."
            class="block w-full pl-12 pr-4 py-4 border-0 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:bg-white text-gray-700 placeholder-gray-500 transition-all duration-300"
          />
          <!-- Indicateur visuel animé -->
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <!-- Section des statistiques avec 4 cartes -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Carte statistique : Total Techniciens -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 font-semibold">Total Techniciens</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ techniciens.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Carte statistique : Techniciens Disponibles -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 font-semibold">Disponibles</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ availableCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Carte statistique : Expérience Moyenne -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 font-semibold">Expérience Moyenne</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ averageExperience }} ans</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Carte statistique : Nombre de Spécialités -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 font-semibold">Spécialités</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ specialtiesCount }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages d'état de l'application -->
      
      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
          <div class="flex space-x-1">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <span class="text-gray-600 font-medium">Chargement des techniciens...</span>
        </div>
      </div>
      
      <!-- Message d'erreur -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-600 font-semibold text-lg">Une erreur est survenue</p>
          <p class="text-red-500 mt-2">{{ error }}</p>
        </div>
      </div>
      
      <!-- Message quand aucun technicien n'est trouvé -->
      <div v-else-if="filteredTechniciens.length === 0" class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-100">
          <svg class="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-600 font-semibold text-lg">Aucun technicien trouvé</p>
          <p class="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>

      <!-- Tableau des techniciens - affiché seulement si des techniciens existent -->
      <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200/50">
            <thead class="bg-gradient-to-r from-blue-50 to-green-50">
              <tr>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Photo</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Technicien</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Spécialité</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Expérience</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Contact</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Disponibilité</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white/50 divide-y divide-gray-200/30">
              <!-- Je boucle sur chaque technicien filtré pour créer une ligne du tableau -->
              <tr v-for="technicien in filteredTechniciens" :key="technicien.id" 
                  class="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-300 group">
                <!-- Colonne Photo -->
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="h-14 w-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      :src="technicien.photo ? `${API_BASE_URL.replace('/api', '')}/storage/${technicien.photo}` : `https://ui-avatars.com/api/?name=${technicien.full_name.split(' ').join('+')}&background=random`"
                      class="h-full w-full object-cover"
                    >
                  </div>
                </td>
                <!-- Colonne Informations du technicien -->
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {{ technicien.full_name }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ technicien.email }}
                  </div>
                </td>
                <!-- Colonne Spécialité avec badge -->
                <td class="px-8 py-5 whitespace-nowrap">
                  <span class="px-4 py-2 inline-flex text-sm font-bold rounded-full shadow-sm border transition-all duration-300 bg-blue-100 text-blue-700 border-blue-200 group-hover:bg-blue-200">
                    {{ technicien.specialty }}
                  </span>
                </td>
                <!-- Colonne Expérience avec icône étoile -->
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-sm font-bold text-gray-800">{{ technicien.years_of_experience }} ans</span>
                  </div>
                </td>
                <!-- Colonne Contact avec icônes -->
                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                  <div class="flex items-center group-hover:text-blue-600 transition-colors duration-300">
                    <svg class="flex-shrink-0 mr-3 h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    {{ technicien.email || 'Non renseigné' }}
                  </div>
                  <div class="flex items-center mt-3 group-hover:text-green-600 transition-colors duration-300">
                    <svg class="flex-shrink-0 mr-3 h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    {{ technicien.phone || 'Non renseigné' }}
                  </div>
                </td>
                <!-- Colonne Disponibilité avec badge coloré -->
                <td class="px-8 py-5 whitespace-nowrap">
                  <span class="px-4 py-2 inline-flex text-sm font-bold rounded-full shadow-sm border transition-all duration-300" 
                    :class="getAvailabilityClass(technicien.availability)">
                    <span class="w-2 h-2 rounded-full mr-2" :class="getAvailabilityDotClass(technicien.availability)"></span>
                    {{ technicien.availability }}
                  </span>
                </td>
                <!-- Colonne Actions avec boutons -->
                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <!-- Bouton Voir détails -->
                    <button @click="viewTechnicien(technicien)" 
                            class="text-blue-500 hover:text-blue-700 p-3 rounded-xl hover:bg-blue-100 transition-all duration-300 hover:scale-110 tooltip shadow-sm border border-blue-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <!-- Bouton Modifier -->
                    <button @click="editTechnicien(technicien)" 
                            class="text-yellow-500 hover:text-yellow-700 p-3 rounded-xl hover:bg-yellow-100 transition-all duration-300 hover:scale-110 tooltip shadow-sm border border-yellow-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <!-- Bouton Supprimer -->
                    <button @click="deleteTechnicien(technicien)" 
                            class="text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-110 tooltip shadow-sm border border-red-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal pour ajouter ou modifier un technicien -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Fond flou du modal -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-600 opacity-60 backdrop-blur-sm" @click="closeModal"></div>
        </div>

        <!-- Contenu du modal -->
        <div class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-white/20 bg-gradient-to-br from-white to-blue-50/30">
          <div class="px-8 py-6">
            <!-- En-tête du modal -->
            <div class="flex justify-between items-center border-b border-gray-200/50 pb-5">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {{ isEditing ? 'Modifier Technicien' : 'Nouveau Technicien' }}
              </h3>
              <!-- Bouton fermer -->
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100 rounded-xl">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Contenu du formulaire -->
            <div class="mt-8 space-y-6">
              <!-- Section photo de profil -->
              <div class="flex flex-col items-center">
                <div class="relative h-28 w-28 rounded-full border-4 border-white shadow-2xl mb-4 bg-gradient-to-br from-blue-100 to-green-100">
                  <img :src="form.photoPreview || `https://ui-avatars.com/api/?name=${form.full_name.split(' ').join('+')}&size=128`"
                       class="h-full w-full rounded-full object-cover">
                  <!-- Bouton pour uploader une photo -->
                  <label for="photo-upload" class="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full p-2 cursor-pointer hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:scale-110">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <input id="photo-upload" type="file" @change="handlePhotoUpload" accept="image/*" class="hidden">
                  </label>
                </div>
              </div>

              <!-- Grille des champs du formulaire -->
              <div class="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <!-- Champ nom complet -->
                <div class="sm:col-span-2">
                  <label for="full_name" class="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                  <input
                    v-model="form.full_name"
                    type="text"
                    id="full_name"
                    required
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>

                <!-- Champ spécialité -->
                <div>
                  <label for="specialty" class="block text-sm font-semibold text-gray-700 mb-2">Spécialité</label>
                  <input
                    v-model="form.specialty"
                    type="text"
                    id="specialty"
                    required
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>

                <!-- Champ années d'expérience -->
                <div>
                  <label for="years_of_experience" class="block text-sm font-semibold text-gray-700 mb-2">Expérience (ans)</label>
                  <input
                    v-model="form.years_of_experience"
                    type="number"
                    id="years_of_experience"
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>

                <!-- Champ email -->
                <div class="sm:col-span-2">
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    id="email"
                    required
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>

                <!-- Champ téléphone -->
                <div>
                  <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    id="phone"
                    required
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:border-green-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>

                <!-- Sélecteur de disponibilité -->
                <div>
                  <label for="availability" class="block text-sm font-semibold text-gray-700 mb-2">Disponibilité</label>
                  <select
                    v-model="form.availability"
                    id="availability"
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Occupé">Occupé</option>
                    <option value="En congé">En congé</option>
                  </select>
                </div>

                <!-- Champ adresse -->
                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                  <input
                    v-model="form.address"
                    type="text"
                    id="address"
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>
              </div>
            </div>

            <!-- Boutons d'action du modal -->
            <div class="mt-8 flex justify-end space-x-4 border-t border-gray-200/50 pt-6">
              <button
                @click="closeModal"
                type="button"
                class="px-8 py-3 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
              >
                Annuler
              </button>
              <button
                @click="submitForm"
                :disabled="submitting"
                type="button"
                class="px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50"
              >
                {{ submitting ? 'Traitement...' : (isEditing ? 'Mettre à jour' : 'Créer technicien') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour afficher les détails d'un technicien -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Fond flou -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-600 opacity-60 backdrop-blur-sm" @click="showDetailModal = false"></div>
        </div>

        <!-- Contenu du modal de détails -->
        <div class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-white/20 bg-gradient-to-br from-white to-blue-50/30">
          <div class="px-8 py-6">
            <!-- En-tête du modal -->
            <div class="flex justify-between items-center border-b border-gray-200/50 pb-5">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Détails du Technicien
              </h3>
              <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100 rounded-xl">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Contenu des détails du technicien -->
            <div class="mt-6">
              <!-- Photo et informations principales -->
              <div class="flex flex-col items-center mb-8">
                <div class="relative h-36 w-36 rounded-full border-4 border-white shadow-2xl mb-4 bg-gradient-to-br from-blue-100 to-green-100">
                  <img :src="selectedTechnicien.photo || `https://ui-avatars.com/api/?name=${selectedTechnicien.full_name.split(' ').join('+')}&size=256`"
                       class="h-full w-full rounded-full object-cover">
                </div>
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ selectedTechnicien.full_name }}
                </h2>
                <span class="mt-2 px-4 py-2 text-sm font-bold rounded-full shadow-sm border bg-blue-100 text-blue-700 border-blue-200">
                  {{ selectedTechnicien.specialty }}
                </span>
              </div>

              <!-- Grille des informations détaillées -->
              <div class="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <!-- Informations personnelles -->
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Nom complet</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.full_name || 'Non renseigné' }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Spécialité</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.specialty || 'Non renseigné' }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Expérience</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.years_of_experience }} ans</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Disponibilité</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.availability || 'Non renseigné' }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Email</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.email || 'Non renseigné' }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Téléphone</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.phone || 'Non renseigné' }}</p>
                </div>
                <div class="sm:col-span-2 bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Adresse</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedTechnicien.address || 'Non renseignée' }}</p>
                </div>
              </div>
            </div>

            <!-- Bouton de fermeture -->
            <div class="mt-8 flex justify-end border-t border-gray-200/50 pt-6">
              <button
                @click="showDetailModal = false"
                type="button"
                class="px-8 py-3 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// J'importe les fonctions nécessaires de Vue
import { ref, computed, onMounted } from 'vue';

// Je configure l'URL de base de l'API
const API_BASE_URL = 'http://192.168.210.157:8000/api';

// Je définis les données réactives de l'application

// Liste des techniciens
const techniciens = ref([]);
// État de chargement
const loading = ref(true);
// Message d'erreur
const error = ref('');
// État de soumission du formulaire
const submitting = ref(false);

// Terme de recherche
const searchQuery = ref('');

// Je calcule la liste des techniciens filtrés selon la recherche
const filteredTechniciens = computed(() => {
  return techniciens.value.filter(tech => {
    const search = searchQuery.value.toLowerCase();
    return (
      tech.full_name.toLowerCase().includes(search) ||
      tech.specialty.toLowerCase().includes(search) ||
      (tech.email && tech.email.toLowerCase().includes(search)) ||
      (tech.phone && tech.phone.includes(search))
    );
  });
});

// Je calcule les statistiques des techniciens

// Nombre de techniciens disponibles
const availableCount = computed(() => {
  return techniciens.value.filter(tech => tech.availability === 'Disponible').length;
});

// Nombre de techniciens occupés
const occupiedCount = computed(() => {
  return techniciens.value.filter(tech => tech.availability === 'Occupé').length;
});

// Nombre de techniciens en congé
const leaveCount = computed(() => {
  return techniciens.value.filter(tech => tech.availability === 'En congé').length;
});

// Expérience moyenne des techniciens
const averageExperience = computed(() => {
  if (techniciens.value.length === 0) return 0;
  const total = techniciens.value.reduce((sum, tech) => sum + (parseInt(tech.years_of_experience) || 0), 0);
  return Math.round(total / techniciens.value.length);
});

// Nombre de spécialités uniques
const specialtiesCount = computed(() => {
  const specialties = new Set(techniciens.value.map(tech => tech.specialty));
  return specialties.size;
});

// Je gère l'état des modals

// Contrôle l'affichage du modal d'édition/ajout
const showModal = ref(false);
// Contrôle l'affichage du modal de détails
const showDetailModal = ref(false);
// Indique si on est en mode édition
const isEditing = ref(false);
// Technicien sélectionné pour voir les détails
const selectedTechnicien = ref({});
// ID du technicien en cours d'édition
const currentTechnicienId = ref(null);

// Je définis la structure du formulaire
const form = ref({
  photo: null, // Fichier photo
  photoPreview: '', // URL de prévisualisation
  full_name: '', // Nom complet
  specialty: '', // Spécialité
  years_of_experience: '', // Années d'expérience
  email: '', // Email
  phone: '', // Téléphone
  address: '', // Adresse
  availability: 'Disponible', // Disponibilité par défaut
  date_added: new Date().toISOString().split('T')[0] // Date d'ajout
});

// Je crée des fonctions utilitaires pour les classes de disponibilité

// Je retourne la classe CSS selon la disponibilité
const getAvailabilityClass = (availability) => {
  switch (availability) {
    case 'Disponible': return 'bg-green-100 text-green-700 border-green-200 group-hover:bg-green-200';
    case 'Occupé': return 'bg-orange-100 text-orange-700 border-orange-200 group-hover:bg-orange-200';
    case 'En congé': return 'bg-red-100 text-red-700 border-red-200 group-hover:bg-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200 group-hover:bg-gray-200';
  }
};

// Je retourne la classe CSS pour le point indicateur de disponibilité
const getAvailabilityDotClass = (availability) => {
  switch (availability) {
    case 'Disponible': return 'bg-green-500';
    case 'Occupé': return 'bg-orange-500';
    case 'En congé': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Je réinitialise le formulaire à son état initial
const resetForm = () => {
  form.value = {
    photo: null,
    photoPreview: '',
    full_name: '',
    specialty: '',
    years_of_experience: '',
    email: '',
    phone: '',
    address: '',
    availability: 'Disponible',
    date_added: new Date().toISOString().split('T')[0]
  };
  isEditing.value = false;
  currentTechnicienId.value = null;
  error.value = '';
};

// Je charge les techniciens depuis l'API
const fetchTechniciens = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await fetch(`${API_BASE_URL}/displayTechnicians`);
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des techniciens');
    }
    
    const data = await response.json();
    techniciens.value = data;
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue';
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
};

// Je gère l'upload de photo
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.photo = file;
    // Je crée une URL de prévisualisation pour afficher l'image
    form.value.photoPreview = URL.createObjectURL(file);
  }
};

// J'ouvre le modal pour ajouter un nouveau technicien
const openAddModal = () => {
  resetForm();
  showModal.value = true;
};

// Je prépare l'édition d'un technicien existant
const editTechnicien = (technicien) => {
  isEditing.value = true;
  currentTechnicienId.value = technicien.id;
  // Je remplis le formulaire avec les données existantes
  form.value = {
    photo: null,
    photoPreview: technicien.photo ? `${API_BASE_URL.replace('/api', '')}/storage/${technicien.photo}` : '',
    full_name: technicien.full_name,
    specialty: technicien.specialty,
    years_of_experience: technicien.years_of_experience,
    email: technicien.email,
    phone: technicien.phone,
    address: technicien.address,
    availability: technicien.availability,
    date_added: technicien.date_added ? technicien.date_added.split(' ')[0] : new Date().toISOString().split('T')[0]
  };
  showModal.value = true;
};

// J'affiche les détails d'un technicien
const viewTechnicien = (technicien) => {
  selectedTechnicien.value = { 
    ...technicien, 
    photo: technicien.photo ? `${API_BASE_URL.replace('/api', '')}/storage/${technicien.photo}` : `https://ui-avatars.com/api/?name=${technicien.full_name.split(' ').join('+')}&size=256`
  };
  showDetailModal.value = true;
};

// Je supprime un technicien
const deleteTechnicien = async (technicien) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${technicien.full_name} ?`)) {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteTechnician/${technicien.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchTechniciens();
      alert('Technicien supprimé avec succès');
    } catch (err) {
      error.value = err.message || 'Échec de la suppression';
      alert('Erreur lors de la suppression: ' + err.message);
    }
  }
};

// Je ferme le modal
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

// Je soumets le formulaire (ajout ou modification)
const submitForm = async () => {
  submitting.value = true;
  error.value = '';

  const formData = new FormData();
  
  // J'ajoute toutes les données du formulaire
  formData.append('full_name', form.value.full_name);
  formData.append('specialty', form.value.specialty);
  formData.append('years_of_experience', form.value.years_of_experience);
  formData.append('email', form.value.email);
  formData.append('phone', form.value.phone);
  formData.append('address', form.value.address);
  formData.append('availability', form.value.availability);
  formData.append('date_added', form.value.date_added);

  if (form.value.photo) {
    formData.append('photo', form.value.photo);
  }

  let url = `${API_BASE_URL}/addTechnician`;
  let method = "POST";

  if (isEditing.value) {
    url = `${API_BASE_URL}/updateTechnician/${currentTechnicienId.value}`;
    method = "POST";
    formData.append('_method', 'PUT');
  }
  
  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = data.message || 'Une erreur est survenue';
      if (data.errors) {
        errorMessage = Object.values(data.errors).flat().join(', ');
      }
      throw new Error(errorMessage);
    }
    
    showModal.value = false;
    await fetchTechniciens();

    alert(isEditing.value ? "Technicien mis à jour avec succès!" : "Technicien ajouté avec succès!");
    resetForm();
  } catch (err) {
    error.value = err.message;
    console.error('Erreur:', err);
    alert('Erreur: ' + err.message);
  } finally {
    submitting.value = false;
  }
};

// Je charge les techniciens au montage du composant
onMounted(() => {
  fetchTechniciens();
});
</script>

<style scoped>
/* Je style les tooltips pour les boutons d'action */
.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(data-tip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #3b82f6, #10b981);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Animations pour les transitions */
.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.2s ease-in;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>