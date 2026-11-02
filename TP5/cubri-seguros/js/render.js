// Pinta cada paso a partir del estado. Nunca lee datos del DOM.
import { solicitud, catalogo, tocados, leerCampo } from './estado.js';
import { calcularCuota, formatearMoneda, FACTORES } from './cotizador.js';
import { validarPaso } from './validaciones.js';

const PASOS = [
  { n: 1, nombre: 'Cotizar', barra: 'Cotizá tu seguro', titulo: 'Contanos sobre tu celular', boton: 'Ver planes' },
  { n: 2, nombre: 'Plan', barra: 'Elegí tu plan', titulo: 'Elegí tu plan', boton: 'Continuar' },
  { n: 3, nombre: 'Datos', barra: 'Tus datos', titulo: 'Tus datos', boton: 'Continuar al pago' },
  { n: 4, nombre: 'Pago', barra: 'Pago', titulo: 'Pago', boton: 'Pagar y contratar' },
];

// Coberturas que se muestran tachadas cuando el plan no las incluye
const OPCIONALES = ['Rotura de pantalla', 'Hurto / pérdida'];

const ICONO_CHECK = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
const ICONO_CRUZ = '<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const $ = (id) => document.getElementById(id);

// Lo que escribe el usuario nunca entra como HTML
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function cuotaDe(plan) {
  return calcularCuota(solicitud.equipo.valor, plan.tasaAnual, FACTORES[solicitud.equipo.antiguedad]);
}

function planElegido() {
  return catalogo.planes.find((p) => p.id === solicitud.plan);
}

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
    renderPlanes();
    renderResumen();
  }

  renderStepper();
  renderCampos();
  renderValidacion();
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
    const ruta = input.dataset.campo;
    const valor = leerCampo(ruta);
    if (input.type === 'radio') {
      input.checked = input.value === valor;
    } else if (input.type === 'checkbox') {
      input.checked = valor;
    } else {
      const texto = ruta === 'equipo.valor'
        ? (valor ? formatearMoneda(valor) : '')
        : String(valor);
      if (input.value !== texto) input.value = texto;
    }
  });
}

function coberturasDe(plan) {
  const incluidas = plan.coberturas.map((c) =>
    `<li class="flex items-center gap-1.5"><span class="text-ok">${ICONO_CHECK}</span>${escapar(c)}</li>`);
  const cubrePantalla = plan.coberturas.includes('Rotura total');
  const faltantes = OPCIONALES
    .filter((c) => !plan.coberturas.includes(c) && !(c === 'Rotura de pantalla' && cubrePantalla))
    .map((c) => `<li class="flex items-center gap-1.5 text-mute/70">${ICONO_CRUZ}<span>${escapar(c)}</span></li>`);
  return [...incluidas, ...faltantes].join('');
}

// Las cards se crean una vez: regenerarlas haría perder el foco del radio
function renderPlanes() {
  const lista = $('lista-planes');
  if (!catalogo.planes.length) return;
  if (!lista.children.length) {
    lista.innerHTML = catalogo.planes.map((plan) => `
      <label class="card cursor-pointer gap-0 border-2 border-line p-4 shadow-none has-checked:border-brand has-checked:bg-white has-focus-visible:ring-2 has-focus-visible:ring-brand">
        <span class="flex items-center gap-2">
          <strong class="text-[15px] font-extrabold">${escapar(plan.nombre)}</strong>
          ${plan.recomendado ? '<span class="badge">Recomendado</span>' : ''}
          <input class="ml-auto size-5 accent-brand" type="radio" name="plan" value="${plan.id}">
        </span>
        <span class="mt-1 text-2xl font-extrabold"><span data-cuota="${plan.id}"></span> <small class="text-xs font-normal text-mute">/ mes</small></span>
        <ul class="mt-2 grid gap-1 text-xs">${coberturasDe(plan)}</ul>
      </label>`).join('');
  }
  catalogo.planes.forEach((plan) => {
    lista.querySelector(`[data-cuota="${plan.id}"]`).textContent = formatearMoneda(cuotaDe(plan));
    lista.querySelector(`input[value="${plan.id}"]`).checked = plan.id === solicitud.plan;
  });
}

function fila(etiqueta, valor) {
  return `<div class="flex justify-between gap-4 text-[13px]">
    <span class="text-mute">${etiqueta}</span>
    <strong class="text-right font-semibold">${escapar(valor)}</strong>
  </div>`;
}

// Regla de oro: el resumen se genera una sola vez, acá
function renderResumen() {
  const { paso, equipo, titular } = solicitud;
  const equipoTexto = `${equipo.marca} ${equipo.modelo}`.trim() || '—';
  const plan = paso >= 2 ? planElegido() : null;

  const filas = [fila('Seguro', 'Celular'), fila('Equipo', equipoTexto)];
  if (!plan) filas.push(fila('Valor', equipo.valor ? formatearMoneda(equipo.valor) : '—'));
  if (plan) filas.push(fila('Plan', plan.nombre));
  if (paso === 4) filas.push(fila('Titular', `${titular.nombre} ${titular.apellido}`));

  const cierre = plan
    ? `<div class="flex items-center justify-between border-t border-line pt-2 text-sm">
         <span class="text-mute">Total mensual</span>
         <strong class="text-lg font-extrabold">${formatearMoneda(cuotaDe(plan))}</strong>
       </div>`
    : '<p class="text-xs text-mute">Completá los datos del equipo para ver el precio.</p>';

  $('resumen-contenido').innerHTML = `
    <div class="res-detalle grid gap-2">
      ${filas.join('')}
      ${cierre}
      <p class="text-[11px] text-mute max-lg:hidden">Contratación 100% online · cancelás cuando quieras</p>
    </div>
    ${plan ? `<div class="res-barra items-center justify-between text-[13px]">
      <span class="text-mute">Plan ${escapar(plan.nombre)} · ${escapar(equipo.modelo)}</span>
      <strong>${formatearMoneda(cuotaDe(plan))}/mes</strong>
    </div>` : ''}`;

  $('resumen').dataset.modo = { 2: 'barra', 4: 'card' }[paso] ?? 'oculto';
}

// Muestra errores en línea y habilita el botón solo si todo es válido
function renderValidacion() {
  const campos = validarPaso(solicitud.paso, leerCampo);

  campos.forEach(({ ruta, error }) => {
    const entradas = document.querySelectorAll(`[data-campo="${ruta}"]`);
    const grupo = entradas[0].closest('.field');
    const mensaje = grupo.querySelector('[role="alert"]');
    const visible = tocados.has(ruta) ? error : null;

    grupo.toggleAttribute('data-invalid', Boolean(visible));
    mensaje.hidden = !visible;
    mensaje.textContent = visible ?? '';
    entradas.forEach((entrada) => {
      entrada.toggleAttribute('aria-invalid', Boolean(visible));
      if (visible) entrada.setAttribute('aria-invalid', 'true');
      if (visible) entrada.setAttribute('aria-describedby', mensaje.id);
      else if (entrada.id !== 'valor') entrada.removeAttribute('aria-describedby');
      else entrada.setAttribute('aria-describedby', 'valor-ayuda');
    });
    if (ruta === 'equipo.valor') $('valor-ayuda').hidden = Boolean(visible);
  });

  const faltan = campos.filter((c) => c.error).map((c) => c.nombre);
  const ayuda = faltan.length ? `Completá para continuar: ${faltan.join(', ')}.` : '';
  $('btn-continuar').disabled = faltan.length > 0;
  $('ayuda-boton').textContent = ayuda;
  $('ayuda-boton').hidden = !ayuda;
  $('ayuda-boton-desktop').textContent = ayuda;
}
