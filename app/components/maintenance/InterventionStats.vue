<template>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		<!-- Carte Total Signalements -->
		<div
			class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200 md:col-span-2 lg:col-span-1">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-sky-900">Total Signalements</p>
					<p class="text-3xl font-bold text-sky-900 mt-2">{{ stats.total }}</p>
				</div>
				<div class="p-3 rounded-lg bg-sky-500">
					<Icon name="heroicons:wrench-screwdriver" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>

		<!-- Carte Nouveaux Signalements -->
		<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-blue-900">Nouveaux</p>
					<p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.nouveaux }}</p>
				</div>
				<div class="p-3 rounded-lg bg-blue-500">
					<Icon name="heroicons:bell-alert" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>

		<!-- Carte En Cours -->
		<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-amber-900">En Cours</p>
					<p class="text-3xl font-bold text-amber-900 mt-2">{{ stats.enCours }}</p>
				</div>
				<div class="p-3 rounded-lg bg-amber-500">
					<Icon name="heroicons:cog-6-tooth" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInterventionStore } from '~/app/stores/Maintenance/InterventionStore';

const { interventions } = storeToRefs(useInterventionStore())

const stats = computed(() => {
	const total = interventions.value.length

	const nouveaux = interventions.value.filter(
		intervention => intervention.status === 'new'
	).length

	const enCours = interventions.value.filter(
		intervention =>
			intervention.status === 'diagnostic' ||
			intervention.status === 'repair' ||
			intervention.status === 'quotation' ||
			intervention.status === 'waiting'
	).length

	return {
		total,
		nouveaux,
		enCours
	}
})
</script>
