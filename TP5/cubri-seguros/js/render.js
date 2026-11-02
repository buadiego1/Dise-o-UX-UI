// Pinta cada paso a partir del estado. Nunca lee datos del DOM.
import { solicitud, leerCampo } from './estado.js';

const PASOS = [
  { n: 1, nombre: 'Cotizar', barra: 'Cotizá tu seguro', titulo: 'Contanos sobre tu celular', boton: 'Ver planes' },
  { n: 2, nombre: 'Plan', barra: 'Elegí tu plan', titulo: 'Elegí tu plan', boton: 'Continuar' },
  { n: 3, nombre: 'Datos', barra: 'Tus datos', titulo: 'Tus datos', boton: 'Continuar al pago' },
  { n: 4, nombre: 'Pago', barra: 'Pago', titulo: 'Pago', boton: 'Pagar y contratar' },
];

const ICONO_CHECK = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';

const $ = (id) => document.getElementById(id);

export function render() {
  document.querySelectorAll('[data-paso]').forEach((s) => {
    s.hidden = Number(s.dataset.paso) !== solicitud.paso;
  });
  const enCheckout = solicitud.paso >= 1 && solicitud.paso <= 4;
  $('checkout').hidden = !enCheckout;
  $('barra-mobile').hidden = !enCheckout;
  // En mobile la cabecera con logo solo aparece en el inicio
  $('cabecera').classList.toggle('max-lg:hidden', solicitud.paso !== 0);

  if (enCheckout) {
    const paso = PASOS[solicitud.paso - 1];
    $('barra-titulo').textContent = paso.barra;
    $('titulo-paso').textContent = paso.titulo;
    $('btn-continuar').textContent = paso.boton;
  }

  renderStepper();
  renderCampos();
}

function renderStepper() {
  $('stepper').innerHTML = PASOS.map((p, i) => {
    const completo = p.n < solicitud.paso;
    const activo = p.n === solicitud.paso;
    const estilo = completo ? 'text-ok' : activo ? 'text-brand' : 'text-mute';
    const circulo = completo ? 'bg-ok text-white' : activo ? 'bg-brand text-white' : 'border border-line';
    const linea = i === 0 ? '' :
      `<li class="h-0.5 flex-1 ${p.n <= solicitud.paso ? 'bg-ok' : 'bg-line'}" aria-hidden="true"></li>`;
    return `${linea}<li class="flex items-center gap-1.5 ${estilo}" ${activo ? 'aria-current="step"' : ''}>
      <span class="grid size-6 place-items-center rounded-full ${circulo}">${completo ? ICONO_CHECK : p.n}</span>${p.nombre}
    </li>`;
  }).join('');
}

// Rellena los inputs desde el estado: así "Volver" nunca pierde datos
function renderCampos() {
  document.querySelectorAll('[data-campo]').forEach((input) => {
    const valor = leerCampo(input.dataset.campo);
    if (input.type === 'radio') {
      input.checked = input.value === valor;
    } else if (input.type === 'checkbox') {
      input.checked = valor;
    } else {
      const texto = String(valor || '');
      if (input.value !== texto) input.value = texto;
    }
  });
}
