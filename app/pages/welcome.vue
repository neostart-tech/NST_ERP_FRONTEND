<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- En-tête -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Bienvenue sur Neo-ERP</h1>
        <button 
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="text-center">
        <div class="mx-auto h-24 w-24 text-blue-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Content de vous revoir, {{ user?.name || 'Utilisateur' }} !
        </h2>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Votre tableau de bord est prêt à être utilisé. Commencez par explorer les différentes fonctionnalités.
        </p>
        
        <!-- Boutons d'action -->
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            :to="AppUrl.DASHBOARD"
            class="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Accéder au tableau de bord
          </NuxtLink>
          <NuxtLink 
            :to="AppUrl.TENDERS_TASK_FORM"
            class="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Créer une nouvelle tâche
          </NuxtLink>
        </div>
      </div>

      <!-- Cartes de fonctionnalités -->
      <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div class="h-12 w-12 text-blue-600 mb-4">
            <component :is="feature.icon" class="h-full w-full" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">{{ feature.title }}</h3>
          <p class="mt-2 text-gray-500">{{ feature.description }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { AppUrl } from '@/composables/appUrl';
import { useAuthStore } from '@/stores/authStore';

// Icônes pour les fonctionnalités
const features = [
  {
    title: 'Gestion des appels d\'offres',
    description: 'Créez et gérez facilement vos appels d\'offres en quelques clics.',
    icon: 'svg'
  },
  {
    title: 'Suivi des tâches',
    description: 'Organisez et suivez l\'avancement de vos projets.',
    icon: 'svg'
  },
  {
    title: 'Tableaux de bord',
    description: 'Visualisez vos indicateurs clés en un coup d\'œil.',
    icon: 'svg'
  },
  {
    title: 'Documents',
    description: 'Gérez tous vos documents importants en un seul endroit sécurisé.',
    icon: 'svg'
  },
  {
    title: 'Collaboration',
    description: 'Travaillez en équipe de manière efficace et organisée.',
    icon: 'svg'
  },
  {
    title: 'Rapports',
    description: 'Générez des rapports détaillés sur votre activité.',
    icon: 'svg'
  }
];

// Récupérer l'utilisateur connecté
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Définir le type pour le store d'authentification
type AuthStore = {
  user: any; // Remplacez 'any' par le type User approprié si disponible
  token: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

// Gérer la déconnexion
const handleLogout = async () => {
  await authStore.logout();
};

// Vérifier si l'utilisateur est connecté, sinon rediriger vers la page de connexion
const router = useRouter();
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push(AppUrl.LOGIN);
  }
});
</script>
