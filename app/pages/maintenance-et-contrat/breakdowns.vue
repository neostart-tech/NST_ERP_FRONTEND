<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES PANNES ==================== -->
      <div v-if="!selectedBreakdown">
        <!-- Header dégradé sky -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">🔧 Gestion des pannes</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez toutes les interventions</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouveau signalement
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
                placeholder="Rechercher une panne..." 
                @input="handleSearch"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select v-model="filters.status" @change="applyFilters" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white min-w-[180px]">
              <option value="">Tous les statuts</option>
              <option value="reported">Signalé</option>
              <option value="diagnostic">Diagnostic</option>
              <option value="quote_sent">Devis envoyé</option>
              <option value="validated">Validé</option>
              <option value="repairing">En réparation</option>
              <option value="delivered">Livré</option>
              <option value="invoiced">Facturé</option>
              <option value="closed">Clôturé</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement des pannes...</p>
        </div>

        <!-- Tableau des pannes -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Équipement</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Technicien</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(breakdown, index) in breakdowns" :key="breakdown.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ breakdown.customer }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ breakdown.equipment }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ breakdown.reportDate }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ breakdown.technician || '-' }}</td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(breakdown.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ breakdown.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-700">{{ formatPrice(breakdown.totalAmount || 0) }} FCFA</td>
                  <td class="px-6 py-4 space-x-3">
                    <button @click="viewBreakdown(breakdown.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                    <button @click="editBreakdown(breakdown)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                    <button @click="deleteBreakdown(breakdown.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                    <button @click="downloadFullPdf(breakdown)" class="text-emerald-600 hover:text-emerald-800 font-medium">PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ breakdowns.length }} sur {{ pagination.total }} pannes
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

        <!-- Modal formulaire panne -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingBreakdown ? 'Modifier la panne' : 'Nouveau signalement' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveBreakdown">
                <!-- Client & Equipment -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">📋 Client & équipement</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Client *</label><select v-model="form.customerId" @change="onCustomerChange" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-sky-500"><option value="">Sélectionner un client</option><option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option></select></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Équipement *</label><select v-model="form.equipmentId" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-sky-500"><option value="">Sélectionner un équipement</option><option v-for="e in equipmentList" :key="e.id" :value="e.id">{{ e.brand }} {{ e.model }} - {{ e.serial_number }}</option></select></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Lieu d'intervention</label><select v-model="form.location" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="Chez client">Chez client</option><option value="En interne">En interne</option></select></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Poste numéro</label><input v-model="form.stationNumber" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                  </div>
                </div>

                <!-- Signalement client -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">📞 Signalement client</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Date appel *</label><input v-model="form.callDate" type="date" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Heure appel *</label><input v-model="form.callTime" type="time" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                    <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Défauts signalés *</label><textarea v-model="form.reportedIssues" required rows="3" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></textarea></div>
                  </div>
                </div>

                <!-- Technicien -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">👨‍🔧 Technicien assigné</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Technicien</label><select v-model="form.technicianId" @change="onTechnicianChange" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="">Sélectionner un technicien</option><option v-for="t in technicians" :key="t.id" :value="t.id">{{ t.name }} - {{ t.specialty }}</option></select></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Email du technicien</label><input v-model="form.technicianEmail" type="email" readonly class="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50"></div>
                  </div>
                </div>

                <!-- Diagnostic -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">🔧 Diagnostic technicien</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Date début</label><input v-model="form.startDate" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Heure début</label><input v-model="form.startTime" type="time" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                    <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Défauts constatés</label><textarea v-model="form.observedIssues" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></textarea></div>
                    <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Tâches effectuées</label><textarea v-model="form.tasksPerformed" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></textarea></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Date fin</label><input v-model="form.endDate" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Heure fin</label><input v-model="form.endTime" type="time" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"></div>
                  </div>
                </div>

                <!-- Frais -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">💰 Frais</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Frais déplacement (FCFA)</label><input v-model="form.travelFee" type="number" class="w-full border border-gray-200 rounded-xl px-3 py-2.5" @input="updateTotalAmount"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Livraison souhaitée</label><select v-model="form.deliveryRequested" class="w-full border border-gray-200 rounded-xl px-3 py-2.5" @change="updateTotalAmount"><option value="Non">Non</option><option value="Oui">Oui</option></select></div>
                    <div v-if="form.deliveryRequested === 'Oui'"><label class="block text-sm font-medium text-gray-700 mb-1">Frais livraison (FCFA)</label><input v-model="form.deliveryFee" type="number" class="w-full border border-gray-200 rounded-xl px-3 py-2.5" @input="updateTotalAmount"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Montant total</label><input :value="formatPrice(totalAmount)" readonly class="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50"></div>
                  </div>
                </div>

                <!-- Paiement -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">💳 Paiement</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label><select v-model="form.paymentMethod" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="Yas">Yas</option><option value="Moov Money">Moov Money</option><option value="PayPal">PayPal</option><option value="Orabank">Orabank</option><option value="Ecobank">Ecobank</option><option value="Carte">Carte</option><option value="Espèces">Espèces</option></select></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Statut paiement</label><select v-model="form.paymentStatus" class="w-full border border-gray-200 rounded-xl px-3 py-2.5"><option value="En attente">En attente</option><option value="Payé">Payé</option><option value="Impayé">Impayé</option></select></div>
                  </div>
                </div>

                <!-- Signatures -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">✍️ Signatures</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Signature client</label>
                      <div v-if="form.customerSignature" class="mb-2"><img :src="form.customerSignature" class="border border-gray-200 rounded-lg h-16 w-full object-contain bg-gray-50"></div>
                      <button type="button" @click="openSignatureModal('customer')" class="text-sky-600 text-sm font-medium hover:underline">Signer</button>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Signature intervenant</label>
                      <div v-if="form.technicianSignature" class="mb-2"><img :src="form.technicianSignature" class="border border-gray-200 rounded-lg h-16 w-full object-contain bg-gray-50"></div>
                      <button type="button" @click="openSignatureModal('technician')" class="text-sky-600 text-sm font-medium hover:underline">Signer</button>
                    </div>
                  </div>
                </div>

                <!-- Statut -->
                <div class="mb-6">
                  <h3 class="font-semibold text-md text-sky-700 mb-3 pb-2 border-b border-gray-200">📌 Statut</h3>
                  <select v-model="form.ticketStatus" class="w-full border border-gray-200 rounded-xl px-3 py-2.5">
                    <option value="Signalé">Signalé</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Devis envoyé">Devis envoyé</option>
                    <option value="Validé">Validé</option>
                    <option value="En réparation">En réparation</option>
                    <option value="Livré">Livré</option>
                    <option value="Facturé">Facturé</option>
                    <option value="Clôturé">Clôturé</option>
                  </select>
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

      <!-- ==================== FICHE DÉTAILLÉE ==================== -->
      <div v-else-if="selectedBreakdown" class="space-y-6">
        <!-- Loading détail -->
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <!-- En-tête panne -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start flex-wrap gap-4">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="downloadFullPdf(selectedBreakdown)" class="px-3 py-1.5 bg-white text-sky-700 rounded-lg font-medium hover:bg-sky-50 transition text-sm">📄 Télécharger PDF</button>
                <button @click="changeStatus" class="px-3 py-1.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition text-sm">🔄 Changer statut</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Panne #{{ selectedBreakdown.id }}</h1>
              <p class="text-gray-600 mt-1">Client: {{ selectedBreakdown.customer }} • Équipement: {{ selectedBreakdown.equipment }}</p>
              <p class="text-gray-500 text-sm mt-0.5">Signalée le {{ selectedBreakdown.reportDate }} • Statut: <span :class="getStatusClass(selectedBreakdown.status)">{{ selectedBreakdown.status }}</span></p>
            </div>
          </div>
        </div>

        <!-- Grille des informations -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📞 Signalement client</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Date/heure appel</span><span class="font-medium text-gray-800">{{ selectedBreakdown.callDate }} {{ selectedBreakdown.callTime }}</span></div>
              <div><span class="text-gray-500">Défauts signalés</span><p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedBreakdown.reportedIssues }}</p></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">🔧 Diagnostic</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Technicien</span><span class="font-medium text-gray-800">{{ selectedBreakdown.technician || 'Non assigné' }}</span></div>
              <div><span class="text-gray-500">Défauts constatés</span><p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedBreakdown.observedIssues || 'Non spécifié' }}</p></div>
              <div><span class="text-gray-500">Tâches effectuées</span><p class="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedBreakdown.tasksPerformed || 'Non spécifié' }}</p></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">💰 Frais et paiement</h2>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Frais déplacement</span><span class="font-medium text-gray-800">{{ formatPrice(selectedBreakdown.travelFee || 0) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Frais livraison</span><span class="font-medium text-gray-800">{{ formatPrice(selectedBreakdown.deliveryFee || 0) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Montant total</span><span class="font-bold text-gray-900">{{ formatPrice(selectedBreakdown.totalAmount || 0) }} FCFA</span></div>
              <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-gray-500">Statut paiement</span><span :class="selectedBreakdown.paymentStatus === 'Payé' ? 'text-emerald-600' : 'text-red-500'" class="font-semibold">{{ selectedBreakdown.paymentStatus || 'En attente' }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">✍️ Signatures</h2>
            </div>
            <div class="p-6 space-y-4">
              <div><p class="font-medium text-gray-700 mb-2">Signature client</p><div class="border border-gray-200 rounded-lg h-24"><img v-if="selectedBreakdown.customerSignature" :src="selectedBreakdown.customerSignature" class="h-24 w-full object-contain"><p v-else class="text-gray-400 text-center pt-8">Non signé</p></div></div>
              <div><p class="font-medium text-gray-700 mb-2">Signature intervenant</p><div class="border border-gray-200 rounded-lg h-24"><img v-if="selectedBreakdown.technicianSignature" :src="selectedBreakdown.technicianSignature" class="h-24 w-full object-contain"><p v-else class="text-gray-400 text-center pt-8">Non signé</p></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== MODALS ==================== -->
      
      <!-- Modal signature -->
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

      <!-- Modal changement statut -->
      <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showStatusModal = false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Changer le statut</h3>
          <select v-model="newStatus" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-4 focus:ring-sky-500">
            <option value="Signalé">Signalé</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Devis envoyé">Devis envoyé</option>
            <option value="Validé">Validé</option>
            <option value="En réparation">En réparation</option>
            <option value="Livré">Livré</option>
            <option value="Facturé">Facturé</option>
            <option value="Clôturé">Clôturé</option>
          </select>
          <div class="flex justify-end gap-3">
            <button @click="showStatusModal = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Annuler</button>
            <button @click="confirmStatusChange" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Valider</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

const formatPrice = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))

const getStatusClass = (status) => {
  const classes = { 
    'Signalé': 'bg-gray-100 text-gray-700',
    'Diagnostic': 'bg-yellow-100 text-yellow-700',
    'Devis envoyé': 'bg-blue-100 text-blue-700',
    'Validé': 'bg-emerald-100 text-emerald-700',
    'En réparation': 'bg-orange-100 text-orange-700',
    'Livré': 'bg-purple-100 text-purple-700',
    'Facturé': 'bg-indigo-100 text-indigo-700',
    'Clôturé': 'bg-emerald-100 text-emerald-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// États
const searchQuery = ref("")
const filters = ref({ status: "" })
const selectedBreakdown = ref(null)
const breakdowns = ref([])
const customers = ref([])
const technicians = ref([])
const equipmentList = ref([])
const loading = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)

const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 15 })

const showModal = ref(false)
const editingBreakdown = ref(null)
const form = ref({
  customerId: "", equipmentId: "", location: "Chez client", stationNumber: "",
  callDate: new Date().toISOString().split('T')[0], callTime: "09:00", reportedIssues: "",
  technicianId: "", technicianEmail: "",
  startDate: "", startTime: "", observedIssues: "", tasksPerformed: "", endDate: "", endTime: "",
  travelFee: 0, deliveryRequested: "Non", deliveryFee: 0, paymentMethod: "Espèces", paymentStatus: "En attente",
  ticketStatus: "Signalé", customerSignature: null, technicianSignature: null
})

const showSignatureModal = ref(false)
const signatureType = ref('customer')
const signatureCanvas = ref(null)
let isDrawing = false, lastX = 0, lastY = 0, pendingSignatureTarget = null

const showStatusModal = ref(false)
const newStatus = ref("")

let searchTimeout = null

const totalAmount = computed(() => {
  let total = parseFloat(form.value.travelFee) || 0
  if (form.value.deliveryRequested === "Oui") total += parseFloat(form.value.deliveryFee) || 0
  return total
})

const updateTotalAmount = () => { form.value = { ...form.value } }

const onTechnicianChange = () => {
  const selectedTech = technicians.value.find(t => t.id === parseInt(form.value.technicianId))
  form.value.technicianEmail = selectedTech?.email || ""
}

// API Functions
const fetchBreakdowns = async () => {
  loading.value = true
  try {
    const response = await api.get('/breakdowns', { params: { search: searchQuery.value, status: filters.value.status, per_page: pagination.value.per_page, page: pagination.value.current_page } })
    breakdowns.value = response.data.data || []
    pagination.value = response.data.meta || { current_page: 1, last_page: 1, total: 0, per_page: 15 }
  } catch (error) { console.error(error); alert("Erreur lors du chargement") }
  finally { loading.value = false }
}

const fetchCustomersList = async () => {
  try { const response = await api.get('/breakdowns/customers/list'); customers.value = response.data.data || [] }
  catch (error) { console.error(error) }
}

const fetchTechniciansList = async () => {
  try { const response = await api.get('/breakdowns/technicians/list'); technicians.value = response.data.data || [] }
  catch (error) { console.error(error) }
}

const fetchEquipmentByCustomer = async (customerId) => {
  if (!customerId) { equipmentList.value = []; return }
  try { const response = await api.get(`/breakdowns/equipment/by-customer/${customerId}`); equipmentList.value = response.data.data || [] }
  catch (error) { console.error(error); equipmentList.value = [] }
}

const fetchBreakdownDetail = async (id) => {
  loadingDetail.value = true
  try { const response = await api.get(`/breakdowns/${id}`); selectedBreakdown.value = response.data.data }
  catch (error) { console.error(error); alert("Erreur lors du chargement des détails") }
  finally { loadingDetail.value = false }
}

const saveBreakdown = async () => {
  if (!form.value.customerId) { alert("Veuillez sélectionner un client"); return }
  if (!form.value.equipmentId) { alert("Veuillez sélectionner un équipement"); return }
  if (!form.value.reportedIssues) { alert("Veuillez décrire les défauts signalés"); return }

  saving.value = true
  try {
    const data = {
      customerId: parseInt(form.value.customerId),
      equipmentId: parseInt(form.value.equipmentId),
      technicianId: form.value.technicianId ? parseInt(form.value.technicianId) : null,
      technicianEmail: form.value.technicianEmail,
      callDate: form.value.callDate,
      callTime: form.value.callTime,
      reportedIssues: form.value.reportedIssues,
      location: form.value.location,
      stationNumber: form.value.stationNumber,
      startDate: form.value.startDate,
      startTime: form.value.startTime,
      observedIssues: form.value.observedIssues,
      tasksPerformed: form.value.tasksPerformed,
      endDate: form.value.endDate,
      endTime: form.value.endTime,
      travelFee: parseFloat(form.value.travelFee) || 0,
      deliveryRequested: form.value.deliveryRequested,
      deliveryFee: parseFloat(form.value.deliveryFee) || 0,
      paymentMethod: form.value.paymentMethod,
      paymentStatus: form.value.paymentStatus,
      ticketStatus: form.value.ticketStatus,
      customerSignature: form.value.customerSignature,
      technicianSignature: form.value.technicianSignature,
    }

    let response
    if (editingBreakdown.value) {
      response = await api.put(`/breakdowns/${editingBreakdown.value.id}`, data)
    } else {
      response = await api.post('/breakdowns', data)
    }

    if (response.data.success) {
      alert(response.data.message || 'Panne enregistrée')
      await fetchBreakdowns()
      closeForm()
      if (selectedBreakdown.value && editingBreakdown.value) await fetchBreakdownDetail(selectedBreakdown.value.id)
    }
  } catch (error) {
    console.error(error)
    if (error.response?.data?.errors) alert(Object.values(error.response.data.errors).flat().join('\n'))
    else alert("Erreur lors de l'enregistrement")
  } finally { saving.value = false }
}

const deleteBreakdown = async (id) => {
  if (!confirm("Supprimer cette panne ?")) return
  loading.value = true
  try { await api.delete(`/breakdowns/${id}`); alert("Panne supprimée"); await fetchBreakdowns(); if (selectedBreakdown.value?.id === id) selectedBreakdown.value = null }
  catch (error) { console.error(error); alert("Erreur lors de la suppression") }
  finally { loading.value = false }
}

// PDF complet
const downloadFullPdf = (breakdown) => {
  const printWindow = window.open('', '_blank')
  
  const formatPricePDF = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
  
  const signatureHtml = (signatureBase64, name) => {
    if (signatureBase64) {
      return `<img src="${signatureBase64}" style="max-height: 80px; max-width: 200px; border: 1px solid #ddd; padding: 5px;">`
    }
    return `<p style="color: #999; font-style: italic;">Non signé</p>`
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>Fiche intervention #${breakdown.id}</title><meta charset="UTF-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; margin: 40px; background: white; }
      .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #0284c7; margin: 0; }
      .header p { margin: 5px 0; color: #666; }
      .title { text-align: center; margin-bottom: 30px; }
      .title h2 { margin: 0; }
      .section { margin-bottom: 25px; }
      .section-title { color: #0284c7; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .info-label { font-weight: bold; color: #555; width: 40%; }
      .info-value { width: 60%; }
      .signature-box { display: flex; justify-content: space-between; margin-top: 20px; }
      .signature-item { width: 45%; text-align: center; }
      .signature-item p { font-weight: bold; margin-bottom: 10px; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
    </style>
    </head>
    <body>
      <div class="header"><h1>NEO START TECH</h1><p>Service Maintenance</p><p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p><p>Tél: +228 90 42 20 20 | Email: contact@neostart.tech</p></div>
      <div class="title"><h2>FICHE D'INTERVENTION</h2><p>N°: ${breakdown.id} | Date: ${breakdown.reportDate || new Date().toLocaleDateString()}</p></div>
      <div class="section"><div class="section-title">📋 Client & équipement</div>
        <div class="info-row"><span class="info-label">Client :</span><span class="info-value">${breakdown.customer || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Équipement :</span><span class="info-value">${breakdown.equipment || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Lieu :</span><span class="info-value">${breakdown.location || 'Chez client'}</span></div>
        <div class="info-row"><span class="info-label">Poste n° :</span><span class="info-value">${breakdown.stationNumber || 'Non spécifié'}</span></div>
      </div>
      <div class="section"><div class="section-title">📞 Signalement client</div>
        <div class="info-row"><span class="info-label">Date/heure appel :</span><span class="info-value">${breakdown.callDate || ''} ${breakdown.callTime || ''}</span></div>
        <div class="info-row"><span class="info-label">Défauts signalés :</span><span class="info-value">${breakdown.reportedIssues || 'Non spécifié'}</span></div>
      </div>
      <div class="section"><div class="section-title">🔧 Diagnostic</div>
        <div class="info-row"><span class="info-label">Technicien :</span><span class="info-value">${breakdown.technician || 'Non assigné'}</span></div>
        <div class="info-row"><span class="info-label">Dates :</span><span class="info-value">${breakdown.startDate || 'N/A'} → ${breakdown.endDate || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Défauts constatés :</span><span class="info-value">${breakdown.observedIssues || 'Non spécifié'}</span></div>
        <div class="info-row"><span class="info-label">Tâches effectuées :</span><span class="info-value">${breakdown.tasksPerformed || 'Non spécifié'}</span></div>
      </div>
      <div class="section"><div class="section-title">💰 Frais et paiement</div>
        <div class="info-row"><span class="info-label">Frais déplacement :</span><span class="info-value">${formatPricePDF(breakdown.travelFee || 0)} FCFA</span></div>
        <div class="info-row"><span class="info-label">Frais livraison :</span><span class="info-value">${formatPricePDF(breakdown.deliveryFee || 0)} FCFA</span></div>
        <div class="info-row"><span class="info-label">Montant total :</span><span class="info-value"><strong>${formatPricePDF(breakdown.totalAmount || 0)} FCFA</strong></span></div>
        <div class="info-row"><span class="info-label">Statut paiement :</span><span class="info-value">${breakdown.paymentStatus || 'En attente'}</span></div>
      </div>
      <div class="section"><div class="section-title">✍️ Signatures</div>
        <div class="signature-box"><div class="signature-item"><p>Signature client</p>${signatureHtml(breakdown.customerSignature, 'client')}</div>
        <div class="signature-item"><p>Signature intervenant</p>${signatureHtml(breakdown.technicianSignature, 'intervenant')}</div></div>
      </div>
      <div class="footer"><p>Document généré automatiquement par Neo Start Tech - ${new Date().toLocaleString()}</p></div>
    </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

// UI Functions
const handleSearch = () => { if (searchTimeout) clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { pagination.value.current_page = 1; fetchBreakdowns() }, 500) }
const applyFilters = () => { pagination.value.current_page = 1; fetchBreakdowns() }
const changePage = (page) => { if (page < 1 || page > pagination.value.last_page) return; pagination.value.current_page = page; fetchBreakdowns() }
const onCustomerChange = () => { form.value.equipmentId = ""; fetchEquipmentByCustomer(form.value.customerId) }

const openForm = () => {
  editingBreakdown.value = null
  form.value = {
    customerId: "", equipmentId: "", location: "Chez client", stationNumber: "",
    callDate: new Date().toISOString().split('T')[0], callTime: "09:00", reportedIssues: "",
    technicianId: "", technicianEmail: "",
    startDate: "", startTime: "", observedIssues: "", tasksPerformed: "", endDate: "", endTime: "",
    travelFee: 0, deliveryRequested: "Non", deliveryFee: 0, paymentMethod: "Espèces", paymentStatus: "En attente",
    ticketStatus: "Signalé", customerSignature: null, technicianSignature: null
  }
  equipmentList.value = []
  showModal.value = true
}

const editBreakdown = (breakdown) => {
  editingBreakdown.value = breakdown
  form.value = {
    customerId: breakdown.customerId || "", equipmentId: breakdown.equipmentId || "", location: breakdown.location || "Chez client", stationNumber: breakdown.stationNumber || "",
    callDate: breakdown.callDate || breakdown.reportDate, callTime: breakdown.callTime || "09:00", reportedIssues: breakdown.reportedIssues || "",
    technicianId: breakdown.technicianId || "", technicianEmail: breakdown.technicianEmail || "",
    startDate: breakdown.startDate || "", startTime: breakdown.startTime || "", observedIssues: breakdown.observedIssues || "", tasksPerformed: breakdown.tasksPerformed || "",
    endDate: breakdown.endDate || "", endTime: breakdown.endTime || "",
    travelFee: breakdown.travelFee || 0, deliveryRequested: breakdown.deliveryRequested || "Non", deliveryFee: breakdown.deliveryFee || 0,
    paymentMethod: breakdown.paymentMethod || "Espèces", paymentStatus: breakdown.paymentStatus || "En attente",
    ticketStatus: breakdown.status || "Signalé", customerSignature: breakdown.customerSignature || null, technicianSignature: breakdown.technicianSignature || null
  }
  if (breakdown.customerId) fetchEquipmentByCustomer(breakdown.customerId)
  showModal.value = true
}

const closeForm = () => { showModal.value = false; editingBreakdown.value = null }
const viewBreakdown = async (id) => { await fetchBreakdownDetail(id) }
const goBackToList = () => { selectedBreakdown.value = null; fetchBreakdowns() }
const changeStatus = () => { newStatus.value = selectedBreakdown.value?.status || ""; showStatusModal.value = true }
const confirmStatusChange = async () => { if (selectedBreakdown.value) { try { await api.put(`/breakdowns/${selectedBreakdown.value.id}`, { ticketStatus: newStatus.value }); selectedBreakdown.value.status = newStatus.value; alert("Statut mis à jour") } catch (error) { console.error(error) } } showStatusModal.value = false }

// Signature functions
const openSignatureModal = (type, target = 'form') => { signatureType.value = type; pendingSignatureTarget = target; showSignatureModal.value = true; setTimeout(() => initCanvas(), 100) }
const initCanvas = () => {
  const canvas = signatureCanvas.value; if (!canvas) return
  const ctx = canvas.getContext('2d'); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw); canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing)
  canvas.addEventListener('touchstart', startDrawingTouch); canvas.addEventListener('touchmove', drawTouch); canvas.addEventListener('touchend', stopDrawing)
}
const startDrawing = (e) => { isDrawing = true; const rect = signatureCanvas.value.getBoundingClientRect(); lastX = e.clientX - rect.left; lastY = e.clientY - rect.top }
const draw = (e) => { if (!isDrawing) return; e.preventDefault(); const rect = signatureCanvas.value.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const ctx = signatureCanvas.value.getContext('2d'); ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke(); lastX = x; lastY = y }
const stopDrawing = () => { isDrawing = false }
const startDrawingTouch = (e) => { e.preventDefault(); isDrawing = true; const rect = signatureCanvas.value.getBoundingClientRect(); const touch = e.touches[0]; lastX = touch.clientX - rect.left; lastY = touch.clientY - rect.top }
const drawTouch = (e) => { if (!isDrawing) return; e.preventDefault(); const rect = signatureCanvas.value.getBoundingClientRect(); const touch = e.touches[0]; const x = touch.clientX - rect.left; const y = touch.clientY - rect.top; const ctx = signatureCanvas.value.getContext('2d'); ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke(); lastX = x; lastY = y }
const clearSignature = () => { const canvas = signatureCanvas.value; const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height) }
const validateSignature = () => {
  const canvas = signatureCanvas.value; const signatureDataUrl = canvas.toDataURL()
  if (pendingSignatureTarget === 'form') { if (signatureType.value === 'customer') form.value.customerSignature = signatureDataUrl; else form.value.technicianSignature = signatureDataUrl }
  else if (pendingSignatureTarget === 'detail' && selectedBreakdown.value) { if (signatureType.value === 'customer') selectedBreakdown.value.customerSignature = signatureDataUrl; else selectedBreakdown.value.technicianSignature = signatureDataUrl }
  showSignatureModal.value = false
}

onMounted(() => { fetchBreakdowns(); fetchCustomersList(); fetchTechniciansList() })
</script>