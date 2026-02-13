import { AppUrl } from "@/composables/appUrl";

// sidebarMenu.ts
export const sidebarMenu = [
	{
		id: "dashboard",
		name: "Tableau de bord",
		icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z",
		url: AppUrl.DASHBOARD,
		description: "Vue d'ensemble",
		isSingle: true, // Pas de sous-menus
	},
	{
		id: "stock",
		name: "Stock",
		icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
		submenus: [
			{
				name: "Produits",
				icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
				url: AppUrl.STOCKS_PRODUCTS,
				description: "Gestion des produits",
			},
			{
				name: "Mouvements",
				icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
				url: AppUrl.STOCKS_MOVEMENTS,
				description: "Entrées et sorties de stock",
			},
			// {
			// 	name: 'Alertes',
			// 	icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
			// 	url: '/stocks/alertes',
			// 	description: 'Alertes de stock bas'
			// },
			// {
			// 	name: 'Historique',
			// 	icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
			// 	url: '/stocks/historique',
			// 	description: 'Historique des mouvements'
			// }
		],
	},

	{
		id: "sales",
		name: "Ventes",
		icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
		submenus: [
			{
				name: "Gestion client",
				icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
				url: AppUrl.CLIENTS,
			},
			{
				name: "Proforma",
				icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				url: AppUrl.PROFORMA_INFORMATIONS,
				description: "Propositions",
			},
			{
				name: "Commandes",
				icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
				url: AppUrl.ORDER_INDEX,
				description: "Suivi des commandes",
			},
			{
				name: "Factures",
				icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
				url: AppUrl.INVOICEINFO,
				description: "Récapitulatif des factures",
			},
			{
				name: "Livraison",
				icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zm-4-2V6a1 1 0 00-1-1H3a1 1 0 00-1 1v9a1 1 0 001 1h1a4 4 0 008 0h4a4 4 0 008 0h1a1 1 0 001-1v-4a1 1 0 00-1-1h-3z",
				url: AppUrl.DELIVERYINFO,
				description: "Bordereau de livraison",
			},
			{
				name: "Échéanciers",
				icon: "fa-solid fa-calendar-alt",
				url: AppUrl.SCHEDULEINFO,
				description: "Suivre les paiements",
			},
			// {
			// 	name: 'Bilans',
			// 	icon: 'fa-solid fa-file-invoice-dollar',
			// 	url: AppUrl.BALANCE,
			// 	description: 'Rapports financiers'
			// },
			// {
			// 	name: 'Statistiques',
			// 	icon: 'fa-solid fa-chart-line',
			// 	url: AppUrl.STATS,
			// 	description: 'Tableaux et graphiques'
			// }
		],
	},

	{
		id: "clients",
		name: "Clients",
		icon: "heroicons:user-group",
		submenus: [
			{
				name: "Gestion client",
				icon: "heroicons:user-group",
				url: AppUrl.CLIENTS,
			},
			{
				name: "Gestion commerciaux",
				icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
				url: AppUrl.SALES,
			},
			{
				name: "Gestion recouvrement",
				icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
				url: AppUrl.FOLLOWUP,
			},
			{
				name: "Gestion des utilisateurs",
				icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
				url: AppUrl.USERS,
			},
		],
	},

	{
		id: "offers",
		name: "Appels d'Offres",
		icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
		submenus: [
			{
				name: "Appels d'Offres",
				icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
				url: AppUrl.OFFERS,
				description: "Gestion & soumissions",
			},
			{
				name: "Ajouter un appel",
				icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				url: AppUrl.OFFERS_NEW,
				description: "Enregistrer un nouvel appel d'offre",
			},
			{
				name: "Soumissions",
				icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
				url: AppUrl.OFFERS_APPROVAL,
				description: "Envoi & suivi résultats",
			},
			// {
			// 	name: 'Pilotage Projet',
			// 	icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			// 	url: AppUrl.OFFERS_PROJECTS,
			// 	description: 'Tâches & planning'
			// }
		],
	},
	// {
	// 	id: 'fournisseurs',
	// 	name: 'Fournisseurs',
	// 	icon: 'heroicons:building-library',
	// 	submenus: [
	// 		{
	// 			name: 'Fiches Fournisseurs',
	// 			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
	// 			url: AppUrl.SUPPLIERS,
	// 			description: 'Dossiers complets'
	// 		},
	// 		{
	// 			name: 'Contacts',
	// 			icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
	// 			url: AppUrl.SUPPLIERS_CONTACTS,
	// 			description: 'Interlocuteurs commerciaux'
	// 		},
	// 		{
	// 			name: 'Commandes',
	// 			icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
	// 			url: AppUrl.SUPPLIERS_COMMANDS,
	// 			description: 'Historique des achats'
	// 		},
	// 		{
	// 			name: 'Contrats',
	// 			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
	// 			url: AppUrl.SUPPLIERS_CONTRACTS,
	// 			description: 'Accords commerciaux'
	// 		},
	// 		{
	// 			name: 'Évaluations',
	// 			icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
	// 			url: AppUrl.SUPPLIERS_EVALUATIONS,
	// 			description: 'Performances fournisseurs'
	// 		}
	// 	]
	// },
	{
		id: "maintenance",
		name: "Maintenance",
		icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
		submenus: [
			// {
			// 	name: 'Dashboard',
			// 	icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z',
			// 	url: AppUrl.MAINTENANCE_DASHBOARD,
			// 	description: 'Gestion maintenance'
			// },
			{
				name: "Gestion des Techniciens",
				icon: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M14 2v4a2 2 0 0 0 2 2h4 M10 9H8 M16 13H8 M16 17H8",
				url: AppUrl.MAINTENANCE_ADD_TECHNICIAN,
				description: "Les informations des techniciens",
			},
			{
				name: "Gestion des équipements",
				icon: "heroicons-solid:cpu-chip",
				url: AppUrl.MAINTENANCE_EQUIPMENTS,
				description: "Parc matériel",
			},
			{
				name: "Gestion des Pannes",
				icon: "heroicons-solid:wrench-screwdriver",
				url: AppUrl.MAINTENANCE_REPORTING_BREAK,
				description: "",
			},
			// {
			// 	name: 'Fiche Client',
			// 	icon: 'M12 11h4 M12 16h4 M8 11h.01 M8 16h.01 M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
			// 	url: AppUrl.MAINTENANCE_CUSTOMER_FILE,
			// 	description: ''
			// },
			{
				name: "Contrats",
				icon: "m9 14 2 2 4-4 M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
				url: AppUrl.MAINTENANCE_MANAGEMENT_CONTRACT_MAINTENANCE,
				description: "Maintenance",
			},
			{
				name: "Gestion Des Devis",
				icon: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2h-2V1h-2v1H8V1H6v1H4Z M18 6H8 M18 10H8 M18 14H8 M18 18H8",
				url: AppUrl.MAINTENANCE_QUOTE,
				description: "",
			},
			{
				name: "Reportage",
				icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				url: AppUrl.MAINTENANCE_REPORTING,
				description: "",
			},
			{
				name: "Gestion Des Factures",
				icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				url: AppUrl.MAINTENANCE_MANAGEMENT_INVOICE,
				description: "",
			},
		],
	},
	{
		id: "entreprises",
		name: "Entreprises",
		icon: "heroicons-solid:building-office",
		submenus: [
			{
				name: "Liste des entreprises",
				icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				url: AppUrl.ENTREPRISE_INDEX,
			},
			{
				name: "Ajouter une entreprise",
				icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
				url: AppUrl.ENTREPRISE_NEW,
			},
		],
	},
	{
		id: "document-types",
		name: "Types de documents",
		icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
		url: AppUrl.DOCUMENTS,
		description: "Gestion des types de documents",
		isSingle: true, // Pas de sous-menus
	},
	{
		id: "utilisateurs",
		name: "Utilisateurs",
		icon: "heroicons-solid:user-group",
		submenus: [
			{
				name: "Liste des utilisateurs",
				icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
				url: AppUrl.USERS_INDEX,
				description: "Gestion des membres du personnel",
			},
			{
				name: "Ajouter un utilisateur",
				icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
				url: AppUrl.USERS_ADD,
				description: "Ajouter un membre au personnel",
			},
			{
				name: "Liste des rôles",
				icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
				url: AppUrl.ROLES_INDEX,
				description: "Aperçu des rôles et permissions",
			},
		],
	},
];
