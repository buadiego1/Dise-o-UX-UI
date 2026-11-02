// Pago simulado: nunca se usan datos de tarjetas reales
const CLAVE_CONTADOR = 'cubri-contador-polizas';

export function simularPago(numero) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const limpio = numero.replace(/\s/g, '');
      resolve(limpio === '4000000000000002'
        ? { ok: false, motivo: 'Tarjeta rechazada' }
        : { ok: true });
    }, 1500);
  });
}

function siguienteContador() {
  try {
    const contador = Number(localStorage.getItem(CLAVE_CONTADOR) ?? 0) + 1;
    localStorage.setItem(CLAVE_CONTADOR, contador);
    return contador;
  } catch {
    return Math.floor(Math.random() * 999999) + 1;
  }
}

// Número de póliza: POL-AAAA-NNNNNN
export function generarPoliza() {
  const contador = siguienteContador();
  return `POL-${new Date().getFullYear()}-${String(contador).padStart(6, '0')}`;
}
