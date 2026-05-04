<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <!-- Navigation Premium -->
    <nav class="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 shadow-2xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-green-400">
                <i class="fas fa-users text-white text-sm"></i>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Gestion Clients</h1>
              <p class="text-blue-100 text-sm font-light">Solution Professionnelle</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-blue-100 text-sm font-medium">{{ clients.length }} clients</span>
            </div>
            <button 
              @click="showAddClientModal = true" 
              class="flex items-center space-x-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30 hover:shadow-xl hover:scale-105 transform group"
            >
              <i class="fas fa-plus-circle text-lg"></i>
              <span>Nouveau Client</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Bannière Statistiques -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-blue-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Carte Total Clients -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Clients</p>
                <p class="text-3xl font-bold mt-2">{{ clients.length }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-users text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Carte Entreprises -->
          <div class="bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-50 text-sm font-medium">Entreprises</p>
                <p class="text-3xl font-bold mt-2">{{ clients.filter(c => c.type === 'Entreprise').length }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-building text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Carte Particuliers -->
          <div class="bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-50 text-sm font-medium">Particuliers</p>
                <p class="text-3xl font-bold mt-2">{{ clients.filter(c => c.type === 'Particulier').length }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-user text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Tableau des Clients -->
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-blue-100">
          <!-- En-tête du Tableau -->
          <div class="px-8 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-green-50">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div class="flex items-center space-x-4">
                <div class="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-2xl shadow-lg">
                  <i class="fas fa-list text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800">Liste des Clients</h2>
                  <p class="text-gray-600">Gérez l'ensemble de votre portefeuille clients</p>
                </div>
              </div>
              <div class="relative w-full lg:w-96">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Rechercher un client..." 
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm"
                >
              </div>
            </div>
          </div>

          <!-- Corps du Tableau -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Entreprise</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="client in filteredClients" 
                  :key="client.id" 
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group cursor-pointer"
                  @click="selectClient(client)"
                >
                  <td class="px-8 py-6 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span class="text-white font-bold text-lg">{{ getInitials(client) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{ getClientName(client) }}</div>
                        <div class="text-sm text-gray-500 flex items-center mt-2">
                          <i class="fas fa-phone-alt text-blue-500 mr-2 text-xs"></i>
                          {{ client.telephone_number || 'Non renseigné' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap">
                    <div class="text-gray-700 font-medium">{{ client.company_name || client.entreprise || 'Indépendant' }}</div>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap">
                    <div class="text-gray-700 flex items-center">
                      <i class="fas fa-envelope text-blue-500 mr-3"></i>
                      {{ client.email || 'Non renseigné' }}
                    </div>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap">
                    <span class="px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full shadow-sm transition-all duration-300 capitalize" 
                          :class="{
                            'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200': client.type === 'Entreprise',
                            'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200': client.type === 'Particulier'
                          }">
                      <i class="fas fa-user-tag mr-2"></i>
                      {{ client.type || 'Non défini' }}
                    </span>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      @click.stop="selectClient(client)" 
                      class="text-blue-600 hover:text-blue-800 p-3 rounded-2xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 shadow-sm"
                      title="Ouvrir le dossier"
                    >
                      <i class="fas fa-folder-open text-lg"></i>
                    </button>
                    <button 
                      @click.stop="confirmDeleteClient(client)" 
                      class="text-red-600 hover:text-red-800 p-3 rounded-2xl hover:bg-red-100 transition-all duration-300 transform hover:scale-110 shadow-sm"
                      title="Supprimer"
                    >
                      <i class="fas fa-trash-alt text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- État Vide -->
          <div v-if="filteredClients.length === 0" class="text-center py-16">
            <div class="max-w-md mx-auto">
              <div class="bg-gradient-to-r from-blue-100 to-green-100 w-32 h-32 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg">
                <i class="fas fa-users text-blue-500 text-4xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucun client trouvé</h3>
              <p class="text-gray-500 mb-6 text-lg">Commencez par ajouter votre premier client à votre portefeuille.</p>
              <button 
                @click="showAddClientModal = true" 
                class="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <i class="fas fa-plus-circle mr-3"></i>
                Ajouter un client
              </button>
            </div>
          </div>
        </div>

        <!-- Vue Détail Client -->
        <div 
          v-if="selectedClient" 
          class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-blue-100"
        >
          <!-- En-tête du Dossier Client -->
          <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 p-8 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center space-y-6 xl:space-y-0 relative z-10">
              <div class="flex items-center space-x-6">
                <div class="flex-shrink-0 h-20 w-20 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-2xl">{{ getInitials(selectedClient) }}</span>
                </div>
                <div>
                  <h2 class="text-3xl font-bold text-white flex items-center">
                    <i class="fas fa-folder-open mr-4"></i>
                    Dossier Client: {{ getClientName(selectedClient) }}
                  </h2>
                  <div class="flex flex-wrap items-center mt-4 space-x-4 text-blue-100 text-sm">
                    <span class="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <i class="fas fa-envelope mr-3"></i>
                      {{ selectedClient.email || 'Non renseigné' }}
                    </span>
                    <span class="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <i class="fas fa-phone-alt mr-3"></i>
                      {{ selectedClient.telephone_number || 'Non renseigné' }}
                    </span>
                    <span class="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <i class="fas fa-building mr-3"></i>
                      {{ selectedClient.company_name || selectedClient.entreprise || 'Indépendant' }}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                @click="selectedClient = null" 
                class="flex items-center text-blue-100 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm font-semibold"
              >
                <i class="fas fa-times mr-3"></i>
                Fermer le dossier
              </button>
            </div>
          </div>

          <!-- Navigation des Sections -->
          <div class="border-b border-gray-200 bg-white">
            <nav class="flex space-x-8 px-8">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="switchTab(tab.id)"
                class="py-5 px-2 border-b-2 font-semibold text-sm transition-all duration-300 relative group"
                :class="activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                {{ tab.name }}
                <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></span>
              </button>
            </nav>
          </div>

          <!-- Contenu des Sections -->
          <div class="p-8">
            <!-- Section Factures -->
            <div v-if="activeTab === 'factures'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <div class="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl mr-4">
                    <i class="fas fa-file-invoice text-white text-xl"></i>
                  </div>
                  Factures
                </h3>
                <button 
                  @click="showAddDocumentModal('facture')" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus-circle mr-3"></i>
                  Nouvelle Facture
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div 
                  v-for="(doc, index) in selectedClient.factures" 
                  :key="doc.id" 
                  class="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <div class="flex justify-between items-start mb-4">
                    <span class="font-bold text-gray-800 text-lg">Facture #{{ doc.numero }}</span>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm" 
                          :class="{
                            'bg-green-100 text-green-800': doc.statut === 'Payée',
                            'bg-yellow-100 text-yellow-800': doc.statut === 'En attente',
                            'bg-red-100 text-red-800': doc.statut === 'Annulée'
                          }">
                      {{ doc.statut }}
                    </span>
                  </div>
                  <p class="text-gray-600 mb-3"><i class="far fa-calendar mr-2"></i>{{ formatDate(doc.date) }}</p>
                  <p class="text-xl font-bold text-gray-800 mb-4">{{ formatCurrency(doc.montant) }}</p>
                  <div class="flex justify-between items-center">
                    <div class="flex space-x-3">
                      <button 
                        @click="viewDocument(doc)" 
                        class="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-semibold"
                        title="Visualiser"
                      >
                        <i class="fas fa-eye mr-1"></i> PDF
                      </button>
                      <button 
                        @click="editDocument('facture', index)" 
                        class="text-green-500 hover:text-green-700 transition-colors duration-300 font-semibold"
                        title="Modifier"
                      >
                        <i class="fas fa-edit mr-1"></i> Modifier
                      </button>
                    </div>
                    <button 
                      @click="confirmDeleteDocument('facture', index)" 
                      class="text-red-500 hover:text-red-700 transition-colors duration-300 font-semibold"
                      title="Supprimer"
                    >
                      <i class="fas fa-trash mr-1"></i> Supprimer
                    </button>
                  </div>
                </div>
                <div v-if="selectedClient.factures.length === 0" class="col-span-full text-center py-12">
                  <div class="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-4">
                    <i class="fas fa-file-invoice text-gray-400 text-3xl"></i>
                  </div>
                  <p class="text-gray-500 text-lg">Aucune facture</p>
                </div>
              </div>
            </div>

            <!-- Section Proformas -->
            <div v-if="activeTab === 'proformas'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl mr-4">
                    <i class="fas fa-file-alt text-white text-xl"></i>
                  </div>
                  Factures Proforma
                </h3>
                <button 
                  @click="showAddDocumentModal('proforma')" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus-circle mr-3"></i>
                  Nouveau Proforma
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div 
                  v-for="(doc, index) in selectedClient.proformas" 
                  :key="doc.id" 
                  class="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div class="flex justify-between items-start mb-4">
                    <span class="font-bold text-gray-800 text-lg">Proforma #{{ doc.numero }}</span>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm" 
                          :class="{
                            'bg-green-100 text-green-800': doc.statut === 'Convertie',
                            'bg-yellow-100 text-yellow-800': doc.statut === 'En attente',
                            'bg-red-100 text-red-800': doc.statut === 'Annulée'
                          }">
                      {{ doc.statut }}
                    </span>
                  </div>
                  <p class="text-gray-600 mb-3"><i class="far fa-calendar mr-2"></i>{{ formatDate(doc.date) }}</p>
                  <p class="text-xl font-bold text-gray-800 mb-4">{{ formatCurrency(doc.montant) }}</p>
                  <div class="flex justify-between items-center">
                    <div class="flex space-x-3">
                      <button 
                        @click="viewDocument(doc)" 
                        class="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-semibold"
                        title="Visualiser"
                      >
                        <i class="fas fa-eye mr-1"></i> PDF
                      </button>
                      <button 
                        @click="editDocument('proforma', index)" 
                        class="text-green-500 hover:text-green-700 transition-colors duration-300 font-semibold"
                        title="Modifier"
                      >
                        <i class="fas fa-edit mr-1"></i> Modifier
                      </button>
                    </div>
                    <button 
                      @click="confirmDeleteDocument('proforma', index)" 
                      class="text-red-500 hover:text-red-700 transition-colors duration-300 font-semibold"
                      title="Supprimer"
                    >
                      <i class="fas fa-trash mr-1"></i> Supprimer
                    </button>
                  </div>
                </div>
                <div v-if="selectedClient.proformas.length === 0" class="col-span-full text-center py-12">
                  <div class="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-4">
                    <i class="fas fa-file-alt text-gray-400 text-3xl"></i>
                  </div>
                  <p class="text-gray-500 text-lg">Aucun proforma</p>
                </div>
              </div>
            </div>

            <!-- Section Bordereaux -->
            <div v-if="activeTab === 'bordereaux'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-2xl mr-4">
                    <i class="fas fa-clipboard-list text-white text-xl"></i>
                  </div>
                  Bordereaux de Livraison
                </h3>
                <button 
                  @click="showAddDocumentModal('bordereau')" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus-circle mr-3"></i>
                  Nouveau Bordereau
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div 
                  v-for="(doc, index) in selectedClient.bordereaux" 
                  :key="doc.id" 
                  class="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div class="flex justify-between items-start mb-4">
                    <span class="font-bold text-gray-800 text-lg">Bordereau #{{ doc.numero }}</span>
                    <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 shadow-sm">
                      {{ doc.produits ? doc.produits.length : 0 }} produit(s)
                    </span>
                  </div>
                  <p class="text-gray-600 mb-4"><i class="far fa-calendar mr-2"></i>{{ formatDate(doc.date) }}</p>
                  <div class="flex justify-between items-center">
                    <div class="flex space-x-3">
                      <button 
                        @click="viewDocument(doc)" 
                        class="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-semibold"
                        title="Visualiser"
                      >
                        <i class="fas fa-eye mr-1"></i> PDF
                      </button>
                      <button 
                        @click="editDocument('bordereau', index)" 
                        class="text-green-500 hover:text-green-700 transition-colors duration-300 font-semibold"
                        title="Modifier"
                      >
                        <i class="fas fa-edit mr-1"></i> Modifier
                      </button>
                    </div>
                    <button 
                      @click="confirmDeleteDocument('bordereau', index)" 
                      class="text-red-500 hover:text-red-700 transition-colors duration-300 font-semibold"
                      title="Supprimer"
                    >
                      <i class="fas fa-trash mr-1"></i> Supprimer
                    </button>
                  </div>
                </div>
                <div v-if="selectedClient.bordereaux.length === 0" class="col-span-full text-center py-12">
                  <div class="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-4">
                    <i class="fas fa-clipboard-list text-gray-400 text-3xl"></i>
                  </div>
                  <p class="text-gray-500 text-lg">Aucun bordereau</p>
                </div>
              </div>
            </div>

            <!-- Section Parc Informatique -->
            <div v-if="activeTab === 'parc'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-2xl mr-4">
                    <i class="fas fa-laptop text-white text-xl"></i>
                  </div>
                  Parc Informatique
                </h3>
                <button 
                  @click="showAddMachineModal" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus-circle mr-3"></i>
                  Ajouter un équipement
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div 
                  v-for="machine in selectedClient.parcInformatique" 
                  :key="machine.id" 
                  class="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h4 class="font-bold text-gray-800 text-lg">{{ machine.type }} - {{ machine.brand }}</h4>
                      <div class="mt-3 space-y-2">
                        <p class="text-gray-600"><i class="fas fa-tag mr-2"></i>Modèle: {{ machine.model }}</p>
                        <p class="text-gray-600"><i class="fas fa-barcode mr-2"></i>N° série: {{ machine.serial_number }}</p>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="viewMachineFile(machine)" 
                        class="text-blue-500 hover:text-blue-700 p-2 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                        title="Fiche technique"
                      >
                        <i class="fas fa-file-pdf text-lg"></i>
                      </button>
                      <button 
                        @click="editMachine(machine)" 
                        class="text-green-500 hover:text-green-700 p-2 rounded-xl hover:bg-green-50 transition-colors duration-300"
                        title="Modifier"
                      >
                        <i class="fas fa-edit text-lg"></i>
                      </button>
                      <button 
                        @click="confirmDeleteMachine(machine.id)" 
                        class="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors duration-300"
                        title="Supprimer"
                      >
                        <i class="fas fa-trash text-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-sm text-gray-600 mb-2 font-semibold">
                      <i class="fas fa-upload mr-2"></i>Ajouter un fichier PDF
                    </label>
                    <input 
                      type="file" 
                      @change="handleMachineFileUpload($event, machine)" 
                      accept=".pdf"
                      class="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                    >
                  </div>
                </div>
                <div v-if="selectedClient.parcInformatique.length === 0" class="col-span-full text-center py-12">
                  <div class="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-4">
                    <i class="fas fa-laptop text-gray-400 text-3xl"></i>
                  </div>
                  <p class="text-gray-500 text-lg">Aucun équipement dans le parc informatique</p>
                </div>
              </div>
            </div>

            <!-- Section Interventions -->
            <div v-if="activeTab === 'interventions'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <div class="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl mr-4">
                    <i class="fas fa-tools text-white text-xl"></i>
                  </div>
                  Interventions
                </h3>
                <button 
                  @click="showAddDocumentModal('intervention')" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus-circle mr-3"></i>
                  Nouvelle Intervention
                </button>
              </div>
              
              <div class="space-y-6">
                <div 
                  v-for="(intervention, index) in selectedClient.interventions" 
                  :key="intervention.id" 
                  class="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <div class="flex items-center mb-3">
                        <h4 class="font-bold text-gray-800 text-lg">{{ formatDate(intervention.date) }} - {{ intervention.type }}</h4>
                        <span class="ml-3 px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full shadow-sm">
                          {{ intervention.duree }}
                        </span>
                      </div>
                      <p class="text-gray-600 mb-4">{{ intervention.description }}</p>
                      <div class="flex items-center text-gray-500">
                        <i class="fas fa-user-cog mr-2"></i>
                        <span class="font-semibold">Technicien: {{ intervention.technicien }}</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button 
                        @click="viewDocument(intervention)" 
                        class="text-blue-500 hover:text-blue-700 p-2 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                        title="Fiche d'intervention"
                      >
                        <i class="fas fa-file-pdf text-lg"></i>
                      </button>
                      <button 
                        @click="editDocument('intervention', index)" 
                        class="text-green-500 hover:text-green-700 p-2 rounded-xl hover:bg-green-50 transition-colors duration-300"
                        title="Modifier"
                      >
                        <i class="fas fa-edit text-lg"></i>
                      </button>
                      <button 
                        @click="confirmDeleteDocument('intervention', index)" 
                        class="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors duration-300"
                        title="Supprimer"
                      >
                        <i class="fas fa-trash text-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-sm text-gray-600 mb-2 font-semibold">
                      <i class="fas fa-upload mr-2"></i>Ajouter un fichier PDF
                    </label>
                    <input 
                      type="file" 
                      @change="handleInterventionFileUpload($event, intervention)" 
                      accept=".pdf"
                      class="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors duration-200"
                    >
                  </div>
                </div>
                <div v-if="selectedClient.interventions.length === 0" class="text-center py-12">
                  <div class="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-4">
                    <i class="fas fa-tools text-gray-400 text-3xl"></i>
                  </div>
                  <p class="text-gray-500 text-lg">Aucune intervention enregistrée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajout Client -->
    <div v-if="showAddClientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-800">Ajouter un Client</h3>
              <p class="text-gray-600 mt-2">Remplissez les informations du nouveau client</p>
            </div>
            <button 
              @click="showAddClientModal = false" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form @submit.prevent="addClient" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Type de client*</label>
              <select 
                v-model="newClient.type" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                @change="handleClientTypeChange"
              >
                <option value="Particulier">Particulier</option>
                <option value="Entreprise">Entreprise</option>
              </select>
            </div>

            <div v-if="newClient.type === 'Particulier'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Prénom*</label>
                <input 
                  v-model="newClient.first_name" 
                  type="text" 
                  required 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Jean"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Nom*</label>
                <input 
                  v-model="newClient.last_name" 
                  type="text" 
                  required 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Dupont"
                >
              </div>
            </div>

            <div v-if="newClient.type === 'Entreprise'">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Nom de l'entreprise*</label>
              <input 
                v-model="newClient.company_name" 
                type="text" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Nom de l'entreprise"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Email*</label>
              <input 
                v-model="newClient.email" 
                type="email" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="jean.dupont@example.com"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Téléphone</label>
              <input 
                v-model="newClient.telephone_number" 
                type="tel" 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="01 23 45 67 89"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Adresse</label>
              <input 
                v-model="newClient.address" 
                type="text" 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="123 Rue des Entrepreneurs, 75001 Paris"
              >
            </div>
            
            <div class="flex justify-end space-x-4 pt-6">
              <button 
                @click="showAddClientModal = false" 
                type="button" 
                class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Ajout Document -->
    <div v-if="showDocumentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-bold text-gray-800">
              {{ currentDocument.id ? 'Modifier' : 'Ajouter' }} {{ getDocumentTypeLabel(documentTypeToAdd) }}
            </h3>
            <button 
              @click="showDocumentModal = false" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveDocument" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Numéro*</label>
              <input 
                v-model="currentDocument.numero" 
                type="text" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                :placeholder="'Numéro de ' + getDocumentTypeLabel(documentTypeToAdd).toLowerCase()"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Date*</label>
              <input 
                v-model="currentDocument.date" 
                type="date" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
            </div>

            <!-- Champs spécifiques pour factures et proformas -->
            <div v-if="['facture', 'proforma'].includes(documentTypeToAdd)">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Montant*</label>
              <input 
                v-model="currentDocument.montant" 
                type="number" 
                step="0.01" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="0.00"
              >
            </div>

            <div v-if="['facture', 'proforma'].includes(documentTypeToAdd)">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Statut*</label>
              <select 
                v-model="currentDocument.statut" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="En attente">En attente</option>
                <option value="Payée" v-if="documentTypeToAdd === 'facture'">Payée</option>
                <option value="Convertie" v-if="documentTypeToAdd === 'proforma'">Convertie</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>

            <!-- Champs spécifiques pour bordereaux -->
            <div v-if="documentTypeToAdd === 'bordereau'">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Produits</label>
              <div v-for="(produit, index) in currentDocument.produits" :key="index" class="flex space-x-2 mb-3">
                <input 
                  v-model="produit.nom" 
                  type="text" 
                  class="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Nom du produit"
                >
                <input 
                  v-model="produit.qte" 
                  type="number" 
                  class="w-20 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Qté"
                >
                <button 
                  @click="removeProduit(index)" 
                  type="button" 
                  class="text-red-500 hover:text-red-700 p-2 transition-colors duration-300"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <button 
                @click="addProduit" 
                type="button" 
                class="text-blue-500 hover:text-blue-700 text-sm font-semibold transition-colors duration-300"
              >
                <i class="fas fa-plus mr-1"></i> Ajouter un produit
              </button>
            </div>

            <!-- Champs spécifiques pour interventions -->
            <div v-if="documentTypeToAdd === 'intervention'">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Description*</label>
                <textarea 
                  v-model="currentDocument.description" 
                  required 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" 
                  rows="3"
                  placeholder="Détails de l'intervention réalisée..."
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Technicien*</label>
                <input 
                  v-model="currentDocument.technicien" 
                  type="text" 
                  required 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Nom du technicien"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Durée</label>
                <input 
                  v-model="currentDocument.duree" 
                  type="text" 
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Ex: 2 heures"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Fichier PDF*</label>
              <input 
                type="file" 
                @change="handleDocumentFileUpload" 
                accept=".pdf" 
                :required="!currentDocument.id"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
              >
            </div>
            
            <div class="flex justify-end space-x-4 pt-6">
              <button 
                @click="showDocumentModal = false" 
                type="button" 
                class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Ajout Machine -->
    <div v-if="showMachineModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-bold text-gray-800">
              {{ currentMachine.id ? 'Modifier' : 'Ajouter' }} un équipement
            </h3>
            <button 
              @click="showMachineModal = false" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveMachine" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Type*</label>
              <select 
                v-model="currentMachine.type" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="Ordinateur portable">Ordinateur portable</option>
                <option value="Ordinateur fixe">Ordinateur fixe</option>
                <option value="Serveur">Serveur</option>
                <option value="Imprimante">Imprimante</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Marque*</label>
              <input 
                v-model="currentMachine.brand" 
                type="text" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Dell, HP, Lenovo..."
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Modèle*</label>
              <input 
                v-model="currentMachine.model" 
                type="text" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Modèle exact de la machine"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">N° de série*</label>
              <input 
                v-model="currentMachine.serial_number" 
                type="text" 
                required 
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Numéro de série unique"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Fichier PDF</label>
              <input 
                type="file" 
                @change="handleMachineFileUploadModal" 
                accept=".pdf"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
              >
            </div>
            
            <div class="flex justify-end space-x-4 pt-6">
              <button 
                @click="showMachineModal = false" 
                type="button" 
                class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Confirmation Suppression -->
    <div v-if="deleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-bold text-gray-800">Confirmer la suppression</h3>
            <button 
              @click="deleteConfirmation = null" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="flex items-start mb-8">
            <div class="flex-shrink-0 pt-1">
              <div class="bg-gradient-to-r from-red-500 to-red-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                <i class="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-gray-700 text-lg font-semibold">Êtes-vous sûr de vouloir supprimer cet élément ?</p>
              <p class="text-gray-500 mt-2">Cette action est irréversible et supprimera définitivement les données.</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button 
              @click="deleteConfirmation = null" 
              class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Annuler
            </button>
            <button 
              @click="executeDelete" 
              class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = 'http://localhost:8000/api';

export default {
  data() {
    return {
      clients: [],
      selectedClient: null,
      showAddClientModal: false,
      showDocumentModal: false,
      showMachineModal: false,
      documentTypeToAdd: "",
      deleteConfirmation: null,
      activeTab: 'factures',
      tabs: [
        { id: 'factures', name: 'Factures' },
        { id: 'proformas', name: 'Proformas' },
        { id: 'bordereaux', name: 'Bordereaux' },
        { id: 'parc', name: 'Parc Informatique' },
        { id: 'interventions', name: 'Interventions' }
      ],
      newClient: {
        type: 'Particulier',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        telephone_number: '',
        address: ''
      },
      currentDocument: {
        id: null,
        numero: "",
        date: this.getTodayDate(),
        montant: 0,
        statut: "En attente",
        description: "",
        technicien: "",
        duree: "",
        produits: [],
        files: []
      },
      currentMachine: {
        id: null,
        type: "Ordinateur portable",
        brand: "",
        model: "",
        serial_number: "",
        files: []
      },
      searchQuery: "",
      loading: false
    }
  },
  computed: {
    filteredClients() {
      if (!this.searchQuery) return this.clients;
      const query = this.searchQuery.toLowerCase();
      return this.clients.filter(client => 
        this.getClientName(client).toLowerCase().includes(query) || 
        (client.company_name && client.company_name.toLowerCase().includes(query)) ||
        (client.email && client.email.toLowerCase().includes(query))
      );
    }
  },
  async mounted() {
    await this.loadClients();
  },
  methods: {
    getClientName(client) {
      if (client.type === 'Entreprise') {
        return client.company_name || client.entreprise || 'Entreprise';
      } else {
        return `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.nom || 'Client';
      }
    },

    getInitials(client) {
      const name = this.getClientName(client);
      return name.charAt(0).toUpperCase();
    },

    async loadClients() {
      try {
        this.loading = true;
        const response = await fetch(`${API_BASE_URL}/displayClients`);
        const result = await response.json();
        
        if (result.success) {
          this.clients = result.data.map(client => ({
            ...client,
            factures: client.factures || [],
            proformas: client.proformas || [],
            bordereaux: client.bordereaux || [],
            parcInformatique: client.parcInformatique || [],
            interventions: client.interventions || []
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        alert('Erreur lors du chargement des clients');
      } finally {
        this.loading = false;
      }
    },

    async selectClient(client) {
      try {
        this.loading = true;
        const documentsResponse = await fetch(`${API_BASE_URL}/clients/${client.id}/documents`);
        const documentsResult = await documentsResponse.json();
        
        if (documentsResult.success) {
          const documents = documentsResult.data;
          client.factures = documents.filter(doc => doc.type === 'facture');
          client.proformas = documents.filter(doc => doc.type === 'proforma');
          client.bordereaux = documents.filter(doc => doc.type === 'bordereau');
          client.interventions = documents.filter(doc => doc.type === 'intervention');
        }

        const equipmentsResponse = await fetch(`${API_BASE_URL}/displayEquipments`);
        const equipmentsResult = await equipmentsResponse.json();
        
        if (equipmentsResult.success) {
          client.parcInformatique = equipmentsResult.data.filter(eq => 
            eq.client_id === client.id
          ).map(eq => ({
            id: eq.id,
            type: eq.type,
            brand: eq.brand,
            model: eq.model,
            serial_number: eq.serial_number,
            files: eq.files || []
          }));
        }

        this.selectedClient = client;
        this.activeTab = 'factures';
      } catch (error) {
        console.error('Erreur lors du chargement des données client:', error);
        alert('Erreur lors du chargement des données client');
      } finally {
        this.loading = false;
      }
    },

    async switchTab(tabId) {
      this.activeTab = tabId;
      if (this.selectedClient) {
        await this.loadClientTabData(tabId);
      }
    },

    async loadClientTabData(tabId) {
      if (!this.selectedClient) return;

      try {
        let endpoint = '';
        switch(tabId) {
          case 'factures':
            endpoint = `clients/${this.selectedClient.id}/documents/facture`;
            break;
          case 'proformas':
            endpoint = `clients/${this.selectedClient.id}/documents/proforma`;
            break;
          case 'bordereaux':
            endpoint = `clients/${this.selectedClient.id}/documents/bordereau`;
            break;
          case 'interventions':
            endpoint = `clients/${this.selectedClient.id}/documents/intervention`;
            break;
          case 'parc':
            return;
        }

        if (endpoint) {
          const response = await fetch(`${API_BASE_URL}/${endpoint}`);
          const result = await response.json();
          
          if (result.success) {
            this.selectedClient[tabId] = result.data;
          }
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des ${tabId}:`, error);
      }
    },

    showAddDocumentModal(type) {
      this.documentTypeToAdd = type;
      this.currentDocument = { 
        id: null,
        numero: "", 
        date: this.getTodayDate(),
        montant: 0,
        statut: "En attente",
        description: "",
        technicien: "",
        duree: "",
        produits: [],
        files: []
      };
      this.showDocumentModal = true;
    },

    editDocument(type, index) {
      this.documentTypeToAdd = type;
      const doc = this.selectedClient[type][index];
      this.currentDocument = { 
        ...doc,
        produits: doc.produits || []
      };
      this.showDocumentModal = true;
    },

    getDocumentTypeLabel(type) {
      const labels = {
        'facture': 'Facture',
        'proforma': 'Facture Proforma',
        'bordereau': 'Bordereau de livraison',
        'intervention': 'Intervention'
      };
      return labels[type] || type;
    },

    getTodayDate() {
      return new Date().toISOString().split('T')[0];
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount || 0);
    },

    handleClientTypeChange() {
      if (this.newClient.type === 'Entreprise') {
        this.newClient.first_name = '';
        this.newClient.last_name = '';
      } else {
        this.newClient.company_name = '';
      }
    },

    async addClient() {
      try {
        const formData = new FormData();
        
        Object.keys(this.newClient).forEach(key => {
          if (this.newClient[key] !== null && this.newClient[key] !== undefined) {
            formData.append(key, this.newClient[key]);
          }
        });

        const response = await fetch(`${API_BASE_URL}/addClient`, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          await this.loadClients();
          this.showAddClientModal = false;
          this.resetNewClient();
          alert('Client ajouté avec succès');
        } else {
          alert('Erreur: ' + result.message);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du client:', error);
        alert('Erreur lors de l\'ajout du client');
      }
    },

    resetNewClient() {
      this.newClient = {
        type: 'Particulier',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        telephone_number: '',
        address: ''
      };
    },

    handleDocumentFileUpload(event) {
      this.currentDocument.files = Array.from(event.target.files);
    },

    handleMachineFileUploadModal(event) {
      this.currentMachine.files = Array.from(event.target.files);
    },

    addProduit() {
      this.currentDocument.produits.push({ nom: '', qte: 1 });
    },

    removeProduit(index) {
      this.currentDocument.produits.splice(index, 1);
    },

    async saveDocument() {
      if (!this.selectedClient) return;

      try {
        const formData = new FormData();
        formData.append('client_id', this.selectedClient.id);
        formData.append('type', this.documentTypeToAdd);
        formData.append('numero', this.currentDocument.numero);
        formData.append('date', this.currentDocument.date);
        
        if (['facture', 'proforma'].includes(this.documentTypeToAdd)) {
          formData.append('montant', this.currentDocument.montant);
          formData.append('statut', this.currentDocument.statut);
        }

        if (this.documentTypeToAdd === 'bordereau') {
          formData.append('produits', JSON.stringify(this.currentDocument.produits));
        }

        if (this.documentTypeToAdd === 'intervention') {
          formData.append('description', this.currentDocument.description);
          formData.append('technicien', this.currentDocument.technicien);
          formData.append('duree', this.currentDocument.duree);
        }

        if (this.currentDocument.files && this.currentDocument.files.length > 0) {
          this.currentDocument.files.forEach(file => {
            formData.append('fichiers[]', file);
          });
        }

        const url = this.currentDocument.id 
          ? `${API_BASE_URL}/documents/${this.currentDocument.id}`
          : `${API_BASE_URL}/documents/add`;

        const method = this.currentDocument.id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          await this.loadClientTabData(this.documentTypeToAdd + 's');
          this.showDocumentModal = false;
          alert('Document sauvegardé avec succès');
        } else {
          alert('Erreur: ' + result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du document:', error);
        alert('Erreur lors de la sauvegarde du document');
      }
    },

    async saveMachine() {
      if (!this.selectedClient) return;

      try {
        const formData = new FormData();
        formData.append('client_id', this.selectedClient.id);
        formData.append('type', this.currentMachine.type);
        formData.append('brand', this.currentMachine.brand);
        formData.append('model', this.currentMachine.model);
        formData.append('serial_number', this.currentMachine.serial_number);
        formData.append('company_name', this.selectedClient.company_name || this.selectedClient.entreprise || this.getClientName(this.selectedClient));

        if (this.currentMachine.files && this.currentMachine.files.length > 0) {
          this.currentMachine.files.forEach(file => {
            formData.append('photo', file);
          });
        }

        const url = this.currentMachine.id 
          ? `${API_BASE_URL}/updateEquipments/${this.currentMachine.id}`
          : `${API_BASE_URL}/addequipments`;

        const method = this.currentMachine.id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          await this.loadClientTabData('parc');
          this.showMachineModal = false;
          alert('Équipement sauvegardé avec succès');
        } else {
          alert('Erreur: ' + result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'équipement:', error);
        alert('Erreur lors de la sauvegarde de l\'équipement');
      }
    },

    viewDocument(doc) {
      if (doc.fichiers && doc.fichiers.length > 0) {
        const fileUrl = `${API_BASE_URL}/files/${doc.fichiers[0].id}/view`;
        window.open(fileUrl, '_blank');
      } else {
        alert("Aucun fichier à visualiser");
      }
    },

    viewMachineFile(machine) {
      if (machine.files && machine.files.length > 0) {
        const fileUrl = `${API_BASE_URL}/files/machine/${machine.id}/view`;
        window.open(fileUrl, '_blank');
      } else {
        alert("Aucun fichier à visualiser");
      }
    },

    viewInterventionFile(intervention) {
      if (intervention.files && intervention.files.length > 0) {
        const fileUrl = `${API_BASE_URL}/files/${intervention.files[0].id}/view`;
        window.open(fileUrl, '_blank');
      } else {
        alert("Aucun fichier à visualiser");
      }
    },

    showAddMachineModal() {
      this.currentMachine = {
        id: null,
        type: "Ordinateur portable",
        brand: "",
        model: "",
        serial_number: "",
        files: []
      };
      this.showMachineModal = true;
    },

    editMachine(machine) {
      this.currentMachine = { 
        ...machine,
        brand: machine.brand || machine.marque,
        model: machine.model || machine.modele,
        serial_number: machine.serial_number || machine.serial
      };
      this.showMachineModal = true;
    },

    confirmDeleteClient(client) {
      this.deleteConfirmation = {
        type: 'client',
        data: client
      };
    },

    confirmDeleteDocument(docType, index) {
      this.deleteConfirmation = {
        type: 'document',
        docType: docType,
        index: index,
        data: this.selectedClient[docType][index]
      };
    },

    confirmDeleteMachine(machineId) {
      this.deleteConfirmation = {
        type: 'machine',
        data: machineId
      };
    },

    confirmDeleteIntervention(interventionId) {
      this.deleteConfirmation = {
        type: 'intervention',
        data: interventionId
      };
    },

    async executeDelete() {
      if (!this.deleteConfirmation) return;

      try {
        let url = '';
        let method = 'DELETE';

        switch(this.deleteConfirmation.type) {
          case 'client':
            url = `${API_BASE_URL}/deleteClient/${this.deleteConfirmation.data.id}`;
            break;
          case 'document':
            url = `${API_BASE_URL}/documents/${this.deleteConfirmation.data.id}`;
            break;
          case 'machine':
            url = `${API_BASE_URL}/deleteEquipments/${this.deleteConfirmation.data}`;
            break;
          case 'intervention':
            url = `${API_BASE_URL}/documents/${this.deleteConfirmation.data}`;
            break;
        }

        const response = await fetch(url, { method });
        const result = await response.json();

        if (result.success) {
          if (this.deleteConfirmation.type === 'client') {
            await this.loadClients();
            if (this.selectedClient && this.selectedClient.id === this.deleteConfirmation.data.id) {
              this.selectedClient = null;
            }
          } else if (this.selectedClient) {
            await this.loadClientTabData(this.activeTab);
          }
          
          alert('Suppression effectuée avec succès');
        } else {
          alert('Erreur lors de la suppression: ' + result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      } finally {
        this.deleteConfirmation = null;
      }
    },

    handleMachineFileUpload(event, machine) {
      console.log('Upload fichier machine:', machine, event.target.files);
    },

    handleInterventionFileUpload(event, intervention) {
      console.log('Upload fichier intervention:', intervention, event.target.files);
    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #10b981);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #059669);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Styles pour les modaux */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Amélioration de l'accessibilité */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-stack {
    @apply flex-col space-y-4;
  }
  
  .mobile-full {
    @apply w-full;
  }
}

/* États de chargement */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>