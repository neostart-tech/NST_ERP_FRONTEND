<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES FACTURES ==================== -->
      <div v-if="!selectedInvoice">
        <!-- Header dégradé sky -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">💰 Gestion des factures</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez toutes vos factures</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouvelle facture
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre de recherche globale -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div class="relative">
            <input 
              v-model="globalSearch"
              type="text" 
              placeholder="Rechercher dans toutes les factures..." 
              @input="handleGlobalSearch"
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
          <p class="mt-3 text-gray-500">Chargement des factures...</p>
        </div>

        <div v-else>
          <!-- PROFORMAS -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-sky-50 to-sky-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
              <h2 class="text-lg font-bold text-sky-700">📄 Factures Proforma</h2>
              <div class="relative w-64">
                <input v-model="searchProforma" type="text" placeholder="Rechercher..." @input="handleSearchProforma" class="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <svg class="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">N°</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Échéance</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant TTC</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="invoice in proformas" :key="invoice.id" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ invoice.number }}</td>
                    <td class="px-6 py-4 text-gray-700">{{ invoice.customer }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.date }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.dueDate }}</td>
                    <td class="px-6 py-4 font-bold text-gray-900">{{ formatPrice(invoice.amount) }} FCFA</td>
                    <td class="px-6 py-4">
                      <span :class="invoice.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                        {{ invoice.paid ? 'Payée' : 'Impayée' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 space-x-3">
                      <button @click="viewInvoice(invoice.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                      <button @click="editInvoice(invoice)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                      <button @click="deleteInvoice(invoice.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                      <button @click="downloadInvoicePdf(invoice)" class="text-emerald-600 hover:text-emerald-800 font-medium">PDF</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- FACTURES SIMPLES -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
              <h2 class="text-lg font-bold text-emerald-700">💰 Factures simples</h2>
              <div class="relative w-64">
                <input v-model="searchSimple" type="text" placeholder="Rechercher..." @input="handleSearchSimple" class="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <svg class="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">N°</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Échéance</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant TTC</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="invoice in simples" :key="invoice.id" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ invoice.number }}</td>
                    <td class="px-6 py-4 text-gray-700">{{ invoice.customer }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.date }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.dueDate }}</td>
                    <td class="px-6 py-4 font-bold text-gray-900">{{ formatPrice(invoice.amount) }} FCFA</td>
                    <td class="px-6 py-4">
                      <span :class="invoice.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                        {{ invoice.paid ? 'Payée' : 'Impayée' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 space-x-3">
                      <button @click="viewInvoice(invoice.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                      <button @click="editInvoice(invoice)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                      <button @click="deleteInvoice(invoice.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                      <button @click="downloadInvoicePdf(invoice)" class="text-emerald-600 hover:text-emerald-800 font-medium">PDF</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- FACTURES AVEC LIVRAISON -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
              <h2 class="text-lg font-bold text-orange-700">🚚 Factures avec livraison</h2>
              <div class="relative w-64">
                <input v-model="searchDelivery" type="text" placeholder="Rechercher..." @input="handleSearchDelivery" class="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <svg class="absolute left-2 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">N°</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Échéance</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant TTC</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Frais livraison</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="invoice in deliveries" :key="invoice.id" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ invoice.number }}</td>
                    <td class="px-6 py-4 text-gray-700">{{ invoice.customer }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.date }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.dueDate }}</td>
                    <td class="px-6 py-4 font-bold text-gray-900">{{ formatPrice(invoice.amount) }} FCFA</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ formatPrice(invoice.deliveryFee || 0) }} FCFA</td>
                    <td class="px-6 py-4">
                      <span :class="invoice.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                        {{ invoice.paid ? 'Payée' : 'Impayée' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 space-x-3">
                      <button @click="viewInvoice(invoice.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                      <button @click="editInvoice(invoice)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                      <button @click="deleteInvoice(invoice.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                      <button @click="downloadInvoicePdf(invoice)" class="text-emerald-600 hover:text-emerald-800 font-medium">PDF</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal formulaire (structure IDENTIQUE à l'original) -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingInvoice ? 'Modifier la facture' : 'Nouvelle facture' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveInvoice">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Type de facture *</label><select v-model="form.type" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"><option value="Proforma">Proforma</option><option value="Facture simple">Facture simple</option><option value="Facture avec livraison">Facture avec livraison</option></select></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Client *</label><select v-model="form.customerId" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"><option value="">Sélectionner un client</option><option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Date d'émission *</label><input v-model="form.issueDate" type="date" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance *</label><input v-model="form.dueDate" type="date" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea v-model="form.description" required rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500"></textarea></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Quantité *</label><input v-model="form.quantity" type="number" min="1" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Prix unitaire HT (FCFA) *</label><input v-model="form.unitPrice" type="number" step="1" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">TVA (%) *</label><input v-model="form.vatRate" type="number" step="0.01" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Remise (%)</label><input v-model="form.discount" type="number" step="0.01" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Frais de déplacement (FCFA)</label><input v-model="form.travelFee" type="number" step="1" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div v-if="form.type === 'Facture avec livraison'"><label class="block text-sm font-medium text-gray-700 mb-1">Frais de livraison (FCFA)</label><input v-model="form.deliveryFee" type="number" step="1" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500" @input="updateTotals"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Montant HT</label><input :value="formatPrice(totalHT)" readonly class="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Montant TTC</label><input :value="formatPrice(totalTTC)" readonly class="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 font-bold text-sky-700"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Statut paiement</label><select v-model="form.paymentStatus" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="En attente">En attente</option><option value="Payée">Payée</option><option value="Impayée">Impayée</option></select></div>

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
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50">
                    {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== FICHE FACTURE DÉTAILLÉE ==================== -->
      <div v-else-if="selectedInvoice" class="space-y-6">
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start flex-wrap gap-4">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="openSignatureDetailModal('customer')" class="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition text-sm">✍️ Signatures</button>
                <button @click="downloadInvoicePdf(selectedInvoice)" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">📄 PDF</button>
                <button v-if="!selectedInvoice.paid" @click="markAsPaid" class="px-3 py-1.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition text-sm">💰 Marquer payée</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ selectedInvoice.number }}</h1>
              <p class="text-gray-600 mt-1">Client: {{ selectedInvoice.customer }}</p>
              <p class="text-gray-500 text-sm mt-0.5">Type: {{ selectedInvoice.type }} • Date: {{ selectedInvoice.date }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📋 Informations générales</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Numéro</span><span class="font-medium text-gray-800">{{ selectedInvoice.number }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Client</span><span class="font-medium text-gray-800">{{ selectedInvoice.customer }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Type</span><span class="font-medium text-gray-800">{{ selectedInvoice.type }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Date d'émission</span><span class="font-medium text-gray-800">{{ selectedInvoice.date }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Date d'échéance</span><span class="font-medium text-gray-800">{{ selectedInvoice.dueDate }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Statut paiement</span><span :class="selectedInvoice.paid ? 'text-emerald-600' : 'text-red-500'" class="font-semibold">{{ selectedInvoice.paid ? 'Payée' : 'Impayée' }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">💰 Détails financiers</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Description</span><span class="font-medium text-gray-800">{{ selectedInvoice.description }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Quantité</span><span class="font-medium text-gray-800">{{ selectedInvoice.quantity }}</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Prix unitaire HT</span><span class="font-medium text-gray-800">{{ formatPrice(selectedInvoice.unitPrice) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Montant HT</span><span class="font-medium text-gray-800">{{ formatPrice(selectedInvoice.amountHT) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">TVA</span><span class="font-medium text-gray-800">{{ selectedInvoice.vatRate }}%</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Montant TTC</span><span class="font-bold text-sky-700">{{ formatPrice(selectedInvoice.amount) }} FCFA</span></div>
              <div v-if="selectedInvoice.travelFee" class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Frais déplacement</span><span class="font-medium text-gray-800">{{ formatPrice(selectedInvoice.travelFee) }} FCFA</span></div>
              <div v-if="selectedInvoice.deliveryFee" class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Frais livraison</span><span class="font-medium text-gray-800">{{ formatPrice(selectedInvoice.deliveryFee) }} FCFA</span></div>
            </div>
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
                <div class="border border-gray-200 rounded-lg h-24 bg-gray-50"><img v-if="selectedInvoice.customerSignature" :src="selectedInvoice.customerSignature" class="h-24 w-full object-contain"><p v-else class="text-gray-400 text-center pt-8">Non signé</p></div>
              </div>
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="font-medium text-gray-700 mb-2">Signature intervenant</p>
                <div class="border border-gray-200 rounded-lg h-24 bg-gray-50"><img v-if="selectedInvoice.technicianSignature" :src="selectedInvoice.technicianSignature" class="h-24 w-full object-contain"><p v-else class="text-gray-400 text-center pt-8">Non signé</p></div>
              </div>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

const formatPrice = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))

// États
const globalSearch = ref("")
const searchProforma = ref("")
const searchSimple = ref("")
const searchDelivery = ref("")
const selectedInvoice = ref(null)
const invoices = ref([])
const customers = ref([])
const loading = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)

const showModal = ref(false)
const editingInvoice = ref(null)
const form = ref({
  type: "Facture simple",
  customerId: "",
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  vatRate: 18,
  discount: 0,
  travelFee: 0,
  deliveryFee: 0,
  paymentStatus: "En attente",
  customerSignature: null,
  technicianSignature: null
})

const showSignatureModal = ref(false)
const signatureType = ref('customer')
const signatureCanvas = ref(null)
let isDrawing = false, lastX = 0, lastY = 0, pendingSignatureTarget = null

// Computed
const proformas = computed(() => {
  let result = invoices.value.filter(i => i.type === 'Proforma')
  if (globalSearch.value || searchProforma.value) {
    const search = (globalSearch.value || searchProforma.value).toLowerCase()
    result = result.filter(i => i.number.toLowerCase().includes(search) || i.customer.toLowerCase().includes(search))
  }
  return result
})

const simples = computed(() => {
  let result = invoices.value.filter(i => i.type === 'Facture simple')
  if (globalSearch.value || searchSimple.value) {
    const search = (globalSearch.value || searchSimple.value).toLowerCase()
    result = result.filter(i => i.number.toLowerCase().includes(search) || i.customer.toLowerCase().includes(search))
  }
  return result
})

const deliveries = computed(() => {
  let result = invoices.value.filter(i => i.type === 'Facture avec livraison')
  if (globalSearch.value || searchDelivery.value) {
    const search = (globalSearch.value || searchDelivery.value).toLowerCase()
    result = result.filter(i => i.number.toLowerCase().includes(search) || i.customer.toLowerCase().includes(search))
  }
  return result
})

const totalHT = computed(() => {
  let total = (form.value.quantity || 0) * (form.value.unitPrice || 0)
  if (form.value.discount) total = total * (1 - form.value.discount / 100)
  total += parseFloat(form.value.travelFee) || 0
  if (form.value.type === "Facture avec livraison") total += parseFloat(form.value.deliveryFee) || 0
  return total
})

const totalTTC = computed(() => {
  return totalHT.value * (1 + (form.value.vatRate || 0) / 100)
})

const updateTotals = () => { form.value = { ...form.value } }

// API Functions
const fetchInvoices = async () => {
  loading.value = true
  try {
    const response = await api.get('/invoices')
    invoices.value = response.data.data || []
  } catch (error) { console.error(error); alert("Erreur lors du chargement") }
  finally { loading.value = false }
}

const fetchCustomersList = async () => {
  try { const response = await api.get('/invoices/customers/list'); customers.value = response.data.data || [] }
  catch (error) { console.error(error) }
}

const fetchInvoiceDetail = async (id) => {
  loadingDetail.value = true
  try { const response = await api.get(`/invoices/${id}`); selectedInvoice.value = response.data.data }
  catch (error) { console.error(error); alert("Erreur lors du chargement des détails") }
  finally { loadingDetail.value = false }
}

const saveInvoice = async () => {
  if (!form.value.customerId) { alert("Veuillez sélectionner un client"); return }
  if (!form.value.description) { alert("Veuillez saisir une description"); return }

  saving.value = true
  try {
    const data = {
      type: form.value.type,
      customerId: parseInt(form.value.customerId),
      issueDate: form.value.issueDate,
      dueDate: form.value.dueDate,
      description: form.value.description,
      quantity: parseInt(form.value.quantity),
      unitPrice: parseFloat(form.value.unitPrice),
      vatRate: parseFloat(form.value.vatRate),
      discount: parseFloat(form.value.discount) || 0,
      travelFee: parseFloat(form.value.travelFee) || 0,
      deliveryFee: parseFloat(form.value.deliveryFee) || 0,
      paymentStatus: form.value.paymentStatus,
      customerSignature: form.value.customerSignature,
      technicianSignature: form.value.technicianSignature,
    }

    let response
    if (editingInvoice.value) response = await api.put(`/invoices/${editingInvoice.value.id}`, data)
    else response = await api.post('/invoices', data)

    if (response.data.success) {
      alert(response.data.message || 'Facture enregistrée')
      await fetchInvoices()
      closeForm()
      if (selectedInvoice.value && editingInvoice.value) await fetchInvoiceDetail(selectedInvoice.value.id)
    }
  } catch (error) {
    console.error(error)
    if (error.response?.data?.errors) alert(Object.values(error.response.data.errors).flat().join('\n'))
    else alert("Erreur lors de l'enregistrement")
  } finally { saving.value = false }
}

const deleteInvoice = async (id) => {
  if (!confirm("Supprimer cette facture ?")) return
  try { await api.delete(`/invoices/${id}`); alert("Facture supprimée"); await fetchInvoices(); if (selectedInvoice.value?.id === id) selectedInvoice.value = null }
  catch (error) { console.error(error); alert("Erreur lors de la suppression") }
}

const markAsPaid = async () => {
  if (selectedInvoice.value) {
    try {
      await api.post(`/invoices/${selectedInvoice.value.id}/mark-as-paid`)
      selectedInvoice.value.paid = true
      alert("Facture marquée comme payée")
      await fetchInvoices()
    } catch (error) { console.error(error); alert("Erreur lors du paiement") }
  }
}

// PDF Function
const downloadInvoicePdf = (invoice) => {
  const printWindow = window.open('', '_blank')
  const formatPricePDF = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
  const signatureHtml = (signatureBase64) => {
    if (signatureBase64) return `<img src="${signatureBase64}" style="max-height: 80px; max-width: 200px; border: 1px solid #ddd; padding: 5px;">`
    return `<p style="color: #999; font-style: italic;">Non signé</p>`
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>Facture ${invoice.number}</title><meta charset="UTF-8">
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
      <div class="title"><h2>${invoice.type.toUpperCase()}</h2><p>N°: ${invoice.number} | Date: ${invoice.date}</p></div>
      <div class="section"><div class="section-title">📋 Informations</div><div class="info-row"><span class="info-label">Client :</span><span class="info-value">${invoice.customer}</span></div><div class="info-row"><span class="info-label">Date d'échéance :</span><span class="info-value">${invoice.dueDate}</span></div></div>
      <div class="section"><div class="section-title">📦 Détails</div><table><thead><tr><th>Description</th><th>Qté</th><th>Prix HT (FCFA)</th><th>Total HT (FCFA)</th></tr></thead><tbody><tr><td>${invoice.description}</td><td>${invoice.quantity}</td><td>${formatPricePDF(invoice.unitPrice)}</td><td>${formatPricePDF(invoice.amountHT)}</td></tr></tbody></table></div>
      <div class="section"><div class="section-title">💰 Récapitulatif financier</div><div class="info-row"><span class="info-label">Total HT :</span><span class="info-value">${formatPricePDF(invoice.amountHT)} FCFA</span></div><div class="info-row"><span class="info-label">TVA (${invoice.vatRate}%) :</span><span class="info-value">${formatPricePDF((invoice.amountHT * invoice.vatRate) / 100)} FCFA</span></div>${invoice.travelFee ? `<div class="info-row"><span class="info-label">Frais déplacement :</span><span class="info-value">${formatPricePDF(invoice.travelFee)} FCFA</span></div>` : ''}${invoice.deliveryFee ? `<div class="info-row"><span class="info-label">Frais livraison :</span><span class="info-value">${formatPricePDF(invoice.deliveryFee)} FCFA</span></div>` : ''}<div class="info-row"><span class="info-label"><strong>Total TTC :</strong></span><span class="info-value"><strong>${formatPricePDF(invoice.amount)} FCFA</strong></span></div></div>
      <div class="section"><div class="section-title">✍️ Signatures</div><div class="signature-box"><div class="signature-item"><p>Signature client</p>${signatureHtml(invoice.customerSignature)}</div><div class="signature-item"><p>Signature intervenant</p>${signatureHtml(invoice.technicianSignature)}</div></div></div>
      <div class="footer"><p>Document généré automatiquement par Neo Start Tech - ${new Date().toLocaleString()}</p></div>
    </body>
    </html>
  `
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

// UI Functions
const handleGlobalSearch = () => { }
const handleSearchProforma = () => { }
const handleSearchSimple = () => { }
const handleSearchDelivery = () => { }

const openForm = () => {
  editingInvoice.value = null
  form.value = { type: "Facture simple", customerId: "", issueDate: new Date().toISOString().split('T')[0], dueDate: "", description: "", quantity: 1, unitPrice: 0, vatRate: 18, discount: 0, travelFee: 0, deliveryFee: 0, paymentStatus: "En attente", customerSignature: null, technicianSignature: null }
  showModal.value = true
}

const editInvoice = (invoice) => {
  editingInvoice.value = invoice
  form.value = {
    type: invoice.type,
    customerId: invoice.customerId,
    issueDate: invoice.date,
    dueDate: invoice.dueDate,
    description: invoice.description,
    quantity: invoice.quantity,
    unitPrice: invoice.unitPrice,
    vatRate: invoice.vatRate,
    discount: invoice.discount || 0,
    travelFee: invoice.travelFee || 0,
    deliveryFee: invoice.deliveryFee || 0,
    paymentStatus: invoice.paid ? "Payée" : "En attente",
    customerSignature: invoice.customerSignature || null,
    technicianSignature: invoice.technicianSignature || null
  }
  showModal.value = true
}

const closeForm = () => { showModal.value = false; editingInvoice.value = null }
const viewInvoice = async (id) => { await fetchInvoiceDetail(id) }
const goBackToList = () => { selectedInvoice.value = null; fetchInvoices() }

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
  } else if (pendingSignatureTarget === 'detail' && selectedInvoice.value) {
    if (signatureType.value === 'customer') selectedInvoice.value.customerSignature = signatureDataUrl
    else selectedInvoice.value.technicianSignature = signatureDataUrl
  }
  showSignatureModal.value = false
}

onMounted(() => { fetchInvoices(); fetchCustomersList() })
</script>