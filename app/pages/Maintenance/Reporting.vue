<template>
  <div class="min-h-screen bg-gray-50 flex font-sans antialiased">
    <div class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-7xl mx-auto">
        
        <header class="mb-8">
          <h1 class="text-4xl font-extrabold text-blue-800 tracking-tight">Tableau de Bord Reporting</h1>
          <p class="text-lg text-gray-500 mt-1">Analyse des indicateurs de performance clés de l'entreprise.</p>
        </header>
        
        <div class="bg-white p-5 rounded-xl shadow-md mb-8 flex flex-wrap items-end gap-6 border border-gray-100">
          <div>
            <label for="period-select" class="block text-sm font-medium text-gray-700 mb-1">Sélectionner la Période</label>
            <select 
              id="period-select" 
              v-model="selectedPeriod"
              @change="loadDashboardData"
              class="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base py-2 pl-3 pr-10"
            >
              <option value="weekly">7 derniers jours</option>
              <option value="monthly">30 derniers jours</option>
              <option value="current_month" selected>Ce mois-ci</option>
              <option value="quarterly">Trimestre en cours</option>
              <option value="yearly">Année en cours</option>
            </select>
          </div>
          
          <button 
            @click="loadDashboardData"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 ease-in-out flex items-center"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Chargement...' : 'Actualiser les données' }}
          </button>

          <button 
            @click="calculateMetrics"
            class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-150 ease-in-out"
            :disabled="calculating"
          >
            <svg v-if="calculating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ calculating ? 'Calcul...' : 'Calculer Métriques' }}
          </button>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div>
              <strong class="font-bold">Erreur: </strong>
              <span class="block sm:inline">{{ error }}</span>
              <p class="text-sm mt-1">URL tentée: {{ lastAttemptedUrl }}</p>
              <p class="text-sm mt-1">Assurez-vous que Laravel est démarré sur le port 8000</p>
            </div>
          </div>
        </div>

        <!-- Indicateurs de chargement -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 text-lg">Chargement des données depuis la base de données...</p>
        </div>

        <!-- Contenu principal -->
        <div v-else-if="!loading && !error" class="fade-in">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
              <p class="text-sm font-medium text-gray-500">Total Pannes (Mois)</p>
              <p class="text-4xl font-bold text-red-600 mt-1">{{ dashboardData.total_pannes || 0 }}</p>
              <div class="mt-3 flex items-center text-sm">
                <span class="text-gray-500">Ce mois</span>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
              <p class="text-sm font-medium text-gray-500">Délai Résolution Moyen</p>
              <p class="text-4xl font-bold text-blue-600 mt-1">{{ dashboardData.delai_moyen || 0 }}<span class="text-lg font-normal ml-1">h</span></p>
              <div class="mt-3 flex items-center text-sm">
                <span class="text-gray-500">Temps moyen</span>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
              <p class="text-sm font-medium text-gray-500">CA Services (Mois)</p>
              <p class="text-4xl font-bold text-green-600 mt-1">{{ formatCurrency(dashboardData.ca_mensuel || 0) }}<span class="text-lg font-normal ml-1">FCFA</span></p>
              <div class="mt-3 flex items-center text-sm">
                <span class="text-gray-500">Chiffre d'affaires</span>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
              <p class="text-sm font-medium text-gray-500">Satisfaction Client</p>
              <p class="text-4xl font-bold text-teal-600 mt-1">{{ dashboardData.satisfaction || 0 }}<span class="text-lg font-normal ml-1">%</span></p>
              <div class="mt-3 flex items-center text-sm">
                <span class="text-gray-500">Taux de satisfaction</span>
              </div>
            </div>
          </div>
          
          <!-- Detailed Reports -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Pannes récurrentes -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div class="flex justify-between items-start mb-5">
                <div>
                  <h2 class="text-xl font-bold text-green-700">Pannes récurrentes 🚨</h2>
                  <p class="text-sm text-gray-500 mt-0.5">Top des équipements avec le plus de pannes.</p>
                </div>
                <span class="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">30 derniers jours</span>
              </div>
              
              <div class="space-y-4">
                <div 
                  v-for="(item, index) in dashboardData.recurrent_issues || []" 
                  :key="index" 
                  class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition duration-150"
                >
                  <div class="flex-shrink-0 w-8 text-center">
                    <span class="text-sm font-bold text-gray-400">{{ index + 1 }}.</span>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <p class="text-base font-medium text-gray-900 truncate">{{ item.equipment }}</p>
                    <p class="text-xs text-gray-500">{{ item.type }}</p>
                  </div>
                  <div class="ml-auto text-right">
                    <span class="text-base font-bold text-gray-900">{{ item.issues }}</span>
                    <span class="text-sm text-gray-600 block leading-none">pannes</span>
                  </div>
                  <div class="ml-4 text-center">
                    <span 
                      :class="getTrendClass(item.trend)" 
                      class="text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTrendIcon(item.trend)" />
                      </svg>
                      {{ item.change }}%
                    </span>
                  </div>
                </div>
                <div v-if="!dashboardData.recurrent_issues || dashboardData.recurrent_issues.length === 0" class="text-center text-gray-500 py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.88-6.08-2.32M3 15a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  <p class="mt-2">Aucune panne récurrente trouvée</p>
                </div>
              </div>
            </div>

            <!-- Délais d'intervention -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div class="flex justify-between items-start mb-5">
                <div>
                  <h2 class="text-xl font-bold text-blue-700">Délais d'intervention ⏱️</h2>
                  <p class="text-sm text-gray-500 mt-0.5">Performance par temps moyen de résolution.</p>
                </div>
                <div class="flex space-x-2">
                  <span class="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">Moyenne: {{ dashboardData.delai_moyen || 0 }}h</span>
                </div>
              </div>
              
              <div class="h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center mb-6 border border-gray-200">
                <div class="text-center text-gray-500">
                  <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-sm">Graphique des délais d'intervention</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3 text-center text-sm">
                <div 
                  v-for="stat in dashboardData.intervention_stats || []" 
                  :key="stat.label" 
                  class="bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <p class="text-gray-500 text-xs font-medium mb-1">{{ stat.label }}</p>
                  <p :class="stat.highlight ? 'font-bold text-blue-600 text-lg' : 'text-gray-700 font-semibold'">{{ stat.value }}</p>
                </div>
                <div v-if="!dashboardData.intervention_stats || dashboardData.intervention_stats.length === 0" class="col-span-2 text-center text-gray-500 py-4">
                  Aucune statistique disponible
                </div>
              </div>
            </div>
            
            <!-- Répartition du CA -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div class="flex justify-between items-start mb-5">
                <div>
                  <h2 class="text-xl font-bold text-green-700">Répartition du CA 💰</h2>
                  <p class="text-sm text-gray-500 mt-0.5">Ventilation des revenus par type de service.</p>
                </div>
                <span class="bg-green-50 text-green-700 text-sm font-bold px-3 py-1 rounded-lg">
                  Total: {{ formatCurrency(dashboardData.revenue_data?.total || 0) }} FCFA
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <div class="text-center text-gray-500">
                    <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <p class="text-sm">Répartition du chiffre d'affaires</p>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div 
                    v-for="item in dashboardData.revenue_data?.breakdown || []" 
                    :key="item.label" 
                    class="flex items-start p-2 hover:bg-gray-50 rounded-lg transition duration-150"
                  >
                    <span class="flex-shrink-0 h-3 w-3 rounded-full mt-2" :class="item.color"></span>
                    <div class="ml-3 flex-1">
                      <div class="flex justify-between text-sm mb-1">
                        <span class="font-semibold text-gray-800">{{ item.label }}</span>
                        <span class="text-gray-900 font-bold">{{ formatCurrency(item.amount) }} FCFA</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-500" 
                          :class="item.color" 
                          :style="`width: ${item.percentage}%`"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ item.percentage }}% du total</p>
                    </div>
                  </div>
                  <div v-if="!dashboardData.revenue_data?.breakdown || dashboardData.revenue_data.breakdown.length === 0" class="text-center text-gray-500 py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p class="mt-2">Aucune donnée de revenus disponible</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Équipe -->
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div class="flex justify-between items-start mb-5">
                <div>
                  <h2 class="text-xl font-bold text-blue-700">Performance Équipe 🛠️</h2>
                  <p class="text-sm text-gray-500 mt-0.5">Classement par nombre d'interventions.</p>
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                  Total: {{ calculateTotalInterventions() }}
                </span>
              </div>
              
              <div class="space-y-4">
                <div 
                  v-for="tech in dashboardData.technicians || []" 
                  :key="tech.id" 
                  class="flex items-center p-2 hover:bg-gray-50 rounded-lg transition duration-150"
                >
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center border border-blue-200">
                    <span class="text-blue-700 text-sm font-bold">{{ tech.initials }}</span>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex justify-between text-sm mb-2">
                      <span class="font-medium text-gray-700">{{ tech.name }}</span>
                      <span class="text-blue-600 font-bold">{{ tech.interventions }} interventions</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" 
                        :style="`width: ${tech.percentage}%`"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-if="!dashboardData.technicians || dashboardData.technicians.length === 0" class="text-center text-gray-500 py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p class="mt-2">Aucun technicien trouvé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message quand aucune donnée n'est disponible -->
        <div v-else-if="!loading && error" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.88-6.08-2.32M3 15a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Impossible de charger les données</h3>
          <p class="text-gray-500 mb-4">Vérifiez que le serveur Laravel est démarré sur le port 8000.</p>
          <button 
            @click="loadDashboardData"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-150"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Données réactives
const loading = ref(false);
const calculating = ref(false);
const error = ref(null);
const lastAttemptedUrl = ref('');
const selectedPeriod = ref('current_month');

// Données vides initiales
const dashboardData = ref({
  total_pannes: 0,
  delai_moyen: 0,
  ca_mensuel: 0,
  satisfaction: 0,
  recurrent_issues: [],
  revenue_data: { total: 0, breakdown: [] },
  technicians: [],
  intervention_stats: []
});

// URL de base de l'API Laravel
const API_BASE_URL = 'http://localhost:8000/api';

// Fonction pour charger les données du dashboard
const loadDashboardData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Construire l'URL correcte vers Laravel sur le port 8000
    const apiUrl = `${API_BASE_URL}/reporting/dashboard?period=${selectedPeriod.value}`;
    lastAttemptedUrl.value = apiUrl;
    
    console.log('Tentative de connexion à Laravel:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Important pour les requêtes cross-origin
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Réponse API Laravel reçue:', result);
    
    if (result.success) {
      dashboardData.value = result.data;
      console.log('Données chargées avec succès depuis la base de données');
    } else {
      throw new Error(result.message || 'Erreur inconnue du serveur');
    }
  } catch (err) {
    console.error('Erreur de chargement:', err);
    error.value = err.message;
    // Réinitialiser les données en cas d'erreur
    dashboardData.value = {
      total_pannes: 0,
      delai_moyen: 0,
      ca_mensuel: 0,
      satisfaction: 0,
      recurrent_issues: [],
      revenue_data: { total: 0, breakdown: [] },
      technicians: [],
      intervention_stats: []
    };
  } finally {
    loading.value = false;
  }
};

// Fonction pour calculer les métriques
const calculateMetrics = async () => {
  calculating.value = true;
  try {
    const apiUrl = `${API_BASE_URL}/reporting/calculate-metrics`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ period: selectedPeriod.value }),
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      // Recharger les données après calcul
      await loadDashboardData();
      alert('Métriques calculées avec succès!');
    } else {
      throw new Error(result.message || 'Erreur lors du calcul');
    }
  } catch (err) {
    console.error('Erreur calcul:', err);
    alert('Erreur lors du calcul des métriques: ' + err.message);
  } finally {
    calculating.value = false;
  }
};

// Fonction utilitaire pour formater la monnaie (directement en FCFA sans conversion)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount);
};

// Calcul du total des interventions
const calculateTotalInterventions = () => {
  if (!dashboardData.value.technicians || dashboardData.value.technicians.length === 0) return 0;
  return dashboardData.value.technicians.reduce((total, tech) => total + (tech.interventions || 0), 0);
};

// Helper pour les classes de tendance
const getTrendClass = (trend) => {
  switch (trend) {
    case 'up': return 'text-red-500 bg-red-100';
    case 'down': return 'text-green-500 bg-green-100';
    default: return 'text-gray-500 bg-gray-100';
  }
};

// Helper pour les icônes de tendance
const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up': return 'M5 15l7-7 7 7';
    case 'down': return 'M19 9l-7 7-7-7';
    default: return 'M10 12h4';
  }
};

// Charger les données au montage du composant
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>