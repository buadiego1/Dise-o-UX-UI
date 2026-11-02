// Arranque, eventos y navegación
import {
  solicitud, tocados, irAPaso, leerCampo, escribirCampo, reiniciarSolicitud, cargarPlanes,
} from './estado.js';
import { render } from './render.js';
import { validarPaso } from './validaciones.js';

const form = document.getElementById('form-checkout');
const btnContinuar = document.getElementById('btn-continuar');

// Cambia de paso y lleva la vista y el foco al título de la pantalla nueva
function navegar(paso) {
  irAPaso(paso);
  window.scrollTo(0, 0);
  const titulos = document.querySelectorAll('[tabindex="-1"]');
  [...titulos].find((t) => t.offsetParent !== null)?.focus({ preventScroll: true });
}

const ACCIONES = {
  inicio: () => navegar(0),
  cotizar: () => navegar(1),
  volver: () => navegar(solicitud.paso - 1),
  reintentar: () => navegar(4),
  'cambiar-pago': () => navegar(4),
  reiniciar: () => {
    reiniciarSolicitud();
    navegar(0);
  },
};

document.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-accion]');
  if (boton) ACCIONES[boton.dataset.accion]?.();
});

// Los inputs devuelven strings: acá se convierten al tipo del estado
function limpiarValor(ruta, entrada) {
  if (entrada.type === 'checkbox') return entrada.checked;
  if (ruta === 'equipo.valor') return Number(entrada.value.replace(/\D/g, ''));
  return entrada.value;
}

form.addEventListener('input', (e) => {
  const ruta = e.target.dataset.campo;
  if (ruta) {
    escribirCampo(ruta, limpiarValor(ruta, e.target));
  } else if (e.target.name === 'plan') {
    solicitud.plan = e.target.value;
  }
  render();
});

// El error aparece al salir del campo, no mientras se escribe
form.addEventListener('focusout', (e) => {
  const ruta = e.target.dataset.campo;
  if (!ruta) return;
  tocados.add(ruta);
  render();
});

// Revalida todo el paso y lleva el foco al primer campo con error
function revalidar() {
  const campos = validarPaso(solicitud.paso, leerCampo);
  campos.forEach(({ ruta }) => tocados.add(ruta));
  render();
  const primero = campos.find((c) => c.error);
  if (primero) document.querySelector(`[data-campo="${primero.ruta}"]`).focus();
  return !primero;
}

async function avanzar() {
  if (!revalidar()) return;
  if (solicitud.paso === 1) {
    const aviso = document.getElementById('error-planes');
    try {
      await cargarPlanes();
      aviso.hidden = true;
    } catch (error) {
      console.warn(error);
      aviso.hidden = false;
    }
  }
  if (solicitud.paso < 4) navegar(solicitud.paso + 1);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  avanzar();
});

// Con el botón deshabilitado no hay submit: Enter y el clic igual muestran qué falta
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('input, select') && btnContinuar.disabled) {
    e.preventDefault();
    revalidar();
  }
});

document.getElementById('envoltura-continuar').addEventListener('click', () => {
  if (btnContinuar.disabled) revalidar();
});

render();
