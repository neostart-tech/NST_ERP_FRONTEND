<template>
  <main class="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto w-full overflow-hidden">
      <!-- En-tête -->
      <div class="relative mb-4">
				<div
					class="bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg shadow p-4 text-white overflow-hidden"
				>
					<!-- Motif de fond décoratif simplifié -->
					<div class="absolute inset-0 opacity-5">
						<div class="absolute -top-8 -right-8 w-20 h-20 bg-white rounded-full"></div>
					</div>
              <div>
                <h1 class="text-xl font-bold">Gestion des Échéances</h1>
                <p class="text-sky-100 text-sm mt-1">Suivez et relancez les paiements</p>
              </div>
            </div>
          </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Échéances totales</p>
              <!-- <p class="text-3xl font-bold text-sky-600">{{ stats.totalSchedules }}</p> -->
            </div>
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
          </div> 
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-600">Montant dû</p>
              <div class="flex items-baseline truncate">
                <span class="text-3xl font-bold text-emerald-600">{{ formatCurrency(stats.totalDue) }}</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center ml-2 flex-shrink-0">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Factures en retard</p>
              <p class="text-3xl font-bold text-amber-600">{{ stats.overdueInvoices }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Relances envoyées</p>
              <p class="text-3xl font-bold text-violet-600">{{ stats.totalReminders }}</p>
            </div>
            <div class="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- En-tête avec filtres -->
      <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Échéances à relancer</h2>
              <p class="text-sm text-gray-500 mt-1">Liste des paiements en attente</p>
            </div>

            <div class="relative flex-1 sm:max-w-xs">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:magnifying-glass" class="h-4 w-4 text-gray-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="Rechercher un client..."
              />
            </div>

            <select
              v-model="currentFilter"
              class="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 rounded-lg shadow-sm"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="En retard">En retard</option>
              <option value="Relancé">Relancé</option>
            </select>
          </div>
        </div>

        <!-- Vue tableau -->
        <div v-if="!gridView" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Facture</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Échéance</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Relances</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="schedule in filteredSchedules" :key="schedule.id" class="hover:bg-gray-50">
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ schedule.invoice?.order?.client?.name || 'N/A' }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ schedule.invoice?.reference || 'N/A' }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ nextDueDate(schedule) }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm">
                  <span :class="statusClass(schedule)" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ statusText(schedule) }}
                  </span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ schedule.reminders ? schedule.reminders.length : 0 }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm">
                  <NuxtLink :to="`/followup/${schedule.id}`" class="text-sky-600 hover:text-sky-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="filteredSchedules.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                  Aucune échéance trouvée
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


</main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useScheduleStore } from '#imports'

// Types de statuts
const STATUS = {
  PAID: 'Payé',
  OVERDUE: 'En retard',
  REMINDED: 'Relancé',
  UPCOMING: 'À venir'
}

// Filtres avancés
const filters = reactive({
  minAmount: null,
  maxAmount: null,
  startDate: '',
  endDate: ''
})

// État de l'interface
const gridView = ref(true)
const searchQuery = ref('')
const currentFilter = ref('Tous')
const showAdvancedFilters = ref(false)
const activeScheduleActions = ref(null)

// Suivre les clics en dehors du menu d'actions
const handleClickOutside = (event) => {
  if (activeScheduleActions.value && !event.target.closest('.schedule-actions')) {
    activeScheduleActions.value = null
  }
}

// Basculer l'affichage des actions d'une échéance
const toggleScheduleActions = (scheduleId) => {
  activeScheduleActions.value = activeScheduleActions.value === scheduleId ? null : scheduleId
}

// Réinitialiser tous les filtres
const resetFilters = () => {
  searchQuery.value = ''
  currentFilter.value = 'Tous'
  Object.keys(filters).forEach(key => {
    filters[key] = null
  })
}

  const calculateStats = () => {
    // Implémentation de la fonction calculateStats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    stats.value = {
      totalSchedules: paymentSchedules.length,
      totalDue: paymentSchedules.reduce((sum, s) => sum + s.amount, 0),
      overdueInvoices: paymentSchedules.filter(s => new Date(s.dueDate) < today).length,
      totalReminders: paymentSchedules.filter(s => s.reminderSent).length
    }
  }

const sendReminderEmail = async (schedule, installment) => {
  try {
    const emailData = {
      to: schedule.invoice?.order?.client?.email || '',
      subject: `Rappel de paiement - Facture ${schedule.invoice?.reference || ''}`,
      body: `Bonjour ${schedule.invoice?.order?.client?.name || 'Client'},<br><br>
            Un paiement de ${formatCurrency(installment.amount)} était dû le ${formatDate(installment.date)}.<br>
            Merci de régulariser cette situation au plus vite.`
    }
    console.log('Email envoyé:', emailData)
    return emailData
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    throw error
  }
}

const sendReminder = async (schedule) => {
  try {
    if (isFullyPaid(schedule)) {
      alert("Cette échéance est déjà entièrement payée.")
      return
    }

    if (!schedule.installments) return

    const installments = JSON.parse(schedule.installments)
    const next = installments.find(inst => !inst.paid)

    if (next) {
      await sendReminderEmail(schedule, next)

      if (!schedule.reminders) {
        schedule.reminders = []
      }
      schedule.reminders.push(new Date().toISOString())

      localStorage.setItem(`schedule-${schedule.id}`, JSON.stringify({
        schedule: { ...schedule, installments: JSON.stringify(installments) },
        reminders: schedule.reminders
      }))

      calculateStats()

      alert(`Rappel envoyé pour l'échéance du ${formatDate(next.date)}`)
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la relance:', error)
    alert('Une erreur est survenue lors de l\'envoi de la relance.')
  }
}
</script>
