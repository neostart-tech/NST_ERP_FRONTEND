export default defineNuxtPlugin(async () => {
	// Initialiser le token CSRF au chargement de l'application
	const initCsrf = async () => {
		try {
			const apiUrlBase = import.meta.env.VITE_API_URL_BASE || 'http://localhost:8000';

			await $fetch(`${apiUrlBase}/sanctum/csrf-cookie`, {
				method: 'GET',
				credentials: 'include',
				mode: 'cors',
				headers: {
					'Accept': 'application/json',
				}
			});

			console.log('✅ CSRF token initialized successfully');
		} catch (error) {
			console.warn('⚠️ Failed to initialize CSRF token:', error);
		}
	};

	// Initialiser le CSRF token seulement côté client
	if (process.client) {
		await initCsrf();
	}
});
