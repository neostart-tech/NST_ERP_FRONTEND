<template>
  <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-8">
    <!-- Titre -->
    <div class="flex justify-between items-center border-b pb-3">
      <h1 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
        <i class="fas fa-chart-line"></i> Bilan des ventes
      </h1>
      <!-- Filtre par période -->
      <div class="flex items-center space-x-2">
        <input type="date" class="border rounded-md p-2" />
        <span>-</span>
        <input type="date"  class="border rounded-md p-2" />
        <button  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Filtrer
        </button>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-indigo-50 rounded-lg p-4 flex flex-col items-center text-indigo-700 shadow">
        <i class="fas fa-shopping-cart text-3xl mb-2"></i>
        <p class="text-sm font-semibold">Total Ventes</p>
        <p class="text-xl font-bold"></p>
      </div>
      <div class="bg-green-50 rounded-lg p-4 flex flex-col items-center text-green-700 shadow">
        <i class="fas fa-dollar-sign text-3xl mb-2"></i>
        <p class="text-sm font-semibold">Montant TTC</p>
        <p class="text-xl font-bold"></p>
      </div>
      <div class="bg-yellow-50 rounded-lg p-4 flex flex-col items-center text-yellow-700 shadow">
        <i class="fas fa-percent text-3xl mb-2"></i>
        <p class="text-sm font-semibold"></p>
        <p class="text-xl font-bold"> </p>
      </div>
      <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center text-blue-700 shadow">
        <i class="fas fa-users text-3xl mb-2"></i>
        <p class="text-sm font-semibold">Clients actifs</p>
        <p class="text-xl font-bold"></p>
      </div>
    </div>

    <!-- Graphique (simulation) -->
    <div class="bg-gray-50 p-4 rounded-lg shadow">
      <h2 class="text-lg font-bold mb-3">Évolution des ventes</h2>
      <div class="h-48 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
        
      </div>
    </div>

    <!-- Top clients -->
    <div class="bg-gray-50 p-4 rounded-lg shadow">
      <h2 class="text-lg font-bold mb-3">Top Clients</h2>
      <table class="w-full border border-gray-400 text-sm rounded-md overflow-hidden">
        <thead class="bg-indigo-100 text-indigo-700">
          <tr>
            <th class="border border-gray-400 p-2 text-center">Client</th>
            <th class="border border-gray-400 p-2 text-center">Nombre de commandes</th>
            <th class="border border-gray-400 p-2 text-right">Montant total</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td class="p-2  border border-gray-400 "></td>
            <td class=" border border-gray-400 p-2 text-center"></td>
            <td class="border border-gray-400 p-2 text-center"> FCFA</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// definePageMeta({ layout: 'default' })
import { ref } from 'vue'

</script>
