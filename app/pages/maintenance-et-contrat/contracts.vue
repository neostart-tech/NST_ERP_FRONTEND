<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      <!-- ==================== LISTE DES CONTRATS ==================== -->
      <div v-if="!selectedContract">
        <!-- Header refait (style sky) -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">📑 Gestion des contrats</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez tous vos contrats de maintenance</p>
                </div>
                <div class="flex gap-3">
                  <button @click="openLetterModal" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition font-medium">
                    📄 Lettre de demande
                  </button>
                  <button @click="openForm" class="bg-white text-sky-700 px-4 py-2 rounded-xl hover:bg-sky-50 transition font-medium shadow-md">
                    + Nouveau contrat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre recherche + filtres (style moderne) -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="relative flex-1">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Rechercher un contrat..." 
                @input="handleSearch"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select v-model="filters.status" @change="applyFilters" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="expired">Expiré</option>
              <option value="terminated">Résilié</option>
            </select>
            <select v-model="filters.customerId" @change="applyFilters" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white min-w-[180px]">
              <option value="">Tous les clients</option>
              <option v-for="c in customersList" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement...</p>
        </div>

        <!-- Tableau (style moderne, classes identiques à l’original pour les data) -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Forfait</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date début</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date fin</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(contract, index) in contracts" :key="contract.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ contract.customer }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">{{ contract.plan }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ contract.startDate }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ contract.endDate }}</td>
                  <td class="px-6 py-4">
                    <span :class="contract.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ contract.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-700">{{ formatPrice(contract.amount) }} FCFA</td>
                  <td class="px-6 py-4 space-x-3">
                    <button @click="viewContract(contract.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                    <button @click="editContract(contract)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                    <button @click="deleteContract(contract.id)" class="text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                    <button @click="downloadContractPdf(contract)" class="text-emerald-600 hover:text-emerald-800 font-medium">PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ contracts.length }} sur {{ pagination.total }} contrats
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

        <!-- Modal formulaire (style moderne mais même structure) -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingContract ? 'Modifier le contrat' : 'Nouveau contrat' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveContract">
                <!-- Le contenu du formulaire est STRICTEMENT IDENTIQUE à l’original -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1">Client *</label>
                    <select v-model="form.customerId" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      <option value="">Sélectionner un client</option>
                      <option v-for="c in customersList" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Type de forfait *</label>
                    <select v-model="form.plan" required class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      <option value="Bronze">Bronze - Intervention sous 72h</option>
                      <option value="Silver">Silver - Intervention sous 48h</option>
                      <option value="Gold">Gold - Intervention sous 24h</option>
                      <option value="Platinum">Platinum - Intervention sous 12h</option>
                      <option value="Personnalisé">Personnalisé</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Date début *</label>
                    <input v-model="form.startDate" type="date" required class="w-full border rounded-lg px-3 py-2" @change="generateSchedule">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Date fin *</label>
                    <input v-model="form.endDate" type="date" required class="w-full border rounded-lg px-3 py-2" @change="generateSchedule">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Montant récurrent (FCFA) *</label>
                    <input v-model="form.amount" type="number" step="1" required class="w-full border rounded-lg px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Périodicité de facturation</label>
                    <select v-model="form.frequency" required class="w-full border rounded-lg px-3 py-2">
                      <option value="Mensuelle">Mensuelle</option>
                      <option value="Trimestrielle">Trimestrielle</option>
                      <option value="Semestrielle">Semestrielle</option>
                      <option value="Annuelle">Annuelle</option>
                    </select>
                  </div>
                  
                  <div class="md:col-span-2 border-t pt-4 mt-2">
                    <h3 class="font-semibold text-md text-blue-600 mb-3">📅 Planning des interventions</h3>
                    
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label class="block text-sm font-medium mb-1">Fréquence des interventions</label>
                          <select v-model="form.scheduleType" class="w-full border rounded-lg px-3 py-2" @change="generateSchedule">
                            <option value="weekly">Par semaine</option>
                            <option value="monthly">Par mois</option>
                            <option value="yearly">Par année</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium mb-1">Nombre d'interventions</label>
                          <input v-model="form.interventionsCount" type="number" min="1" max="31" class="w-full border rounded-lg px-3 py-2" @change="generateSchedule">
                        </div>
                        <div v-if="form.scheduleType === 'weekly'">
                          <label class="block text-sm font-medium mb-1">Jours de la semaine</label>
                          <div class="flex flex-wrap gap-2 mt-1">
                            <label v-for="day in weekDays" :key="day.value" class="flex items-center gap-1">
                              <input type="checkbox" :value="day.value" v-model="form.selectedWeekDays" @change="generateSchedule" class="w-4 h-4">
                              <span class="text-sm">{{ day.label }}</span>
                            </label>
                          </div>
                        </div>
                        <div v-if="form.scheduleType === 'monthly'">
                          <label class="block text-sm font-medium mb-1">Jours du mois</label>
                          <select v-model="form.selectedMonthDays" multiple class="w-full border rounded-lg px-3 py-2 text-sm">
                            <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
                          </select>
                        </div>
                        <div v-if="form.scheduleType === 'yearly'">
                          <label class="block text-sm font-medium mb-1">Mois</label>
                          <select v-model="form.selectedYearMonths" multiple class="w-full border rounded-lg px-3 py-2 text-sm">
                            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="border rounded-lg overflow-hidden">
                      <div class="bg-blue-50 px-4 py-2 font-semibold text-blue-600">
                        Calendrier des interventions ({{ generatedDates.length }} dates)
                        <button type="button" @click="toggleAllDates" class="ml-4 text-sm text-blue-500 hover:underline">Tout cocher/décocher</button>
                      </div>
                      <div class="p-4 grid grid-cols-7 gap-1 max-h-96 overflow-y-auto">
                        <div v-for="date in generatedDates" :key="date" 
                             @click="toggleDate(date)"
                             :class="[
                               'p-2 text-center rounded-lg cursor-pointer transition text-sm',
                               selectedDates.includes(date) 
                                 ? 'bg-green-500 text-white' 
                                 : 'bg-gray-100 hover:bg-gray-200',
                               new Date(date) < new Date() ? 'opacity-50 line-through' : ''
                             ]">
                          {{ formatDateShort(date) }}
                          <div class="text-xs opacity-75">{{ getDayName(date) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium mb-1">Conditions particulières</label>
                    <textarea v-model="form.conditions" rows="2" class="w-full border rounded-lg px-3 py-2"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Renouvellement automatique</label>
                    <select v-model="form.autoRenewal" class="w-full border rounded-lg px-3 py-2">
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Alerte interne (jours)</label>
                    <input v-model="form.internalAlert" type="number" class="w-full border rounded-lg px-3 py-2">
                  </div>
                </div>
                
                <div class="flex justify-end gap-3 mt-6">
                  <button type="button" @click="closeForm" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== FICHE CONTRAT DÉTAILLÉE ==================== -->
      <div v-else-if="selectedContract" class="space-y-6">
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <button @click="goBackToList" class="text-blue-600 hover:text-blue-800 text-2xl">←</button>
              <div>
                <h1 class="text-2xl font-bold text-blue-600">Contrat #{{ selectedContract.id }}</h1>
                <p class="text-gray-600">Client: {{ selectedContract.customer }}</p>
                <p class="text-gray-500 text-sm">Forfait: {{ selectedContract.plan }} • {{ selectedContract.startDate }} → {{ selectedContract.endDate }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="downloadContractPdf(selectedContract)" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">📄 Télécharger contrat</button>
              <button @click="openLetterModalWithContract(selectedContract)" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">✉️ Lettre</button>
              <button v-if="selectedContract.status === 'Actif'" @click="renewContract" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Renouveler</button>
              <button @click="terminateContract" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Résilier</button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg text-blue-600 mb-4">📋 Informations générales</h2>
            <div class="space-y-2">
              <div class="flex justify-between border-b pb-2"><span class="text-gray-600">Client</span><span class="font-medium">{{ selectedContract.customer }}</span></div>
              <div class="flex justify-between border-b pb-2"><span class="text-gray-600">Forfait</span><span class="font-medium">{{ selectedContract.plan }}</span></div>
              <div class="flex justify-between border-b pb-2"><span class="text-gray-600">Période</span><span class="font-medium">{{ selectedContract.startDate }} → {{ selectedContract.endDate }}</span></div>
              <div class="flex justify-between border-b pb-2"><span class="text-gray-600">Statut</span><span :class="selectedContract.status === 'Actif' ? 'text-green-600' : 'text-red-600'">{{ selectedContract.status }}</span></div>
              <div class="flex justify-between border-b pb-2"><span class="text-gray-600">Montant</span><span class="font-medium">{{ formatPrice(selectedContract.amount) }} FCFA / {{ selectedContract.frequency }}</span></div>
              <div class="flex justify-between border-b pb-2"><span class="text-gray-600">Renouvellement auto</span><span class="font-medium">{{ selectedContract.autoRenewal || 'Non' }}</span></div>
              <div class="border-b pb-2"><span class="text-gray-600">Conditions</span><p class="mt-1">{{ selectedContract.conditions || 'Aucune condition particulière' }}</p></div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg text-blue-600 mb-4">📅 Planning des interventions ({{ selectedContract.selectedDates?.length || 0 }} dates)</h2>
            <div class="max-h-64 overflow-y-auto">
              <div v-if="selectedContract.selectedDates && selectedContract.selectedDates.length" class="space-y-1">
                <div v-for="date in selectedContract.selectedDates" :key="date" class="border-b py-1 text-sm">
                  {{ formatDateLong(date) }} - <span :class="isDatePassed(date) ? 'text-red-500' : 'text-green-600'">{{ isDatePassed(date) ? 'Passé' : 'À venir' }}</span>
                </div>
              </div>
              <p v-else class="text-gray-500 italic">Aucune intervention planifiée</p>
            </div>
            <button @click="openEditScheduleModal" class="mt-3 text-blue-600 text-sm">✏️ Modifier le planning</button>
          </div>
        </div>
      </div>

      <!-- Modals (identiques à l’original) -->
      <div v-if="showScheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-blue-600">Modifier le planning</h3>
            <button @click="showScheduleModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <div class="bg-blue-50 px-4 py-2 font-semibold text-blue-600 rounded-t-lg">
                Calendrier des interventions ({{ tempSelectedDates.length }} dates sélectionnées)
              </div>
              <div class="border rounded-b-lg p-4 grid grid-cols-7 gap-1 max-h-96 overflow-y-auto">
                <div v-for="date in allDatesInPeriod" :key="date" 
                     @click="toggleTempDate(date)"
                     :class="[
                       'p-2 text-center rounded-lg cursor-pointer transition text-sm',
                       tempSelectedDates.includes(date) 
                         ? 'bg-green-500 text-white' 
                         : 'bg-gray-100 hover:bg-gray-200',
                       new Date(date) < new Date() ? 'opacity-50 line-through' : ''
                     ]">
                  {{ formatDateShort(date) }}
                  <div class="text-xs opacity-75">{{ getDayName(date) }}</div>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button @click="showScheduleModal = false" class="px-4 py-2 border rounded">Annuler</button>
              <button @click="saveSchedule" class="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showLetterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-purple-600">Lettre de demande de maintenance</h3>
            <button @click="showLetterModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <div class="p-6">
            <form @submit.prevent="generateLetterPdf">
              <div class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Date</label><input v-model="letterForm.date" type="date" class="w-full border rounded-lg px-3 py-2"></div>
                <div><label class="block text-sm font-medium mb-1">Destinataire</label><input v-model="letterForm.recipient" type="text" class="w-full border rounded-lg px-3 py-2"></div>
                <div><label class="block text-sm font-medium mb-1">Adresse</label><textarea v-model="letterForm.recipientAddress" rows="2" class="w-full border rounded-lg px-3 py-2"></textarea></div>
                <div><label class="block text-sm font-medium mb-1">Objet</label><input v-model="letterForm.subject" type="text" class="w-full border rounded-lg px-3 py-2"></div>
                <div><label class="block text-sm font-medium mb-1">Corps de la lettre</label><textarea v-model="letterForm.body" rows="10" class="w-full border rounded-lg px-3 py-2 font-mono"></textarea></div>
                <div><label class="block text-sm font-medium mb-1">Signataire</label><input v-model="letterForm.signer" type="text" class="w-full border rounded-lg px-3 py-2"></div>
                <div><label class="block text-sm font-medium mb-1">Titre</label><input v-model="letterForm.title" type="text" class="w-full border rounded-lg px-3 py-2"></div>
              </div>
              <div class="flex justify-end gap-3 mt-6">
                <button type="button" @click="showLetterModal = false" class="px-4 py-2 border rounded">Annuler</button>
                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded">📄 Générer PDF</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="showLetterPdf" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showLetterPdf = false">
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-purple-600">Aperçu PDF - Lettre de demande</h3>
            <button @click="showLetterPdf = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <div class="p-6">
            <div class="border rounded-lg p-6 bg-white">
              <div class="text-right mb-8"><p class="font-bold">NEO START TECH</p><p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p><p>Tél: +228 90 42 20 20</p><p>Email: contact@neostart.tech</p></div>
              <div class="mb-8"><p>{{ letterForm.date || new Date().toLocaleDateString() }}</p></div>
              <div class="mb-8"><p><strong>À l'attention de</strong></p><p>{{ letterForm.recipient }}</p><p class="whitespace-pre-line">{{ letterForm.recipientAddress }}</p></div>
              <div class="mb-8"><p><strong>Objet :</strong> {{ letterForm.subject || 'Demande de contrat de maintenance' }}</p></div>
              <div class="mb-8 whitespace-pre-line">{{ letterForm.body }}</div>
              <div class="mt-12"><p>Fait à Lomé, le {{ letterForm.date || new Date().toLocaleDateString() }}</p><div class="mt-8"><p><strong>Signature :</strong></p><p>{{ letterForm.signer }}</p><p>{{ letterForm.title }}</p></div></div>
            </div>
            <div class="flex justify-end gap-3 mt-4">
              <button @click="showLetterPdf = false" class="px-4 py-2 border rounded">Fermer</button>
              <button @click="downloadLetterPdf" class="px-4 py-2 bg-purple-600 text-white rounded">📥 Télécharger PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// ============================================================
// ⚠️⚠️⚠️ SCRIPT IDENTIQUE À L’ORIGINAL ⚠️⚠️⚠️
// RIEN N’A ÉTÉ MODIFIÉ ICI POUR GARDER LE BACKEND FONCTIONNEL
// ============================================================

import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Format price
const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
}

// Format dates
const formatDateShort = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth()+1}`
}

const formatDateLong = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const getDayName = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'short' })
}

const isDatePassed = (dateStr) => {
  return new Date(dateStr) < new Date()
}

// Week days
const weekDays = [
  { value: 1, label: "Lun" }, { value: 2, label: "Mar" }, { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" }, { value: 5, label: "Ven" }, { value: 6, label: "Sam" }, { value: 0, label: "Dim" }
]

const months = [
  { value: 0, label: "Janvier" }, { value: 1, label: "Février" }, { value: 2, label: "Mars" },
  { value: 3, label: "Avril" }, { value: 4, label: "Mai" }, { value: 5, label: "Juin" },
  { value: 6, label: "Juillet" }, { value: 7, label: "Août" }, { value: 8, label: "Septembre" },
  { value: 9, label: "Octobre" }, { value: 10, label: "Novembre" }, { value: 11, label: "Décembre" }
]

// States
const searchQuery = ref("")
const filters = ref({ status: "", customerId: "" })
const selectedContract = ref(null)
const contracts = ref([])
const customersList = ref([])
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
const editingContract = ref(null)
const generatedDates = ref([])
const selectedDates = ref([])

const form = ref({
  customerId: "",
  plan: "Silver",
  startDate: new Date().toISOString().split('T')[0],
  endDate: "",
  amount: 0,
  frequency: "Mensuelle",
  conditions: "",
  autoRenewal: "Non",
  internalAlert: 30,
  scheduleType: "weekly",
  interventionsCount: 1,
  selectedWeekDays: [1, 2, 3, 4, 5],
  selectedMonthDays: [1, 15],
  selectedYearMonths: [0],
})

const showScheduleModal = ref(false)
const tempSelectedDates = ref([])
const allDatesInPeriod = ref([])

const showLetterModal = ref(false)
const showLetterPdf = ref(false)
const letterForm = ref({
  date: new Date().toISOString().split('T')[0],
  recipient: "",
  recipientAddress: "",
  subject: "Demande de contrat de maintenance",
  body: "Nous souhaitons par la présente faire une demande de contrat de maintenance...",
  signer: "",
  title: "Directeur Général"
})

let searchTimeout = null

// Generate schedule
const generateScheduleFromCriteria = (startDate, endDate, scheduleType, interventionsCount, selectedWeekDays, selectedMonthDays, selectedYearMonths) => {
  const dates = []
  let current = new Date(startDate)
  const end = new Date(endDate)
  
  if (scheduleType === 'weekly' && selectedWeekDays.length > 0) {
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (selectedWeekDays.includes(dayOfWeek)) {
        dates.push(new Date(current).toISOString().split('T')[0])
      }
      current.setDate(current.getDate() + 1)
    }
    return dates.sort()
  }
  
  else if (scheduleType === 'monthly' && selectedMonthDays.length > 0) {
    let year = current.getFullYear()
    let month = current.getMonth()
    while (new Date(year, month, 1) <= end) {
      for (const day of selectedMonthDays) {
        const date = new Date(year, month, day)
        if (date >= current && date <= end) {
          dates.push(date.toISOString().split('T')[0])
        }
      }
      month++
      if (month > 11) { month = 0; year++ }
    }
    return dates.sort()
  }
  
  else if (scheduleType === 'yearly' && selectedYearMonths.length > 0) {
    let year = current.getFullYear()
    while (year <= end.getFullYear()) {
      for (const month of selectedYearMonths) {
        const date = new Date(year, month, 15)
        if (date >= current && date <= end) {
          dates.push(date.toISOString().split('T')[0])
        }
      }
      year++
    }
    return dates.sort()
  }
  
  return []
}

const generateSchedule = () => {
  if (!form.value.startDate || !form.value.endDate) return
  generatedDates.value = generateScheduleFromCriteria(
    form.value.startDate, form.value.endDate,
    form.value.scheduleType, form.value.interventionsCount,
    form.value.selectedWeekDays, form.value.selectedMonthDays,
    form.value.selectedYearMonths
  )
  selectedDates.value = [...generatedDates.value]
}

const toggleDate = (date) => {
  const index = selectedDates.value.indexOf(date)
  if (index === -1) selectedDates.value.push(date)
  else selectedDates.value.splice(index, 1)
}

const toggleAllDates = () => {
  if (selectedDates.value.length === generatedDates.value.length) {
    selectedDates.value = []
  } else {
    selectedDates.value = [...generatedDates.value]
  }
}

const getAllDatesInPeriod = (startDate, endDate) => {
  const dates = []
  let current = new Date(startDate)
  const end = new Date(endDate)
  while (current <= end) {
    dates.push(new Date(current).toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// API Functions
const fetchContracts = async () => {
  loading.value = true
  try {
    const response = await api.get('/contracts', {
      params: {
        search: searchQuery.value,
        status: filters.value.status,
        customer_id: filters.value.customerId,
        per_page: pagination.value.per_page,
        page: pagination.value.current_page
      }
    })
    contracts.value = response.data.data || []
    pagination.value = response.data.meta || { current_page: 1, last_page: 1, total: 0, per_page: 15 }
  } catch (error) {
    console.error("Erreur chargement contrats:", error)
    alert("Erreur lors du chargement des contrats")
  } finally {
    loading.value = false
  }
}

const fetchCustomersList = async () => {
  try {
    const response = await api.get('/contracts/customers/list')
    customersList.value = response.data.data || []
  } catch (error) {
    console.error("Erreur chargement clients:", error)
    alert("Erreur lors du chargement des clients")
  }
}

const fetchContractDetail = async (id) => {
  loadingDetail.value = true
  try {
    const response = await api.get(`/contracts/${id}`)
    selectedContract.value = response.data.data
  } catch (error) {
    console.error("Erreur chargement détail:", error)
    alert("Erreur lors du chargement des détails")
  } finally {
    loadingDetail.value = false
  }
}

const saveContract = async () => {
  saving.value = true
  try {
    const data = {
      customerId: parseInt(form.value.customerId),
      plan: form.value.plan,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      amount: parseFloat(form.value.amount),
      frequency: form.value.frequency,
      conditions: form.value.conditions,
      autoRenewal: form.value.autoRenewal,
      internalAlert: parseInt(form.value.internalAlert) || 30,
      selectedDates: selectedDates.value,
    }

    let response
    if (editingContract.value) {
      response = await api.put(`/contracts/${editingContract.value.id}`, data)
    } else {
      response = await api.post('/contracts', data)
    }

    if (response.data.success) {
      alert(response.data.message || 'Contrat enregistré avec succès')
      await fetchContracts()
      closeForm()
      if (selectedContract.value && editingContract.value) {
        await fetchContractDetail(selectedContract.value.id)
      }
    }
  } catch (error) {
    console.error("Erreur sauvegarde:", error)
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      alert(errors.join('\n'))
    } else if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert("Erreur lors de l'enregistrement")
    }
  } finally {
    saving.value = false
  }
}

const deleteContract = async (id) => {
  if (!confirm("Supprimer ce contrat ?")) return
  loading.value = true
  try {
    await api.delete(`/contracts/${id}`)
    alert("Contrat supprimé avec succès")
    await fetchContracts()
    if (selectedContract.value?.id === id) {
      selectedContract.value = null
    }
  } catch (error) {
    console.error("Erreur suppression:", error)
    alert("Erreur lors de la suppression")
  } finally {
    loading.value = false
  }
}

// PDF Function
const downloadContractPdf = (contract) => {
  const printWindow = window.open('', '_blank')
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Contrat #${contract.id}</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #1C75BC; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1C75BC; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .title { text-align: center; margin-bottom: 30px; }
        .title h2 { margin: 0; }
        .info-section { margin-bottom: 20px; }
        .info-section h3 { color: #1C75BC; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; color: #555; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="header"><h1>NEO START TECH</h1><p>Service Maintenance</p><p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p><p>Tél: +228 90 42 20 20 | Email: contact@neostart.tech</p></div>
      <div class="title"><h2>CONTRAT DE MAINTENANCE</h2><p>N°: ${contract.id} | Date: ${new Date().toLocaleDateString()}</p></div>
      <div class="info-section"><h3>Informations client</h3><div class="info-row"><span class="info-label">Client:</span><span>${contract.customer}</span></div><div class="info-row"><span class="info-label">Forfait:</span><span>${contract.plan}</span></div><div class="info-row"><span class="info-label">Période:</span><span>${contract.startDate} → ${contract.endDate}</span></div><div class="info-row"><span class="info-label">Statut:</span><span>${contract.status}</span></div></div>
      <div class="info-section"><h3>Détails financiers</h3><div class="info-row"><span class="info-label">Montant:</span><span>${formatPrice(contract.amount)} FCFA</span></div><div class="info-row"><span class="info-label">Périodicité:</span><span>${contract.frequency}</span></div><div class="info-row"><span class="info-label">Renouvellement automatique:</span><span>${contract.autoRenewal || 'Non'}</span></div></div>
      ${contract.conditions ? `<div class="info-section"><h3>Conditions particulières</h3><p>${contract.conditions}</p></div>` : ''}
      <div class="footer"><p>Document généré automatiquement par Neo Start Tech</p></div>
    </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

// UI Functions
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    fetchContracts()
  }, 500)
}

const applyFilters = () => {
  pagination.value.current_page = 1
  fetchContracts()
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  fetchContracts()
}

const openForm = () => {
  editingContract.value = null
  form.value = {
    customerId: "",
    plan: "Silver",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    amount: 0,
    frequency: "Mensuelle",
    conditions: "",
    autoRenewal: "Non",
    internalAlert: 30,
    scheduleType: "weekly",
    interventionsCount: 1,
    selectedWeekDays: [1, 2, 3, 4, 5],
    selectedMonthDays: [1, 15],
    selectedYearMonths: [0],
  }
  generatedDates.value = []
  selectedDates.value = []
  showModal.value = true
}

const editContract = (contract) => {
  editingContract.value = contract
  form.value = {
    customerId: contract.customerId,
    plan: contract.plan,
    startDate: contract.startDate,
    endDate: contract.endDate,
    amount: contract.amount,
    frequency: contract.frequency,
    conditions: contract.conditions || "",
    autoRenewal: contract.autoRenewal || "Non",
    internalAlert: contract.internalAlert || 30,
    scheduleType: "weekly",
    interventionsCount: 1,
    selectedWeekDays: [1, 2, 3, 4, 5],
    selectedMonthDays: [1, 15],
    selectedYearMonths: [0],
  }
  selectedDates.value = contract.selectedDates || []
  showModal.value = true
}

const closeForm = () => {
  showModal.value = false
  editingContract.value = null
}

const viewContract = async (id) => {
  await fetchContractDetail(id)
}

const goBackToList = () => {
  selectedContract.value = null
  fetchContracts()
}

const renewContract = () => {
  if (selectedContract.value) {
    const newEndDate = new Date()
    newEndDate.setFullYear(newEndDate.getFullYear() + 1)
    selectedContract.value.endDate = newEndDate.toISOString().split('T')[0]
    selectedContract.value.status = "Actif"
    alert("Contrat renouvelé")
  }
}

const terminateContract = () => {
  if (selectedContract.value) {
    selectedContract.value.status = "Résilié"
    alert("Contrat résilié")
  }
}

const openEditScheduleModal = () => {
  if (selectedContract.value) {
    allDatesInPeriod.value = getAllDatesInPeriod(selectedContract.value.startDate, selectedContract.value.endDate)
    tempSelectedDates.value = [...(selectedContract.value.selectedDates || [])]
    showScheduleModal.value = true
  }
}

const toggleTempDate = (date) => {
  const index = tempSelectedDates.value.indexOf(date)
  if (index === -1) tempSelectedDates.value.push(date)
  else tempSelectedDates.value.splice(index, 1)
}

const saveSchedule = () => {
  if (selectedContract.value) {
    selectedContract.value.selectedDates = [...tempSelectedDates.value]
    alert(`Planning mis à jour : ${tempSelectedDates.value.length} dates enregistrées`)
  }
  showScheduleModal.value = false
}

const openLetterModal = () => {
  letterForm.value = {
    ...letterForm.value,
    date: new Date().toISOString().split('T')[0]
  }
  showLetterModal.value = true
}

const openLetterModalWithContract = (contract) => {
  letterForm.value = {
    date: new Date().toISOString().split('T')[0],
    recipient: contract.customer,
    recipientAddress: "",
    subject: `Demande de renouvellement de contrat - ${contract.plan}`,
    body: `Nous souhaitons par la présente faire une demande de renouvellement de contrat de maintenance.\n\nLe contrat actuel arrive à échéance le ${contract.endDate}. Nous souhaitons le renouveler dans les mêmes conditions.\n\nDans l'attente de votre retour, veuillez agréer nos salutations distinguées.`,
    signer: "",
    title: "Directeur Général"
  }
  showLetterModal.value = true
}

const generateLetterPdf = () => {
  const printWindow = window.open('', '_blank')
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>Lettre de demande</title><meta charset="UTF-8">
    <style>
      body { font-family: 'Times New Roman', serif; margin: 60px; padding: 0; }
      .company-header { text-align: right; margin-bottom: 40px; }
      .company-header p { margin: 2px 0; }
      .date { margin-bottom: 40px; }
      .recipient { margin-bottom: 40px; }
      .subject { margin-bottom: 30px; font-weight: bold; }
      .body { margin-bottom: 50px; line-height: 1.5; }
      .signature { margin-top: 60px; }
    </style>
    </head>
    <body>
      <div class="company-header"><p><strong>NEO START TECH</strong></p><p>Quartier Totsi, non-loin du supermarché Champion Djidjolé</p><p>Tél: +228 90 42 20 20</p><p>Email: contact@neostart.tech</p></div>
      <div class="date"><p>${letterForm.value.date || new Date().toLocaleDateString()}</p></div>
      <div class="recipient"><p><strong>À l'attention de</strong></p><p>${letterForm.value.recipient}</p><p>${letterForm.value.recipientAddress}</p></div>
      <div class="subject"><p><strong>Objet : ${letterForm.value.subject || 'Demande de contrat de maintenance'}</strong></p></div>
      <div class="body"><p>${letterForm.value.body.replace(/\n/g, '<br>')}</p></div>
      <div class="signature"><p>Fait à Lomé, le ${letterForm.value.date || new Date().toLocaleDateString()}</p><br><br><p><strong>Signature :</strong></p><p>${letterForm.value.signer}</p><p>${letterForm.value.title}</p></div>
    </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
  
  showLetterModal.value = false
  showLetterPdf.value = false
}

const downloadLetterPdf = () => {
  generateLetterPdf()
}

onMounted(() => {
  fetchContracts()
  fetchCustomersList()
})
</script>