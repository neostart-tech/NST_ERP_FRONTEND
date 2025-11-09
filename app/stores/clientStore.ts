import { defineStore } from 'pinia';
import type { Client } from '~/models/Client';
import { ApiUrl } from '@/composables/apiUrl';
import type { ValidationErrors } from '@/composables/useValidationErrors';
import { useValidationErrors } from '../composables/useValidationErrors';

export const useClientStore = defineStore('client', {
	state: () => ({
		clients: [] as Client[],
		stat: {
			total: 0,
			physique: 0,
			moral: 0,
			newThisMonth: 0
		},
		loading: false,
		errors: {} as ValidationErrors
	}),

	actions: {
		// Créer un client
		async createClient(clientData: Client) {
			try {
				const { data } = await useApi().post<Client>(ApiUrl.CLIENTS, clientData);
				this.clients.push(data);
				return data;
			} catch (error) {
				console.error("Erreur création client:", error);
				this.errors = useValidationErrors(error);
				console.log("Errors:", this.errors);
				throw error;
			}
		},

		// Charger les clients
		async fetchClients() {
			try {
				this.loading = true;
				this.errors = {};

				const { data } = await useApi().get<Client[]>(ApiUrl.CLIENTS);
				this.clients = data;

			} catch (error) {
				console.error("Erreur lors du chargement des clients:", error);
				this.errors = useValidationErrors(error);
				this.clients = []; // Garantir que clients reste un tableau
			} finally {
				this.loading = false;
			}
		},

		// Charger un client
		async fetchClient(id: string) {
			try {
				this.loading = true;
				this.errors = {} as ValidationErrors;
				const { data } = await useApi().get<Client>(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, id));
				return data;
			} catch (error) {
				console.error("Erreur lors du chargement du client:", error);
				this.errors = useValidationErrors(error);
				throw error;
			} finally {
				this.loading = false;
			}
		},

		// Mettre à jour un client
		async updateClient(id: string, clientData: Client) {
			try {
				const {data} = await useApi().put<Client>(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, id), clientData);
				this.clients.map(_ => _.id === id ? data : _);
				return data;
			} catch (error) {
				console.error("Erreur mise à jour client:", error);
				this.errors = useValidationErrors(error);
				throw error;
			}
		},

		// Supprimer un client
		async deleteClient(id: string) {
			try {
				await useApi().del<Client>(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, id));
				// Retirer le client de la liste
				this.clients = this.clients.filter(_ => _.id !== id);
			} catch (error) {
				this.errors = useValidationErrors(error);
				throw error;
			}
		},

		// Réinitialiser l'erreur
		clearError() {
			this.errors = {} as ValidationErrors;
		}
	}
});
