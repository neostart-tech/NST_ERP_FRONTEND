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
	TENDERS: "/tenders",
	SUPPLIERS: "/suppliers",
	SALES: "/sales",
	FOLLOWUP: "/followup",
	USERS: "/users",
	TENDERS_DOCUMENTS: "/tenders/documents",
	TENDERS_SUBMISSIONS: "/tenders/submissions",
	TENDERS_PROJECTS: "/tenders/projects",
	SUPPLIERS_CONTACTS: "/suppliers/contacts",
	SUPPLIERS_COMMANDS: "/suppliers/commands",
	SUPPLIERS_CONTRACTS: "/suppliers/contracts",
	SUPPLIERS_DOCUMENTS: "/suppliers/documents",
	SUPPLIERS_INVOICES: "/suppliers/invoices",
	SUPPLIERS_EVALUATIONS: "/suppliers/evaluations",
	MAINTENANCE_TICKETS: "/maintenance/tickets",
	MAINTENANCE_PLANNING: "/maintenance/planning",
	MAINTENANCE_EQUIPMENTS: "/maintenance/equipements",
	MAINTENANCE_CONTRACTS: "/maintenance/contracts",
	MAINTENANCE_REPORTS: "/maintenance/reports",

	// TENDERS
	TENDERS_TASK_FORM: "tenders/task-form"
} as const;