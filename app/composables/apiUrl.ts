import Produits from "../pages/stocks/produits.vue";

/**
 * Centralise les URLs des endpoints API pour :
 * - Éviter la duplication des URLs dans le code
 * - Faciliter la maintenance et les modifications des endpoints
 * - Réduire les risques d'erreurs de frappe
 * - Maintenir une cohérence dans l'utilisation des endpoints
 */
export const ApiUrl = {
  /**
   * Endpoint pour l'authentification
   * Méthode: POST
   * Corps: { email: string, password: string }
   * Retour: { token: string, user: User }
   */
  LOGIN: '/auth/login',

	/**
	 * Endpoint pour l'inscription
	 * Méthode: POST
	 * Corps: { email: string, password: string }
	 * Retour: { user: User }
	 */
	REGISTER: '/register',

	/**
	 * Endpoint pour la déconnexion
	 * Méthode: POST
	 * Corps: Vide
	 * Retour: Vide
	 */
	LOGOUT: '/auth/logout',

	FORGOT_PASSWORD: "/auth/forgot-password",
	RESET_PASSWORD: "/auth/reset-password",
	DEFINE_PASSWORD: "/auth/define-password",

	DOCUMENT_TYPES: "/document-types",
	OFFER_TYPES: "/offer-types",
	OFFERS_PENDING: "/offers/pending",
	OFFER_BY_ID: "/offers/:id",
	OFFER_DECISION: "/offers/:id/decision",
	OFFERS: "/offers",
	OFFER_LOTS: "/offers/:id/lots",

	ENTREPRISES: "/entreprises",
	ENTREPRISE_BY_ID: "/entreprises/:id",

	USERS_INDEX: "/users",
	USER_BY_ID: "/users/:id",
	USERS_CONFIRM_PASSWORD: "/users/confirm-password",

	CLIENTS: "/clients",
	CLIENT_BY_ID: "/clients/:id",
	CLIENT_STATS: "/clients/stats",

	TECHNICIANS: "/technicians",
	TECHNICIAN_BY_ID: "/technicians/:id",

	EQUIPMENTS: "/equipments",
	EQUIPMENT_BY_ID: "/equipments/:id",

	INTERVENTIONS: "/interventions",
	INTERVENTION_BY_ID: "/interventions/:id",

	CONTRACTS: "/maintenance-contracts",
	CONTRACT_BY_ID: "/maintenance-contracts/:id",

	INVOICES: "/invoices",
	INVOICE_BY_ID: "/invoices/:id",

	PRODUCTS: "/products",
	PRODUCT_BY_ID: "/products/:id",

	MOVEMENTS: "/stock-movements",
	MOVEMENT_BY_ID: "/stock-movements/:id",

	PROFORMA: "/proforma",
	PROFORMA_BY_ID: "/proforma/:id",
	PROFORMA_BY_ID_STATUS: "/proforma/:id/status",

	/**
 * Fonction pour les url à paramètres sous la forme url/:id
 */
	parameterized: (item: string, parameters: Record<string, string | number> | string | number) => {
		// Si on passe directement un string ou un number → c'est l'id par défaut
		if (typeof parameters === "string" || typeof parameters === "number") {
			return item.replace(":id", parameters.toString());
		}

		// Sinon on parcourt l'objet
		Object.entries(parameters).forEach(([key, value]) => {
			item = item.replace(`:${key}`, value.toString());
		});

		return item;
	},

	/**
 * Fonction pour les query strings sous la forme url?key=value
 */
	queryable: (item: string, queries: Record<string, string | number> | string | number) => {
		// Si on passe directement un string ou un number → c'est le paramètre 'id' par défaut
		if (typeof queries === "string" || typeof queries === "number") {
			return `${item}?q=${encodeURIComponent(queries.toString())}`;
		}

		// Sinon on construit les query strings à partir de l'objet
		const queryString = Object.entries(queries)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
			.join('&');

		return queryString ? `${item}?${queryString}` : item;
	},
} as const;
