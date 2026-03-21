<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6">
		<!-- En-tête -->
		<div class="flex items-center gap-3">
			<div class="p-3 rounded-lg bg-indigo-500">
				<Icon name="heroicons:calendar-days" class="w-6 h-6 text-white" />
			</div>
			<h1 class="text-xl sm:text-2xl font-bold text-gray-900">Créer un Échéancier</h1>
		</div>

		<!-- Sélection facture -->
		<InvoiceComboBox v-model="factureSelectionnee" :invoices="invoiceStore.invoices" label="Facture" :return-object="true"
			:show-remaining="true" />

		<!-- Infos Facture -->
		<transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
			leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
			<div v-if="factureSelectionnee" class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg border border-indigo-200">
				<h2 class="font-semibold text-lg mb-4 text-indigo-900 flex items-center gap-2">
					<Icon name="heroicons:information-circle" class="w-5 h-5" />
					Détails de la Facture
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="flex items-start gap-3">
						<Icon name="heroicons:user" class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
						<div>
							<p class="text-sm text-gray-600">Client</p>
							<p class="font-medium text-gray-900">
								{{ getClientName(factureSelectionnee.client) }}
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="heroicons:shopping-cart" class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
						<div>
							<p class="text-sm text-gray-600">Commande</p>
							<p class="font-medium text-gray-900">{{ factureSelectionnee.order.reference }}</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="heroicons:banknotes" class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
						<div>
							<p class="text-sm text-gray-600">Total à payer</p>
							<p class="font-semibold text-lg text-indigo-900">{{ formatCurrency(factureSelectionnee.total) }}</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="heroicons:credit-card" class="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
						<div>
							<p class="text-sm text-gray-600">Reste à payer</p>
							<p class="font-semibold text-lg text-orange-600">
								{{ formatCurrency(factureSelectionnee.total - factureSelectionnee.payed) }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</transition>

		<!-- Gestion des échéances -->
		<div v-if="factureSelectionnee" class="space-y-6">
			<!-- Résumé et bouton d'ajout -->
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
				<div class="space-y-1">
					<p class="text-sm text-gray-600">Total des échéances</p>
					<p class="text-2xl font-bold" :class="Math.abs(totalRestant) <= 0.01 ? 'text-green-600' : 'text-orange-600'">
						{{ formatCurrency(totalEcheances) }}
					</p>
					<p class="text-xs" :class="Math.abs(totalRestant) <= 0.01 ? 'text-green-600' : 'text-orange-600'">
						Reste à répartir: {{ formatCurrency(totalRestant) }}
					</p>
				</div>
				<button type="button" @click="ajouterEcheance"
					class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
					<Icon name="heroicons:plus-circle" class="w-5 h-5" />
					Ajouter une échéance
				</button>
			</div>

			<!-- Liste des échéances -->
			<div v-if="apercu.length > 0" class="bg-gray-50 rounded-lg">
				<!-- Vue Desktop (Table) -->
				<div class="hidden lg:block overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
						<thead class="bg-gradient-to-r from-indigo-50 to-blue-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">N°</th>
								<th class="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Montant</th>
								<th class="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Date Échéance</th>
								<th class="px-6 py-3 text-center text-xs font-semibold text-indigo-800 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="(echeance, index) in apercu" :key="index" class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{{ index + 1 }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<input type="number" v-model.number="echeance.amount" @input="recalculerTotal"
										class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<input type="date" v-model="echeance.scheduledDate" :min="today"
										class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-center">
									<button type="button" @click="supprimerEcheance(index)"
										class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
										title="Supprimer cette échéance">
										<Icon name="heroicons:trash" class="w-5 h-5" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Vue Mobile (Cards) -->
				<div class="lg:hidden space-y-4">
					<div v-for="(echeance, index) in apercu" :key="index"
						class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
						<div class="flex items-center justify-between mb-3">
							<span class="text-sm font-semibold text-indigo-600">Échéance N°{{ index + 1 }}</span>
							<button type="button" @click="supprimerEcheance(index)"
								class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
								title="Supprimer cette échéance">
								<Icon name="heroicons:trash" class="w-5 h-5" />
							</button>
						</div>
						<div class="space-y-3">
							<div>
								<label class="block text-xs font-medium text-gray-700 mb-1">Montant</label>
								<input type="number" v-model.number="echeance.amount" @input="recalculerTotal"
									class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
							</div>
							<div>
								<label class="block text-xs font-medium text-gray-700 mb-1">Date d'échéance</label>
								<input type="date" v-model="echeance.scheduledDate" :min="today"
									class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Boutons d'action -->
			<div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
				<button type="button" @click="router.back()"
					class="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
					<Icon name="heroicons:arrow-left" class="w-5 h-5" />
					Retour
				</button>
				<button type="button" @click="validerEcheancier" :disabled="isSubmitting || Math.abs(totalRestant) > 0.01"
					:class="{
						'bg-indigo-600 hover:bg-indigo-700': Math.abs(totalRestant) <= 0.01 && !isSubmitting,
						'bg-gray-400 cursor-not-allowed': Math.abs(totalRestant) > 0.01 || isSubmitting
					}"
					class="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white transition-colors flex items-center justify-center gap-2">
					<Icon v-if="!isSubmitting" name="heroicons:check-circle" class="w-5 h-5" />
					<Icon v-else name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
					{{ isSubmitting ? 'Enregistrement...' : 'Valider l\'échéancier' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInvoiceStore } from "@/stores/Sale/InvoiceStore";
import { useScheduleStore } from "@/stores/Sale/ScheduleStore";
import {type Invoice, InvoiceTypeEnum} from "~/models/Invoice";
import InvoiceComboBox from "@/components/sales/InvoiceComboBox.vue";
import {getClientName} from "~/models/Client";

const router = useRouter();
const invoiceStore = useInvoiceStore();
const scheduleStore = useScheduleStore();
const factureSelectionnee = ref<Invoice | null>(null);
const apercu = ref<Array<{ amount: number; scheduledDate: string }>>([]);
const isSubmitting = ref(false);

// Date du jour (format YYYY-MM-DD pour input[type=date])
const today = computed(() => new Date().toISOString().split("T")[0]);

// Charger les factures
onMounted(() => {
	invoiceStore.fetchAll({ type: InvoiceTypeEnum.ADVANCE});
});

// Calcul du total des échéances
const totalEcheances = computed(() => {
	return apercu.value.reduce((sum, e) => sum + Number(e.amount || 0), 0);
});

// Calcul du total restant
const totalRestant = computed(() => {
	if (!factureSelectionnee.value) return 0;
	return factureSelectionnee.value.total - totalEcheances.value;
});

// Réinitialiser les échéances quand on change de facture
watch(factureSelectionnee, () => {
	apercu.value = [];
}, { immediate: true });

// Ajouter une nouvelle échéance
function ajouterEcheance() {
	if (!factureSelectionnee.value) return;

	const montantRestant = totalRestant.value;
	const dateDebut = new Date();
	// Ajouter 30 jours par défaut à la dernière échéance ou à aujourd'hui
	if (apercu.value.length > 0) {
		const derniereDate = new Date(apercu.value[apercu.value.length - 1].scheduledDate);
		derniereDate.setDate(derniereDate.getDate() + 30);
		dateDebut.setTime(derniereDate.getTime());
	} else {
		dateDebut.setDate(dateDebut.getDate() + 30);
	}

	apercu.value.push({
		amount: montantRestant > 0 ? montantRestant : 0,
		scheduledDate: dateDebut.toISOString().split("T")[0]
	});
}

// Supprimer une échéance
function supprimerEcheance(index: number) {
	apercu.value.splice(index, 1);
}

// Recalculer le total (appelé quand on modifie un montant)
function recalculerTotal() {
	// Cette fonction est appelée pour forcer la réactivité
	// Les computed totalEcheances et totalRestant se mettent à jour automatiquement
}

async function validerEcheancier() {
	if (Math.abs(totalRestant.value) > 0.01) {
		useAlert().showAlert(
			"La somme des échéances ne correspond pas au total de la facture.",
			"error"
		);
		return;
	}

	// Vérif des dates
	const todayStr = today.value || '';
	for (let i = 0; i < apercu.value.length; i++) {
		const echeance = apercu.value[i];
		if (!echeance) continue;

		if (echeance.scheduledDate < todayStr) {
			useAlert().showAlert(
				`L'échéance N°${i + 1} ne peut pas être antérieure à aujourd'hui.`,
				"error"
			);
			return;
		}

		const precedente = apercu.value[i - 1];
		if (i > 0 && precedente && echeance.scheduledDate < precedente.scheduledDate) {
			useAlert().showAlert(
				`L'échéance N°${i + 1} ne peut pas être avant l'échéance précédente.`,
				"error"
			);
			return;
		}
	}

	const payload = {
		schedules: apercu.value.map((e) => ({
			amount: Number(e.amount),
			scheduledDate: e.scheduledDate,
		})),
	};

	try {
		await scheduleStore.store(payload, factureSelectionnee.value!.id);
		useAlert().showAlert("Échéancier créé avec succès", "success");
		await router.push(AppUrl.SCHEDULE_LIST);
	} catch (error) {
		console.error("Erreur lors de l'enregistrement ", error);
		useAlert().showAlert(
			"Une erreur est survenue lors de l'enregistrement",
			"error"
		);
	} finally {
		isSubmitting.value = false;
	}
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
	}).format(amount);
}
</script>
