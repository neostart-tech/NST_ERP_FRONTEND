<template>
	<div>
		<!-- Mobile overlay avec backdrop smooth -->
		<div v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false"
				 class="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 z-40"/>

		<!-- Bouton hamburger pour mobile -->
		<button @click="mobileSidebarOpen = !mobileSidebarOpen"
						class="fixed top-4 left-4 z-50 p-2 text-gray-600 rounded-lg lg:hidden bg-white/90 backdrop-blur-sm shadow-md"
						:class="{ 'left-[17rem]': mobileSidebarOpen }">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path v-if="!mobileSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"></path>
				<path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>

		<aside
			class="fixed inset-y-0 left-0 z-40 w-64 h-screen overflow-hidden transform transition-transform duration-300 ease-in-out lg:translate-x-0"
			:class="{ 'translate-x-0': mobileSidebarOpen, '-translate-x-full': !mobileSidebarOpen }">
			<div class="flex flex-col h-full bg-gradient-to-b from-sky-800 to-sky-900 shadow-xl">
				<!-- Header fixe -->
				<div class="flex-shrink-0 px-6 py-5 border-b border-sky-700 bg-sky-800 sticky top-0 z-10">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							<a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M13 10V3L4 14h7v7l9-11h-7z"/>
								</svg>
							</a>
							<div>
								<h1 class="text-lg font-bold text-white">Neo Start Technology</h1>
								<p class="text-xs font-medium text-sky-200">Business Manager</p>
							</div>
						</div>

						<!-- Bouton de fermeture mobile déplacé en haut à gauche -->
						<div class="w-8"></div>
					</div>

					<!-- Combobox de recherche -->
					<div class="relative">
						<div class="relative">
							<input
								v-model="searchQuery"
								@focus="showSearchResults = true"
								@input="showSearchResults = true"
								type="text"
								placeholder="Rechercher une page"
								class="w-full bg-white/10 backdrop-blur-sm text-white placeholder-sky-200 border border-white/20 rounded-lg px-1 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
							/>
							<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
							</svg>
							<!-- Clear button -->
							<button
								v-if="searchQuery"
								@click="clearSearch"
								class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sky-200 hover:text-white transition-colors"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</button>
						</div>

						<!-- Résultats de recherche -->
						<Transition
							enter-active-class="transition duration-100 ease-out"
							enter-from-class="transform scale-95 opacity-0"
							enter-to-class="transform scale-100 opacity-100"
							leave-active-class="transition duration-75 ease-in"
							leave-from-class="transform scale-100 opacity-100"
							leave-to-class="transform scale-95 opacity-0"
						>
							<div
								v-if="showSearchResults && searchQuery && filteredPages.length > 0"
								class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50"
							>
								<div
									v-for="page in filteredPages"
									:key="page.url"
									@click="navigateToPage(page)"
									class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
								>
									<div class="flex items-center gap-3">
										<div class="text-gray-600">
											<svg v-if="!page.icon.includes(':')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="page.icon"/>
											</svg>
											<Icon v-else :name="page.icon" class="w-4 h-4"/>
										</div>
										<div class="flex-1">
											<p class="font-medium text-gray-900">{{ page.name }}</p>
											<p v-if="page.description" class="text-sm text-gray-500">{{ page.description }}</p>
											<p v-if="page.category" class="text-xs text-gray-400 mt-1">{{ page.category }}</p>
										</div>
									</div>
								</div>

								<!-- Message si aucun résultat -->
								<div v-if="searchQuery && filteredPages.length === 0" class="px-4 py-6 text-center text-gray-500">
									<svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
									</svg>
									<p>Aucune page trouvée</p>
								</div>
							</div>
						</Transition>
					</div>
				</div>

				<!-- Navigation scrollable -->
				<nav class="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
					<div class="space-y-1">
						<!-- Itération sur les menus -->
						<template v-for="menu in sidebarMenu" :key="menu.id">
							<template v-if="menu.accessibleTo.includes(useAuthStore().user?.role!)">
								<!-- Menu simple (sans sous-menus) -->
								<NuxtLink v-if="menu.isSingle" :to="menu.url" class="nav-item"
													:class="{ 'nav-item-active': $route.path === menu.url }">
									<div class="nav-icon">
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon"/>
										</svg>
									</div>
									<div class="flex-1">
										<p class="nav-label">{{ menu.name }}</p>
										<p v-if="menu.description" class="nav-description">{{ menu.description }}</p>
									</div>
								</NuxtLink>

								<!-- Menu avec sous-menus -->
								<div v-else class="nav-section">
									<button @click="toggleSection(menu.id)" class="w-full nav-section-header"
													:class="{ 'nav-section-header-active': expandedSections[menu.id] }">
										<div class="flex items-center justify-between w-full">
											<div class="flex items-center gap-3">
												<div class="nav-icon">
													<svg v-if="!menu.icon.includes(':')" class="w-5 h-5" fill="none" stroke="currentColor"
															 viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon"/>
													</svg>
													<Icon v-else :name="menu.icon" class="w-5 h-5"/>
												</div>
												<h3 class="nav-section-label">{{ menu.name }}</h3>
											</div>
											<svg class="w-4 h-4 transition-transform duration-200 text-white"
													 :class="{ 'rotate-180': expandedSections[menu.id] }" fill="none" stroke="currentColor"
													 viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
											</svg>
										</div>
									</button>

									<transition name="slide-down">
										<div v-show="expandedSections[menu.id]" class="mt-2 space-y-1">
											<NuxtLink v-for="submenu in menu.submenus" :key="submenu.name" :to="submenu.url"
																class="nav-item nav-item-nested"
																:class="{ 'nav-item-active': $route.path === submenu.url }">
												<div class="nav-icon">
													<svg v-if="!submenu.icon.includes(':')" class="w-5 h-5" fill="none" stroke="currentColor"
															 viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="submenu.icon"/>
													</svg>
													<Icon v-else :name="submenu.icon" class="w-5 h-5"/>
												</div>
												<div class="flex-1">
													<p class="nav-label">{{ submenu.name }}</p>
													<p v-if="submenu.description" class="nav-description">{{ submenu.description }}</p>
												</div>
											</NuxtLink>
										</div>
									</transition>
								</div>
							</template>
						</template>
					</div>
				</nav>
			</div>
		</aside>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {sidebarMenu} from '@/utils/sidebarConfig'

const route = useRoute()
const router = useRouter()

// State
const mobileSidebarOpen = ref(false)
const searchQuery = ref('')
const showSearchResults = ref(false)

// Sections dépliables
const expandedSections = ref({})

// Initialiser expandedSections avec tous les IDs de menu
onMounted(() => {
	const sections = {}
	sidebarMenu.forEach(menu => {
		if (!menu.isSingle) {
			sections[menu.id] = false
		}
	})
	expandedSections.value = sections

	// Auto-expand basé sur la route actuelle
	autoExpandBasedOnRoute()
})

// Fonction pour basculer les sections
const toggleSection = (sectionId) => {
	expandedSections.value[sectionId] = !expandedSections.value[sectionId]
	// Sauvegarde l'état dans localStorage
	localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections.value))
}

// Auto-expand basé sur la route actuelle
const autoExpandBasedOnRoute = () => {
	const path = route.path
	sidebarMenu.forEach(menu => {
		if (!menu.isSingle) {
			// Vérifier si la route actuelle correspond à un sous-menu
			const hasActiveSubmenu = menu.submenus?.some(submenu =>
				path.startsWith(submenu.url) || path === submenu.url
			)
			if (hasActiveSubmenu) {
				expandedSections.value[menu.id] = true
			}
		}
	})
}

// Collecte toutes les pages disponibles pour la recherche
const allPages = computed(() => {
	const pages = []

	sidebarMenu.forEach(menu => {
		if (menu.accessibleTo.includes(useAuthStore().user?.role!)) {
			if (menu.isSingle) {
				// Menu simple
				pages.push({
					name: menu.name,
					url: menu.url,
					icon: menu.icon,
					description: menu.description,
					category: null
				})
			} else {
				// Menu avec sous-menus
				menu.submenus?.forEach(submenu => {
					pages.push({
						name: submenu.name,
						url: submenu.url,
						icon: submenu.icon,
						description: submenu.description,
						category: menu.name
					})
				})
			}
		}
	})

	return pages
})

// Filtrage des pages selon la recherche
const filteredPages = computed(() => {
	if (!searchQuery.value.trim()) return []

	const query = searchQuery.value.toLowerCase().trim()
	return allPages.value.filter(page => {
		const name = page.name.toLowerCase()
		const description = (page.description || '').toLowerCase()
		const category = (page.category || '').toLowerCase()

		return name.includes(query) || description.includes(query) || category.includes(query)
	}).slice(0, 10) // Limiter à 10 résultats
})

// Navigation vers une page
const navigateToPage = (page) => {
	router.push(page.url)
	clearSearch()
	mobileSidebarOpen.value = false // Fermer la sidebar sur mobile
}

// Nettoyer la recherche
const clearSearch = () => {
	searchQuery.value = ''
	showSearchResults.value = false
}

// Fermer les résultats quand on clique ailleurs
const handleClickOutside = (event) => {
	if (!event.target.closest('.relative')) {
		showSearchResults.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>
