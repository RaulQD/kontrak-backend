import { changeStringToDate } from '../helpers';
export const toExcelSerialDate = (
  date: Date | string | null | undefined,
): number | null => {
  if (!date) return null;
  let dateObj: Date;
  if (typeof date === 'string') {
    // Detecta automáticamente si es formato dd/mm/yyyy
    if (date.includes('/')) {
      dateObj = changeStringToDate(date);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date; // Ya es Date
  }
  // Validación extra por seguridad
  if (isNaN(dateObj.getTime())) return null;
  // Cálculo Serial Number de Excel
  const millisecondsInDay = 86400000;
  const excelOffset = 25569;
  const timezoneOffset = dateObj.getTimezoneOffset() * 60 * 1000;

  return (dateObj.getTime() - timezoneOffset) / millisecondsInDay + excelOffset;
};
