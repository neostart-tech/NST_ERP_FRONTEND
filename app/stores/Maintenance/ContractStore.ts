import type { Contract } from "~/models/Contract";
import type { ValidationErrors } from "@/composables/useValidationErrors";

export const useContractStore = defineStore("ContractStore", {
	state() {
		return {
			contracts: [] as Contract[],
			isLoading: false,
			isDeleting: false,
			isPersisting: false,
			validationErrors: {} as ValidationErrors,
		};
	},
	actions: {
		async fetchAll() {
			try {
				// Vérification du contenu du cache
				if (this.contracts.length === 0) {
					this.isLoading = true;
				}

				const { data } = await useApi().get<Contract[]>(ApiUrl.CONTRACTS);
				this.contracts = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(contract: Contract) {
			this.isPersisting = true;
			this.validationErrors = {};
			try {
				contract.reference_number = `CTR
					${new Date().getFullYear()}
					${String(new Date().getMonth() + 1).padStart(2, "0")}
					${String(this.contracts.length + 1).padStart(3, "0")}
					`;
				const { data } = await useApi().post<Contract>(
					ApiUrl.CONTRACTS,
					contract
				);
				this.contracts.push(data);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur:", error);
				useAlert().showAlert(
					"Erreur lors de l'enregistrement du contrat",
					"error"
				);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isPersisting = false;
			}
		},

		async update(contract: Contract) {
			this.isPersisting = true;
			this.validationErrors = {};
			try {
				const { data } = await useApi().put<Contract>(
					ApiUrl.parameterized(ApiUrl.CONTRACT_BY_ID, contract.id),
					contract
				);
				this.contracts.push(data);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur:", error);
				useAlert().showAlert(
					"Erreur lors de l'enregistrement du contrat",
					"error"
				);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isPersisting = false;
			}
		},

		async updateStatus(contractId: string, newStatus: string) {
			try {
				this.isPersisting = true;
				const { data } = await useApi().put<Contract>(
					ApiUrl.parameterized(ApiUrl.CONTRACT_BY_ID, contractId),
					{ status: newStatus }
				);

				this.contracts = this.contracts.map((_) =>
					_.id === contractId ? data : _
				);
				this.fetchAll();
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isPersisting = false;
			}
		},

		async delete(contractId: string) {
			try {
				this.isDeleting = true;
				await useApi().del(
					ApiUrl.parameterized(ApiUrl.CONTRACT_BY_ID, contractId)
				);
				this.contracts = this.contracts.filter((_) => _.id !== contractId);
				this.fetchAll();
			} catch (error) {
				throw error;
			} finally {
				this.isDeleting = false;
			}
		},

		cleanStorage() {
			this.contracts = [];
			this.validationErrors = {};
			this.isLoading = false;
			this.isDeleting = false;
		},
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: "contract-store",
		// Optionnel : choisir quelles propriétés persister
		pick: ["contracts"],
	},
});
