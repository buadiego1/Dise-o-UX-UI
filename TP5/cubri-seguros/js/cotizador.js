// Única fuente del precio: resumen y planes usan siempre calcularCuota()
export const FACTORES = { menos1: 1, '1a2': 1.1, mas2: 1.25 };

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function calcularCuota(valor, tasaAnual, factorAntiguedad) {
  return Math.round(valor * tasaAnual / 12 * factorAntiguedad);
}

export function formatearMoneda(numero) {
  return moneda.format(numero);
}
