export const formatCurrency = (value: number, locale = 'es-CO'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};
