# 2. Concepto visual y arquitectura de información

## Palabras clave

**Claro, conectado, cuidadoso.**

Los tres trabajos de Diego son flujos: un checkout de siete pantallas, una landing y una serie de ejercicios que crece paso a paso. Por eso el concepto es **el recorrido**: el sitio se lee como un plano de transporte, con una línea que une las secciones y paradas que marcan dónde estás.

| Palabra | Color | Tipografía | Imágenes |
| --- | --- | --- | --- |
| Claro | Fondo frío muy claro, contraste alto, azul ultramar como único color de acción | Overpass, derivada de la señalética vial, para títulos que se leen de un vistazo | Capturas reales de los proyectos, sin mockups decorativos |
| Conectado | Línea azul continua y paradas amarillas en modo oscuro y azules en claro | Títulos grandes alineados a la línea | Ilustración propia: un plano de recorrido con las iniciales |
| Cuidadoso | Estados de color con contraste verificado | Atkinson Hyperlegible, diseñada para la legibilidad, para el texto | Texto alternativo que describe qué muestra cada captura |

## Moodboard

Referencias de lenguaje visual, sin copiar piezas puntuales:

- Planos de transporte urbano: líneas continuas, paradas, leyendas simples.
- Señalética vial: letras gruesas, placas con esquinas redondeadas.
- Boletos y placas de andén: bloques de color plano en lugar de sombras.

Muestras de paleta: `#F4F6FB` · `#121C4E` · `#2438CC` · `#FFC629` · `#0B7A55` · `#BE1E37`. La hoja [design-system.html](../design-system.html) las muestra aplicadas.

## Diferencias con la referencia

La consigna no acepta copiar la paleta oscura, la tipografía y el layout de la referencia. Este sitio abre en modo claro, usa una línea vertical como eje en lugar de una columna de texto y bloques de color plano en lugar de tarjetas con sombra.

## Sitemap

```text
index.html (one-page)
├── #inicio        Hero
├── #metricas      Cifras
├── #skills        Skills
├── #proyectos     Proyectos
│   ├── casos/cubri-seguros.html   Caso de estudio
│   └── casos/coffea.html          Caso de estudio extra
├── #experiencia   Experiencia y formación
├── #sobre-mi      Sobre mí
├── #contacto      Contacto y formulario
└── footer
404.html
```

Se mantiene el orden de la consigna: quien selecciona ve primero la propuesta, después la evidencia y al final el contacto. El CTA de contacto del header queda siempre a mano.

## Card sorting simple

Ejercicio cerrado, hecho por el autor con el contenido propio. Es una organización de trabajo y no un estudio con participantes.

| Grupo | Tarjetas |
| --- | --- |
| Quién soy | Nombre, rol, ubicación, disponibilidad, presentación, retrato |
| Qué sé hacer | Diseño UX, UI, front-end, herramientas |
| Qué hice | Cubrí Seguros, Coffea, ejercicios de maquetado, cifras |
| De dónde vengo | Carrera, materia, trabajo final |
| Cómo trabajo | Principios |
| Cómo hablarme | Email, LinkedIn, GitHub, formulario |

"Cifras" se probó en "Quién soy", pero quedó en "Qué hice" porque resume evidencia de los proyectos.
