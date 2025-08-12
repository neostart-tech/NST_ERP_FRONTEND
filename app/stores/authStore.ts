// stores/auth.ts
import { AppUrl } from "@/composables/appUrl";
import type { User, LoginCredential, AuthUser } from '~/models/User';
import { useApi } from '@/composables/useApi';
import { ApiUrls } from '#imports';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('AuthStore', {
	state: () => ({
		user: null as User | null,
		token: null as string | null,
	}),

	getters: {
		isAuthenticated: (state) => {
			return !!(state.user && state.token);
		},
		fullName: (state) => {
			return `${state.user?.firstName} ${state.user?.lastName}`;
		}
	},

	actions: {
		async login(credentials: LoginCredential) {
			const api = useApi();

			try {
				const response = await api.post<AuthUser>(ApiUrls.LOGIN, credentials);

				// Ces données seront automatiquement persistées
				this.user = response.data;
				this.token = response.data.token;

				useAlert().showAlert("Login successful", "success");
				localStorage.setItem('token', this.token);
				localStorage.setItem('user', JSON.stringify(this.user));
			} catch (error: any) {
				console.log("Login error:", error);
				throw new Error(error.data?.message || error.message);
			}
		},

		logout() {
			// Nettoyer le store (sera automatiquement persisté)
			this.user = null;
			this.token = null;

			navigateTo(AppUrl.LOGIN);
		}
	},

	// Configuration de la persistance
	persist: {
		storage: persistedState.cookies,
		// Optionnel : personnaliser la clé de stockage
		key: 'auth-store',
		// Optionnel : choisir quelles propriétés persister
		pick: ['user', 'token']
	}
});
