<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-100">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <button 
          @click="$router.go(-1)" 
          class="group flex items-center text-sky-600 hover:text-sky-800 transition-all duration-300 bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour à la liste
        </button>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-300 animate-spin" style="animation-delay: -0.5s; animation-duration: 1.5s;"></div>
        </div>
        <p class="mt-6 text-gray-600 text-lg">Chargement des détails...</p>
      </div>

      <div v-else-if="error" class="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-700 font-semibold">Erreur : {{ error }}</p>
        </div>
      </div>

      <div v-else-if="schedule" class="space-y-8">
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 p-8 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div class="space-y-3">
                <h1 class="text-3xl md:text-4xl font-bold tracking-tight">{{ schedule.invoice.reference }}</h1>
                <p class="text-xl text-sky-100 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  {{ schedule.invoice.order.client.name }}
                </p>
              </div>
              <div class="mt-6 md:mt-0">
                <span :class="statusBadgeClass" class="px-6 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                  {{ globalStatus }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 class="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div class="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  Informations client
                </h2>
                <div class="space-y-4">
                  <div class="bg-white p-4 rounded-lg border border-gray-100">
                    <p class="text-sm text-gray-500 mb-1">Nom complet</p>
                    <p class="font-semibold text-gray-800">{{ schedule.invoice.order.client.name }}</p>
                  </div>
                  <div class="bg-white p-4 rounded-lg border border-gray-100">
                    <p class="text-sm text-gray-500 mb-1">Email</p>
                    <p class="font-semibold text-sky-600">{{ schedule.invoice.order.client.email }}</p>
                  </div>
                  <div class="bg-white p-4 rounded-lg border border-gray-100">
                    <p class="text-sm text-gray-500 mb-1">Téléphone</p>
                    <p class="font-semibold text-gray-800">{{ schedule.invoice.order.client.phone }}</p>
                  </div>
                  <div class="bg-white p-4 rounded-lg border border-gray-100">
                    <p class="text-sm text-gray-500 mb-1">Adresse</p>
                    <p class="font-semibold text-gray-800 leading-relaxed">
                      {{ schedule.invoice.order.client.address }}<br>
                      {{ schedule.invoice.order.client.postal_code }} {{ schedule.invoice.order.client.city }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 shadow-sm">
                <h2 class="text-xl font-bold mb-6 flex items-center text-gray-800">
                  <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  Actions rapides
                </h2>
                <div class="space-y-4">
                  <button 
                    @click="openReminderModal"
                    class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Envoyer une relance
                  </button>
                 
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-8">
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div class="px-6 py-5 bg-gradient-to-r from-gray-50 to-sky-50 border-b border-gray-200">
                  <h2 class="text-xl font-bold flex items-center text-gray-800">
                    <div class="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    Échéancier de paiement
                  </h2>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Échéance</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Montant</th>
                        <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Statut</th>
                        <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                      <tr v-for="(installment, index) in parsedInstallments" :key="index" :class="installmentRowClass(installment)" class="transition-colors duration-200">
                        <td class="px-6 py-5 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                              <span class="text-sm font-bold text-sky-600">#{{ index + 1 }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap">
                          <div>
                            <p class="text-sm font-semibold text-gray-900">{{ formatDate(installment.date) }}</p>
                            <p v-if="isOverdue(installment) && !installment.paid" class="text-xs text-red-500 mt-1 font-medium">
                              <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              En retard de {{ daysOverdue(installment.date) }} jour(s)
                            </p>
                          </div>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-right">
                          <span class="text-lg font-bold text-gray-900">{{ formatCurrency(installment.amount) }}</span>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-center">
                          <span :class="installmentStatusClass(installment)" class="px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                            {{ installmentStatus(installment) }}
                          </span>
                        </td>
                        <td class="px-6 py-5 whitespace-nowrap text-center">
                          <button 
                            v-if="!installment.paid" 
                            @click="markAsPaid(index)"
                            class="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 p-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-110"
                            title="Marquer comme payé"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          </button>
                          <div v-else class="flex items-center justify-center">
                            <div class="bg-green-100 p-3 rounded-full">
                              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gradient-to-br from-sky-50 to-cyan-100 p-6 rounded-xl border border-sky-200 shadow-sm">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-sky-600 mb-1">Total facture</p>
                      <p class="text-2xl font-bold text-sky-800">{{ formatCurrency(schedule.invoice.total) }}</p>
                    </div>
                    <div class="w-12 h-12 bg-sky-200 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200 shadow-sm">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-green-600 mb-1">Montant payé</p>
                      <p class="text-2xl font-bold text-green-800">{{ formatCurrency(totalPaid) }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-xl border border-red-200 shadow-sm">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-red-600 mb-1">Reste à payer</p>
                      <p class="text-2xl font-bold text-red-800">{{ formatCurrency(remainingToPay) }}</p>
                    </div>
                    <div class="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div class="px-6 py-5 bg-gradient-to-r from-gray-50 to-orange-50 border-b border-gray-200">
                    <h2 class="text-xl font-bold flex items-center text-gray-800">
                      <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                        </svg>
                      </div>
                      Historique des relances
                    </h2>
                  </div>
                  <div v-if="reminders.length === 0" class="p-6 text-gray-500 italic text-center">
                    Aucune relance enregistrée.
                  </div>
                  <ul v-else class="divide-y divide-gray-100 p-4">
                    <li v-for="reminder in reminders" :key="reminder.id" class="py-4">
                      <div class="flex items-start">
                        <div class="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-4"></div>
                        <div>
                          <p class="font-semibold text-gray-900">{{ reminder.type }}</p>
                          <p class="text-sm text-gray-500 mt-1">{{ formatDateTime(reminder.date) }}</p>
                          <p class="text-gray-700 mt-2 italic border-l-2 pl-2 border-orange-200 text-sm whitespace-pre-wrap">{{ reminder.message }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div class="px-6 py-5 bg-gradient-to-r from-gray-50 to-green-50 border-b border-gray-200">
                    <h2 class="text-xl font-bold flex items-center text-gray-800">
                      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9v2m0 4h.01M12 9v2m0 4h.01M7 9v2m0 4h.01M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/>
                        </svg>
                      </div>
                      Historique des paiements
                    </h2>
                  </div>
                  <div v-if="paymentHistory.length === 0" class="p-6 text-gray-500 italic text-center">
                    Aucun paiement enregistré.
                  </div>
                  <ul v-else class="divide-y divide-gray-100 p-4">
                    <li v-for="payment in paymentHistory" :key="payment.id" class="py-4">
                      <div class="flex items-start justify-between">
                        <div class="flex items-center">
                          <div class="w-2 h-2 rounded-full bg-green-400 mt-2 mr-4"></div>
                          <div>
                            <p class="font-semibold text-gray-900">
                              <span class="text-green-600 font-bold">{{ formatCurrency(payment.amount) }}</span>
                              <span class="text-sm text-gray-500 ml-2">({{ payment.method }})</span>
                            </p>
                            <p class="text-sm text-gray-500 mt-1">{{ formatDateTime(payment.date) }}</p>
                          </div>
                        </div>
                        <p class="text-xs text-gray-400 italic">ID: {{ payment.id.toString().slice(-4) }}</p>
                      </div>
                      <p v-if="payment.description" class="text-sm text-gray-600 mt-2">{{ payment.description }}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        v-if="showPaymentModal"
        :installments="unpaidInstallments"
        @close="showPaymentModal = false"
        @submit="handlePaymentSubmit"
      />

      <ReminderModal
        v-if="showReminderModal"
        :schedule="schedule"
        :defaultMessage="reminderTemplate"
        @close="showReminderModal = false"
        @submit="handleReminderSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PaymentModal from '@/components/PaymentModal.vue'
import ReminderModal from '@/components/ReminderModal.vue'

const route = useRoute()
const { public: { apiBaseUrl } } = useRuntimeConfig()

// Data
const schedule = ref(null)
const loading = ref(true)
const error = ref(null)
const showPaymentModal = ref(false)
const showReminderModal = ref(false)
const reminders = ref([])
const paymentHistory = ref([])

const LOCAL_STORAGE_KEY = `schedule-${route.params.id}`

// Fonctions de gestion du Local Storage
const saveStateToLocalStorage = () => {
  if (schedule.value) {
    const state = {
      schedule: schedule.value,
      reminders: reminders.value,
      paymentHistory: paymentHistory.value
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  }
}

const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedState) {
    const state = JSON.parse(savedState)
    schedule.value = state.schedule
    reminders.value = state.reminders || []
    paymentHistory.value = state.paymentHistory || []
  }
}

// Fetch initial data, puis charger l'état local
onMounted(async () => {
  loadStateFromLocalStorage()
  
  if (!schedule.value) {
    try {
      const response = await fetch(`${apiBaseUrl}/schedules/${route.params.id}`)
      if (!response.ok) throw new Error('Échéancier non trouvé')
      
      const data = await response.json()
      schedule.value = data
      
      saveStateToLocalStorage()

    } catch (err) {
      error.value = err.message
      console.error("Erreur:", err)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

// Utiliser un watch pour surveiller les changements et sauvegarder automatiquement
watch([schedule, reminders, paymentHistory], saveStateToLocalStorage, { deep: true })

// Computed properties
const parsedInstallments = computed(() => {
  return schedule.value?.installments ? JSON.parse(schedule.value.installments) : []
})

const totalPaid = computed(() => {
  return parsedInstallments.value
    .filter(inst => inst.paid)
    .reduce((sum, inst) => sum + inst.amount, 0)
})

const remainingToPay = computed(() => {
  return (schedule.value?.invoice.total || 0) - totalPaid.value
})

const unpaidInstallments = computed(() => {
  return parsedInstallments.value
    .map((inst, index) => ({ ...inst, originalIndex: index }))
    .filter(inst => !inst.paid)
})

const globalStatus = computed(() => {
  const installments = parsedInstallments.value
  if (installments.length === 0) return 'Aucune échéance'
  if (installments.every(inst => inst.paid)) return 'Entièrement payé'
  if (installments.some(inst => isOverdue(inst) && !inst.paid)) return 'En retard'
  return 'En cours'
})

const statusBadgeClass = computed(() => {
  const statusClasses = {
    'Entièrement payé': 'bg-green-500 text-white border-2 border-green-300',
    'En retard': 'bg-red-500 text-white border-2 border-red-300',
    'En cours': 'bg-yellow-500 text-white border-2 border-yellow-300',
    'Aucune échéance': 'bg-gray-500 text-white border-2 border-gray-300'
  }
  return statusClasses[globalStatus.value] || 'bg-gray-500 text-white'
})

const reminderTemplate = computed(() => {
  if (!schedule.value) return ''
  return `Bonjour ${schedule.value.invoice.order.client.name},\n\n` +
         `Nous vous rappelons que votre paiement de ${formatCurrency(remainingToPay.value)} ` +
         `pour la facture ${schedule.value.invoice.reference} est en attente.\n\n` +
         `Merci de régulariser votre situation.\n\nCordialement`
})

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value || 0)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function isOverdue(installment) {
  return new Date(installment.date) < new Date() && !installment.paid
}

function daysOverdue(dateString) {
  const today = new Date()
  const dueDate = new Date(dateString)
  return Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
}

function installmentStatus(installment) {
  if (installment.paid) return 'Payé'
  if (isOverdue(installment)) return 'En retard'
  return 'À venir'
}

function installmentStatusClass(installment) {
  if (installment.paid) return 'bg-green-100 text-green-800 border border-green-200'
  if (isOverdue(installment)) return 'bg-red-100 text-red-800 border border-red-200'
  return 'bg-blue-100 text-blue-800 border border-blue-200'
}

function installmentRowClass(installment) {
  if (installment.paid) return 'bg-green-50 hover:bg-green-100'
  if (isOverdue(installment)) return 'bg-red-50 hover:bg-red-100'
  return 'hover:bg-gray-50'
}

function openPaymentModal() {
  showPaymentModal.value = true
}

function openReminderModal() {
  showReminderModal.value = true
}

function markAsPaid(index) {
  try {
    const installment = parsedInstallments.value[index]
    
    if (installment.paid) {
      showErrorMessage('Cette échéance est déjà marquée comme payée.')
      return
    }

    const confirmPayment = confirm(
      `Confirmer le paiement de ${formatCurrency(installment.amount)} pour l'échéance du ${formatDate(installment.date)} ?`
    )
    
    if (!confirmPayment) return

    const updatedInstallments = [...parsedInstallments.value]
    updatedInstallments[index].paid = true
    updatedInstallments[index].payment_date = new Date().toISOString().slice(0, 10)
    
    schedule.value.installments = JSON.stringify(updatedInstallments)

    paymentHistory.value.unshift({
      id: Date.now(),
      amount: installment.amount,
      date: new Date().toISOString(),
      method: 'Marqué manuellement',
      description: `Paiement pour l'échéance #${index + 1} de ${formatCurrency(installment.amount)}`
    })

    showSuccessMessage(`Paiement de ${formatCurrency(installment.amount)} marqué comme payé avec succès !`)

  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err)
    showErrorMessage(`Erreur lors de la mise à jour : ${err.message}`)
  }
}

function showSuccessMessage(message) {
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300'
  notification.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      ${message}
    </div>
  `
  document.body.appendChild(notification)
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 100)
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => document.body.removeChild(notification), 300)
  }, 3000)
}

function showErrorMessage(message) {
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300'
  notification.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      ${message}
    </div>
  `
  document.body.appendChild(notification)
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 100)
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => document.body.removeChild(notification), 300)
  }, 4000)
}

function handlePaymentSubmit(paymentData) {
  if (paymentData.installments && paymentData.installments.length > 0) {
    const updatedInstallments = [...parsedInstallments.value]
    let totalAmount = 0
    
    paymentData.installments.forEach(installmentData => {
      const index = installmentData.originalIndex
      const amount = updatedInstallments[index].amount
      updatedInstallments[index].paid = true
      updatedInstallments[index].payment_date = paymentData.date || new Date().toISOString().slice(0, 10)
      totalAmount += amount
    })
    
    schedule.value.installments = JSON.stringify(updatedInstallments)

    paymentHistory.value.unshift({
      id: Date.now(),
      amount: totalAmount,
      date: new Date().toISOString(),
      method: paymentData.method,
      description: `Paiement groupé pour ${paymentData.installments.length} échéance(s).`
    })

    showSuccessMessage(`${paymentData.installments.length} paiement(s) enregistré(s) avec succès !`)
  }
  
  showPaymentModal.value = false
}

function handleReminderSubmit(reminderData) {
  reminders.value.unshift({
    id: Date.now(),
    type: reminderData.type || 'Relance manuelle',
    message: reminderData.message,
    date: new Date().toISOString()
  })
  
  showReminderModal.value = false
  showSuccessMessage("Relance envoyée et enregistrée avec succès !")
}
</script>