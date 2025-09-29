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
  OFFER_APPROVE: "/offers/:id/approve",
  OFFER_REJECT: "/offers/:id/reject",
  OFFERS: "/offers",

  ENTREPRISES: "/entreprises",
  ENTREPRISE_BY_ID: "/entreprises/:id",

  USERS_INDEX: "/users",
  USER_BY_ID: "/users/:id",
  USERS_CONFIRM_PASSWORD: "/users/confirm-password",

  parameterize: (item: string, id: string|number ) => item.replace(':id', id.toString()),
} as const;
