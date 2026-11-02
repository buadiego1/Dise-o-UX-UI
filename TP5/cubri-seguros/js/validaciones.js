// Funciones puras: reciben un valor y devuelven el mensaje de error o null
const soloLetras = /^[\p{L}\s'-]+$/u;

function tieneDosLetras(valor) {
  const texto = valor.trim();
  return soloLetras.test(texto) && texto.match(/\p{L}/gu).length >= 2;
}

export function validarMarca(valor) {
  return valor ? null : 'Elegí una marca';
}

export function validarModelo(valor) {
  const largo = valor.trim().length;
  return largo >= 2 && largo <= 40 ? null : 'Ingresá el modelo del equipo';
}

export function validarValor(valor) {
  return valor >= 100000 && valor <= 2500000
    ? null
    : 'El valor debe estar entre $100.000 y $2.500.000';
}

export function validarAntiguedad(valor) {
  return valor ? null : 'Indicá la antigüedad';
}

export function validarNombre(valor) {
  return tieneDosLetras(valor) ? null : 'Ingresá tu nombre';
}

export function validarApellido(valor) {
  return tieneDosLetras(valor) ? null : 'Ingresá tu apellido';
}

export function validarDni(valor) {
  return /^\d{7,8}$/.test(valor) ? null : 'El DNI debe tener 7 u 8 números';
}

export function validarNacimiento(valor, hoy = new Date()) {
  const fecha = new Date(`${valor}T00:00:00`);
  if (!valor || Number.isNaN(fecha.getTime())) return 'Tenés que ser mayor de edad';
  const mayoria = new Date(fecha);
  mayoria.setFullYear(fecha.getFullYear() + 18);
  return mayoria <= hoy ? null : 'Tenés que ser mayor de edad';
}

export function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ? null : 'Ingresá un email válido';
}

export function validarCelular(valor) {
  const limpio = valor.replace(/[\s-]/g, '');
  const valido = /^\d{10}$/.test(limpio) && !limpio.startsWith('0') && !limpio.startsWith('15');
  return valido ? null : 'Ej.: 11 5555-1234';
}

export function validarTerminos(valor) {
  return valor ? null : 'Tenés que aceptar los términos';
}

export function validarTarjeta(valor) {
  return /^\d{16}$/.test(valor.replace(/\s/g, '')) ? null : 'Número de tarjeta inválido';
}

// La tarjeta vale hasta el último día del mes de vencimiento
export function validarVencimiento(valor, hoy = new Date()) {
  const partes = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valor);
  if (!partes) return 'Vencimiento inválido';
  const finDeMes = new Date(2000 + Number(partes[2]), Number(partes[1]), 1);
  return finDeMes > hoy ? null : 'Vencimiento inválido';
}

export function validarCvv(valor) {
  return /^\d{3}$/.test(valor) ? null : 'CVV inválido';
}

export function validarTitularPago(valor) {
  return valor.trim() ? null : 'Ingresá el nombre del titular';
}

// Qué se valida en cada paso. nombre = cómo se menciona lo que falta
export const CAMPOS_POR_PASO = {
  1: [
    { ruta: 'equipo.marca', nombre: 'marca', validar: validarMarca },
    { ruta: 'equipo.modelo', nombre: 'modelo', validar: validarModelo },
    { ruta: 'equipo.valor', nombre: 'valor', validar: validarValor },
    { ruta: 'equipo.antiguedad', nombre: 'antigüedad', validar: validarAntiguedad },
  ],
  2: [],
  3: [
    { ruta: 'titular.nombre', nombre: 'nombre', validar: validarNombre },
    { ruta: 'titular.apellido', nombre: 'apellido', validar: validarApellido },
    { ruta: 'titular.dni', nombre: 'DNI', validar: validarDni },
    { ruta: 'titular.nacimiento', nombre: 'fecha de nacimiento', validar: validarNacimiento },
    { ruta: 'titular.email', nombre: 'email', validar: validarEmail },
    { ruta: 'titular.celular', nombre: 'celular', validar: validarCelular },
    { ruta: 'titular.terminos', nombre: 'términos', validar: validarTerminos },
  ],
  4: [
    { ruta: 'pago.tarjeta', nombre: 'tarjeta', validar: validarTarjeta },
    { ruta: 'pago.titular', nombre: 'titular', validar: validarTitularPago },
    { ruta: 'pago.vencimiento', nombre: 'vencimiento', validar: validarVencimiento },
    { ruta: 'pago.cvv', nombre: 'CVV', validar: validarCvv },
  ],
};

// Devuelve los campos del paso con su error (o null)
export function validarPaso(paso, leerCampo) {
  return (CAMPOS_POR_PASO[paso] ?? []).map((campo) => ({
    ...campo,
    error: campo.validar(leerCampo(campo.ruta)),
  }));
}
