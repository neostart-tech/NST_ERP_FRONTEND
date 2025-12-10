<template>
	<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- En-tête avec titre -->
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Vos Échéanciers</h1>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
			<!-- Carte Total Échéanciers -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Échéanciers</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.totalSchedules || 0 }}</p>
						<p class="text-xs text-blue-700 mt-1">
							<Icon name="heroicons:check-circle" class="inline-block w-3 h-3 mr-1" />
							{{ stats.activeSchedules || 0 }} actifs
						</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:calendar" class="w-6 h-6 text-white" />
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
							<Icon name="heroicons:exclamation-triangle" class="inline-block w-3 h-3 mr-1" />
							{{ stats.overdueCount || 0 }} échéances en retard
						</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:currency-dollar" class="w-6 h-6 text-white" />
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
							<p class="text-xs text-green-700 mt-1">
								{{ stats.totalPaid > 0 ? Math.round((stats.totalPaid / (stats.totalPaid + (stats.totalDue || 0))) * 100) : 0 }}% du total payé
							</p>
						</div>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
			<i class="fas fa-table"></i> Vue d'ensemble des échéances
		</h2>

		<div class="bg-white shadow rounded-lg overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gradient-to-r from-blue-50 to-blue-100">
					<tr>
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
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="scheduleStore.echeancier.length === 0">
						<td colspan="5" class="p-4 text-center text-gray-500">
							Aucun échéancier disponible pour le moment.
						</td>
					</tr>
					<tr
						v-for="schedule in scheduleStore.echeancier"
						:key="schedule.id"
						class="border-t hover:bg-gray-50 transition duration-100 ease-in-out"
					>
						<td class="p-3 border text-center text-gray-800">
							{{ schedule.invoice.order.client.name }}
						</td>
						<td class="p-3 border text-center text-gray-700">
							{{ schedule.invoice.reference }}
						</td>
						<td class="p-3 border text-center font-semibold">
							{{ formatCurrency(schedule.invoice.total) }}
						</td>
						<td class="p-3 border text-center space-x-3 flex justify-center">
							<button
								@click="viewSchedule(schedule)"
								title="Voir"
								class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out"
							>
								<i class="fas fa-eye"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div
		v-if="showModal && selectedSchedule"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div
			class="bg-white rounded-lg shadow-xl w-1/2 max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
		>
			<h2 class="text-2xl font-bold mb-4 text-indigo-700">
				Détails de l'échéancier
			</h2>
			<button
				@click="closeModal"
				class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
			>
				<i class="fas fa-times"></i>
			</button>

			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-6"
			>
				<p>
					<strong>Référence facture :</strong>
					{{ selectedSchedule.invoice.reference }}
				</p>
				<p>
					<strong>Client :</strong>
					{{ selectedSchedule.invoice.order.client.name }}
				</p>
				<p>
					<strong>Total Facture :</strong>
					{{ formatCurrency(selectedSchedule.invoice.total) }}
				</p>
				<p>
					<strong
						>Commande :{{ selectedSchedule.invoice.order.reference }}</strong
					>
				</p>
				<p>
					<strong>Date de création :</strong>
					{{ formatDate(selectedSchedule.invoice.order.date) }}
				</p>
			</div>

			<div class="mt-6">
				<h3 class="font-semibold text-lg mb-2">Échéances de paiement</h3>
				<table class="w-full text-sm border border-gray-300">
					<thead class="bg-gray-100">
						<tr>
							<th class="p-2 border border-gray-200">N°</th>
							<th class="p-2 border border-gray-200">Date</th>
							<th class="p-2 border border-gray-200 text-center">Montant</th>
							<th class="p-2 border border-gray-200 text-center">Statut</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(installment, index) in JSON.parse(
								selectedSchedule.installments
							)"
							:key="index"
							class="hover:bg-gray-50"
						>
							<td class="p-2 border border-gray-200 text-center">
								{{ index + 1 }}
							</td>
							<td class="p-2 border border-gray-200">
								{{ formatDate(installment.date) }}
							</td>
							<td class="p-2 border border-gray-200 text-center">
								{{ formatCurrency(installment.amount) }}
							</td>
							<td class="p-2 border border-gray-200 text-center">
								<span
									:class="installmentStatusClass(installment.paid)"
									class="px-2 py-1 rounded text-xs font-bold"
								>
									{{ installmentStatus(installment.paid) }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="mt-6 text-right">
				<button
					@click="closeModal"
					class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
				>
					Fermer
				</button>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useScheduleStore } from "#imports";
import Swal from "sweetalert2";

const selectedSchedule = ref(null);
const showModal = ref(false);

const scheduleStore = useScheduleStore();

onMounted(() => {
	scheduleStore.fetchSchedule();
});

const stats = computed(() => {
	const allSchedules = scheduleStore.echeancier;
	let totalDue = 0;
	let totalPaid = 0;

	allSchedules.forEach((schedule) => {
		const installments = JSON.parse(schedule.installments);
		installments.forEach((inst) => {
			totalDue += inst.amount;
			if (inst.paid) {
				totalPaid += inst.amount;
			}
		});
	});

	return {
		totalSchedules: allSchedules.length,
		totalDue,
		totalPaid,
	};
});

function viewSchedule(schedule) {
	selectedSchedule.value = schedule;
	showModal.value = true;
}

function closeModal() {
	showModal.value = false;
	selectedSchedule.value = null;
}

const installmentStatus = (isPaid) => {
	return isPaid ? "Payé" : "En attente";
};

const installmentStatusClass = (isPaid) => {
	return isPaid
		? "bg-green-200 text-green-800"
		: "bg-yellow-200 text-yellow-800";
};

const formatCurrency = (value) => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
	}).format(value);
};

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString("fr-FR");
};
</script>
