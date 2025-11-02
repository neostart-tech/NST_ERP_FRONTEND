<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Envoyer une relance</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type de relance</label>
            <select v-model="reminderType" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Email</option>
             
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea v-model="message" rows="5" class="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button 
            @click="submitReminder" 
            class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            :disabled="sending"
          >
            <span v-if="sending">Envoi en cours...</span>
            <span v-else>Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'submit'])

/** --- États internes --- **/
const sending = ref(false)       // <- ICI : défini pour l'utiliser dans le template
const errorMessage = ref(null)
const message = ref('')          // contenu du textarea

/** --- Props --- **/
const props = defineProps({
  schedule: {
    type: Object,
    required: true,
    default: () => ({
      invoice: {
        order: {
          client: { name: '', email: '' },
          company: { name: '' }
        },
        reference: ''
      },
      installments: '[]'
    }),
    validator: (value) => {
      return !!value?.invoice?.order?.client
    }
  },
  defaultMessage: {
    type: String,
    default: ''
  }
})

/** --- Données calculées --- **/
const clientData = computed(() => ({
  email: props.schedule.invoice.order.client.email || 'non-défini',
  name: props.schedule.invoice.order.client.name || 'Client inconnu',
  company: props.schedule.invoice.order.company?.name || 'Notre entreprise'
}))

const installmentData = computed(() => {
  try {
    const installments = JSON.parse(props.schedule.installments || '[]')
    return installments.find(inst => !inst.paid) || installments[0] || null
  } catch {
    return null
  }
})

const formattedDueDate = computed(() => 
  installmentData.value?.date 
    ? new Date(installmentData.value.date).toLocaleDateString('fr-FR') 
    : 'date inconnue'
)

const formattedAmount = computed(() =>
  installmentData.value?.amount 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' })
        .format(installmentData.value.amount) 
    : 'montant inconnu'
)

/** --- Initialisation du message --- **/
if (props.defaultMessage) {
  message.value = props.defaultMessage
} else {
  message.value = `Bonjour ${clientData.value.name},

Nous vous rappelons que votre paiement de ${formattedAmount.value} pour la facture ${props.schedule.invoice.reference} était dû le ${formattedDueDate.value}.

Merci de régulariser votre situation.

Cordialement,
${clientData.value.company}`
}

/** --- Action d'envoi --- **/

const submitReminder = async () => {
  errorMessage.value = null
  sending.value = true

  try {
    if (!installmentData.value) {
      throw new Error("Aucun paiement trouvé dans l'échéancier")
    }

    // Prépare le payload conforme au backend
    const payload = {
      client_email: clientData.value.email,
      client_name: clientData.value.name,
      amount: installmentData.value.amount,
      due_date: installmentData.value.date,
      reference: props.schedule.invoice.reference
    }

    await $fetch('http://127.0.0.1:8000/api/send-payment-reminder', {
      method: 'POST',
      body: payload,
      timeout: 10000
    })

    emit('submit', {
      type: 'email',
      date: new Date().toISOString(),
      status: 'sent'
    })

    alert('✅ Relance envoyée avec succès')

  } catch (error) {
    errorMessage.value = `Échec de l'envoi : ${error.response?.data?.message || error.message}`
    console.error('[ERREUR]', { error, schedule: props.schedule })
  } finally {
    sending.value = false
  }
}

</script>
