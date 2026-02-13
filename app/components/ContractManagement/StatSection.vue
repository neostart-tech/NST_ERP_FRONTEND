<template>
	<div class="p-6">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Contrats Actifs -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Contrats Actifs</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ activeContractsCount || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Contrats En Attente -->
			<div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-yellow-900">En Attente</p>
						<p class="text-3xl font-bold text-yellow-900 mt-2">{{ pendingContractsCount || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-yellow-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Contrats Expirés -->
			<div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-red-900">Contrats Expirés</p>
						<p class="text-3xl font-bold text-red-900 mt-2">{{ expiredContractsCount || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-red-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Chiffre d'Affaires -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Chiffre d'Affaires</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ formatCurrency(totalRevenue) }}</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	formatCurrency: (amount: number) => string;
	totalRevenue: number;
}>()
const activeContractsCount = defineModel<number>('activeContractsCount', { required: true })
const pendingContractsCount = defineModel<number>('pendingContractsCount', { required: true })
const expiredContractsCount = defineModel<number>('expiredContractsCount', { required: true })
</script>
