<template>
	<!-- Ici je crée la structure principale de l'application avec un fond dégradé -->
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">


		<!-- ==================== -->
		<!-- STATISTIQUES -->
		<!-- ==================== -->
		<!-- Section qui affiche les statistiques principales sous forme de cartes -->
		<div class="bg-white/80 backdrop-blur-sm border-b border-blue-100">
			<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
					<!-- Carte : Total des devis -->
					<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-blue-900 mb-1">Total Devis</p>
								<p class="text-3xl font-bold text-blue-900 mt-2">{{ quotes.length }}</p>
								<p class="text-xs text-gray-600 mt-1">Tous les devis</p>
							</div>
							<div class="p-3 rounded-lg bg-blue-500">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Carte : Devis acceptés -->
					<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-green-900 mb-1">Devis Acceptés</p>
								<p class="text-3xl font-bold text-green-900 mt-2">{{quotes.filter(q => q.status === 'Accepté').length
								}}</p>
								<p class="text-xs text-gray-600 mt-1">{{ calculateAcceptanceRate() }}% de taux</p>
							</div>
							<div class="p-3 rounded-lg bg-green-500">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Carte : Devis envoyés -->
					<div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-yellow-900 mb-1">Devis Envoyés</p>
								<p class="text-3xl font-bold text-yellow-900 mt-2">{{quotes.filter(q => q.status === 'Envoyé').length
								}}</p>
								<p class="text-xs text-gray-600 mt-1">En attente de réponse</p>
							</div>
							<div class="p-3 rounded-lg bg-yellow-500">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Carte : Chiffre d'affaires -->
					<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-purple-900 mb-1">Chiffre d'Affaires</p>
								<p class="text-2xl font-bold text-purple-900 mt-2">{{ formatCurrency(calculateTotalCA()) }}</p>
								<p class="text-xs text-gray-600 mt-1">Total acceptés</p>
							</div>
							<div class="p-3 rounded-lg bg-purple-500">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ==================== -->
		<!-- CONTENU PRINCIPAL -->
		<!-- ==================== -->
		<div class="py-8 px-4 sm:px-6 lg:px-8">
			<div class="max-w-7xl mx-auto">

				<!-- Barre de recherche et filtres -->
				<div class="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
					<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
						<!-- Titre et description -->
						<div class="flex items-center space-x-4">
							<div class="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-2xl shadow-lg">
								<i class="fas fa-search text-white text-xl"></i>
							</div>
							<div>
								<h2 class="text-2xl font-bold text-gray-800">Liste des Devis</h2>
								<p class="text-gray-600">Gérez l'ensemble de vos devis techniques</p>
							</div>
						</div>

						<!-- Champ de recherche et compteur -->
						<div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
							<div class="relative w-full lg:w-96">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<i class="fas fa-search text-gray-400"></i>
								</div>
								<input v-model="searchQuery" type="text" placeholder="Rechercher un devis par client, référence..."
									class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm">
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
									<th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Référence
									</th>
									<th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Client
									</th>
									<th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Date</th>
									<th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Montant
									</th>
									<th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Statut
									</th>
									<th class="px-8 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Actions
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-100">
								<!-- Je boucle sur chaque devis filtré pour afficher les lignes du tableau -->
								<tr v-for="quote in filteredQuotes" :key="quote.id"
									class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group">
									<!-- Numéro de référence du devis -->
									<td class="px-8 py-6 whitespace-nowrap">
										<div class="text-sm font-medium text-blue-600">#{{ quote.quote_number }}</div>
									</td>

									<!-- Informations du client -->
									<td class="px-8 py-6 whitespace-nowrap">
										<div class="flex items-center">
											<!-- Avatar du client avec ses initiales -->
											<div
												class="flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
												<span class="text-white font-bold text-sm">
													{{ getClientInitials(quote.client) }}
												</span>
											</div>
											<div class="ml-4">
												<div
													class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
													{{ quote.client?.first_name }} {{ quote.client?.last_name }}
												</div>
												<div class="text-xs text-gray-500">{{ quote.client?.company_name }}</div>
											</div>
										</div>
									</td>

									<!-- Date du devis -->
									<td class="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
										{{ formatDate(quote.date) }}
									</td>

									<!-- Montant total TTC -->
									<td class="px-8 py-6 whitespace-nowrap">
										<div class="text-sm font-bold text-gray-900">{{ formatCurrency(quote.total_ttc) }}</div>
									</td>

									<!-- Statut avec couleur appropriée -->
									<td class="px-8 py-6 whitespace-nowrap">
										<span
											:class="`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm transition-all duration-300 ${getStatusColor(quote.status)}`">
											<i :class="`fas ${getStatusIcon(quote.status)} mr-2`"></i>
											{{ quote.status }}
										</span>
									</td>

									<!-- Boutons d'actions -->
									<td class="px-8 py-6 whitespace-nowrap text-sm font-medium">
										<div class="flex space-x-3">
											<!-- Voir les détails -->
											<button @click="viewQuote(quote)"
												class="text-blue-600 hover:text-blue-800 p-3 rounded-2xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
												title="Voir plus">
												<i class="fas fa-eye text-lg"></i>
											</button>

											<!-- Modifier le devis -->
											<button @click="editQuote(quote)"
												class="text-yellow-600 hover:text-yellow-800 p-3 rounded-2xl hover:bg-yellow-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
												title="Modifier">
												<i class="fas fa-edit text-lg"></i>
											</button>

											<!-- Générer un PDF -->
											<button @click="generatePDF(quote.id)"
												class="text-green-600 hover:text-green-800 p-3 rounded-2xl hover:bg-green-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
												title="Générer PDF">
												<i class="fas fa-file-pdf text-lg"></i>
											</button>

											<!-- Supprimer le devis -->
											<button @click="deleteQuote(quote.id)"
												class="text-red-600 hover:text-red-800 p-3 rounded-2xl hover:bg-red-100 transition-all duration-300 transform hover:scale-110 shadow-sm group"
												title="Supprimer">
												<i class="fas fa-trash text-lg"></i>
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Message quand aucun devis n'est trouvé -->
					<div v-if="filteredQuotes.length === 0" class="text-center py-16">
						<div class="max-w-md mx-auto">
							<div
								class="bg-gradient-to-r from-blue-100 to-green-100 w-32 h-32 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg">
								<i class="fas fa-file-invoice text-blue-500 text-4xl"></i>
							</div>
							<h3 class="text-2xl font-bold text-gray-900 mb-3">Aucun devis trouvé</h3>
							<p class="text-gray-500 mb-6 text-lg">Commencez par créer votre premier devis.</p>
							<button @click="showCreateForm = true"
								class="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
								<i class="fas fa-plus-circle mr-3"></i>
								Créer un devis
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ==================== -->
		<!-- MODAL DE CRÉATION -->
		<!-- ==================== -->
		<!-- Je crée un overlay modal pour créer un nouveau devis -->
		<QuoteForm :createQuote="createQuote" :newQuote="newQuote" :isClientLoading="isClientLoading" :clients="clients"
			:getClientName="getClientName" :addNewItem="addNewItem" :removeNewItem="removeNewItem"
			:formatCurrency="formatCurrency" :calculateSubtotal="calculateSubtotal" :calculateVAT="calculateVAT"
			:calculateTotal="calculateTotal" v-model:showCreateForm="showCreateForm" v-model:creatingQuote="creatingQuote" />

		<!-- ==================== -->
		<!-- MODAL DE VISUALISATION -->
		<!-- ==================== -->
		<!-- Modal pour visualiser les détails d'un devis -->
		<div v-if="viewingQuote" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
				<div class="p-8">
					<!-- En-tête -->
					<div class="flex justify-between items-center mb-6">
						<div>
							<h2 class="text-2xl font-bold text-gray-800">Devis #{{ viewingQuote.quote_number }}</h2>
							<p class="text-gray-600 mt-2">Détails du devis</p>
						</div>
						<button @click="viewingQuote = null"
							class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl">
							<i class="fas fa-times text-xl"></i>
						</button>
					</div>

					<!-- Informations client et détails -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						<!-- Carte client -->
						<div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
							<h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
								<i class="fas fa-user mr-3 text-blue-500"></i>
								Client
							</h3>
							<div class="space-y-3">
								<p class="font-medium text-gray-900">{{ viewingQuote.client?.first_name }} {{
									viewingQuote.client?.last_name
								}}</p>
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

						<!-- Carte détails du devis -->
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
									<span
										:class="`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusColor(viewingQuote.status)}`">
										<i :class="`fas ${getStatusIcon(viewingQuote.status)} mr-2`"></i>
										{{ viewingQuote.status }}
									</span>
								</div>
								<div>
									<p class="text-sm text-gray-600">Validité</p>
									<p class="font-medium text-gray-900">{{ viewingQuote.validity }} jours</p>
								</div>
								<div>
									<p class="text-sm text-gray-600">TVA</p>
									<p class="font-medium text-gray-900">{{ viewingQuote.vat_rate }}%</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Tableau des articles -->
					<div class="mb-8">
						<h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
							<i class="fas fa-list-ul mr-3 text-blue-500"></i>
							Articles
						</h3>
						<div class="overflow-x-auto border-2 border-gray-200 rounded-2xl">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gradient-to-r from-gray-50 to-blue-50">
									<tr>
										<th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
											Description
										</th>
										<th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
											Quantité
										</th>
										<th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prix
											unitaire</th>
										<th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total
										</th>
									</tr>
								</thead>
								<tbody class="bg-white divide-y divide-gray-200">
									<tr v-for="(item, index) in viewingQuote.items" :key="index"
										class="hover:bg-gray-50 transition-colors">
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.description }}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(item.unit_price) }}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{
											formatCurrency(item.quantity * item.unit_price) }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Récapitulatif des totaux -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div class="md:col-span-2"></div>
						<div class="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6">
							<div class="space-y-3">
								<div class="flex justify-between items-center py-2 border-b border-blue-200">
									<span class="font-medium text-gray-700">Sous-total HT</span>
									<span class="font-bold text-blue-600">{{ formatCurrency(calculateSubtotal(viewingQuote.items))
									}}</span>
								</div>
								<div class="flex justify-between items-center py-2 border-b border-blue-200">
									<span class="font-medium text-gray-700">TVA ({{ viewingQuote.vat_rate }}%)</span>
									<span class="font-bold text-green-600">{{ formatCurrency(calculateVAT(viewingQuote.items,
										viewingQuote.vat_rate)) }}</span>
								</div>
								<div class="flex justify-between items-center py-3 bg-white rounded-xl px-4">
									<span class="font-bold text-lg text-gray-800">Total TTC</span>
									<span class="font-bold text-lg text-blue-700">{{ formatCurrency(calculateTotal(viewingQuote.items,
										viewingQuote.vat_rate)) }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Notes (si présentes) -->
					<div v-if="viewingQuote.notes" class="mb-8">
						<h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
							<i class="fas fa-sticky-note mr-3 text-yellow-500"></i>
							Notes
						</h3>
						<div class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
							<p class="text-gray-700 whitespace-pre-line">{{ viewingQuote.notes }}</p>
						</div>
					</div>

					<!-- Boutons d'action -->
					<div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
						<button @click="generatePDF(viewingQuote.id)"
							class="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
							<i class="fas fa-file-pdf mr-3"></i>
							Générer PDF
						</button>
						<button @click="editQuote(viewingQuote)"
							class="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
							<i class="fas fa-edit mr-3"></i>
							Modifier
						</button>
						<button @click="viewingQuote = null"
							class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300">
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- ==================== -->
		<!-- MODAL DE MODIFICATION -->
		<!-- ==================== -->
		<!-- Modal pour modifier un devis existant (structure similaire au modal de création) -->
		<div v-if="editingQuote" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
				<div class="p-8">
					<div class="flex justify-between items-center mb-6">
						<div>
							<h2 class="text-2xl font-bold text-gray-800">Modifier le devis #{{ editingQuote.quote_number }}</h2>
							<p class="text-gray-600 mt-2">Modifiez les informations du devis</p>
						</div>
						<button @click="editingQuote = null"
							class="text-gray-400 hover:text-gray-500 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-xl">
							<i class="fas fa-times text-xl"></i>
						</button>
					</div>

					<!-- Formulaire de modification (identique au formulaire de création mais avec les données existantes) -->
					<form @submit.prevent="updateQuote" class="space-y-6">
						<!-- [Le contenu du formulaire est similaire au formulaire de création] -->
						<!-- Informations client -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-3">Client *</label>
								<select v-model="editingQuote.client_id" required
									class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
									:disabled="isClientLoading">
									<option value="">Sélectionner un client</option>
									<option v-for="client in clients" :key="client.id" :value="client.id">
										{{ getClientName(client) }}
									</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-3">Date *</label>
								<input v-model="editingQuote.date" type="date" required
									class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
							</div>
						</div>

						<!-- Statut et validité -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-3">Statut *</label>
								<select v-model="editingQuote.status" required
									class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
									<option value="Brouillon">Brouillon</option>
									<option value="Envoyé">Envoyé</option>
									<option value="Accepté">Accepté</option>
									<option value="Refusé">Refusé</option>
									<option value="Facturé">Facturé</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-3">Validité (jours) *</label>
								<input v-model.number="editingQuote.validity" type="number" min="1" required
									class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
							</div>
						</div>

						<!-- Taux de TVA -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 mb-3">Taux de TVA (%) *</label>
							<input v-model.number="editingQuote.vat_rate" type="number" step="0.01" min="0" required
								class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
						</div>

						<!-- Articles -->
						<div class="border-2 border-gray-200 rounded-2xl p-6">
							<div class="flex justify-between items-center mb-6">
								<h3 class="text-lg font-semibold text-gray-800 flex items-center">
									<i class="fas fa-list-ul mr-3 text-blue-500"></i>
									Articles *
								</h3>
								<button type="button" @click="addItem"
									class="flex items-center text-sm bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
									<i class="fas fa-plus mr-2"></i>
									Ajouter un article
								</button>
							</div>

							<div v-for="(item, index) in editingQuote.items" :key="index"
								class="grid grid-cols-12 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
								<div class="col-span-5">
									<input v-model="item.description" type="text" placeholder="Description *" required
										class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
								</div>
								<div class="col-span-2">
									<input v-model.number="item.quantity" type="number" step="0.01" min="0.01" placeholder="Quantité *"
										required
										class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
								</div>
								<div class="col-span-3">
									<input v-model.number="item.unit_price" type="number" step="0.01" min="0"
										placeholder="Prix unitaire *" required
										class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
								</div>
								<div class="col-span-2 flex items-center justify-end">
									<button type="button" @click="removeItem(index)"
										class="text-red-500 hover:text-red-700 p-2 transition-colors duration-300"
										:disabled="editingQuote.items.length === 1">
										<i class="fas fa-trash text-lg"></i>
									</button>
								</div>
								<div class="col-span-12 mt-3 text-sm font-semibold text-gray-700">
									<i class="fas fa-calculator mr-2 text-green-500"></i>
									Total: {{ formatCurrency(item.quantity * item.unit_price) }}
								</div>
							</div>
						</div>

						<!-- Notes -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 mb-3">Notes</label>
							<textarea v-model="editingQuote.notes" rows="4"
								class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
								placeholder="Notes supplémentaires..."></textarea>
						</div>

						<!-- Conditions générales et modalités de paiement -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-3">Conditions générales</label>
								<textarea v-model="editingQuote.terms_conditions" rows="3"
									class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
									placeholder="Conditions générales..."></textarea>
							</div>
							<div>
								<label class="block text-sm font-semibold text-gray-700 mb-3">Modalités de paiement</label>
								<textarea v-model="editingQuote.payment_terms" rows="3"
									class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
									placeholder="Modalités de paiement..."></textarea>
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
									<span class="font-bold text-blue-600">{{ formatCurrency(calculateSubtotal(editingQuote.items))
									}}</span>
								</div>
								<div class="flex justify-between items-center py-3 border-b border-blue-200">
									<span class="font-medium text-gray-700">TVA ({{ editingQuote.vat_rate }}%)</span>
									<span class="font-bold text-green-600">{{ formatCurrency(calculateVAT(editingQuote.items,
										editingQuote.vat_rate)) }}</span>
								</div>
								<div class="flex justify-between items-center py-3 bg-white rounded-xl px-4">
									<span class="font-bold text-lg text-gray-800">Total TTC</span>
									<span class="font-bold text-lg text-blue-700">{{ formatCurrency(calculateTotal(editingQuote.items,
										editingQuote.vat_rate)) }}</span>
								</div>
							</div>
						</div>

						<!-- Boutons d'action -->
						<div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
							<button type="button" @click="editingQuote = null"
								class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300">
								Annuler
							</button>
							<button type="submit" :disabled="updatingQuote"
								class="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center">
								<i v-if="updatingQuote" class="fas fa-spinner fa-spin mr-3"></i>
								<i v-else class="fas fa-save mr-3"></i>
								{{ updatingQuote ? 'Mise à jour...' : 'Mettre à jour' }}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<!-- ==================== -->
		<!-- OVERLAY DE CHARGEMENT -->
		<!-- ==================== -->
		<div v-if="isQuoteLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white p-8 rounded-3xl shadow-2xl flex items-center space-x-4">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span class="text-gray-700 font-semibold">Chargement...</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Je importe les fonctions nécessaires de Vue
import { ref, computed, onMounted } from 'vue'
// Je importe Axios pour faire des requêtes HTTP
import axios from 'axios'
import Swal from 'sweetalert2'
import { useQuoteStore } from '@/stores/Maintenance/QuoteStore'
import { getClientName } from '~/models/Client'
import { initQuoteForm, QuoteStatusEnum, type Quote } from '~/models/Quote'
import QuoteForm from '../../components/maintenance/QuoteForm.vue'

// ==================== //
// CONFIGURATION API    //
// ==================== //
// Je configure Axios pour communiquer avec mon API backend
const api = axios.create({
	baseURL: 'http://localhost:8000/api', // URL de base de mon API
	headers: {
		'Content-Type': 'application/json', // Je spécifie que j'envoie du JSON
	}
})

// ==================== //
// ÉTATS RÉACTIFS       //
// ==================== //
// Je déclare toutes les variables réactives qui stockent l'état de mon application

const clientStore = useClientStore();
const quoteStore = useQuoteStore();
const enterpriseStore = useEnterpriseStore();

const { clients, isLoading: isClientLoading } = storeToRefs(clientStore);
const { quotes, isLoading: isQuoteLoading, isSaving: creatingQuote } = storeToRefs(quoteStore);
const { enterprises, isLoading: isEnterpriseLoading } = storeToRefs(enterpriseStore);

// États de l'interface
const searchQuery = ref('')         // Texte de recherche
const viewingQuote = ref(null)      // Devis en cours de visualisation
const editingQuote = ref(null)      // Devis en cours de modification
const showCreateForm = ref(false)   // Affichage du formulaire de création

// États des opérations
const updatingQuote = ref(false)    // En cours de mise à jour

// ==================== //
// NOUVEAU DEVIS        //
// ==================== //
// Je définis la structure par défaut d'un nouveau devis
const newQuote = ref<Quote>(initQuoteForm());

// ==================== //
// CALCULS ET FILTRES   //
// ==================== //
// Je crée des propriétés calculées qui se mettent à jour automatiquement

// Filtrage des devis selon la recherche
const filteredQuotes = computed(() => {
	// Si pas de recherche, je retourne tous les devis
	if (!searchQuery.value) {
		return quotes.value
	}

	// Je convertis la recherche en minuscules pour une comparaison insensible à la casse
	const query = searchQuery.value.toLowerCase()

	// Je filtre les devis selon plusieurs critères
	return quotes.value.filter(quote => {
		const clientName = `${quote.client?.first_name || ''} ${quote.client?.last_name || ''}`.toLowerCase()
		const companyName = quote.client?.company_name?.toLowerCase() || ''
		const quoteNumber = quote.quote_number?.toLowerCase() || ''

		// Je vérifie si la recherche correspond au nom du client, à l'entreprise ou au numéro de devis
		return clientName.includes(query) ||
			companyName.includes(query) ||
			quoteNumber.includes(query)
	})
})

// ==================== //
// FONCTIONS DE CALCUL  //
// ==================== //

// Je calcule le sous-total HT d'une liste d'articles
const calculateSubtotal = (items: Array<{ quantity: number, unit_price: number }>) => {
	// Si pas d'articles, je retourne 0
	if (!items || !Array.isArray(items)) return 0

	// Je additionne le total de chaque article (quantité * prix unitaire)
	return items.reduce((sum, item) => {
		const quantity = item.quantity || 0
		const unitPrice = item.unit_price || 0
		return sum + (quantity * unitPrice)
	}, 0)
}

// Je calcule le montant de la TVA
const calculateVAT = (items: Array<{ quantity: number, unit_price: number }>, vatRate = 20) => {
	const subtotal = calculateSubtotal(items)
	return subtotal * (parseFloat(vatRate) / 100)
}

// Je calcule le total TTC
const calculateTotal = (items: Array<{ quantity: number, unit_price: number }>, vatRate = 20) => {
	const subtotal = calculateSubtotal(items)
	const vatAmount = calculateVAT(items, vatRate)
	return subtotal + vatAmount
}

// Je calcule le chiffre d'affaires total
const calculateTotalCA = () => {
	return quotes.value.reduce((sum, quote) => {
		return sum + (quote.total_ttc || 0)
	}, 0)
}

// Je calcule le taux d'acceptation des devis
const calculateAcceptanceRate = () => {
	const totalQuotes = quotes.value.length
	const acceptedQuotes = quotes.value.filter(q => q.status === 'Accepté').length
	if (totalQuotes === 0) return 0
	return ((acceptedQuotes / totalQuotes) * 100).toFixed(1)
}

// ==================== //
// FONCTIONS D'AFFICHAGE //
// ==================== //

// Je formate un montant en devise
const formatCurrency = (amount: number) => {
	if (!amount && amount !== 0) return '0 fcfa'
	const number = amount
	if (isNaN(number)) return '0 fcfa'
	return new Intl.NumberFormat('fr-FR', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(number) + ' f CFA'
}

// ==================== //
// GESTION ENTREPRISE   //
// ==================== //

// Je charge les informations de l'entreprise
const loadCompany = async () => {
	try {
		await enterpriseStore.getOneEntreprise("");
	} catch (error) {
		console.error('❌ Erreur lors du chargement de l\'entreprise:', error)
		Swal.fire({
			icon: "error",
			text: "Une erreur est survenue lors de la récupération des entreprises"
		});
	}
}

// Je crée une entreprise par défaut si aucune n'existe
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
			enterprises.value = [response.data.data]
			newQuote.value.company_id = response.data.data.id
			console.log('✅ Entreprise par défaut créée:', response.data.data)
		}
	} catch (error) {
		console.error('❌ Erreur lors de la création de l\'entreprise par défaut:', error)
		newQuote.value.company_id = 1
		console.warn('⚠️ Utilisation de company_id = 1 par défaut')
	}
}

// ==================== //
// FONCTIONS API        //
// ==================== //

// Je charge la liste des devis depuis l'API
const loadQuotes = async () => {
	try {
		await quoteStore.fetchAll();
	} catch (error: any) {
		console.error('Erreur lors du chargement des devis:', error)
		Swal.fire({
			icon: "error",
			text: 'Erreur lors du chargement des devis: ' + error.message
		})
	}
}

// Je charge la liste des clients depuis l'API
const loadClients = async () => {
	try {
		await clientStore.fetchAll();
	} catch (error: any) {
		Swal.fire({
			icon: 'error',
			text: 'Erreur lors du chargement des clients: ' + error.message
		})
	}
}

// Je crée un nouveau devis
const createQuote = async () => {
	try {
		creatingQuote.value = true

		// Vérification que l'entreprise est configurée
		if (!newQuote.value.client.id) {
			Swal.fire({
				icon: "error",
				text: 'Erreur: Aucune entreprise configurée. Veuillez contacter l\'administrateur.'
			});
			return;
		}

		// Validation des articles
		const validItems = newQuote.value.items.every(item =>
			item.description && item.quantity > 0 && item.unit_price >= 0
		)

		if (!validItems) {
			Swal.fire({
				icon: "error",
				text: 'Veuillez remplir tous les articles correctement'
			});
			return;
		}

		if (!newQuote.value.client_id) {
			Swal.fire({
				icon: "error",
				text: 'Veuillez sélectionner un client'
			});
			return
		}

		// Préparation des données pour l'API
		const quoteData = {
			client_id: newQuote.value.client_id,
			date: newQuote.value.date,
			validity: newQuote.value.validity,
			status: newQuote.value.status,
			vat_rate: parseFloat(newQuote.value.vat_rate),
			notes: newQuote.value.notes || '',
			terms_conditions: newQuote.value.terms_conditions || '',
			payment_terms: newQuote.value.payment_terms || '',
			items: newQuote.value.items.map(item => ({
				article_id: item.id,
				quantity: parseFloat(item.quantity),
				unit_price: parseFloat(item.unit_price)
			}))
		}

		// console.log("quoteData:", quoteStore.store(quoteData));
		
		await quoteStore.store(quoteData);
		Swal.fire({
			icon: "success",
			text: "Devis ajouté avec succès"
		});
	} catch (error) {
		Swal.fire({
			icon: "error",
			text: "Une erreur esr survenue lors de l'enregistrement du devis"
		});
	} finally {
		creatingQuote.value = false
	}
}

// Je mets à jour un devis existant
const updateQuote = async () => {
	try {
		updatingQuote.value = true

		// Préparation des données
		const quoteData = {
			client_id: editingQuote.value.client_id,
			date: editingQuote.value.date,
			validity: editingQuote.value.validity,
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

// Je supprime un devis
const deleteQuote = async (id) => {
	// Confirmation de l'utilisateur
	if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.')) {
		return
	}

	try {
		console.log(`🗑️ Tentative de suppression du devis ID: ${id}`)

		// Je essaie différents endpoints au cas où
		let response
		try {
			response = await api.delete(`/deleteQuote/${id}`)
		} catch (firstError) {
			console.warn('⚠️ Premier endpoint échoué, essai avec endpoint alternatif...')
			try {
				response = await api.delete(`/quotes/${id}`)
			} catch (secondError) {
				console.warn('⚠️ Deuxième endpoint échoué, essai avec méthode POST...')
				response = await api.post(`/deleteQuote/${id}`)
			}
		}

		console.log('✅ Réponse suppression:', response.data)

		if (response.data.success) {
			await loadQuotes()
			alert('✅ Devis supprimé avec succès')
		} else {
			console.error('❌ Erreur API lors de la suppression:', response.data)
			alert('❌ ' + (response.data.message || 'Erreur lors de la suppression du devis'))
		}
	} catch (error) {
		console.error('❌ Erreur détaillée lors de la suppression:', error)

		// Gestion détaillée des erreurs
		if (error.response) {
			const status = error.response.status
			const data = error.response.data

			console.error(`📊 Statut: ${status}`, data)

			switch (status) {
				case 404:
					alert('❌ Devis non trouvé. Il a peut-être déjà été supprimé.')
					await loadQuotes()
					break
				case 500:
					alert('❌ Erreur serveur. Le devis ne peut pas être supprimé car il est probablement lié à d\'autres données (factures, etc.).')
					break
				case 422:
					alert('❌ Erreur de validation: ' + (data.message || 'Données invalides'))
					break
				default:
					alert('❌ Erreur lors de la suppression: ' + (data.message || `Erreur ${status}`))
			}
		} else if (error.request) {
			console.error('🌐 Pas de réponse du serveur:', error.request)
			alert('❌ Impossible de contacter le serveur. Vérifiez votre connexion.')
		} else {
			console.error('⚡ Erreur de configuration:', error.message)
			alert('❌ Erreur de configuration: ' + error.message)
		}
	}
}

// Je génère un PDF pour un devis
const generatePDF = async (id) => {
	try {
		isQuoteLoading.value = true
		console.log('Tentative de génération PDF pour devis ID:', id)

		const response = await api.get(`/generatePDF/${id}`, {
			responseType: 'blob', // Je attends un fichier binaire
			timeout: 15000 // Timeout de 15 secondes
		})

		console.log('Réponse PDF reçue, type:', response.headers['content-type'])

		// Vérification que c'est bien un PDF
		if (response.headers['content-type'] !== 'application/pdf') {
			const text = await response.data.text()
			try {
				const errorData = JSON.parse(text)
				throw new Error(errorData.message || 'Le serveur a retourné une erreur')
			} catch {
				throw new Error('Le serveur n\'a pas retourné un PDF valide')
			}
		}

		// Création et téléchargement du PDF
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

		// Nettoyage de l'URL
		setTimeout(() => {
			window.URL.revokeObjectURL(url)
		}, 100)

		console.log('PDF généré et téléchargé avec succès')

	} catch (error) {
		console.error('Erreur détaillée PDF:', error)

		// Fallback : génération côté client si le serveur échoue
		if (error.response?.status === 500 || error.code === 'ECONNABORTED') {
			console.log('Tentative de génération PDF côté client...')
			await generateClientSidePDF(id)
		} else if (error.response?.status === 404) {
			alert('Devis non trouvé.')
		} else {
			alert('Erreur lors de la génération du PDF: ' + error.message)
		}
	} finally {
		isQuoteLoading.value = false
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

		// Ouverture dans une nouvelle fenêtre et impression
		const printWindow = window.open('', '_blank')
		printWindow.document.write(htmlContent)
		printWindow.document.close()

		setTimeout(() => {
			printWindow.print()
		}, 500)

	} catch (error) {
		console.error('Erreur génération PDF côté client:', error)
		alert('Erreur lors de la génération du PDF. Vous pouvez utiliser la fonction d\'impression de votre navigateur.')

		// Dernière tentative
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

// Création du contenu HTML pour le PDF
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
                <p><strong>Validité:</strong> ${quote.validity} jours</p>
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

// ==================== //
// FONCTIONS INTERFACE  //
// ==================== //

// Je visualise un devis
const viewQuote = (quote) => {
	viewingQuote.value = quote
}

// Je modifie un devis
const editQuote = (quote) => {
	// Je crée une copie pour éviter de modifier l'original directement
	editingQuote.value = JSON.parse(JSON.stringify(quote))

	// Je m'assure que tous les champs sont présents
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

// J'ajoute un article dans le formulaire de modification
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

// Je supprime un article dans le formulaire de modification
const removeItem = (index) => {
	if (editingQuote.value.items.length > 1) {
		editingQuote.value.items.splice(index, 1)
	}
}

// J'ajoute un article dans le formulaire de création
const addNewItem = () => {
	newQuote.value.items.push({
		description: '',
		quantity: 1,
		unit_price: 0
	})
}

// Je supprime un article dans le formulaire de création
const removeNewItem = (index) => {
	if (newQuote.value.items.length > 1) {
		newQuote.value.items.splice(index, 1)
	}
}

// Je réinitialise le formulaire de création
const resetNewQuote = () => {
	newQuote.value = {
		client_id: '',
		company_id: newQuote.value.company_id,
		date: new Date().toISOString().split('T')[0],
		validity: 30,
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

// ==================== //
// FONCTIONS UTILITAIRES //
// ==================== //

// Je formate une date en français
const formatDate = (dateString) => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

// Je retourne la couleur CSS selon le statut
const getStatusColor = (status: QuoteStatusEnum) => {
	switch (status) {
		case QuoteStatusEnum.SENT: return 'bg-blue-100 text-blue-800'
		case QuoteStatusEnum.ACCEPTED: return 'bg-green-100 text-green-800'
		case QuoteStatusEnum.REFUSED: return 'bg-red-100 text-red-800'
		default: return 'bg-blue-100 text-blue-800'
	}
}

// Je retourne l'icône selon le statut
const getStatusIcon = (status: QuoteStatusEnum) => {
	switch (status) {
		case QuoteStatusEnum.SENT: return 'fa-paper-plane'
		case QuoteStatusEnum.ACCEPTED: return 'fa-check-circle'
		case QuoteStatusEnum.REFUSED: return 'fa-times-circle'
		default: return 'fa-question-circle'
	}
}

// Je génère les initiales d'un client
const getClientInitials = (client?: Client) => {
	if (!client) return '?'
	return getClientName(client)
}

// ==================== //
// INITIALISATION       //
// ==================== //
// Je charge les données quand le composant est monté
onMounted(async () => {
	await loadCompany()   // D'abord l'entreprise
	await loadQuotes()    // Puis les devis
	await loadClients()   // Enfin les clients
})
</script>

<style>
/* Je importe les icônes Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* ==================== */
/* STYLES PERSONNALISÉS */
/* ==================== */

/* Personnalisation de la scrollbar */
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

/* Animation d'apparition */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fadeIn 0.5s ease-out;
}

/* Transitions pour les modaux */
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

/* Responsive design */
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
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
