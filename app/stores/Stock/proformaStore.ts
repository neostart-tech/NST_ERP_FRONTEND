import { defineStore } from "pinia";
import type { Proforma } from "~/models/Proforma";
export const useProformaStore = defineStore("ProformaStore", {
	state: () => ({
		proforma: [] as Proforma[],
		isLoading: false,
		isSaving: false,
		validationErrors: {},
	}),

	actions: {
		async fetchAll() {
			try {
				if (this.proforma.length == 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Proforma[]>(ApiUrl.PROFORMA);
				this.proforma = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(proforma: Proforma) {
			try {
				this.isSaving = true;
				const { data } = await useApi().post<Proforma>(
					ApiUrl.PROFORMA,
					proforma
				);
				this.proforma.push(data);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur d'enregistrement de facture", error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async fetchProformaValidate() {
			try {
				if (this.proforma.length == 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Proforma[]>(ApiUrl.PROFORMA_VALIDATE);
				this.proforma = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
		async updateStatus(id: string, status: string) {
			try {
				const { data } = await useApi().put<Proforma>(
					ApiUrl.parameterized(ApiUrl.PROFORMA_BY_ID_STATUS, id),
					{ status }
				);
				this.proforma = this.proforma.map((_) => (_.id === id ? data : _));
			} catch (error) {
				console.error("Erreur lors de la misa à jour du statut", error);
			} finally {
				this.isSaving = false;
			}
		},

		async downloadProforma(proforma: Proforma) {
			try {
				useAlert().showAlert("Fonctionnalité pas encore implémentée", "info");
			} catch (error) {
				console.error("Erreur lors du téléchargement du PDF", error);
			}
		},

		async delete(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.PROFORMA_BY_ID, id));

				this.proforma = this.proforma.filter((p) => p.id !== id);
			} catch (error) {
				console.error("Erreur lors de la suppression de la proforma", error);
				throw error;
			}
		},

		cleanStorage() {
			this.proforma = [];
			this.isLoading = false;
			this.isSaving = false;
			this.validationErrors = {};
		}
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: "proforma-store",
		// Optionnel : choisir quelles propriétés persister
		pick: ["proforma"],
	},
});
