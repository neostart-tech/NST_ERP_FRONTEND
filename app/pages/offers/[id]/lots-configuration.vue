<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Page Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Configuration des lots
        </h2>
        <button
          @click="navigateTo('/offers')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Retour à la liste
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Offer Information -->
      <div class="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informations de l'appel d'offre</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Référence</label>
            <p class="text-sm text-gray-900">{{ offerData.number }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Titre</label>
            <p class="text-sm text-gray-900">{{ offerData.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date limite de soumission</label>
            <p class="text-sm text-gray-900">{{ formatDate(offerData.submission_deadline) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Budget estimé</label>
            <p class="text-sm text-gray-900">{{ formatCurrency(offerData.estimated_budget) }}</p>
          </div>
        </div>
      </div>

      <!-- Lots Configuration -->
      <div class="bg-white rounded-lg border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Configuration des lots</h3>
              <p class="text-sm text-gray-600 mt-1">Définissez les lots, leurs caractéristiques et leurs prix</p>
            </div>
            <button
              @click="addNewLot"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter un lot
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-6">
            <div v-for="(lot, index) in lots" :key="index" class="border border-gray-200 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-medium text-gray-900">Lot {{ index + 1 }}</h4>
                <button
                  @click="removeLot(index)"
                  class="text-red-600 hover:text-red-800"
                  title="Supprimer ce lot"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Désignation et caractéristiques -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Désignation</label>
                  <input
                    v-model="lot.designation"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ex: Fourniture de matériel informatique"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                  <input
                    v-model="lot.quantity"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Caractéristiques techniques</label>
                <textarea
                  v-model="lot.characteristics"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Décrivez les caractéristiques techniques du lot..."
                ></textarea>
              </div>
              
              <!-- Configuration des prix -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h5 class="text-md font-medium text-gray-900 mb-4">Configuration des prix</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prix fournisseur (€)</label>
                    <input
                      v-model="lot.supplierPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      @input="calculateLotTotals(index)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Transport (€)</label>
                    <input
                      v-model="lot.transportCost"
                      type="number"
                      step="0.01"
                      min="0"
                      @input="calculateLotTotals(index)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Douanes (€)</label>
                    <input
                      v-model="lot.customsCost"
                      type="number"
                      step="0.01"
                      min="0"
                      @input="calculateLotTotals(index)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prix de vente (€)</label>
                    <input
                      v-model="lot.sellingPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      @input="calculateLotTotals(index)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <!-- Résumé des calculs -->
                <div class="mt-4 p-3 bg-white rounded border border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-gray-600">Coût total :</span>
                      <span class="font-medium text-gray-900 ml-2">{{ formatCurrency(lot.totalCost) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Bénéfice :</span>
                      <span class="font-medium text-green-600 ml-2">{{ formatCurrency(lot.profit) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Marge (%) :</span>
                      <span class="font-medium text-blue-600 ml-2">{{ lot.profitMargin }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Résumé global</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900">{{ lots.length }}</p>
              <p class="text-xs text-gray-500">Nombre de lots</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(totalSupplierCost) }}</p>
              <p class="text-xs text-gray-500">Coût fournisseur total</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(totalSellingPrice) }}</p>
              <p class="text-xs text-gray-500">Prix de vente total</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="text-center">
              <p class="text-sm font-medium text-green-600">{{ formatCurrency(totalProfit) }}</p>
              <p class="text-xs text-gray-500">Bénéfice total</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <button
          @click="navigateTo(`/offers/${offerId}/documents-availability`)"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Retour aux documents
        </button>
        
        <div class="flex space-x-3">
          <button
            @click="saveLotsConfiguration"
            type="button"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Sauvegarder la configuration
          </button>
          
          <button
            v-if="lots.length > 0"
            @click="proceedToSubmission"
            type="button"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Procéder à la soumission
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from '#app';

const router = useRouter();
const navigateTo = useRouter().push;

// Route params
const route = useRoute();
const offerId = route.params.id as string;

// State
const isLoading = ref(false);

// Mock offer data
const offerData = reactive({
  id: '',
  number: '',
  title: '',
  description: '',
  submission_deadline: '',
  estimated_budget: 0,
  status: ''
});

// Lots configuration
const lots = ref([
  {
    designation: 'Fourniture de matériel informatique',
    quantity: 1,
    characteristics: 'Ordinateurs portables, écrans, imprimantes et accessoires informatiques',
    supplierPrice: 15000,
    transportCost: 500,
    customsCost: 300,
    sellingPrice: 20000,
    totalCost: 0,
    profit: 0,
    profitMargin: 0
  }
]);

// Computed properties
const totalSupplierCost = computed(() => {
  return lots.value.reduce((total, lot) => total + (lot.supplierPrice || 0), 0);
});

const totalSellingPrice = computed(() => {
  return lots.value.reduce((total, lot) => total + (lot.sellingPrice || 0), 0);
});

const totalProfit = computed(() => {
  return lots.value.reduce((total, lot) => total + (lot.profit || 0), 0);
});

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount);
};

const loadOfferData = async () => {
  try {
    isLoading.value = true;
    // Mock data pour l'exemple
    Object.assign(offerData, {
      id: offerId,
      number: 'AO-2024-001',
      title: 'Fourniture de matériel informatique',
      description: 'Fourniture de matériel informatique pour l\'administration',
      submission_deadline: '2024-12-31T23:59:59',
      estimated_budget: 50000,
      status: 'active'
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error);
  } finally {
    isLoading.value = false;
  }
};

const addNewLot = () => {
  lots.value.push({
    designation: '',
    quantity: 1,
    characteristics: '',
    supplierPrice: 0,
    transportCost: 0,
    customsCost: 0,
    sellingPrice: 0,
    totalCost: 0,
    profit: 0,
    profitMargin: 0
  });
};

const removeLot = (index: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
    lots.value.splice(index, 1);
  }
};

const calculateLotTotals = (index: number) => {
  const lot = lots.value[index];
  
  if (!lot) return;
  
  // Calculer le coût total
  lot.totalCost = (lot.supplierPrice || 0) + (lot.transportCost || 0) + (lot.customsCost || 0);
  
  // Calculer le bénéfice
  lot.profit = (lot.sellingPrice || 0) - lot.totalCost;
  
  // Calculer la marge
  if (lot.totalCost > 0) {
    lot.profitMargin = Math.round((lot.profit / lot.totalCost) * 100);
  } else {
    lot.profitMargin = 0;
  }
};

const saveLotsConfiguration = async () => {
  try {
    isLoading.value = true;
    
    const configurationData = {
      offerId: offerId,
      lots: lots.value,
      totalSupplierCost: totalSupplierCost.value,
      totalSellingPrice: totalSellingPrice.value,
      totalProfit: totalProfit.value,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Configuration des lots sauvegardée:', configurationData);
    // Ici vous pouvez ajouter la logique pour sauvegarder en base de données
    
    // Afficher un message de succès
    alert('Configuration des lots sauvegardée avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration:', error);
  } finally {
    isLoading.value = false;
  }
};

const proceedToSubmission = () => {
  // Rediriger vers la page de soumission finale
  navigateTo(`/offers/${offerId}/final-submission`);
};

onMounted(() => {
  loadOfferData();
  // Calculer les totaux initiaux
  lots.value.forEach((_, index) => calculateLotTotals(index));
});
</script>
