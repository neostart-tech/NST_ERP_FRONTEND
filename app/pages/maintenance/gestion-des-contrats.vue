<template>
	<!-- Je crée l'interface principale avec un fond gris clair -->
	<div class="min-h-screen bg-gray-50">

		<!-- ==================== -->
		<!-- CONTENU PRINCIPAL -->
		<!-- ==================== -->
		<main class="container mx-auto px-4 py-6">
			<!-- Titre et boutons d'action -->
			<div class="flex justify-between items-center mb-6">
				<div class="text-2xl font-bold text-gray-800">Liste des Contrats</div>
				<div class="flex space-x-3">
					<!-- Bouton Nouveau contrat -->
					<button @click="showContractForm = true; isEditing = false"
						class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clip-rule="evenodd" />
						</svg>
						Nouveau contrat
					</button>

					<!-- Bouton Lettre de contrat -->
					<button @click="showLetterModal = true"
						class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						Lettre de contrat
					</button>


				</div>
			</div>

			<!-- ==================== -->
			<!-- ALERTES ET NOTIFICATIONS -->
			<!-- ==================== -->
			<div class="mb-6 space-y-3">
				<!-- Alerte bleue pour les informations -->
				<div class="bg-blue-50 border-l-4 border-blue-400 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
									clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-blue-800">Informations</h3>
							<div class="mt-2 text-sm text-blue-700">
								<p>Vous avez <span class="font-semibold">{{ upcomingInterventions.length }} interventions</span>
									programmées dans les 7 prochains jours.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ContractForm :showContractForm="showContractForm" :isEditing="isEditing" :closeContractForm="closeContractForm"
				:submitContractForm="submitContractForm" :newContract="newContract" :clients="clients" />

			<!-- ==================== -->
			<!-- FILTRES ET RECHERCHE -->
			<!-- ==================== -->
			<div class="bg-white shadow-sm rounded-lg p-4 mb-6">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Filtre par statut -->
					<div>
						<label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
						<select id="status-filter" v-model="filters.status"
							class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
							<option value="">Tous</option>
							<option value="active">Actif</option>
							<option value="pending">En attente</option>
							<option value="expired">Expiré</option>
							<option value="inactive">Refusé</option>
						</select>
					</div>

					<!-- Filtre par formule -->
					<!-- <div>
						<label for="formula-filter" class="block text-sm font-medium text-gray-700 mb-1">Formule</label>
						<select id="formula-filter" v-model="filters.formula"
							class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
							<option value="">Toutes</option>
							<option value="basique">Basique</option>
							<option value="standard">Standard</option>
							<option value="premium">Premium</option>
							<option value="promotion">Promotion</option>
							<option value="personnalise">Personnalisé</option>
						</select>
					</div> -->

					<!-- Filtre par client -->
					<div>
						<label for="client-filter" class="block text-sm font-medium text-gray-700 mb-1">Client</label>
						<select id="client-filter" v-model="filters.client"
							class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
							<option value="">Tous</option>
							<option v-for="client in clients" :key="client.id" :value="client.id">
								{{ getClientName(client) }}
							</option>
						</select>
					</div>

					<!-- Champ de recherche -->
					<div>
						<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
						<div class="relative">
							<input type="text" id="search" v-model="filters.search" placeholder="Rechercher..."
								class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
							<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
									fill="currentColor">
									<path fill-rule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clip-rule="evenodd" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- ==================== -->
			<!-- TABLEAU DES CONTRATS -->
			<!-- ==================== -->
			<div class="bg-white shadow overflow-hidden sm:rounded-lg">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<!-- En-tête du tableau -->
						<thead class="bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Référence</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Client</th>
								<!-- <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Formule</th> -->
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Dates</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Montant</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Statut</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions</th>
							</tr>
						</thead>

						<!-- Corps du tableau -->
						<tbody class="bg-white divide-y divide-gray-200">
							<!-- Je boucle sur chaque contrat filtré -->
							<tr v-for="contract in filteredContracts" :key="contract.id" class="hover:bg-gray-50">
								<!-- Référence du contrat -->
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ contract.reference_number
								}}</td>

								<!-- Nom du client -->
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getClientName(contract.client!) }}
								</td>

								<!-- Formule -->
								<!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{{ contract.formula }}</td> -->

								<!-- Dates de début et fin -->
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div>Début: {{ formatDate(contract.start_date) }}</div>
									<div>Fin: {{ formatDate(contract.end_date) }}</div>
								</td>

								<!-- Montant et fréquence -->
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ contract.amount }}fcfa
									<div class="text-xs text-gray-400">{{ contractStatusToString(contract.frequency) }}</div>
								</td>

								<!-- Statut avec badge coloré -->
								<td class="px-6 py-4 whitespace-nowrap">
									<span :class="getStatusClass(contract.status)"
										class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
										{{ getStatusText(contract.status) }}
									</span>
								</td>

								<!-- Boutons d'actions -->
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div class="flex space-x-2">
										<!-- Bouton Voir -->
										<button @click="viewContract(contract)" class="text-blue-600 hover:text-blue-900" title="Voir">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</button>

										<!-- Bouton Modifier -->
										<button @click="editContract(contract)" class="text-green-600 hover:text-green-900"
											title="Modifier">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>

										<!-- Bouton Générer calendrier -->
										<button @click="generateCalendar(contract)" class="text-purple-600 hover:text-purple-900"
											title="Générer calendrier">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</button>

										<!-- Bouton Générer PDF -->
										<button @click="_generateContractPDF(contract)" class="text-orange-600 hover:text-orange-900"
											title="Générer PDF">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</button>

										<!-- Bouton Supprimer -->
										<button @click="deleteContract(contract.id)" class="text-red-600 hover:text-red-900"
											title="Supprimer">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Message si aucun contrat n'est trouvé -->
				<div v-if="filteredContracts.length === 0" class="text-center py-8">
					<EmptyState title="Aucun contrat" :isLoading="isLoading" @reload="fetchContracts"
						icon="heroicons:document-text" :search-query="filters.search"/>
					<!-- <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900"></h3>
					<p class="mt-1 text-sm text-gray-500"></p> -->
				</div>
			</div>

			<Paginator :totalItems="filteredContracts.length" @range-changed="onRangeChanged" />
		</main>

		<!-- ==================== -->
		<!-- MODAL DE VISUALISATION DE CONTRAT -->
		<!-- ==================== -->
		<contractShowModal :getClientName="getClientName" :getStatusClass="getStatusClass" :getStatusText="getStatusText"
			:formatDate="formatDate" :generateCalendar="generateCalendar" :_generateContractPDF="_generateContractPDF"
			:getInterventionStatusClass="getInterventionStatusClass" :getInterventionStatusText="getInterventionStatusText"
			:updateContractStatus="updateContractStatus" v-model:selectedContract="selectedContract" />

		<!-- ==================== -->
		<!-- MODAL LETTRE DE CONTRAT -->
		<!-- ==================== -->
		<div v-if="showLetterModal" class="fixed inset-0 overflow-y-auto z-50">
			<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<!-- Overlay de fond -->
				<div class="fixed inset-0 transition-opacity" aria-hidden="true">
					<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
				<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

				<!-- Contenu du modal -->
				<div
					class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<!-- En-tête du modal -->
						<div class="flex justify-between items-start">
							<h3 class="text-lg leading-6 font-medium text-gray-900">Générer un contrat de maintenance</h3>
							<!-- Bouton de fermeture -->
							<button @click="showLetterModal = false" type="button"
								class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
								<span class="sr-only">Fermer</span>
								<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<!-- Contenu du formulaire de lettre -->
						<div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
							<!-- Colonne de paramétrage -->
							<div class="md:col-span-1">
								<div class="space-y-4">
									<!-- Sélection du client -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Client
											<RequiredField />
										</label>
										<select v-model="letterData.clientId"
											class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
											<option value="">Sélectionnez un client</option>
											<option v-for="client in clients" :key="client.id" :value="client.id">
												{{ getClientName(client) }}
											</option>
										</select>
									</div>

									<!-- Contact client -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Contact client</label>
										<input v-model="letterData.clientContact" type="text"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
									</div>

									<!-- Type de contrat -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Type de contrat
											<RequiredField />
										</label>
										<select v-model="letterData.contractType"
											class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
											<option value="main_oeuvre">Main d'œuvre uniquement</option>
											<option value="full_service">Pièces et main d'œuvre</option>
										</select>
									</div>

									<!-- Formule -->
									<!-- <div>
										<label class="block text-sm font-medium text-gray-700">Formule</label>
										<select v-model="letterData.formula"
											class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
											<option value="basique">Basique</option>
											<option value="standard">Standard</option>
											<option value="premium">Premium</option>
											<option value="promotion">Promotion</option>
											<option value="personnalise">Personnalisé</option>
										</select>
									</div> -->

									<!-- Montant -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Montant (fcfa)</label>
										<input v-model="letterData.amount" type="number"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
									</div>

									<!-- Parc informatique -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Parc informatique</label>
										<textarea v-model="letterData.equipmentDetails" rows="3"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											placeholder="Ex: 15 PC, 3 serveurs, 5 imprimantes..."></textarea>
									</div>

									<!-- Période du contrat -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Période du contrat</label>
										<div class="grid grid-cols-2 gap-2">
											<input v-model="letterData.startDate" type="date"
												class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
											<input v-model="letterData.endDate" type="date"
												class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
										</div>
									</div>

									<!-- Fréquence d'intervention -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Fréquence d'intervention</label>
										<select v-model="letterData.frequency"
											class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
											<option value="mensuel">Mensuel</option>
											<option value="trimestriel">Trimestriel</option>
											<option value="annuel">Annuel</option>
										</select>
									</div>

									<!-- Bouton pour générer un calendrier aléatoire -->
									<div>
										<button @click="generateRandomCalendar"
											class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											Générer Calendrier Aléatoire
										</button>
									</div>
								</div>
							</div>

							<!-- Colonne d'édition du contenu -->
							<div class="md:col-span-2">
								<div class="space-y-4">
									<!-- Préambule -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Préambule</label>
										<textarea v-model="letterData.preamble" rows="3"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
									</div>

									<!-- Engagements du prestataire -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Engagements du prestataire</label>
										<textarea v-model="letterData.providerCommitments" rows="3"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
									</div>

									<!-- Engagements du client -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Engagements du client</label>
										<textarea v-model="letterData.clientCommitments" rows="2"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
									</div>

									<!-- Prestations incluses -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Prestations incluses</label>
										<textarea v-model="letterData.includedServices" rows="5"
											class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
									</div>

									<!-- Calendrier des interventions -->
									<div>
										<label class="block text-sm font-medium text-gray-700">Calendrier des interventions</label>
										<div class="mt-2 overflow-x-auto">
											<table class="min-w-full divide-y divide-gray-200">
												<thead class="bg-gray-50">
													<tr>
														<th scope="col"
															class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
															Date</th>
														<th scope="col"
															class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
															Type</th>
														<th scope="col"
															class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
															Description</th>
														<th scope="col"
															class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
															Statut</th>
														<th scope="col"
															class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
															Actions</th>
													</tr>
												</thead>
												<tbody class="bg-white divide-y divide-gray-200">
													<!-- Je boucle sur chaque intervention -->
													<tr v-for="(intervention, index) in letterData.interventions" :key="index"
														:class="{ 'bg-red-50': intervention.status === 'urgent' }">
														<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
															<input v-model="intervention.date" type="date"
																class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
														</td>
														<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
															<select v-model="intervention.type"
																class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
																<option value="maintenance">Maintenance</option>
																<option value="audit">Audit</option>
																<option value="urgence">Urgence</option>
																<option value="preventive">Préventive</option>
															</select>
														</td>
														<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
															<input v-model="intervention.description" type="text"
																class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
														</td>
														<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
															<select v-model="intervention.status"
																class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
																<option value="planned">Planifié</option>
																<option value="done">Effectué</option>
																<option value="urgent">Urgent</option>
																<option value="canceled">Annulé</option>
															</select>
														</td>
														<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
															<!-- Bouton pour supprimer une intervention -->
															<button @click="removeIntervention(index)" class="text-red-600 hover:text-red-900">
																<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
																	stroke="currentColor">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
																		d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
																</svg>
															</button>
														</td>
													</tr>
												</tbody>
											</table>
											<!-- Bouton pour ajouter une intervention -->
											<button @click="addIntervention"
												class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
												Ajouter une intervention
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Pied de page du modal -->
					<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<!-- Bouton Générer PDF -->
						<button @click="_generateLetterPDF"
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
							Générer PDF
						</button>
						<!-- Bouton Fermer -->
						<button @click="showLetterModal = false"
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import contractShowModal from './contractShowModal.vue'
useHead({ title: "Gestion des contrats" });
// Je importe les fonctions de Vue pour la réactivité
import Swal from 'sweetalert2';
import { ref, computed, onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useContractStore } from '~/app/stores/Maintenance/ContractStore';
import { useClientStore } from '~/app/stores/clientStore';
import { getClientName, type Client } from '~/models/Client';
import { type Contract, contractStatusToString, defaultContractData, defaultLetterData, type Letter } from '~/models/Contract';
import ContractForm from '../../components/contracts/ContractForm.vue';
import EmptyState from '~/app/components/EmptyState.vue';
import Paginator from '~/app/components/Paginator.vue';
import { generateLetterPDF } from '~/app/utils/pdf/maintenace/generateLetterPDF';
import { generateContractPDF, getInterventionStatusText, getStatusText } from '~/app/utils/pdf/maintenace/generateContractPDF';
import RequiredField from '~/app/components/partials/RequiredField.vue';

// Données principales
const clientStore = useClientStore();
const contractStore = useContractStore();

const { clients } = storeToRefs(clientStore);                    // Liste des clients
const { contracts, isLoading } = storeToRefs(contractStore)                  // Liste des contrats
const alerts = ref([]);

const range = reactive({ start: 0, end: 0 });

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};// Liste des alertes

// États d'interface
const showContractForm = ref(false)        // Afficher le formulaire de contrat
const showLetterModal = ref(false)         // Afficher le modal de lettre
const selectedContract = ref<Contract | null>(null)         // Contrat sélectionné pour visualisation
const isEditing = ref(false)               // Mode édition ou création

// Filtres pour la recherche
const filters = ref({
	status: "",      // Filtre par statut
	client: "",      // Filtre par client
	search: ""       // Recherche texte
})

// Données pour un nouveau contrat
const newContract = ref<Contract>(defaultContractData())

// Données pour la génération de lettre de contrat
const letterData = ref<Letter>(defaultLetterData());

// ==================== //
// CONFIGURATION API //
// ==================== //

// URL de base de l'API
const API_BASE = 'http://localhost:8000/api'

// ==================== //
// MÉTHODES API //
// ==================== //

// Je récupère la liste des clients depuis l'API
const fetchClients = async () => {
	try {
		clientStore.fetchAll();
	} catch (error) {
		Swal.fire({
			title: "Erreur de chargement",
			text: "Impossible de charger la liste des clients.",
			icon: "error",
			confirmButtonText: "Réessayer"
		}).then(async result => {
			if (result.isConfirmed) {
				await fetchClients();
			}
		});
	}
}

// Je récupère la liste des contrats depuis l'API
const fetchContracts = async () => {
	try {
		await contractStore.fetchAll();
	} catch {
		Swal.fire({
			title: "Erreur de chargement",
			text: "Impossible de charger la liste des contrats.",
			icon: "error",
			confirmButtonText: "Réessayer"
		}).then(async result => {
			if (result.isConfirmed) {
				await fetchContracts();
			}
		});
	}
}

// Je récupère la liste des alertes depuis l'API
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

// ==================== //
// MÉTHODES POUR LES CONTRATS //
// ==================== //

// Je soumets le formulaire de contrat (création ou modification)
const submitContractForm = async () => {
	// Validation des champs obligatoires
	if (!newContract.value.client_id || !newContract.value.formula || !newContract.value.start_date || !newContract.value.end_date) {
		Swal.fire({
			icon: "warning",
			title: "Veuillez remplir tous les champs obligatoires"
		});
		return
	}

	try {
		await contractStore.store(newContract.value);
	} catch (_) {
		Swal.fire({
			icon: "error",
			title: "Échec de l'enregistrement",
			text: "Une erreur esr survenue lors de l'enregistrement du contrat. Veuillez réessayer."
		});
	}
}

// Je supprime un contrat
const deleteContract = async (contractId: string) => {
	Swal.fire({
		icon: "question",
		title: "Confirmer la suppression",
		text: "Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.",
		showCancelButton: true,
		confirmButtonText: "Supprimer",
		cancelButtonText: "Annuler"
	}).then(async (result) => {
		if (result.isConfirmed) {
			try {
				await contractStore.delete(contractId);
				Swal.fire({
					icon: "success",
					title: "Contrat supprimé avec succès"
				});
			} catch (_) {
				Swal.fire({
					icon: "error",
					title: "Échec de la suppression",
					text: "Une erreur est survenue lors de la suppression du contrat"
				});
			}
		}
	});
}

// Je mets à jour le statut d'un contrat
const updateContractStatus = async (contractId: string, newStatus: string) => {
	Swal.fire({
		icon: "question",
		title: "Voulez-vous mettre à jour le statut de ce contrat",
		confirmButtonText: "Oui, mettre à jour",
		cancelButtonText: "Annuler"
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await contractStore.updateStatus(contractId, newStatus);
			} catch (_) {
				Swal.fire({
					icon: "warning",
					title: "Une erreur est survenue lors de la mise à jour des données!"
				});
			}
		}
	});
}

// Je génère un calendrier d'interventions pour un contrat
const generateCalendar = async (contract: Contract) => {
	try {
		const response = await fetch(`${API_BASE}/contracts/${contract.id}/generate-calendar`, {
			method: 'POST'
		})
		const data = await response.json()

		if (data.success) {
			alert(`Calendrier généré avec ${data.data.length} interventions`)
			// Recharger le contrat sélectionné pour afficher le nouveau calendrier
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

// ==================== //
// MÉTHODES UTILITAIRES //
// ==================== //


// Je récupère le nom d'un client par son ID
const getClientNameById = (clientId: string) => {
	const client = clients.value.find(c => c.id === clientId)
	return client ? getClientName(client) : "Client inconnu"
}

// Je formate une date au format français
const formatDate = (dateString: string) => {
	if (!dateString) return ""
	const date = new Date(dateString)
	return date.toLocaleDateString("fr-FR", {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

// Je retourne le texte du statut

// Je retourne les classes CSS pour le badge de statut
const getStatusClass = (status: string): string => {
	const classMap = {
		active: "bg-green-100 text-green-800",
		pending: "bg-yellow-100 text-yellow-800",
		inactive: "bg-red-100 text-red-800",
		expired: "bg-orange-100 text-orange-800"
	} as Record<string, string>
	return classMap[status] || "bg-gray-100 text-gray-800"
}

// Je retourne le texte du statut d'intervention


// Je retourne les classes CSS pour le badge de statut d'intervention
const getInterventionStatusClass = (status: string): string => {
	const classMap = {
		planned: "bg-blue-100 text-blue-800",
		done: "bg-green-100 text-green-800",
		urgent: "bg-red-100 text-red-800",
		canceled: "bg-gray-100 text-gray-800"
	} as Record<string, string>
	return classMap[status] || "bg-gray-100 text-gray-800"
};

// ==================== //
// MÉTHODES D'INTERFACE //
// ==================== //

// Je visualise un contrat
const viewContract = (contract: Contract): void => {
	selectedContract.value = contract
};

// Je modifie un contrat
const editContract = (contract: Contract): void => {
	selectedContract.value = contract
	isEditing.value = true
	showContractForm.value = true

	newContract.value = defaultContractData(contract);
};

// Je ferme le formulaire de contrat
const closeContractForm = () => {
	showContractForm.value = false
	isEditing.value = false
	selectedContract.value = null
	// Réinitialiser le formulaire
	newContract.value = defaultContractData();
}

// ==================== //
// GÉNÉRATION DE PDF PROFESSIONNELS //
// ==================== //

// Je génère un PDF professionnel pour un contrat
const _generateContractPDF = (contract: Contract) => {
	const client = clients.value.find(c => c.id === contract.client_id)
	if (!client) {
		Swal.fire({
			icon: "error",
			title: "Client non trouvé"
		})
		return
	}
	generateContractPDF(contract, client);
}

// Je génère un PDF de lettre de contrat professionnel
const _generateLetterPDF = (): any => {
	// Validation : client requis
	if (!letterData.value.clientId) {
		Swal.fire({
			icon: "info",
			title: "Veuillez sélectionner un client"
		})
		return
	}

	// Recherche du client
	const client = clients.value.find(c => c.id === letterData.value.clientId);
	if (!client) {
		Swal.fire({
			icon: "error",
			title: "Client non trouvé"
		})
		return
	}

	generateLetterPDF(letterData.value, client);
}

// J'ajoute une intervention au calendrier
const addIntervention = () => {
	letterData.value.interventions.push({
		date: "",
		type: "maintenance",
		description: "",
		status: "planned"
	})
}

// Je supprime une intervention du calendrier
const removeIntervention = (index) => {
	letterData.value.interventions.splice(index, 1)
}

// Je génère un calendrier aléatoire d'interventions
const generateRandomCalendar = () => {
	// Validation des dates
	if (!letterData.value.startDate || !letterData.value.endDate) {
		alert("Veuillez définir les dates de début et de fin du contrat")
		return
	}

	// Génération d'interventions aléatoires
	const interventions = []
	const startDate = new Date(letterData.value.startDate)
	const endDate = new Date(letterData.value.endDate)

	// Types et descriptions possibles
	const types = ['maintenance', 'audit', 'preventive']
	const descriptions = [
		'Maintenance préventive programmée',
		'Vérification des sauvegardes',
		'Mise à jour des systèmes',
		'Audit de sécurité'
	]

	let currentDate = new Date(startDate)
	const interventionCount = 4 // Nombre d'interventions à générer

	// Génération des interventions
	for (let i = 0; i < interventionCount && currentDate <= endDate; i++) {
		interventions.push({
			date: currentDate.toISOString().split('T')[0],
			type: types[Math.floor(Math.random() * types.length)],
			description: descriptions[Math.floor(Math.random() * descriptions.length)],
			status: 'planned'
		})

		// Avancer de 2-4 semaines pour la prochaine intervention
		const weeksToAdd = 2 + Math.floor(Math.random() * 3)
		currentDate.setDate(currentDate.getDate() + (weeksToAdd * 7))
	}

	// Mise à jour des interventions
	letterData.value.interventions = interventions
	alert(`Calendrier généré avec ${interventions.length} interventions`)
}

// ==================== //
// PROPRIÉTÉS CALCULÉES //
// ==================== //

// Je calcule les interventions à venir dans les 7 prochains jours
const upcomingInterventions = computed(() => {
	const today = new Date()
	const nextWeek = new Date()
	nextWeek.setDate(today.getDate() + 7)

	const interventions = []

	// Parcours de tous les contrats
	contracts.value.forEach(contract => {
		if (contract.interventions) {
			contract.interventions.forEach(intervention => {
				const interventionDate = new Date(intervention.date)
				// Vérification si l'intervention est dans la semaine à venir et planifiée
				if (interventionDate >= today && interventionDate <= nextWeek && intervention.status === 'planned') {
					interventions.push({
						contract: contract.reference_number,
						client: getClientNameById(contract.client_id),
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

// Je filtre les contrats selon les critères
const filteredContracts = computed(() => {
	return contracts.value.filter(contract => {
		// Filtre par statut
		if (filters.value.status && contract.status !== filters.value.status) {
			return false
		}

		// Filtre par formule
		// if (filters.value.formula && contract.formula !== filters.value.formula) {
		// 	return false
		// }

		// Filtre par client
		if (filters.value.client && contract.client_id !== filters.value.client) {
			return false
		}

		// Recherche texte
		if (filters.value.search) {
			const searchTerm = filters.value.search.toLowerCase()
			const clientName = getClientNameById(contract.client_id).toLowerCase()
			const reference = contract.reference_number.toLowerCase()

			if (!clientName.includes(searchTerm) && !reference.includes(searchTerm)) {
				return false
			}
		}

		return true
	})
})

// ==================== //
// INITIALISATION //
// ==================== //

// Je charge les données au montage du composant
onMounted(() => {
	fetchClients();
	fetchContracts();
	fetchAlerts();
})

</script>

<style scoped>
/* Styles spécifiques pour l'impression */
@media print {
	.no-print {
		display: none !important;
	}

	body {
		background: white !important;
		font-size: 12pt;
		line-height: 1.6;
	}

	.container {
		max-width: none !important;
		margin: 0 !important;
		padding: 0 !important;
	}
}
</style>
