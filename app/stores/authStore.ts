// stores/auth.ts
import { AppUrl } from "@/composables/appUrl";
import type { User, LoginCredential, AuthUser, PasswordResetData, NewPasswordData } from '~/models/User';
import { useApi } from '@/composables/useApi';
import { defineStore } from 'pinia';
import { ApiUrl } from '@/composables/apiUrl';
import { useValidationErrors, type ValidationErrors } from '@/composables/useValidationErrors';
import { secureLsStorage } from "@/utils/secureStorage";
import { useEnterpriseStore } from './EnterpriseStore';
import { formatRelativeDate } from '@/utils/dateParser';
import { useEquipmentStore } from "./Maintenance/EquipmentStore";
import { useTechnicianStore } from "./TechnicianStore";

export const useAuthStore = defineStore('AuthStore', {
	state: () => ({
		user: null as User | null,
		token: null as string | null,
		validationErrors: {} as ValidationErrors,
		newPasswordErrors: {} as ValidationErrors,
		resetValidationErrors: {} as ValidationErrors,
	}),

	getters: {
		isAuthenticated: (state) => {
			return !!(state.user && state.token);
		},
		fullName: (state) => {
			return `${state.user?.firstName} ${state.user?.lastName}`;
		},

	},

	actions: {
		async login(credentials: LoginCredential) {
			const api = useApi();

			try {
				const { data } = await api.post<AuthUser>(ApiUrl.LOGIN, credentials);

				// Ces données seront automatiquement persistées
				this.user = {...data, loggedInAt: formatRelativeDate(new Date())};
				this.token = data.token;

				useAlert().showAlert(`Ravi de vous revoir ${data.lastName} ${data.firstName}`, "success");

			} catch (error: any) {
				this.validationErrors = useValidationErrors(error);
				throw new Error(error.data?.message || error.message || error.error || "Une erreur est survenue");
			}
		},

		async logout() {
			try {
				await useApi().post(ApiUrl.LOGOUT, {});
			} catch (error) {
				console.log("Logout error:", error);
			} finally {
				this.user = null;
				this.token = null;
				this.cleanOtherStoresData();
				navigateTo(AppUrl.LOGIN);
			}
		},

		async initPasswordReset(email: string) {
			try {
				await useApi().post(ApiUrl.FORGOT_PASSWORD, { email });
			} catch (error: any) {
				this.resetValidationErrors = useValidationErrors(error);
				throw new Error(error.data?.message || error.message || error.error || "Une erreur est survenue");
			}
		},

		async resetPassword(passwordResetData: PasswordResetData) {
			try {
				await useApi().post(ApiUrl.RESET_PASSWORD, passwordResetData);
			} catch (error: any) {
				this.resetValidationErrors = useValidationErrors(error);
				throw new Error(error.data?.message || error.message || error.error || "Une erreur est survenue");
			}
		},

		async definePassword(newPasswordData: NewPasswordData) {
			try {
				await useApi().put(ApiUrl.DEFINE_PASSWORD, newPasswordData);
				// @ts-ignore
				this.user = { ...this.user, hasConfirmedPassword: true }
			} catch (error: any) {
				this.newPasswordErrors = useValidationErrors(error);
				throw new Error(error.data?.message || error.message || error.error || "Une erreur est survenue");
			}
		},

		cleanOtherStoresData() {
			useEnterpriseStore().cleanStorage();
			useEquipmentStore().cleanStorage();
			useTechnicianStore().cleanStorage();
		},
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: 'auth-store',
		// Optionnel : choisir quelles propriétés persister
		pick: ['user', 'token']
	}
});
