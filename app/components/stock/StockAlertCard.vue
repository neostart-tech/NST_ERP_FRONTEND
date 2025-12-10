<template>
    <div :class="cardClasses" class="p-6 rounded-lg shadow-md flex items-center justify-between mb-4">
        <div>
            <h3 :class="titleClasses" class="text-xl font-semibold mb-2">{{ alert.type }} : {{ alert.productName }}</h3>
            <p :class="textClasses" class="text-md">Stock : {{ alert.currentStock }} | Seuil : {{ alert.minStockAlert }}</p>
        </div>
        <button
            @click="commanderProduit(alert.productId)"
            :class="buttonClasses"
            class="font-bold py-2 px-4 rounded-full transition duration-200 transform hover:scale-105"
        >
            Commander
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    alert: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                typeof value.id === 'number' &&
                typeof value.type === 'string' && // 'Rupture', 'Alerte', 'Info'
                typeof value.productName === 'string' &&
                typeof value.currentStock === 'number' &&
                typeof value.minStockAlert === 'number' &&
                typeof value.productId === 'number'
            );
        },
    },
});

// Définir les classes Tailwind en fonction du type d'alerte
const cardClasses = computed(() => {
    switch (props.alert.type) {
        case 'Rupture':
            return 'bg-red-100 border-l-4 border-red-500';
        case 'Alerte':
            return 'bg-yellow-100 border-l-4 border-yellow-500';
        case 'Info':
            return 'bg-green-100 border-l-4 border-green-500';
        default:
            return 'bg-gray-100 border-l-4 border-gray-400';
    }
});

const titleClasses = computed(() => {
    switch (props.alert.type) {
        case 'Rupture':
            return 'text-red-800';
        case 'Alerte':
            return 'text-yellow-800';
        case 'Info':
            return 'text-green-800';
        default:
            return 'text-gray-800';
    }
});

const textClasses = computed(() => {
    switch (props.alert.type) {
        case 'Rupture':
            return 'text-red-700';
        case 'Alerte':
            return 'text-yellow-700';
        case 'Info':
            return 'text-green-700';
        default:
            return 'text-gray-700';
    }
});

const buttonClasses = computed(() => {
    switch (props.alert.type) {
        case 'Rupture':
            return 'bg-red-600 hover:bg-red-700 text-white';
        case 'Alerte':
            return 'bg-yellow-600 hover:bg-yellow-700 text-white';
        case 'Info':
            return 'bg-green-600 hover:bg-green-700 text-white';
        default:
            return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
});

// Émettre un événement lorsque le bouton "Commander" est cliqué
const emit = defineEmits(['commander']);

const commanderProduit = (productId) => {
    alert(`Action 'Commander' déclenchée pour le produit ID: ${productId}.`);
    // Ici, vous implémenteriez la logique réelle pour initier une commande,
    // probablement en redirigeant vers le formulaire de commande ou en ouvrant une modale.
    // useRouter().push(`/commandes/create?productId=${productId}`);
};
</script>

<style scoped>
/* Aucun style spécifique ici, Tailwind CSS est suffisant */
</style>
