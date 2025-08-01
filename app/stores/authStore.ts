// stores/auth.ts
import { defineStore } from 'pinia';
import { AppUrl } from "../composables/appUrl";
import type { User, LoginCredential, AuthUser } from '../../models/User';
import { useApi } from '../composables/useApi';
import { ApiUrls } from '#imports';

export const useAuthStore = defineStore('AuthStore', {
	state: () => ({
		user: null as User | null,
		token: null as string | null,
	}),

	getters: {
		isAuthenticated: (state) => {
			return !!(state.user && state.token);
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

			} catch (error: any) {
				console.log("Login error:", error);
				throw new Error(error.data?.message || error.message);
			}
		},

		logout() {
			// Nettoyer le store (sera automatiquement persisté)
			this.user = null;
			this.token = null;

			navigateTo(AppUrl.HOME);
		}
	},

	// Configuration de la persistance
	// Persistence is handled by @pinia-plugin-persistedstate/nuxt
	// The plugin is configured in nuxt.config.ts
	pick: ['user', 'token']
});