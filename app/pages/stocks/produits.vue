<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Cartes de statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Carte Total Produits -->
			<div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-sky-900">Total Produits</p>
						<p class="text-3xl font-bold text-sky-900 mt-2">
							{{ stats.total || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-sky-500">
						<Icon name="heroicons:cube" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Produits en Stock -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-emerald-900">En Stock</p>
						<p class="text-3xl font-bold text-emerald-900 mt-2">
							{{ stats.inStock || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-emerald-500">
						<Icon name="heroicons:check-circle" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Stock Faible -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Stock Faible</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">
							{{ stats.lowStock || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Produits Inactifs -->
			<div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-red-900">Produits Inactifs</p>
						<p class="text-3xl font-bold text-red-900 mt-2">
							{{ stats.inactive || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-red-500">
						<Icon name="heroicons:archive-box-x-mark" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des articles</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>
				<div class="relative flex-1 max-w-xs w-full md:w-auto">
					<select v-model="filterStatus"
						class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm">
						<option value="">Tous les statuts</option>
						<option value="active">Actifs</option>
						<option value="inactive">Inactifs</option>
					</select>
				</div>

				<!-- Boutons d'action -->
				<button @click="openProductForm()"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouvel Article
				</button>
			</div>
		</div>

		<!-- Affichage en mode cards (visible jusqu'à lg) -->
		<div class="xl:hidden">
			<!-- État de chargement -->
			<div v-if="isLoading" class="flex justify-center items-center space-x-2 py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<span class="text-gray-600">Chargement des produits...</span>
			</div>

			<!-- Aucun résultat -->
			<div v-else-if="!filteredProducts.length" class="text-center py-12">
				<div class="flex flex-col items-center justify-center">
					<Icon name="heroicons:inbox" class="h-12 w-12 text-gray-300 mb-2" />
					<p class="text-sm text-gray-500">Aucun produit trouvé</p>
					<p class="text-xs text-gray-400 mt-1">
						Essayez de modifier vos filtres de recherche
					</p>
				</div>
			</div>

			<!-- Liste des cards -->
			<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div v-for="product in filteredProducts" :key="product.id"
					class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
					<!-- En-tête de la card -->
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-center flex-1">
							<div class="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
								<Icon name="heroicons:cube" class="h-6 w-6 text-blue-600" />
							</div>
							<div class="ml-3 flex-1">
								<h3 class="text-sm font-semibold text-gray-900">{{ product.name }}</h3>
								<p class="text-xs text-gray-500">{{ product.category?.name || "Sans catégorie" }}</p>
							</div>
						</div>
						<span @click="toggleProductStatus(product)"
							class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer" :class="product.status === 'active'
									? 'bg-green-100 text-green-800 hover:bg-green-200'
									: 'bg-red-100 text-red-800 hover:bg-red-200'">
							{{ product.status === "active" ? "Actif" : "Inactif" }}
						</span>
					</div>

					<!-- Informations du produit -->
					<div class="space-y-2 mb-4">
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-500">Référence:</span>
							<span class="font-medium text-gray-900">{{ product.reference || "N/A" }}</span>
						</div>
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-500">Prix d'achat:</span>
							<span class="font-medium text-gray-900">{{ formatPrice(product.unit_price_purchase) }}</span>
						</div>
						<div class="flex justify-between items-center text-sm">
							<span class="text-gray-500">Prix de vente:</span>
							<span class="font-medium" :class="{
								'text-green-600': product.unit_price_sale > product.unit_price_purchase,
								'text-red-600': product.unit_price_sale <= product.unit_price_purchase,
							}">
								{{ formatPrice(product.unit_price_sale) }}
							</span>
						</div>
						<div class="pt-2">
							<div class="flex justify-between items-center text-sm mb-1">
								<span class="text-gray-500">Stock:</span>
								<span class="font-medium text-gray-700">
									{{ product.quantity }} {{ product.unit || "unité" }}{{ product.quantity !== 1 ? "s" : "" }}
								</span>
							</div>
							<div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
								<div class="h-full" :class="{
									'bg-green-500': product.quantity > 10,
									'bg-yellow-500': product.quantity > 0 && product.quantity <= 10,
									'bg-red-500': product.quantity === 0,
								}" :style="{
									width: `${Math.min(100, (product.quantity / (product.quantity + 10)) * 100)}%`,
								}"></div>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex justify-end space-x-2 pt-3 border-t border-gray-100">
						<button @click="openProductForm(product.id)"
							class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
							title="Modifier">
							<Icon name="heroicons:pencil-square" class="h-4 w-4 mr-1" />
							Modifier
						</button>
						<button @click="confirmDelete(product)"
							class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
							title="Supprimer">
							<Icon name="heroicons:trash" class="h-4 w-4 mr-1" />
							Supprimer
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Affichage en mode tableau (visible à partir de xl) -->
		<div class="hidden xl:block overflow-x-auto rounded-lg border border-gray-200">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Produit
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Référence
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Prix
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Stock
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Statut
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<!-- État de chargement -->
					<tr v-if="isLoading">
						<td colspan="7" class="px-6 py-8 text-center">
							<div class="flex justify-center items-center space-x-2">
								<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
								<span class="text-gray-600">Chargement des produits...</span>
							</div>
						</td>
					</tr>

					<!-- Aucun résultat -->
					<tr v-else-if="!filteredProducts.length">
						<td colspan="7" class="px-6 py-8 text-center text-gray-500">
							<div class="flex flex-col items-center justify-center">
								<Icon name="heroicons:inbox" class="h-12 w-12 text-gray-300 mb-2" />
								<p class="text-sm">Aucun produit trouvé</p>
								<p class="text-xs text-gray-400 mt-1">
									Essayez de modifier vos filtres de recherche
								</p>
							</div>
						</td>
					</tr>

					<!-- Liste des produits -->
					<tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
									<Icon name="heroicons:cube" class="h-5 w-5 text-blue-600" />
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900 break-words whitespace-normal">
										{{ product.name }}
									</div>
									<div class="text-xs text-gray-500">
										{{ product.category?.name || "Sans catégorie" }}
									</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ product.reference || "N/A" }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							P.A: {{ formatPrice(product.unit_price_purchase) }} <br>
							P.V: {{ formatPrice(product.unit_price_sale) }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
									<div class="h-full" :class="{
										'bg-green-500': product.quantity > 10,
										'bg-yellow-500':
											product.quantity > 0 && product.quantity <= 10,
										'bg-red-500': product.quantity === 0,
									}" :style="{
											width: `${Math.min(
												100,
												(product.quantity / (product.quantity + 10)) * 100
											)}%`,
										}"></div>
								</div>
								<span class="ml-2 text-sm font-medium text-gray-700">
									{{ product.quantity }} {{ product.unit || "unité"
									}}{{ product.quantity !== 1 ? "s" : "" }}
								</span>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span @click="toggleProductStatus(product)"
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer" :class="product.status === 'active'
										? 'bg-green-100 text-green-800 hover:bg-green-200'
										: 'bg-red-100 text-red-800 hover:bg-red-200'
									">
								{{ product.status === "active" ? "Actif" : "Inactif" }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<div class="flex justify-end space-x-2">
								<button @click="openProductForm(product.id)" class="text-blue-600 hover:text-blue-900" title="Modifier">
									<Icon name="heroicons:pencil-square" class="h-5 w-5" />
								</button>
								<button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900" title="Supprimer">
									<Icon name="heroicons:trash" class="h-5 w-5" />
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div class="mt-4 flex items-center justify-between">
			<div class="text-sm text-gray-500">
				Affichage de
				<span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> à
				<span class="font-medium">{{
					Math.min(currentPage * perPage, filteredProducts.length)
				}}</span>
				sur
				<span class="font-medium">{{ filteredProducts.length }}</span> résultats
			</div>
			<div class="flex space-x-2">
				<button @click="currentPage--" :disabled="currentPage === 1"
					class="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50">
					Précédent
				</button>
				<button @click="currentPage++" :disabled="currentPage * perPage >= filteredProducts.length"
					class="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50">
					Suivant
				</button>
			</div>
		</div>
	</div>

	<!-- Modale de confirmation de suppression -->
	<div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4 text-center">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDeleteModal = false"></div>

			<div
				class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
				<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600" />
						</div>
						<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 class="text-base font-semibold leading-6 text-gray-900">
								Supprimer le produit
							</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-500">
									Êtes-vous sûr de vouloir supprimer "{{
										productToDelete?.name
									}}" ? Cette action est irréversible.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button type="button"
						class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
						:disabled="deleteLoading" @click="deleteProduct">
						<span v-if="deleteLoading" class="flex items-center">
							<Icon name="heroicons:arrow-path" class="animate-spin h-4 w-4 mr-2" />
							Suppression...
						</span>
						<span v-else>Supprimer</span>
					</button>
					<button type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
						:disabled="deleteLoading" @click="showDeleteModal = false">
						Annuler
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modale de formulaire produit -->
	<div v-if="showProductFormModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
		role="dialog" aria-modal="true">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showProductFormModal = false">
			</div>

			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
				<div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
					<button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
						@click="showProductFormModal = false">
						<span class="sr-only">Fermer</span>
						<Icon name="heroicons:x-mark" class="h-6 w-6" />
					</button>
				</div>

				<div class="sm:flex sm:items-start">
					<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
							{{
								editingProductId
									? "Modifier le produit"
									: "Ajouter un nouveau produit"
							}}
						</h3>

						<div class="mt-6">
							<!-- Formulaire de produit -->
							<form @submit.prevent="submitProductForm" class="space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<!-- Colonne gauche -->
									<div class="space-y-4">
										<!-- Nom du produit -->
										<div>
											<label for="name" class="block text-sm font-medium text-gray-700">Nom du produit</label>
											<input type="text" id="name" v-model="currentProduct.name" required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
										</div>

										<!-- Référence -->
										<div>
											<label for="reference" class="block text-sm font-medium text-gray-700">Référence</label>
											<input type="text" id="reference" v-model="currentProduct.reference"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
										</div>

										<!-- Catégorie -->
										<div>
											<label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
											<select id="category" v-model="currentProduct.category_id"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
												<option value="">Sélectionner une catégorie</option>
												<option v-for="category in categories" :key="category.id" :value="category.id">
													{{ category.name }}
												</option>
											</select>
										</div>

										<!-- Description -->
										<div>
											<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
											<textarea id="description" v-model="currentProduct.description" rows="3"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
										</div>
									</div>

									<!-- Colonne droite -->
									<div class="space-y-4">
										<!-- Prix d'achat -->
										<div>
											<label for="purchase_price" class="block text-sm font-medium text-gray-700">Prix d'achat
												(FCFA)</label>
											<input type="number" id="purchase_price" v-model.number="currentProduct.unit_price_purchase"
												min="0" step="0.01" required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
										</div>

										<!-- Prix de vente -->
										<div>
											<label for="sale_price" class="block text-sm font-medium text-gray-700">Prix de vente
												(FCFA)</label>
											<input type="number" id="sale_price" v-model.number="currentProduct.unit_price_sale" min="0"
												step="0.01" required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
										</div>

										<!-- Quantité en stock -->
										<div>
											<label for="quantity" class="block text-sm font-medium text-gray-700">Quantité en stock</label>
											<input type="number" id="quantity" v-model.number="currentProduct.quantity" min="0" required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
										</div>

										<!-- Unité de mesure -->
										<div>
											<label for="unit" class="block text-sm font-medium text-gray-700">Unité de mesure</label>
											<input type="text" id="unit" v-model="currentProduct.unit" placeholder="Ex: pièce, kg, L, etc."
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
										</div>

										<!-- Statut -->
										<div>
											<label class="block text-sm font-medium text-gray-700">Statut</label>
											<div class="mt-2 space-x-4">
												<label class="inline-flex items-center">
													<input type="radio" v-model="currentProduct.status" value="active"
														class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
													<span class="ml-2 text-sm text-gray-700">Actif</span>
												</label>
												<label class="inline-flex items-center">
													<input type="radio" v-model="currentProduct.status" value="inactive"
														class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
													<span class="ml-2 text-sm text-gray-700">Inactif</span>
												</label>
											</div>
										</div>
									</div>
								</div>

								<div class="mt-6 flex justify-end space-x-3">
									<button type="button" @click="showProductFormModal = false"
										class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
										Annuler
									</button>
									<button type="submit" :disabled="formLoading"
										class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
										<span v-if="formLoading" class="flex items-center">
											<Icon name="heroicons:arrow-path" class="animate-spin h-4 w-4 mr-2" />
											Enregistrement...
										</span>
										<span v-else>Enregistrer</span>
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useToast } from "vue-toastification";
import { productFormData } from "~/models/Product";
import { useProductStore } from "@/stores/Stock/ProductStore";
import Swal from "sweetalert2";

const toast = useToast();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase || "/api";

// États
const categories = ref([]);
const formLoading = ref(false);
const deleteLoading = ref(false);
const showProductFormModal = ref(false);
const showDeleteModal = ref(false);
const editingProductId = ref(null);
const productToDelete = ref(null);
const searchQuery = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const perPage = 10;

// Données du produit courant
const currentProduct = ref(productFormData());
const productStore = useProductStore();

const { products, isLoading } = storeToRefs(productStore);

// Statistiques
const stats = computed(() => {
	const total = products.value.length;
	const inStock = products.value.filter((p) => p.quantity > 0).length;
	const lowStock = products.value.filter(
		(p) => p.quantity > 0 && p.quantity <= 10
	).length;
	const inactive = products.value.filter((p) => p.status === "inactive").length;

	return { total, inStock, lowStock, inactive };
});

// Produits filtrés
const filteredProducts = computed(() => {
	let results = [...products.value];

	// Filtre par recherche
	if (searchQuery.value) {
		const search = searchQuery.value.toLowerCase();
		results = results.filter(
			(p) =>
				p.name.toLowerCase().includes(search) ||
				(p.reference && p.reference.toLowerCase().includes(search)) ||
				(p.description && p.description.toLowerCase().includes(search))
		);
	}

	// Filtre par statut
	if (filterStatus.value) {
		results = results.filter((p) => p.status === filterStatus.value);
	}

	return results;
});

// Pagination
const paginatedProducts = computed(() => {
	const start = (currentPage.value - 1) * perPage;
	const end = start + perPage;
	return filteredProducts.value.slice(start, end);
});

// Formater le prix
const formatPrice = (price) => {
	if (price === null || price === undefined) return "N/A";
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
};

// Charger les produits
const fetchProducts = async () => {
	try {
		await productStore.fetchAll();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur lors du chargement",
			text : "Une erreur est survenue lors du chargement des produits",
		});
	} finally {
		isLoading.value = false;
	}
};

// Charger les catégories
const fetchCategories = async () => {
	try {
		const response = await $fetch(`${apiBase}/categories`);
		categories.value = response.data || [];
	} catch (error) {
		console.error("Erreur lors du chargement des catégories:", error);
	}
};

// Ouvrir le formulaire
const openProductForm = async (id = null) => {
	editingProductId.value = id;

	if (id) {
		// Charger le produit existant
		try {
			const response = await $fetch(`${apiBase}/products/${id}`);
			currentProduct.value = { ...response.data };
		} catch (error) {
			console.error("Erreur lors du chargement du produit:", error);
			toast.error("Erreur lors du chargement du produit");
			return;
		}
	} else {
		// Réinitialiser pour un nouveau produit
		currentProduct.value = productFormData();
	}

	showProductFormModal.value = true;
};

// Soumettre le formulaire
const submitProductForm = async () => {
	// Validation
	if (!currentProduct.value.name) {
		toast.error("Le nom du produit est requis");
		return;
	}

	if (
		currentProduct.value.unit_price_sale <
		currentProduct.value.unit_price_purchase
	) {
		toast.error("Le prix de vente ne peut pas être inférieur au prix d'achat");
		return;
	}

	formLoading.value = true;

	try {
		if (editingProductId.value) {
			// Mise à jour
			await $fetch(`${apiBase}/products/${editingProductId.value}`, {
				method: "PUT",
				body: currentProduct.value,
			});
			toast.success("Produit mis à jour avec succès");
		} else {
			// Création
			await $fetch(`${apiBase}/products`, {
				method: "POST",
				body: currentProduct.value,
			});
			toast.success("Produit créé avec succès");
		}

		// Recharger les données
		await fetchProducts();
		showProductFormModal.value = false;
	} catch (error) {
		console.error("Erreur lors de l'enregistrement du produit:", error);
		toast.error(
			error.response?._data?.message ||
			"Erreur lors de l'enregistrement du produit"
		);
	} finally {
		formLoading.value = false;
	}
};

// Confirmer la suppression
const confirmDelete = (product) => {
	productToDelete.value = product;
	showDeleteModal.value = true;
};

// Supprimer un produit
const deleteProduct = async () => {
	if (!productToDelete.value) return;

	deleteLoading.value = true;

	try {
		await $fetch(`${apiBase}/products/${productToDelete.value.id}`, {
			method: "DELETE",
		});

		toast.success("Produit supprimé avec succès");
		await fetchProducts();
		showDeleteModal.value = false;
	} catch (error) {
		console.error("Erreur lors de la suppression du produit:", error);
		toast.error("Erreur lors de la suppression du produit");
	} finally {
		deleteLoading.value = false;
		productToDelete.value = null;
	}
};

// Changer le statut d'un produit
const toggleProductStatus = async (product) => {
	try {
		const newStatus = product.status === "active" ? "inactive" : "active";
		await $fetch(`${apiBase}/products/${product.id}`, {
			method: "PATCH",
			body: { status: newStatus },
		});

		// Mettre à jour localement
		const index = products.value.findIndex((p) => p.id === product.id);
		if (index !== -1) {
			products.value[index].status = newStatus;
		}

		toast.success(
			`Statut du produit mis à jour: ${newStatus === "active" ? "Actif" : "Inactif"
			}`
		);
	} catch (error) {
		console.error("Erreur lors du changement de statut:", error);
		toast.error("Erreur lors du changement de statut du produit");
	}
};

// Gestion des événements clavier
const handleKeyDown = (e) => {
	if (e.key === "Escape") {
		if (showProductFormModal.value) showProductFormModal.value = false;
		if (showDeleteModal.value) showDeleteModal.value = false;
	}
};

// Initialisation
onMounted(async () => {
	await Promise.all([fetchProducts(), fetchCategories()]);
	window.addEventListener("keydown", handleKeyDown);
});

// Nettoyage
onUnmounted(() => {
	window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
/* Styles pour les animations */
.animate-spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

/* Styles pour les transitions de modales */
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

/* Amélioration de l'accessibilité */
[role="button"] {
	cursor: pointer;
}

/* Style pour les lignes du tableau */
tr {
	transition: background-color 0.2s ease;
}

/* Style pour les boutons d'action */
.action-button {
	@apply p-1.5 rounded-md hover:bg-gray-100 transition-colors;
}

/* Style pour les champs de formulaire */
.form-input {
	@apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}

/* Style pour les messages d'erreur */
.error-message {
	@apply mt-1 text-sm text-red-600;
}
</style>
