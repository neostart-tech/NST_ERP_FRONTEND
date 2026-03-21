<template>
  <div v-if="selectedSchedule?.invoice?.order.articles">
    <div class="overflow-x-auto">
      <table class="w-full text-sm border">
        <thead class="bg-gray-100">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Article
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantité
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Prix Unitaire
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="article in selectedSchedule?.invoice?.order.articles" :key="article.id" class="border-t">
          <td class="px-4 py-2 border">{{ article.name }}</td>
          <td class="px-4 py-2 border">{{ article.description }}</td>
          <td class="px-4 py-2 text-right border">{{ article.pivot!.quantity }}</td>
          <td class="px-4 py-2 text-right border">{{ formatCurrency(article.pivot!.unit_price) }}</td>
          <td class="px-4 py-2 text-right border">
            {{ formatCurrency(article.pivot!.quantity * article.pivot!.unit_price) }}
          </td>
        </tr>
        </tbody>
        <tfoot v-if="selectedSchedule">
        <tr>
          <td colspan="4" class="py-2 px-4 text-right font-bold border">Total HT</td>
          <td class="py-2 px-4 text-right font-bold border">{{ formatCurrency(totalHT) }}</td>
        </tr>
        <tr>
          <td colspan="4" class="py-2 px-4 text-right font-bold border">TVA (18%)</td>
          <td class="py-2 px-4 text-right font-bold border">{{ formatCurrency(totalHT * 0.18) }}</td>
        </tr>
        <tr>
          <td colspan="4" class="py-2 px-4 text-right font-bold border">Total TTC</td>
          <td class="py-2 px-4 text-right font-bold border">{{ formatCurrency(totalHT * 1.18) }}</td>
        </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultInvoiceSchedule, type InvoiceSchedule } from '~/models/InvoiceSchedule';

defineProps({
	selectedSchedule: {
		default: defaultInvoiceSchedule,
		type: Object as () => InvoiceSchedule
	},
	totalHT: {
		type: Number,
		default: 0
	},
})
</script>
