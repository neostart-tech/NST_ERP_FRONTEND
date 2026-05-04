<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Test des APIs d'intervention</h1>
    
    <div class="space-y-4">
      <button @click="testFetchInterventions" class="bg-blue-500 text-white px-4 py-2 rounded">
        Tester fetchInterventions
      </button>
      
      <button @click="testFetchTechnicians" class="bg-green-500 text-white px-4 py-2 rounded">
        Tester fetchTechnicians
      </button>
      
      <button @click="testFetchEquipments" class="bg-yellow-500 text-white px-4 py-2 rounded">
        Tester fetchEquipments
      </button>
      
      <button @click="testFetchClients" class="bg-purple-500 text-white px-4 py-2 rounded">
        Tester fetchClients
      </button>
      
      <button @click="testAddIntervention" class="bg-red-500 text-white px-4 py-2 rounded">
        Tester addIntervention
      </button>
    </div>

    <div v-if="loading" class="mt-4 text-blue-600">Chargement...</div>
    
    <div v-if="error" class="mt-4 text-red-600">Erreur: {{ error }}</div>
    
    <div v-if="result" class="mt-4">
      <h3 class="font-bold">Résultat:</h3>
      <pre class="bg-gray-100 p-4 rounded overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useInterventionStore } from '../../Store/interventionStore.js';

const interventionStore = useInterventionStore();
const loading = ref(false);
const error = ref(null);
const result = ref(null);

const testFetchInterventions = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    await interventionStore.fetchInterventions();
    result.value = {
      success: true,
      count: interventionStore.interventions.length,
      data: interventionStore.interventions
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const testFetchTechnicians = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    await interventionStore.fetchTechnicians();
    result.value = {
      success: true,
      count: interventionStore.technicians.length,
      data: interventionStore.technicians
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const testFetchEquipments = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    await interventionStore.fetchEquipments();
    result.value = {
      success: true,
      count: interventionStore.equipments.length,
      data: interventionStore.equipments
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const testFetchClients = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    await interventionStore.fetchClients();
    result.value = {
      success: true,
      count: interventionStore.clients.length,
      data: interventionStore.clients
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const testAddIntervention = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    const testData = {
      equipment_id: 1,
      client_id: 1,
      technician_id: 1,
      problem_description: "Test d'intervention",
      report_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    const response = await interventionStore.addIntervention(testData);
    result.value = {
      success: true,
      response: response
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

