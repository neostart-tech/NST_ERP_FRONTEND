<template>
  <Alert />
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Section fonctionnalités -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Nos fonctionnalités</h2>
        <div class="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
      </div>

      <!-- Cartes de fonctionnalités -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div class="w-14 h-14 flex items-center justify-center rounded-xl mb-6" :class="feature.bgColor">
            <Icon :name="feature.icon" class="w-8 h-8" :class="feature.textColor" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import Alert from "@/components/partials/Alert.vue";

// Icônes pour les fonctionnalités
const features = [
  {
    title: "Gestion des appels d'offres",
    description: "Créez, gérez et suivez vos appels d'offres en temps réel avec une interface intuitive.",
    icon: "heroicons:document-chart-bar",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600"
  },
  {
    title: "Suivi des tâches",
    description: "Organisez vos projets avec des tableaux Kanban et des échéances claires.",
    icon: "heroicons:check-circle",
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    title: "Tableaux de bord",
    description: "Visualisez vos indicateurs clés avec des graphiques personnalisables.",
    icon: "heroicons:chart-bar",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600"
  },
  {
    title: "Gestion documentaire",
    description: "Stockez et gérez tous vos documents en un seul endroit sécurisé.",
    icon: "heroicons:folder",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600"
  },
  {
    title: "Gestion des lots",
    description: "Gérez efficacement vos lots d'appels d'offres.",
    icon: "heroicons:user-group",
    bgColor: "bg-pink-100",
    textColor: "text-pink-600"
  },
  {
    title: "Rapports avancés",
    description: "Générez et exportez des rapports détaillés sur votre activité.",
    icon: "heroicons:presentation-chart-bar",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600"
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
