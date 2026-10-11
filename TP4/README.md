# Coffea – Landing Page (TP4)

Landing page estática de la cafetería ficticia **Coffea**, hecha solo con **HTML5 + CSS3** (sin JavaScript, frameworks ni preprocesadores), según el PRD del TP4.

## Estructura

```
TP4/
├── index.html
├── 404.html
├── netlify.toml
├── css/
│   ├── main.css          # importa las capas en orden (@layer)
│   ├── tokens.css        # colores, fuentes, radios y espacios
│   ├── base.css          # reset, tipografía base, :focus-visible
│   ├── layout.css        # .container, títulos de sección, 404
│   ├── utilities.css     # .visually-hidden
│   └── components/       # un archivo por componente (BEM)
└── assets/
    ├── img/              # fotos
    └── icons/            # íconos SVG
```

## Convenciones

- Nombres de clases con **BEM** (`.product-card__title`).
- Todos los colores, fuentes y radios salen de `css/tokens.css`.
- **Mobile-first**: breakpoints en 768px, 1024px y 1440px.
- Interacciones solo con CSS: carruseles con `scroll-snap`, menú mobile con `<details>`, favoritos con checkbox.

## Cómo verlo en local

Abrir `index.html` con la extensión **Live Server** de VS Code, o desde la carpeta `TP4`:

```bash
python -m http.server 8000
```

y entrar a http://localhost:8000

## Deploy en Netlify

1. Subir el repositorio a GitHub.
2. En Netlify: _Add new site → Import an existing project_ y elegir el repo.
3. Build command: vacío. Publish directory: `TP4` (o `.` si el repo es solo este proyecto).
4. Cada push a `main` publica automáticamente; cada Pull Request genera un Deploy Preview.

## Notas

- Las fotos son de Unsplash (uso libre) y reemplazan a las del template de Figma.
- Se corrigieron los typos del diseño ("Our story", "INFORMATION", "Plans & pricing", etc.) y se usa "Coffea" en header y footer.
