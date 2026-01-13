import { defineStore } from "pinia";
import { type Delivery } from "~/models/Delivery";

export const useDeliveryStore = defineStore("livraison", {
	state: () => ({
		deliveries: [] as Delivery[],
		isLoading: false
	}),
	actions: {
		async fetchAll() {
			try {
				this.isLoading = true;
				const { data } = await useApi().get<Delivery[]>(ApiUrl.DELIVERIES);
				this.deliveries = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(payload: Delivery) {
			try {
				const { data } = await useApi().post<Delivery>(
					ApiUrl.DELIVERIES,
					payload
				);
				this.deliveries.push(data);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur lors de l'enregistrement de la livraison");
				throw error;
			}
		},
		async downloadDelivery(_delivery: Delivery) {},
	},
});
