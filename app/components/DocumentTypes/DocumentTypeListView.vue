<template>
  <div class="hidden lg:block">
    <div class="bg-white border rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-blue-50 to-green-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Image</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Nom</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Description
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Disponible
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Obligatoire
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Statut</th>
          <th class="px-6 py-3 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="documentType in filtered" :key="documentType.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <img v-if="documentType.file?.path" :src="storageUrl(documentType.file.path)" :alt="documentType.name"
                 class="h-10 w-10 rounded-md object-cover border border-gray-200"/>
            <div v-else class="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
              <Icon name="heroicons:photo" class="h-5 w-5 text-gray-400"/>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ documentType.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-500">{{ documentType.description ?? '-' }}</td>
          <td class="px-6 py-4 text-sm">
									<span :class="documentType.isAvailable ? 'text-emerald-600' : 'text-red-600'">
										{{ documentType.isAvailable ? 'Oui' : 'Non' }}
									</span>
          </td>
          <td class="px-6 py-4 text-sm">
								<span :class="documentType.required ? 'text-emerald-600' : 'text-gray-600'">{{
										documentType.required ? 'Oui' : 'Non'
									}}</span>
          </td>
          <td class="px-6 py-4 text-sm">
            <span class="text-gray-700">{{ readableStatus(documentType.status) }}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button @click="edit(documentType)" class="text-blue-600 hover:text-blue-900 mr-3" title="Modifier">
              <Icon name="heroicons:pencil-square" class="w-5 h-5"/>
            </button>
            <button @click="toggleAvailability(documentType.id)" class="text-amber-600 hover:text-amber-900 mr-3"
                    title="Basculer disponibilité">
              <Icon name="heroicons:arrows-right-left" class="w-5 h-5"/>
            </button>
            <button @click="confirmDelete(documentType)" class="text-red-600 hover:text-red-900" title="Supprimer">
              <Icon name="heroicons:trash" class="w-5 h-5"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {DocumentType} from '~/models/DocumentType';

const storageUrl = (path: string) => {
	const base = import.meta.env.VITE_API_URL_BASE || 'http://localhost:8000';
	return `${base}/storage/${path}`;
};

defineProps<{
	confirmDelete: (dt: DocumentType) => void,
	edit: (dt: DocumentType) => void,
	filtered: DocumentType[],
	readableStatus: (s?: string) => ("Disponible" | "Manquant" | "En cours" | string),
	toggleAvailability: (id: string) => Promise<void>,
}>();
</script>
