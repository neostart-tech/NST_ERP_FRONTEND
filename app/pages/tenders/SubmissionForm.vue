<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-[#00000067] bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ submission ? 'Modifier la soumission' : 'Nouvelle soumission' }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body with Tabs -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 bg-gray-50">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              ]"
            >
              {{ tab.name }}
              <span v-if="tab.required && !isTabValid(tab.id)" class="ml-1 text-red-500"> * </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- General Tab -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <!-- Tender Selection -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Appel d'offres</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner l'appel d'offres *
                </label>
                <select
                  v-model="formData.tenderId"
                  required
                  :disabled="!!submission"
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Choisir un appel d'offres</option>
                  <option v-for="tender in availableTenders" :key="tender.id" :value="tender.id">
                    {{ tender.reference }} - {{ tender.title }}
                  </option>
                </select>
                <p v-if="submission" class="mt-1 text-xs text-gray-500">
                  L'appel d'offres ne peut pas être modifié après création
                </p>
              </div>
            </div>

            <!-- Submission Status -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Statut de la soumission</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Statut actuel
                  </label>
                  <select
                    v-model="submissionStatus"
                    class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="ready">Prêt à soumettre</option>
                    <option value="submitted">Soumis</option>
                    <option value="acknowledged">Accusé réception</option>
                    <option value="under_review">En évaluation</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date de soumission
                  </label>
                  <input
                    v-model="submissionDate"
                    type="datetime-local"
                    class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>

            <!-- Validity Period -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Période de validité (jours) *
              </label>
              <input
                v-model="formData.validityPeriod"
                type="number"
                min="1"
                max="365"
                required
                class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="30"
              />
              <p class="mt-1 text-xs text-gray-500">
                Durée pendant laquelle notre offre reste valable
              </p>
            </div>
          </div>

          <!-- Technical Tab -->
          <div v-if="activeTab === 'technical'" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Offre technique *
              </label>
              <textarea
                v-model="formData.technicalOffer"
                rows="12"
                required
                class="w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Décrivez votre solution technique en détail..."
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">
                Détaillez votre approche technique, méthodologie, technologies utilisées...
              </p>
            </div>

            <!-- Guarantees -->
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Garanties offertes</h4>
              <div class="space-y-3">
                <div
                  v-for="(guarantee, index) in formData.guarantees"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="formData.guarantees[index]"
                    type="text"
                    class="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Ex: Garantie 2 ans sur site"
                  />
                  <button
                    @click="removeGuarantee(index)"
                    type="button"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addGuarantee"
                  type="button"
                  class="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Ajouter une garantie
                </button>
              </div>
            </div>
          </div>

          <!-- Financial Tab -->
          <div v-if="activeTab === 'financial'" class="space-y-6">
            <!-- Total Amount -->
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Montant total</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Montant total (€) *
                  </label>
                  <input
                    v-model="formData.financialOffer.totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    @input="calculateTotal"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> TVA incluse </label>
                  <select
                    v-model="formData.financialOffer.taxIncluded"
                    class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option :value="false">HT (Hors Taxe)</option>
                    <option :value="true">TTC (Toutes Taxes Comprises)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Cost Breakdown -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Détail des coûts</h4>
              <div class="space-y-3">
                <div
                  v-for="(item, index) in formData.costBreakdown"
                  :key="index"
                  class="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg"
                >
                  <div class="col-span-3">
                    <input
                      v-model="item.category"
                      type="text"
                      placeholder="Catégorie"
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div class="col-span-3">
                    <input
                      v-model="item.description"
                      type="text"
                      placeholder="Description"
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div class="col-span-2">
                    <input
                      v-model="item.quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Qté"
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      @input="calculateLineTotal(index)"
                    />
                  </div>
                  <div class="col-span-2">
                    <input
                      v-model="item.unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Prix unitaire"
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      @input="calculateLineTotal(index)"
                    />
                  </div>
                  <div class="col-span-1">
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatCurrency(item.totalPrice) }}
                    </span>
                  </div>
                  <div class="col-span-1">
                    <button
                      @click="removeCostItem(index)"
                      type="button"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  @click="addCostItem"
                  type="button"
                  class="w-full px-4 py-2 border border-dashed border-blue-300 rounded-lg text-sm text-blue-600 hover:text-blue-800 hover:border-blue-400"
                >
                  + Ajouter une ligne
                </button>
              </div>
            </div>

            <!-- Payment Terms -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Conditions de paiement *
              </label>
              <select
                v-model="formData.financialOffer.paymentTerms"
                class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Sélectionner des conditions</option>
                <option value="Paiement à 30 jours">Paiement à 30 jours</option>
                <option value="50% à la commande, 50% à la livraison">
                  50% à la commande, 50% à la livraison
                </option>
                <option value="30% à la signature, 40% à la livraison, 30% après recette">
                  30% à la signature, 40% à la livraison, 30% après recette
                </option>
                <option value="Paiement comptant">Paiement comptant</option>
                <option value="Autres conditions">Autres conditions</option>
              </select>
            </div>
          </div>

          <!-- Planning Tab -->
          <div v-if="activeTab === 'planning'" class="space-y-6">
            <!-- Delivery Duration -->
            <div class="bg-purple-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Délai de livraison</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Durée totale (jours) *
                  </label>
                  <input
                    v-model="formData.deliveryPlan.totalDuration"
                    type="number"
                    min="1"
                    required
                    class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date de début prévue
                  </label>
                  <input
                    v-model="plannedStartDate"
                    type="date"
                    class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <!-- Phases (simplified for this example) -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Phases du projet</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-4">
                  Décrivez les principales phases de votre projet :
                </p>
                <textarea
                  v-model="projectPhases"
                  rows="6"
                  class="w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ex:
Phase 1 (30 jours): Analyse et conception
Phase 2 (60 jours): Développement
Phase 3 (20 jours): Tests et recette
Phase 4 (10 jours): Mise en production"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Team Tab -->
          <div v-if="activeTab === 'team'" class="space-y-6">
            <div class="bg-indigo-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-4">Équipe assignée</h4>
              <div class="space-y-4">
                <div
                  v-for="(member, index) in formData.team"
                  :key="index"
                  class="grid grid-cols-12 gap-3 items-center bg-white p-4 rounded-lg"
                >
                  <div class="col-span-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      v-model="member.name"
                      type="text"
                      required
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Nom complet"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Rôle *</label>
                    <input
                      v-model="member.role"
                      type="text"
                      required
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ex: Chef de projet"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Expérience</label>
                    <input
                      v-model="member.experience"
                      type="text"
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ex: 5 ans"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >Allocation (%)</label
                    >
                    <input
                      v-model="member.allocation"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full text-sm  px-3 py-2 border rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="50"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Compétences</label>
                    <input
                      v-model="member.skillsText"
                      type="text"
                      class="w-full text-sm px-3 py-2 border rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Vue.js, Node.js"
                    />
                  </div>
                  <div class="col-span-1">
                    <button
                      @click="removeTeamMember(index)"
                      type="button"
                      class="mt-5 text-red-500 hover:text-red-700"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  @click="addTeamMember"
                  type="button"
                  class="w-full px-4 py-2 border border-dashed border-indigo-300 rounded-lg text-sm text-indigo-600 hover:text-indigo-800 hover:border-indigo-400"
                >
                  + Ajouter un membre d'équipe
                </button>
              </div>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Veuillez corriger les erreurs suivantes :
                </h3>
                <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
        <div class="flex space-x-3">
          <button
            @click="$emit('close')"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="saveDraft"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Enregistrer brouillon
          </button>
        </div>
        <button
          @click="handleSubmit"
          :disabled="isLoading"
          type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enregistrement...
          </span>
          <span v-else>
            {{ submission ? 'Mettre à jour' : 'Créer la soumission' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useTendersStore } from '@/stores/tenders'
import type {
  TenderSubmission,
  SubmissionFormData,
  TeamAssignment,
  CostBreakdown,
} from '@/types/tenders'

// Props and Emits
interface Props {
  submission?: TenderSubmission | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: SubmissionFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tendersStore = useTendersStore()

// State
const activeTab = ref('general')
const isLoading = ref(false)
const errors = ref<string[]>([])

// Form data
const formData = reactive<SubmissionFormData>({
  tenderId: '',
  technicalOffer: '',
  financialOffer: {
    totalAmount: 0,
    paymentTerms: '',
    currency: 'EUR',
    taxIncluded: false,
  },
  costBreakdown: [{ category: '', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
  deliveryPlan: {
    totalDuration: 90,
  },
  team: [
    { id: '', role: '', name: '', experience: '', allocation: 100, skills: [], skillsText: '' },
  ],
  guarantees: [''],
  validityPeriod: 30,
})

// Additional form fields
const submissionStatus = ref('draft')
const submissionDate = ref('')
const plannedStartDate = ref('')
const projectPhases = ref('')

// Tab configuration
const tabs = [
  { id: 'general', name: 'Général', required: true },
  { id: 'technical', name: 'Technique', required: true },
  { id: 'financial', name: 'Financier', required: true },
  { id: 'planning', name: 'Planning', required: true },
  { id: 'team', name: 'Équipe', required: true },
]

// Computed
const availableTenders = computed(() =>
  tendersStore.tenders.filter(
    (t) => ['draft', 'active'].includes(t.status) || t.id === props.submission?.tenderId,
  ),
)

// Initialize form data
onMounted(() => {
  if (props.submission) {
    // Load existing submission data
    formData.tenderId = props.submission.tenderId
    formData.technicalOffer = props.submission.proposal.technicalOffer
    formData.financialOffer = { ...props.submission.proposal.financialOffer }
    formData.deliveryPlan = { ...props.submission.proposal.deliveryPlan }
    formData.team = props.submission.proposal.team.map((member) => ({
      ...member,
      skillsText: member.skills.join(', '),
    }))
    formData.guarantees = [...props.submission.proposal.guarantees]
    formData.validityPeriod = props.submission.proposal.validityPeriod

    submissionStatus.value = props.submission.status
    submissionDate.value = formatDateTimeLocal(props.submission.submittedAt)
  }
})

// Methods
const isTabValid = (tabId: string): boolean => {
  switch (tabId) {
    case 'general':
      return !!(formData.tenderId && formData.validityPeriod)
    case 'technical':
      return !!formData.technicalOffer.trim()
    case 'financial':
      return !!(formData.financialOffer.totalAmount && formData.financialOffer.paymentTerms)
    case 'planning':
      return !!formData.deliveryPlan.totalDuration
    case 'team':
      return formData.team.some((member) => member.name.trim() && member.role.trim())
    default:
      return true
  }
}

const addCostItem = () => {
  formData.costBreakdown.push({
    category: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  })
}

const removeCostItem = (index: number) => {
  if (formData.costBreakdown.length > 1) {
    formData.costBreakdown.splice(index, 1)
    calculateTotal()
  }
}

const calculateLineTotal = (index: number) => {
  const item = formData.costBreakdown[index]
  item.totalPrice = item.quantity * item.unitPrice
  calculateTotal()
}

const calculateTotal = () => {
  const total = formData.costBreakdown.reduce((sum, item) => sum + item.totalPrice, 0)
  formData.financialOffer.totalAmount = total
}

const addTeamMember = () => {
  formData.team.push({
    id: `MEMBER-${Date.now()}`,
    role: '',
    name: '',
    experience: '',
    allocation: 100,
    skills: [],
    skillsText: '',
  })
}

const removeTeamMember = (index: number) => {
  if (formData.team.length > 1) {
    formData.team.splice(index, 1)
  }
}

const addGuarantee = () => {
  formData.guarantees.push('')
}

const removeGuarantee = (index: number) => {
  if (formData.guarantees.length > 1) {
    formData.guarantees.splice(index, 1)
  }
}

const validateForm = (): boolean => {
  errors.value = []

  if (!formData.tenderId) {
    errors.value.push("L'appel d'offres est obligatoire")
  }

  if (!formData.technicalOffer.trim()) {
    errors.value.push("L'offre technique est obligatoire")
  }

  if (!formData.financialOffer.totalAmount || formData.financialOffer.totalAmount <= 0) {
    errors.value.push('Le montant total doit être supérieur à 0')
  }

  if (!formData.financialOffer.paymentTerms) {
    errors.value.push('Les conditions de paiement sont obligatoires')
  }

  if (!formData.deliveryPlan.totalDuration || formData.deliveryPlan.totalDuration <= 0) {
    errors.value.push('La durée de livraison doit être supérieure à 0')
  }

  if (!formData.team.some((member) => member.name.trim() && member.role.trim())) {
    errors.value.push("Au moins un membre d'équipe avec nom et rôle est obligatoire")
  }

  if (!formData.validityPeriod || formData.validityPeriod <= 0) {
    errors.value.push('La période de validité doit être supérieure à 0')
  }

  // Clean up empty guarantees
  formData.guarantees = formData.guarantees.filter((g) => g.trim() !== '')
  if (formData.guarantees.length === 0) {
    formData.guarantees = ['']
  }

  return errors.value.length === 0
}

const prepareSubmissionData = (): SubmissionFormData => {
  // Process team skills
  const processedTeam = formData.team
    .filter((member) => member.name.trim() && member.role.trim())
    .map((member) => ({
      ...member,
      skills: member.skillsText
        ? member.skillsText
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
    }))

  return {
    ...formData,
    team: processedTeam,
    guarantees: formData.guarantees.filter((g) => g.trim() !== ''),
  }
}

const saveDraft = async () => {
  // Save as draft without full validation
  isLoading.value = true

  try {
    const data = prepareSubmissionData()
    emit('save', data)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const data = prepareSubmissionData()
    emit('save', data)
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    errors.value.push("Une erreur est survenue lors de l'enregistrement")
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}
</script>
