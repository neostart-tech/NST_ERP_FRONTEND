export const AppUrl ={
	// Url Publiques
	HOME: "/",
	LOGIN: "/auth/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",

	// Tout le reste a besoin d'authentification
	DASHBOARD: "/dashboard",
	ABOUT: "/about",
	CLIENTS: "/clients",
	ORDERS: "/orders",
	QUOTES: "/quotes",
	INVOICES: "/invoices",
	TENDERS: "/tenders",
	SUPPLIERS: "/suppliers",

	// TENDERS
	TENDERS_TASK_FORM: "tenders/task-form"
} as const;