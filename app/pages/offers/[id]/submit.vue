<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Page Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          Soumission complète - {{ offerData.title }}
        </h2>
        <button
          @click="navigateTo('/offers')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Retour
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div class="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-gray-900">Documents vérifiés</span>
          </div>
          <div class="h-1 w-8 bg-gray-300"></div>
          <div class="flex items-center">
            <div class="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
              <span class="text-white text-sm font-medium">2</span>
            </div>
            <span class="ml-2 text-sm font-medium text-gray-900">Soumission</span>
          </div>
        </div>
      </div>

      <!-- Document Upload Section -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Upload des documents</h3>
        <div class="space-y-4">
          <div v-for="(document, index) in documentsToUpload" :key="index" class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ document.name }}
                <span v-if="document.required" class="text-red-500 ml-1">*</span>
              </label>
              <span v-if="document.uploaded" class="text-green-600 text-sm font-medium">✓ Uploadé</span>
            </div>
            <p v-if="document.description" class="text-xs text-gray-500 mb-3">{{ document.description }}</p>
            
            <div v-if="!document.uploaded" class="space-y-2">
              <input
                type="file"
                :id="'file-' + index"
                @change="handleFileUpload($event, index)"
                :accept="document.accept"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p class="text-xs text-gray-500">Formats acceptés: {{ document.accept || 'Tous formats' }}</p>
            </div>
            
            <div v-if="document.uploaded" class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">{{ document.fileName }}</span>
              <button
                @click="removeFile(index)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Offer Section -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Offre technique</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Approche méthodologique
            </label>
            <textarea
              v-model="technicalOffer.methodology"
              rows="4"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Décrivez votre approche méthodologique..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Planning d'exécution
            </label>
            <textarea
              v-model="technicalOffer.schedule"
              rows="3"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Décrivez le planning d'exécution..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Équipe proposée
            </label>
            <textarea
              v-model="technicalOffer.team"
              rows="3"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Décrivez l'équipe proposée..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Financial Offer Section -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Offre financière</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Montant total HT
            </label>
            <input
              v-model.number="financialOffer.totalAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              TVA (%)
            </label>
            <input
              v-model.number="financialOffer.tva"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Montant total TTC
            </label>
            <input
              :value="totalTTC"
              type="text"
              readonly
              class="w-full rounded-md px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Délai de paiement
            </label>
            <input
              v-model="financialOffer.paymentTerms"
              type="text"
              class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: 30 jours"
            />
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Conditions financières
          </label>
          <textarea
            v-model="financialOffer.conditions"
            rows="3"
            class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Décrivez les conditions financières..."
          ></textarea>
        </div>
      </div>

      <!-- Validation Summary -->
      <div class="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Récapitulatif de la soumission</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-700">Documents uploadés:</span>
            <span class="text-sm font-medium text-gray-900">{{ uploadedDocumentsCount }}/{{ requiredDocumentsCount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-700">Offre technique:</span>
            <span class="text-sm font-medium text-gray-900">{{ isTechnicalOfferComplete ? 'Complète' : 'Incomplète' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-700">Offre financière:</span>
            <span class="text-sm font-medium text-gray-900">{{ isFinancialOfferComplete ? 'Complète' : 'Incomplète' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-700">Montant total:</span>
            <span class="text-sm font-medium text-gray-900">{{ formatCurrency(totalTTC) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <button
          @click="navigateTo(`/offers/${offerId}/submission`)"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Retour
        </button>
        
        <div class="flex space-x-3">
          <button
            @click="saveDraft"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Enregistrer brouillon
          </button>
          
          <button
            @click="submitOffer"
            :disabled="!canSubmit || isLoading"
            type="button"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Soumission...
            </span>
            <span v-else>
              Soumettre l'offre
            </span>
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
const offerData = reactive({
  id: '',
  title: '',
  number: '',
  submission_deadline: '',
  estimated_budget: 0
});

// Documents to upload
const documentsToUpload = ref([
  {
    name: 'Attestation de conformité fiscale',
    description: 'Attestation de conformité fiscale délivrée par l\'administration fiscale',
    required: true,
    uploaded: false,
    fileName: '',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    name: 'Attestation de conformité sociale',
    description: 'Attestation de conformité sociale délivrée par la CNSS',
    required: true,
    uploaded: false,
    fileName: '',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    name: 'Extrait Kbis ou équivalent',
    description: 'Extrait Kbis ou document équivalent de moins de 3 mois',
    required: true,
    uploaded: false,
    fileName: '',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    name: 'Certificat de qualification',
    description: 'Certificat de qualification professionnelle dans le domaine concerné',
    required: true,
    uploaded: false,
    fileName: '',
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  {
    name: 'Offre technique détaillée',
    description: 'Document détaillant l\'approche technique et méthodologique',
    required: true,
    uploaded: false,
    fileName: '',
    accept: '.pdf,.doc,.docx'
  },
  {
    name: 'Offre financière détaillée',
    description: 'Document détaillant le prix et les conditions financières',
    required: true,
    uploaded: false,
    fileName: '',
    accept: '.pdf,.doc,.docx,.xls,.xlsx'
  }
]);

// Technical offer
const technicalOffer = reactive({
  methodology: '',
  schedule: '',
  team: ''
});

// Financial offer
const financialOffer = reactive({
  totalAmount: 0,
  tva: 20,
  paymentTerms: '',
  conditions: ''
});

// Computed properties
const totalTTC = computed(() => {
  const tvaAmount = (financialOffer.totalAmount * financialOffer.tva) / 100;
  return financialOffer.totalAmount + tvaAmount;
});

const uploadedDocumentsCount = computed(() => {
  return documentsToUpload.value.filter(doc => doc.uploaded).length;
});

const requiredDocumentsCount = computed(() => {
  return documentsToUpload.value.filter(doc => doc.required).length;
});

const isTechnicalOfferComplete = computed(() => {
  return technicalOffer.methodology && technicalOffer.schedule && technicalOffer.team;
});

const isFinancialOfferComplete = computed(() => {
  return financialOffer.totalAmount > 0 && financialOffer.paymentTerms;
});

const canSubmit = computed(() => {
  return uploadedDocumentsCount.value >= requiredDocumentsCount.value &&
         isTechnicalOfferComplete.value &&
         isFinancialOfferComplete.value;
});

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

const handleFileUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    documentsToUpload.value[index].uploaded = true;
    documentsToUpload.value[index].fileName = file.name;
  }
};

const removeFile = (index: number) => {
  documentsToUpload.value[index].uploaded = false;
  documentsToUpload.value[index].fileName = '';
};

const loadOfferData = async () => {
  try {
    // Mock data
    Object.assign(offerData, {
      id: offerId,
      title: 'Fourniture de matériel informatique',
      number: 'AO-2024-001',
      submission_deadline: '2024-12-31T23:59:59',
      estimated_budget: 50000
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error);
  }
};

const saveDraft = async () => {
  try {
    isLoading.value = true;
    
    const draftData = {
      offerId: offerId,
      technicalOffer: { ...technicalOffer },
      financialOffer: { ...financialOffer },
      documents: documentsToUpload.value.filter(doc => doc.uploaded).map(doc => ({
        name: doc.name,
        fileName: doc.fileName
      }))
    };
    
    console.log('Brouillon sauvegardé:', draftData);
    // Ici vous devriez sauvegarder le brouillon via votre API
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du brouillon:', error);
  } finally {
    isLoading.value = false;
  }
};

const submitOffer = async () => {
  try {
    isLoading.value = true;
    
    const submissionData = {
      offerId: offerId,
      technicalOffer: { ...technicalOffer },
      financialOffer: { ...financialOffer },
      documents: documentsToUpload.value.filter(doc => doc.uploaded).map(doc => ({
        name: doc.name,
        fileName: doc.fileName
      })),
      submittedAt: new Date().toISOString()
    };
    
    console.log('Offre soumise:', submissionData);
    // Ici vous devriez soumettre l'offre via votre API
    
    // Redirection vers la page de confirmation
    navigateTo(`/offers/${offerId}/confirmation`);
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadOfferData();
});
</script>


