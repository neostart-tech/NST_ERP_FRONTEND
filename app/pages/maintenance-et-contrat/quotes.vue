<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES DEVIS ==================== -->
      <div v-if="!selectedQuote">
        <!-- Header dégradé sky -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">📄 Gestion des devis</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez tous vos devis</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouveau devis
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
                placeholder="Rechercher un devis..." 
                @input="handleSearch"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select v-model="filters.status" @change="applyFilters" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white min-w-[180px]">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="accepted">Accepté</option>
              <option value="refused">Refusé</option>
              <option value="expired">Expiré</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement des devis...</p>
        </div>

        <!-- Tableau des devis -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date émission</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Validité</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant TTC</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(quote, index) in quotes" :key="quote.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ quote.customer }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ quote.issueDate }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ quote.expiryDate }}</td>
                  <td class="px-6 py-4 font-bold text-gray-900">{{ formatPrice(quote.totalAmount) }} FCFA</td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(quote.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ quote.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 space-x-3">
                    <button @click="viewQuote(quote.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                    <button @click="editQuote(quote)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                    <button @click="deleteQuote(quote.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                    <button @click="downloadQuotePdf(quote)" class="text-emerald-600 hover:text-emerald-800 font-medium">PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ quotes.length }} sur {{ pagination.total }} devis
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
          <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingQuote ? 'Modifier le devis' : 'Nouveau devis' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveQuote">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Client *</label><select v-model="form.customerId" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"><option value="">Sélectionner un client</option><option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Date d'émission *</label><input v-model="form.issueDate" type="date" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Date de validité *</label><input v-model="form.expiryDate" type="date" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Équipements concernés</label><select v-model="form.equipmentIds" multiple class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"><option v-for="e in equipmentList" :key="e.id" :value="e.id">{{ e.brand }} {{ e.model }} - {{ e.serial_number }}</option></select><p class="text-xs text-gray-400 mt-1">Ctrl+clic pour sélectionner plusieurs</p></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Description des prestations *</label><textarea v-model="form.description" required rows="3" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></textarea></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Quantité *</label><input v-model="form.quantity" type="number" min="1" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Prix unitaire HT (FCFA) *</label><input v-model="form.unitPrice" type="number" step="1" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Remise (%)</label><input v-model="form.discount" type="number" step="0.01" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Taux TVA (%) *</label><input v-model="form.vatRate" type="number" step="0.01" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Montant HT total</label><input :value="formatPrice(totalHT)" readonly class="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Montant TTC total</label><input :value="formatPrice(totalTTC)" readonly class="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 font-bold text-sky-700"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Statut *</label><select v-model="form.status" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="pending">En attente</option><option value="accepted">Accepté</option><option value="refused">Refusé</option><option value="expired">Expiré</option></select></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Technicien assigné</label><select v-model="form.technicianId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="">Aucun</option><option v-for="t in technicians" :key="t.id" :value="t.id">{{ t.name }} - {{ t.specialty }}</option></select></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label><textarea v-model="form.comment" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></textarea></div>

                  <div class="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                    <h3 class="font-semibold text-md text-sky-700 mb-3">✍️ Signatures</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label class="block text-sm font-medium text-gray-700 mb-1">Signature client</label><div v-if="form.customerSignature" class="mb-2"><img :src="form.customerSignature" class="border border-gray-200 rounded-lg h-16 w-full object-contain bg-gray-50"></div><button type="button" @click="openSignatureModal('customer', 'form')" class="text-sky-600 text-sm font-medium hover:underline">Signer</button></div>
                      <div><label class="block text-sm font-medium text-gray-700 mb-1">Signature intervenant</label><div v-if="form.technicianSignature" class="mb-2"><img :src="form.technicianSignature" class="border border-gray-200 rounded-lg h-16 w-full object-contain bg-gray-50"></div><button type="button" @click="openSignatureModal('technician', 'form')" class="text-sky-600 text-sm font-medium hover:underline">Signer</button></div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                  <button type="button" @click="closeForm" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== FICHE DEVIS DÉTAILLÉE ==================== -->
      <div v-else-if="selectedQuote" class="space-y-6">
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start flex-wrap gap-4">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="openSignatureDetailModal('customer')" class="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition text-sm">✍️ Signatures</button>
                <button @click="downloadQuotePdf(selectedQuote)" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">📄 PDF</button>
                <button v-if="selectedQuote.status === 'En attente'" @click="acceptQuote" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">✓ Accepter</button>
                <button v-if="selectedQuote.status === 'En attente'" @click="rejectQuote" class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm">✗ Refuser</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Devis #{{ selectedQuote.id }}</h1>
              <p class="text-gray-600 mt-1">Client: {{ selectedQuote.customer }}</p>
              <p class="text-gray-500 text-sm mt-0.5">Émis le {{ selectedQuote.issueDate }} • Valide jusqu'au {{ selectedQuote.expiryDate }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📋 Informations générales</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Client</span><span class="font-medium text-gray-800">{{ selectedQuote.customer }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Date d'émission</span><span class="font-medium text-gray-800">{{ selectedQuote.issueDate }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Date de validité</span><span class="font-medium text-gray-800">{{ selectedQuote.expiryDate }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Statut</span><span :class="{'text-emerald-600': selectedQuote.status === 'Accepté', 'text-yellow-600': selectedQuote.status === 'En attente', 'text-red-600': selectedQuote.status === 'Refusé'}" class="font-semibold">{{ selectedQuote.status }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Technicien assigné</span><span class="font-medium text-gray-800">{{ selectedQuote.technician || 'Non assigné' }}</span></div>
              <div><span class="text-gray-500">Commentaire</span><p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedQuote.comment || 'Aucun commentaire' }}</p></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">💰 Détails financiers</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Description</span><span class="font-medium text-gray-800">{{ selectedQuote.description }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Quantité</span><span class="font-medium text-gray-800">{{ selectedQuote.quantity }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Prix unitaire HT</span><span class="font-medium text-gray-800">{{ formatPrice(selectedQuote.unitPrice) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Remise</span><span class="font-medium text-gray-800">{{ selectedQuote.discount || 0 }}%</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Montant HT</span><span class="font-medium text-gray-800">{{ formatPrice(selectedQuote.amountHT) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">TVA</span><span class="font-medium text-gray-800">{{ selectedQuote.vatRate }}%</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Montant TTC</span><span class="font-bold text-sky-700">{{ formatPrice(selectedQuote.totalAmount) }} FCFA</span></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">🖥️ Équipements concernés</h2>
          </div>
          <div class="p-6">
            <div v-if="selectedQuote.equipments && selectedQuote.equipments.length" class="space-y-2">
              <div v-for="eq in selectedQuote.equipments" :key="eq.id" class="border border-gray-100 rounded-xl p-3 hover:shadow-md transition">
                <p class="font-semibold text-gray-800">{{ eq.brand }} {{ eq.model }}</p>
                <p class="text-sm text-gray-500">N° série: {{ eq.serialNumber }}</p>
              </div>
            </div>
            <p v-else class="text-gray-400 italic text-center py-4">Aucun équipement spécifié</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">✍️ Signatures</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="font-medium text-gray-700 mb-2">Signature client</p>
                <div class="border border-gray-200 rounded-lg h-24 bg-gray-50"><img v-if="selectedQuote.customerSignature" :src="selectedQuote.customerSignature" class="h-24 w-full object-contain"><p v-else class="text-gray-400 text-center pt-8">Non signé</p></div>
              </div>
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="font-medium text-gray-700 mb-2">Signature intervenant</p>
                <div class="border border-gray-200 rounded-lg h-24 bg-gray-50"><img v-if="selectedQuote.technicianSignature" :src="selectedQuote.technicianSignature" class="h-24 w-full object-contain"><p v-else class="text-gray-400 text-center pt-8">Non signé</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL TOUS LES DEVIS -->
      <div v-if="showAllQuotes" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showAllQuotes = false">
        <div class="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Tous les devis ({{ quotes.length }})</h3>
            <button @click="showAllQuotes = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-4">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr><th class="p-3 text-left text-xs font-bold text-gray-600">#</th><th class="p-3 text-left text-xs font-bold text-gray-600">Client</th><th class="p-3 text-left text-xs font-bold text-gray-600">Date émission</th><th class="p-3 text-left text-xs font-bold text-gray-600">Validité</th><th class="p-3 text-left text-xs font-bold text-gray-600">Montant</th><th class="p-3 text-left text-xs font-bold text-gray-600">Statut</th><th class="p-3 text-left text-xs font-bold text-gray-600">Actions</th></tr>
              </thead>
              <tbody>
                <tr v-for="(quote, index) in quotes" :key="quote.id" class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="p-3 text-sm text-gray-500">{{ index + 1 }}</td>
                  <td class="p-3 font-semibold text-gray-800">{{ quote.customer }}</td>
                  <td class="p-3 text-sm text-gray-600">{{ quote.issueDate }}</td>
                  <td class="p-3 text-sm text-gray-600">{{ quote.expiryDate }}</td>
                  <td class="p-3 font-bold text-gray-900">{{ formatPrice(quote.totalAmount) }} FCFA</td>
                  <td class="p-3"><span :class="getStatusClass(quote.status)" class="px-2 py-1 rounded-full text-xs font-semibold">{{ quote.status }}</span></td>
                  <td class="p-3"><button @click="viewQuote(quote.id); showAllQuotes = false" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showAllQuotes = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Fermer</button>
          </div>
        </div>
      </div>

      <!-- MODAL SIGNATURE -->
      <div v-if="showSignatureModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showSignatureModal = false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-bold text-gray-800">Signature {{ signatureType === 'customer' ? 'client' : 'intervenant' }}</h3>
          </div>
          <div class="p-6">
            <canvas ref="signatureCanvas" width="400" height="200" class="border border-gray-200 rounded-xl w-full" style="touch-action: none;"></canvas>
            <div class="flex justify-between mt-4">
              <button @click="clearSignature" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Effacer</button>
              <button @click="validateSignature" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Valider</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'nuxt/app'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

const formatPrice = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))

const getStatusClass = (status) => {
  const classes = { 
    'En attente': 'bg-yellow-100 text-yellow-700',
    'Accepté': 'bg-emerald-100 text-emerald-700',
    'Refusé': 'bg-red-100 text-red-700',
    'Expiré': 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// États
const searchQuery = ref("")
const filters = ref({ status: "" })
const selectedQuote = ref(null)
const quotes = ref([])
const customers = ref([])
const technicians = ref([])
const equipmentList = ref([])
const loading = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)
const showAllQuotes = ref(false)

const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 15 })

const showModal = ref(false)
const editingQuote = ref(null)
const form = ref({
  customerId: "", issueDate: new Date().toISOString().split('T')[0], expiryDate: "", equipmentIds: [],
  description: "", quantity: 1, unitPrice: 0, discount: 0, vatRate: 18, status: "pending",
  comment: "", technicianId: "", customerSignature: null, technicianSignature: null
})

const showSignatureModal = ref(false)
const signatureType = ref('customer')
const signatureCanvas = ref(null)
let isDrawing = false, lastX = 0, lastY = 0, pendingSignatureTarget = null

let searchTimeout = null

// Computed totals
const totalHT = computed(() => {
  let total = (form.value.quantity || 0) * (form.value.unitPrice || 0)
  if (form.value.discount) total = total * (1 - form.value.discount / 100)
  return total
})

const totalTTC = computed(() => {
  return totalHT.value * (1 + (form.value.vatRate || 0) / 100)
})

const updateTotals = () => { form.value = { ...form.value } }

// API Functions
const fetchQuotes = async () => {
  loading.value = true
  try {
    const response = await api.get('/quotes', { params: { search: searchQuery.value, status: filters.value.status, per_page: pagination.value.per_page, page: pagination.value.current_page } })
    quotes.value = response.data.data || []
    pagination.value = response.data.meta || { current_page: 1, last_page: 1, total: 0, per_page: 15 }
  } catch (error) { console.error(error); alert("Erreur lors du chargement") }
  finally { loading.value = false }
}

const fetchCustomersList = async () => {
  try { const response = await api.get('/quotes/customers/list'); customers.value = response.data.data || [] }
  catch (error) { console.error(error) }
}

const fetchTechniciansList = async () => {
  try { const response = await api.get('/quotes/technicians/list'); technicians.value = response.data.data || [] }
  catch (error) { console.error(error) }
}

const fetchEquipmentByCustomer = async (customerId) => {
  if (!customerId) { equipmentList.value = []; return }
  try { const response = await api.get(`/quotes/equipment/by-customer/${customerId}`); equipmentList.value = response.data.data || [] }
  catch (error) { console.error(error); equipmentList.value = [] }
}

const fetchQuoteDetail = async (id) => {
  loadingDetail.value = true
  try { const response = await api.get(`/quotes/${id}`); selectedQuote.value = response.data.data }
  catch (error) { console.error(error); alert("Erreur lors du chargement des détails") }
  finally { loadingDetail.value = false }
}

const saveQuote = async () => {
  if (!form.value.customerId) { alert("Veuillez sélectionner un client"); return }
  if (!form.value.description) { alert("Veuillez saisir une description"); return }

  saving.value = true
  try {
    const data = {
      customerId: parseInt(form.value.customerId),
      issueDate: form.value.issueDate,
      expiryDate: form.value.expiryDate,
      equipmentIds: form.value.equipmentIds,
      description: form.value.description,
      quantity: parseInt(form.value.quantity),
      unitPrice: parseFloat(form.value.unitPrice),
      discount: parseFloat(form.value.discount) || 0,
      vatRate: parseFloat(form.value.vatRate),
      status: form.value.status,
      comment: form.value.comment,
      technicianId: form.value.technicianId ? parseInt(form.value.technicianId) : null,
      customerSignature: form.value.customerSignature,
      technicianSignature: form.value.technicianSignature,
    }

    let response
    if (editingQuote.value) response = await api.put(`/quotes/${editingQuote.value.id}`, data)
    else response = await api.post('/quotes', data)

    if (response.data.success) {
      alert(response.data.message || 'Devis enregistré')
      await fetchQuotes()
      closeForm()
      if (selectedQuote.value && editingQuote.value) await fetchQuoteDetail(selectedQuote.value.id)
    }
  } catch (error) {
    console.error(error)
    if (error.response?.data?.errors) alert(Object.values(error.response.data.errors).flat().join('\n'))
    else alert("Erreur lors de l'enregistrement")
  } finally { saving.value = false }
}

const deleteQuote = async (id) => {
  if (!confirm("Supprimer ce devis ?")) return
  loading.value = true
  try { await api.delete(`/quotes/${id}`); alert("Devis supprimé"); await fetchQuotes(); if (selectedQuote.value?.id === id) selectedQuote.value = null }
  catch (error) { console.error(error); alert("Erreur lors de la suppression") }
  finally { loading.value = false }
}

const acceptQuote = async () => {
  if (selectedQuote.value) {
    try {
      await api.post(`/quotes/${selectedQuote.value.id}/status`, { status: 'accepted' })
      selectedQuote.value.status = "Accepté"
      alert("Devis accepté !")
      await fetchQuotes()
    } catch (error) { console.error(error); alert("Erreur lors de l'acceptation") }
  }
}

const rejectQuote = async () => {
  if (selectedQuote.value) {
    try {
      await api.post(`/quotes/${selectedQuote.value.id}/status`, { status: 'refused' })
      selectedQuote.value.status = "Refusé"
      alert("Devis refusé")
      await fetchQuotes()
    } catch (error) { console.error(error); alert("Erreur lors du refus") }
  }
}

// PDF Function
const downloadQuotePdf = (quote) => {
  const printWindow = window.open('', '_blank')
  const formatPricePDF = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))

  const signatureHtml = (signatureBase64) => {
    if (signatureBase64) return `<img src="${signatureBase64}" style="max-height: 80px; max-width: 200px; border: 1px solid #ddd; padding: 5px;">`
    return `<p style="color: #999; font-style: italic;">Non signé</p>`
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>Devis #${quote.id}</title><meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #0284c7; margin: 0; }
      .title { text-align: center; margin-bottom: 30px; }
      .section { margin-bottom: 25px; }
      .section-title { color: #0284c7; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; font-size: 18px; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .info-label { font-weight: bold; color: #555; width: 40%; }
      .info-value { width: 60%; }
      .signature-box { display: flex; justify-content: space-between; margin-top: 20px; }
      .signature-item { width: 45%; text-align: center; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f1f1f1; }
    </style>
    </head>
    <body>
      <div class="header"><h1>NEO START TECH</h1><p>Service Maintenance</p><p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p><p>Tél: +228 90 42 20 20 | Email: contact@neostart.tech</p></div>
      <div class="title"><h2>DEVIS</h2><p>N°: ${quote.id} | Date: ${quote.issueDate}</p></div>
      <div class="section"><div class="section-title">📋 Informations client</div><div class="info-row"><span class="info-label">Client :</span><span class="info-value">${quote.customer}</span></div><div class="info-row"><span class="info-label">Validité :</span><span class="info-value">${quote.expiryDate}</span></div><div class="info-row"><span class="info-label">Technicien :</span><span class="info-value">${quote.technician || 'Non assigné'}</span></div></div>
      <div class="section"><div class="section-title">📦 Détails des prestations</div></table><thead><tr><th>Description</th><th>Qté</th><th>Prix HT</th><th>Total HT</th></tr></thead><tbody><tr><td>${quote.description}</td><td>${quote.quantity}</td><td>${formatPricePDF(quote.unitPrice)} FCFA</td><td>${formatPricePDF(quote.amountHT)} FCFA</td></tr></tbody></table></div>
      <div class="section"><div class="section-title">💰 Récapitulatif financier</div><div class="info-row"><span class="info-label">Total HT :</span><span class="info-value">${formatPricePDF(quote.amountHT)} FCFA</span></div><div class="info-row"><span class="info-label">Remise :</span><span class="info-value">${quote.discount || 0}%</span></div><div class="info-row"><span class="info-label">TVA (${quote.vatRate}%) :</span><span class="info-value">${formatPricePDF((quote.amountHT * quote.vatRate) / 100)} FCFA</span></div><div class="info-row"><span class="info-label"><strong>Total TTC :</strong></span><span class="info-value"><strong>${formatPricePDF(quote.totalAmount)} FCFA</strong></span></div></div>
      <div class="section"><div class="section-title">✍️ Signatures</div><div class="signature-box"><div class="signature-item"><p>Signature client</p>${signatureHtml(quote.customerSignature)}</div><div class="signature-item"><p>Signature intervenant</p>${signatureHtml(quote.technicianSignature)}</div></div></div>
      <div class="footer"><p>Document généré automatiquement par Neo Start Tech - ${new Date().toLocaleString()}</p></div>
    </body>
    </html>
  `
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

// UI Functions
const handleSearch = () => { if (searchTimeout) clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { pagination.value.current_page = 1; fetchQuotes() }, 500) }
const applyFilters = () => { pagination.value.current_page = 1; fetchQuotes() }
const changePage = (page) => { if (page < 1 || page > pagination.value.last_page) return; pagination.value.current_page = page; fetchQuotes() }

const openForm = () => {
  editingQuote.value = null
  form.value = { customerId: "", issueDate: new Date().toISOString().split('T')[0], expiryDate: "", equipmentIds: [], description: "", quantity: 1, unitPrice: 0, discount: 0, vatRate: 18, status: "pending", comment: "", technicianId: "", customerSignature: null, technicianSignature: null }
  equipmentList.value = []
  showModal.value = true
}

const editQuote = (quote) => {
  editingQuote.value = quote
  form.value = {
    customerId: quote.customerId, issueDate: quote.issueDate, expiryDate: quote.expiryDate,
    equipmentIds: quote.equipments?.map(e => e.id) || [], description: quote.description,
    quantity: quote.quantity, unitPrice: quote.unitPrice, discount: quote.discount || 0,
    vatRate: quote.vatRate, status: quote.status === 'En attente' ? 'pending' : quote.status === 'Accepté' ? 'accepted' : quote.status === 'Refusé' ? 'refused' : 'expired',
    comment: quote.comment || "", technicianId: quote.technicianId || "",
    customerSignature: quote.customerSignature || null, technicianSignature: quote.technicianSignature || null
  }
  if (quote.customerId) fetchEquipmentByCustomer(quote.customerId)
  showModal.value = true
}

const closeForm = () => { showModal.value = false; editingQuote.value = null }
const viewQuote = async (id) => { await fetchQuoteDetail(id) }
const goBackToList = () => { selectedQuote.value = null; fetchQuotes() }

// Signature functions
const openSignatureModal = (type, target) => {
  signatureType.value = type
  pendingSignatureTarget = target
  showSignatureModal.value = true
  setTimeout(() => initCanvas(), 100)
}

const openSignatureDetailModal = (type) => {
  signatureType.value = type
  pendingSignatureTarget = 'detail'
  showSignatureModal.value = true
  setTimeout(() => initCanvas(), 100)
}

const initCanvas = () => {
  const canvas = signatureCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', stopDrawing)
  canvas.addEventListener('touchstart', startDrawingTouch)
  canvas.addEventListener('touchmove', drawTouch)
  canvas.addEventListener('touchend', stopDrawing)
}

const startDrawing = (e) => { isDrawing = true; const rect = signatureCanvas.value.getBoundingClientRect(); lastX = e.clientX - rect.left; lastY = e.clientY - rect.top }
const draw = (e) => { if (!isDrawing) return; e.preventDefault(); const rect = signatureCanvas.value.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const ctx = signatureCanvas.value.getContext('2d'); ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke(); lastX = x; lastY = y }
const stopDrawing = () => { isDrawing = false }
const startDrawingTouch = (e) => { e.preventDefault(); isDrawing = true; const rect = signatureCanvas.value.getBoundingClientRect(); const touch = e.touches[0]; lastX = touch.clientX - rect.left; lastY = touch.clientY - rect.top }
const drawTouch = (e) => { if (!isDrawing) return; e.preventDefault(); const rect = signatureCanvas.value.getBoundingClientRect(); const touch = e.touches[0]; const x = touch.clientX - rect.left; const y = touch.clientY - rect.top; const ctx = signatureCanvas.value.getContext('2d'); ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke(); lastX = x; lastY = y }
const clearSignature = () => { const canvas = signatureCanvas.value; const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height) }
const validateSignature = () => {
  const canvas = signatureCanvas.value
  const signatureDataUrl = canvas.toDataURL()
  if (pendingSignatureTarget === 'form') {
    if (signatureType.value === 'customer') form.value.customerSignature = signatureDataUrl
    else form.value.technicianSignature = signatureDataUrl
  } else if (pendingSignatureTarget === 'detail' && selectedQuote.value) {
    if (signatureType.value === 'customer') selectedQuote.value.customerSignature = signatureDataUrl
    else selectedQuote.value.technicianSignature = signatureDataUrl
  }
  showSignatureModal.value = false
}

// Watch pour charger les équipements
watch(() => form.value.customerId, (newVal) => {
  if (newVal) fetchEquipmentByCustomer(newVal)
  else equipmentList.value = []
})

onMounted(() => { fetchQuotes(); fetchCustomersList(); fetchTechniciansList() })
</script>