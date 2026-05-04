<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES CLIENTS ==================== -->
      <div v-if="!selectedCustomer">
        <!-- Header dégradé sky -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">Gestion des clients</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez tous vos clients</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouveau client
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre de recherche -->
        <div class="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div class="relative w-96">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un client..." 
              @input="handleSearch"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div class="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
            Total: {{ pagination.total }} clients
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12 bg-white rounded-xl shadow">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement des clients...</p>
        </div>

        <!-- Tableau clients -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Photo</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contrat actif</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(customer, index) in customers" :key="customer.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-6 py-4">
                    <img :src="getFullImageUrl(customer.photo)" class="w-10 h-10 rounded-full object-cover shadow-sm" @error="handleImageError">
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ customer.name }}</td>
                  <td class="px-6 py-4">
                    <span :class="customer.type === 'company' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ customer.type === 'individual' ? 'Particulier' : customer.type === 'company' ? 'Entreprise' : 'Association' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ customer.phone }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ customer.email }}</td>
                  <td class="px-6 py-4">
                    <span :class="customer.active_contract ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ customer.active_contract ? 'Oui' : 'Non' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 space-x-3">
                    <button @click="viewCustomer(customer.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                    <button @click="editCustomer(customer)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                    <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ customers.length }} sur {{ pagination.total }} clients
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

        <!-- Modal formulaire client -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingCustomer ? 'Modifier le client' : 'Nouveau client' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveCustomer">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label><input v-model="form.name" type="text" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Type *</label><select v-model="form.type" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"><option value="individual">Particulier</option><option value="company">Entreprise</option><option value="association">Association</option></select></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Email *</label><input v-model="form.email" type="email" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label><input v-model="form.phone" type="tel" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                    <input type="file" @change="handlePhotoUpload" accept="image/*" class="w-full border border-gray-300 rounded-xl px-3 py-2">
                    <div v-if="form.photoPreview" class="mt-2">
                      <img :src="form.photoPreview" class="w-16 h-16 rounded-full object-cover shadow">
                    </div>
                    <div v-else-if="form.existingPhoto" class="mt-2">
                      <img :src="getFullImageUrl(form.existingPhoto)" class="w-16 h-16 rounded-full object-cover shadow">
                    </div>
                  </div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">CNI / RCCM</label>
                    <input type="file" @change="handleCniUpload" accept="image/*,application/pdf" class="w-full border border-gray-300 rounded-xl px-3 py-2">
                    <div v-if="form.cni_rccm && typeof form.cni_rccm === 'string' && !(form.cni_rccm instanceof File)" class="mt-1 text-sm text-sky-600">Fichier actuel: {{ form.cni_rccm.split('/').pop() }}</div>
                  </div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Pays *</label><input v-model="form.country" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Ville *</label><input v-model="form.city" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Adresse *</label><textarea v-model="form.address" required rows="2" class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></textarea></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Note</label><textarea v-model="form.note" rows="2" class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></textarea></div>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                  <button type="button" @click="closeForm" class="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== FICHE CLIENT DÉTAILLÉE ==================== -->
      <div v-else-if="selectedCustomer" class="space-y-6">
        <!-- Loading détail -->
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <!-- En-tête client -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="exportCustomerPdf" class="px-3 py-1.5 bg-white text-sky-700 rounded-lg font-medium hover:bg-sky-50 transition text-sm">📄 Export PDF</button>
                <button @click="openEditForm" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">Modifier</button>
                <button @click="deleteCustomerFromDetail" class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm">Supprimer</button>
                <button v-if="selectedCustomer.cni_rccm" @click="openCniModal(selectedCustomer.cni_rccm)" class="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition text-sm">📄 Voir CNI</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="flex gap-5">
              <img :src="getFullImageUrl(selectedCustomer.photo)" class="w-20 h-20 rounded-full object-cover shadow-md border-2 border-sky-200" @error="handleImageError">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ selectedCustomer.name }}</h1>
                <p class="text-gray-500 mt-1">{{ selectedCustomer.type === 'individual' ? 'Particulier' : selectedCustomer.type === 'company' ? 'Entreprise' : 'Association' }} • {{ selectedCustomer.email }} • {{ selectedCustomer.phone }}</p>
                <p class="text-gray-400 text-sm mt-1">{{ selectedCustomer.address }}, {{ selectedCustomer.city }}, {{ selectedCustomer.country }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Grille des sections -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Équipements -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📦 Équipements</h2>
            </div>
            <div class="p-6">
              <div v-if="selectedCustomer.equipments && selectedCustomer.equipments.length" class="space-y-3">
                <div v-for="eq in selectedCustomer.equipments.slice(0, 3)" :key="eq.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div class="flex justify-between items-start">
                    <div><p class="font-semibold text-gray-900">{{ eq.brand }} {{ eq.model }}</p><p class="text-sm text-gray-500 mt-1">N° série: {{ eq.serial_number }}</p><p class="text-sm text-gray-500">Statut: {{ eq.status }}</p></div>
                    <button @click="viewEquipment(eq.id)" class="text-sky-600 text-sm font-medium hover:underline">Voir détail →</button>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-400 italic text-center py-4">Aucun équipement</p>
              <button v-if="selectedCustomer.equipments && selectedCustomer.equipments.length > 3" @click="openEquipmentModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">Voir plus ({{ selectedCustomer.equipments.length - 3 }} supplémentaires) →</button>
            </div>
          </div>

          <!-- Pannes -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">⚠️ Historique des pannes</h2>
            </div>
            <div class="p-6">
              <div v-if="selectedCustomer.breakdowns && selectedCustomer.breakdowns.length" class="space-y-3">
                <div v-for="bd in selectedCustomer.breakdowns.slice(0, 3)" :key="bd.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div class="flex justify-between items-start">
                    <div><p class="font-semibold text-gray-900">{{ bd.created_at?.split('T')[0] }} - {{ bd.equipment?.brand }} {{ bd.equipment?.model }}</p><p class="text-sm text-gray-500 mt-1">Technicien: {{ bd.technician?.full_name || 'Non assigné' }}</p><p class="text-sm text-gray-500">Défauts: {{ bd.reported_issues?.substring(0, 50) }}...</p></div>
                    <span :class="bd.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-1 rounded-full text-xs font-semibold">{{ bd.status === 'closed' ? 'Clôturé' : 'En cours' }}</span>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-400 italic text-center py-4">Aucune panne</p>
              <button v-if="selectedCustomer.breakdowns && selectedCustomer.breakdowns.length > 3" @click="openBreakdownModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">Voir plus ({{ selectedCustomer.breakdowns.length - 3 }} supplémentaires) →</button>
            </div>
          </div>

          <!-- Contrats -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📑 Contrats</h2>
            </div>
            <div class="p-6">
              <div v-if="selectedCustomer.contracts && selectedCustomer.contracts.length" class="space-y-3">
                <div v-for="contract in selectedCustomer.contracts.slice(0, 3)" :key="contract.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <p class="font-semibold text-gray-900">{{ contract.plan_type }} - {{ formatPrice(contract.recurring_amount) }} FCFA/{{ contract.frequency }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ contract.start_date }} → {{ contract.end_date }}</p>
                </div>
              </div>
              <p v-else class="text-gray-400 italic text-center py-4">Aucun contrat</p>
              <button v-if="selectedCustomer.contracts && selectedCustomer.contracts.length > 3" @click="openContractModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">Voir plus ({{ selectedCustomer.contracts.length - 3 }} supplémentaires) →</button>
            </div>
          </div>

          <!-- Factures -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">💰 Factures</h2>
            </div>
            <div class="p-6">
              <div v-if="selectedCustomer.invoices && selectedCustomer.invoices.length" class="space-y-3">
                <div v-for="inv in selectedCustomer.invoices.slice(0, 3)" :key="inv.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div class="flex justify-between items-start">
                    <div><p class="font-semibold text-gray-900">{{ inv.invoice_number }} - {{ inv.issue_date }}</p><p class="text-sm text-gray-500 mt-1">Statut: {{ inv.payment_status === 'paid' ? 'Payée' : 'Impayée' }}</p></div>
                    <span class="font-bold text-gray-900">{{ formatPrice(inv.total_amount) }} FCFA</span>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-400 italic text-center py-4">Aucune facture</p>
              <button v-if="selectedCustomer.invoices && selectedCustomer.invoices.length > 3" @click="openInvoiceModal" class="mt-4 text-sky-600 text-sm font-medium hover:underline">Voir plus ({{ selectedCustomer.invoices.length - 3 }} supplémentaires) →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== MODALS "VOIR PLUS" ==================== -->
      
      <!-- Modal Équipements -->
      <div v-if="showEquipmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showEquipmentModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Tous les équipements</h3>
            <div class="flex gap-2">
              <button @click="exportEquipmentsPdf" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">📄 Exporter PDF</button>
              <button @click="showEquipmentModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
          </div>
          <div class="p-6 space-y-3" id="equipments-pdf-content">
            <div v-for="(eq, idx) in selectedCustomer?.equipments" :key="eq.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ eq.brand }} {{ eq.model }}</p>
              <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p><span class="text-gray-500">N° série:</span> {{ eq.serial_number }}</p>
                <p><span class="text-gray-500">Statut:</span> {{ eq.status }}</p>
                <p><span class="text-gray-500">Type:</span> {{ eq.type || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Quantité:</span> {{ eq.quantity || 1 }}</p>
                <p class="col-span-2"><span class="text-gray-500">Date enregistrement:</span> {{ eq.registration_date || 'Non spécifiée' }}</p>
                <p v-if="eq.comment" class="col-span-2"><span class="text-gray-500">Commentaire:</span> {{ eq.comment }}</p>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showEquipmentModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal Pannes -->
      <div v-if="showBreakdownModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showBreakdownModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Toutes les pannes</h3>
            <div class="flex gap-2">
              <button @click="exportBreakdownsPdf" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">📄 Exporter PDF</button>
              <button @click="showBreakdownModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
          </div>
          <div class="p-6 space-y-3" id="breakdowns-pdf-content">
            <div v-for="(bd, idx) in selectedCustomer?.breakdowns" :key="bd.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ bd.created_at?.split('T')[0] || bd.report_date }} - {{ bd.equipment?.brand }} {{ bd.equipment?.model }}</p>
              <div class="flex justify-between items-center mt-1"><span :class="bd.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-0.5 rounded-full text-xs font-semibold">{{ bd.status === 'closed' ? 'Clôturé' : 'En cours' }}</span></div>
              <div class="grid grid-cols-1 gap-1 mt-3 text-sm">
                <p><span class="text-gray-500">Technicien:</span> {{ bd.technician?.full_name || bd.technician_name || 'Non assigné' }}</p>
                <p><span class="text-gray-500">Défauts signalés:</span> {{ bd.reported_issues || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Défauts constatés:</span> {{ bd.observed_issues || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Tâches effectuées:</span> {{ bd.tasks_performed || 'Non spécifié' }}</p>
                <p><span class="text-gray-500">Lieu:</span> {{ bd.intervention_location || 'Chez client' }}</p>
                <p><span class="text-gray-500">Frais déplacement:</span> {{ formatPrice(bd.travel_fee || 0) }} FCFA</p>
                <p><span class="text-gray-500">Montant total:</span> {{ formatPrice(bd.total_amount || 0) }} FCFA</p>
                <p><span class="text-gray-500">Paiement:</span> {{ bd.payment_status || 'En attente' }}</p>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showBreakdownModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal Contrats -->
      <div v-if="showContractModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showContractModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Tous les contrats</h3>
            <div class="flex gap-2">
              <button @click="exportContractsPdf" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">📄 Exporter PDF</button>
              <button @click="showContractModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
          </div>
          <div class="p-6 space-y-3" id="contracts-pdf-content">
            <div v-for="(contract, idx) in selectedCustomer?.contracts" :key="contract.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ contract.plan_type }} - {{ formatPrice(contract.recurring_amount) }} FCFA/{{ contract.frequency }}</p>
              <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p><span class="text-gray-500">Période:</span> {{ contract.start_date }} → {{ contract.end_date }}</p>
                <p><span class="text-gray-500">Statut:</span> {{ contract.status === 'Actif' ? 'Actif' : 'Expiré' }}</p>
                <p class="col-span-2"><span class="text-gray-500">Conditions:</span> {{ contract.terms_conditions || 'Non spécifiées' }}</p>
                <p class="col-span-2"><span class="text-gray-500">Renouvellement auto:</span> {{ contract.auto_renewal ? 'Oui' : 'Non' }}</p>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showContractModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal Factures -->
      <div v-if="showInvoiceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showInvoiceModal = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Toutes les factures</h3>
            <div class="flex gap-2">
              <button @click="exportInvoicesPdf" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">📄 Exporter PDF</button>
              <button @click="showInvoiceModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
          </div>
          <div class="p-6 space-y-3" id="invoices-pdf-content">
            <div v-for="(inv, idx) in selectedCustomer?.invoices" :key="inv.id" class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <p class="font-bold text-gray-900">{{ idx + 1 }}. {{ inv.invoice_number }} - {{ inv.issue_date }}</p>
              <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p><span class="text-gray-500">Montant:</span> {{ formatPrice(inv.total_amount) }} FCFA</p>
                <p><span class="text-gray-500">Type:</span> {{ inv.invoice_type }}</p>
                <p><span class="text-gray-500">Statut paiement:</span> {{ inv.payment_status === 'paid' ? 'Payée' : 'Impayée' }}</p>
                <p><span class="text-gray-500">Date échéance:</span> {{ inv.due_date || 'Non spécifiée' }}</p>
                <p class="col-span-2"><span class="text-gray-500">Description:</span> {{ inv.description || 'Non spécifiée' }}</p>
                <p><span class="text-gray-500">TVA:</span> {{ inv.vat_rate || 18 }}%</p>
                <p v-if="inv.travel_fee"><span class="text-gray-500">Frais déplacement:</span> {{ formatPrice(inv.travel_fee) }} FCFA</p>
                <p v-if="inv.delivery_fee"><span class="text-gray-500">Frais livraison:</span> {{ formatPrice(inv.delivery_fee) }} FCFA</p>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button @click="showInvoiceModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal CNI -->
      <div v-if="showCniModal" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" @click.self="showCniModal = false">
        <div class="relative">
          <img :src="getFullImageUrl(selectedCniImage)" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" @error="handleCniImageError">
          <button @click="showCniModal = false" class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">&times;</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  }
})

const router = useRouter()

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
}

// Fonction corrigée pour obtenir l'URL complète de l'image
const getFullImageUrl = (path) => {
  if (!path) return '/default-avatar.png'
  
  // Si c'est déjà une URL complète (http:// ou https://)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Si le chemin commence par /storage/, c'est un chemin relatif
  if (path.startsWith('/storage/')) {
    return path
  }
  
  // Si le chemin commence par storage/ (sans slash)
  if (path.startsWith('storage/')) {
    return '/' + path
  }
  
  // Sinon, on construit l'URL complète
  return path
}

// Gestionnaire d'erreur d'image
const handleImageError = (event) => {
  event.target.src = '/default-avatar.png'
}

const handleCniImageError = (event) => {
  event.target.src = ''
  event.target.alt = 'Image non disponible'
}

// États
const searchQuery = ref("")
const selectedCustomer = ref(null)
const customers = ref([])
const loading = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15
})

const showModal = ref(false)
const editingCustomer = ref(null)
const form = ref({ 
  name: "", type: "individual", email: "", phone: "", 
  photo: null, photoPreview: null, existingPhoto: null,
  cni_rccm: null, 
  country: "", city: "", address: "", note: "" 
})

const showEquipmentModal = ref(false)
const showBreakdownModal = ref(false)
const showContractModal = ref(false)
const showInvoiceModal = ref(false)
const showCniModal = ref(false)
const selectedCniImage = ref("")

let searchTimeout = null

// API Functions
const fetchCustomers = async () => {
  loading.value = true
  try {
    const response = await api.get('/customers', {
      params: { search: searchQuery.value, per_page: pagination.value.per_page, page: pagination.value.current_page }
    })
    customers.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error(error)
    alert("Erreur lors du chargement des clients")
  } finally {
    loading.value = false
  }
}

const fetchCustomerDetail = async (id) => {
  loadingDetail.value = true
  try {
    const response = await api.get(`/customers/${id}`)
    selectedCustomer.value = response.data.data
  } catch (error) {
    console.error(error)
    alert("Erreur lors du chargement des détails")
  } finally {
    loadingDetail.value = false
  }
}

const saveCustomer = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    const textFields = ['name', 'type', 'email', 'phone', 'country', 'city', 'address', 'note']
    textFields.forEach(key => { 
      if (form.value[key]) formData.append(key, form.value[key]) 
    })
    
    if (form.value.photo instanceof File) formData.append('photo', form.value.photo)
    if (form.value.cni_rccm instanceof File) formData.append('cni_rccm', form.value.cni_rccm)

    let response
    if (editingCustomer.value) {
      formData.append('_method', 'PUT')
      response = await api.post(`/customers/${editingCustomer.value.id}`, formData)
    } else {
      response = await api.post('/customers', formData)
    }

    if (response.data.success) {
      alert(response.data.message || 'Client enregistré')
      await fetchCustomers()
      closeForm()
      if (selectedCustomer.value && editingCustomer.value) await fetchCustomerDetail(selectedCustomer.value.id)
    }
  } catch (error) {
    console.error(error)
    if (error.response?.data?.errors) alert(Object.values(error.response.data.errors).flat().join('\n'))
    else alert("Erreur lors de l'enregistrement")
  } finally {
    saving.value = false
  }
}

const deleteCustomer = async (id) => {
  if (!confirm("Supprimer ce client ?")) return
  loading.value = true
  try {
    await api.delete(`/customers/${id}`)
    alert("Client supprimé")
    await fetchCustomers()
    if (selectedCustomer.value?.id === id) selectedCustomer.value = null
  } catch (error) {
    console.error(error)
    alert("Erreur lors de la suppression")
  } finally {
    loading.value = false
  }
}

// UI Functions
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { pagination.value.current_page = 1; fetchCustomers() }, 500)
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  fetchCustomers()
}

const openForm = () => {
  editingCustomer.value = null
  form.value = { 
    name: "", type: "individual", email: "", phone: "", 
    photo: null, photoPreview: null, existingPhoto: null,
    cni_rccm: null, 
    country: "", city: "", address: "", note: "" 
  }
  showModal.value = true
}

const editCustomer = (customer) => {
  editingCustomer.value = customer
  form.value = {
    name: customer.name, 
    type: customer.type, 
    email: customer.email, 
    phone: customer.phone,
    photo: null, 
    photoPreview: null, 
    existingPhoto: customer.photo,
    cni_rccm: customer.cni_rccm,
    country: customer.country, 
    city: customer.city, 
    address: customer.address, 
    note: customer.note || ""
  }
  showModal.value = true
}

const closeForm = () => { 
  showModal.value = false
  editingCustomer.value = null
  form.value.photoPreview = null
}

const viewCustomer = async (id) => { 
  await fetchCustomerDetail(id) 
}

const goBackToList = () => { 
  selectedCustomer.value = null
  fetchCustomers() 
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => { 
      form.value.photoPreview = e.target.result 
    }
    reader.readAsDataURL(file)
  }
}

const handleCniUpload = (event) => { 
  form.value.cni_rccm = event.target.files[0] 
}

const deleteCustomerFromDetail = () => { 
  if (selectedCustomer.value) deleteCustomer(selectedCustomer.value.id) 
}

const openEditForm = () => { 
  editCustomer(selectedCustomer.value)
  showModal.value = true 
}

const navigateTo = (path) => { 
  router.push(path) 
}

const viewEquipment = (id) => { 
  navigateTo(`/equipments/${id}`) 
}

const openEquipmentModal = () => { showEquipmentModal.value = true }
const openBreakdownModal = () => { showBreakdownModal.value = true }
const openContractModal = () => { showContractModal.value = true }
const openInvoiceModal = () => { showInvoiceModal.value = true }

const openCniModal = (cniUrl) => {
  selectedCniImage.value = cniUrl
  showCniModal.value = true
}

// Export PDF functions
const generatePdfFromContent = (contentId, title) => {
  const content = document.getElementById(contentId)
  if (!content) return
  
  const contentClone = content.cloneNode(true)
  const printWindow = window.open('', '_blank')
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>${title}</title><meta charset="UTF-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; margin: 40px; }
      .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #0284c7; margin: 0; }
      .header p { margin: 5px 0; color: #666; }
      .title { text-align: center; margin-bottom: 30px; }
      .title h2 { margin: 0; }
      .border { border: 1px solid #e5e7eb; }
      .rounded-xl { border-radius: 12px; }
      .p-4 { padding: 16px; }
      .mb-4 { margin-bottom: 16px; }
      .text-sm { font-size: 14px; }
      .font-bold { font-weight: bold; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
    </style>
    </head>
    <body>
      <div class="header">
        <h1>NEO START TECH</h1>
        <p>Service Maintenance</p>
        <p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p>
        <p>Tél: +228 90 42 20 20 | Email: contact@neostart.tech</p>
      </div>
      <div class="title">
        <h2>${title}</h2>
        <p>Client: ${selectedCustomer.value?.name || ''} | Généré le ${new Date().toLocaleDateString()}</p>
      </div>
      ${contentClone.innerHTML}
      <div class="footer">
        <p>Document généré automatiquement par Neo Start Tech</p>
      </div>
    </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

const exportEquipmentsPdf = () => { 
  if (selectedCustomer.value) {
    generatePdfFromContent('equipments-pdf-content', `Liste des équipements - ${selectedCustomer.value.name}`) 
  }
}

const exportBreakdownsPdf = () => { 
  if (selectedCustomer.value) {
    generatePdfFromContent('breakdowns-pdf-content', `Historique des pannes - ${selectedCustomer.value.name}`) 
  }
}

const exportContractsPdf = () => { 
  if (selectedCustomer.value) {
    generatePdfFromContent('contracts-pdf-content', `Liste des contrats - ${selectedCustomer.value.name}`) 
  }
}

const exportInvoicesPdf = () => { 
  if (selectedCustomer.value) {
    generatePdfFromContent('invoices-pdf-content', `Liste des factures - ${selectedCustomer.value.name}`) 
  }
}

const exportCustomerPdf = () => {
  if (!selectedCustomer.value) return
  
  const printWindow = window.open('', '_blank')
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>Fiche Client - ${selectedCustomer.value.name}</title><meta charset="UTF-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; margin: 40px; }
      .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #0284c7; margin: 0; }
      .header p { margin: 5px 0; color: #666; }
      .title { text-align: center; margin-bottom: 30px; }
      .section { margin-bottom: 25px; }
      .section-title { color: #0284c7; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
    </style>
    </head>
    <body>
      <div class="header">
        <h1>NEO START TECH</h1>
        <p>Service Maintenance</p>
        <p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p>
        <p>Tél: +228 90 42 20 20 | Email: contact@neostart.tech</p>
      </div>
      <div class="title">
        <h2>FICHE CLIENT</h2>
        <p>Généré le ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="section">
        <div class="section-title">📋 Informations client</div>
        <div class="info-row"><strong>Nom:</strong> ${selectedCustomer.value.name || ''}</div>
        <div class="info-row"><strong>Type:</strong> ${selectedCustomer.value.type === 'individual' ? 'Particulier' : selectedCustomer.value.type === 'company' ? 'Entreprise' : 'Association'}</div>
        <div class="info-row"><strong>Email:</strong> ${selectedCustomer.value.email || ''}</div>
        <div class="info-row"><strong>Téléphone:</strong> ${selectedCustomer.value.phone || ''}</div>
        <div class="info-row"><strong>Adresse:</strong> ${selectedCustomer.value.address || ''}, ${selectedCustomer.value.city || ''}, ${selectedCustomer.value.country || ''}</div>
        <div class="info-row"><strong>Contrat actif:</strong> ${selectedCustomer.value.active_contract ? 'Oui' : 'Non'}</div>
        ${selectedCustomer.value.note ? `<div class="info-row"><strong>Note:</strong> ${selectedCustomer.value.note}</div>` : ''}
      </div>
      <div class="footer">
        <p>Document généré automatiquement par Neo Start Tech</p>
      </div>
    </body>
    </html>
  `
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

onMounted(() => { 
  fetchCustomers() 
})
</script>