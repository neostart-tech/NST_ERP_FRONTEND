<template>
	<header class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
		<div class="flex items-center space-x-4">
			<button @click="$emit('toggle-sidebar')"
				class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</button>
			<div class="flex items-center space-x-4">
				<div class="hidden lg:block bg-gradient-to-br from-blue-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
					<div class="w-5 h-5 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
						<Icon :name="pageTitle.icon" class="w-6 h-6 text-white" />
					</div>
				</div>
				<div>
					<!-- Titre avec effet de texte dégradé -->
					<h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
						{{ pageTitle.title }}
					</h2>
					<p class="text-sm text-slate-600">{{ pageTitle.description }}</p>
				</div>
			</div>
			<!-- <h1
				class="text-md font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
				{{ pageTitle }}</h1> -->
		</div>

		<div class="flex items-center space-x-4">

			<!-- Notifications -->
			<button class="p-2 text-gray-400 hover:text-gray-600 relative">
				<Icon name="heroicons:bell" class="w-6 h-6" />
				<span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
			</button>

			<!-- User menu -->
			<div class="relative">
				<button @click="showUserMenu = !showUserMenu"
					class="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors">
					<div class="relative">
						<div
							class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
							<span>
								{{
									useAuthStore().fullName.charAt(0).toLocaleUpperCase() || "U"
								}}
							</span>
						</div>
					</div>
					<div class="text-left">
						<p class="text-sm font-medium text-gray-800">
							{{ useAuthStore().fullName || "Utilisateur" }}
						</p>
						<p class="text-xs text-gray-500">
							{{ useAuthStore().user?.loggedInAt }}
						</p>
					</div>
					<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>

				<!-- Dropdown menu -->
				<div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50" @click.stop>
					<a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 12a5 5 0 015 5v2h-2a3 3 0 00-3-3 3 3 0 00-3 3h-2v-2a5 5 0 015-5z" />
						</svg>
						<span>Profil</span>
					</a>
					<a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span>Paramètres</span>
					</a>
					<div class="border-t border-gray-100"></div>
					<button @click="logout" class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						<span>Déconnexion</span>
					</button>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const emit = defineEmits<{
	"toggle-sidebar": [];
}>();

const route = useRoute();

const showUserMenu = ref(false);

const pageTitle = computed(() => {
	console.log("route.name:", route.name);

	const titleMap: Record<string, { icon: string, title: string, description: string }> = {
		quotes: { icon: "heroicons:document-text", title: "Devis", description: "Devis" },
		orders: { icon: "heroicons:document-text", title: "Commandes", description: "Commandes" },
		invoices: { icon: "heroicons:document-text", title: "Factures", description: "Factures" },
		suppliers: { icon: "heroicons:document-text", title: "Fournisseurs", description: "Fournisseurs" },
		entreprises: { icon: "heroicons:document-text", title: "Entreprises", description: "Entreprises" },
		dashboard: { icon: "heroicons:document-text", title: "Tableau de bord", description: "Tableau de bord" },
		clients: { icon: "heroicons:document-text", title: "Gestion des Clients", description: "Gestion des Clients" },
		offers: { icon: "heroicons:document-text", title: "Soumissions d'offres", description: "Soumissions d'offres" },
		"client-detail": { icon: "heroicons:document-text", title: "Détail Client", description: "Détail Client" },
		"entreprises-detail": { icon: "heroicons:document-text", title: "Détail Entreprise", description: "Détail Entreprise" },
		"entreprises-ajouter": { icon: "heroicons:document-text", title: "Ajouter une entreprise", description: "Ajouter une entreprise" },
		"entreprises-modifier": { icon: "heroicons:document-text", title: "Modifier une entreprise", description: "Modifier une entreprise" },
		"offers-offer-form": { icon: "heroicons:document-text", title: "Ajouter un nouvel appel d'offre", description: "Ajouter un nouvel appel d'offre" },
		"offers-id-modifier": { icon: "heroicons:document-text", title: "Modifier un appel d'offre", description: "Modifier un appel d'offre" },
		"offers-offer-quick-stat": { icon: "heroicons:document-text", title: "Statistiques des appels d'offre", description: "Statistiques des appels d'offre" },
		"sales-clients": { icon: "heroicons:user-group", title: "Gestion des clients", description: "" },
		"maintenance-ajouter-un-equipement": {
			icon: "heroicons:cpu-chip",
			title: "Gestion des Équipements",
			description: "Surveillez et gérez votre parc matériel en temps réel"
		},
		"maintenance-gestion-des-techniciens": {
			icon: "heroicons:user-group",
			title: "Gestion des Techniciens",
			description: "Surveillez et gérez vos techniciens en temps réel"
		}
	};
	return titleMap[route.name as string] || {
		icon: "heroicons:cog-6-tooth",
		title: "ERP Neo Start Technology",
		description: "Système de gestion intégré"
	};
});

const logout = () => {
	authStore.logout();
	showUserMenu.value = false;
};

const handleClickOutside = (event: Event) => {
	const target = event.target as Element;
	if (!target.closest(".relative")) {
		showUserMenu.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
