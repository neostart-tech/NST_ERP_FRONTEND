<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-gradient-to-r from-teal-600 to-blue-600 shadow-lg">
      <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="bg-white/20 p-2 rounded-lg">
            <!-- Logo blanc - à remplacer par votre vrai logo -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Neo Start Tech</h1>
        </div>
        <button 
          @click="showCompanySettings = true" 
          class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-white font-medium">Paramètres</span>
        </button>
      </div>
    </header>

    <!-- Navigation -->
    <div class="container mx-auto px-6 pt-6">
      <div class="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
        <button 
          @click="activeDoc = 'invoice'" 
          :class="{'bg-teal-500 text-white shadow-md': activeDoc === 'invoice'}" 
          class="flex-1 py-3 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          <span>Factures</span>
        </button>
        <button 
          @click="activeDoc = 'proforma'" 
          :class="{'bg-teal-500 text-white shadow-md': activeDoc === 'proforma'}" 
          class="flex-1 py-3 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Proformas</span>
        </button>
        <button 
          @click="activeDoc = 'delivery'" 
          :class="{'bg-teal-500 text-white shadow-md': activeDoc === 'delivery'}" 
          class="flex-1 py-3 px-4 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span>Livraisons</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-6">
      <!-- Formulaire de création -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-teal-500 to-blue-500 p-6">
          <h2 class="text-2xl font-bold text-white">
            {{ editing ? 'Modifier' : 'Créer' }} 
            {{ activeDoc === 'invoice' ? 'Facture' : '' }}
            {{ activeDoc === 'proforma' ? 'Proforma' : '' }}
            {{ activeDoc === 'delivery' ? 'Bon de Livraison' : '' }}
          </h2>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Informations client -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 class="font-semibold mb-4 text-lg text-teal-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations Client
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select v-model="currentDoc.client.type" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    <option value="company">Entreprise</option>
                    <option value="individual">Particulier</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input v-model="currentDoc.client.name" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input v-model="currentDoc.client.address" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input v-model="currentDoc.client.phone" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="currentDoc.client.email" type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  </div>
                </div>
              </div>
            </div>

            <!-- Détails du document -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 class="font-semibold mb-4 text-lg text-blue-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Détails du Document
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
                  <input v-model="currentDoc.document.number" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input v-model="currentDoc.document.date" type="date" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div v-if="activeDoc === 'invoice'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Échéance</label>
                    <input v-model="currentDoc.document.dueDate" type="date" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
                  <select v-model="currentDoc.document.serviceType" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Réparation</option>
                    <option value="installation">Installation</option>
                    <option value="diagnostic">Diagnostic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Articles -->
          <div class="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="font-semibold mb-4 text-lg text-teal-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Prestations
            </h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité</th>
                    <th v-if="activeDoc !== 'delivery'" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix unitaire</th>
                    <th v-if="activeDoc !== 'delivery'" class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in currentDoc.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input v-model="item.description" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input v-model="item.quantity" @change="updateTotal" type="number" class="w-20 border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500">
                    </td>
                    <td v-if="activeDoc !== 'delivery'" class="px-6 py-4 whitespace-nowrap">
                      <input v-model="item.unitPrice" @change="updateTotal" type="number" step="0.01" class="w-24 border border-gray-300 rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500">
                    </td>
                    <td v-if="activeDoc !== 'delivery'" class="px-6 py-4 whitespace-nowrap font-medium">
                      {{ (item.quantity * item.unitPrice).toFixed(2) }} €
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <button @click="removeItem(index)" class="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <button @click="addItem" class="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Ajouter une prestation</span>
            </button>
            
            <!-- Totaux pour factures/proformas -->
            <div v-if="activeDoc !== 'delivery'" class="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div class="flex justify-end">
                <div class="text-right space-y-2">
                  <p class="text-gray-700"><span class="font-semibold">Total HT:</span> {{ calculateTotal().toFixed(2) }} €</p>
                  <p class="text-gray-700"><span class="font-semibold">TVA (20%):</span> {{ (calculateTotal() * 0.2).toFixed(2) }} €</p>
                  <p class="text-xl font-bold text-blue-600"><span class="font-semibold">Total TTC:</span> {{ (calculateTotal() * 1.2).toFixed(2) }} €</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button @click="resetForm" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Annuler</span>
            </button>
            <button @click="saveDocument" class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ editing ? 'Modifier' : 'Enregistrer' }}</span>
            </button>
            <button 
              @click="previewDocument" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
              :disabled="!currentDoc.document.number || !currentDoc.client.name"
              :class="{'opacity-50 cursor-not-allowed': !currentDoc.document.number || !currentDoc.client.name}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Prévisualiser</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tableau des documents -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-teal-500 to-blue-500 p-6">
          <h2 class="text-2xl font-bold text-white">
            Liste des 
            {{ activeDoc === 'invoice' ? 'Factures' : '' }}
            {{ activeDoc === 'proforma' ? 'Proformas' : '' }}
            {{ activeDoc === 'delivery' ? 'Bons de Livraison' : '' }}
          </h2>
        </div>
        
        <div class="p-6">
          <div class="overflow-x-auto">
            <!-- Tableau Factures -->
            <table v-if="activeDoc === 'invoice'" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">N° Facture</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Service</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total TTC</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(invoice, index) in invoices" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ invoice.document.number }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.client.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(invoice.document.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getServiceTypeName(invoice.document.serviceType) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ calculateDocTotal(invoice).toFixed(2) }} €</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button @click="showDetails(invoice)" class="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editDocument(invoice, 'invoice')" class="text-yellow-500 hover:text-yellow-700 p-1 rounded hover:bg-yellow-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteDocument(invoice, 'invoice')" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button @click="generatePDF(invoice)" class="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Tableau Proformas -->
            <table v-if="activeDoc === 'proforma'" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">N° Proforma</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Service</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total TTC</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(proforma, index) in proformas" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ proforma.document.number }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ proforma.client.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(proforma.document.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getServiceTypeName(proforma.document.serviceType) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ calculateDocTotal(proforma).toFixed(2) }} €</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button @click="showDetails(proforma)" class="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editDocument(proforma, 'proforma')" class="text-yellow-500 hover:text-yellow-700 p-1 rounded hover:bg-yellow-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteDocument(proforma, 'proforma')" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button @click="generatePDF(proforma)" class="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Tableau Bons de Livraison -->
            <table v-if="activeDoc === 'delivery'" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">N° Bon</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Service</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(delivery, index) in deliveries" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ delivery.document.number }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ delivery.client.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(delivery.document.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getServiceTypeName(delivery.document.serviceType) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button @click="showDetails(delivery)" class="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editDocument(delivery, 'delivery')" class="text-yellow-500 hover:text-yellow-700 p-1 rounded hover:bg-yellow-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteDocument(delivery, 'delivery')" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button @click="generatePDF(delivery)" class="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de prévisualisation -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">
              Prévisualisation - {{ previewDoc.document.number }}
            </h3>
            <button @click="showPreviewModal = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Contenu de la prévisualisation -->
          <div class="border rounded-lg p-8">
            <div class="flex justify-between mb-8">
              <div>
                <h1 class="text-3xl font-bold text-teal-600">{{ getDocTypeName(previewDocType) }}</h1>
                <p class="text-gray-600 font-medium">{{ companyInfo.name }}</p>
                <p class="text-gray-600">{{ companyInfo.address }}</p>
                <p class="text-gray-600">{{ companyInfo.phone }} | {{ companyInfo.email }}</p>
                <p v-if="companyInfo.siret" class="text-gray-500 text-sm">SIRET: {{ companyInfo.siret }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-lg">N°: {{ previewDoc.document.number }}</p>
                <p>Date: {{ formatDate(previewDoc.document.date) }}</p>
                <p v-if="previewDocType === 'invoice'" class="text-teal-600">Échéance: {{ formatDate(previewDoc.document.dueDate) }}</p>
                <p class="text-teal-600 font-medium">
                  Service: {{ getServiceTypeName(previewDoc.document.serviceType) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-700 border-b pb-2 mb-3 text-lg">Émetteur</h3>
                <p class="font-medium">{{ companyInfo.name }}</p>
                <p>{{ companyInfo.address }}</p>
                <p>{{ companyInfo.phone }}</p>
                <p>{{ companyInfo.email }}</p>
                <p v-if="companyInfo.siret" class="text-sm text-gray-500">SIRET: {{ companyInfo.siret }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-700 border-b pb-2 mb-3 text-lg">Client</h3>
                <p class="font-medium">{{ previewDoc.client.name }}</p>
                <p>{{ previewDoc.client.address }}</p>
                <p>{{ previewDoc.client.phone }}</p>
                <p>{{ previewDoc.client.email }}</p>
              </div>
            </div>

            <div class="mb-6">
              <p class="mb-4">Madame, Monsieur,</p>
              <p v-if="previewDocType === 'invoice'">Veuillez trouver ci-joint la facture correspondant à nos services de {{ getServiceTypeName(previewDoc.document.serviceType) }}.</p>
              <p v-if="previewDocType === 'proforma'">Veuillez trouver ci-joint le devis pour nos services de {{ getServiceTypeName(previewDoc.document.serviceType) }}.</p>
              <p v-if="previewDocType === 'delivery'">Nous vous confirmons la bonne livraison pour la prestation de {{ getServiceTypeName(previewDoc.document.serviceType) }}.</p>
            </div>

            <table class="w-full border-collapse mb-8">
              <thead>
                <tr class="bg-teal-600 text-white">
                  <th class="border p-3 text-left">Description</th>
                  <th class="border p-3 text-left">Quantité</th>
                  <th v-if="previewDocType !== 'delivery'" class="border p-3 text-left">Prix unitaire</th>
                  <th v-if="previewDocType !== 'delivery'" class="border p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in previewDoc.items" :key="index" class="border-b hover:bg-gray-50">
                  <td class="border p-3">{{ item.description }}</td>
                  <td class="border p-3">{{ item.quantity }}</td>
                  <td v-if="previewDocType !== 'delivery'" class="border p-3">{{ item.unitPrice.toFixed(2) }} €</td>
                  <td v-if="previewDocType !== 'delivery'" class="border p-3">{{ (item.quantity * item.unitPrice).toFixed(2) }} €</td>
                </tr>
              </tbody>
              <tfoot v-if="previewDocType !== 'delivery'">
                <tr>
                  <td colspan="3" class="border p-3 text-right font-semibold bg-gray-100">Total HT</td>
                  <td class="border p-3 bg-gray-100">{{ calculateDocTotal(previewDoc, false).toFixed(2) }} €</td>
                </tr>
                <tr>
                  <td colspan="3" class="border p-3 text-right font-semibold bg-gray-100">TVA (20%)</td>
                  <td class="border p-3 bg-gray-100">{{ (calculateDocTotal(previewDoc, false) * 0.2).toFixed(2) }} €</td>
                </tr>
                <tr>
                  <td colspan="3" class="border p-3 text-right font-bold bg-teal-50">Total TTC</td>
                  <td class="border p-3 font-bold bg-teal-50">{{ calculateDocTotal(previewDoc).toFixed(2) }} €</td>
                </tr>
              </tfoot>
            </table>

            <div v-if="previewDocType === 'delivery'" class="mb-6">
              <p class="mb-4">Bonne réception de votre matériel.</p>
              <p>Nous vous remercions de votre confiance.</p>
            </div>

            <!-- Signature unique pour la société -->
            <div class="mt-12 pt-6 border-t">
              <div class="max-w-md mx-auto">
                <p class="text-center text-sm text-gray-600 mb-2">Signature de la société</p>
                <div class="border-2 border-gray-300 border-dashed rounded-lg h-24 flex items-center justify-center">
                  <span class="text-gray-400">Signature</span>
                </div>
                <p class="text-center text-xs text-gray-500 mt-2">Fait à {{ companyInfo.city }}, le {{ formatDate(previewDoc.document.date) }}</p>
              </div>
            </div>

            <div class="text-center mt-12 pt-6 border-t text-xs text-gray-500">
              <p>{{ companyInfo.name }} - {{ companyInfo.address }} - {{ companyInfo.phone }} - {{ companyInfo.email }}</p>
              <p v-if="companyInfo.siret">SIRET {{ companyInfo.siret }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="generatePDF(previewDoc)" class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Générer PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Paramètres Société -->
    <div v-if="showCompanySettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div class="bg-gradient-to-r from-teal-500 to-blue-500 p-6">
          <h3 class="text-xl font-bold text-white">Paramètres de la Société</h3>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la société</label>
              <input v-model="companyInfo.name" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input v-model="companyInfo.address" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>
                <input v-model="companyInfo.postalCode" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input v-model="companyInfo.city" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input v-model="companyInfo.phone" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="companyInfo.email" type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
              <input v-model="companyInfo.siret" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du responsable</label>
              <input v-model="companyInfo.responsible" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-4">
            <button @click="showCompanySettings = false" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Annuler
            </button>
            <button @click="saveCompanySettings" class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Enregistrer
            </button>
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
      activeDoc: 'invoice',
      editing: false,
      showPreviewModal: false,
      showCompanySettings: false,
      previewDoc: null,
      previewDocType: '',
      currentDoc: this.emptyDocument(),
      companyInfo: {
        name: "Neo Start Tech",
        address: "123 Rue de la Technologie",
        postalCode: "75000",
        city: "Paris",
        phone: "+33 1 23 45 67 89",
        email: "contact@neostartech.com",
        siret: "123 456 789 00010",
        responsible: "Jean Dupont"
      },
      invoices: [
        {
          client: {
            type: "company",
            name: "Société GMEDIC",
            address: "123 Rue des Clients, 75000 Paris",
            phone: "+33 1 23 45 67 89",
            email: "contact@gmedic.fr"
          },
          document: {
            number: "FAC-2023-001",
            date: "2023-05-15",
            dueDate: "2023-06-15",
            serviceType: "maintenance"
          },
          items: [
            { description: "Maintenance préventive", quantity: 1, unitPrice: 400 },
            { description: "Pièces de rechange", quantity: 3, unitPrice: 85 }
          ]
        }
      ],
      proformas: [
        {
          client: {
            type: "company",
            name: "Entreprise ABC",
            address: "456 Avenue des Projets, 75000 Paris",
            phone: "+33 1 98 76 54 32",
            email: "contact@abc.fr"
          },
          document: {
            number: "PRO-2023-001",
            date: "2023-05-10",
            serviceType: "repair"
          },
          items: [
            { description: "Réparation équipement", quantity: 1, unitPrice: 250 }
          ]
        }
      ],
      deliveries: [
        {
          client: {
            type: "company",
            name: "Client XYZ",
            address: "789 Boulevard des Livraisons, 75000 Paris",
            phone: "+33 1 12 34 56 78",
            email: "contact@xyz.fr"
          },
          document: {
            number: "BL-2023-001",
            date: "2023-05-12",
            serviceType: "installation"
          },
          items: [
            { description: "Installation système", quantity: 1 },
            { description: "Formation utilisateur", quantity: 2 }
          ]
        }
      ]
    }
  },
  methods: {
    emptyDocument() {
      return {
        client: {
          type: "company",
          name: "",
          address: "",
          phone: "",
          email: ""
        },
        document: {
          number: "",
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          serviceType: "maintenance"
        },
        items: [
          { description: "", quantity: 1, unitPrice: 0 }
        ]
      }
    },
    getDocTypeName(type) {
      return {
        'invoice': 'FACTURE',
        'proforma': 'DEVIS PROFORMA',
        'delivery': 'BORDEREAU DE LIVRAISON'
      }[type]
    },
    getServiceTypeName(type) {
      return {
        'maintenance': 'Maintenance',
        'repair': 'Réparation',
        'installation': 'Installation',
        'diagnostic': 'Diagnostic'
      }[type]
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    },
    addItem() {
      this.currentDoc.items.push({ description: "", quantity: 1, unitPrice: 0 })
    },
    removeItem(index) {
      this.currentDoc.items.splice(index, 1)
    },
    updateTotal() {
      // Cette méthode est appelée quand la quantité ou le prix unitaire change
    },
    calculateTotal() {
      return this.currentDoc.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    },
    calculateDocTotal(doc, withTax = true) {
      const total = doc.items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0)
      return withTax ? total * 1.2 : total
    },
    resetForm() {
      this.currentDoc = this.emptyDocument()
      this.editing = false
    },
    editDocument(doc, type) {
      this.activeDoc = type
      this.currentDoc = JSON.parse(JSON.stringify(doc))
      this.editing = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    showDetails(doc) {
      this.previewDoc = JSON.parse(JSON.stringify(doc))
      this.previewDocType = this.activeDoc
      this.showPreviewModal = true
    },
    previewDocument() {
      if (!this.currentDoc.document.number || !this.currentDoc.client.name) return
      this.previewDoc = JSON.parse(JSON.stringify(this.currentDoc))
      this.previewDocType = this.activeDoc
      this.showPreviewModal = true
    },
    saveDocument() {
      if (!this.currentDoc.document.number) {
        const prefix = {
          'invoice': 'FAC',
          'proforma': 'PRO',
          'delivery': 'BL'
        }[this.activeDoc]
        const year = new Date().getFullYear()
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        this.currentDoc.document.number = `${prefix}-${year}-${randomNum}`
      }

      const targetArray = this[this.activeDoc + 's']
      
      if (this.editing) {
        const index = targetArray.findIndex(d => d.document.number === this.currentDoc.document.number)
        if (index !== -1) {
          targetArray[index] = JSON.parse(JSON.stringify(this.currentDoc))
        }
      } else {
        targetArray.push(JSON.parse(JSON.stringify(this.currentDoc)))
      }

      this.resetForm()
    },
    deleteDocument(doc, type) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
        const targetArray = this[type + 's']
        const index = targetArray.findIndex(d => d.document.number === doc.document.number)
        if (index !== -1) {
          targetArray.splice(index, 1)
        }
      }
    },
    generatePDF(doc) {
      alert(`Génération PDF pour le document ${doc.document.number}`)
      this.showPreviewModal = false
    },
    saveCompanySettings() {
      localStorage.setItem('companySettings', JSON.stringify(this.companyInfo))
      this.showCompanySettings = false
    }
  },
  mounted() {
    const savedSettings = localStorage.getItem('companySettings')
    if (savedSettings) {
      this.companyInfo = JSON.parse(savedSettings)
    }
  }
}
</script>

<style>
/* Styles globaux */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Animation pour les boutons */
button {
  transition: all 0.2s ease;
}

/* Style pour les inputs focus */
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.5);
}

/* Style pour les tables */
table {
  min-width: 100%;
}

th {
  text-align: left;
}

/* Style pour les modals */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter, .modal-leave-to {
  opacity: 0;
}

/* Style pour les transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>