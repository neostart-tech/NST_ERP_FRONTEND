<template>
	<!-- Fiche d'Intervention Modal -->
	<div v-if="modelValue && report"
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
						<p class="text-gray-500 text-sm mt-3">Référence: FI-{{ String(report.id).padStart(5, '0') }}
						</p>
						<p class="text-gray-500 text-sm mt-1">Date: {{ formatDate(report.report_date) }}</p>
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
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<p class="text-sm text-blue-600 font-medium">Date du signalement</p>
							<p class="text-lg font-bold text-gray-800">{{ formatDate(report.report_date) }}</p>
						</div>
						<div>
							<p class="text-sm text-blue-600 font-medium">Heure de contact</p>
							<p class="text-lg font-bold text-gray-800">{{ report.contact_time || 'Non spécifié' }}</p>
						</div>
						<div>
							<p class="text-sm text-blue-600 font-medium">Statut</p>
							<span
								:class="`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`">
								{{ getStatusLabel(report.status) }}
							</span>
						</div>
					</div>
				</div>

				<!-- Sélections Équipement et Client -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
						<label class="block text-sm font-medium text-blue-700 mb-2">Équipement sélectionné</label>
						<p class="font-semibold text-gray-800">{{ report.equipment?.brand }} {{ report.equipment?.model }}</p>
						<p class="text-sm text-gray-600">{{ report.equipment?.serial_number }}</p>
					</div>
					<div class="bg-green-50 p-4 rounded-lg border border-green-100">
						<label class="block text-sm font-medium text-green-700 mb-2">Client sélectionné</label>
						<p class="font-semibold text-gray-800">{{ report.client?.client_type === 'company' ? report.client?.company_name : (report.client?.first_name + ' ' + report.client?.last_name) }}</p>
						<p class="text-sm text-gray-600">{{ report.client?.phone }}</p>
					</div>
				</div>

				<!-- Détails de l'équipement -->
				<div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
					<h3 class="font-medium text-gray-800 mb-3 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
						</svg>
						Détails de l'équipement
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-blue-600 font-medium mb-1">Nom</p>
							<p class="font-medium text-gray-800">{{ report.equipment?.brand }} {{ report.equipment?.model }}</p>
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-blue-600 font-medium mb-1">Numéro de série</p>
							<p class="font-medium text-gray-800">{{ report.equipment?.serial_number }}</p>
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-blue-600 font-medium mb-1">Fabricant</p>
							<p class="font-medium text-gray-800">{{ report.equipment?.manufacturer }}</p>
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-blue-600 font-medium mb-1">Modèle</p>
							<p class="font-medium text-gray-800">{{ report.equipment?.model }}</p>
						</div>
					</div>
				</div>

				<!-- Informations sur le client -->
				<div class="mb-6 bg-green-50 p-4 rounded-lg border border-green-100">
					<h3 class="font-medium text-gray-800 mb-3 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Informations client
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-green-600 font-medium mb-1">Type de client</p>
							<p class="font-medium text-gray-800">
								{{ report.client?.client_type === 'company' ? 'Client moral (entreprise)' : 'Client physique' }}
							</p>
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-green-600 font-medium mb-1">
								{{ report.client?.client_type === 'company' ? 'Nom de l\'entreprise' : 'Nom du client' }}
							</p>
							<p class="font-medium text-gray-800">
								{{ report.client?.client_type === 'company' ? report.client?.company_name : (report.client?.first_name + ' ' + report.client?.last_name) }}
							</p>
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-green-600 font-medium mb-1">Téléphone</p>
							<p class="font-medium text-gray-800">{{ report.client?.phone }}</p>
						</div>
						<div class="bg-white p-3 rounded-lg shadow-sm">
							<p class="text-xs text-green-600 font-medium mb-1">Email</p>
							<p class="font-medium text-gray-800">{{ report.client?.email }}</p>
						</div>
					</div>
				</div>

				<!-- Description du problème -->
				<div class="mb-6">
					<label class="block text-sm font-medium text-gray-700 mb-2">Défaut constaté</label>
					<div class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
						<p class="text-gray-800 whitespace-pre-wrap">{{ report.problem_description || 'Non spécifié' }}</p>
					</div>
				</div>

				<!-- Technicien et Dates -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Technicien assigné</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
							<p class="text-gray-800">{{ report.technician?.full_name || 'Non assigné' }}</p>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Date du signalement</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
							<p class="text-gray-800">{{ formatDate(report.report_date) }}</p>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Heure de contact</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
							<p class="text-gray-800">{{ report.contact_time || 'Non spécifiée' }}</p>
						</div>
					</div>
				</div>

				<!-- Statut et Checkboxes -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
							<span :class="`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`">
								{{ getStatusLabel(report.status) }}
							</span>
						</div>
					</div>
					<div class="space-y-3">
						<div class="flex items-center">
							<input :checked="report.is_tested_certified" type="checkbox" disabled
								class="h-4 w-4 text-blue-600 border-gray-300 rounded">
							<label class="ml-2 block text-sm text-gray-700">L'objet testé certifié en état de marche</label>
						</div>
						<div class="flex items-center">
							<input :checked="report.is_sent_for_maintenance" type="checkbox" disabled
								class="h-4 w-4 text-blue-600 border-gray-300 rounded">
							<label class="ml-2 block text-sm text-gray-700">L'objet envoyé pour suite de maintenance</label>
						</div>
						<div v-if="report.is_sent_for_maintenance" class="flex items-center ml-6">
							<input :checked="report.needs_delivery" type="checkbox" disabled
								class="h-4 w-4 text-blue-600 border-gray-300 rounded">
							<label class="ml-2 block text-sm text-gray-700">Le client souhaite être livré</label>
						</div>
						<div v-if="report.needs_delivery && report.delivery_price" class="ml-6">
							<label class="block text-sm font-medium text-gray-700 mb-1">Prix de livraison</label>
							<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
								<p class="text-gray-800">{{ report.delivery_price }} FCFA</p>
							</div>
						</div>
						<div class="flex items-center">
							<input :checked="report.under_contract" type="checkbox" disabled
								class="h-4 w-4 text-blue-600 border-gray-300 rounded">
							<label class="ml-2 block text-sm text-gray-700">Client sous contrat</label>
						</div>
					</div>
				</div>

				<!-- Dates de réparation -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Date début réparation</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
							<p class="text-gray-800">{{ formatDate(report.repair_start_date) || 'Non spécifiée' }}</p>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Date fin réparation</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
							<p class="text-gray-800">{{ formatDate(report.repair_end_date) || 'Non spécifiée' }}</p>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Durée de réparation</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
							<p class="text-gray-800">{{ report.repair_duration || 'Non calculée' }}</p>
						</div>
					</div>
				</div>

				<!-- Défaut constaté par le technicien -->
				<div class="mb-6">
					<label class="block text-sm font-medium text-gray-700 mb-2">Défaut constaté par le technicien</label>
					<div class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
						<p class="text-gray-800 whitespace-pre-wrap">{{ report.technician_findings || 'Non spécifié' }}</p>
					</div>
				</div>

				<!-- Section Devis -->
				<!-- <div class="mb-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						Devis
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Fichier du devis</label>
							<div class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
								<div v-if="report.quotation_file_name" class="flex items-center">
									<Icon name="heroicons:document" class="h-5 w-5 text-blue-500 mr-2" />
									<span class="font-medium text-gray-800 flex-1">{{ report.quotation_file_name }}</span>
									<button @click="$emit('download-quotation', report.id)" class="ml-2 text-blue-600 hover:text-blue-800 no-print">
										<Icon name="heroicons:arrow-down-tray" class="h-5 w-5" />
									</button>
								</div>
								<p v-else class="text-gray-500 italic">Aucun fichier joint</p>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Montant</label>
							<div class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
								<p class="font-medium text-gray-800">{{ report.quotation_amount ? `${report.quotation_amount} FCFA` : 'Non spécifié' }}</p>
							</div>
						</div>
					</div>

					<div v-if="report.quotation_comments" class="mt-4">
						<label class="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
						<div class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
							<p class="text-gray-800 whitespace-pre-line">{{ report.quotation_comments }}</p>
						</div>
					</div>
				</div> -->

				<!-- Signatures -->
				<!-- <div class="mb-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						</svg>
						Signatures
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Signature du technicien</label>
							<div class="border-2 border-dashed border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center">
								<span class="text-gray-400">Non disponible</span>
							</div>
							<p class="text-sm font-medium text-gray-700 mt-2 text-center">{{ report.technician?.full_name }}</p>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Signature du client</label>
							<div class="border-2 border-dashed border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center">
								<span class="text-gray-400">Non disponible</span>
							</div>
							<p class="text-sm font-medium text-gray-700 mt-2 text-center">
								{{ report.client?.client_type === 'company' ? report.client?.company_name : (report.client?.first_name + ' ' + report.client?.last_name) }}
							</p>
						</div>
					</div>
				</div> -->

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
					<button @click="$emit('print')"
						class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
						<Icon name="heroicons:printer" class="h-5 w-5 mr-2" />
						Imprimer
					</button>
					<button @click="$emit('generate-pdf', report.id)"
						class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md">
						<Icon name="heroicons:document-arrow-down" class="h-5 w-5 mr-2" />
						Enregistrer en PDF
					</button>
					<button @click="$emit('close')"
						class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors shadow-md">
						Fermer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Intervention } from '~/models/Intervention';
import { getStatusColor } from '~/models/Intervention';

interface Props {
	modelValue: boolean;
	report: Intervention | null;
}

const props = defineProps<Props>();

defineEmits<{
	'update:modelValue': [value: boolean];
	'close': [];
	'print': [];
	'generate-pdf': [id: string];
	'download-quotation': [id: string];
	'download-audio': [id: string];
}>();

const companyInfo = ref({
	name: 'TechRepair Pro',
	tagline: 'Service de maintenance et réparation',
	address: '123 Avenue de la Technologie, 75000 Paris',
	phone: '+33 1 23 45 67 89',
	email: 'contact@techrepair.fr',
	website: 'www.techrepair.fr'
});

const editingCompanyInfo = ref(false);

onMounted(() => {
	const saved = localStorage.getItem('companyInfo');
	if (saved) {
		companyInfo.value = JSON.parse(saved);
	}
});

const saveCompanyInfo = () => {
	localStorage.setItem('companyInfo', JSON.stringify(companyInfo.value));
	editingCompanyInfo.value = false;
};

const formatDate = (dateString: string) => {
	if (!dateString) return '';
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	} catch (error) {
		return dateString;
	}
};

const getStatusLabel = (status: string) => {
	const statusLabels: Record<string, string> = {
		'new': 'Nouveau',
		'diagnostic': 'En diagnostic',
		'quotation': 'Validation du devis en cours',
		'repair': 'En réparation',
		'waiting': 'En attente de pièces',
		'finished': 'Terminé',
		'delivered': 'Livré'
	};
	return statusLabels[status] || status;
};
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
