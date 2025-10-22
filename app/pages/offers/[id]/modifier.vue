<template>
	<div class="bg-white rounded-lg shadow overflow-hidden p-6">
		<!-- Page Header -->
		<div class="py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900">
					Modification de l'appel d'offre
				</h2>
				<NuxtLink :to="AppUrl.OFFERS_QUICK_STAT"
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
					<Icon name="heroicons-solid:arrow-left" class="w-5 h-5 mr-2" />
					Retour à la liste
				</NuxtLink>
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

		<!-- Modal Footer -->
		<div class="py-4 border-t border-gray-200 flex justify-between">
			<div class="flex space-x-3">
				<button type="button"
					class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
					Annuler
				</button>
			</div>
			<div class="flex">
				<button v-if="activeTab === 'general'" @click="nextTab" type="button"
					class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
					Suivant
				</button>
				<button v-if="activeTab === 'information'" @click="handleSubmit" :disabled="isSubmitting" type="button"
					class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
					<Spinner :isLoading="isSubmitting" text="Enregistrement en cours ..." />
					<span v-if="!isSubmitting">
						Modifier l'appel d'offre
					</span>
				</button>
			</div>
		</div>

	</div>
	<DataNotFound :visible="_server404" v-on:refresh="loadOffer" :is-loading="isLoading" />
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'default'
});

import { ref, onMounted } from "vue";
import { useRouter } from '#app';
import { defaultOfferFormData, type Offer, type OfferForm } from "~/models/Offer";
import { useOfferStore } from "~/app/stores/offerStore";
import { useAlert } from "~/app/composables/useAlert";
import DataNotFound from "~/app/components/partials/data-not-found.vue";
import GeneralTab from "~/app/components/offers/general-tab.vue";
import InfoTab from "~/app/components/offers/info-tab.vue";
import Swal from "sweetalert2";
import Spinner from "~/app/components/partials/Spinner.vue";

const isSubmitting = ref(false);

const navigateTo = useRouter().push;

const activeTab = ref<string>("general");

// Route params
const route = useRoute();
const offerId = route.params.id as string;

const isLoading = ref(false);
const _server404 = ref(false);

const offerStore = useOfferStore();
// Mock offer data
const offerData = ref<OfferForm>(defaultOfferFormData(null));

const nextTab = () => {
	if (activeTab.value === "general") {
		activeTab.value = "information";
	}
};

const loadOffer = async () => {
	try {
		isLoading.value = true;
		const offer = await offerStore.getOneOffer(offerId);

		// Bloc pour isoler les erreurs de traitement des erreurs de chargement
		try {
			offerData.value = defaultOfferFormData(offer);
			console.log("offerData:", offerData.value);
		} catch (error: any) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Une erreur est survenue lors du traitement de la données",
				confirmButtonText: "Revenir en arrière",
				allowOutsideClick: false
			}).then(() => {
				window.history.back();
			});
		}
		_server404.value = false;
	} catch (error: unknown) {
		console.error('Erreur lors du chargement de l\'offre:', error);
		const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
		useAlert().showAlert(errorMessage, "error");
		_server404.value = true;
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => loadOffer());

// Computed properties
const tabs = [
	{ id: "general", name: "Général", required: true },
	{ id: "information", name: "Informations complémentaires", required: true },
];

const handleSubmit = async () => {
	isSubmitting.value = true;
	try {
		await offerStore.updateOffer(offerId, offerData.value, offerData.value.metadata!);
		Swal.fire({
			icon: "success",
			title: "Offre modifiée avec succès",
			text: "L'offre a été modifiée avec succès",
			confirmButtonText: "OK",
		}).then(() => {
			navigateTo(AppUrl.OFFERS_QUICK_STAT);
		});
	} catch (error) {
		console.log(error)
		const errorsSize = Object.keys(offerStore.validationErrors).length;
		useAlert().showAlert(
			`${errorsSize} erreur${errorsSize > 1 ? "s" : ""
			} sont survenues lors de l'enregistrement`,
			"error"
		);
	} finally {
		isSubmitting.value = false;
	}
};


</script>
