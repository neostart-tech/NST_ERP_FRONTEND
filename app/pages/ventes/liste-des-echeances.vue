<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
		<!--Stats-->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
			<!-- Carte Total Échéanciers -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Échéanciers</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.totalSchedules || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:calendar-days" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Montant Total Dû -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Montant Total Dû</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">{{ formatCurrency(stats.totalDue) || '0 FCFA' }}</p>
						<p class="text-xs text-amber-700 mt-1">
							<Icon name="heroicons-solid:exclamation-triangle" class="inline-block w-3 h-3 mr-1"/>
							{{ stats.overdueCount || 0 }} échéances en retard
						</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:banknotes" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Montant Total Payé -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Montant Total Payé</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ formatCurrency(stats.totalPaid) || '0 FCFA' }}</p>
						<div class="mt-2">
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
									:style="{
										width:
											stats.totalPaid > 0
												? Math.min(
													100,
													(stats.totalPaid / (stats.totalPaid + (stats.totalDue || 0))) * 100
												) + '%'
											: '0%',
									}"
								></div>
							</div>
						</div>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons-solid:check-circle" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>
		</div>

		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des échéances</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Barre de recherche -->
				<div class="relative flex-grow">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400"/>
					</div>
					<input type="text" v-model="searchQuery" placeholder="Rechercher..."
								 class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
								 @input="filterSchedules"/>
				</div>

				<!-- Filtre statut (toutes / payées / impayées) -->
				<div class="w-full sm:w-48">
					<label class="sr-only">Filtrer par statut</label>
					<select v-model="statusFilter" @change="filterSchedules"
							class="block w-full pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
						<option value="all">Toutes</option>
						<option value="paid">Payées</option>
						<option value="unpaid">Impayées</option>
					</select>
				</div>

				<NuxtLink :to="AppUrl.ADD_NEW_SCHEDULE"
									class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2"/>
					Nouvelles échéances
				</NuxtLink>
			</div>
		</div>

		<template v-if="schedules.length > 0">
			<!-- Vue Tableau pour grands écrans (xl et plus) -->
			<div class="hidden xl:block bg-white shadow rounded-lg overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-green-50">
					<tr>
						<th
							scope="col"
							class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
						>
							N°
						</th>
						<th
							scope="col"
							class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
						>
							Client
						</th>
						<th
							scope="col"
							class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
						>
							Facture
						</th>
						<th
							scope="col"
							class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
						>
							Montant Total
						</th>
						<th
							scope="col"
							class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
						>
							Date prévue
						</th>
						<th
							scope="col"
							class="px-4 py-4 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider"
						>
							Actions
						</th>
					</tr>
					</thead>
					<tbody>
					<tr
						v-for="(schedule, index) in paginatedSchedules"
						:key="schedule.id"
						class="border-t hover:bg-gray-50 transition duration-100 ease-in-out"
					>
						<td class="p-3 text-left text-gray-800 font-medium">{{ index + 1 }}</td>
						<td class="p-3 text-left text-gray-800">
							{{ getClientName(schedule.invoice.client) }}
						</td>
						<td class="p-3 text-left text-gray-700">{{ schedule.invoice.reference }}</td>
						<td class="p-3 text-left font-semibold">
							<div>
								{{ formatCurrency(schedule.amount) }} <span :class="getStatusBadge(schedule)"
																														class="px-2 py-1 inline-flex font-normal text-xs leading-5 rounded-full">{{
									getStatus(schedule)
								}}</span>
							</div>
							<div class="text-xs text-gray-500 mt-1">Sur: {{
									formatCurrency(schedule.invoice.total)
								}}
							</div>
						</td>
						<td class="p-3 text-left">
							<div>{{ formatDate(schedule.scheduledDate) }}</div>
							<div class="text-xs text-gray-500 mt-1">
								Relance: {{ formatDate(new Date(new Date(schedule.scheduledDate).getTime() - 48 * 60 * 60 * 1000)) }}
							</div>
						</td>

						<td class="p-3 text-center text-sm relative">
							<button @click.stop="toggleActions(schedule.id)" :data-actions-button="schedule.id"
									class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
								<span class="sr-only">Actions</span>
								<Icon name="heroicons-solid:ellipsis-horizontal" class="w-5 h-5"/>
							</button>

							<!-- Dropdown téléporté pour éviter le clipping -->
							<teleport to="body">
								<div v-if="openActionsId === schedule.id && dropdownPortal.id === schedule.id"
									:data-actions-dropdown="String(schedule.id)"
									:style="{ position: 'fixed', top: dropdownPortal.top + 'px', left: dropdownPortal.left + 'px', width: '11rem' }"
									class="z-50 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
									<ul class="divide-y divide-gray-100">
										<li>
											<button @click.stop="() => { viewSchedule(schedule); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
												<Icon name="heroicons-solid:eye" class="w-4 h-4 inline mr-2"/>
												Voir
											</button>
										</li>
										<li v-if="!schedule.actualDate">
											<button @click.stop="() => { openReminderModal(schedule); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50">
												<Icon name="heroicons-solid:bell" class="w-4 h-4 inline mr-2"/>
												Envoyer relance
											</button>
										</li>
										<li v-if="!schedule.actualDate">
											<button @click.stop="() => { markAsPaid(schedule); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50">
												<Icon name="heroicons-solid:check" class="w-4 h-4 inline mr-2"/>
												Marquer payé
											</button>
										</li>
										<li>
											<button @click.stop="() => { deleteSchedule(schedule); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
												<Icon name="heroicons-solid:trash" class="w-4 h-4 inline mr-2"/>
												Supprimer
											</button>
										</li>
									</ul>
								</div>
							</teleport>
						</td>
					</tr>
					</tbody>
				</table>
			</div>

			<!-- Vue Cards pour petits et moyens écrans (lg et moins) -->
			<div class="xl:hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div
					v-for="schedule in paginatedSchedules"
					:key="schedule.id"
					class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
				>
					<!-- En-tête de la card avec statut -->
					<div class="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
						<div class="flex items-center justify-between">
							<h3 class="text-sm font-semibold text-blue-900">{{ schedule.invoice.reference }}</h3>
							<span :class="getStatusBadge(schedule)"
										class="px-2 py-1 text-xs font-medium rounded-full">
								{{ getStatus(schedule) }}
							</span>
						</div>
					</div>

					<!-- Contenu de la card -->
					<div class="px-4 py-3 space-y-3">
						<div>
							<p class="text-xs text-gray-500 uppercase tracking-wide">Client</p>
							<p class="text-sm font-medium text-gray-900 mt-1">
								{{ getClientName(schedule.invoice.client) }}
							</p>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div>
								<p class="text-xs text-gray-500 uppercase tracking-wide">Montant échéance</p>
								<p class="text-base font-bold text-blue-600 mt-1">
									{{ formatCurrency(schedule.amount) }}
								</p>
								<p class="text-xs text-gray-400 mt-0.5">
									Sur {{ formatCurrency(schedule.invoice.total) }}
								</p>
							</div>

							<div>
								<p class="text-xs text-gray-500 uppercase tracking-wide">Date prévue</p>
								<p class="text-sm font-medium text-gray-900 mt-1">
									{{ formatDate(schedule.scheduledDate) }}
								</p>
								<p class="text-xs text-gray-500 mt-1">
									Relance: {{ formatDate(new Date(new Date(schedule.scheduledDate).getTime() - 48 * 60 * 60 * 1000)) }}
								</p>
							</div>
						</div>
					</div>

					<!-- Boutons d'action au bas de la card -->
					<div class="border-t border-gray-200 bg-gray-50 px-4 py-3">
						<div class="flex items-center justify-between gap-2">
							<button
								@click="viewSchedule(schedule)"
								class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
							>
								<Icon name="heroicons-solid:eye" class="w-4 h-4 mr-1.5"/>
								Voir
							</button>

							<button
								v-if="!schedule.actualDate"
								@click="openReminderModal(schedule)"
								class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
							>
								<Icon name="heroicons-solid:bell" class="w-4 h-4 mr-1.5"/>
								Relance
							</button>

							<button
								v-if="!schedule.actualDate"
								@click="markAsPaid(schedule)"
								class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
							>
								<Icon name="heroicons-solid:check" class="w-4 h-4 mr-1.5"/>
								Payer
							</button>

							<button
								@click="deleteSchedule(schedule)"
								class="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
							>
								<Icon name="heroicons-solid:trash" class="w-4 h-4"/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- EmptyState -->
		<template v-if="isLoading || schedules.length === 0 || filteredSchedules.length === 0">
			<EmptyState title="Aucune échéance trouvée" description="Il n'y a actuellement aucune échéance à afficher."
				icon="heroicons:cpu-chip" iconColor="text-blue-400" @reload="scheduleStore.fetchAll()"
				:isLoading="isLoading"
				:searchQuery="searchQuery"
			/>
		</template>

		<!-- Pagination -->
		<div v-if="filteredSchedules.length > 0" class="mt-6">
			<Paginator :totalItems="filteredSchedules.length" @range-changed="onRangeChanged" />
		</div>
	</div>

	<!-- Modal pour afficher le détail du schedule/invoice -->
	<InvoiceScheduleDetails
		:close-modal="closeModal"
		:selected-schedule="selectedSchedule"
		:show-modal="showModal"
		:total-h-t="totalHT"
	/>

	<!-- Modal pour marquer comme payée -->
	<MarkScheduleAsPaidModal
		:show-modal="showPaymentModal"
		:schedule="scheduleToMarkAsPaid"
		:mode-payments="modePayments"
		:is-saving="isSaving"
		:validation-errors="validationErrors"
		@close="closePaymentModal"
		@submit="handleMarkAsPaid"
	/>

	<!-- Modal pour envoyer une relance -->
	<SendReminderModal
		:show-modal="showReminderModal"
		:schedule="scheduleToRemind"
		:is-saving="isSaving"
		:validation-errors="validationErrors"
		@close="closeReminderModal"
		@submit="handleSendReminder"
	/>

</template>
<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import Swal from "sweetalert2";
import {useScheduleStore} from "@/stores/Sale/ScheduleStore";
import {useModePaymentStore} from "@/stores/ModePaymentStore";
import type {InvoiceSchedule} from "~/models/InvoiceSchedule";
import {formatDate} from "@/utils/dateParser";
import {formatCurrency} from "@/utils/currency-parser";
import {getClientName} from '~/models/Client';
import EmptyState from "@/components/EmptyState.vue";
import InvoiceScheduleDetails from "@/components/sales/InvoiceScheduleOrderArticlesDetails.vue";
import MarkScheduleAsPaidModal from "@/components/sales/MarkScheduleAsPaidModal.vue";
import SendReminderModal from "@/components/sales/SendReminderModal.vue";
import Paginator from "@/components/Paginator.vue";

const selectedSchedule = ref<InvoiceSchedule | null>(null);
const showModal = ref(false);
const searchQuery = ref('');
const filteredSchedules = ref<InvoiceSchedule[]>([]);

// Variables pour le modal de paiement
const showPaymentModal = ref(false);
const scheduleToMarkAsPaid = ref<InvoiceSchedule | null>(null);

// Variables pour le modal de relance
const showReminderModal = ref(false);
const scheduleToRemind = ref<InvoiceSchedule | null>(null);

// Filtre de statut: 'all' | 'paid' | 'unpaid'
const statusFilter = ref<'all' | 'paid' | 'unpaid'>('all');

const filterSchedules = () => {
	const query = (searchQuery.value || '').toLowerCase();
	filteredSchedules.value = schedules.value.filter(s => {
		// Recherche texte (référence ou nom client)
		const matchesQuery =
			(s.invoice.reference || '').toLowerCase().includes(query) ||
			(getClientName(s.invoice.client) || '').toLowerCase().includes(query);

		// Filtre par statut
		if (statusFilter.value === 'paid' && !s.actualDate) return false;
		if (statusFilter.value === 'unpaid' && s.actualDate) return false;

		return matchesQuery;
	});
};

const scheduleStore = useScheduleStore();
const {schedules, isLoading, isSaving, validationErrors} = storeToRefs(scheduleStore);

const modePaymentStore = useModePaymentStore();
const {modePayments} = storeToRefs(modePaymentStore);

// Actions menu state
const openActionsId = ref<number | string | null>(null);
const dropdownPortal = ref<{ id: number | string | null; top: number; left: number }>({ id: null, top: 0, left: 0 });

const toggleActions = (id: number | string) => {
	// toggle off
	if (openActionsId.value === id) {
		closeActions();
		return;
	}

	// calculer position du bouton
	const button = document.querySelector(`[data-actions-button=\"${id}\"]`) as HTMLElement | null;
	const dropdownWidth = 176; // en px (w-44 ~ 176px)
	const dropdownHeight = 150; // estimation
	let left = 8;
	let top = 8;

	if (button) {
		const rect = button.getBoundingClientRect();
		left = rect.right - dropdownWidth;
		if (left < 8) left = rect.left;
		if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;

		// espace en bas
		if (window.innerHeight - rect.bottom < dropdownHeight) {
			// afficher au-dessus
			top = rect.top - dropdownHeight - 8;
		} else {
			// afficher en dessous
			top = rect.bottom + 8;
		}
	}

	dropdownPortal.value = { id, top: Math.max(8, top), left: Math.max(8, left) };
	openActionsId.value = id;
};

const closeActions = () => {
	openActionsId.value = null;
	dropdownPortal.value = { id: null, top: 0, left: 0 };
};

// click-away pour fermer les dropdowns (inclut teleportés)
const onDocumentClick = (e: MouseEvent) => {
	if (!openActionsId.value) return;
	const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
	const clickedInside = path.some((el: any) => el && el.dataset && (typeof el.dataset.actionsDropdown !== 'undefined' || typeof el.dataset.actionsButton !== 'undefined'));
	if (!clickedInside) closeActions();
};

onMounted(async () => {
	await scheduleStore.fetchAll();
	await modePaymentStore.fetchAll();
	filteredSchedules.value = schedules.value;
	document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick));

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const paginatedSchedules = computed(() => {
	return filteredSchedules.value.slice(range.start - 1, range.end)
});

const stats = computed((): {
	totalSchedules: number;
	totalDue: number;
	totalPaid: number;
	overdueCount: number;
	activeSchedules: number
} => {
	let totalDue = 0;
	let totalPaid = 0;
	let overdueCount = 0;
	let activeSchedules = 0;
	const today = new Date();

	for (const s of schedules.value) {
		const paid = !!s.actualDate;
		if (paid) totalPaid += s.amount;
		else totalDue += s.amount;
		if (!paid) activeSchedules++;
		const scheduled = new Date(s.scheduledDate);
		if (!paid && scheduled < today) overdueCount++;
	}

	return {
		totalSchedules: schedules.value.length,
		totalDue,
		totalPaid,
		overdueCount,
		activeSchedules,
	};
});

function viewSchedule(schedule: InvoiceSchedule) {
	selectedSchedule.value = schedule;
	showModal.value = true;
}

function closeModal() {
	showModal.value = false;
	selectedSchedule.value = null;
}

const markAsPaid = (schedule: InvoiceSchedule) => {
	// Vérifier si déjà payée
	if (schedule.actualDate) {
		Swal.fire({
			icon: 'info',
			title: 'Échéance déjà payée',
			text: `Cette échéance a été payée le ${formatDate(schedule.actualDate)}`
		});
		return;
	}

	scheduleToMarkAsPaid.value = schedule;
	showPaymentModal.value = true;
};

const closePaymentModal = () => {
	showPaymentModal.value = false;
	scheduleToMarkAsPaid.value = null;
};

const openReminderModal = (schedule: InvoiceSchedule) => {
	scheduleToRemind.value = schedule;
	showReminderModal.value = true;
};

const closeReminderModal = () => {
	showReminderModal.value = false;
	scheduleToRemind.value = null;
};

const handleSendReminder = async (reason: string) => {
	if (!scheduleToRemind.value) return;

	try {
		await scheduleStore.sendReminder(scheduleToRemind.value.id, reason);

		Swal.fire({
			icon: 'success',
			title: 'Relance envoyée',
			text: 'Le client a été notifié avec succès',
			timer: 2000,
			showConfirmButton: false
		});

		closeReminderModal();
	} catch (err) {
		if (!scheduleStore.validationErrors || Object.keys(scheduleStore.validationErrors).length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: 'Impossible d\'envoyer la relance'
			});
		}
	}
};

const handleMarkAsPaid = async (payload: { amount: number; modePaymentId: string; date: string }) => {
	if (!scheduleToMarkAsPaid.value) return;

	try {
		await scheduleStore.markAsPaid(scheduleToMarkAsPaid.value.id, {
			amount: payload.amount,
			modePaymentId: payload.modePaymentId,
			date: payload.date
		});

		Swal.fire({
			icon: 'success',
			title: 'Échéance marquée comme payée',
			text: 'Le paiement a été enregistré avec succès',
			timer: 2000,
			showConfirmButton: false
		});

		closePaymentModal();
		await scheduleStore.fetchAll();
	} catch (err) {
		// Les erreurs de validation sont déjà gérées dans le store
		if (!scheduleStore.validationErrors || Object.keys(scheduleStore.validationErrors).length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: 'Impossible de marquer comme payé'
			}).then();
		}
	}
};

const deleteSchedule = async (schedule: InvoiceSchedule) => {
	const res = await Swal.fire({
		title: 'Supprimer l\'échéance',
		html: `Voulez-vous vraiment supprimer l\'échéance liée à la facture <strong>${schedule.invoice.reference}</strong> ?`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Oui, supprimer'
	});
	if (res.isConfirmed) {
		try {
			await scheduleStore.delete(schedule.id);
			Swal.fire({icon: 'success', title: 'Échéance supprimée'});
		} catch (err) {
			Swal.fire({icon: 'error', title: 'Erreur', text: 'Impossible de supprimer'});
		}
	}
};

const totalHT = computed(() => {
	if (!selectedSchedule.value) return 0;
	return selectedSchedule.value.invoice?.order.articles.reduce((sum: number, article: any) => sum + article.pivot!.quantity * article.pivot!.unit_price, 0);
});

const getStatus = (schedule: InvoiceSchedule) => {
	return schedule.actualDate ? "Payée" : "Impayée";
}

const getStatusBadge = (schedule: InvoiceSchedule) => {
	return schedule.actualDate ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800";
}
</script>
