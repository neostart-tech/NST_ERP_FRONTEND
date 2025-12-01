<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques -->
		<InterventionStats />

		<!-- Search and Filters -->
		<div class="mb-6">

			<!-- Conteneur général -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-center">
				<!-- Titre -->
				<h2 class="text-xl font-bold text-gray-900">
					Liste des signalements
				</h2>

				<!-- Recherche -->
				<div class="relative">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher par équipement, client ou technicien..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
						 focus:ring-blue-500 focus:border-blue-500">
				</div>

				<!-- Sélecteur -->
				<select v-model="statusFilter" class="block w-full px-3 py-2 border border-gray-300 rounded-lg
					 focus:ring-blue-500 focus:border-blue-500">
					<option value="">Tous les statuts</option>
					<option value="new">Nouveau</option>
					<option value="diagnostic">En diagnostic</option>
					<option value="devis">Validation du devis en cours</option>
					<option value="repair">En réparation</option>
					<option value="pieces">En attente de pièces</option>
					<option value="finished">Terminé</option>
					<option value="delivered">Livré</option>
				</select>

				<!-- Bouton -->
				<button @click="showForm = true" class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
					 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouveau signalement
				</button>

			</div>

		</div>

		<!-- Responsive Views -->
		<template v-if="filteredInterventions.length > 0">
			<!-- Vue Tableau (lg+) -->
			<div class="hidden lg:block bg-white border rounded-lg shadow mt-6 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gradient-to-r from-blue-50 to-green-50">
							<tr>
								<th scope="col"
									class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									N°
								</th>
								<th scope="col"
									class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									Équipement
								</th>
								<th scope="col"
									class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									Date signalement
								</th>
								<th scope="col"
									class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									Technicien
								</th>
								<th scope="col"
									class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									Statut
								</th>
								<th scope="col"
									class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-100">
							<tr v-for="(report, id) in paginatedInterventions" :key="report.id"
								class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{{ ++id }}
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{{ report.equipment?.brand }}</div>
									<div class="text-xs text-gray-500">{{ report.equipment_serial }}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ formatDate(report.report_date) }}
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
											<span class="text-blue-600 font-medium text-xs">
												{{report.technician?.full_name ? report.technician?.full_name.split(' ').map(n => n[0]).join('')
													: ''}}
											</span>
										</div>
										<div class="ml-3">
											<div class="text-sm font-medium text-gray-900">{{ report.technician?.full_name }}</div>
										</div>
									</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<span
										:class="`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`">
										{{ getInterventionStatus(report) }}
									</span>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
									<div class="flex space-x-2">
										<button @click="viewReport(report)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full">
											<Icon name="heroicons:eye" class="h-5 w-5 mr-1" />
										</button>
										<button @click="editReport(report)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full">
											<Icon name="heroicons:pencil-square" class="h-5 w-5 mr-1" />
										</button>
										<button @click="deleteReport(report.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full">
											<Icon name="heroicons:trash" class="h-5 w-5 mr-1" />
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Vue Cartes (md-) -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="report in paginatedInterventions" :key="report.id"
					class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
					<div class="flex justify-between items-start mb-3">
						<div class="text-lg font-semibold text-gray-900">{{ report.equipment!.brand }}</div>
						<span :class="`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`">
							{{ getInterventionStatus(report) }}
						</span>
					</div>

					<div class="space-y-2 mb-4">
						<div class="flex items-start">
							<Icon name="heroicons:cube" class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
							<div>
								<div class="text-sm font-medium text-gray-900">{{ report.equipment?.name }}</div>
								<div class="text-xs text-gray-500">{{ report.equipment?.serial_number }}</div>
							</div>
						</div>

						<div class="flex items-center">
							<Icon name="heroicons:calendar" class="h-5 w-5 text-gray-400 mr-2" />
							<span class="text-sm text-gray-600">{{ formatDate(report.report_date) }}</span>
						</div>

						<div class="flex items-center">
							<Icon name="heroicons:user" class="h-5 w-5 text-gray-400 mr-2" />
							<span class="text-sm text-gray-600">{{ report.technician!.full_name }}</span>
						</div>
					</div>

					<div class="flex justify-end space-x-2 pt-3 border-t border-gray-200">
						<button @click="viewReport(report)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full">
							<Icon name="heroicons:eye" class="h-5 w-5 mr-1" />
						</button>
						<button @click="editReport(report)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full">
							<Icon name="heroicons:pencil-square" class="h-5 w-5 mr-1" />
						</button>
						<button @click="deleteReport(report.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full">
							<Icon name="heroicons:trash" class="h-5 w-5 mr-1" />
						</button>
					</div>
				</div>
			</div>
		</template>

		<!-- Empty State -->
		<div v-else>
			<EmptyState title="Aucun signalement trouvé"
				description="Il n'y a actuellement aucun signalement de panne à afficher." icon="heroicons:wrench-screwdriver"
				iconColor="text-blue-400" @reload="loadInterventions()" :isLoading="loading" :searchQuery="searchQuery" />
		</div>

		<!-- Pagination -->
		<div v-if="loading || filteredInterventions.length > 0" class="mt-6">
			<Paginator :totalItems="filteredInterventions.length" @range-changed="onRangeChanged" />
		</div>

		<!-- Form Modal -->
		<ReportForm v-model="showForm" :formData="form" :editing="editing" @submit="submitForm"
			@close="showForm = false; editing = false" />

		<!-- Fiche d'Intervention Modal -->
		<div v-if="viewingReport && isViewing"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print-modal">
			<div
				class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto print:w-full print:max-w-none print:shadow-none print:rounded-none print:overflow-visible">
				<div class="p-8 print:p-6">
					<!-- En-tête du cabinet - Configurable -->
					<div class="flex justify-between items-start mb-10 print:mb-8">
						<div class="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-lg text-white">
							<h1 class="text-3xl font-bold mb-2">{{ companyInfo.name }}</h1>
							<p class="text-blue-100">{{ companyInfo.tagline }}</p>
							<p class="text-blue-100 text-sm mt-2">{{ companyInfo.address }}</p>
							<p class="text-blue-100 text-sm">Tél: {{ companyInfo.phone }} | Email: {{ companyInfo.email }}</p>
							<p class="text-blue-100 text-sm" v-if="companyInfo.website">Site: {{ companyInfo.website }}</p>
						</div>
						<div class="text-right">
							<div
								class="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg inline-block shadow-lg">
								<span class="text-lg font-bold">FICHE D'INTERVENTION</span>
							</div>
							<p class="text-gray-500 text-sm mt-3">Référence: FI-{{ String(viewingReport.id).padStart(5, '0') }}
							</p>
							<p class="text-gray-500 text-sm mt-1">Date: {{ formatDate(viewingReport.report_date) }}</p>
						</div>
					</div>

					<!-- Bouton de configuration de l'en-tête (visible seulement en mode édition) -->
					<div v-if="editingCompanyInfo" class="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
						<h3 class="text-lg font-medium text-yellow-800 mb-3">Configuration de l'en-tête</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
								<input v-model="companyInfo.name" class="w-full border border-gray-300 rounded-lg px-3 py-2">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
								<input v-model="companyInfo.tagline" class="w-full border border-gray-300 rounded-lg px-3 py-2">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
								<input v-model="companyInfo.address" class="w-full border border-gray-300 rounded-lg px-3 py-2">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
								<input v-model="companyInfo.phone" class="w-full border border-gray-300 rounded-lg px-3 py-2">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
								<input v-model="companyInfo.email" class="w-full border border-gray-300 rounded-lg px-3 py-2">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Site web</label>
								<input v-model="companyInfo.website" class="w-full border border-gray-300 rounded-lg px-3 py-2">
							</div>
						</div>
						<div class="flex justify-end mt-4 space-x-3">
							<button @click="editingCompanyInfo = false"
								class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
								Annuler
							</button>
							<button @click="saveCompanyInfo" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
								Enregistrer
							</button>
						</div>
					</div>

					<!-- Informations sur l'intervention -->
					<div class="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-10 print:mb-8 shadow-sm">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<p class="text-sm text-blue-600 font-medium">Date du signalement</p>
								<p class="text-lg font-bold text-gray-800">{{ formatDate(viewingReport.report_date) }}</p>
							</div>
							<div>
								<p class="text-sm text-blue-600 font-medium">Statut</p>
								<span
									:class="`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(viewingReport.status)}`">
									{{ viewingReport.status }}
								</span>
							</div>
						</div>
					</div>

					<!-- Détails de l'équipement -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500 inline-block">Détails de
							l'équipement</h2>
						<div class="bg-blue-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Nom</p>
									<p class="font-medium text-gray-800">{{ viewingReport.equipment_name }}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Numéro de série</p>
									<p class="font-medium text-gray-800">{{ viewingReport.equipment_serial }}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Fabricant</p>
									<p class="font-medium text-gray-800">{{ viewingReport.equipment_manufacturer }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Informations sur le client -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500 inline-block">Informations
							client</h2>
						<div class="bg-green-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-green-600 font-medium mb-1">Client</p>
									<p class="font-medium text-gray-800">{{ viewingReport.client_name || viewingReport.client_company_name
									}}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-green-600 font-medium mb-1">Service/Département</p>
									<p class="font-medium text-gray-800">{{ viewingReport.department }}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-green-600 font-medium mb-1">Localisation</p>
									<p class="font-medium text-gray-800">{{ viewingReport.location }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Description du problème -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-purple-500 inline-block">Description
							du problème</h2>
						<div class="bg-purple-50 p-6 rounded-xl shadow-sm">
							<p class="font-medium text-gray-800">{{ viewingReport.problem_description }}</p>
						</div>
					</div>

					<!-- Informations sur le technicien -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Informations
							sur le technicien</h2>
						<div class="bg-yellow-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-yellow-600 font-medium mb-1">Technicien assigné</p>
									<div class="flex items-center mt-1">
										<div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
											<span class="text-blue-600 font-medium text-sm">{{viewingReport.technician_name ?
												viewingReport.technician_name.split(' ').map(n => n[0]).join('') : ''}}</span>
										</div>
										<div class="ml-3">
											<div class="text-sm font-medium text-gray-900">{{ viewingReport.technician_name }}</div>
										</div>
									</div>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-yellow-600 font-medium mb-1">Heure de contact</p>
									<p class="font-medium text-gray-800">{{ viewingReport.contact_time }}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-yellow-600 font-medium mb-1">Défaut constaté</p>
									<p class="font-medium text-gray-800 text-sm">{{ viewingReport.technician_findings }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Détails de la réparation -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500 inline-block">Détails de
							la réparation</h2>
						<div class="bg-indigo-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-indigo-600 font-medium mb-1">Date début réparation</p>
									<p class="font-medium text-gray-800">{{ formatDate(viewingReport.repair_start_date) }}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-indigo-600 font-medium mb-1">Date fin réparation</p>
									<p class="font-medium text-gray-800">{{ formatDate(viewingReport.repair_end_date) }}</p>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-indigo-600 font-medium mb-1">Durée de réparation</p>
									<p class="font-medium text-gray-800">{{ viewingReport.repair_duration }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Status Flags -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-pink-500 inline-block">État de
							l'intervention</h2>
						<div class="bg-pink-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
									<span
										:class="`h-4 w-4 rounded-full ${viewingReport.is_tested_certified ? 'bg-green-500' : 'bg-gray-300'}`"></span>
									<span class="ml-3 text-sm font-medium text-gray-800">Testé et certifié</span>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
									<span
										:class="`h-4 w-4 rounded-full ${viewingReport.is_sent_for_maintenance ? 'bg-green-500' : 'bg-gray-300'}`"></span>
									<span class="ml-3 text-sm font-medium text-gray-800">Envoyé pour maintenance</span>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
									<span
										:class="`h-4 w-4 rounded-full ${viewingReport.needs_delivery ? 'bg-green-500' : 'bg-gray-300'}`"></span>
									<span class="ml-3 text-sm font-medium text-gray-800">Livraison demandée</span>
								</div>
								<div class="bg-white p-4 rounded-lg shadow-sm flex items-center">
									<span
										:class="`h-4 w-4 rounded-full ${viewingReport.under_contract ? 'bg-green-500' : 'bg-gray-300'}`"></span>
									<span class="ml-3 text-sm font-medium text-gray-800">Sous contrat</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Section Devis -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500 inline-block">Devis</h2>
						<div class="bg-blue-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Fichier du devis</p>
									<div v-if="viewingReport.quotation_file_name" class="flex items-center mt-2">
										<Icon name="heroicons:document" class="h-5 w-5 text-blue-500 mr-2" />
										<span class="font-medium text-gray-800">{{ viewingReport.quotation_file_name }}</span>
										<button @click="downloadQuotation(viewingReport.id)" class="ml-2 text-blue-600 hover:text-blue-800">
											<Icon name="heroicons:arrow-down-tray" class="h-5 w-5" />
										</button>
									</div>
									<p v-else class="text-gray-500 italic">Aucun fichier joint</p>
								</div>

								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Montant</p>
									<p class="font-medium text-gray-800">{{ viewingReport.quotation_amount ?
										`${viewingReport.quotation_amount} FCFA` : 'Non spécifié' }}</p>
								</div>

								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Enregistrement audio</p>
									<div v-if="viewingReport.audio_recording_path" class="mt-2">
										<button @click="downloadAudio(viewingReport.id)"
											class="text-blue-600 hover:text-blue-800 flex items-center">
											<Icon name="heroicons:arrow-down-tray" class="h-5 w-5 mr-1" />
											Télécharger l'audio
										</button>
									</div>
									<p v-else class="text-gray-500 italic">Aucun enregistrement</p>
								</div>

								<div class="bg-white p-4 rounded-lg shadow-sm">
									<p class="text-sm text-blue-600 font-medium mb-1">Email envoyé</p>
									<div class="flex items-center">
										<span
											:class="`h-4 w-4 rounded-full ${viewingReport.quotation_email_sent ? 'bg-green-500' : 'bg-gray-300'}`"></span>
										<span class="ml-3 text-sm font-medium text-gray-800">
											{{ viewingReport.quotation_email_sent ? `Oui (${formatDate(viewingReport.quotation_email_date)})`
												: 'Non' }}
										</span>
									</div>
								</div>
							</div>

							<div v-if="viewingReport.quotation_comments" class="mt-6 bg-white p-4 rounded-lg shadow-sm">
								<p class="text-sm text-blue-600 font-medium mb-1">Commentaires</p>
								<p class="text-gray-800 whitespace-pre-line">{{ viewingReport.quotation_comments }}</p>
							</div>
						</div>
					</div>

					<!-- Signatures -->
					<div class="mb-10 print:mb-8">
						<h2 class="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-teal-500 inline-block">Signatures
						</h2>
						<div class="bg-teal-50 p-6 rounded-xl shadow-sm">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div class="bg-white p-6 rounded-lg shadow-sm text-center">
									<p class="text-sm text-teal-600 font-medium mb-3">Technicien</p>
									<div
										class="border-2 border-dashed border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center mb-3">
										<img v-if="viewingReport.technician_signature" :src="viewingReport.technician_signature"
											alt="Signature technicien" class="max-h-28 max-w-full">
										<span v-else class="text-gray-400">Non signé</span>
									</div>
									<p class="text-sm font-medium text-gray-800">{{ viewingReport.technician_name }}</p>
								</div>
								<div class="bg-white p-6 rounded-lg shadow-sm text-center">
									<p class="text-sm text-teal-600 font-medium mb-3">Client</p>
									<div
										class="border-2 border-dashed border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center mb-3">
										<img v-if="viewingReport.client_signature" :src="viewingReport.client_signature"
											alt="Signature client" class="max-h-28 max-w-full">
										<span v-else class="text-gray-400">Non signé</span>
									</div>
									<p class="text-sm font-medium text-gray-800">{{ viewingReport.client_name ||
										viewingReport.client_company_name }}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div class="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600 print:mt-10">
						<p class="font-medium">{{ companyInfo.name }} - {{ companyInfo.tagline }}</p>
						<p class="mt-1">{{ companyInfo.address }} | Tél: {{ companyInfo.phone }}</p>
						<p class="mt-1">Email: {{ companyInfo.email }} <span v-if="companyInfo.website">| Site web: {{
							companyInfo.website }}</span></p>
					</div>

					<!-- Boutons d'action (non imprimables) -->
					<div class="flex justify-end space-x-4 mt-8 no-print">
						<button @click="editingCompanyInfo = !editingCompanyInfo"
							class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
							<Icon name="heroicons:pencil" class="h-5 w-5 mr-2" />
							Modifier en-tête
						</button>
						<button @click="printReport"
							class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
							<Icon name="heroicons:printer" class="h-5 w-5 mr-2" />
							Imprimer
						</button>
						<button @click="generatePDF(viewingReport.id)"
							class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
							<Icon name="heroicons:document-arrow-down" class="h-5 w-5 mr-2" />
							Enregistrer en PDF
						</button>
						<button @click="viewingReport = null; isViewing = false;"
							class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors shadow-md">
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({ title: "Signaler une panne" });

import Swal from 'sweetalert2';
import { ref, onMounted, watch, computed } from 'vue';
import ReportForm from '~/app/components/maintenance/ReportForm.vue';
import InterventionStats from '~/app/components/maintenance/InterventionStats.vue';
import { useInterventionStore } from '~/app/stores/Maintenance/InterventionStore';
import { getInterventionStatus, getStatusColor, InterventionFormData, type Intervention } from '~/models/Intervention';
import EmptyState from '~/app/components/EmptyState.vue';
import Paginator from '~/app/components/Paginator.vue';

const companyInfo = ref({
	name: 'TechRepair Pro',
	tagline: 'Service de maintenance et réparation',
	address: '123 Avenue de la Technologie, 75000 Paris',
	phone: '+33 1 23 45 67 89',
	email: 'contact@techrepair.fr',
	website: 'www.techrepair.fr'
});

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const editingCompanyInfo = ref(false)

onMounted(() => {
	loadInterventions();
})

const saveCompanyInfo = () => {
	localStorage.setItem('companyInfo', JSON.stringify(companyInfo.value))
	editingCompanyInfo.value = false
}

const interventionStore = useInterventionStore();

const { interventions, loading } = storeToRefs(interventionStore);

// Search and filter
const searchQuery = ref('')
const statusFilter = ref('')
const error = ref('')

const showForm = ref(false)
const editing = ref(false)
const viewingReport = ref<Intervention | null>(null)
const isViewing = ref(false)

const form = ref<Intervention>(InterventionFormData())

// Computed
const filteredInterventions = computed(() => {
	let filtered = interventions.value || []

	// Apply search filter
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		filtered = filtered.filter(intervention =>
			intervention.equipment?.name?.toLowerCase().includes(query) ||
			intervention.equipment?.characteristics?.toLowerCase().includes(query) ||
			intervention.technician?.full_name?.toLowerCase().includes(query) ||
			intervention.client?.first_name?.toLowerCase().includes(query) ||
			intervention.client?.last_name?.toLowerCase().includes(query) ||
			intervention.client?.company_name?.toLowerCase().includes(query)
		)
	}

	// Apply status filter
	if (statusFilter.value) {
		filtered = filtered.filter(intervention => intervention.status === statusFilter.value)
	}

	return filtered
})

const paginatedInterventions = computed(() => {
	return filteredInterventions.value.slice(range.start - 1, range.end);
});

const loadInterventions = async () => {
	loading.value = true
	error.value = ''
	try {
		await interventionStore.fetchInterventions();
	} catch (err) {
		error.value = 'Impossible de charger les interventions'
		useAlert().showAlert('Impossible de charger les interventions', 'error', 5000)
	} finally {
		loading.value = false
	}
};

const validateForm = (form: Intervention) => {

	if (!form.client_id) {
		Swal.fire('Veuillez sélectionner un client');
		return false
	}
	if (!form.problem_description) {
		Swal.fire('Veuillez saisir la description du problème');
		return false
	}
	if (!form.technician_id) {
		Swal.fire('Veuillez sélectionner un technicien');
		return false
	}
	return true
};

const submitForm = async (_form: Intervention) => {
	console.log("Form:", _form);

	try {
		if (!validateForm(_form)) return

		if (editing.value) {
			await interventionStore.updateIntervention(_form.id, _form);
			viewingReport.value = InterventionFormData();
		} else {
			await interventionStore.createIntervention(_form);
		}

		closeForm()
		loadInterventions()
		Swal.fire(editing.value ? 'Intervention mise à jour avec succès' : 'Intervention créée avec succès', 'success');

	} catch (error) {
		Swal.fire('Erreur lors de l\'enregistrement', 'error');
	}
}

const editReport = (report: Intervention) => {
	viewingReport.value = report
	editing.value = true
	showForm.value = true
	form.value = InterventionFormData(report);
	console.log("Form:", form.value);

}

const viewReport = (report: Intervention) => {
	viewingReport.value = report;
	isViewing.value = true;
	console.log('Rapport visualisé:', report);
}

const deleteReport = async (id: string) => {
	Swal.fire({
		title: 'Supprimer l\'intervention ?',
		text: 'Vous allez supprimer l\'intervention',
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Oui, supprimer !',
		cancelButtonText: 'Non, annuler',
		confirmButtonColor: '#dc2626',
		cancelButtonColor: '#6b7280',
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await interventionStore.deleteIntervention(id)
				interventions.value = interventions.value.filter(_ => _.id !== id)
				Swal.fire('Intervention supprimée avec succès');
			} catch (error) {
				console.error('Erreur lors de la suppression:', error);
				Swal.fire('Erreur lors de la suppression de l\'intervention', 'error');
			}
		}
	});
};

const closeForm = () => {
	showForm.value = false
	editing.value = false
	viewingReport.value = null
	form.value = InterventionFormData();
}

const printReport = () => {
	window.print()
}

const generatePDF = async (id) => {
	try {
		console.log('Génération PDF pour l\'intervention:', id)

		const response = await api.generatePDF(id)

		if (response.status !== 200) {
			throw new Error(`Erreur HTTP: ${response.status}`)
		}

		const blob = new Blob([response.data], { type: 'application/pdf' })
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `fiche-intervention-${id}.pdf`

		document.body.appendChild(link)
		link.click()

		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)

		console.log('PDF généré avec succès')

	} catch (error) {
		console.error('Erreur détaillée lors de la génération du PDF:', error)

		if (error.response) {
			console.error('Réponse d\'erreur:', error.response)
			console.error('Status:', error.response.status)
			console.error('Data:', error.response.data)
		}

		alert('Le PDF ne peut pas être généré. Vérifiez que le serveur Laravel est correctement configuré. Ouverture de la version imprimable...')
		viewingReport.value = interventions.value.find(r => r.id === id)
		setTimeout(() => {
			window.print()
		}, 500)
	}
}

const formatDate = (dateString) => {
	if (!dateString) return ''
	try {
		const date = new Date(dateString)
		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	} catch (error) {
		return dateString
	}
}

</script>

<style lang="scss" scoped>
@media print {
	body * {
		visibility: hidden;
	}

	.print-modal,
	.print-modal * {
		visibility: visible;
	}

	.print-modal {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: auto;
		margin: 0;
		padding: 0;
		overflow: visible;
		background: white !important;
	}

	.no-print {
		display: none !important;
	}

	.print-modal {
		font-size: 12pt;
		line-height: 1.4;
		color: black !important;
	}

	.print-modal h1 {
		font-size: 18pt;
		color: black !important;
	}

	.print-modal h2 {
		font-size: 14pt;
		margin-top: 12pt;
		margin-bottom: 8pt;
		color: black !important;
	}

	.print-modal .grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10pt;
	}

	.print-modal .bg-gradient-to-r {
		background: #f9fafb !important;
	}

	.print-modal .text-white {
		color: #1f2937 !important;
	}

	.print-modal .border-b-2 {
		border-bottom: 2pt solid #3b82f6 !important;
	}

	.print-modal .rounded-xl {
		border-radius: 0 !important;
	}

	.print-modal .p-6 {
		padding: 8pt !important;
	}

	.print-modal .mb-10 {
		margin-bottom: 12pt !important;
	}

	.print-modal .mt-12 {
		margin-top: 16pt !important;
	}

	.print-modal .border-2 {
		border: 1pt solid #d1d5db !important;
	}

	.print-modal .border-dashed {
		border-style: dashed !important;
	}

	.print-modal .h-32 {
		height: 64pt !important;
	}

	.print-modal img {
		max-height: 60pt !important;
		max-width: 100% !important;
		filter: none !important;
	}

	audio {
		display: none;
	}

	.no-print-audio::after {
		content: "[Enregistrement audio non imprimable]";
		font-style: italic;
		color: #666;
	}

	.print-modal .shadow-sm,
	.print-modal .shadow-lg,
	.print-modal .shadow-md {
		box-shadow: none !important;
	}
}

audio {
	max-width: 100%;
	min-width: 200px;
}

canvas {
	touch-action: none;
	cursor: crosshair;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
}

img {
	object-fit: contain;
	background: white;
}

.border-dashed {
	background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}
</style>
