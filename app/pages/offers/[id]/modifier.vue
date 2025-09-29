<template>
	<div class="bg-white rounded-lg shadow overflow-hidden p-6">
		<!-- Page Header -->
		<div class="py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900">
					Informations de l'appel d'offre
				</h2>
				<button @click="navigateTo('/offers/offer-quick-stat')"
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
					<svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						fill="currentColor">
						<path fill-rule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clip-rule="evenodd" />
					</svg>
					Retour à la liste
				</button>
			</div>
		</div>

		<!-- Modal Body with Tabs -->
		<div class="flex-1 flex flex-col overflow-hidden">
			<!-- Tab Navigation -->
			<div class="border-b border-gray-200 bg-gray-50">
				<nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
					<button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
						activeTab === tab.id
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
						'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
					]">
						{{ tab.name }}
					</button>
				</nav>
			</div>

			<!-- Tab Content -->
			<div class="flex-1 overflow-y-auto">
				<!-- General Tab -->
				<GeneralTab :offerFormData="offerData" v-if="activeTab === 'general'" />

				<!-- Information Tab -->
				<InfoTab :offerFormData="offerData" v-if="activeTab === 'information'" />
			</div>
		</div>

		<!-- Submission Decision -->
		<div class="bg-gray-50 rounded-lg p-6 my-6">
			<h3 class="text-lg font-medium text-gray-900 mb-4">Décision de soumission</h3>
			<div class="space-y-4">
				<div class="flex items-center space-x-6">
					<label class="inline-flex items-center space-x-2">
						<input type="radio" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" value="yes"
							v-model="submissionDecision" name="submission_decision" />
						<span class="text-sm font-medium text-gray-700">Oui, je souhaite soumettre une offre</span>
					</label>
					<label class="inline-flex items-center space-x-2">
						<input type="radio" class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" value="no"
							v-model="submissionDecision" name="submission_decision" />
						<span class="text-sm font-medium text-gray-700">Non, je ne souhaite pas soumettre</span>
					</label>
				</div>

				<div v-if="submissionDecision === 'yes'" class="mt-4">
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Motif de la soumission
					</label>
					<textarea v-model="submissionMotif" rows="3"
						class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						placeholder="Expliquez pourquoi vous souhaitez soumettre une offre..."></textarea>
				</div>

				<div v-if="submissionDecision === 'no'" class="mt-4">
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Motif du refus
					</label>
					<textarea v-model="refusalMotif" rows="3"
						class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						placeholder="Expliquez pourquoi vous ne souhaitez pas soumettre d'offre..."></textarea>
				</div>
			</div>
		</div>


		<!-- Action Buttons -->
		<div class="flex justify-between pt-6 border-t border-gray-200">
			<button @click="navigateTo(AppUrl.OFFERS)" type="button"
				class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
				Annuler
			</button>

			<div class="flex space-x-3">
				<button v-if="submissionDecision === 'yes'" @click="showConfirmationModal = true" type="button"
					:disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
					class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
					Procéder à la soumission
				</button>

				<button v-if="submissionDecision === 'no'" @click="saveDecision" :disabled="isLoading" type="button"
					class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
					Enregistrer la décision
				</button>
			</div>
		</div>
		<!-- </div> -->

		<!-- Modal de confirmation -->
		<div v-if="showConfirmationModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<!-- Background overlay -->
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showConfirmationModal = false">
				</div>

				<!-- Modal panel -->
				<div
					class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
								<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
									</path>
								</svg>
							</div>
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900">
									Confirmer la modification de l'offre
								</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										Êtes-vous sûr de vouloir procéder à la modification de votre offre ?
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<button @click="appreciateOffer" type="button"
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
							Confirmer
						</button>
						<button @click="showConfirmationModal = false" type="button"
							class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
							Annuler
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<DataNotFound :visible="_server404" v-on:refresh="loadOffer" :is-loading="isLoading" />
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'default'
});

import { ref, computed, onMounted } from "vue";
import { useRouter } from '#app';
import { defaultOfferData, defaultOfferFormData } from "~/models/Offer";
import { useOfferStore } from "~/app/stores/offerStore";
import { useAlert } from "~/app/composables/useAlert";
import DataNotFound from "~/app/components/partials/data-not-found.vue";
import GeneralTab from "~/app/components/offers/general-tab.vue";
import InfoTab from "~/app/components/offers/info-tab.vue";

const router = useRouter();
const navigateTo = useRouter().push;

const activeTab = ref("general");

// Route params
const route = useRoute();
const offerId = route.params.id as string;

// State
const submissionDecision = ref<'yes' | 'no' | null>(null);
const submissionMotif = ref('');
const refusalMotif = ref('');
const isLoading = ref(false);
const _server404 = ref(false);
const showConfirmationModal = ref(false);

const offerStore = useOfferStore();
// Mock offer data
const offerData = ref(defaultOfferData());

const loadOffer = async () => {
	try {
		isLoading.value = true;
		const id = Array.isArray(offerId) ? offerId[0] : offerId;
		const offer = await offerStore.getOneOffer(id);

		offerData.value = defaultOfferFormData(offer);
		console.log(offerData.value);
		_server404.value = false;
	} catch (error: unknown) {
		console.error('Erreur lors du chargement de l\'offre:', error);
		const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
		useAlert().showAlert(errorMessage, "error");
		_server404.value = true;
	} finally {
		isLoading.value = false;
	}
}
onMounted(() => {
	loadOffer();
});



// Computed properties

const tabs = [
	{ id: "general", name: "Général", required: true },
	{ id: "information", name: "Informations complémentaires", required: true },
];

const saveDecision = async () => {
  try {
    isLoading.value = true;
    const decision = submissionDecision.value === 'yes' ? 'soumission' : 'refus';
    const motif = submissionDecision.value === 'yes' ? submissionMotif.value : refusalMotif.value;

    // Ici, vous devriez appeler votre API pour enregistrer la décision
    // await api.saveDecision(offerId, { decision, motif });

    useAlert().showAlert(`Décision de ${decision} enregistrée avec succès`, "success");
  } catch (error: unknown) {
    console.error('Erreur lors de l\'enregistrement de la décision:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    useAlert().showAlert(errorMessage, "error");
  } finally {
    isLoading.value = false;
  }
};

const appreciateOffer = async () => {
  try {
    isLoading.value = true;
    // Logique pour apprécier l'offre
    // await offerStore.updateOffer(offerId, offerData.value);
    showConfirmationModal.value = false;
    useAlert().showAlert("Offre modifiée avec succès", "success");
    // Rediriger vers la liste des offres après un délai
    setTimeout(() => {
      navigateTo(AppUrl.OFFERS);
    }, 1500);
  } catch (error: unknown) {
    console.error('Erreur lors de la modification de l\'offre:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    useAlert().showAlert(errorMessage, "error");
  } finally {
    isLoading.value = false;
  }
};

// Methods
const formatDate = (dateString: string): string => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 0
	}).format(amount);
};

const confirmSubmission = () => {
	showConfirmationModal.value = false;
	// Rediriger vers la page de disponibilité des documents
	navigateTo(`/offers/${offerId}/documents-availability`);
};


</script>
