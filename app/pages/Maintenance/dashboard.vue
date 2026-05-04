<template>
  <div class="flex bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="flex-1 p-6 overflow-y-auto">
      <h1 class="text-3xl font-bold text-blue-900 mb-6">Tableau de Bord</h1>

      <!-- Bannière d'avertissement -->
      <div v-if="apiOffline" class="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-400">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-yellow-700">
            <strong>Mode démonstration :</strong> Les APIs ne sont pas disponibles. Affichage de données simulées.
          </p>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-2">Chargement des données...</p>
      </div>

      <div v-else>
        <!-- Cartes de statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Contrats de maintenance -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Contrats de maintenance</h3>
              <span class="text-3xl font-bold text-green-600">{{ stats.contrats.total }}</span>
            </div>
            <div class="text-sm text-gray-700">
              <p>Actifs: <span class="font-bold text-green-500">{{ stats.contrats.actifs }}</span></p>
              <p>Expirés: <span class="font-bold text-gray-500">{{ stats.contrats.expires }}</span></p>
              <p>À renouveler: <span class="font-bold text-orange-500">{{ stats.contrats.a_renouveler }}</span></p>
            </div>
          </div>

          <!-- Clients avec/sans contrat -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Clients</h3>
              <span class="text-3xl font-bold text-purple-600">{{ stats.clients.total }}</span>
            </div>
            <div class="text-sm text-gray-700">
              <p>Avec contrat: <span class="font-bold text-green-500">{{ stats.clients.avec_contrat }}</span></p>
              <p>Sans contrat: <span class="font-bold text-blue-500">{{ stats.clients.sans_contrat }}</span></p>
              <p>Taux de fidélisation: <span class="font-bold text-indigo-500">{{ stats.clients.taux_fidelisation }}%</span></p>
            </div>
          </div>

          <!-- Techniciens -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Techniciens</h3>
              <span class="text-3xl font-bold text-cyan-600">{{ stats.techniciens.total }}</span>
            </div>
            <div class="text-sm text-gray-700">
              <p>Disponibles: <span class="font-bold text-green-500">{{ stats.techniciens.disponibles }}</span></p>
              <p>En intervention: <span class="font-bold text-yellow-500">{{ stats.techniciens.en_intervention }}</span></p>
              <p>En congé: <span class="font-bold text-gray-500">{{ stats.techniciens.en_conge }}</span></p>
            </div>
          </div>

          <!-- Interventions -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Interventions</h3>
              <span class="text-3xl font-bold text-teal-600">{{ stats.interventions.total }}</span>
            </div>
            <div class="text-sm text-gray-700">
              <p>Planifiées: <span class="font-bold text-blue-500">{{ stats.interventions.planifiees }}</span></p>
              <p>En cours: <span class="font-bold text-yellow-500">{{ stats.interventions.en_cours }}</span></p>
              <p>Terminées: <span class="font-bold text-green-500">{{ stats.interventions.terminees }}</span></p>
            </div>
          </div>

          <!-- Équipements -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Équipements</h3>
              <span class="text-3xl font-bold text-orange-600">{{ stats.equipements.total }}</span>
            </div>
            <div class="text-sm text-gray-700">
              <p>Réseau: <span class="font-bold text-indigo-500">{{ stats.equipements.reseau }}</span></p>
              <p>Non réseau: <span class="font-bold text-gray-500">{{ stats.equipements.non_reseau }}</span></p>
              <p>En panne: <span class="font-bold text-red-500">{{ stats.equipements.en_panne }}</span></p>
            </div>
          </div>

          <!-- Devis -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Devis</h3>
              <span class="text-3xl font-bold text-pink-600">{{ stats.devis.total }}</span>
            </div>
            <div class="text-sm text-gray-700">
              <p>En attente: <span class="font-bold text-yellow-500">{{ stats.devis.en_attente }}</span></p>
              <p>Acceptés: <span class="font-bold text-green-500">{{ stats.devis.acceptes }}</span></p>
              <p>Refusés: <span class="font-bold text-red-500">{{ stats.devis.refuses }}</span></p>
            </div>
          </div>

          <!-- Chiffre d'affaires -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-blue-800">Chiffre d'affaires (CA)</h3>
              <span class="text-3xl font-bold text-indigo-600">{{ formatCurrency(stats.ca_mensuel) }} FCFA</span>
            </div>
            <p class="text-sm text-gray-700">Ce mois-ci</p>
          </div>
        </div>

        <!-- Section Techniciens -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Statut des techniciens -->
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6 lg:col-span-3">
            <h2 class="text-xl font-bold text-blue-900 mb-4">Statut des Techniciens</h2>
            <div class="space-y-4" v-if="techniciens.length > 0">
              <div 
                v-for="tech in techniciens" 
                :key="tech.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition duration-150"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold">{{ getInitials(tech.full_name || tech.name) }}</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ tech.full_name || tech.name }}</p>
                    <p class="text-sm text-gray-600">{{ tech.specialty || tech.specialite }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span :class="getStatusClass(tech.availability || tech.statut)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(tech.availability || tech.statut) }}
                  </span>
                  <p class="text-sm text-gray-600 mt-1" v-if="tech.intervention_en_cours">
                    {{ tech.intervention_en_cours }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <p class="mt-2">Aucun technicien disponible</p>
            </div>
          </div>
        </div>

        <!-- Activité Récente -->
        <div class="grid grid-cols-1 gap-6">
          <div class="bg-white rounded-lg shadow-xl shadow-blue-100 p-6">
            <h2 class="text-xl font-bold text-blue-900 mb-4">Activité Récente</h2>
            <div class="space-y-4" v-if="activities.length > 0">
              <div 
                v-for="activity in activities.slice(0, 5)" 
                :key="activity.id"
                class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-150"
              >
                <span class="text-2xl flex-shrink-0">{{ activity.icon || '📝' }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ activity.description || activity.action }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.created_at) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <p class="mt-2">Aucune activité récente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Dashboard',
  setup() {
    const loading = ref(true);
    const apiOffline = ref(false);
    
    const stats = ref({
      pannes: { total: 0, signalees: 0, en_cours: 0, reparees: 0 },
      contrats: { total: 0, actifs: 0, expires: 0, a_renouveler: 0 },
      clients: { total: 0, avec_contrat: 0, sans_contrat: 0, taux_fidelisation: 0 },
      techniciens: { total: 0, disponibles: 0, en_intervention: 0, en_conge: 0 },
      interventions: { total: 0, planifiees: 0, en_cours: 0, terminees: 0 },
      equipements: { total: 0, reseau: 0, non_reseau: 0, en_panne: 0 },
      devis: { total: 0, en_attente: 0, acceptes: 0, refuses: 0 },
      ca_mensuel: 0
    });
    
    const alerts = ref([]);
    const activities = ref([]);
    const techniciens = ref([]);
    const planning = ref([]);

    // Données simulées RÉALISTES
    const mockData = {
      stats: {
        pannes: { total: 8, signalees: 3, en_cours: 2, reparees: 3 },
        contrats: { total: 25, actifs: 20, expires: 2, a_renouveler: 3 },
        clients: { total: 50, avec_contrat: 30, sans_contrat: 20, taux_fidelisation: 60 },
        techniciens: { total: 6, disponibles: 3, en_intervention: 2, en_conge: 1 },
        interventions: { total: 15, planifiees: 5, en_cours: 2, terminees: 8 },
        equipements: { total: 80, reseau: 45, non_reseau: 35, en_panne: 8 },
        devis: { total: 12, en_attente: 4, acceptes: 6, refuses: 2 },
        ca_mensuel: 1250000
      },
      techniciens: [
        {
          id: 1,
          full_name: "Jean Dupont",
          specialty: "Réseaux & Sécurité",
          availability: "Disponible",
          intervention_en_cours: null
        },
        {
          id: 2,
          full_name: "Marie Martin", 
          specialty: "Serveurs & Cloud",
          availability: "Occupé",
          intervention_en_cours: "Panne serveur - Entreprise XYZ"
        },
        {
          id: 3,
          full_name: "Pierre Lambert",
          specialty: "Équipements réseau", 
          availability: "Occupé",
          intervention_en_cours: "Installation switch - Société DEF"
        },
        {
          id: 4,
          full_name: "Sophie Bernard",
          specialty: "Maintenance préventive",
          availability: "Disponible",
          intervention_en_cours: null
        },
        {
          id: 5, 
          full_name: "Luc Moreau",
          specialty: "Fibre optique",
          availability: "En congé",
          intervention_en_cours: null
        }
      ],
      planning: [
        {
          id: 1,
          titre: "Maintenance préventive",
          technicien: "Sophie Bernard",
          client: "Client GHI",
          adresse: "123 Rue Principale",
          heure: "14:30",
          type: "maintenance"
        },
        {
          id: 2,
          titre: "Installation équipement",
          technicien: "Jean Dupont", 
          client: "Client ABC",
          adresse: "456 Avenue Centrale",
          heure: "10:00",
          type: "installation"
        },
        {
          id: 3,
          titre: "Dépannage urgent",
          technicien: "Marie Martin",
          client: "Entreprise XYZ",
          adresse: "789 Boulevard Industriel", 
          heure: "09:00",
          type: "urgence"
        }
      ],
      alerts: [
        {
          id: 1,
          message: "2 Contrats de maintenance à renouveler bientôt.",
          type: "warning",
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          message: "Un nouveau signalement de panne a été créé.",
          type: "info",
          is_read: false, 
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          message: "3 devis en attente de validation client.",
          type: "urgent",
          is_read: false,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ],
      activities: [
        {
          id: 1,
          description: "Nouvelle intervention créée pour Client ABC",
          type: "intervention_created",
          icon: "🔧",
          created_at: new Date().toISOString()
        },
        {
          id: 2, 
          description: "Devis #DV-2024-001 accepté par le client",
          type: "quote_accepted",
          icon: "✅",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          description: "Contrat renouvelé pour Entreprise XYZ",
          type: "contract_renewed", 
          icon: "📑",
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          description: "Nouvel équipement réseau installé chez Client DEF",
          type: "equipment_installed",
          icon: "🖥️",
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    const API_BASE_URL = 'http://localhost:8000/api'; // Ajustez selon votre configuration

    // Fonction API améliorée avec meilleure gestion d'erreurs
    const apiCall = async (endpoint, options = {}) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 secondes timeout

      try {
        console.log(`🔄 Appel API: ${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ API ${endpoint} réussie:`, data);
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        console.error(`❌ API ${endpoint} échouée:`, error.message);
        throw error;
      }
    };

    // Test de connexion API
    const testAPI = async () => {
      try {
        console.log('🧪 Test de connexion API...');
        const response = await apiCall('/test');
        return response && response.success === true;
      } catch (error) {
        console.error('❌ Test API échoué:', error.message);
        return false;
      }
    };

    // Chargement des données principales
    const loadDashboardData = async () => {
      try {
        loading.value = true;
        
        // Test d'abord si l'API est disponible
        const apiAvailable = await testAPI();
        
        if (!apiAvailable) {
          console.log('🚨 API non disponible, utilisation des données simulées');
          apiOffline.value = true;
          useMockData();
          return;
        }

        console.log('✅ API disponible, chargement des données réelles...');
        
        // Charger toutes les données en parallèle avec gestion d'erreurs individuelle
        await Promise.allSettled([
          loadStats(),
          loadTechnicians(),
          loadActivities()
        ]);

        console.log('✅ Toutes les données chargées');

      } catch (error) {
        console.error('💥 Erreur critique lors du chargement:', error);
        apiOffline.value = true;
        useMockData();
      } finally {
        loading.value = false;
      }
    };

    // Chargement des statistiques
    const loadStats = async () => {
      try {
        console.log('📊 Chargement des statistiques...');
        
        // Essayer d'abord le endpoint global
        try {
          const statsData = await apiCall('/dashboard/stats');
          if (statsData && (statsData.data || statsData.success)) {
            const data = statsData.data || statsData;
            updateStatsFromAPI(data);
            return;
          }
        } catch (error) {
          console.log('📊 Endpoint dashboard/stats échoué, chargement individuel...');
        }

        // Charger les données individuellement
        await loadIndividualStats();
        
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        Object.assign(stats.value, mockData.stats);
      }
    };

    // Chargement des statistiques individuelles
    const loadIndividualStats = async () => {
      try {
        console.log('📈 Chargement des statistiques individuelles...');
        
        const [
          clientsResult,
          contractsResult, 
          interventionsResult,
          techniciansResult,
          equipmentsResult,
          quotesResult
        ] = await Promise.allSettled([
          apiCall('/displayClients').catch(() => ({ data: [] })),
          apiCall('/displayContracts').catch(() => ({ data: [] })),
          apiCall('/interventions').catch(() => ({ data: [] })),
          apiCall('/displayTechnicians').catch(() => ({ data: [] })),
          apiCall('/displayEquipments').catch(() => ({ data: [] })),
          apiCall('/displayQuotes').catch(() => ({ data: [] }))
        ]);

        // Extraire les données des résultats
        const clients = clientsResult.status === 'fulfilled' ? 
          (clientsResult.value.data || clientsResult.value || []) : [];
        const contracts = contractsResult.status === 'fulfilled' ? 
          (contractsResult.value.data || contractsResult.value || []) : [];
        const interventions = interventionsResult.status === 'fulfilled' ? 
          (interventionsResult.value.data || interventionsResult.value || []) : [];
        const technicians = techniciansResult.status === 'fulfilled' ? 
          (techniciansResult.value.data || techniciansResult.value || []) : [];
        const equipments = equipmentsResult.status === 'fulfilled' ? 
          (equipmentsResult.value.data || equipmentsResult.value || []) : [];
        const quotes = quotesResult.status === 'fulfilled' ? 
          (quotesResult.value.data || quotesResult.value || []) : [];

        console.log('📊 Données reçues:', {
          clients: clients.length,
          contracts: contracts.length,
          interventions: interventions.length,
          technicians: technicians.length,
          equipments: equipments.length,
          quotes: quotes.length
        });

        // Mettre à jour les stats basées sur les données réelles
        if (clients && Array.isArray(clients)) {
          stats.value.clients.total = clients.length;
          // Estimation réaliste basée sur les données
          const avecContratCount = clients.filter(client => 
            client.has_contract || client.contract_id || client.contrat_actif
          ).length;
          stats.value.clients.avec_contrat = avecContratCount > 0 ? avecContratCount : Math.round(clients.length * 0.6);
          stats.value.clients.sans_contrat = clients.length - stats.value.clients.avec_contrat;
          stats.value.clients.taux_fidelisation = Math.round((stats.value.clients.avec_contrat / clients.length) * 100);
        }

        if (contracts && Array.isArray(contracts)) {
          stats.value.contrats.total = contracts.length;
          stats.value.contrats.actifs = contracts.filter(c => 
            c.status === 'actif' || c.status === 'active' || c.est_actif
          ).length;
          stats.value.contrats.expires = contracts.filter(c => 
            c.status === 'expire' || c.status === 'expired' || c.est_expire
          ).length;
          stats.value.contrats.a_renouveler = Math.round(contracts.length * 0.15);
        }

        if (interventions && Array.isArray(interventions)) {
          stats.value.interventions.total = interventions.length;
          stats.value.interventions.planifiees = interventions.filter(i => {
            const status = i.status?.toLowerCase();
            return status === 'planifiee' || status === 'planned' || status === 'planifié' || status === 'à planifier';
          }).length;
          stats.value.interventions.en_cours = interventions.filter(i => {
            const status = i.status?.toLowerCase();
            return status === 'en_cours' || status === 'in_progress' || status === 'en cours' || status === 'en cours';
          }).length;
          stats.value.interventions.terminees = interventions.filter(i => {
            const status = i.status?.toLowerCase();
            return status === 'terminee' || status === 'completed' || status === 'terminé' || status === 'clôturé';
          }).length;
        }

        if (technicians && Array.isArray(technicians)) {
          stats.value.techniciens.total = technicians.length;
          stats.value.techniciens.disponibles = technicians.filter(t => {
            const status = t.availability?.toLowerCase() || t.statut?.toLowerCase();
            return status === 'disponible' || status === 'available' || status === 'libre';
          }).length;
          stats.value.techniciens.en_intervention = technicians.filter(t => {
            const status = t.availability?.toLowerCase() || t.statut?.toLowerCase();
            return status === 'occupé' || status === 'busy' || status === 'en intervention';
          }).length;
          stats.value.techniciens.en_conge = technicians.filter(t => {
            const status = t.availability?.toLowerCase() || t.statut?.toLowerCase();
            return status === 'en congé' || status === 'away' || status === 'absent';
          }).length;
        }

        if (equipments && Array.isArray(equipments)) {
          stats.value.equipements.total = equipments.length;
          stats.value.equipements.reseau = equipments.filter(e => {
            const type = e.type?.toLowerCase() || e.category?.toLowerCase();
            return type === 'reseau' || type === 'network' || type === 'réseau';
          }).length;
          stats.value.equipements.non_reseau = equipments.length - stats.value.equipements.reseau;
          stats.value.equipements.en_panne = equipments.filter(e => {
            const status = e.status?.toLowerCase();
            return status === 'en_panne' || status === 'broken' || status === 'panne' || status === 'défectueux';
          }).length;
        }

        if (quotes && Array.isArray(quotes)) {
          stats.value.devis.total = quotes.length;
          stats.value.devis.en_attente = quotes.filter(q => {
            const status = q.status?.toLowerCase();
            return status === 'en_attente' || status === 'pending' || status === 'waiting' || status === 'en attente';
          }).length;
          stats.value.devis.acceptes = quotes.filter(q => {
            const status = q.status?.toLowerCase();
            return status === 'accepte' || status === 'accepted' || status === 'approved' || status === 'accepté';
          }).length;
          stats.value.devis.refuses = quotes.filter(q => {
            const status = q.status?.toLowerCase();
            return status === 'refuse' || status === 'rejected' || status === 'declined' || status === 'refusé';
          }).length;
        }

        // Calcul du CA mensuel estimé
        stats.value.ca_mensuel = contracts.length * 50000; // Estimation basée sur le nombre de contrats

      } catch (error) {
        console.error('Erreur lors du chargement des stats individuelles:', error);
      }
    };

    // Mettre à jour les stats depuis l'API
    const updateStatsFromAPI = (apiData) => {
      console.log('📊 Mise à jour des stats depuis API:', apiData);
      // Adapter selon la structure de votre API
      if (apiData.clients) {
        stats.value.clients = {
          total: apiData.clients.total || apiData.clients.count || 0,
          avec_contrat: apiData.clients.avec_contrat || apiData.clients.with_contract || 0,
          sans_contrat: apiData.clients.sans_contrat || apiData.clients.without_contract || 0,
          taux_fidelisation: apiData.clients.taux_fidelisation || apiData.clients.retention_rate || 0
        };
      }

      if (apiData.contrats) {
        stats.value.contrats = {
          total: apiData.contrats.total || apiData.contrats.count || 0,
          actifs: apiData.contrats.actifs || apiData.contrats.active || 0,
          expires: apiData.contrats.expires || apiData.contrats.expired || 0,
          a_renouveler: apiData.contrats.a_renouveler || apiData.contrats.to_renew || 0
        };
      }

      // Mettre à jour les autres stats de la même manière...
    };

    // Chargement des techniciens
    const loadTechnicians = async () => {
      try {
        console.log('👨‍💼 Chargement des techniciens...');
        const data = await apiCall('/displayTechnicians');
        const techniciansData = data.data || data || [];
        
        if (techniciansData && Array.isArray(techniciansData)) {
          techniciens.value = techniciansData.map(tech => ({
            id: tech.id,
            full_name: tech.full_name || tech.name || tech.nom_complet || `${tech.prenom || ''} ${tech.nom || ''}`.trim(),
            specialty: tech.specialty || tech.specialite || tech.skills || 'Technicien',
            availability: tech.availability || tech.statut || tech.status || 'Disponible',
            intervention_en_cours: tech.current_intervention || tech.intervention_en_cours || tech.current_job
          }));
          console.log(`✅ ${techniciens.value.length} techniciens chargés`);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des techniciens:', error);
        techniciens.value = mockData.techniciens;
      }
    };

    // Chargement des activités
    const loadActivities = async () => {
      try {
        console.log('📝 Chargement des activités...');
        const data = await apiCall('/activities');
        const activitiesData = data.data || data || [];
        
        if (activitiesData && Array.isArray(activitiesData)) {
          activities.value = activitiesData.map(activity => ({
            id: activity.id,
            description: activity.description || activity.action || activity.message || 'Activité',
            type: activity.type || activity.category || 'general',
            icon: activity.icon || '📝',
            created_at: activity.created_at || activity.timestamp || new Date().toISOString()
          }));
          console.log(`✅ ${activities.value.length} activités chargées`);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        activities.value = mockData.activities;
      }
    };

    // Utiliser les données simulées
    const useMockData = () => {
      console.log('🎭 Utilisation des données simulées complètes');
      stats.value = { ...mockData.stats };
      techniciens.value = [...mockData.techniciens];
      activities.value = [...mockData.activities];
    };

    // Fonctions utilitaires
    const getInitials = (name) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getStatusClass = (status) => {
      const statusLower = (status || '').toLowerCase();
      const classes = {
        'disponible': 'bg-green-100 text-green-800',
        'occupé': 'bg-yellow-100 text-yellow-800',
        'en congé': 'bg-gray-100 text-gray-800',
        'available': 'bg-green-100 text-green-800',
        'busy': 'bg-yellow-100 text-yellow-800',
        'away': 'bg-gray-100 text-gray-800',
        'libre': 'bg-green-100 text-green-800',
        'en intervention': 'bg-yellow-100 text-yellow-800',
        'absent': 'bg-gray-100 text-gray-800'
      };
      return classes[statusLower] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
      const statusLower = (status || '').toLowerCase();
      const texts = {
        'disponible': 'Disponible',
        'occupé': 'En intervention',
        'en congé': 'En congé',
        'available': 'Disponible',
        'busy': 'En intervention',
        'away': 'En congé',
        'libre': 'Disponible',
        'en intervention': 'En intervention',
        'absent': 'En congé'
      };
      return texts[statusLower] || status || 'Inconnu';
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0));
    };

    const formatDate = (dateString) => {
      try {
        if (!dateString) return 'Date inconnue';
        return new Date(dateString).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return 'Date invalide';
      }
    };

    onMounted(() => {
      loadDashboardData();
    });

    return {
      loading,
      apiOffline,
      stats,
      activities,
      techniciens,
      formatCurrency,
      formatDate,
      getInitials,
      getStatusClass,
      getStatusText
    };
  }
};
</script>

<style scoped>
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>