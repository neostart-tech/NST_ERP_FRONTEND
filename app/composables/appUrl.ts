export const AppUrl = {
	// Url Publiques
	HOME: "/",
	LOGIN: "/auth",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",
	CONFIRM_MY_PASSWORD: "/confirmer-mon-mot-de-passe",

	// Tout le reste a besoin d'authentification
	DASHBOARD: "/dashboard",
	ABOUT: "/about",
	CLIENTS: "/sales/clients",
	QUOTES: "/quotes",
	INVOICES: "/invoices",
	SALES: "/sales",
	INFOPROPO: "/sales/listeProforma",
	PROPO: '/sales/proposition',
	ORDER: '/sales/order',
	ORDERINFO: '/sales/infoCommande',
	INVOICE: '/sales/invoice',
	INVOICEINFO: '/sales/recapFacture',
	DELIVERY: '/sales/livraison',
	DELIVERYINFO: '/sales/listeLivraison',
	SCHEDULE: '/sales/echeanceCreate',
	SCHEDULEINFO: '/sales/echeanceListe',
	BALANCE: "/sales/bilan",
	STATS: '/sales/statistique',
	FOLLOWUP: "/followup",
	USERS: "/utilisateurs",

	// OFFERS
	OFFERS: "/offers",
	OFFERS_NEW: "/offers/offer-form",
	OFFERS_TASK_FORM: "/offers/task-form",
	OFFERS_APPROVAL: "/offers/:id/approuver",
	OFFERS_EDIT: "/offers/:id/modifier",
	OFFERS_PENDING: "/offers/pending",
	OFFERS_DOCUMENTS: "/offers/:id/documents-availability",
	OFFERS_LOTS: "/offers/:id/lots-configuration",
	OFFERS_PROJECTS: "/offers/projects",
	OFFERS_QUICK_STAT: "/offers/offer-quick-stat",

	//SUPPLIERS
	SUPPLIERS: "/fournisseurs",
	SUPPLIERS_CONTACTS: "/fournisseurs/contacts",
	SUPPLIERS_COMMANDS: "/fournisseurs/commands",
	SUPPLIERS_CONTRACTS: "/fournisseurs/contracts",
	SUPPLIERS_DOCUMENTS: "/fournisseurs/documents",
	SUPPLIERS_INVOICES: "/fournisseurs/invoices",
	SUPPLIERS_EVALUATIONS: "/fournisseurs/evaluations",

	//MAINTENANCE
	MAINTENANCE_TICKETS: "/maintenance/tickets",
	MAINTENANCE_PLANNING: "/maintenance/planning",
	MAINTENANCE_EQUIPMENTS: "/maintenance/equipements",
	MAINTENANCE_CONTRACTS: "/maintenance/contracts",
	MAINTENANCE_REPORTS: "/maintenance/reports",

	ENTREPRISE_INDEX: "/entreprises",
	ENTREPRISE_NEW: "/entreprises/ajouter",
	ENTREPRISE_EDIT: "/entreprises/:id/modifier",
	ENTREPRISE_SHOW: "/entreprises/:id",

	USERS_INDEX: "/utilisateurs",
	USERS_ADD: "/utilisateurs/ajouter",
	ROLES_INDEX: "/roles",

	parameterize: (item: string, id: string) => item.replace(":id", id)
} as const;
