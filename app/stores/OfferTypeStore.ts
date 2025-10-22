import { defineStore } from "pinia";
import type { OfferType } from "~/models/ProjectType";

export const useOfferTypeStore = defineStore("OfferTypeStore", {
	state() {
		return {
			offerTypes: [] as OfferType[],
		};
	},
	actions: {
		async fetchOfferTypes() {
			try {
				const { data } = await useApi().get<OfferType[]>(ApiUrl.OFFER_TYPES);
				this.offerTypes = data;
			} catch (error) {
				console.log("Error fetching project types:", error);
				useAlert().showAlert("Une erreur est survenue lors de la récupération des types de projet", "error");
			}
		},
	},
});
