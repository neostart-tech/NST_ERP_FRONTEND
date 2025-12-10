<template>
  <div class="flex items-center space-x-2">
    <!-- Bouton Voir/Éditer -->
    <button
      v-if="showEdit"
      @click="$emit('edit')"
      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
      :title="editTitle || 'Éditer'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
    </button>

    <!-- Bouton Voir -->
    <button
      v-if="showView"
      @click="$emit('view')"
      class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 group"
      :title="viewTitle || 'Voir'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    </button>

    <!-- Bouton Supprimer -->
    <button
      v-if="showDelete"
      @click="$emit('delete')"
      class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 group"
      :title="deleteTitle || 'Supprimer'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </button>

    <!-- Bouton Ajouter -->
    <button
      v-if="showAdd"
      @click="$emit('add')"
      class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 group"
      :title="addTitle || 'Ajouter'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    </button>

    <!-- Bouton Rafraîchir -->
    <button
      v-if="showRefresh"
      @click="$emit('refresh')"
      :disabled="loading"
      class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
      :title="refreshTitle || 'Rafraîchir'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 16.087v-2.383m1.357 2.383H15M12 18.5V22m0-3.5L9 16m3 2.5l3-2.5"></path>
      </svg>
    </button>

    <!-- Bouton Imprimer -->
    <button
      v-if="showPrint"
      @click="$emit('print')"
      class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
      :title="printTitle || 'Imprimer'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
      </svg>
    </button>

    <!-- Bouton Télécharger -->
    <button
      v-if="showDownload"
      @click="$emit('download')"
      class="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 group"
      :title="downloadTitle || 'Télécharger'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showEdit?: boolean
  showView?: boolean
  showDelete?: boolean
  showAdd?: boolean
  showRefresh?: boolean
  showPrint?: boolean
  showDownload?: boolean
  loading?: boolean
  editTitle?: string
  viewTitle?: string
  deleteTitle?: string
  addTitle?: string
  refreshTitle?: string
  printTitle?: string
  downloadTitle?: string
}

withDefaults(defineProps<Props>(), {
  showEdit: false,
  showView: false,
  showDelete: false,
  showAdd: false,
  showRefresh: false,
  showPrint: false,
  showDownload: false,
  loading: false
})

defineEmits<{
  edit: []
  view: []
  delete: []
  add: []
  refresh: []
  print: []
  download: []
}>()
</script>

<style scoped>
/* Styles pour les effets de survol */
.group:hover .w-4 {
  transform: scale(1.1);
}

/* Animation de rotation pour le bouton rafraîchir */
.group:hover .w-4 {
  transition: transform 0.2s ease-in-out;
}
</style>

