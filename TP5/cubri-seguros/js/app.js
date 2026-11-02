// Arranque, eventos y navegación
import { solicitud, irAPaso, escribirCampo, reiniciarSolicitud } from './estado.js';
import { render } from './render.js';

const ACCIONES = {
  inicio: () => irAPaso(0),
  cotizar: () => irAPaso(1),
  volver: () => irAPaso(solicitud.paso - 1),
  reintentar: () => irAPaso(4),
  'cambiar-pago': () => irAPaso(4),
  reiniciar: () => {
    reiniciarSolicitud();
    render();
  },
};

document.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-accion]');
  if (boton) ACCIONES[boton.dataset.accion]?.();
});

const form = document.getElementById('form-checkout');

form.addEventListener('input', (e) => {
  const campo = e.target.dataset.campo;
  if (!campo) return;
  const { type, checked, value } = e.target;
  escribirCampo(campo, type === 'checkbox' ? checked : value);
  render();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  irAPaso(solicitud.paso + 1);
});

render();
