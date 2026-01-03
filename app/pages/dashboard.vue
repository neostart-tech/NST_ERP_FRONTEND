<template>
  <Alert />
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Contenu principal -->
    <main class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Section fonctionnalités -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">Nos fonctionnalités</h2>
        <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full mb-8"></div>
      </div>

      <!-- Cartes de fonctionnalités -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(feature, index) in features"
          :key="index"
          :to="feature.route || '#'"
          class="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-50 hover:border-transparent hover:bg-gradient-to-br hover:from-white hover:to-gray-50"
        >
          <!-- Effet de fond au survol -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div class="relative z-10">
            <div class="w-14 h-14 flex items-center justify-center rounded-2xl mb-4 transition-all duration-500 group-hover:scale-110" :class="feature.bgColor">
              <Icon :name="feature.icon" class="w-7 h-7 transition-transform duration-500 group-hover:scale-110" :class="feature.textColor" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">{{ feature.title }}</h3>
            <p class="text-sm text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{{ feature.description }}</p>
            <span v-if="feature.route" class="inline-flex items-center font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300 group-hover:translate-x-1">
              Accéder au module
              <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>

          <!-- Effet de bordure animée -->
          <div class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
        </NuxtLink>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Tableau de bord"
});

import { useAuthStore } from "@/stores/authStore";
import Alert from "@/components/partials/Alert.vue";
import { AppUrl } from '@/composables/appUrl'

// Icônes pour les fonctionnalités
const features = [
  {
    title: "Gestion des appels d'offres",
    description: "Créez, gérez et suivez vos appels d'offres en temps réel avec une interface intuitive.",
    icon: "heroicons:document-chart-bar",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    route: AppUrl.OFFERS_QUICK_STAT
  },
  {
    title: "Gestion des ventes",
    description: "Suivez vos ventes, factures et devis en temps réel.",
    icon: "heroicons:shopping-cart",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    route: AppUrl.PROFORMA_INFORMATIONS
  },
  {
    title: "Maintenance",
    description: "Gérez les interventions et le suivi de maintenance de vos équipements.",
    icon: "heroicons:wrench-screwdriver",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    route: AppUrl.MAINTENANCE_REPORTING
  },
  {
    title: "Gestion des stocks",
    description: "Suivez vos stocks en temps réel et géz les alertes de réapprovisionnement.",
    icon: "heroicons:cube",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
    route: "/stocks"
  },
  {
    title: "Gestion des clients",
    description: "Centralisez les informations de vos clients et suivez vos relations.",
    icon: "heroicons:user-group",
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
    route: "/clients"
  },
  {
    title: "Tableaux de bord",
    description: "Visualisez vos indicateurs clés avec des graphiques personnalisables.",
    icon: "heroicons:presentation-chart-bar",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
    route: "/tableaux-de-bord"
  },
];

// Récupérer l'utilisateur connecté
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Gérer la déconnexion
const handleLogout = () => {
  authStore.logout();
};

// Normalement, c'est géré par le middleware mais je le laisse au cas où
// Vérifier si l'utilisateur est connecté, sinon rediriger vers la page de connexion
// const router = useRouter();
;
</script>
