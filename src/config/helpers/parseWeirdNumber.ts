export const parseWeirdNumber = (str: string) => {
  // Eliminar todos los espacios
  let cleaned = str.replace(/\s/g, '');

  // Buscar el índice del último punto o coma (posible decimal)
  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  const decimalIndex = Math.max(lastDot, lastComma);

  if (decimalIndex === -1) {
    // No hay separador decimal, eliminar puntos y comas como si fueran separadores de miles
    cleaned = cleaned.replace(/[.,]/g, '');
  } else {
    // Separar en parte entera y decimal
    const integerPart = cleaned.slice(0, decimalIndex).replace(/[.,]/g, '');
    const decimalPart = cleaned.slice(decimalIndex + 1);
    cleaned = `${integerPart}.${decimalPart}`;
  }

  const number = parseFloat(cleaned);
  return isNaN(number) ? null : number;
};
