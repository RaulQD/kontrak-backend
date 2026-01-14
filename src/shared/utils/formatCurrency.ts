export const formatCurrency = (salary: number) => {
  const format = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(salary);
  return format;
};
