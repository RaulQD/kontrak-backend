export const toExcelSerialDate = (date: Date): number => {
  // 1. Definimos los milisegundos exactos por día
  const millisecondsInDay = 86400000; // (1000 * 60 * 60 * 24)

  // 2. Definimos la diferencia de días entre 1900 (Excel) y 1970 (JS)
  const excelOffset = 25569;

  // 3. Calculamos: (ms actuales / ms por día) + ajuste
  // date.getTime() nos da los ms desde 1970
  // Usamos el offset de zona horaria para evitar que se corra un día
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;

  // Ajustamos la fecha para que sea mediodía o restamos el offset
  // para asegurar que caiga en el día correcto si es UTC
  const rawSerial =
    (date.getTime() - timezoneOffset) / millisecondsInDay + excelOffset;

  return rawSerial;
};
