import { defineNuxtRouteMiddleware } from "nuxt/app";
import {AppUrl} from "@/composables/appUrl";
import { useAuthStore } from "@/stores/authStore";

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore();

	const publicRoutes = [AppUrl.HOME, AppUrl.LOGIN, AppUrl.REGISTER, AppUrl.FORGOT_PASSWORD];
	const isPublicRoute = publicRoutes.includes(to.path);
	const isAuthenticated = authStore.isAuthenticated;

	// console.log('Auth middleware:', {
	// 	path: to.path,
	// 	isAuthenticated,
	// 	token: authStore.token ? 'present' : 'absent'
	// });

	// Éviter les boucles de redirection
	if (isAuthenticated && isPublicRoute && to.path !== AppUrl.WELCOME) {
		return navigateTo(AppUrl.WELCOME);
	}

	if (!isAuthenticated && !isPublicRoute && to.path !== AppUrl.LOGIN) {
		return navigateTo(AppUrl.LOGIN);
	}
});