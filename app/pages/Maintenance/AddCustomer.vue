<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans">
    <!-- Header avec dégradé bleu-vert amélioré -->
    <header class="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 shadow-2xl relative overflow-hidden">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center relative z-10">
        <div class="flex items-center space-x-4">
          <!-- Logo avec les couleurs bleu, blanc, vert -->
          <div class="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-lg">
            <div class="flex space-x-1">
              <div class="w-2 h-6 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-6 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-6 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white drop-shadow-lg">Gestion des Clients</h1>
            <p class="text-blue-100 text-sm font-light">Gérez vos clients efficacement</p>
          </div>
        </div>
        <button 
          @click="openModal"
          class="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border border-white/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="font-semibold">Ajouter un Client</span>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Barre de recherche avec style amélioré -->
      <div class="mb-8 relative max-w-md mx-auto">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un client..."
            class="block w-full pl-12 pr-4 py-4 border-0 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:bg-white text-gray-700 placeholder-gray-500 transition-all duration-300"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 font-semibold">Total Clients</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ clients.length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 font-semibold">Entreprises</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ entrepriseCount }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 font-semibold">Particuliers</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ particulierCount }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages d'état -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
          <div class="flex space-x-1">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <span class="text-gray-600 font-medium">Chargement des clients...</span>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-600 font-semibold text-lg">Une erreur est survenue</p>
          <p class="text-red-500 mt-2">{{ error }}</p>
        </div>
      </div>
      
      <div v-else-if="filteredClients.length === 0" class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-100">
          <svg class="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-600 font-semibold text-lg">Aucun client trouvé</p>
          <p class="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>

      <!-- Tableau des clients -->
      <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200/50">
            <thead class="bg-gradient-to-r from-blue-50 to-green-50">
              <tr>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Photo</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Nom/Entreprise</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Type</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Contact</th>
                <th class="px-8 py-5 text-left text-sm font-bold text-blue-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white/50 divide-y divide-gray-200/30">
              <tr v-for="client in filteredClients" :key="client.id" 
                  class="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-300 group">
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="h-14 w-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img  
                      :src="getClientPhoto(client)" 
                      class="h-full w-full object-cover"
                    >
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {{ client.type === 'Entreprise' ? client.company_name : client.first_name + ' ' + client.last_name }}
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <span class="px-4 py-2 inline-flex text-sm font-bold rounded-full shadow-sm border transition-all duration-300" 
                    :class="client.type === 'Entreprise' 
                      ? 'bg-green-100 text-green-700 border-green-200 group-hover:bg-green-200' 
                      : 'bg-blue-100 text-blue-700 border-blue-200 group-hover:bg-blue-200'">
                    {{ client.type === 'Entreprise' ? '🏢 Entreprise' : '👤 Particulier' }}
                  </span>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                  <div class="flex items-center group-hover:text-blue-600 transition-colors duration-300">
                    <svg class="flex-shrink-0 mr-3 h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    {{ client.email || 'Non renseigné' }}
                  </div>
                  <div class="flex items-center mt-3 group-hover:text-green-600 transition-colors duration-300">
                    <svg class="flex-shrink-0 mr-3 h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    {{ client.telephone_number || 'Non renseigné' }}
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button @click="viewClient(client)" 
                            class="text-blue-500 hover:text-blue-700 p-3 rounded-xl hover:bg-blue-100 transition-all duration-300 hover:scale-110 tooltip shadow-sm border border-blue-100"
                            data-tip="Voir détails">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button @click="editClient(client)" 
                            class="text-yellow-500 hover:text-yellow-700 p-3 rounded-xl hover:bg-yellow-100 transition-all duration-300 hover:scale-110 tooltip shadow-sm border border-yellow-100"
                            data-tip="Modifier">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button @click="confirmDeleteClient(client)" 
                            class="text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-110 tooltip shadow-sm border border-red-100"
                            data-tip="Supprimer">
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

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Fond flou -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-600 opacity-60 backdrop-blur-sm" @click="closeModal"></div>
        </div>

        <!-- Contenu du modal -->
        <div class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-white/20 bg-gradient-to-br from-white to-blue-50/30">
          <div class="px-8 py-6">
            <div class="flex justify-between items-center border-b border-gray-200/50 pb-5">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {{ isEditing ? 'Modifier Client' : 'Nouveau Client' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100 rounded-xl">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Sélection du type de client -->
            <div class="mt-6">
              <label class="block text-sm font-semibold text-gray-700 mb-4">Type de Client</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  @click="currentClient.type = 'Particulier'"
                  :class="currentClient.type === 'Particulier' 
                    ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 text-blue-700 shadow-lg scale-105' 
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'"
                  class="border rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md group"
                >
                  <svg class="mx-auto h-10 w-10 mb-3 text-blue-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="font-bold text-lg">Client Physique</span>
                </button>
                <button
                  @click="currentClient.type = 'Entreprise'"
                  :class="currentClient.type === 'Entreprise' 
                    ? 'bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 text-green-700 shadow-lg scale-105' 
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:border-green-200 hover:bg-green-50/50'"
                  class="border rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md group"
                >
                  <svg class="mx-auto h-10 w-10 mb-3 text-green-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span class="font-bold text-lg">Client Moral</span>
                </button>
              </div>
            </div>

            <!-- Formulaire dynamique -->
            <div class="mt-8 space-y-6">
              <!-- Photo de profil -->
              <div class="flex flex-col items-center">
                <div class="relative h-28 w-28 rounded-full border-4 border-white shadow-2xl mb-4 bg-gradient-to-br from-blue-100 to-green-100">
                  <img :src="currentClient.photoPreview || getDefaultAvatar()" 
                        class="h-full w-full rounded-full object-cover">
                  <label for="photo-upload" class="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full p-2 cursor-pointer hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:scale-110">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <input id="photo-upload" type="file" @change="handleFileUpload" accept="image/*" class="hidden">
                  </label>
                </div>
              </div>

              <!-- Champs spécifiques au type -->
              <div class="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                <template v-if="currentClient.type === 'Particulier'">
                  <div>
                    <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                    <input
                      v-model="currentClient.first_name"
                      type="text"
                      id="firstName"
                      class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                    >
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                    <input
                      v-model="currentClient.last_name"
                      type="text"
                      id="lastName"
                      class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                    >
                  </div>
                  <div>
                    <label for="cin" class="block text-sm font-semibold text-gray-700 mb-2">CIN</label>
                    <input
                      v-model="currentClient.national_identity_card"
                      type="text"
                      id="cin"
                      class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                    >
                  </div>
                </template>

                <template v-else>
                  <div class="sm:col-span-2">
                    <label for="companyName" class="block text-sm font-semibold text-gray-700 mb-2">Nom de l'Entreprise</label>
                    <input
                      v-model="currentClient.company_name"
                      type="text"
                      id="companyName"
                      class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:border-green-400 shadow-sm transition-all duration-300 focus:shadow-md"
                    >
                  </div>
                  <div>
                    <label for="rc" class="block text-sm font-semibold text-gray-700 mb-2">Registre du Commerce</label>
                    <input
                      v-model="currentClient.trade_register"
                      type="text"
                      id="rc"
                      class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:border-green-400 shadow-sm transition-all duration-300 focus:shadow-md"
                    >
                  </div>
                </template>

                <!-- Champs communs -->
                <div class="sm:col-span-2">
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    v-model="currentClient.email"
                    type="email"
                    id="email"
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>
                <div>
                  <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                  <input
                    v-model="currentClient.telephone_number"
                    type="tel"
                    id="phone"
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:border-green-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>
                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                  <input
                    v-model="currentClient.address"
                    type="text"
                    id="address"
                    class="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition-all duration-300 focus:shadow-md"
                  >
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-4 border-t border-gray-200/50 pt-6">
              <button
                @click="closeModal"
                type="button"
                class="px-8 py-3 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
              >
                Annuler
              </button>
              <button
                @click="saveClient"
                type="button"
                class="px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                {{ isEditing ? 'Mettre à jour' : 'Créer client' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Fond flou -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-600 opacity-60 backdrop-blur-sm" @click="showDetailModal = false"></div>
        </div>

        <!-- Contenu du modal -->
        <div class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-white/20 bg-gradient-to-br from-white to-blue-50/30">
          <div class="px-8 py-6">
            <div class="flex justify-between items-center border-b border-gray-200/50 pb-5">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Détails du Client
              </h3>
              <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-2 hover:bg-gray-100 rounded-xl">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-6">
              <div class="flex flex-col items-center mb-8">
                <div class="relative h-36 w-36 rounded-full border-4 border-white shadow-2xl mb-4 bg-gradient-to-br from-blue-100 to-green-100">
                  <img :src="getClientPhoto(selectedClient)" 
                        class="h-full w-full rounded-full object-cover">
                </div>
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ selectedClient.type === 'Entreprise' ? selectedClient.company_name : selectedClient.first_name + ' ' + selectedClient.last_name }}
                </h2>
                <span class="mt-2 px-4 py-2 text-sm font-bold rounded-full shadow-sm border" 
                        :class="selectedClient.type === 'Entreprise' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-blue-100 text-blue-700 border-blue-200'">
                  {{ selectedClient.type === 'Entreprise' ? '🏢 Client Entreprise' : '👤 Client Particulier' }}
                </span>
              </div>

              <div class="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <template v-if="selectedClient.type === 'Particulier'">
                  <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm font-semibold text-gray-500">Prénom</p>
                    <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.first_name || 'Non renseigné' }}</p>
                  </div>
                  <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm font-semibold text-gray-500">Nom</p>
                    <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.last_name || 'Non renseigné' }}</p>
                  </div>
                  <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm font-semibold text-gray-500">CIN</p>
                    <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.national_identity_card || 'Non renseigné' }}</p>
                  </div>
                </template>

                <template v-else>
                  <div class="sm:col-span-2 bg-white/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm font-semibold text-gray-500">Nom Entreprise</p>
                    <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.company_name || 'Non renseigné' }}</p>
                  </div>
                  <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm font-semibold text-gray-500">Registre du Commerce</p>
                    <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.trade_register || 'Non renseigné' }}</p>
                  </div>
                </template>

                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Email</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.email || 'Non renseigné' }}</p>
                </div>
                <div class="bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Téléphone</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.telephone_number || 'Non renseigné' }}</p>
                </div>
                <div class="sm:col-span-2 bg-white/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-sm font-semibold text-gray-500">Adresse</p>
                  <p class="mt-1 text-lg font-bold text-gray-900">{{ selectedClient.address || 'Non renseigné' }}</p>
                </div>
              </div>
            </div>

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

<script>
export default {
  data() {
    return {
      API_BASE_URL: 'http://localhost:8000/api',
      clients: [],
      loading: true,
      error: null,
      showModal: false,
      showDetailModal: false,
      isEditing: false,
      searchQuery: '',
      selectedClient: {},
      currentClient: {
        id: null,
        type: 'Particulier',
        first_name: '',
        last_name: '',
        national_identity_card: '',
        company_name: '',
        trade_register: '',
        email: '',
        telephone_number: '',
        address: '',
        photo: null,
        photoPreview: null
      }
    }
  },
  computed: {
    filteredClients() {
      if (!this.searchQuery) return this.clients;
      
      return this.clients.filter(client => {
        const search = this.searchQuery.toLowerCase();
        if (client.type === 'Particulier') {
          return (
            (client.first_name && client.first_name.toLowerCase().includes(search)) ||
            (client.last_name && client.last_name.toLowerCase().includes(search)) ||
            (client.email && client.email.toLowerCase().includes(search)) ||
            (client.telephone_number && client.telephone_number.includes(search))
          )
        } else {
          return (
            (client.company_name && client.company_name.toLowerCase().includes(search)) ||
            (client.email && client.email.toLowerCase().includes(search)) ||
            (client.telephone_number && client.telephone_number.includes(search))
          )
        }
      })
    },
    entrepriseCount() {
      return this.clients.filter(client => client.type === 'Entreprise').length;
    },
    particulierCount() {
      return this.clients.filter(client => client.type === 'Particulier').length;
    }
  },
  methods: {
    getClientPhoto(client) {
      if (client.photo) {
        return `http://127.0.0.1:8000/storage/${client.photo}`;
      }
      const name = client.type === 'Entreprise' 
        ? client.company_name 
        : `${client.first_name}+${client.last_name}`;
      return `https://ui-avatars.com/api/?name=${name}&background=random`;
    },
    
    getDefaultAvatar() {
      const name = this.currentClient.type === 'Entreprise' 
        ? this.currentClient.company_name 
        : `${this.currentClient.first_name}+${this.currentClient.last_name}`;
      return `https://ui-avatars.com/api/?name=${name}&background=random`;
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.currentClient.photo = file;
        this.currentClient.photoPreview = URL.createObjectURL(file);
      }
    },
    
    openModal() {
      this.resetCurrentClient();
      this.isEditing = false;
      this.showModal = true;
    },
    
    editClient(client) {
      this.resetCurrentClient();
      
      // Copier les données du client
      Object.keys(client).forEach(key => {
        if (this.currentClient.hasOwnProperty(key)) {
          this.currentClient[key] = client[key];
        }
      });
      
      this.currentClient.type = client.type || 'Particulier';
      
      if (client.photo) {
        this.currentClient.photoPreview = `http://127.0.0.1:8000/storage/${client.photo}`;
      }
      
      this.isEditing = true;
      this.showModal = true;
    },
    
    viewClient(client) {
      this.selectedClient = {...client};
      this.showDetailModal = true;
    },
    
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${this.API_BASE_URL}/displayClients`);
        if (!response.ok) throw new Error('Erreur API');
        const data = await response.json();
        
        // CORRECTION : Adapter à la structure de réponse du contrôleur
        if (data.success && data.data) {
          this.clients = data.data;
        } else {
          this.clients = data.data || data;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        this.error = 'Impossible de charger les clients.';
      } finally {
        this.loading = false;
      }
    },
    
    async saveClient() {
      try {
        this.error = null;
        const formData = new FormData();
    
        // CORRECTION : N'utiliser _method que pour les mises à jour
        if (this.isEditing) {
          formData.append('_method', 'PUT');
        }
    
        formData.append('type', this.currentClient.type);
    
        // CORRECTION CRITIQUE : Ne pas envoyer les champs opposés du tout
        if (this.currentClient.type === 'Particulier') {
          // Seulement envoyer les champs de particulier
          if (this.currentClient.first_name !== '') formData.append('first_name', this.currentClient.first_name);
          if (this.currentClient.last_name !== '') formData.append('last_name', this.currentClient.last_name);
          if (this.currentClient.national_identity_card !== '') formData.append('national_identity_card', this.currentClient.national_identity_card);
          // Ne PAS envoyer les champs d'entreprise
        } else {
          // Seulement envoyer les champs d'entreprise
          if (this.currentClient.company_name !== '') formData.append('company_name', this.currentClient.company_name);
          if (this.currentClient.trade_register !== '') formData.append('trade_register', this.currentClient.trade_register);
          // Ne PAS envoyer les champs de particulier
        }
    
        // CORRECTION : Envoyer seulement les champs communs qui ont une valeur
        if (this.currentClient.email !== '') formData.append('email', this.currentClient.email);
        if (this.currentClient.telephone_number !== '') formData.append('telephone_number', this.currentClient.telephone_number);
        if (this.currentClient.address !== '') formData.append('address', this.currentClient.address);
    
        // Ajouter la photo seulement si c'est un nouveau fichier
        if (this.currentClient.photo instanceof File) {
          formData.append('photo', this.currentClient.photo);
        }
    
        let url = this.isEditing 
          ? `${this.API_BASE_URL}/updateClient/${this.currentClient.id}` 
          : `${this.API_BASE_URL}/addClient`;
        
        const method = 'POST';

        console.log('Envoi des données:', {
          type: this.currentClient.type,
          isEditing: this.isEditing,
          formData: Object.fromEntries(formData)
        });

        const response = await fetch(url, {
          method: method,
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        const data = await response.json();
        
        // CORRECTION : Adapter à la structure de réponse du contrôleur
        if (response.ok && data.success) {
          await this.fetchClients();
          this.showModal = false;
          Swal.fire({
            title: 'Succès',
            text: data.message || (this.isEditing ? 'Client modifié avec succès' : 'Client ajouté avec succès'),
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          this.error = data.message || 'Erreur inconnue';
          Swal.fire('Erreur', data.message || 'Une erreur est survenue', 'error');
        }
      } catch (e) {
        this.error = e.message;
        Swal.fire('Erreur', 'Une erreur est survenue lors de la sauvegarde', 'error');
      }
    },
    
    confirmDeleteClient(client) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        html: `Voulez-vous vraiment supprimer <strong>${client.type === 'Entreprise' ? client.company_name : client.first_name + ' ' + client.last_name}</strong> ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Annuler",
        backdrop: true,
        allowOutsideClick: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteClient(client.id);
        }
      });
    },
    
    async deleteClient(id) {
      try {
        console.log("Tentative de suppression du client ID:", id);
        
        const response = await fetch(`${this.API_BASE_URL}/deleteClient/${id}`, {
          method: "DELETE",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        const responseData = await response.json();
        console.log("Réponse de suppression:", responseData);

        // CORRECTION : Vérifier plusieurs formats de réponse possibles
        if (response.ok && (responseData.success === true || responseData.message)) {
          // Supprimer le client de la liste locale
          this.clients = this.clients.filter(client => client.id !== id);
          
          Swal.fire({
            title: "Supprimé !",
            text: responseData.message || "Le client a été supprimé avec succès.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          // Afficher le message d'erreur de l'API
          const errorMessage = responseData.message || responseData.error || 'Erreur lors de la suppression';
          console.error("Erreur de suppression:", errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        
        Swal.fire({
          title: "Erreur",
          html: error.message || "Impossible de supprimer le client.",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
      }
    },
    
    closeModal() {
      this.showModal = false;
      this.resetCurrentClient();
    },
    
    resetCurrentClient() {
      this.currentClient = {
        id: null,
        type: 'Particulier',
        first_name: '',
        last_name: '',
        national_identity_card: '',
        company_name: '',
        trade_register: '',
        email: '',
        telephone_number: '',
        address: '',
        photo: null,
        photoPreview: null
      };
    }
  },
  mounted() {
    this.fetchClients();
  }
}
</script>

<style scoped>
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

/* Animation pour les éléments qui apparaissent */
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