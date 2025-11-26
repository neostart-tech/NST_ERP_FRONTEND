<template>
	<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
	<div class="hidden lg:block bg-white border p-4 rounded-lg shadow mt-6">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Nom / Raison Sociale
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Type
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Email
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Téléphone
						</th>
						<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="client in paginatedClients" :key="client.id + '-table'"
						class="hover:bg-gray-50 transition-colors duration-150">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900" v-if="client.client_type === 'Physique'">
								{{ client.last_name }} {{ client.first_name }}
							</div>
							<div class="text-sm font-medium text-gray-900" v-else>
								{{ client.company_name }}
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm px-2 py-1 inline-flex leading-5 rounded-full" :class="{
								'bg-amber-100 text-amber-500 border border-amber-200': client.client_type === 'Moral',
								'bg-emerald-100 text-emerald-500 border border-emerald-200': client.client_type === 'Physique'
							}">
								{{ client.client_type }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{{ client.email || '-' }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{{ client.phone || '-' }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

							<button @click="emit('view', client)" class="text-gray-600 hover:text-gray-900 mr-3"
								title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
							<button @click="emit('edit', client)" class="text-blue-600 hover:text-blue-900 mr-3" title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5" />
							</button>
							<button @click="emit('delete', client)" class="text-red-600 hover:text-red-900" title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5" />
							</button>
						</td>
					</tr>
					<tr v-if="paginatedClients.length === 0">
						<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
							<EmptyState title="Aucun client trouvé" :description="noDataDescription" icon="heroicons:user-group"
								iconColor="text-indigo-400" @reload="emit('reload')" :isLoading="isLoading"
								:searchQuery="searchQuery" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
	<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<template v-if="paginatedClients.length > 0">
			<div v-for="client in paginatedClients" :key="client.id + '-card'"
				class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200"
				:class="{ 'bg-amber-100': client.client_type === 'Moral', 'bg-emerald-100': client.client_type === 'Physique' }">
				<div class="p-4">
					<div class="flex items-start justify-between">
						<div>
							<div class="flex items-center">
								<h3 class="text-lg font-semibold text-gray-900">
									<template v-if="client.client_type === 'Physique'">
										{{ client.last_name }} {{ client.first_name }}
									</template>
									<template v-else>
										{{ client.company_name }}
									</template>
								</h3>
							</div>
							<div class="mt-2">
								<div class="flex items-center text-sm text-gray-600">
									<Icon name="heroicons:envelope" class="w-4 h-4 mr-2 text-gray-400" />
									<span>{{ client.email || 'Non renseigné' }}</span>
								</div>
								<div class="flex items-center text-sm text-gray-600 mt-1">
									<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-gray-400" />
									<span>{{ client.phone || 'Non renseigné' }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="flex justify-end mt-2">
						<button @click.stop="emit('edit', client)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
							title="Modifier">
							<Icon name="heroicons:pencil-square" class="w-5 h-5" />
						</button>
						<button @click.stop="emit('view', client)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
							title="Voir les détails">
							<Icon name="heroicons:eye" class="w-5 h-5" />
						</button>
						<button @click.stop="emit('delete', client)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
							title="Supprimer">
							<Icon name="heroicons:trash" class="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="col-span-full">
				<EmptyState title="Aucun client trouvé" :description="noDataDescription" icon="heroicons:user-group"
					iconColor="text-indigo-400" @reload="emit('reload')" :isLoading="isLoading" :searchQuery="searchQuery" />
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { type Client } from '~/models/Client'
import EmptyState from '~/app/components/EmptyState.vue'

interface Props {
	paginatedClients: Client[]
	isLoading: boolean
	searchQuery: string
	noDataDescription: string
}

defineProps<Props>()

const emit = defineEmits<{
	edit: [client: Client]
	view: [client: Client]
	delete: [client: Client]
	reload: []
}>()
</script>
