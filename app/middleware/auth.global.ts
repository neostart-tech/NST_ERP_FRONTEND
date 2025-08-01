import { defineNuxtRouteMiddleware } from "nuxt/app";
import {AppUrl} from "../composables/appUrl";
import { useAuthStore } from "../stores/authStore";

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore();

	const publicRoutes = [AppUrl.HOME, AppUrl.REGISTER, AppUrl.FORGOT_PASSWORD];
	const isPublicRoute = publicRoutes.includes(to.path);
	const isAuthenticated = authStore.isAuthenticated;

	// console.log('Auth middleware:', {
	// 	path: to.path,
	// 	isAuthenticated,
	// 	token: authStore.token ? 'present' : 'absent'
	// });

	// Éviter les boucles de redirection
	if (isAuthenticated && isPublicRoute && to.path !== AppUrl.CLIENTS) {
		return navigateTo(AppUrl.CLIENTS);
	}

	if (!isAuthenticated && !isPublicRoute && to.path !== AppUrl.HOME) {
		return navigateTo(AppUrl.HOME);
	}
});