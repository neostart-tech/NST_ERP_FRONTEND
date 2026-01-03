import type { Movement } from "~/models/Movement";

export const useMovementStore = defineStore("MovementStore", {
	state: () => ({
		movements: [] as Movement[],
		isLoading: false,
		isFormLoading: false,
		validationErrors: {} as ValidationErrors,
	}),

	actions: {
		async fetchAll() {
			try {
				if (this.movements.length == 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Movement[]>(ApiUrl.MOVEMENTS);
				this.movements = data;
			} catch (error) {
				console.error("Erreur lors du chargement des mouvements:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(movement: Movement) {
			this.validationErrors = {};
			this.isFormLoading = true;
			try {
				const { data } = await useApi().post<Movement>(
					ApiUrl.MOVEMENTS,
					movement
				);
				this.movements.push(data);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur lors de la création du produit:", error);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isFormLoading = false;
			}
		},

		async update(movement: Movement) {
			this.validationErrors = {};
			this.isFormLoading = true;
			try {
				const { data } = await useApi().put<Movement>(
					ApiUrl.parameterized(ApiUrl.MOVEMENT_BY_ID, movement.id),
					movement
				);
				this.movements = this.movements.map(_ =>_.id === movement.id ? data : _);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur lors de la mise à jour du mouvement:", error);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isFormLoading = false;
			}
		},

		async delete(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.PRODUCT_BY_ID, id));
				this.movements = this.movements.filter((_) => _.id !== id);
				await this.fetchAll();
			} catch (error) {
				console.error("Erreur lors de la suppression du produit:", error);
				throw error;
			}
		},

		cleanStorage() {
			this.movements = [];
			this.validationErrors = {};
			this.isLoading = false;
		},
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: "movement-store",
		// Optionnel : choisir quelles propriétés persister
		pick: ["movements"],
	},
});
