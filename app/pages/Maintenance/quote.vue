<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <!-- Navigation Premium -->
    <nav class="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 shadow-2xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-green-400">
                <i class="fas fa-file-invoice text-white text-sm"></i>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Gestion des Devis</h1>
              <p class="text-blue-100 text-sm font-light">Solution Professionnelle</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-blue-100 text-sm font-medium">{{ quotes.length }} devis</span>
            </div>
            <button 
              @click="showCreateForm = true" 
              class="flex items-center space-x-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30 hover:shadow-xl hover:scale-105 transform group"
            >
              <i class="fas fa-plus-circle text-lg"></i>
              <span>Nouveau Devis</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Bannière Statistiques -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-blue-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Carte Total Devis -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Devis</p>
                <p class="text-3xl font-bold mt-2">{{ quotes.length }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-file-invoice text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Carte Devis Acceptés -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Devis Acceptés</p>
                <p class="text-3xl font-bold mt-2">{{ quotes.filter(q => q.status === 'Accepté').length }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-check-circle text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Carte Devis Envoyés -->
          <div class="bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-50 text-sm font-medium">Devis Envoyés</p>
                <p class="text-3xl font-bold mt-2">{{ quotes.filter(q => q.status === 'Envoyé').length }}</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-paper-plane text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Carte Chiffre d'Affaires -->
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Chiffre d'Affaires</p>
                <p class="text-2xl font-bold mt-2">{{ calculateTotalCA().toFixed(2) }} fcfa</p>
              </div>
              <div class="bg-white/20 p-3 rounded-xl">
                <i class="fas fa-chart-line text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Barre de recherche et filtres -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div class="flex items-center space-x-4">
              <div class="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-2xl shadow-lg">
                <i class="fas fa-search text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Liste des Devis</h2>
                <p class="text-gray-600">Gérez l'ensemble de vos devis techniques</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div class="relative w-full lg:w-96">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Rechercher un devis par client, référence..." 
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm"
                >
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-xl">
                  {{ filteredQuotes.length }} devis trouvés
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau des devis -->
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-blue-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-blue-50 to-green-50">
                <tr>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Référence</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Client</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Date</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Montant</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Statut</th>
                  <th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr 
                  v-for="quote in filteredQuotes" 
                  :key="quote.id" 
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group"
                >
                  <td class="px-8 py-6 whitespace-nowrap">
                    <div class="text-sm font-medium text-blue-600 font-bold">#{{ quote.quote_number }}</div>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span class="text-white font-bold text-sm">
                          {{ getClientInitials(quote.client) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {{ quote.client?.first_name }} {{ quote.client?.last_name }}
                        </div>
                        <div class="text-xs text-gray-500">{{ quote.client?.company_name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(quote.date) }}
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900">{{ quote.total_ttc }} fcfa</div>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap">
                    <span :class="`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm transition-all duration-300 ${getStatusColor(quote.status)}`">
                      <i :class="`fas ${getStatusIcon(quote.status)} mr-2`"></i>
                      {{ quote.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-3">
                      <button 
                        @click="viewQuote(quote)" 
                        class="text-blue-600 hover:text-blue-800 p-3 rounded-2xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
                        title="Voir plus"
                      >
                        <i class="fas fa-eye text-lg"></i>
                      </button>
                      <button 
                        @click="editQuote(quote)" 
                        class="text-yellow-600 hover:text-yellow-800 p-3 rounded-2xl hover:bg-yellow-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
                        title="Modifier"
                      >
                        <i class="fas fa-edit text-lg"></i>
                      </button>
                      <button 
                        @click="generatePDF(quote.id)" 
                        class="text-green-600 hover:text-green-800 p-3 rounded-2xl hover:bg-green-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
                        title="Générer PDF"
                      >
                        <i class="fas fa-file-pdf text-lg"></i>
                      </button>
                      <button 
                        @click="deleteQuote(quote.id)" 
                        class="text-red-600 hover:text-red-800 p-3 rounded-2xl hover:bg-red-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
                        title="Supprimer"
                      >
                        <i class="fas fa-trash text-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- État Vide -->
          <div v-if="filteredQuotes.length === 0" class="text-center py-16">
            <div class="max-w-md mx-auto">
              <div class="bg-gradient-to-r from-blue-100 to-green-100 w-32 h-32 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg">
                <i class="fas fa-file-invoice text-blue-500 text-4xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucun devis trouvé</h3>
              <p class="text-gray-500 mb-6 text-lg">Commencez par créer votre premier devis.</p>
              <button 
                @click="showCreateForm = true" 
                class="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <i class="fas fa-plus-circle mr-3"></i>
                Créer un devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création -->
    <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Nouveau Devis</h2>
              <p class="text-gray-600 mt-2">Remplissez les informations du nouveau devis</p>
            </div>
            <button 
              @click="showCreateForm = false" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="createQuote" class="space-y-6">
            <!-- Informations client -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Client *</label>
                <select 
                  v-model="newQuote.client_id" 
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  :disabled="loadingClients"
                >
                  <option value="">Sélectionner un client</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.first_name }} {{ client.last_name }} 
                    <template v-if="client.company_name">- {{ client.company_name }}</template>
                  </option>
                </select>
                <p v-if="loadingClients" class="text-sm text-gray-500 mt-2">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Chargement des clients...
                </p>
                <p v-if="clients.length === 0 && !loadingClients" class="text-sm text-red-500 mt-2">
                  <i class="fas fa-exclamation-triangle mr-2"></i>
                  Aucun client disponible. Veuillez d'abord créer un client.
                </p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Date *</label>
                <input 
                  v-model="newQuote.date" 
                  type="date" 
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
              </div>
            </div>

            <!-- Statut et validité -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Statut *</label>
                <select 
                  v-model="newQuote.status" 
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Envoyé">Envoyé</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Refusé">Refusé</option>
                  <option value="Facturé">Facturé</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Validité (jours) *</label>
                <input 
                  v-model.number="newQuote.validity_days" 
                  type="number" 
                  min="1"
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
              </div>
            </div>

            <!-- Taux de TVA -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Taux de TVA (%) *</label>
              <input 
                v-model.number="newQuote.vat_rate" 
                type="number" 
                step="0.01"
                min="0"
                required
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
            </div>

            <!-- Articles -->
            <div class="border-2 border-gray-200 rounded-2xl p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                  <i class="fas fa-list-ul mr-3 text-blue-500"></i>
                  Articles *
                </h3>
                <button 
                  type="button" 
                  @click="addNewItem" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus mr-2"></i>
                  Ajouter un article
                </button>
              </div>
              
              <div v-for="(item, index) in newQuote.items" :key="index" class="grid grid-cols-12 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div class="col-span-5">
                  <input 
                    v-model="item.description" 
                    type="text" 
                    placeholder="Description *"
                    required
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    v-model.number="item.quantity" 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    placeholder="Quantité *"
                    required
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                </div>
                <div class="col-span-3">
                  <input 
                    v-model.number="item.unit_price" 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="Prix unitaire *"
                    required
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                </div>
                <div class="col-span-2 flex items-center justify-end">
                  <button 
                    type="button" 
                    @click="removeNewItem(index)" 
                    class="text-red-500 hover:text-red-700 p-2 transition-colors duration-300"
                    :disabled="newQuote.items.length === 1"
                  >
                    <i class="fas fa-trash text-lg"></i>
                  </button>
                </div>
                <div class="col-span-12 mt-3 text-sm font-semibold text-gray-700">
                  <i class="fas fa-calculator mr-2 text-green-500"></i>
                  Total: {{ (item.quantity * item.unit_price).toFixed(2) }} fcfa
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Notes</label>
              <textarea 
                v-model="newQuote.notes" 
                rows="4"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Notes supplémentaires..."
              ></textarea>
            </div>

            <!-- Conditions générales et modalités de paiement -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Conditions générales</label>
                <textarea 
                  v-model="newQuote.terms_conditions" 
                  rows="3"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Conditions générales..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Modalités de paiement</label>
                <textarea 
                  v-model="newQuote.payment_terms" 
                  rows="3"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Modalités de paiement..."
                ></textarea>
              </div>
            </div>

            <!-- Totaux -->
            <div class="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-calculator mr-3 text-blue-500"></i>
                Récapitulatif
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-3 border-b border-blue-200">
                  <span class="font-medium text-gray-700">Sous-total HT</span>
                  <span class="font-bold text-blue-600">{{ calculateSubtotal(newQuote.items).toFixed(2) }} fcfa</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-blue-200">
                  <span class="font-medium text-gray-700">TVA ({{ newQuote.vat_rate }}%)</span>
                  <span class="font-bold text-green-600">{{ calculateVAT(newQuote.items, newQuote.vat_rate).toFixed(2) }} fcfa</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-white rounded-xl px-4">
                  <span class="font-bold text-lg text-gray-800">Total TTC</span>
                  <span class="font-bold text-lg text-blue-700">{{ calculateTotal(newQuote.items, newQuote.vat_rate).toFixed(2) }} fcfa</span>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                @click="showCreateForm = false" 
                class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                :disabled="creatingQuote || clients.length === 0"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                <i v-if="creatingQuote" class="fas fa-spinner fa-spin mr-3"></i>
                <i v-else class="fas fa-plus-circle mr-3"></i>
                {{ creatingQuote ? 'Création...' : 'Créer le devis' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de visualisation -->
    <div v-if="viewingQuote" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Devis #{{ viewingQuote.quote_number }}</h2>
              <p class="text-gray-600 mt-2">Détails du devis</p>
            </div>
            <button 
              @click="viewingQuote = null" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-user mr-3 text-blue-500"></i>
                Client
              </h3>
              <div class="space-y-3">
                <p class="font-medium text-gray-900">{{ viewingQuote.client?.first_name }} {{ viewingQuote.client?.last_name }}</p>
                <p v-if="viewingQuote.client?.company_name" class="text-gray-600">
                  <i class="fas fa-building mr-2 text-blue-400"></i>
                  {{ viewingQuote.client?.company_name }}
                </p>
                <p v-if="viewingQuote.client?.email" class="text-gray-600">
                  <i class="fas fa-envelope mr-2 text-blue-400"></i>
                  {{ viewingQuote.client?.email }}
                </p>
                <p v-if="viewingQuote.client?.telephone_number" class="text-gray-600">
                  <i class="fas fa-phone mr-2 text-blue-400"></i>
                  {{ viewingQuote.client?.telephone_number }}
                </p>
              </div>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-info-circle mr-3 text-green-500"></i>
                Détails
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Date</p>
                  <p class="font-medium text-gray-900">{{ formatDate(viewingQuote.date) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Statut</p>
                  <span :class="`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusColor(viewingQuote.status)}`">
                    <i :class="`fas ${getStatusIcon(viewingQuote.status)} mr-2`"></i>
                    {{ viewingQuote.status }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Validité</p>
                  <p class="font-medium text-gray-900">{{ viewingQuote.validity_days }} jours</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">TVA</p>
                  <p class="font-medium text-gray-900">{{ viewingQuote.vat_rate }}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-list-ul mr-3 text-blue-500"></i>
              Articles
            </h3>
            <div class="overflow-x-auto border-2 border-gray-200 rounded-2xl">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantité</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prix unitaire</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in viewingQuote.items" :key="index" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.description }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.unit_price?.toFixed(2) }} fcfa</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ (item.quantity * item.unit_price)?.toFixed(2) }} fcfa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-2"></div>
            <div class="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6">
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-blue-200">
                  <span class="font-medium text-gray-700">Sous-total HT</span>
                  <span class="font-bold text-blue-600">{{ calculateSubtotal(viewingQuote.items).toFixed(2) }} fcfa</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-blue-200">
                  <span class="font-medium text-gray-700">TVA ({{ viewingQuote.vat_rate }}%)</span>
                  <span class="font-bold text-green-600">{{ calculateVAT(viewingQuote.items, viewingQuote.vat_rate).toFixed(2) }} fcfa</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-white rounded-xl px-4">
                  <span class="font-bold text-lg text-gray-800">Total TTC</span>
                  <span class="font-bold text-lg text-blue-700">{{ calculateTotal(viewingQuote.items, viewingQuote.vat_rate).toFixed(2) }} fcfa</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="viewingQuote.notes" class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <i class="fas fa-sticky-note mr-3 text-yellow-500"></i>
              Notes
            </h3>
            <div class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <p class="text-gray-700 whitespace-pre-line">{{ viewingQuote.notes }}</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button 
              @click="generatePDF(viewingQuote.id)" 
              class="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <i class="fas fa-file-pdf mr-3"></i>
              Générer PDF
            </button>
            <button 
              @click="editQuote(viewingQuote)" 
              class="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <i class="fas fa-edit mr-3"></i>
              Modifier
            </button>
            <button 
              @click="viewingQuote = null" 
              class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <div v-if="editingQuote" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Modifier le devis #{{ editingQuote.quote_number }}</h2>
              <p class="text-gray-600 mt-2">Modifiez les informations du devis</p>
            </div>
            <button 
              @click="editingQuote = null" 
              class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="updateQuote" class="space-y-6">
            <!-- Informations client -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Client *</label>
                <select 
                  v-model="editingQuote.client_id" 
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  :disabled="loadingClients"
                >
                  <option value="">Sélectionner un client</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.first_name }} {{ client.last_name }} 
                    <template v-if="client.company_name">- {{ client.company_name }}</template>
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Date *</label>
                <input 
                  v-model="editingQuote.date" 
                  type="date" 
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
              </div>
            </div>

            <!-- Statut et validité -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Statut *</label>
                <select 
                  v-model="editingQuote.status" 
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Envoyé">Envoyé</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Refusé">Refusé</option>
                  <option value="Facturé">Facturé</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Validité (jours) *</label>
                <input 
                  v-model.number="editingQuote.validity_days" 
                  type="number" 
                  min="1"
                  required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
              </div>
            </div>

            <!-- Taux de TVA -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Taux de TVA (%) *</label>
              <input 
                v-model.number="editingQuote.vat_rate" 
                type="number" 
                step="0.01"
                min="0"
                required
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
            </div>

            <!-- Articles -->
            <div class="border-2 border-gray-200 rounded-2xl p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                  <i class="fas fa-list-ul mr-3 text-blue-500"></i>
                  Articles *
                </h3>
                <button 
                  type="button" 
                  @click="addItem" 
                  class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i class="fas fa-plus mr-2"></i>
                  Ajouter un article
                </button>
              </div>
              
              <div v-for="(item, index) in editingQuote.items" :key="index" class="grid grid-cols-12 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div class="col-span-5">
                  <input 
                    v-model="item.description" 
                    type="text" 
                    placeholder="Description *"
                    required
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    v-model.number="item.quantity" 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    placeholder="Quantité *"
                    required
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                </div>
                <div class="col-span-3">
                  <input 
                    v-model.number="item.unit_price" 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="Prix unitaire *"
                    required
                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                </div>
                <div class="col-span-2 flex items-center justify-end">
                  <button 
                    type="button" 
                    @click="removeItem(index)" 
                    class="text-red-500 hover:text-red-700 p-2 transition-colors duration-300"
                    :disabled="editingQuote.items.length === 1"
                  >
                    <i class="fas fa-trash text-lg"></i>
                  </button>
                </div>
                <div class="col-span-12 mt-3 text-sm font-semibold text-gray-700">
                  <i class="fas fa-calculator mr-2 text-green-500"></i>
                  Total: {{ (item.quantity * item.unit_price).toFixed(2) }} fcfa
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Notes</label>
              <textarea 
                v-model="editingQuote.notes" 
                rows="4"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Notes supplémentaires..."
              ></textarea>
            </div>

            <!-- Conditions générales et modalités de paiement -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Conditions générales</label>
                <textarea 
                  v-model="editingQuote.terms_conditions" 
                  rows="3"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Conditions générales..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Modalités de paiement</label>
                <textarea 
                  v-model="editingQuote.payment_terms" 
                  rows="3"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Modalités de paiement..."
                ></textarea>
              </div>
            </div>

            <!-- Totaux -->
            <div class="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-calculator mr-3 text-blue-500"></i>
                Récapitulatif
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-3 border-b border-blue-200">
                  <span class="font-medium text-gray-700">Sous-total HT</span>
                  <span class="font-bold text-blue-600">{{ calculateSubtotal(editingQuote.items).toFixed(2) }} fcfa</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-blue-200">
                  <span class="font-medium text-gray-700">TVA ({{ editingQuote.vat_rate }}%)</span>
                  <span class="font-bold text-green-600">{{ calculateVAT(editingQuote.items, editingQuote.vat_rate).toFixed(2) }} fcfa</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-white rounded-xl px-4">
                  <span class="font-bold text-lg text-gray-800">Total TTC</span>
                  <span class="font-bold text-lg text-blue-700">{{ calculateTotal(editingQuote.items, editingQuote.vat_rate).toFixed(2) }} fcfa</span>
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                @click="editingQuote = null" 
                class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                :disabled="updatingQuote"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                <i v-if="updatingQuote" class="fas fa-spinner fa-spin mr-3"></i>
                <i v-else class="fas fa-save mr-3"></i>
                {{ updatingQuote ? 'Mise à jour...' : 'Mettre à jour' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-3xl shadow-2xl flex items-center space-x-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="text-gray-700 font-semibold">Chargement...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Configuration Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

// États
const loading = ref(false)
const loadingClients = ref(false)
const loadingCompany = ref(false)
const quotes = ref([])
const clients = ref([])
const companies = ref([])
const searchQuery = ref('')
const viewingQuote = ref(null)
const editingQuote = ref(null)
const showCreateForm = ref(false)
const updatingQuote = ref(false)
const creatingQuote = ref(false)

// CORRECTION : Nouvelle approche - Récupérer d'abord l'entreprise
const newQuote = ref({
  client_id: '',
  company_id: null,
  date: new Date().toISOString().split('T')[0],
  validity_days: 30,
  status: 'Brouillon',
  vat_rate: 20,
  notes: '',
  terms_conditions: '',
  payment_terms: '',
  items: [
    {
      description: '',
      quantity: 1,
      unit_price: 0
    }
  ]
})

// Filtrage des devis
const filteredQuotes = computed(() => {
  if (!searchQuery.value) {
    return quotes.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return quotes.value.filter(quote => {
    const clientName = `${quote.client?.first_name || ''} ${quote.client?.last_name || ''}`.toLowerCase()
    const companyName = quote.client?.company_name?.toLowerCase() || ''
    const quoteNumber = quote.quote_number?.toLowerCase() || ''
    
    return clientName.includes(query) ||
           companyName.includes(query) ||
           quoteNumber.includes(query)
  })
})

// Méthodes de calcul
const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0
    const unitPrice = parseFloat(item.unit_price) || 0
    return sum + (quantity * unitPrice)
  }, 0)
}

const calculateVAT = (items, vatRate) => {
  const subtotal = calculateSubtotal(items)
  return subtotal * (parseFloat(vatRate) / 100)
}

const calculateTotal = (items, vatRate) => {
  const subtotal = calculateSubtotal(items)
  const vatAmount = calculateVAT(items, vatRate)
  return subtotal + vatAmount
}

const calculateTotalCA = () => {
  return quotes.value.reduce((sum, quote) => {
    return sum + (parseFloat(quote.total_ttc) || 0)
  }, 0)
}

// CORRECTION : Récupérer l'entreprise
const loadCompany = async () => {
  try {
    loadingCompany.value = true
    console.log('🔍 Chargement de l\'entreprise...')
    
    const response = await api.get('/company')
    console.log('🏢 Réponse entreprise:', response.data)
    
    if (response.data.status === 'success' && response.data.data) {
      companies.value = [response.data.data]
      newQuote.value.company_id = response.data.data.id
      console.log('✅ Entreprise chargée:', response.data.data)
    } else {
      console.warn('⚠️ Aucune entreprise trouvée')
      await createDefaultCompany()
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'entreprise:', error)
    await createDefaultCompany()
  } finally {
    loadingCompany.value = false
  }
}

// CORRECTION : Créer une entreprise par défaut si nécessaire
const createDefaultCompany = async () => {
  try {
    console.log('🏢 Création d\'une entreprise par défaut...')
    const response = await api.post('/company', {
      name: 'Mon Entreprise',
      initials: 'ME',
      slogan: 'Votre partenaire de confiance',
      address: '',
      phone: '',
      email: '',
      siret: '',
      vat_number: ''
    })
    
    if (response.data.status === 'success') {
      companies.value = [response.data.data]
      newQuote.value.company_id = response.data.data.id
      console.log('✅ Entreprise par défaut créée:', response.data.data)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'entreprise par défaut:', error)
    newQuote.value.company_id = 1
    console.warn('⚠️ Utilisation de company_id = 1 par défaut')
  }
}

// Méthodes API
const loadQuotes = async () => {
  try {
    loading.value = true
    const response = await api.get('/displayQuotes')
    
    if (response.data.success) {
      quotes.value = response.data.data
    } else {
      throw new Error(response.data.message || 'Erreur inconnue')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des devis:', error)
    alert('Erreur lors du chargement des devis: ' + error.message)
  } finally {
    loading.value = false
  }
}

const loadClients = async () => {
  try {
    loadingClients.value = true
    console.log('Chargement des clients...')
    
    const response = await api.get('/displayClients')
    
    console.log('Réponse clients:', response.data)
    
    if (response.data.success) {
      clients.value = response.data.data
      console.log('Clients chargés:', clients.value.length)
    } else {
      console.error('Erreur API clients:', response.data.message)
      throw new Error(response.data.message || 'Erreur lors du chargement des clients')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
    alert('Erreur lors du chargement des clients: ' + error.message)
  } finally {
    loadingClients.value = false
  }
}

const createQuote = async () => {
  try {
    creatingQuote.value = true
    
    // CORRECTION : Vérifier que company_id est défini
    if (!newQuote.value.company_id) {
      alert('Erreur: Aucune entreprise configurée. Veuillez contacter l\'administrateur.')
      return
    }

    // Validation des articles
    const validItems = newQuote.value.items.every(item => 
      item.description && item.quantity > 0 && item.unit_price >= 0
    )
    
    if (!validItems) {
      alert('Veuillez remplir tous les articles correctement')
      return
    }

    if (!newQuote.value.client_id) {
      alert('Veuillez sélectionner un client')
      return
    }

    // CORRECTION : Format exact avec company_id valide
    const quoteData = {
      client_id: parseInt(newQuote.value.client_id),
      company_id: parseInt(newQuote.value.company_id),
      date: newQuote.value.date,
      validity_days: parseInt(newQuote.value.validity_days),
      status: newQuote.value.status,
      vat_rate: parseFloat(newQuote.value.vat_rate),
      notes: newQuote.value.notes || '',
      terms_conditions: newQuote.value.terms_conditions || '',
      payment_terms: newQuote.value.payment_terms || '',
      items: newQuote.value.items.map(item => ({
        description: item.description.trim(),
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price)
      }))
    }

    console.log('🔍 DONNÉES ENVOYÉES:', JSON.stringify(quoteData, null, 2))

    const response = await api.post('/addQuote', quoteData)
    
    if (response.data.success) {
      await loadQuotes()
      showCreateForm.value = false
      resetNewQuote()
      alert('Devis créé avec succès')
    } else {
      alert(response.data.message || 'Erreur lors de la création')
    }
  } catch (error) {
    console.error('❌ ERREUR DÉTAILLÉE:', error)
    
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors
      console.error('🚨 ERREURS DE VALIDATION:', validationErrors)
      
      let errorMessage = 'Erreurs de validation:\n'
      Object.keys(validationErrors).forEach(field => {
        errorMessage += `• ${field}: ${validationErrors[field].join(', ')}\n`
      })
      alert(errorMessage)
    } else {
      alert('Erreur lors de la création du devis: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    creatingQuote.value = false
  }
}

const updateQuote = async () => {
  try {
    updatingQuote.value = true
    
    const quoteData = {
      client_id: parseInt(editingQuote.value.client_id),
      company_id: parseInt(editingQuote.value.company_id || newQuote.value.company_id || 1),
      date: editingQuote.value.date,
      validity_days: parseInt(editingQuote.value.validity_days),
      status: editingQuote.value.status,
      vat_rate: parseFloat(editingQuote.value.vat_rate),
      notes: editingQuote.value.notes || '',
      terms_conditions: editingQuote.value.terms_conditions || '',
      payment_terms: editingQuote.value.payment_terms || '',
      items: editingQuote.value.items.map(item => ({
        description: item.description.trim(),
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price)
      }))
    }

    console.log('🔍 DONNÉES MISE À JOUR:', JSON.stringify(quoteData, null, 2))

    const response = await api.put(`/updateQuote/${editingQuote.value.id}`, quoteData)
    
    if (response.data.success) {
      await loadQuotes()
      editingQuote.value = null
      alert('Devis mis à jour avec succès')
    } else {
      alert(response.data.message || 'Erreur lors de la mise à jour')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error)
    
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors
      console.error('🚨 ERREURS DE VALIDATION:', validationErrors)
      
      let errorMessage = 'Erreurs de validation:\n'
      Object.keys(validationErrors).forEach(field => {
        errorMessage += `• ${field}: ${validationErrors[field].join(', ')}\n`
      })
      alert(errorMessage)
    } else {
      alert('Erreur lors de la mise à jour du devis: ' + error.message)
    }
  } finally {
    updatingQuote.value = false
  }
}

const deleteQuote = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
    try {
      const response = await api.delete(`/deleteQuote/${id}`)
      if (response.data.success) {
        await loadQuotes()
        alert('Devis supprimé avec succès')
      } else {
        alert(response.data.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du devis:', error)
      alert('Erreur lors de la suppression du devis: ' + error.message)
    }
  }
}

const generatePDF = async (id) => {
  try {
    loading.value = true
    console.log('Tentative de génération PDF pour devis ID:', id)

    const response = await api.get(`/generatePDF/${id}`, {
      responseType: 'blob',
      timeout: 15000
    })
    
    console.log('Réponse PDF reçue, type:', response.headers['content-type'])

    if (response.headers['content-type'] !== 'application/pdf') {
      const text = await response.data.text()
      try {
        const errorData = JSON.parse(text)
        throw new Error(errorData.message || 'Le serveur a retourné une erreur')
      } catch {
        throw new Error('Le serveur n\'a pas retourné un PDF valide')
      }
    }

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    let fileName = `devis-${id}.pdf`
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1]
      }
    }
    
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 100)

    console.log('PDF généré et téléchargé avec succès')

  } catch (error) {
    console.error('Erreur détaillée PDF:', error)
    
    if (error.response?.status === 500 || error.code === 'ECONNABORTED') {
      console.log('Tentative de génération PDF côté client...')
      await generateClientSidePDF(id)
    } else if (error.response?.status === 404) {
      alert('Devis non trouvé.')
    } else {
      alert('Erreur lors de la génération du PDF: ' + error.message)
    }
  } finally {
    loading.value = false
  }
}

// Génération PDF côté client (solution de secours)
const generateClientSidePDF = async (id) => {
  try {
    const quoteResponse = await api.get(`/quotes/${id}`)
    if (!quoteResponse.data.success) {
      throw new Error('Impossible de récupérer les données du devis')
    }

    const quote = quoteResponse.data.data
    console.log('Génération PDF côté client pour:', quote.quote_number)

    const htmlContent = createPDFContent(quote)
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
    }, 500)

  } catch (error) {
    console.error('Erreur génération PDF côté client:', error)
    alert('Erreur lors de la génération du PDF. Vous pouvez utiliser la fonction d\'impression de votre navigateur.')
    
    const quoteResponse = await api.get(`/quotes/${id}`)
    if (quoteResponse.data.success) {
      const quote = quoteResponse.data.data
      const htmlContent = createPDFContent(quote)
      const printWindow = window.open('', '_blank')
      printWindow.document.write(htmlContent)
      printWindow.document.close()
    }
  }
}

// Créer le contenu HTML pour le PDF côté client
const createPDFContent = (quote) => {
  const subtotal = calculateSubtotal(quote.items)
  const vatAmount = calculateVAT(quote.items, quote.vat_rate)
  const total = calculateTotal(quote.items, quote.vat_rate)

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Devis ${quote.quote_number}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.4; color: #2d3748; background: #ffffff; padding: 15px; font-size: 12px; }
        .container { max-width: 100%; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { font-size: 22px; font-weight: 700; margin-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .info-card { background: #f8fafc; border-radius: 6px; padding: 15px; border-left: 3px solid #3b82f6; }
        .items-table { width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .items-table th { background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); color: white; font-weight: 600; padding: 10px 8px; text-align: left; font-size: 11px; }
        .items-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; color: #475569; }
        .totals { background: #f8fafc; border-radius: 6px; padding: 15px; margin-top: 15px; border: 1px solid #e2e8f0; }
        .total-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        @media print { @page { margin: 0; size: A4; } body { margin: 0; padding: 15px; } .no-print { display: none !important; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DEVIS</h1>
            <div class="quote-number">N° ${quote.quote_number}</div>
        </div>
        
        <div class="info-grid">
            <div class="info-card">
                <h3>INFORMATIONS CLIENT</h3>
                <p class="client-name">${quote.client?.first_name} ${quote.client?.last_name}</p>
                ${quote.client?.company_name ? `<p><strong>Société:</strong> ${quote.client.company_name}</p>` : ''}
                ${quote.client?.email ? `<p><strong>Email:</strong> ${quote.client.email}</p>` : ''}
            </div>
            
            <div class="info-card">
                <h3>DÉTAILS DU DEVIS</h3>
                <p><strong>Date:</strong> ${formatDate(quote.date)}</p>
                <p><strong>Validité:</strong> ${quote.validity_days} jours</p>
                <p><strong>Statut:</strong> ${quote.status}</p>
                <p><strong>TVA:</strong> ${quote.vat_rate}%</p>
            </div>
        </div>
        
        <div class="items-section">
            <h3>DESCRIPTION DES ARTICLES</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="width: 70px;">Quantité</th>
                        <th style="width: 90px;">Prix unitaire</th>
                        <th style="width: 90px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${quote.items?.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${item.unit_price?.toFixed(2)} fcfa</td>
                            <td>${(item.quantity * item.unit_price)?.toFixed(2)} fcfa</td>
                        </tr>
                    `).join('') || ''}
                </tbody>
            </table>
        </div>
        
        <div class="totals">
            <div class="total-row">
                <span>Sous-total HT</span>
                <span>${subtotal.toFixed(2)} fcfa</span>
            </div>
            <div class="total-row">
                <span>TVA (${quote.vat_rate}%)</span>
                <span>${vatAmount.toFixed(2)} fcfa</span>
            </div>
            <div class="total-row">
                <span><strong>Total TTC</strong></span>
                <span><strong>${total.toFixed(2)} fcfa</strong></span>
            </div>
        </div>
    </div>

    <div class="print-buttons no-print">
        <button class="print-btn" onclick="window.print()">🖨️ Imprimer le devis</button>
        <button class="close-btn" onclick="window.close()">❌ Fermer la fenêtre</button>
    </div>
</body>
</html>
`
}

// Méthodes de l'interface
const viewQuote = (quote) => {
  viewingQuote.value = quote
}

const editQuote = (quote) => {
  editingQuote.value = JSON.parse(JSON.stringify(quote))
  
  // CORRECTION : S'assurer que tous les champs sont présents
  if (!editingQuote.value.company_id) {
    editingQuote.value.company_id = newQuote.value.company_id || 1
  }
  if (!editingQuote.value.terms_conditions) {
    editingQuote.value.terms_conditions = ''
  }
  if (!editingQuote.value.payment_terms) {
    editingQuote.value.payment_terms = ''
  }
  
  if (!editingQuote.value.items || !Array.isArray(editingQuote.value.items)) {
    editingQuote.value.items = [{
      description: '',
      quantity: 1,
      unit_price: 0
    }]
  }
}

const addItem = () => {
  if (!editingQuote.value.items) {
    editingQuote.value.items = []
  }
  editingQuote.value.items.push({
    description: '',
    quantity: 1,
    unit_price: 0
  })
}

const removeItem = (index) => {
  if (editingQuote.value.items.length > 1) {
    editingQuote.value.items.splice(index, 1)
  }
}

const addNewItem = () => {
  newQuote.value.items.push({
    description: '',
    quantity: 1,
    unit_price: 0
  })
}

const removeNewItem = (index) => {
  if (newQuote.value.items.length > 1) {
    newQuote.value.items.splice(index, 1)
  }
}

const resetNewQuote = () => {
  newQuote.value = {
    client_id: '',
    company_id: newQuote.value.company_id,
    date: new Date().toISOString().split('T')[0],
    validity_days: 30,
    status: 'Brouillon',
    vat_rate: 20,
    notes: '',
    terms_conditions: '',
    payment_terms: '',
    items: [
      {
        description: '',
        quantity: 1,
        unit_price: 0
      }
    ]
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Brouillon': return 'bg-gray-100 text-gray-800'
    case 'Envoyé': return 'bg-blue-100 text-blue-800'
    case 'Accepté': return 'bg-green-100 text-green-800'
    case 'Refusé': return 'bg-red-100 text-red-800'
    case 'Facturé': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'Brouillon': return 'fa-edit'
    case 'Envoyé': return 'fa-paper-plane'
    case 'Accepté': return 'fa-check-circle'
    case 'Refusé': return 'fa-times-circle'
    case 'Facturé': return 'fa-file-invoice'
    default: return 'fa-question-circle'
  }
}

const getClientInitials = (client) => {
  if (!client) return '?'
  const firstName = client.first_name || ''
  const lastName = client.last_name || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'C'
}

// Charger les données au montage
onMounted(async () => {
  await loadCompany()
  await loadQuotes()
  await loadClients()
})
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