import { defineStore } from 'pinia';
import type { Client } from '~/models/Client';
import { ApiUrl } from '@/composables/apiUrl';
import type { ValidationErrors } from '@/composables/useValidationErrors';
import { useValidationErrors } from '../composables/useValidationErrors';

export const useClientStore = defineStore('client', {
	state: () => ({
		clients: [] as Client[], // Toujours initialiser avec un tableau vide
		currentClient: null as Client | null, // Pour stocker les détails d'un client spécifique
		loading: false,
		error: {} as ValidationErrors
	}),

	actions: {
		async createClient(clientData: Client) {
			try {
				const { data } = await useApi().post<Client>(ApiUrl.CLIENTS, clientData);
				this.clients.push(data);
				return data;
			} catch (error) {
				console.error("Erreur création client:", error);
				this.error = useValidationErrors(error);
				throw error;
			}
		},

		async fetchClients() {
			try {
				this.loading = true;
				this.error = {};

				// Utilisez $fetch de Nuxt 3 ou fetch standard
				const { data } = await useApi().get<Client[]>(ApiUrl.CLIENTS);

				// Assurez-vous que data est un tableau
				this.clients = data;

			} catch (error) {
				console.error("Erreur lors du chargement des clients:", error);
				this.error = useValidationErrors(error);
				this.clients = []; // Garantir que clients reste un tableau
			} finally {
				this.loading = false;
			}
		},

		// NOUVEAU: Récupérer un client spécifique
		async fetchClient(id: string) {
			try {
				this.loading = true;
				this.error = {} as ValidationErrors;

				const { data } = await useApi().get<Client>(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, id));

				this.currentClient = data;

				return data;
			} catch (error) {
				console.error("Erreur lors du chargement du client:", error);
				this.error = useValidationErrors(error);
				throw error;
			} finally {
				this.loading = false;
			}
		},

		// NOUVEAU: Mettre à jour un client

		async updateClient(id: string, clientData: Client) {
			try {
				const {data} = await useApi().put<Client>(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, id), clientData);
				
				this.clients.map(_ => _.id === id ? data : _);

				return data;
			} catch (error) {
				console.error("Erreur mise à jour client:", error);
				this.error = useValidationErrors(error);
				throw error;
			}
		},

		// NOUVEAU: Supprimer un client
		async deleteClient(id: string) {
			try {
				await useApi().del<Client>(ApiUrl.parameterized(ApiUrl.CLIENT_BY_ID, id));
				// Retirer le client de la liste
				this.clients = this.clients.filter(_ => _.id !== id);

			} catch (error) {
				console.error("Erreur suppression client:", error);
				this.error = useValidationErrors(error);
				throw error;
			}
		},

		// NOUVEAU: Réinitialiser l'erreur
		clearError() {
			this.error = {} as ValidationErrors;
		}
	}
});
