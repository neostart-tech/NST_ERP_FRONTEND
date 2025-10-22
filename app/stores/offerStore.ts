import { defineStore } from "pinia";
import type { Entreprise } from "~/models/Enterprise";
import type { Offer, OfferForm, MetadataForm, Lot } from "~/models/Offer";
import { extractDateTime } from "../utils/dateParser";
export const useOfferStore = defineStore("OfferStore", {
	state: () => ({
		offers: [] as Offer[],
		pendingOffers: [] as Offer[],

		// offer: {} as Offer,
		validationErrors: {} as ValidationErrors,
		isLoading: true
	}),
	actions: {
		async fetchOffers() {
			try {
				const response = await useApi().get<Offer[]>(
					ApiUrl.queryable(
						ApiUrl.OFFERS, {
						limit: 5
					})
				);
				this.offers = response.data || [];
			} catch (error) {
				console.error("Error fetching offers:", error);
				useAlert().showAlert("Une erreur est survenue lors du chargement des appels d'offres", "error");
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async fetchPendingOffers() {
			try {
				const response = await useApi().get<Offer[]>(ApiUrl.OFFERS);
				this.offers = response.data || [];
			} catch (error) {
				console.error("Error fetching offers:", error);
				useAlert().showAlert("Une erreur est survenue lors du chargement des appels d'offres", "error");
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async storeOffer(offerData: OfferForm, metadata: MetadataForm) {
			try {
				const formData = {
					...offerData,
					...metadata,
					offer_type_id: offerData.offer_type_id,
					requirement: offerData.requirement?.join(",") || ""
				};
				const { data } = await useApi().post<Offer>(ApiUrl.OFFERS, formData);
				this.offers = [data, ...this.offers];
			} catch (error) {
				console.log("Error storing offer:", error);
				useAlert().showAlert("Une erreur est survenue", "error");
				this.validationErrors = useValidationErrors(error);
				throw error;
			}
		},

		async updateOffer(offerId: string, offerData: OfferForm, metadata: MetadataForm) {
			try {
				const formData = {
					...offerData,
					...metadata,
					offer_type_id: offerData.offer_type_id,
					requirement: offerData.requirement?.join(",") || ""
				};
				const { data } = await useApi().put<Offer>(ApiUrl.parameterized(ApiUrl.OFFER_BY_ID, offerId), formData);

				this.offers = this.offers.map((offer) =>
					offer.id === data.id ? { ...offer, ...data } : offer
				);
			} catch (error) {
				console.log("Error storing offer:", error);
				useAlert().showAlert("Une erreur est survenue", "error");
				this.validationErrors = useValidationErrors(error);
				throw error;
			}
		},

		async getOneOffer(id: string) {
			try {
				const { data } = await useApi().get<Offer>(ApiUrl.parameterized(ApiUrl.OFFER_BY_ID, id));
				return data;
			} catch (error) {
				console.error("Error fetching offer:", error);
				throw error;
			}
		},

		async appreciateOffer(id: string, appreciation: "yes" | "no") {
			try {
				const response = await useApi().post<Offer>(
					ApiUrl.parameterized(ApiUrl.OFFER_DECISION, id),
					{ appreciation }
				);
				this.offers = this.offers.map((offer) =>
					offer.id === id ? response.data : offer
				);
				return response.data;
			} catch (error) {
				console.error("Error appreciating offer:", error);
				throw error;
			}
		},

		async updateOfferDecision(id: string, decisionData: {
			decision: 'yes' | 'no' | null;
			submissionMotif?: string;
			refusalMotif?: string;
		}) {
			try {
				const response = await useApi().put<Offer>(ApiUrl.parameterized(ApiUrl.OFFER_DECISION, id), decisionData);
				this.offers = this.offers.map(offer =>
					offer.id === id ? { ...offer, ...response.data } : offer
				);
				return response.data;
			} catch (error) {
				console.error('Error updating offer decision:', error);
				throw error;
			}
		},

		async deleteOffer(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.OFFER_BY_ID, id));
				this.offers = this.offers.filter(offer => offer.id !== id);
				return true;
			} catch (error) {
				console.error('Error deleting offer:', error);
				throw error;
			}
		},

		async saveDecision(id: string, decisionData: {
			decision: 'yes' | 'no' | null;
			submissionMotif?: string;
			refusalMotif?: string;
		}) {
			try {
				const response = await useApi().put<Offer>(ApiUrl.parameterized(ApiUrl.OFFER_DECISION, id), decisionData);
				this.offers = this.offers.map(offer =>
					offer.id === id ? { ...offer, ...response.data } : offer
				);
				return response.data;
			} catch (error) {
				console.error('Error saving decision:', error);
				throw error;
			}
		},
	}
});
