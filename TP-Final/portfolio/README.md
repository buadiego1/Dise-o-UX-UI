# Portfolio de Diego Bua (Trabajo Final)

Portfolio web personal para Diseño UX-UI 2026, Licenciatura en Sistemas de Información. Es un one-page con las 9 secciones de la consigna y dos casos de estudio internos.

| | |
| --- | --- |
| Sitio | Pendiente de publicar. Se propone `https://diegobua.netlify.app` |
| Figma | Pendiente de crear |
| Repositorio | https://github.com/buadiego1/Dise-o-UX-UI |
| Stack | HTML5, CSS3 con variables y JavaScript vanilla |

## Antes de entregar

El sitio marca con un recuadro punteado lo que falta completar. Para encontrar todo:

```bash
grep -rn "Completar:" --include=*.html .
```

- [ ] Disponibilidad en el hero.
- [ ] URL de LinkedIn en contacto y footer.
- [ ] Un segundo logro para el ítem de la Licenciatura, si la consigna lo exige en la corrección.
- [ ] Año, stack y rol en las tarjetas de Corte y Potencia.
- [ ] Revisar los textos de "Sobre mí" y la ubicación, escritos a partir de los TP y de la sede de la consigna.
- [ ] Reemplazar la ilustración por una foto si preferís una foto real.
- [ ] Crear el archivo de Figma a partir de `docs/`: research, wireframes, design system y prototipo mobile y desktop.
- [ ] Hacer el test con 3 personas y la revisión entre pares en [docs/proceso/03-test-de-usabilidad.md](docs/proceso/03-test-de-usabilidad.md).
- [ ] Completar las slides 8 a 10 y exportar de nuevo el PDF.
- [ ] Publicar, ajustar la URL en metadatos y este README, y agregarla a la descripción del repo.
- [ ] Repetir Lighthouse sobre la URL pública y reemplazar la captura.

## Cómo correrlo

Desde esta carpeta:

```bash
npx serve
```

No requiere compilación.

## Estructura

```text
portfolio/
├── index.html            one-page
├── casos/                casos de estudio
├── 404.html, gracias.html
├── css/tokens.css        paleta, tipografía y espaciado
├── css/styles.css        base, componentes y secciones
├── js/theme.js           tema antes de pintar
├── js/main.js            menú, tema, sección actual, línea y copiar email
├── assets/               fuentes e imágenes
├── _headers              headers de seguridad y caché
└── docs/                 proceso, wireframes, design system y capturas
```

## Proceso UX/UI

1. [Usuario objetivo y benchmark](docs/proceso/01-usuario-y-benchmark.md)
2. [Concepto y arquitectura de información](docs/proceso/02-concepto-y-arquitectura.md)
3. [Wireframes](docs/wireframes/wireframes.png), con su [fuente](docs/wireframes/index.html)
4. [Design system](docs/design-system.png), con su [fuente](docs/design-system.html)
5. [Guion y plantilla del test](docs/proceso/03-test-de-usabilidad.md)
6. [Slides del proceso](docs/proceso/proceso-portfolio.pdf)

## Decisiones

- **El recorrido como concepto.** Una línea une las secciones y avanza con el scroll. Con `prefers-reduced-motion` queda completa y fija.
- **Sin Tailwind.** Las variables CSS alcanzan y evitan un paso de build.
- **Fuentes autoalojadas.** Overpass y Atkinson Hyperlegible, con `font-display: swap`.
- **Orden de secciones.** Se mantiene el de la consigna, porque lleva de la propuesta a la evidencia y al contacto.
- **Menú hamburguesa hasta 1024 px.** Además de 375, 768 y 1280 px, hay un corte en 1024 px porque la navegación completa no entra antes.

## Verificación local

Medido el 2 de noviembre de 2026 sobre un servidor local, sin los headers de `_headers` ni CDN:

- Lighthouse mobile: 100 en Performance, Accessibility, Best Practices y SEO, en la home y en el caso de Cubrí. [Captura](docs/capturas/lighthouse-mobile.png).
- Sin scroll horizontal ni contraste por debajo de AA en 375, 768 y 1280 px, en claro y oscuro, en las 5 páginas.
- Un solo `h1`, sin saltos de encabezados y todas las imágenes con `alt`.
- Recorrido con teclado en mobile, menú con `aria-expanded` y `aria-controls`, cierre con Escape y anclas sin quedar debajo del header.

El formulario de Netlify solo se puede probar una vez publicado.

## Bonus

- Modo claro y oscuro con `prefers-color-scheme` y botón.
- Formulario con Netlify Forms y honeypot.
- Segundo caso de estudio, con navegación entre casos.
- Página 404 personalizada.
- Headers de seguridad.
- Animación accesible de la línea.

## Publicación en Netlify

1. Unir la rama a `main` y subirla a GitHub.
2. En Netlify: *Add new site*, *Import an existing project* y elegir el repo.
3. Base directory: `TP-Final/portfolio`. Build command: vacío. Publish directory: `TP-Final/portfolio`.
4. Comprobar en el primer deploy que Netlify tome el `netlify.toml` de esta carpeta y no el de la raíz, que publica TP4.
5. Activar *Form detection* en la sección Forms del sitio.
6. Cada push a `main` publica de nuevo.

## Créditos

- Sin templates: el diseño y el código son propios de este trabajo.
- Fuentes: [Overpass](https://fonts.google.com/specimen/Overpass) y [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible), licencia OFL, instaladas desde Fontsource.
- Imágenes: capturas de TP3, TP4, TP5 y de los sitios publicados de Corte y Potencia.

## Uso de IA

Se usó Claude Code para redactar la documentación del proceso, proponer el concepto visual, escribir el HTML, CSS y JavaScript, y correr las verificaciones automáticas. El autor debe revisar los textos antes de entregar. Persona y card sorting son hipótesis de trabajo. El test de usabilidad no fue generado por IA y debe hacerse con personas reales.

## Capturas

| Mobile | Tablet |
| --- | --- |
| ![Home en 375 px](docs/capturas/mobile-375.png) | ![Home en 768 px](docs/capturas/tablet-768.png) |

![Home en 1280 px, modo claro](docs/capturas/desktop-1280.png)
![Home en 1280 px, modo oscuro](docs/capturas/desktop-1280-oscuro.png)
![Caso de estudio de Cubrí Seguros](docs/capturas/caso-cubri-1280.png)
