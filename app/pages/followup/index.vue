<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 class="text-3xl font-bold mb-2">Gestion des Échéances</h1>
                <p class="text-red-100 text-lg">Suivez et relancez les paiements</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Échéances totales</p>
              <p class="text-3xl font-bold text-indigo-600">{{ stats.totalSchedules }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span class="text-2xl font-bold text-blue-600 truncate">{{ formatCurrency(stats.totalDue) }}</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center ml-2 flex-shrink-0">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Factures en retard</p>
              <p class="text-3xl font-bold text-red-600">{{ stats.overdueInvoices }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Relances envoyées</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.totalReminders }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div class="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Échéances à relancer</h2>
          <div class="flex items-center space-x-2">
            <label for="status-filter" class="text-sm font-medium text-gray-700">Filtrer par statut :</label>
            <select id="status-filter" v-model="currentFilter" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
              <option value="Tous">Tous les statuts</option>
              <option value="Payé">Payé</option>
              <option value="Retard">En retard</option>
              <option value="Relancé">Relancé</option>
              <option value="À venir">À venir</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
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
                  {{ schedule.invoice.order.client.name }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ schedule.invoice.reference }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ nextDueDate(schedule) }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  {{ formatCurrency(nextDueAmount(schedule)) }}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useScheduleStore } from '#imports'

const scheduleStore = useScheduleStore()
const schedules = ref([])
const currentFilter = ref('Tous')

const stats = reactive({
  totalSchedules: 0,
  totalDue: 0,
  overdueInvoices: 0,
  totalReminders: 0
})

const updatedSchedules = computed(() => {
  return schedules.value.map(schedule => {
    const savedState = localStorage.getItem(`schedule-${schedule.id}`)
    if (savedState) {
      const state = JSON.parse(savedState)
      return {
        ...schedule,
        installments: state.schedule.installments,
        reminders: state.reminders || []
      }
    }
    return schedule
  })
})

const filteredSchedules = computed(() => {
  if (currentFilter.value === 'Tous') {
    return updatedSchedules.value
  }
  return updatedSchedules.value.filter(schedule => {
    const status = statusText(schedule)
    return status.includes(currentFilter.value)
  })
})

onMounted(async () => {
  await scheduleStore.fetchSchedule()
  schedules.value = scheduleStore.echeancier
  calculateStats()
})

const calculateStats = () => {
  let totalDue = 0
  let overdueCount = 0
  let totalReminders = 0
  
  updatedSchedules.value.forEach(schedule => {
    if (!schedule.installments) return;
    
    const installments = JSON.parse(schedule.installments)
    let hasOverdue = false
    
    installments.forEach(inst => {
      if (!inst.paid) {
        totalDue += inst.amount
        
        const dueDate = new Date(inst.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (dueDate < today) {
          hasOverdue = true
        }
      }
    })
    
    if (hasOverdue) {
      overdueCount++
    }
    
    if (schedule.reminders && Array.isArray(schedule.reminders)) {
      totalReminders += schedule.reminders.length
    }
  })

  stats.totalSchedules = updatedSchedules.value.length
  stats.totalDue = totalDue
  stats.overdueInvoices = overdueCount
  stats.totalReminders = totalReminders
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const nextDueDate = (schedule) => {
  const installments = JSON.parse(schedule.installments)
  const next = installments.find(inst => !inst.paid)
  return next ? formatDate(next.date) : 'Payé'
}

const nextDueAmount = (schedule) => {
  const installments = JSON.parse(schedule.installments)
  const next = installments.find(inst => !inst.paid)
  return next ? next.amount : 0
}

const isFullyPaid = (schedule) => {
  const installments = JSON.parse(schedule.installments)
  return installments.every(inst => inst.paid)
}

const statusText = (schedule) => {
  const installments = JSON.parse(schedule.installments)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const isPaid = installments.every(inst => inst.paid)
  if (isPaid) return 'Payé'
  
  const firstUnpaid = installments.find(inst => !inst.paid)
  if (firstUnpaid) {
    const dueDate = new Date(firstUnpaid.date)
    dueDate.setHours(0, 0, 0, 0)
    
    if (dueDate < today) {
      const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
      return `Retard (${daysLate}j)`
    }
  }
  
  if (schedule.reminders && schedule.reminders.length > 0) {
    return 'Relancé'
  }
  
  return 'À venir'
}

const statusClass = (schedule) => {
  const status = statusText(schedule)
  if (status.includes('Retard')) return 'bg-red-100 text-red-800'
  if (status === 'Payé') return 'bg-green-100 text-green-800'
  if (status === 'Relancé') return 'bg-orange-100 text-orange-800'
  return 'bg-yellow-100 text-yellow-800'
}

const checkPaymentSchedules = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let emailsSent = 0
  
  for (const schedule of updatedSchedules.value) {
    if (!schedule.installments) continue;
    
    const installments = JSON.parse(schedule.installments)
    
    for (const inst of installments) {
      if (!inst.paid) {
        const dueDate = new Date(inst.date)
        dueDate.setHours(0, 0, 0, 0)
        
        if (dueDate <= today) {
          await sendReminderEmail(schedule, inst)
          emailsSent++
          
          if (!schedule.reminders) {
            schedule.reminders = []
          }
          schedule.reminders.push(new Date().toISOString())
          
          localStorage.setItem(`schedule-${schedule.id}`, JSON.stringify({
            schedule: { ...schedule, installments: JSON.stringify(installments) },
            reminders: schedule.reminders
          }))
        }
      }
    }
  }
  
  calculateStats()
  
  alert(emailsSent > 0 ? `${emailsSent} rappel(s) envoyé(s)` : "Aucune échéance à relancer aujourd'hui")
}

const sendReminderEmail = async (schedule, installment) => {
  const emailData = {
    to: schedule.invoice.order.client.email,
    subject: `Rappel de paiement - Facture ${schedule.invoice.reference}`,
    body: `Bonjour ${schedule.invoice.order.client.name},<br><br>
          Un paiement de ${formatCurrency(installment.amount)} était dû le ${formatDate(installment.date)}.<br>
          Merci de régulariser cette situation au plus vite.`
  }
  
  console.log('Email envoyé:', emailData)
}

const sendReminder = async (schedule) => {
  if (isFullyPaid(schedule)) {
    alert("Cette échéance est déjà entièrement payée.")
    return
  }
  
  if (!schedule.installments) return;
  
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
}
</script>