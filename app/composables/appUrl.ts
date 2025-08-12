export const AppUrl ={
	// Url Publiques
	HOME: "/",
	LOGIN: "/auth/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",

	// Tout le reste a besoin d'authentification
	DASHBOARD: "/dashboard",
	WELCOME: "/welcome",
	ABOUT: "/about",
	CLIENTS: "/clients",
	ORDERS: "/orders",
	QUOTES: "/quotes",
	INVOICES: "/invoices",
	SALES: "/sales",
	FOLLOWUP: "/followup",
	USERS: "/users",

	// OFFERS
	OFFERS: "/offers",
	OFFERS_NEW: "/offers/offer-form",
	OFFERS_TASK_FORM: "/offers/task-form",
	OFFERS_SUBMISSION_FORM: "/offers/submission-form",
	OFFERS_DOCUMENTS: "/offers/documents",
	OFFERS_PROJECTS: "/offers/projects",
	OFFERS_QUICK_STAT: "/offers/offer-quick-stat",
	
	//SUPPLIERS
	SUPPLIERS: "/suppliers",
	SUPPLIERS_CONTACTS: "/suppliers/contacts",
	SUPPLIERS_COMMANDS: "/suppliers/commands",
	SUPPLIERS_CONTRACTS: "/suppliers/contracts",
	SUPPLIERS_DOCUMENTS: "/suppliers/documents",
	SUPPLIERS_INVOICES: "/suppliers/invoices",
	SUPPLIERS_EVALUATIONS: "/suppliers/evaluations",

	//MAINTENANCE
	MAINTENANCE_TICKETS: "/maintenance/tickets",
	MAINTENANCE_PLANNING: "/maintenance/planning",
	MAINTENANCE_EQUIPMENTS: "/maintenance/equipements",
	MAINTENANCE_CONTRACTS: "/maintenance/contracts",
	MAINTENANCE_REPORTS: "/maintenance/reports",


} as const;