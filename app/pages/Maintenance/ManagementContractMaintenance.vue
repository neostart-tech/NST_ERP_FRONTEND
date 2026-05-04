<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <h1 class="text-2xl font-bold">Gestion des Contrats</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm">Connecté en tant que <strong>Admin</strong></span>
          <button class="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-50">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <!-- Titre et boutons d'action -->
      <div class="flex justify-between items-center mb-6">
        <div class="text-2xl font-bold text-gray-800">Liste des Contrats</div>
        <div class="flex space-x-3">
          <button @click="showContractForm = true; isEditing = false" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Nouveau contrat
          </button>
          <button @click="showLetterModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Lettre de contrat
          </button>
          <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Exporter
          </button>
        </div>
      </div>

      <!-- Alertes et notifications -->
      <div class="mb-6 space-y-3">
        <div v-if="alerts.length > 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Alertes à traiter</h3>
              <div class="mt-2 text-sm text-yellow-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="alert in alerts" :key="alert.id">{{ alert.message }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Informations</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Vous avez <span class="font-semibold">{{ upcomingInterventions.length }} interventions</span> programmées dans les 7 prochains jours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de création de contrat -->
      <div v-if="showContractForm" class="mb-8 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ isEditing ? 'Modifier le contrat' : 'Nouveau contrat de maintenance' }}</h3>
          <button @click="closeContractForm" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitContractForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Client -->
            <div>
              <label for="client" class="block text-sm font-medium text-gray-700">Client *</label>
              <select id="client" v-model="newContract.client_id" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="">Sélectionnez un client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ getClientDisplayName(client) }}
                </option>
              </select>
            </div>

            <!-- Formule -->
            <div>
              <label for="formula" class="block text-sm font-medium text-gray-700">Formule *</label>
              <select id="formula" v-model="newContract.formula" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="">Sélectionnez une formule</option>
                <option value="basique">Basique</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="promotion">Promotion</option>
                <option value="personnalise">Personnalisé</option>
              </select>
            </div>

            <!-- Dates -->
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700">Date de début *</label>
              <input type="date" id="startDate" v-model="newContract.start_date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>

            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700">Date d'expiration *</label>
              <input type="date" id="endDate" v-model="newContract.end_date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>

            <!-- Montant et fréquence -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700">Montant (fcfa) *</label>
              <input type="number" id="amount" v-model="newContract.amount" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>

            <div>
              <label for="frequency" class="block text-sm font-medium text-gray-700">Fréquence d'intervention *</label>
              <select id="frequency" v-model="newContract.frequency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="mensuel">Mensuel</option>
                <option value="trimestriel">Trimestriel</option>
                <option value="semestriel">Semestriel</option>
                <option value="annuel">Annuel</option>
              </select>
            </div>

            <!-- Contact client -->
            <div>
              <label for="contact" class="block text-sm font-medium text-gray-700">Contact client *</label>
              <input type="text" id="contact" v-model="newContract.contact" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>

            <!-- Statut (seulement en modification) -->
            <div v-if="isEditing">
              <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
              <select id="status" v-model="newContract.status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="en_attente">En attente</option>
                <option value="actif">Actif</option>
                <option value="refuse">Refusé</option>
                <option value="resilie">Résilié</option>
                <option value="expire">Expiré</option>
              </select>
            </div>

            <!-- Origine de la demande -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Origine de la demande</label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input id="origin-client" name="origin" type="radio" v-model="newContract.origin" value="client" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                  <label for="origin-client" class="ml-3 block text-sm font-medium text-gray-700">Demande client</label>
                </div>
                <div class="flex items-center">
                  <input id="origin-internal" name="origin" type="radio" v-model="newContract.origin" value="internal" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                  <label for="origin-internal" class="ml-3 block text-sm font-medium text-gray-700">Initiative interne</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Prestations incluses -->
          <div>
            <label for="services" class="block text-sm font-medium text-gray-700">Prestations incluses</label>
            <textarea id="services" v-model="newContract.services" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">Notes supplémentaires</label>
            <textarea id="notes" v-model="newContract.notes" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <!-- Boutons du formulaire -->
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeContractForm" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Annuler
            </button>
            <button type="submit" :disabled="loading" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              <span v-if="loading">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Modifier' : 'Enregistrer' }} le contrat</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select id="status-filter" v-model="filters.status" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="en_attente">En attente</option>
              <option value="refuse">Refusé</option>
              <option value="resilie">Résilié</option>
              <option value="expire">Expiré</option>
            </select>
          </div>
          <div>
            <label for="formula-filter" class="block text-sm font-medium text-gray-700 mb-1">Formule</label>
            <select id="formula-filter" v-model="filters.formula" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
              <option value="">Toutes</option>
              <option value="basique">Basique</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="promotion">Promotion</option>
              <option value="personnalise">Personnalisé</option>
            </select>
          </div>
          <div>
            <label for="client-filter" class="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select id="client-filter" v-model="filters.client" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
              <option value="">Tous</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ getClientDisplayName(client) }}
              </option>
            </select>
          </div>
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div class="relative">
              <input type="text" id="search" v-model="filters.search" placeholder="Rechercher..." class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des contrats -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formule</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="contract in filteredContracts" :key="contract.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ contract.reference }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getClientName(contract.client_id) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{{ contract.formula }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Début: {{ formatDate(contract.start_date) }}</div>
                  <div>Fin: {{ formatDate(contract.end_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ contract.amount }}fcfa
                  <div class="text-xs text-gray-400">{{ contract.frequency }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(contract.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusText(contract.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button @click="viewContract(contract)" class="text-blue-600 hover:text-blue-900" title="Voir">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editContract(contract)" class="text-green-600 hover:text-green-900" title="Modifier">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="generateCalendar(contract)" class="text-purple-600 hover:text-purple-900" title="Générer calendrier">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button @click="generateContractPDF(contract)" class="text-orange-600 hover:text-orange-900" title="Générer PDF">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button @click="deleteContract(contract.id)" class="text-red-600 hover:text-red-900" title="Supprimer">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Message si aucun contrat -->
        <div v-if="filteredContracts.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun contrat</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par créer un nouveau contrat.</p>
        </div>
      </div>
    </main>

    <!-- Modal de visualisation de contrat amélioré -->
    <div v-if="selectedContract" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- En-tête amélioré -->
          <div class="bg-gradient-to-r from-blue-600 to-green-500 px-6 py-4 text-white">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold">Contrat #{{ selectedContract.reference }}</h3>
                <p class="text-blue-100 text-sm mt-1">{{ getClientName(selectedContract.client_id) }}</p>
              </div>
              <div class="text-right">
                <span :class="getStatusClass(selectedContract.status) + ' text-sm font-medium px-3 py-1 rounded-full'">
                  {{ getStatusText(selectedContract.status) }}
                </span>
                <p class="text-blue-100 text-sm mt-1">{{ formatDate(selectedContract.created_at) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white px-6 py-6">
            <!-- Grille d'informations améliorée -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Informations client -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informations Client
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Contact:</span>
                    <span class="font-medium text-gray-900">{{ selectedContract.contact }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Origine:</span>
                    <span class="font-medium text-gray-900 capitalize">{{ selectedContract.origin === 'client' ? 'Demande client' : 'Initiative interne' }}</span>
                  </div>
                </div>
              </div>

              <!-- Détails du contrat -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Détails du Contrat
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Formule:</span>
                    <span class="font-medium text-gray-900 capitalize">{{ selectedContract.formula }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Montant:</span>
                    <span class="font-medium text-gray-900">{{ selectedContract.amount }}FCFA({{ selectedContract.frequency }})</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Période:</span>
                    <span class="font-medium text-gray-900">{{ formatDate(selectedContract.start_date) }} - {{ formatDate(selectedContract.end_date) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prestations incluses -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Prestations Incluses
              </h4>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-sm text-gray-700 whitespace-pre-line">{{ selectedContract.services }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div class="mb-6" v-if="selectedContract.notes">
              <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Notes
              </h4>
              <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p class="text-sm text-yellow-800 whitespace-pre-line">{{ selectedContract.notes }}</p>
              </div>
            </div>

            <!-- Calendrier des interventions -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-900 flex items-center">
                  <svg class="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendrier des Interventions
                </h4>
                <div class="flex space-x-2">
                  <button @click="generateCalendar(selectedContract)" class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Générer Calendrier
                  </button>
                  <button @click="generateContractPDF(selectedContract)" class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Générer PDF
                  </button>
                </div>
              </div>

              <div v-if="selectedContract.interventions && selectedContract.interventions.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="intervention in selectedContract.interventions" :key="intervention.id" class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ formatDate(intervention.date) }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {{ intervention.type }}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-500">
                          {{ intervention.description }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span :class="getInterventionStatusClass(intervention.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ getInterventionStatusText(intervention.status) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune intervention</h3>
                <p class="mt-1 text-sm text-gray-500">Aucune intervention programmée pour ce contrat.</p>
                <div class="mt-4">
                  <button @click="generateCalendar(selectedContract)" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Générer le calendrier
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pied de page amélioré -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div class="flex space-x-3">
                <button v-if="selectedContract.status === 'en_attente'" @click="updateContractStatus(selectedContract.id, 'actif')" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Activer le contrat
                </button>
                <button v-if="selectedContract.status === 'actif'" @click="updateContractStatus(selectedContract.id, 'resilie')" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Résilier le contrat
                </button>
              </div>
              
              <div class="flex space-x-3">
                <button @click="selectedContract = null" type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour la lettre de contrat avec calendrier -->
    <div v-if="showLetterModal" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-start">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Générer un contrat de maintenance</h3>
              <button @click="showLetterModal = false" type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                <span class="sr-only">Fermer</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Colonne de paramétrage -->
              <div class="md:col-span-1">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Client *</label>
                    <select v-model="letterData.clientId" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                      <option value="">Sélectionnez un client</option>
                      <option v-for="client in clients" :key="client.id" :value="client.id">
                        {{ getClientDisplayName(client) }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Contact client</label>
                    <input v-model="letterData.clientContact" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Type de contrat *</label>
                    <select v-model="letterData.contractType" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                      <option value="main_oeuvre">Main d'œuvre uniquement</option>
                      <option value="full_service">Pièces et main d'œuvre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Formule</label>
                    <select v-model="letterData.formula" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                      <option value="basique">Basique</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="promotion">Promotion</option>
                      <option value="personnalise">Personnalisé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Montant (fcfa)</label>
                    <input v-model="letterData.amount" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Parc informatique</label>
                    <textarea v-model="letterData.equipmentDetails" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ex: 15 PC, 3 serveurs, 5 imprimantes..."></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Période du contrat</label>
                    <div class="grid grid-cols-2 gap-2">
                      <input v-model="letterData.startDate" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <input v-model="letterData.endDate" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Fréquence d'intervention</label>
                    <select v-model="letterData.frequency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                      <option value="mensuel">Mensuel</option>
                      <option value="trimestriel">Trimestriel</option>
                      <option value="annuel">Annuel</option>
                    </select>
                  </div>

                  <div>
                    <button @click="generateRandomCalendar" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Générer Calendrier Aléatoire
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Colonne d'édition du contenu -->
              <div class="md:col-span-2">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Préambule</label>
                    <textarea v-model="letterData.preamble" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Engagements du prestataire</label>
                    <textarea v-model="letterData.providerCommitments" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Engagements du client</label>
                    <textarea v-model="letterData.clientCommitments" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Prestations incluses</label>
                    <textarea v-model="letterData.includedServices" rows="5" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Calendrier des interventions</label>
                    <div class="mt-2 overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="(intervention, index) in letterData.interventions" :key="index" :class="{'bg-red-50': intervention.status === 'urgent'}">
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              <input v-model="intervention.date" type="date" class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              <select v-model="intervention.type" class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="maintenance">Maintenance</option>
                                <option value="audit">Audit</option>
                                <option value="urgence">Urgence</option>
                                <option value="preventive">Préventive</option>
                              </select>
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              <input v-model="intervention.description" type="text" class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              <select v-model="intervention.status" class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="planned">Planifié</option>
                                <option value="done">Effectué</option>
                                <option value="urgent">Urgent</option>
                                <option value="canceled">Annulé</option>
                              </select>
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              <button @click="removeIntervention(index)" class="text-red-600 hover:text-red-900">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <button @click="addIntervention" class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Ajouter une intervention
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="generateLetterPDF" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Générer PDF
            </button>
            <button @click="showLetterModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ManagementContractMaintenance',
  setup() {
    // États réactifs
    const clients = ref([])
    const contracts = ref([])
    const alerts = ref([])
    const showContractForm = ref(false)
    const showLetterModal = ref(false)
    const selectedContract = ref(null)
    const loading = ref(false)
    const isEditing = ref(false)

    // Filtres
    const filters = ref({
      status: "",
      formula: "",
      client: "",
      search: ""
    })

    // Données pour nouveau contrat
    const newContract = ref({
      reference: "",
      client_id: "",
      formula: "",
      start_date: "",
      end_date: "",
      amount: "",
      frequency: "mensuel",
      contact: "",
      services: "",
      notes: "",
      status: "en_attente",
      origin: "client"
    })

    // Données pour la lettre de contrat
    const letterData = ref({
      clientId: "",
      clientContact: "",
      contractType: "main_oeuvre",
      formula: "standard",
      amount: "",
      equipmentDetails: "",
      startDate: "",
      endDate: "",
      frequency: "mensuel",
      preamble: "Nous vous remercions pour la confiance que vous nous témoignez en sollicitant nos services pour la maintenance de votre parc informatique. Conformément à nos échanges, nous avons le plaisir de vous proposer un contrat de maintenance selon les modalités suivantes :",
      providerCommitments: `- Intervention dans les délais convenus
- Respect des bonnes pratiques de maintenance
- Fourniture des rapports d'intervention détaillés
- Mise à disposition d'un technicien qualifié
- Respect des engagements contractuels`,
      clientCommitments: `- Mise à disposition des accès nécessaires
- Communication des problèmes rencontrés
- Respect des engagements contractuels`,
      includedServices: `- Maintenance corrective à distance
- Support téléphonique du lundi au vendredi (9h-12h / 14h-18h)
- Interventions sur site selon le calendrier défini
- Mises à jour de sécurité
- Gestion des sauvegardes`,
      interventions: [
        { date: "", type: "maintenance", description: "", status: "planned" }
      ]
    })

    // Configuration de l'API
    const API_BASE = 'http://localhost:8000/api'

    // Méthodes pour les appels API
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE}/displayClients`)
        const data = await response.json()
        if (data.success) {
          clients.value = data.data
        } else {
          console.error('Erreur API clients:', data.message)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error)
      }
    }

    const fetchContracts = async () => {
      try {
        const response = await fetch(`${API_BASE}/contracts`)
        const data = await response.json()
        if (data.success) {
          contracts.value = data.data
        }
      } catch (error) {
        console.error('Erreur lors du chargement des contrats:', error)
      }
    }

    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE}/alerts/unread`)
        const data = await response.json()
        if (data.success) {
          alerts.value = data.data
        }
      } catch (error) {
        console.error('Erreur lors du chargement des alertes:', error)
      }
    }

    // Méthodes pour les contrats
    const submitContractForm = async () => {
      // Validation
      if (!newContract.value.client_id || !newContract.value.formula || !newContract.value.start_date || !newContract.value.end_date) {
        alert('Veuillez remplir tous les champs obligatoires')
        return
      }

      loading.value = true
      try {
        const url = isEditing.value 
          ? `${API_BASE}/contracts/${selectedContract.value.id}`
          : `${API_BASE}/contracts`
        
        const method = isEditing.value ? 'PUT' : 'POST'

        // Générer une référence si nouveau contrat
        if (!isEditing.value && !newContract.value.reference) {
          const date = new Date()
          newContract.value.reference = `CTR${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(contracts.value.length + 1).padStart(3, '0')}`
        }

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(newContract.value)
        })

        const data = await response.json()

        if (data.success) {
          alert(isEditing.value ? 'Contrat modifié avec succès!' : 'Contrat créé avec succès!')
          closeContractForm()
          await fetchContracts()
        } else {
          alert('Erreur: ' + (data.message || 'Erreur inconnue'))
          if (data.errors) {
            console.error('Erreurs de validation:', data.errors)
          }
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de l\'enregistrement du contrat')
      } finally {
        loading.value = false
      }
    }

    const deleteContract = async (contractId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
        try {
          const response = await fetch(`${API_BASE}/contracts/${contractId}`, {
            method: 'DELETE'
          })
          const data = await response.json()

          if (data.success) {
            alert('Contrat supprimé avec succès!')
            await fetchContracts()
          } else {
            alert('Erreur: ' + data.message)
          }
        } catch (error) {
          console.error('Erreur:', error)
          alert('Erreur lors de la suppression du contrat')
        }
      }
    }

    const updateContractStatus = async (contractId, newStatus) => {
      try {
        const response = await fetch(`${API_BASE}/contracts/${contractId}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        })

        const data = await response.json()

        if (data.success) {
          alert('Statut du contrat mis à jour avec succès!')
          selectedContract.value = null
          await fetchContracts()
        } else {
          alert('Erreur: ' + data.message)
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la mise à jour du statut')
      }
    }

    const generateCalendar = async (contract) => {
      try {
        const response = await fetch(`${API_BASE}/contracts/${contract.id}/generate-calendar`, {
          method: 'POST'
        })
        const data = await response.json()

        if (data.success) {
          alert(`Calendrier généré avec ${data.data.length} interventions`)
          // Recharger le contrat sélectionné
          const contractResponse = await fetch(`${API_BASE}/contracts/${contract.id}`)
          const contractData = await contractResponse.json()
          if (contractData.success) {
            selectedContract.value = contractData.data
          }
        } else {
          alert('Erreur: ' + data.message)
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la génération du calendrier')
      }
    }

    // Méthodes utilitaires
    const getClientDisplayName = (client) => {
      if (client.type === 'Entreprise') {
        return client.company_name
      } else {
        return `${client.first_name} ${client.last_name}`
      }
    }

    const getClientName = (clientId) => {
      const client = clients.value.find(c => c.id === clientId)
      return client ? getClientDisplayName(client) : "Client inconnu"
    }

    const formatDate = (dateString) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toLocaleDateString("fr-FR")
    }

    const getStatusText = (status) => {
      const statusMap = {
        actif: "Actif",
        en_attente: "En attente",
        refuse: "Refusé",
        resilie: "Résilié",
        expire: "Expiré"
      }
      return statusMap[status] || status
    }

    const getStatusClass = (status) => {
      const classMap = {
        actif: "bg-green-100 text-green-800",
        en_attente: "bg-yellow-100 text-yellow-800",
        refuse: "bg-red-100 text-red-800",
        resilie: "bg-gray-100 text-gray-800",
        expire: "bg-orange-100 text-orange-800"
      }
      return classMap[status] || "bg-gray-100 text-gray-800"
    }

    const getInterventionStatusText = (status) => {
      const statusMap = {
        planned: "Planifié",
        done: "Effectué",
        urgent: "Urgent",
        canceled: "Annulé"
      }
      return statusMap[status] || status
    }

    const getInterventionStatusClass = (status) => {
      const classMap = {
        planned: "bg-blue-100 text-blue-800",
        done: "bg-green-100 text-green-800",
        urgent: "bg-red-100 text-red-800",
        canceled: "bg-gray-100 text-gray-800"
      }
      return classMap[status] || "bg-gray-100 text-gray-800"
    }

    const viewContract = (contract) => {
      selectedContract.value = contract
    }

    const editContract = (contract) => {
      selectedContract.value = contract
      isEditing.value = true
      showContractForm.value = true
      
      // Remplir le formulaire avec les données du contrat
      newContract.value = {
        reference: contract.reference,
        client_id: contract.client_id,
        formula: contract.formula,
        start_date: contract.start_date.split('T')[0], // Format YYYY-MM-DD
        end_date: contract.end_date.split('T')[0],
        amount: contract.amount,
        frequency: contract.frequency,
        contact: contract.contact,
        services: contract.services,
        notes: contract.notes || "",
        status: contract.status,
        origin: contract.origin
      }
    }

    const closeContractForm = () => {
      showContractForm.value = false
      isEditing.value = false
      selectedContract.value = null
      newContract.value = {
        reference: "",
        client_id: "",
        formula: "",
        start_date: "",
        end_date: "",
        amount: "",
        frequency: "mensuel",
        contact: "",
        services: "",
        notes: "",
        status: "en_attente",
        origin: "client"
      }
    }

    // Méthodes pour la génération PDF PROFESSIONNELLE
    const generateContractPDF = (contract) => {
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Contrat ${contract.reference}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 40px 20px;
                }
                
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    position: relative;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white" opacity="0.1"><circle cx="50" cy="50" r="2"/></svg>');
                }
                
                .header h1 {
                    font-size: 2.5em;
                    font-weight: 700;
                    margin-bottom: 10px;
                    position: relative;
                }
                
                .header h2 {
                    font-size: 1.3em;
                    font-weight: 400;
                    opacity: 0.9;
                    position: relative;
                }
                
                .content {
                    padding: 40px;
                }
                
                .section {
                    margin-bottom: 40px;
                    background: #f8fafc;
                    border-radius: 15px;
                    padding: 30px;
                    border-left: 5px solid #667eea;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                }
                
                .section-title {
                    font-size: 1.4em;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .section-title::before {
                    content: '▶';
                    color: #667eea;
                    font-size: 0.8em;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .info-item {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 0.9em;
                    margin-bottom: 5px;
                }
                
                .info-value {
                    font-size: 1.1em;
                    color: #2d3748;
                    font-weight: 500;
                }
                
                .services-content {
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    line-height: 1.8;
                    white-space: pre-line;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }
                
                th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                }
                
                td {
                    padding: 15px;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                tr:hover {
                    background: #f7fafc;
                }
                
                .status-badge {
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-planned { background: #bee3f8; color: #2c5282; }
                .status-done { background: #c6f6d5; color: #276749; }
                .status-urgent { background: #fed7d7; color: #c53030; }
                .status-canceled { background: #e2e8f0; color: #4a5568; }
                
                .notes-section {
                    background: #fffaf0;
                    border-left: 5px solid #ed8936;
                    padding: 25px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                
                .footer {
                    text-align: center;
                    padding: 30px;
                    background: #f8fafc;
                    color: #718096;
                    font-size: 0.9em;
                    border-top: 1px solid #e2e8f0;
                }
                
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 6em;
                    color: rgba(102, 126, 234, 0.05);
                    font-weight: 900;
                    pointer-events: none;
                    z-index: -1;
                }
            </style>
        </head>
        <body>
            <div class="watermark">CONTRAT</div>
            <div class="container">
                <div class="header">
                    <h1>CONTRAT DE MAINTENANCE INFORMATIQUE</h1>
                    <h2>Référence: ${contract.reference}</h2>
                </div>
                
                <div class="content">
                    <div class="section">
                        <div class="section-title">INFORMATIONS GÉNÉRALES</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Client</div>
                                <div class="info-value">${getClientName(contract.client_id)}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Contact</div>
                                <div class="info-value">${contract.contact}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Formule</div>
                                <div class="info-value" style="text-transform: capitalize;">${contract.formula}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Statut</div>
                                <div class="info-value">
                                    <span class="status-badge" style="background: ${getStatusColor(contract.status)}; color: white;">
                                        ${getStatusText(contract.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">DÉTAILS DU CONTRAT</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Période</div>
                                <div class="info-value">Du ${formatDate(contract.start_date)} au ${formatDate(contract.end_date)}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Montant</div>
                                <div class="info-value" style="font-size: 1.3em; color: #2d3748; font-weight: 700;">${contract.amount}fcfa</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Fréquence</div>
                                <div class="info-value" style="text-transform: capitalize;">${contract.frequency}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Origine</div>
                                <div class="info-value">${contract.origin === 'client' ? 'Demande client' : 'Initiative interne'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">PRESTATIONS INCLUSES</div>
                        <div class="services-content">
                            ${contract.services.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    ${contract.interventions && contract.interventions.length > 0 ? `
                    <div class="section">
                        <div class="section-title">CALENDRIER DES INTERVENTIONS</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${contract.interventions.map(interv => `
                                    <tr>
                                        <td><strong>${formatDate(interv.date)}</strong></td>
                                        <td style="text-transform: capitalize;">${interv.type}</td>
                                        <td>${interv.description}</td>
                                        <td>
                                            <span class="status-badge status-${interv.status}">
                                                ${getInterventionStatusText(interv.status)}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}
                    
                    ${contract.notes ? `
                    <div class="notes-section">
                        <div class="section-title">📝 NOTES IMPORTANTES</div>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #fed7d7;">
                            ${contract.notes.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="footer">
                    <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p style="margin-top: 10px; opacity: 0.7;">Ce document a été généré automatiquement par le système de gestion des contrats</p>
                </div>
            </div>
        </body>
        </html>
      `

      const printWindow = window.open('', '_blank', 'width=1200,height=800')
      printWindow.document.write(content)
      printWindow.document.close()
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 1000)
      }
    }

    const generateLetterPDF = () => {
      if (!letterData.value.clientId) {
        alert('Veuillez sélectionner un client')
        return
      }

      const client = clients.value.find(c => c.id === parseInt(letterData.value.clientId))
      if (!client) {
        alert('Client non trouvé')
        return
      }

      const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Proposition de Contrat</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                    min-height: 100vh;
                    padding: 40px 20px;
                }
                
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .letterhead {
                    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    position: relative;
                }
                
                .letterhead::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white" opacity="0.1"><circle cx="50" cy="50" r="2"/></svg>');
                }
                
                .letterhead h1 {
                    font-size: 2.2em;
                    font-weight: 700;
                    margin-bottom: 10px;
                    position: relative;
                }
                
                .letterhead .subtitle {
                    font-size: 1.1em;
                    opacity: 0.9;
                    position: relative;
                }
                
                .content {
                    padding: 40px;
                }
                
                .address-section {
                    margin-bottom: 30px;
                    padding: 25px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    border-left: 5px solid #ff6b6b;
                }
                
                .date-section {
                    text-align: right;
                    margin-bottom: 30px;
                    color: #6c757d;
                }
                
                .subject {
                    font-weight: 600;
                    font-size: 1.3em;
                    margin: 30px 0;
                    color: #2d3748;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #ff6b6b;
                }
                
                .letter-body {
                    line-height: 1.8;
                }
                
                .section {
                    margin: 30px 0;
                    background: #f8fafc;
                    border-radius: 15px;
                    padding: 25px;
                    border-left: 5px solid #feca57;
                }
                
                .section h3 {
                    color: #2d3748;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .section h3::before {
                    content: '✓';
                    background: #feca57;
                    color: white;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8em;
                }
                
                .highlight-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                
                .highlight-box h4 {
                    margin-bottom: 15px;
                    font-size: 1.2em;
                }
                
                .intervention-list {
                    list-style: none;
                    padding: 0;
                }
                
                .intervention-list li {
                    padding: 12px 15px;
                    margin: 8px 0;
                    background: white;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .intervention-date {
                    font-weight: 600;
                    color: #2d3748;
                }
                
                .intervention-details {
                    color: #4a5568;
                }
                
                .signature-section {
                    margin-top: 50px;
                    padding: 30px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    text-align: center;
                }
                
                .footer {
                    text-align: center;
                    padding: 30px;
                    background: #2d3748;
                    color: #a0aec0;
                    font-size: 0.9em;
                }
                
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 6em;
                    color: rgba(255, 107, 107, 0.05);
                    font-weight: 900;
                    pointer-events: none;
                    z-index: -1;
                }
            </style>
        </head>
        <body>
            <div class="watermark">PROPOSITION</div>
            <div class="container">
                <div class="letterhead">
                    <h1>PROPOSITION DE CONTRAT</h1>
                    <div class="subtitle">Maintenance Informatique Professionnelle</div>
                </div>
                
                <div class="content">
                    <div class="address-section">
                        <strong>À l'attention de:</strong><br>
                        ${getClientDisplayName(client)}<br>
                        ${letterData.value.clientContact || client.email || ''}
                    </div>
                    
                    <div class="date-section">
                        Fait le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    
                    <div class="subject">
                        Objet: Proposition de contrat de maintenance informatique
                    </div>
                    
                    <div class="letter-body">
                        <p>${letterData.value.preamble}</p>
                        
                        <div class="highlight-box">
                            <h4>📊 RÉSUMÉ DE LA PROPOSITION</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                                <div>
                                    <strong>Type:</strong><br>
                                    ${letterData.value.contractType === 'main_oeuvre' ? "Main d'œuvre uniquement" : "Pièces et main d'œuvre"}
                                </div>
                                <div>
                                    <strong>Formule:</strong><br>
                                    ${letterData.value.formula}
                                </div>
                                <div>
                                    <strong>Montant:</strong><br>
                                    ${letterData.value.amount}fcfa
                                </div>
                                <div>
                                    <strong>Fréquence:</strong><br>
                                    ${letterData.value.frequency}
                                </div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>🛠️ PRESTATIONS INCLUSES</h3>
                            <div style="background: white; padding: 20px; border-radius: 8px; line-height: 1.8;">
                                ${letterData.value.includedServices.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>✅ ENGAGEMENTS DU PRESTATAIRE</h3>
                            <div style="background: white; padding: 20px; border-radius: 8px; line-height: 1.8;">
                                ${letterData.value.providerCommitments.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>🤝 ENGAGEMENTS DU CLIENT</h3>
                            <div style="background: white; padding: 20px; border-radius: 8px; line-height: 1.8;">
                                ${letterData.value.clientCommitments.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        ${letterData.value.interventions && letterData.value.interventions.filter(i => i.date).length > 0 ? `
                        <div class="section">
                            <h3>📅 CALENDRIER DES INTERVENTIONS PRÉVISIONNEL</h3>
                            <ul class="intervention-list">
                                ${letterData.value.interventions.filter(i => i.date).map(interv => `
                                    <li>
                                        <span class="intervention-date">${formatDate(interv.date)}</span>
                                        <span class="intervention-details">${interv.type} - ${interv.description}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        
                        <div class="signature-section">
                            <p>Dans l'attente de votre retour, nous restons à votre disposition pour toute information complémentaire.</p>
                            <p style="margin-top: 30px;">
                                <strong>Cordialement,</strong><br><br>
                                <strong style="font-size: 1.1em; color: #2d3748;">L'Équipe de Maintenance Informatique</strong>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} • Proposition confidentielle</p>
                </div>
            </div>
        </body>
        </html>
      `

      const printWindow = window.open('', '_blank', 'width=1200,height=800')
      printWindow.document.write(content)
      printWindow.document.close()
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 1000)
      }
    }

    // Fonction utilitaire pour les couleurs des statuts
    const getStatusColor = (status) => {
      const colorMap = {
        actif: '#48bb78',
        en_attente: '#ed8936',
        refuse: '#f56565',
        resilie: '#a0aec0',
        expire: '#ed8936'
      }
      return colorMap[status] || '#a0aec0'
    }

    // Méthodes pour la lettre de contrat
    const addIntervention = () => {
      letterData.value.interventions.push({
        date: "",
        type: "maintenance",
        description: "",
        status: "planned"
      })
    }

    const removeIntervention = (index) => {
      letterData.value.interventions.splice(index, 1)
    }

    const generateRandomCalendar = () => {
      if (!letterData.value.startDate || !letterData.value.endDate) {
        alert("Veuillez définir les dates de début et de fin du contrat")
        return
      }
      
      // Générer quelques interventions aléatoires
      const interventions = []
      const startDate = new Date(letterData.value.startDate)
      const endDate = new Date(letterData.value.endDate)
      
      const types = ['maintenance', 'audit', 'preventive']
      const descriptions = [
        'Maintenance préventive programmée',
        'Vérification des sauvegardes',
        'Mise à jour des systèmes',
        'Audit de sécurité'
      ]
      
      let currentDate = new Date(startDate)
      const interventionCount = 4 // Nombre d'interventions à générer
      
      for (let i = 0; i < interventionCount && currentDate <= endDate; i++) {
        interventions.push({
          date: currentDate.toISOString().split('T')[0],
          type: types[Math.floor(Math.random() * types.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          status: 'planned'
        })
        
        // Avancer de 2-4 semaines
        const weeksToAdd = 2 + Math.floor(Math.random() * 3)
        currentDate.setDate(currentDate.getDate() + (weeksToAdd * 7))
      }
      
      letterData.value.interventions = interventions
      alert(`Calendrier généré avec ${interventions.length} interventions`)
    }

    // Computed properties
    const upcomingInterventions = computed(() => {
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)
      
      const interventions = []
      
      contracts.value.forEach(contract => {
        if (contract.interventions) {
          contract.interventions.forEach(intervention => {
            const interventionDate = new Date(intervention.date)
            if (interventionDate >= today && interventionDate <= nextWeek && intervention.status === 'planned') {
              interventions.push({
                contract: contract.reference,
                client: getClientName(contract.client_id),
                date: intervention.date,
                type: intervention.type,
                description: intervention.description
              })
            }
          })
        }
      })
      
      return interventions
    })

    const filteredContracts = computed(() => {
      return contracts.value.filter(contract => {
        if (filters.value.status && contract.status !== filters.value.status) {
          return false
        }
        
        if (filters.value.formula && contract.formula !== filters.value.formula) {
          return false
        }
        
        if (filters.value.client && contract.client_id !== parseInt(filters.value.client)) {
          return false
        }
        
        if (filters.value.search) {
          const searchTerm = filters.value.search.toLowerCase()
          const clientName = getClientName(contract.client_id).toLowerCase()
          const reference = contract.reference.toLowerCase()
          
          if (!clientName.includes(searchTerm) && !reference.includes(searchTerm)) {
            return false
          }
        }
        
        return true
      })
    })

    // Initialisation
    onMounted(() => {
      fetchClients()
      fetchContracts()
      fetchAlerts()
    })

    return {
      clients,
      contracts,
      alerts,
      showContractForm,
      showLetterModal,
      selectedContract,
      filters,
      letterData,
      newContract,
      loading,
      isEditing,
      getClientDisplayName,
      getClientName,
      formatDate,
      getStatusText,
      getStatusClass,
      getInterventionStatusText,
      getInterventionStatusClass,
      viewContract,
      editContract,
      generateCalendar,
      updateContractStatus,
      submitContractForm,
      deleteContract,
      closeContractForm,
      generateContractPDF,
      generateLetterPDF,
      addIntervention,
      removeIntervention,
      generateRandomCalendar,
      upcomingInterventions,
      filteredContracts
    }
  }
}
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>