interface PageContentTitle {
	icon?: string;
	title: string;
	description?: string;
}

const titleMap: Record<string, PageContentTitle> = {
	quotes: {
		icon: "heroicons:document-text",
		title: "Devis",
		description: "Devis",
	},
	orders: {
		icon: "heroicons:document-text",
		title: "Commandes",
		description: "Commandes",
	},
	invoices: {
		icon: "heroicons:document-text",
		title: "Factures",
		description: "Factures",
	},
	suppliers: {
		icon: "heroicons:document-text",
		title: "Fournisseurs",
		description: "Fournisseurs",
	},
	entreprises: {
		icon: "heroicons:document-text",
		title: "Entreprises",
		description: "Entreprises",
	},
	dashboard: {
		icon: "heroicons:document-text",
		title: "Tableau de bord",
		description: "Tableau de bord",
	},
	clients: {
		icon: "heroicons:document-text",
		title: "Gestion des Clients",
		description: "Gestion des Clients",
	},
	offers: {
		icon: "heroicons:document-text",
		title: "Soumissions d'offres",
		description: "Soumissions d'offres",
	},
	"offers-id-documents": {
		icon: "heroicons:document-text",
		title: "Disponibilité des documents",
		description: "Vérification et contrôle de la disponibilité des documents",
	},
	"client-detail": {
		icon: "heroicons:document-text",
		title: "Détail Client",
		description: "Détail Client",
	},
	"entreprises-detail": {
		icon: "heroicons:document-text",
		title: "Détail Entreprise",
		description: "Détail Entreprise",
	},
	"entreprises-ajouter": {
		icon: "heroicons:document-text",
		title: "Ajouter une entreprise",
		description: "Ajouter une entreprise",
	},
	"entreprises-modifier": {
		icon: "heroicons:document-text",
		title: "Modifier une entreprise",
		description: "Modifier une entreprise",
	},
	"offers-offer-form": {
		icon: "heroicons:document-text",
		title: "Ajouter un nouvel appel d'offre",
		description: "Ajouter un nouvel appel d'offre",
	},
	"offers-id-modifier": {
		icon: "heroicons:document-text",
		title: "Modifier un appel d'offre",
		description: "Modifier un appel d'offre",
	},
	"offers-gestion-des-appels-d-offre": {
		icon: "heroicons:document-text",
		title: "Gestion des appels d'offre",
		description: "Gestion des appels d'offre",
	},
	"sales-clients": {
		icon: "heroicons:user-group",
		title: "Gestion des clients",
		description: "",
	},
	"maintenance-ajouter-un-equipement": {
		icon: "heroicons:cpu-chip",
		title: "Gestion des Équipements",
		description: "Surveillez et gérez votre parc matériel en temps réel",
	},
	"maintenance-gestion-des-techniciens": {
		icon: "heroicons:user-group",
		title: "Gestion des Techniciens",
		description: "Surveillez et gérez vos techniciens en temps réel",
	},
	"maintenance-signaler-une-panne": {
		icon: "heroicons:wrench-screwdriver",
		title: "Signalement de panne",
		description: "Signaler une panne",
	},
	"sales-recapFacture": {
		title: "Récapitulatif des factures",
		description: "Récapitulatif des factures",
		icon: "heroicons:document-text",
	},
	"ventes-gestion-des-commandes-id": {
		title: "Détails d'une commande",
		icon: "heroicons:document-text",
	},
	"ventes-gestion-des-commandes": {
		title: "Gestion des commandes",
		icon: "heroicons:document-text",
	},
	"maintenance-gestion-des-contrats": {
		title: "Gestion des contrats",
		icon: "heroicons:document-text",
	},
	"gestion-des-type-de-document": {
		icon: "heroicons:document-text",
		title: "Gestion des types de documents",
	},
	"offers-id-lots-configuration": {
		icon: "heroicons:puzzle-piece",
		title: "Configuration des lots",
		description: "Configuration des lots",
	},
	"utilisateurs-id-modifier": {
		icon: "heroicons:user",
		title: "Modifier un utilisateur",
		description: "Modifier les information d'un utilisateur",
	},
	"ventes-recapitulatif-des-factures": {
		icon: "heroicons:document-text",
		title: "Récapitulatif des factures",
		description: "Récapitulatif des factures",
	},
	"ventes-liste-des-echeances": {
		icon: "heroicons:calendar-days",
		title: "Liste des echeances",
		description: "Liste des echeances",
	},
	"stocks-mouvements": {
		icon: "heroicons:arrows-right-left",
		title: "Mouvements de stock",
		description: "Mouvements de stock",
	},
};

const defaultPageContentTitle = {
	icon: "heroicons:cog-6-tooth",
	title: "ERP Neo Start Technology",
	description: "Système de gestion intégré",
} as PageContentTitle;

export const getPageContentTitle = (routeName: string) => titleMap[routeName] || defaultPageContentTitle;
