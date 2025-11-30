<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Sidebar -->
		<div class="fixed inset-y-0 left-0 w-40 bg-gradient-to-b from-blue-600 to-green-600 shadow-lg">
			<div class="flex items-center justify-center h-16 px-4 bg-white bg-opacity-10">
				<img src="" alt="Logo" class="h-10">
			</div>
		</div>

		<!-- Main Content -->
		<div class="ml-0 p-10">
			<!-- Content -->
			<main class="mx-auto max-w-7xl px-5">
				<!-- Header and Add Button -->
				<div class="flex justify-between items-center mb-8">
					<div>
						<h1 class="text-3xl font-bold text-blue-800 pb-3">Signalement de panne</h1>
						<p class="text-blue-600">Gestion des interventions techniques</p>
					</div>
					<button @click="showForm = true"
						class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd"
								d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
								clip-rule="evenodd" />
						</svg>
						Nouveau signalement
					</button>
				</div>

				<!-- Reports Table -->
				<div class="bg-white rounded-xl shadow-md overflow-hidden">
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gradient-to-r from-blue-50 to-green-50">
								<tr>
									<th class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">ID</th>
									<th class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
										Équipement</th>
									<th class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Date
										signalement</th>
									<th class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
										Technicien</th>
									<th class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Statut
									</th>
									<th class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Actions
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-100">
								<tr v-for="report in interventions" :key="report.id" class="hover:bg-gray-50 transition-colors">
									<td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ report.id }}</td>
									<td class="px-4 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{{ report.equipment_name }}</div>
										<div class="text-xs text-gray-500">{{ report.equipment_serial }}</div>
									</td>
									<td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(report.report_date) }}
									</td>
									<td class="px-4 py-4 whitespace-nowrap">
										<div class="flex items-center">
											<div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
												<span class="text-blue-600 font-medium text-xs">{{report.technician_name ?
													report.technician_name.split(' ').map(n => n[0]).join('') : ''}}</span>
											</div>
											<div class="ml-3">
												<div class="text-sm font-medium text-gray-900">{{ report.technician_name }}</div>
											</div>
										</div>
									</td>
									<td class="px-4 py-4 whitespace-nowrap">
										<span
											:class="`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`">
											{{ report.status }}
										</span>
									</td>
									<td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
										<div class="flex space-x-2">
											<button @click="viewReport(report)" class="text-blue-600 hover:text-blue-800 flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
													stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
												Voir
											</button>
											<button @click="editReport(report)"
												class="text-yellow-600 hover:text-yellow-800 flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
													stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
												Modifier
											</button>
											<button @click="deleteReport(report.id)"
												class="text-red-600 hover:text-red-800 flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
													stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
												Supprimer
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>

		<!-- Add/Edit Report Modal -->
		<div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
				<div class="p-6">
					<div class="flex justify-between items-center border-b pb-4">
						<h2 class="text-2xl font-bold text-gray-800">{{ editing ? 'Modifier le signalement' : 'Nouveau signalement'
						}}</h2>
						<button @click="closeForm" class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<form @submit.prevent="submitForm" class="mt-6 space-y-6">
						<!-- Equipment and Client Selection -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Sélectionner l'équipement <span
										class="text-red-500">*</span></label>
								<select v-model="form.equipment_id" @change="loadEquipmentDetails"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
									<option value="">Sélectionner un équipement</option>
									<option v-for="equip in equipments" :key="equip.id" :value="equip.id">{{ equip.brand }} {{
										equip.model }} ({{ equip.serial_number }})</option>
								</select>
								<InvalidInput :error="validationErrors.equipment_id" />
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Sélectionner le client <span
										class="text-red-500">*</span></label>
								<select v-model="form.client_id" @change="loadClientDetails"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
									<option value="">Sélectionner un client</option>
									<option v-for="client in clients" :key="client.id" :value="client.id">
										{{ client.type === 'company' ? client.company_name : client.first_name + ' ' + client.last_name }}
									</option>
								</select>
								<InvalidInput :error="validationErrors.client_id" />
							</div>
						</div>

						<!-- Equipment Details -->
						<div v-if="selectedEquipment" class="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<h3 class="font-medium text-gray-800 mb-2 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20"
									fill="currentColor">
									<path fill-rule="evenodd"
										d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
										clip-rule="evenodd" />
								</svg>
								Détails de l'équipement
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<p class="text-xs text-gray-600">Nom</p>
									<p class="font-medium">{{ selectedEquipment.brand }} {{ selectedEquipment.model }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-600">Numéro de série</p>
									<p class="font-medium">{{ selectedEquipment.serial_number }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-600">Fabricant</p>
									<p class="font-medium">{{ selectedEquipment.manufacturer }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-600">Modèle</p>
									<p class="font-medium">{{ selectedEquipment.model }}</p>
								</div>
								<!-- <div>
									<p class="text-xs text-gray-600">Date d'achat</p>
									<p class="font-medium">{{ formatDate(selectedEquipment.purchase_date) }}</p>
								</div> -->
								<div>
									<p class="text-xs text-gray-600">Sous garantie</p>
									<p class="font-medium" :class="selectedEquipment.under_warranty ? 'text-green-600' : 'text-red-600'">
										{{ selectedEquipment.under_warranty ? 'Oui' : 'Non' }}</p>
								</div>
							</div>
						</div>

						<!-- Client Information (Auto-filled from selected client) -->
						<div v-if="selectedClient" class="bg-green-50 p-4 rounded-lg border border-green-100">
							<h3 class="font-medium text-gray-800 mb-2 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
									viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								Informations client
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<p class="text-xs text-gray-600">Type de client</p>
									<p class="font-medium">
										{{ selectedClient.type === 'company' ? 'Client moral (entreprise)' : 'Client physique' }}
									</p>
								</div>
								<div>
									<p class="text-xs text-gray-600">
										{{ selectedClient.type === 'company' ? 'Nom de l\'entreprise' : 'Nom du client' }}
									</p>
									<p class="font-medium">
										{{ selectedClient.type === 'company' ? selectedClient.company_name :
											selectedClient.first_name + ' ' + selectedClient.last_name }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-600">Téléphone</p>
									<p class="font-medium">{{ selectedClient.phone }}</p>
								</div>
								<div>
									<p class="text-xs text-gray-600">Email</p>
									<p class="font-medium">{{ selectedClient.email }}</p>
								</div>
							</div>
						</div>

						<!-- Problem Description -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Défaut constaté <span
									class="text-red-500">*</span></label>
							<textarea v-model="form.problem_description" rows="3"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
							<InvalidInput :error="validationErrors.problem_description" />
						</div>

						<!-- Technician Assignment -->
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Technicien assigné <span
										class="text-red-500">*</span></label>
								<select id="technician_id" v-model="form.technician_id"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
									<option value="">Sélectionner un technicien</option>
									<option v-for="technician in technicians" :key="technician.id" :value="technician.id">
										{{ technician.full_name }}
									</option>
								</select>
								<InvalidInput :error="validationErrors.technician_id" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Date du signalement <span
										class="text-red-500">*</span></label>
								<input v-model="form.report_date" type="datetime-local"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<InvalidInput :error="validationErrors.report_date" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Heure de contact</label>
								<input v-model="form.contact_time" type="time"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<InvalidInput :error="validationErrors.contact_time" />
							</div>
						</div>

						<!-- Status and Checkboxes -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Statut <span
										class="text-red-500">*</span></label>
								<select v-model="form.status"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
									<option value="new">Nouveau</option>
									<option value="diagnostic">En diagnostic</option>
									<option value="quotation">Validation du devis en cours</option>
									<option value="repair">En réparation</option>
									<option value="waiting">En attente de pièces</option>
									<option value="finished">Terminé</option>
									<option value="delivered">Livré</option>
								</select>
								<InvalidInput :error="validationErrors.status" />
							</div>
							<div class="space-y-3">
								<div class="flex items-center">
									<input v-model="form.is_tested_certified" type="checkbox"
										class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
									<label class="ml-2 block text-sm text-gray-700">L'objet testé certifié en état de marche</label>
								</div>
								<div class="flex items-center">
									<input v-model="form.is_sent_for_maintenance" type="checkbox"
										class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
									<label class="ml-2 block text-sm text-gray-700">L'objet envoyé pour suite de maintenance</label>
								</div>
								<div v-if="form.is_sent_for_maintenance" class="flex items-center ml-6">
									<input v-model="form.needs_delivery" type="checkbox"
										class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
									<label class="ml-2 block text-sm text-gray-700">Le client souhaite être livré</label>
								</div>
								<div v-if="form.needs_delivery" class="ml-6">
									<label class="block text-sm font-medium text-gray-700 mb-1">Prix de livraison</label>
									<div class="relative rounded-md shadow-sm">
										<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<span class="text-gray-500 sm:text-sm">FCFA</span>
										</div>
										<input v-model="form.delivery_price" type="number"
											class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-lg px-4 py-2">
									</div>
								</div>
								<div class="flex items-center">
									<input v-model="form.under_contract" type="checkbox"
										class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
									<label class="ml-2 block text-sm text-gray-700">Client sous contrat</label>
								</div>
							</div>
						</div>

						<!-- Repair Dates -->
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Date début réparation</label>
								<input v-model="form.repair_start_date" type="datetime-local"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Date fin réparation</label>
								<input v-model="form.repair_end_date" type="datetime-local"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Durée de réparation</label>
								<input v-model="form.repair_duration" type="text" readonly
									class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
							</div>
						</div>

						<!-- Technician Findings -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Défaut constaté par le technicien</label>
							<textarea v-model="form.technician_findings" rows="3"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
							<InvalidInput :error="validationErrors.technician_findings" />
						</div>

						<!-- Devis Section -->
						<!-- <div class="border-t pt-6 mt-6">
							<h3 class="font-medium text-gray-800 mb-4 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20"
									fill="currentColor">
									<path fill-rule="evenodd"
										d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
										clip-rule="evenodd" />
								</svg>
								Devis
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">Fichier du devis</label>
									<div class="flex items-center">
										<input type="file" ref="quotationFile" @change="handleFileUpload" class="hidden">
										<button @click="$refs.quotationFile.click()" type="button"
											class="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
												fill="currentColor">
												<path fill-rule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clip-rule="evenodd" />
											</svg>
											Téléverser
										</button>
										<span v-if="form.quotation_file_name" class="ml-3 text-sm text-gray-600">{{ form.quotation_file_name
										}}</span>
									</div>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">Montant du devis (FCFA)</label>
									<input v-model="form.quotation_amount" type="number"
										class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">Enregistrement audio</label>
									<div class="flex items-center">
										<button @click="toggleAudioRecording" type="button"
											:class="`px-4 py-2 rounded-lg border flex items-center ${isRecording ? 'bg-red-100 border-red-300 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
												fill="currentColor">
												<path fill-rule="evenodd"
													d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
													clip-rule="evenodd" />
											</svg>
											{{ isRecording ? 'Arrêter' : 'Enregistrer' }}
										</button>
										<audio v-if="form.audio_recording_url" controls class="ml-3 h-10">
											<source :src="form.audio_recording_url" type="audio/mpeg">
										</audio>
									</div>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">Email envoyé</label>
									<div class="flex items-center">
										<input v-model="form.quotation_email_sent" type="checkbox"
											class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
										<label class="ml-2 block text-sm text-gray-700">Devis envoyé par email</label>
									</div>
									<input v-if="form.quotation_email_sent" v-model="form.quotation_email_date" type="datetime-local"
										class="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								</div>
							</div>

							<div class="mt-4">
								<label class="block text-sm font-medium text-gray-700 mb-1">Commentaires sur le devis</label>
								<textarea v-model="form.quotation_comments" rows="2"
									class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
							</div>
						</div> -->

						<!-- Signatures -->
						<!-- <div class="border-t pt-4">
							<h3 class="font-medium text-gray-800 mb-2 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
									viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
								</svg>
								Signatures
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">Signature du technicien</label>
									<div class="border border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center">
										<img v-if="form.technician_signature" :src="form.technician_signature" alt="Signature technicien"
											class="max-h-28 max-w-full">
										<button v-else type="button" @click="showSignatureModal('technician')"
											class="text-blue-600 hover:text-blue-800 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
											</svg>
											Ajouter signature
										</button>
									</div>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1">Signature du client</label>
									<div class="border border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center">
										<img v-if="form.client_signature" :src="form.client_signature" alt="Signature client"
											class="max-h-28 max-w-full">
										<button v-else type="button" @click="showSignatureModal('client')"
											class="text-blue-600 hover:text-blue-800 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
												stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
											</svg>
											Ajouter signature
										</button>
									</div>
								</div>
							</div>
						</div> -->

						<!-- Form Actions -->
						<div class="flex justify-end space-x-4 pt-6 border-t">
							<button type="button" @click="closeForm"
								class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
								Annuler
							</button>
							<button type="submit"
								class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
								{{ editing ? 'Mettre à jour' : 'Enregistrer' }}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<!-- Signature Modal -->
		<div v-if="showSignaturePad" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-xl font-bold text-gray-800">Ajouter une signature</h3>
					<button @click="showSignaturePad = false"
						class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
					<canvas ref="signaturePad" class="w-full h-48 bg-gray-50"></canvas>
				</div>
				<div class="flex justify-between">
					<button @click="clearSignature"
						class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
						Effacer
					</button>
					<button @click="saveSignature"
						class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
						Enregistrer la signature
					</button>
				</div>
			</div>
		</div>

		<!-- Fiche d'Intervention Modal -->
		<div v-if="viewingReport"
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
							<p class="text-gray-500 text-sm mt-3">Référence: FI-{{ String(viewingReport.id).padStart(5, '0') }}</p>
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
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20"
											fill="currentColor">
											<path fill-rule="evenodd"
												d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
												clip-rule="evenodd" />
										</svg>
										<span class="font-medium text-gray-800">{{ viewingReport.quotation_file_name }}</span>
										<button @click="downloadQuotation(viewingReport.id)" class="ml-2 text-blue-600 hover:text-blue-800">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fill-rule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clip-rule="evenodd" />
											</svg>
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
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20"
												fill="currentColor">
												<path fill-rule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clip-rule="evenodd" />
											</svg>
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
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
							Modifier en-tête
						</button>
						<button @click="printReport"
							class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd"
									d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
									clip-rule="evenodd" />
							</svg>
							Imprimer
						</button>
						<button @click="generatePDF(viewingReport.id)"
							class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="CurrentColor">
								<path fill-rule="evenodd"
									d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7.707 3.293a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 010 1.414z"
									clip-rule="evenodd" />
							</svg>
							Enregistrer en PDF
						</button>
						<button @click="viewingReport = null"
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
useHead({title: "Signaler une panne"});
// Je importe les fonctions nécessaires de Vue
import Swal from 'sweetalert2';
import { ref, onMounted, watch } from 'vue'
import InvalidInput from '~/app/components/partials/InvalidInput.vue';
import { useEquipmentStore } from '~/app/stores/Maintenance/EquipmentStore';
import { useInterventionStore } from '~/app/stores/Maintenance/InterventionStore';
import type { Client } from '~/models/Client';
import type { Equipment } from '~/models/Equipment';
import { InterventionFormData, type Intervention } from '~/models/Intervention';
// Je importe axios pour les requêtes HTTP
// import axios from 'axios'

const axios = {};

// Je définis l'URL de base de l'API
const API_BASE_URL = 'http://192.168.210.157:8000/api'

// Je crée un objet API pour organiser toutes les requêtes
const api = {
	// Je définis les méthodes pour les interventions

	createIntervention: (data) => axios.post(`${API_BASE_URL}/interventions`, data),
	updateIntervention: (id, data) => axios.put(`${API_BASE_URL}/interventions/${id}`, data),
	deleteIntervention: (id) => axios.delete(`${API_BASE_URL}/interventions/${id}`),

	// Je définis les méthodes pour les uploads de fichiers
	uploadQuotation: (id, file) => {
		const formData = new FormData()
		formData.append('quotation_file', file)
		return axios.post(`${API_BASE_URL}/interventions/${id}/upload-quotation`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	uploadAudio: (id, file) => {
		const formData = new FormData()
		formData.append('audio_file', file)
		return axios.post(`${API_BASE_URL}/interventions/${id}/upload-audio`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	downloadQuotation: (id) => axios.get(`${API_BASE_URL}/interventions/${id}/download-quotation`, { responseType: 'blob' }),

	// Je définis les méthodes pour les signatures
	addSignature: (id, type, data) => axios.post(`${API_BASE_URL}/interventions/${id}/signature`, {
		signature_type: type,
		signature_data: data
	}),

	// Je définis les méthodes pour la génération de PDF
	generatePDF: (id) => axios.get(`${API_BASE_URL}/interventions/${id}/generate-pdf`, {
		responseType: 'blob',
		timeout: 30000 // Je définis un timeout de 30 secondes
	}),

	getTechnicians: () => axios.get(`${API_BASE_URL}/displayTechnicians`)
}

// Je définis les informations de l'entreprise avec des valeurs par défaut
const companyInfo = ref({
	name: 'TechRepair Pro',
	tagline: 'Service de maintenance et réparation',
	address: '123 Avenue de la Technologie, 75000 Paris',
	phone: '+33 1 23 45 67 89',
	email: 'contact@techrepair.fr',
	website: 'www.techrepair.fr'
})

// Je crée une référence pour le mode édition des informations de l'entreprise
const editingCompanyInfo = ref(false)

// Je définis une fonction pour formater les dates pour l'API
const formatDateForAPI = (dateString) => {
	if (!dateString) return null
	return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ')
}

// Je utilise onMounted pour charger les données au montage du composant
onMounted(() => {
	// Je charge les informations de l'entreprise depuis le localStorage
	const savedCompanyInfo = localStorage.getItem('companyInfo')
	if (savedCompanyInfo) {
		companyInfo.value = JSON.parse(savedCompanyInfo)
	}
	// Je charge les interventions, équipements, clients et techniciens
	loadInterventions()
	loadEquipmentList()
	loadClientList()
	loadTechnicians()
})

// Je définis une fonction pour sauvegarder les informations de l'entreprise
const saveCompanyInfo = () => {
	localStorage.setItem('companyInfo', JSON.stringify(companyInfo.value))
	editingCompanyInfo.value = false
}

const clientStore = useClientStore()
const technicianStore = useTechnicianStore();
const equipmentStore = useEquipmentStore();
const interventionStore = useInterventionStore();

// Je crée des références pour les listes de données
const { equipments } = storeToRefs(equipmentStore);
const { clients } = storeToRefs(clientStore);
const { technicians } = storeToRefs(technicianStore);
const { interventions, validationErrors } = storeToRefs(interventionStore);

// Je crée des références pour l'état du formulaire et des modales
const showForm = ref(false)
const editing = ref(false)
const viewingReport = ref(null)
const selectedEquipment = ref<Equipment | null>(null)
const selectedClient = ref<Client | null>(null)
const isRecording = ref(false)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const showSignaturePad = ref(false)
const signatureType = ref('')
const signaturePad = ref(null)
const signaturePadInstance = ref(null)

// Je définis la structure du formulaire avec des valeurs par défaut
const form = ref<Intervention>(InterventionFormData())

// Je définis la fonction pour charger les interventions
const loadInterventions = async () => {
	try {
		await interventionStore.fetchInterventions();
	} catch (error) {
		useAlert().showAlert('Impossible de charger les interventions', 'error', 5000)
	}
}

// Je définis la fonction pour charger la liste des équipements
const loadEquipmentList = async () => {
	try {
		await equipmentStore.fetchEquipments()
	} catch (error) {
		useAlert().showAlert('Impossible de charger la liste des équipements', 'error', 5000)
	}
}

// Je définis la fonction pour charger la liste des clients
const loadClientList = async () => {
	try {
		await clientStore.fetchClients();
	} catch (error) {
		useAlert().showAlert('Impossible de charger la liste des clients', 'error', 5000);
	}
}

// Je définis la fonction pour charger la liste des techniciens
const loadTechnicians = async () => {
	try {
		await technicianStore.fetchTechnicians()
	} catch (error) {
		useAlert().showAlert('Impossible de charger la liste des techniciens', 'error', 5000)
	}
}

// Je définis la fonction de validation du formulaire
const validateForm = () => {
	// if (!form.value.equipment_id) {
	// 	Swal.fire('Veuillez sélectionner un équipement');
	// 	return false
	// }
	if (!form.value.client_id) {
		Swal.fire('Veuillez sélectionner un client');
		return false
	}
	if (!form.value.problem_description) {
		Swal.fire('Veuillez saisir la description du problème');
		return false
	}
	if (!form.value.technician_id) {
		Swal.fire('Veuillez sélectionner un technicien');
		return false
	}
	return true
}

// Je définis la fonction pour charger les détails de l'équipement sélectionné
const loadEquipmentDetails = () => {
	if (!form.value.equipement_id) {
		selectedEquipment.value = null
		return
	}
	selectedEquipment.value = equipments.value.find(e => e.id == form.value.equipement_id)
}

// Je définis la fonction pour charger les détails du client sélectionné
const loadClientDetails = () => {
	if (!form.value.client_id) {
		selectedClient.value = null
		form.value.department = ''
		form.value.location = ''
		return
	}

	selectedClient.value = clients.value.find(_ => _.id == form.value.client_id)

	if (selectedClient.value) {
		form.value.department = selectedClient.value.department || ''
		form.value.location = selectedClient.value.location || ''
	}
}

// Je définis la fonction pour gérer l'upload de fichiers
const handleFileUpload = (event) => {
	const file = event.target.files[0]
	if (file) {
		form.value.quotation_file_name = file.name
		form.value.quotation_file = file
	}
}

// Je définis la fonction pour gérer l'enregistrement audio
const toggleAudioRecording = async () => {
	if (isRecording.value) {
		mediaRecorder.value.stop()
		isRecording.value = false
		return
	}

	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		mediaRecorder.value = new MediaRecorder(stream)
		audioChunks.value = []

		mediaRecorder.value.ondataavailable = (event) => {
			audioChunks.value.push(event.data)
		}

		mediaRecorder.value.onstop = () => {
			const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
			form.value.audio_recording_url = URL.createObjectURL(audioBlob)
			stream.getTracks().forEach(track => track.stop())
		}

		mediaRecorder.value.start()
		isRecording.value = true
	} catch (error) {
		console.error('Erreur lors de l\'enregistrement audio:', error)
		alert('Impossible d\'accéder au microphone. Vérifiez les permissions.')
	}
}

// Je définis la fonction pour afficher le modal de signature
const showSignatureModal = (type) => {
	signatureType.value = type
	showSignaturePad.value = true

	// Je réinitialise le canvas après un court délai
	setTimeout(() => {
		if (signaturePad.value) {
			const canvas = signaturePad.value
			const ctx = canvas.getContext('2d')

			// Je redimensionne le canvas
			const rect = canvas.getBoundingClientRect()
			canvas.width = rect.width
			canvas.height = rect.height

			// Je définis le style du canvas
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.strokeStyle = '#000000'
			ctx.lineWidth = 2
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'

			let isDrawing = false
			let lastX = 0
			let lastY = 0

			const startDrawing = (e) => {
				isDrawing = true
				const rect = canvas.getBoundingClientRect()
				lastX = e.clientX - rect.left
				lastY = e.clientY - rect.top
			}

			const draw = (e) => {
				if (!isDrawing) return
				const rect = canvas.getBoundingClientRect()
				const currentX = e.clientX - rect.left
				const currentY = e.clientY - rect.top

				ctx.beginPath()
				ctx.moveTo(lastX, lastY)
				ctx.lineTo(currentX, currentY)
				ctx.stroke()

				lastX = currentX
				lastY = currentY
			}

			const stopDrawing = () => {
				isDrawing = false
			}

			// Je nettoie les anciens événements
			canvas.removeEventListener('mousedown', startDrawing)
			canvas.removeEventListener('mousemove', draw)
			canvas.removeEventListener('mouseup', stopDrawing)
			canvas.removeEventListener('mouseout', stopDrawing)

			// J'ajoute les nouveaux événements
			canvas.addEventListener('mousedown', startDrawing)
			canvas.addEventListener('mousemove', draw)
			canvas.addEventListener('mouseup', stopDrawing)
			canvas.addEventListener('mouseout', stopDrawing)

			// Je ajoute le support tactile
			canvas.addEventListener('touchstart', (e) => {
				e.preventDefault()
				const touch = e.touches[0]
				const mouseEvent = new MouseEvent('mousedown', {
					clientX: touch.clientX,
					clientY: touch.clientY
				})
				canvas.dispatchEvent(mouseEvent)
			})

			canvas.addEventListener('touchmove', (e) => {
				e.preventDefault()
				const touch = e.touches[0]
				const mouseEvent = new MouseEvent('mousemove', {
					clientX: touch.clientX,
					clientY: touch.clientY
				})
				canvas.dispatchEvent(mouseEvent)
			})

			canvas.addEventListener('touchend', (e) => {
				e.preventDefault()
				const mouseEvent = new MouseEvent('mouseup', {})
				canvas.dispatchEvent(mouseEvent)
			})

			// Je stocke les fonctions pour le nettoyage
			signaturePadInstance.value = {
				clear: () => {
					ctx.fillStyle = 'white'
					ctx.fillRect(0, 0, canvas.width, canvas.height)
				},
				toDataURL: () => canvas.toDataURL('image/png'),
				isEmpty: () => {
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
					const data = imageData.data
					for (let i = 0; i < data.length; i += 4) {
						if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
							return false
						}
					}
					return true
				}
			}
		}
	}, 100)
}

// Je définis la fonction pour effacer la signature
const clearSignature = () => {
	if (signaturePadInstance.value) {
		signaturePadInstance.value.clear()
	}
}

// Je définis la fonction pour sauvegarder la signature
const saveSignature = async () => {
	if (!signaturePadInstance.value || signaturePadInstance.value.isEmpty()) {
		alert('Veuillez fournir une signature')
		return
	}

	try {
		const signatureData = signaturePadInstance.value.toDataURL()

		// Je sauvegarde dans le formulaire selon le type de signature
		if (signatureType.value === 'technician') {
			form.value.technician_signature = signatureData
		} else {
			form.value.client_signature = signatureData
		}

		showSignaturePad.value = false
		alert('Signature enregistrée avec succès')
	} catch (error) {
		console.error('Erreur lors de l\'enregistrement de la signature:', error)
		alert('Erreur lors de l\'enregistrement de la signature')
	}
}

// Je définis la fonction pour télécharger le devis
const downloadQuotation = async (id) => {
	try {
		const response = await api.downloadQuotation(id)
		const url = window.URL.createObjectURL(new Blob([response.data]))
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', `devis-intervention-${id}.pdf`)
		document.body.appendChild(link)
		link.click()
		link.remove()
		window.URL.revokeObjectURL(url)
	} catch (error) {
		console.error('Erreur lors du téléchargement du devis:', error)
		alert('Erreur lors du téléchargement du devis')
	}
}

// Je définis la fonction pour télécharger l'audio
const downloadAudio = async (id) => {
	try {
		alert('Fonctionnalité de téléchargement audio à implémenter')
	} catch (error) {
		console.error('Erreur lors du téléchargement de l\'audio:', error)
		alert('Erreur lors du téléchargement de l\'audio')
	}
}

// Je définis la fonction pour soumettre le formulaire
const submitForm = async () => {
	try {
		// Je valide le formulaire
		if (!validateForm()) return

		if (editing.value) {
			// Je mets à jour l'intervention existante
			await interventionStore.updateIntervention(viewingReport.value.id, form.value);
			viewingReport.value = InterventionFormData();
		} else {
			await interventionStore.createIntervention(form.value);
		}

		closeForm()
		loadInterventions()
		Swal.fire(editing.value ? 'Intervention mise à jour avec succès' : 'Intervention créée avec succès', 'success');

	} catch (error) {
		console.error('Erreur détaillée lors de l\'enregistrement:', error)
		console.error('Réponse complète de l\'erreur:', error.response?.data)

		const errorMessage = error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			'Erreur inconnue lors de l\'enregistrement'
		alert(`Erreur lors de l'enregistrement: ${errorMessage}`)
	}
}

// Je définis la fonction pour éditer un rapport
const editReport = (report) => {
	viewingReport.value = report
	editing.value = true
	showForm.value = true

	const equip = equipments.value.find(e => e.id == report.equipement_id)
	const client = clients.value.find(c => c.id == report.client_id)
	const technician = technicians.value.find(t => t.id == report.technicien_id)

	form.value = {
		client_id: client?.id || '',
		equipement_id: equip?.id || '',
		technicien_id: technician?.id || '',
		problem_description: report.problem_description,
		report_date: report.report_date ? new Date(report.report_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
		contact_time: report.contact_time,
		status: report.status,
		department: report.department,
		location: report.location,
		is_tested_certified: !!report.is_tested_certified,
		is_sent_for_maintenance: !!report.is_sent_for_maintenance,
		needs_delivery: !!report.needs_delivery,
		delivery_price: report.delivery_price || 0,
		under_contract: !!report.under_contract,
		repair_start_date: report.repair_start_date ? new Date(report.repair_start_date).toISOString().slice(0, 16) : '',
		repair_end_date: report.repair_end_date ? new Date(report.repair_end_date).toISOString().slice(0, 16) : '',
		repair_duration: report.repair_duration,
		technician_findings: report.technician_findings,
		quotation_file_name: report.quotation_file_name || '',
		quotation_file: null,
		quotation_amount: report.quotation_amount || '',
		audio_recording_url: report.audio_recording_url || '',
		quotation_email_sent: !!report.quotation_email_sent,
		quotation_email_date: report.quotation_email_date ? new Date(report.quotation_email_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
		quotation_comments: report.quotation_comments || '',
		technician_signature: report.technician_signature || '',
		client_signature: report.client_signature || ''
	}

	if (equip) {
		selectedEquipment.value = equip
	}

	if (client) {
		selectedClient.value = client
	}
}

// Je définis la fonction pour visualiser un rapport
const viewReport = (report) => {
	viewingReport.value = report
	console.log('Rapport visualisé:', report)
	console.log('Signature technicien:', report.technician_signature)
	console.log('Signature client:', report.client_signature)
}

// Je définis la fonction pour supprimer un rapport
const deleteReport = async (id: string) => {
	if (confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
		try {
			await interventionStore.deleteIntervention(id)
			interventions.value = interventions.value.filter(_ => _.id !== id)
			Swal.fire('Intervention supprimée avec succès');
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			Swal.fire('Erreur lors de la suppression de l\'intervention', 'error');
		}
	}
}

// Je définis la fonction pour fermer le formulaire
const closeForm = () => {
	showForm.value = false
	editing.value = false
	viewingReport.value = null
	selectedClient.value = null
	form.value = {
		client_id: '',
		equipement_id: '',
		technicien_id: '',
		problem_description: '',
		report_date: new Date().toISOString().slice(0, 16),
		contact_time: '',
		status: 'Nouveau',
		department: '',
		location: '',
		is_tested_certified: false,
		is_sent_for_maintenance: false,
		needs_delivery: false,
		delivery_price: 0,
		under_contract: false,
		repair_start_date: '',
		repair_end_date: '',
		repair_duration: '',
		technician_findings: '',
		quotation_file_name: '',
		quotation_file: null,
		quotation_amount: '',
		audio_recording_url: '',
		quotation_email_sent: false,
		quotation_email_date: new Date().toISOString().slice(0, 16),
		quotation_comments: '',
		technician_signature: '',
		client_signature: ''
	}
	selectedEquipment.value = null
}

// Je définis la fonction pour imprimer le rapport
const printReport = () => {
	window.print()
}

// Je définis la fonction pour générer un PDF
const generatePDF = async (id) => {
	try {
		console.log('Génération PDF pour l\'intervention:', id)

		const response = await api.generatePDF(id)

		if (response.status !== 200) {
			throw new Error(`Erreur HTTP: ${response.status}`)
		}

		// Je crée un blob à partir de la réponse
		const blob = new Blob([response.data], { type: 'application/pdf' })

		// Je crée une URL pour le blob
		const url = window.URL.createObjectURL(blob)

		// Je crée un lien de téléchargement
		const link = document.createElement('a')
		link.href = url
		link.download = `fiche-intervention-${id}.pdf`

		// Je déclenche le téléchargement
		document.body.appendChild(link)
		link.click()

		// Je nettoie
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

		// Je fournis une solution de secours
		alert('Le PDF ne peut pas être généré. Vérifiez que le serveur Laravel est correctement configuré. Ouverture de la version imprimable...')
		viewingReport.value = interventions.value.find(r => r.id === id)
		setTimeout(() => {
			window.print()
		}, 500)
	}
}

// Je définis la fonction pour formater les dates
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

// Je définis la fonction pour obtenir la couleur du statut
const getStatusColor = (status) => {
	switch (status) {
		case 'Nouveau': return 'bg-blue-100 text-blue-800'
		case 'En diagnostic': return 'bg-purple-100 text-purple-800'
		case 'Validation du devis en cours': return 'bg-yellow-100 text-yellow-800'
		case 'En réparation': return 'bg-indigo-100 text-indigo-800'
		case 'En attente de pièces': return 'bg-orange-100 text-orange-800'
		case 'Terminé': return 'bg-green-100 text-green-800'
		case 'Livré': return 'bg-teal-100 text-teal-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

// Je utilise watch pour calculer la durée de réparation automatiquement
watch(() => [form.value.repair_start_date, form.value.repair_end_date], ([start, end]) => {
	if (start && end) {
		const startDate = new Date(start)
		const endDate = new Date(end)
		const diff = endDate - startDate

		const days = Math.floor(diff / (1000 * 60 * 60 * 24))
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

		let duration = ''
		if (days > 0) duration += `${days} jour${days > 1 ? 's' : ''}`
		if (hours > 0) duration += `${duration ? ' et ' : ''}${hours} heure${hours > 1 ? 's' : ''}`

		form.value.repair_duration = duration || '0 heure'
	} else {
		form.value.repair_duration = ''
	}
})
</script>

<style lang="scss" scoped>
// Je définis les styles pour l'impression
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

	/* Je définis les styles d'impression optimisés */
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

	/* Je m'assure que les signatures s'impriment correctement */
	.print-modal .border-2 {
		border: 1pt solid #d1d5db !important;
	}

	.print-modal .border-dashed {
		border-style: dashed !important;
	}

	.print-modal .h-32 {
		height: 64pt !important;
	}

	/* J'améliore l'affichage des images en impression */
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

	/* Je masque les éléments inutiles à l'impression */
	.print-modal .shadow-sm,
	.print-modal .shadow-lg,
	.print-modal .shadow-md {
		box-shadow: none !important;
	}
}

// Je définis les styles pour les éléments audio
audio {
	max-width: 100%;
	min-width: 200px;
}

/* Je définis les styles pour le canvas de signature */
canvas {
	touch-action: none;
	cursor: crosshair;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
}

/* J'améliore l'affichage des signatures */
img {
	object-fit: contain;
	background: white;
}

/* Je définis le style pour les zones de signature vides */
.border-dashed {
	background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}
</style>
