<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Test de routage</h1>
    <p class="mb-4">Si vous voyez cette page, le routage de base fonctionne.</p>
    
    <div class="space-y-4">
      <div class="p-4 bg-blue-50 rounded-lg">
        <h2 class="font-semibold mb-2">Tester la page offer-quick-stat :</h2>
        <NuxtLink 
          to="/offers/offer-quick-stat" 
          class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Aller à offer-quick-stat
        </NuxtLink>
      </div>
      
      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
const error = ref('')

onMounted(() => {
  // Vérifier si la route est accessible
  try {
    const router = useRouter()
    const route = useRoute()
    console.log('Route actuelle:', route.path)
  } catch (err) {
    error.value = `Erreur de routage: ${err.message}`
    console.error('Erreur:', err)
  }
})
</script>
