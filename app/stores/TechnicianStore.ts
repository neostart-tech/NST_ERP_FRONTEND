import { defineStore } from "pinia";
import type { Technician } from "~/models/Technician";
import { useValidationErrors, type ValidationErrors } from "@/composables/useValidationErrors";

export const useTechnicianStore = defineStore("TechnicianStore", {
	state() {
		return {
			technicians: [] as Technician[],
			validationErrors: {} as ValidationErrors,
			loading: false,
		};
	},
	actions: {
		async fetchTechnicians() {
			try {
				this.loading = true;
				const { data } = await useApi().get<Technician[]>(ApiUrl.TECHNICIANS);
				this.technicians = data;
				this.loading = false;
			} catch (error) {
				console.log("Error fetching technicians:", error);
				useAlert().showAlert("Une erreur est survenue lors de la récupération des techniciens", "error");
			}
		},

		async addTechnician(technicianFormData: FormData) {
			this.validationErrors = {};
			try {
				console.log("FormData:", technicianFormData);

				const { data } = await useApi().post<Technician>(ApiUrl.TECHNICIANS, technicianFormData);
				this.technicians.push(data);
				useAlert().showAlert("Technicien ajouté avec succès", "success");
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				console.log("Error adding technician:", error);
				useAlert().showAlert("Une erreur est survenue lors de l'ajout du technicien", "error");
				throw error;
			}
		},

		async updateTechnician(id: string, technicianFormData: FormData) {
			this.validationErrors = {};
			try {
				const { data } = await useApi().post<Technician>(
					ApiUrl.parameterized(ApiUrl.TECHNICIAN_BY_ID, id), technicianFormData);

				this.technicians = this.technicians.map((_) => (_.id === id ? data : _));
				useAlert().showAlert("Technicien modifié avec succès", "success");
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				console.log("Error updating technician:", error);
				useAlert().showAlert("Une erreur est survenue lors de la modification du technicien", "error");
				throw error;
			}
		},

		async deleteTechnician(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.TECHNICIAN_BY_ID, id));
				this.technicians = this.technicians.filter((_) => _.id !== id);
				useAlert().showAlert("Technicien supprimé avec succès", "success");
			} catch (error) {
				console.log("Error deleting technician:", error);
				useAlert().showAlert("Une erreur est survenue lors de la suppression du technicien", "error");
				throw error;
			}
		},
	},
});
