import type { Intervention } from "~/models/Intervention";
import type { ValidationErrors } from "@/composables/useValidationErrors";
import { useValidationErrors } from "@/composables/useValidationErrors";
import { useAlert } from "@/composables/useAlert";
import { useApi } from "@/composables/useApi";
import { secureLsStorage } from "#imports";
// import { ApiUrl } from "@/composables/useApi";

export const useInterventionStore = defineStore('Intervention', {
	state: () => ({
		interventions: [] as Intervention[],
		loading: false,
		validationErrors: {} as ValidationErrors,
	}),

	actions: {
		async fetchInterventions() {
			try {
				if (this.interventions.length === 0)
					this.loading = true;

				const { data } = await useApi().get<Intervention[]>(ApiUrl.INTERVENTION);
				this.interventions = data;
			} catch (error) {
				console.error("Error fetching interventions: - interventionStore.js:14", error);
			} finally {
				this.loading = false;
			}
		},

		async getIntervention(id: string) {
			try {
				if (this.interventions.length === 0)
					this.loading = true;

				const { data } = await useApi().get<Intervention>(ApiUrl.parameterized(ApiUrl.INTERVENTION_BY_ID, id));
				// this.interventions = data;
			} catch (error) {
				console.error("Error fetching intervention: - interventionStore.js:24", error);
			} finally {
				this.loading = false;
			}
		},

		async createIntervention(form: Intervention) {
			try {
				const { data } = await useApi().post<Intervention>(ApiUrl.INTERVENTION, form);
				this.interventions.push(data);
				useAlert().showAlert("Intervention ajoutée avec succès", "success");
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				console.log("Validation errors:", this.validationErrors);
				throw error;
			}
		},
		async updateIntervention(id: string, form: Intervention) {
			try {
				const { data } = await useApi().put<Intervention>(ApiUrl.parameterized(ApiUrl.INTERVENTION_BY_ID, id), form);
				this.interventions = this.interventions.map(_ => _.id === id ? data : _);
				useAlert().showAlert("Intervention mise à jour avec succès", "success");
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			}
		},

		async deleteIntervention(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.INTERVENTION_BY_ID, id));
				this.interventions = this.interventions.filter(_ => _.id !== id);
				useAlert().showAlert("Intervention supprimée avec succès", "success");
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			}
		},

		
		cleanStorage() {
			this.interventions = [];
			this.validationErrors = {};
			this.loading = false;
		}
	},

		// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: 'intervention-store',
		// Optionnel : choisir quelles propriétés persister
		pick: ['interventions']
	}
})
