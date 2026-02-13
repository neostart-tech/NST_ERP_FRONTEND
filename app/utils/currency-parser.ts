export const formatCurrency = (amount: number, withCurrency: boolean = false): string => {
	return new Intl.NumberFormat('fr-FR', {
		style: 'decimal',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount) + (withCurrency ? ' F CFA' : '');
}
