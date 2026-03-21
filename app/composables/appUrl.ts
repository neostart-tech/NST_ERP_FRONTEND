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
	QUOTES: "/quotes",
	INVOICES: "/invoices",
	SALES: "/ventes",
	PROFORMA_INFORMATIONS: "/ventes/gestion-des-proforma",
	PROPO: "/ventes/proposition",
	ORDER: "/ventes/order",
	INVOICE: "/ventes/nouvelle-facture",
	INVOICES_INDEX: "/ventes/recapitulatif-des-factures",
	DELIVERY: "/ventes/livraison",
	DELIVERYINFO: "/ventes/listeLivraison",
	ADD_NEW_SCHEDULE: "/ventes/enregistrer-des-echeances",
	SCHEDULE_LIST: "/ventes/liste-des-echeances",
	BALANCE: "/ventes/bilan",
	STATS: "/ventes/statistique",
	FOLLOWUP: "/followup",
	USERS: "/utilisateurs",

	//STOCKS
	STOCKS: "/stocks",
	STOCKS_PRODUCTS: "/stocks/produits",
	STOCKS_MOVEMENTS: "/stocks/mouvements",

	// DOCUMENTS
	DOCUMENTS: "/gestion-des-type-de-document",

	// CLIENTS
	CLIENTS: "/clients",

	// OFFERS
	OFFERS_NEW: "/offers/offer-form",
	OFFERS_TASK_FORM: "/offers/task-form",
	OFFERS_APPROVAL: "/offers/:id/approuver",
	OFFERS_EDIT: "/offers/:id/modifier",
	OFFERS_PENDING: "/offers/pending",
	OFFERS_LOTS_INDEX: "/offers/configuration-des-lots",
	OFFERS_LOTS: "/offers/:id/configuration-des-lots",
	OFFERS_DOCUMENTS_INDEX: "/offers/documents",
	OFFERS_DOCUMENTS: "/offers/:id/documents",
	OFFERS: "/offers/gestion-des-appels-d-offre",

	//SUPPLIERS
	SUPPLIERS: "/fournisseurs",
	SUPPLIERS_CONTACTS: "/fournisseurs/contacts",
	SUPPLIERS_COMMANDS: "/fournisseurs/commands",
	SUPPLIERS_CONTRACTS: "/fournisseurs/contracts",
	SUPPLIERS_DOCUMENTS: "/fournisseurs/documents",
	SUPPLIERS_INVOICES: "/fournisseurs/invoices",
	SUPPLIERS_EVALUATIONS: "/fournisseurs/evaluations",

	//SALES REPRESENTATIVES
	SALES_REPRESENTATIVES_NEW: "/users/form",
	SALES_REPRESENTATIVES_EDIT: "/users/:id/edit",
	SALES_REPRESENTATIVES_COMISSIONS: "/ventes/commissions",
	SALES_REPRESENTATIVES_BONUSES: "/ventes/bonuses",
	ORDER_INDEX: "/ventes/gestion-des-commandes",
	ADD_NEW_ORDER: "/ventes/ajouter-une-nouvelle-commande",
	ORDER_SHOW: "/ventes/gestion-des-commandes/:id",

	//MAINTENANCE
	MAINTENANCE_TICKETS: "/maintenance/tickets",
	MAINTENANCE_PLANNING: "/maintenance/planning",
	MAINTENANCE_EQUIPMENTS: "/maintenance/gestion-des-equipements",
	MAINTENANCE_CONTRACTS: "/maintenance/contracts",
	MAINTENANCE_REPORTS: "/maintenance/reports",
	MAINTENANCE_DASHBOARD: "/maintenance/dashboard",
	MAINTENANCE_ADD_CUSTOMER: "/maintenance/ajouter-un-client",
	MAINTENANCE_ADD_TECHNICIAN: "/maintenance/gestion-des-techniciens",
	MAINTENANCE_REPORTING_BREAK: "/maintenance/signaler-une-panne",
	MAINTENANCE_CUSTOMER_FILE: "/maintenance/fiche-client",
	MAINTENANCE_MANAGEMENT_CONTRACT_MAINTENANCE:"/maintenance/gestion-des-contrats",
	// MAINTENANCE_QUOTE: "/maintenance/gestion-des-devis",
	// MAINTENANCE_REPORTING: "/maintenance/reportage",
	// MAINTENANCE_MANAGEMENT_INVOICE: "/maintenance/gestion-factures",

	ENTREPRISE_INDEX: "/entreprises",
	ENTREPRISE_NEW: "/entreprises/ajouter",
	ENTREPRISE_EDIT: "/entreprises/:id/modifier",
	ENTREPRISE_SHOW: "/entreprises/:id",

	USERS_INDEX: "/utilisateurs",
	USERS_ADD: "/utilisateurs/ajouter",
	USERS_EDIT: "/utilisateurs/:id/modifier",
	USERS_DETAILS: "/utilisateurs/:id/details",
	ROLES_INDEX: "/roles",

	parameterize: (item: string, id: string) => item.replace(":id", id),
} as const;
