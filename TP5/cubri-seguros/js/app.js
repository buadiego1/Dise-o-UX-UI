// Arranque, eventos y navegación
import {
  solicitud, tocados, irAPaso, leerCampo, escribirCampo, reiniciarSolicitud, cargarPlanes,
  restaurarSolicitud,
} from './estado.js';
import { render, procesando, textoPoliza } from './render.js';
import { validarPaso } from './validaciones.js';
import { simularPago, generarPoliza } from './pago.js';

const form = document.getElementById('form-checkout');
const btnContinuar = document.getElementById('btn-continuar');
let volverAlPago = false;  // bonus: "Editar" desde el resumen vuelve directo al pago

// Cambia de paso y lleva la vista y el foco al título de la pantalla nueva
function navegar(paso) {
  irAPaso(paso);
  window.scrollTo(0, 0);
  const titulos = document.querySelectorAll('[tabindex="-1"]');
  [...titulos].find((t) => t.offsetParent !== null)?.focus({ preventScroll: true });
}

function descargarPoliza() {
  const archivo = new Blob([textoPoliza()], { type: 'text/plain;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `${solicitud.poliza}.txt`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

const ACCIONES = {
  inicio: () => navegar(0),
  cotizar: () => navegar(1),
  volver: () => {
    volverAlPago = false;
    navegar(solicitud.paso - 1);
  },
  editar: (boton) => {
    volverAlPago = true;
    navegar(Number(boton.dataset.destino));
  },
  reintentar: () => navegar(4),
  'cambiar-pago': () => {
    navegar(4);
    document.querySelector('[data-campo="pago.metodo"]:checked').focus();
  },
  descargar: descargarPoliza,
  reiniciar: () => {
    reiniciarSolicitud();
    navegar(0);
  },
};

document.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-accion]');
  if (boton && !procesando.activo) ACCIONES[boton.dataset.accion]?.(boton);
});

// Bonus máscaras: tarjeta en grupos de 4 y vencimiento con barra automática
function mascaraTarjeta(valor) {
  return valor.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function mascaraVencimiento(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

// Los inputs devuelven strings: acá se convierten al tipo del estado
function limpiarValor(ruta, entrada) {
  if (entrada.type === 'checkbox') return entrada.checked;
  if (ruta === 'equipo.valor') return Number(entrada.value.replace(/\D/g, ''));
  if (ruta === 'pago.tarjeta') return mascaraTarjeta(entrada.value);
  if (ruta === 'pago.vencimiento') return mascaraVencimiento(entrada.value);
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

async function pagar() {
  procesando.activo = true;
  render();
  const resultado = await simularPago(solicitud.pago.tarjeta);
  procesando.activo = false;
  if (resultado.ok) solicitud.poliza = generarPoliza();
  navegar(resultado.ok ? 5 : 6);
}

async function avanzar() {
  if (procesando.activo || !revalidar()) return;
  if (solicitud.paso === 4) {
    pagar();
    return;
  }
  if (solicitud.paso === 1) {
    const aviso = document.getElementById('error-planes');
    try {
      await cargarPlanes();
      aviso.hidden = true;
    } catch (error) {
      console.warn(error);
      aviso.hidden = false;
      return;
    }
  }
  const destino = volverAlPago ? 4 : solicitud.paso + 1;
  volverAlPago = false;
  navegar(destino);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  avanzar();
});

// Con el botón deshabilitado no hay submit: Enter y el clic igual muestran qué falta
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('input, select') && btnContinuar.disabled) {
    e.preventDefault();
    if (!procesando.activo) revalidar();
  }
});

document.getElementById('envoltura-continuar').addEventListener('click', () => {
  if (btnContinuar.disabled && !procesando.activo) revalidar();
});

async function iniciar() {
  restaurarSolicitud();
  // Si se vuelve a un paso con precios, los planes tienen que estar antes del render
  if (solicitud.paso >= 2) {
    try {
      await cargarPlanes();
    } catch (error) {
      console.warn(error);
      solicitud.paso = 1;
    }
  }
  render();
}

iniciar();
