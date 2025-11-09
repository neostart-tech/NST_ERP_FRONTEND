import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import { ApiUrl } from "@/composables/apiUrl";

export const useClientStore = defineStore("ClientStore", {
	state: () => ({
		loading: false,
		clients: [],
		stat: {
			total: 0,
			physique: 0,
			moral: 0,
			newThisMonth: 0
		},
		validationError: {}
	}),
	actions: {
		async createClients(payload) {
			try {
				const { data } = await useApi().post<Client>(ApiUrl.CLIENTS, payload);
				this.client.push(data)
				return data;
			} catch (error) {
				this.validationError = useValidationErrors(error);
				throw error;
			}
		},

		async fetchClients() {
			try {
				const { data } = await useApi().get(ApiUrl.CLIENTS);

				this.clients = data
			} catch (error) {
				console.error("Erreur lors du chargement des clients:", error);
			}
		},

		async fetchStats() {
			try {
				const { stats } = await useApi().get(ApiUrl.CLIENT_STATS)
				this.stat = stats
			} catch (error) {
				console.error('Erreur lors du chargement des statistiques', error);

			}
		},
		async updateClient(clientId, payload) {
			try {
				const { client } = await useApi().put(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, clientId), payload)
				return client;
			} catch (error) {
				console.error("Erreur lors de la mise à jour")
			}
		}


	}


});
