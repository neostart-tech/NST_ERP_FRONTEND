<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full space-y-6">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-2">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">📊 Rapports & Statistiques</h1>
              <p class="text-sky-100 text-lg">Analysez la performance de votre activité</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Période du</label>
          <input v-model="filters.dateFrom" type="date" @change="applyFilters" class="border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Au</label>
          <input v-model="filters.dateTo" type="date" @change="applyFilters" class="border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select v-model="filters.customerId" @change="applyFilters" class="border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500">
            <option value="">Tous les clients</option>
            <option v-for="c in customersList" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
          <select v-model="filters.technicianId" @change="applyFilters" class="border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500">
            <option value="">Tous les techniciens</option>
            <option v-for="t in techniciansList" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button @click="exportPdf" class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-sm font-medium">📄 Export PDF</button>
          <button @click="exportExcel" class="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm font-medium">📊 Export Excel</button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <p class="mt-3 text-gray-500">Chargement des données...</p>
      </div>

      <div v-else>
        <!-- Cartes indicateurs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 border-l-4 border-l-sky-600 hover:shadow-xl transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Total interventions</p>
                <p class="text-3xl font-bold text-sky-700">{{ stats.totalInterventions }}</p>
                <p class="text-xs text-emerald-600 mt-1">+{{ stats.interventionsGrowth }}% vs mois dernier</p>
              </div>
              <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 border-l-4 border-l-emerald-600 hover:shadow-xl transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Taux de résolution</p>
                <p class="text-3xl font-bold text-emerald-700">{{ stats.resolutionRate }}%</p>
                <p class="text-xs text-emerald-600 mt-1">+{{ stats.resolutionGrowth }}% vs mois dernier</p>
              </div>
              <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 border-l-4 border-l-orange-600 hover:shadow-xl transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Délai moyen (heures)</p>
                <p class="text-3xl font-bold text-orange-700">{{ stats.avgDelay }}</p>
                <p class="text-xs text-emerald-600 mt-1">{{ stats.delayImprovement >= 0 ? '-' : '+' }}{{ Math.abs(stats.delayImprovement) }}% vs mois dernier</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 border-l-4 border-l-purple-600 hover:shadow-xl transition">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">CA généré</p>
                <p class="text-3xl font-bold text-purple-700">{{ formatPrice(stats.totalRevenue) }} FCFA</p>
                <p class="text-xs text-emerald-600 mt-1">+{{ stats.revenueGrowth }}% vs mois dernier</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Graphiques ligne 1 - Un seul graphique (Top pannes) -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <!-- Pannes récurrentes -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
              <h2 class="text-xl font-bold text-gray-900">🔧 Top 10 pannes récurrentes</h2>
              <select v-model="chartFilters.breakdownPeriod" @change="fetchRecurringBreakdowns" class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500">
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div class="p-6">
              <div v-for="breakdown in recurringBreakdowns" :key="breakdown.name" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700 truncate">{{ breakdown.name }}</span>
                  <span class="font-semibold text-sky-600">{{ breakdown.count }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-sky-500 to-sky-700 h-2 rounded-full" :style="{ width: breakdown.percentage + '%' }"></div>
                </div>
              </div>
              <button @click="showAllBreakdowns = true" class="mt-2 text-sky-600 text-sm font-medium hover:underline">Voir le détail complet →</button>
            </div>
          </div>
        </div>

        <!-- Graphiques ligne 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Évolution CA mensuel -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
              <h2 class="text-xl font-bold text-gray-900">📈 Évolution du CA mensuel</h2>
              <select v-model="chartFilters.revenueYear" @change="fetchMonthlyRevenue" class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500">
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div class="p-6">
              <div class="flex items-end space-x-2 h-48">
                <div v-for="month in monthlyRevenue" :key="month.name" class="flex-1 flex flex-col items-center group">
                  <div class="relative w-full">
                    <div class="bg-gradient-to-t from-sky-500 to-sky-700 w-full rounded-t transition-all duration-300 hover:from-sky-600 hover:to-sky-800" :style="{ height: month.height + 'px' }"></div>
                    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {{ formatPrice(month.amount) }} FCFA
                    </div>
                  </div>
                  <div class="text-xs mt-2 font-medium text-gray-600">{{ month.name }}</div>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-gray-200 text-center text-sm text-gray-500">
                CA total {{ chartFilters.revenueYear }}: <span class="font-bold text-sky-600">{{ formatPrice(totalYearRevenue) }} FCFA</span>
              </div>
            </div>
          </div>

          <!-- Répartition du CA -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">🥧 Répartition du CA par type de service</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">🔧 Dépannage ponctuel</span>
                  <span class="font-semibold text-purple-600">{{ revenueBreakdown.spot }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full" :style="{ width: revenueBreakdown.spot + '%' }"></div>
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ formatPrice(revenueBreakdown.spotAmount) }} FCFA</div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">📑 Contrats maintenance</span>
                  <span class="font-semibold text-emerald-600">{{ revenueBreakdown.contracts }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-emerald-600 h-2 rounded-full" :style="{ width: revenueBreakdown.contracts + '%' }"></div>
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ formatPrice(revenueBreakdown.contractsAmount) }} FCFA</div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">🛒 Vente de pièces</span>
                  <span class="font-semibold text-sky-400">{{ revenueBreakdown.parts }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-sky-400 h-2 rounded-full" :style="{ width: revenueBreakdown.parts + '%' }"></div>
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ formatPrice(revenueBreakdown.partsAmount) }} FCFA</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance des techniciens -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <h2 class="text-xl font-bold text-gray-900">👨‍🔧 Performance des techniciens</h2>
            <select v-model="chartFilters.techPeriod" @change="fetchTechnicianPerformance" class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500">
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Technicien</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Spécialité</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nb interventions</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Taux résolution</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Délai moyen</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Note moyenne</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">CA généré</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="tech in technicianPerformance" :key="tech.name" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ tech.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ tech.specialty }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ tech.interventions }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-20 bg-gray-200 rounded-full h-1.5">
                        <div class="bg-emerald-600 h-1.5 rounded-full" :style="{ width: tech.resolutionRate + '%' }"></div>
                      </div>
                      <span class="text-sm font-medium text-gray-700">{{ tech.resolutionRate }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ tech.avgTime }}h</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1">
                      <span class="text-yellow-500">★</span>
                      <span class="font-medium text-gray-800">{{ tech.rating }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ formatPrice(tech.revenue) }} FCFA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Équipements les plus récurrents en panne + Satisfaction client -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">🖥️ Top 5 équipements les plus récurrents en panne</h2>
            </div>
            <div class="p-6">
              <div v-for="eq in topEquipment" :key="eq.name" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">{{ eq.name }}</span>
                  <span class="font-semibold text-red-600">{{ eq.count }} pannes</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-red-500 h-2 rounded-full" :style="{ width: eq.percentage + '%' }"></div>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500">
                🔍 Les équipements Dell représentent <span class="font-bold text-sky-600">{{ dellPercentage }}%</span> des pannes
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">⭐ Satisfaction client</h2>
            </div>
            <div class="p-6">
              <div class="text-center mb-5">
                <div class="text-5xl font-bold text-yellow-500">{{ satisfaction.avgRating }} ★</div>
                <p class="text-gray-500 text-sm mt-1">sur 5 - {{ satisfaction.totalReviews }} avis</p>
              </div>
              <div class="space-y-3">
                <div v-for="rating in satisfaction.ratings" :key="rating.stars" class="flex items-center gap-3">
                  <div class="w-12 text-sm font-medium text-gray-600">{{ rating.stars }} ★</div>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: rating.percentage + '%' }"></div>
                  </div>
                  <div class="w-12 text-sm text-gray-500">{{ rating.count }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interventions à venir -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">📅 Interventions à venir (prochaines 30 jours)</h2>
          </div>
          <div class="p-6">
            <div v-if="upcomingInterventions.length" class="space-y-3">
              <div v-for="inv in upcomingInterventions" :key="inv.id" class="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <p class="font-semibold text-gray-900">{{ formatDateLong(inv.date) }} - {{ inv.customer }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ inv.type }} • Technicien: {{ inv.technician }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{{ inv.status }}</span>
                  <button @click="viewIntervention(inv.id)" class="text-sky-600 text-sm font-medium hover:underline">Voir →</button>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-400 italic text-center py-4">Aucune intervention prévue dans les 30 prochains jours</p>
          </div>
        </div>
      </div>

      <!-- Modal Détail pannes -->
      <div v-if="showAllBreakdowns" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showAllBreakdowns = false">
        <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Détail complet des pannes</h3>
            <button @click="showAllBreakdowns = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="p-3 text-left text-xs font-bold text-gray-600 uppercase">Type de panne</th>
                  <th class="p-3 text-left text-xs font-bold text-gray-600 uppercase">Nombre</th>
                  <th class="p-3 text-left text-xs font-bold text-gray-600 uppercase">Évolution</th>
                  <th class="p-3 text-left text-xs font-bold text-gray-600 uppercase">Coût moyen</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="b in allBreakdownsDetails" :key="b.name" class="hover:bg-gray-50">
                  <td class="p-3 font-medium text-gray-800">{{ b.name }}</td>
                  <td class="p-3 text-gray-600">{{ b.count }}</td>
                  <td class="p-3">
                    <span :class="b.trend > 0 ? 'text-red-600' : 'text-emerald-600'" class="font-semibold">
                      {{ b.trend > 0 ? '+' : '' }}{{ b.trend }}%
                    </span>
                  </td>
                  <td class="p-3 font-semibold text-gray-800">{{ formatPrice(b.avgCost) }} FCFA</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button @click="exportBreakdowns" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">📥 Exporter</button>
            <button @click="showAllBreakdowns = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Modal Aperçu PDF -->
      <div v-if="showPdfPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showPdfPreview = false">
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Aperçu PDF - Rapport de maintenance</h3>
            <button @click="showPdfPreview = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6">
            <div class="border border-gray-200 rounded-xl p-6 bg-white" style="font-family: Arial, sans-serif;">
              <div class="text-center border-b border-gray-200 pb-4 mb-4">
                <h1 class="text-2xl font-bold text-sky-700">NEO START TECH</h1>
                <p class="text-gray-500">Rapport de maintenance</p>
                <p class="text-sm text-gray-400">Période: {{ filters.dateFrom || 'Début' }} → {{ filters.dateTo || 'Aujourd\'hui' }}</p>
                <p class="text-sm text-gray-400">Généré le {{ new Date().toLocaleDateString() }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="border border-gray-200 rounded-xl p-3">
                  <p class="text-xs text-gray-500">Total interventions</p>
                  <p class="text-xl font-bold text-gray-900">{{ stats.totalInterventions }}</p>
                </div>
                <div class="border border-gray-200 rounded-xl p-3">
                  <p class="text-xs text-gray-500">Taux de résolution</p>
                  <p class="text-xl font-bold text-emerald-700">{{ stats.resolutionRate }}%</p>
                </div>
                <div class="border border-gray-200 rounded-xl p-3">
                  <p class="text-xs text-gray-500">Délai moyen</p>
                  <p class="text-xl font-bold text-orange-700">{{ stats.avgDelay }}h</p>
                </div>
                <div class="border border-gray-200 rounded-xl p-3">
                  <p class="text-xs text-gray-500">CA généré</p>
                  <p class="text-xl font-bold text-purple-700">{{ formatPrice(stats.totalRevenue) }} FCFA</p>
                </div>
              </div>
              <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-2">Top 5 pannes récurrentes</h3>
                <table class="min-w-full border border-gray-200 rounded-lg">
                  <thead class="bg-gray-50">
                    <tr><th class="border p-2 text-left">Type de panne</th><th class="border p-2 text-left">Nombre</th><th class="border p-2 text-left">Pourcentage</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="b in recurringBreakdowns.slice(0,5)" :key="b.name">
                      <td class="border p-2">{{ b.name }}</td>
                      <td class="border p-2">{{ b.count }}</td>
                      <td class="border p-2">{{ b.percentage }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-2">Performance des techniciens</h3>
                <table class="min-w-full border border-gray-200 rounded-lg">
                  <thead class="bg-gray-50">
                    <tr><th class="border p-2">Technicien</th><th class="border p-2">Interventions</th><th class="border p-2">Taux réussite</th><th class="border p-2">Note</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="t in technicianPerformance" :key="t.name">
                      <td class="border p-2">{{ t.name }}</td>
                      <td class="border p-2">{{ t.interventions }}</td>
                      <td class="border p-2">{{ t.resolutionRate }}%</td>
                      <td class="border p-2">{{ t.rating }} ★</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-center text-xs text-gray-400 border-t border-gray-200 pt-4 mt-4">
                <p>Document généré automatiquement par Neo Start Tech - {{ new Date().toLocaleString() }}</p>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-4">
              <button @click="showPdfPreview = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Fermer</button>
              <button @click="downloadPdf" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">📥 Télécharger PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
}

const formatDateLong = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// Filters
const filters = ref({
  dateFrom: "",
  dateTo: "",
  customerId: "",
  technicianId: ""
})

const chartFilters = ref({
  breakdownPeriod: "month",
  revenueYear: "2025",
  techPeriod: "month"
})

const loading = ref(false)
const showAllBreakdowns = ref(false)
const showPdfPreview = ref(false)

// Data
const customersList = ref([])
const techniciansList = ref([])

// DONNÉES STATIQUES CORRIGÉES (sans valeurs négatives)
const stats = ref({
  totalInterventions: 47,
  interventionsGrowth: 12,
  resolutionRate: 94,
  resolutionGrowth: 3,
  avgDelay: 28,
  delayImprovement: 8,
  totalRevenue: 106200,
  revenueGrowth: 15
})

const recurringBreakdowns = ref([
  { name: "Carte mère défectueuse", count: 23, percentage: 100 },
  { name: "Disque dur défaillant", count: 18, percentage: 78 },
  { name: "Surchauffe processeur", count: 14, percentage: 61 },
  { name: "Problème alimentation", count: 9, percentage: 39 },
  { name: "Panne écran", count: 7, percentage: 30 },
  { name: "Carte réseau HS", count: 5, percentage: 22 },
  { name: "Ventilateur défectueux", count: 4, percentage: 17 },
  { name: "RAM défectueuse", count: 3, percentage: 13 },
  { name: "Problème connectique", count: 2, percentage: 9 },
  { name: "Câble endommagé", count: 2, percentage: 9 }
])

const monthlyRevenue = ref([
  { name: "Jan", amount: 850000, height: 45 },
  { name: "Fév", amount: 1200000, height: 63 },
  { name: "Mar", amount: 1050000, height: 55 },
  { name: "Avr", amount: 1350000, height: 71 },
  { name: "Mai", amount: 1520000, height: 80 },
  { name: "Juin", amount: 1850000, height: 97 },
  { name: "Juil", amount: 1700000, height: 89 },
  { name: "Aoû", amount: 1960000, height: 103 },
  { name: "Sep", amount: 2070000, height: 109 },
  { name: "Oct", amount: 2400000, height: 126 },
  { name: "Nov", amount: 2620000, height: 138 },
  { name: "Déc", amount: 3050000, height: 160 }
])

const totalYearRevenue = computed(() => {
  return monthlyRevenue.value.reduce((sum, m) => sum + (m.amount || 0), 0)
})

const revenueBreakdown = ref({
  spot: 35, spotAmount: 106200 * 0.35,
  contracts: 55, contractsAmount: 106200 * 0.55,
  parts: 10, partsAmount: 106200 * 0.10
})

const technicianPerformance = ref([
  { name: "Jean Dupont", specialty: "Informatique", interventions: 23, resolutionRate: 96, avgTime: 24, rating: 4.8, revenue: 1250000 },
  { name: "Marie Koné", specialty: "Réseaux", interventions: 18, resolutionRate: 94, avgTime: 26, rating: 4.7, revenue: 980000 },
  { name: "Amadou Diallo", specialty: "Maintenance", interventions: 15, resolutionRate: 92, avgTime: 29, rating: 4.6, revenue: 820000 },
  { name: "Fatou Sy", specialty: "Serveurs", interventions: 12, resolutionRate: 95, avgTime: 27, rating: 4.9, revenue: 1100000 },
  { name: "Ibrahim Traoré", specialty: "Périphériques", interventions: 10, resolutionRate: 90, avgTime: 31, rating: 4.4, revenue: 550000 }
])

const topEquipment = ref([
  { name: "Dell Optiplex 3080", count: 23, percentage: 100 },
  { name: "HP ProBook 450", count: 18, percentage: 78 },
  { name: "Lenovo ThinkPad", count: 14, percentage: 61 },
  { name: "MacBook Pro", count: 8, percentage: 35 },
  { name: "ASUS Vivobook", count: 6, percentage: 26 }
])

const dellPercentage = computed(() => {
  const dellCount = topEquipment.value.filter(e => e.name.includes("Dell")).reduce((sum, e) => sum + e.count, 0)
  const totalCount = topEquipment.value.reduce((sum, e) => sum + e.count, 0)
  return totalCount > 0 ? Math.round((dellCount / totalCount) * 100) : 0
})

const satisfaction = ref({
  avgRating: 4.7,
  totalReviews: 128,
  ratings: [
    { stars: 5, count: 89, percentage: 70 },
    { stars: 4, count: 28, percentage: 22 },
    { stars: 3, count: 8, percentage: 6 },
    { stars: 2, count: 2, percentage: 1.5 },
    { stars: 1, count: 1, percentage: 0.5 }
  ]
})

const upcomingInterventions = ref([
  { id: 1, date: "2025-05-15", customer: "Société ABC", type: "Réparation serveur", technician: "Jean Dupont", status: "Programmé" },
  { id: 2, date: "2025-05-18", customer: "Entreprise XYZ", type: "Installation réseau", technician: "Marie Koné", status: "En attente" },
  { id: 3, date: "2025-05-22", customer: "Cabinet Medical", type: "Maintenance PC", technician: "Amadou Diallo", status: "Programmé" }
])

const allBreakdownsDetails = ref([
  { name: "Carte mère défectueuse", count: 23, trend: 5, avgCost: 85000 },
  { name: "Disque dur défaillant", count: 18, trend: -2, avgCost: 65000 },
  { name: "Surchauffe processeur", count: 14, trend: 8, avgCost: 35000 },
  { name: "Problème alimentation", count: 9, trend: 0, avgCost: 45000 },
  { name: "Panne écran", count: 7, trend: -5, avgCost: 120000 }
])

// API Functions (avec fallback sur données mockées)
const fetchStats = async () => {
  try {
    const response = await api.get('/reporting/stats', { params: filters.value })
    if (response.data && response.data.totalInterventions !== undefined) {
      stats.value = response.data
    }
  } catch (error) { 
    console.error('Erreur API stats, utilisation des données mockées', error)
  }
}

const fetchRecurringBreakdowns = async () => {
  try {
    const response = await api.get('/reporting/recurring-breakdowns', { params: { period: chartFilters.value.breakdownPeriod } })
    if (response.data.data && response.data.data.length) {
      recurringBreakdowns.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API pannes, utilisation des données mockées', error)
  }
}

const fetchMonthlyRevenue = async () => {
  try {
    const response = await api.get('/reporting/monthly-revenue', { params: { year: chartFilters.value.revenueYear } })
    if (response.data.data && response.data.data.length) {
      monthlyRevenue.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API CA mensuel, utilisation des données mockées', error)
  }
}

const fetchRevenueBreakdown = async () => {
  try {
    const response = await api.get('/reporting/revenue-breakdown', { params: { date_from: filters.value.dateFrom, date_to: filters.value.dateTo } })
    if (response.data && response.data.spot !== undefined) {
      revenueBreakdown.value = response.data
    }
  } catch (error) { 
    console.error('Erreur API répartition CA, utilisation des données mockées', error)
  }
}

const fetchTechnicianPerformance = async () => {
  try {
    const response = await api.get('/reporting/technician-performance', { params: { period: chartFilters.value.techPeriod } })
    if (response.data.data && response.data.data.length) {
      technicianPerformance.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API performance techniciens, utilisation des données mockées', error)
  }
}

const fetchTopEquipment = async () => {
  try {
    const response = await api.get('/reporting/top-equipment')
    if (response.data.data && response.data.data.length) {
      topEquipment.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API top équipements, utilisation des données mockées', error)
  }
}

const fetchSatisfaction = async () => {
  try {
    const response = await api.get('/reporting/satisfaction')
    if (response.data && response.data.avgRating !== undefined) {
      satisfaction.value = response.data
    }
  } catch (error) { 
    console.error('Erreur API satisfaction, utilisation des données mockées', error)
  }
}

const fetchUpcomingInterventions = async () => {
  try {
    const response = await api.get('/reporting/upcoming-interventions')
    if (response.data.data && response.data.data.length) {
      upcomingInterventions.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API interventions à venir, utilisation des données mockées', error)
  }
}

const fetchCustomersList = async () => {
  try {
    const response = await api.get('/reporting/customers-list')
    if (response.data.data && response.data.data.length) {
      customersList.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API clients', error)
    customersList.value = [
      { id: 1, name: "Société ABC" },
      { id: 2, name: "Entreprise XYZ" },
      { id: 3, name: "Cabinet Medical" }
    ]
  }
}

const fetchTechniciansList = async () => {
  try {
    const response = await api.get('/reporting/technicians-list')
    if (response.data.data && response.data.data.length) {
      techniciansList.value = response.data.data
    }
  } catch (error) { 
    console.error('Erreur API techniciens', error)
    techniciansList.value = [
      { id: 1, name: "Jean Dupont" },
      { id: 2, name: "Marie Koné" },
      { id: 3, name: "Amadou Diallo" }
    ]
  }
}

const fetchAllData = async () => {
  loading.value = true
  await Promise.all([
    fetchStats(),
    fetchRecurringBreakdowns(),
    fetchMonthlyRevenue(),
    fetchRevenueBreakdown(),
    fetchTechnicianPerformance(),
    fetchTopEquipment(),
    fetchSatisfaction(),
    fetchUpcomingInterventions()
  ])
  loading.value = false
}

const applyFilters = () => {
  fetchStats()
  fetchRevenueBreakdown()
}

// Export functions
const exportPdf = () => {
  showPdfPreview.value = true
}

const exportExcel = () => {
  alert("📊 Export Excel - Fonctionnalité à venir")
}

const downloadPdf = () => {
  alert("📥 Téléchargement PDF - Fonctionnalité à venir")
}

const exportBreakdowns = () => {
  alert("📥 Export des données - Fonctionnalité à venir")
}

const viewIntervention = (id) => {
  router.push(`/breakdowns/${id}`)
}

onMounted(() => {
  fetchCustomersList()
  fetchTechniciansList()
  fetchAllData()
})
</script>