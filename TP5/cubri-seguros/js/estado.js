// Único estado del flujo. El DOM solo muestra lo que dice este objeto.
import { render } from './render.js';

function solicitudInicial() {
  return {
    paso: 0,                // 0 = inicio, 1..4 = checkout, 5 = éxito, 6 = error
    equipo:  { marca: '', modelo: '', valor: 0, antiguedad: '' },
    plan: 'plus',
    titular: { nombre: '', apellido: '', dni: '', nacimiento: '',
               email: '', celular: '', terminos: false },
    pago:    { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
    poliza: null,
  };
}

export const solicitud = solicitudInicial();

export function irAPaso(n) {
  solicitud.paso = n;
  render();               // siempre después de cambiar el estado
}

// Lee o escribe un campo a partir de su ruta, por ejemplo "titular.email"
export function leerCampo(ruta) {
  const [grupo, clave] = ruta.split('.');
  return solicitud[grupo][clave];
}

export function escribirCampo(ruta, valor) {
  const [grupo, clave] = ruta.split('.');
  solicitud[grupo][clave] = valor;
}

export function reiniciarSolicitud() {
  tocados.clear();
  Object.assign(solicitud, solicitudInicial());
}

// Planes cargados desde data/planes.json (no son datos del usuario)
export const catalogo = { planes: [] };

export async function cargarPlanes() {
  if (catalogo.planes.length) return;
  const respuesta = await fetch('data/planes.json');
  if (!respuesta.ok) throw new Error(`planes.json: ${respuesta.status}`);
  catalogo.planes = await respuesta.json();
}

// Campos que la persona ya visitó: solo ahí se muestran los errores
export const tocados = new Set();
