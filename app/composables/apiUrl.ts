/**
 * Centralise les URLs des endpoints API pour :
 * - Éviter la duplication des URLs dans le code
 * - Faciliter la maintenance et les modifications des endpoints
 * - Réduire les risques d'erreurs de frappe
 * - Maintenir une cohérence dans l'utilisation des endpoints
 */
export const ApiUrls = {
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

  /**
   * Endpoints pour les interventions
   */
  INTERVENTIONS: {
    ADD: '/addIntervention',
    DISPLAY: '/displayInterventions',
    UPDATE: '/updateIntervention',
    DELETE: '/deleteIntervention',
  },

  /**
   * Endpoints pour les techniciens
   */
  TECHNICIANS: {
    DISPLAY: '/displayTechnicians',
  },

  /**
   * Endpoints pour les équipements
   */
  EQUIPMENTS: {
    DISPLAY: '/displayEquipments',
  },

  /**
   * Endpoints pour les clients
   */
  CLIENTS: {
    DISPLAY: '/displayClients',
  },
};