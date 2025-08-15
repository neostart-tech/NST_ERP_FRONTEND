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
  LOGIN: '/login',

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
  LOGOUT: '/logout',

  DOCUMENT_TYPES: "/document-types",
  ENTREPRISES: "/entreprises",
  OFFER_TYPES: "/offer-types",
  OFFERS: "/offers",
} as const;