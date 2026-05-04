<template>
  <Alert />
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Cartes de fonctionnalités -->
      <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div class="h-12 w-12 text-blue-600 mb-4">
            <component :is="feature.icon" class="h-full w-full" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">{{ feature.title }}</h3>
          <p class="mt-2 text-gray-500">{{ feature.description }}</p>
        </div>
      </div>
    </main>
  </div>

  <!-- <div
    class="fixed top-4 right-6 left-6 lg:left-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down"
  >
    <div class="flex items-center">
      <Icon name="heroicons:x-mark" class="h-5 w-5 mr-2 text-white" />
      <span>{{ "message" }}</span>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { AppUrl } from "@/composables/appUrl";
import { useAuthStore } from "~/app/Store/authStore";
import Alert from "@/components/partials/Alert.vue";

// Icônes pour les fonctionnalités
const features = [
  {
    title: "Gestion des appels d'offres",
    description:
      "Créez et gérez facilement vos appels d'offres en quelques clics.",
    icon: "svg",
  },
  {
    title: "Suivi des tâches",
    description: "Organisez et suivez l'avancement de vos projets.",
    icon: "svg",
  },
  {
    title: "Tableaux de bord",
    description: "Visualisez vos indicateurs clés en un coup d'œil.",
    icon: "svg",
  },
  {
    title: "Documents",
    description:
      "Gérez tous vos documents importants en un seul endroit sécurisé.",
    icon: "svg",
  },
  {
    title: "Collaboration",
    description: "Travaillez en équipe de manière efficace et organisée.",
    icon: "svg",
  },
  {
    title: "Rapports",
    description: "Générez des rapports détaillés sur votre activité.",
    icon: "svg",
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
