const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

function cerrarMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}

menuToggle.addEventListener('click', () => {
  const abierto = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(abierto));
  menuToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

nav.addEventListener('click', (evento) => {
  if (evento.target.closest('a')) cerrarMenu();
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && nav.classList.contains('is-open')) {
    cerrarMenu();
    menuToggle.focus();
  }
});

// Tema
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const oscuro = !root.classList.contains('is-dark');
  root.classList.toggle('is-dark', oscuro);
  root.dataset.theme = oscuro ? 'dark' : 'light';
  try {
    localStorage.setItem('tema', root.dataset.theme);
  } catch (error) {
    // Sin almacenamiento, el tema dura hasta recargar
  }
});

// Sección actual en la navegación: solo en la página de los anclas
const links = [...document.querySelectorAll('.site-nav__list a[href^="#"]')];
const secciones = links
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

if (secciones.length) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === `#${entrada.target.id}`) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  secciones.forEach((seccion) => observador.observe(seccion));
}

// La línea avanza con el scroll
const ruta = document.querySelector('.route');
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (ruta && !reducirMovimiento) {
  let pendiente = false;
  const actualizar = () => {
    const { top, height } = ruta.getBoundingClientRect();
    const avance = (window.innerHeight * 0.6 - top) / height;
    ruta.style.setProperty('--progress', Math.min(1, Math.max(0, avance)).toFixed(3));
    pendiente = false;
  };
  window.addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }, { passive: true });
  actualizar();
}

// Copiar el email
const copiar = document.querySelector('.copy-email');

if (copiar) {
  const estado = document.querySelector('.copy-email__status');
  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copiar.dataset.email);
      estado.textContent = 'Email copiado';
    } catch (error) {
      estado.textContent = 'No se pudo copiar. Usá el link del email.';
    }
  });
}
