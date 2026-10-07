# Mis XV Años — Ana Victoria · Invitación Victoriana

Landing page estática lista para Netlify.

## Cómo publicarla en Netlify (2 minutos)

**Opción A — Arrastrar y soltar:**
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta `invitacion_ana_victoria`
3. Listo, te da un link tipo `https://ana-victoria-xv.netlify.app`

**Opción B — Desde terminal:**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

## Cómo personalizar (importante)

1. **WhatsApp (número real):**
   En `index.html` busca `wa.me/584120000000` y reemplázalo por tu número real.
   Formato: código país + número sin `+` ni espacios. Ej: `wa.me/584241234567`.

2. **Fotos reales:**
   - Guarda tus fotos en una carpeta `images/` (ej: `images/foto1.jpg`)
   - En `index.html` reemplaza los `src="https://picsum.photos/..."` por `src="images/foto1.jpg"`
   - Son 7 fotos: 1 principal (hero) + 6 galería. Tamaño ideal: 900x1100px vertical.

3. **Música vals real (opcional):**
   - La página ya trae un vals sintetizado que suena sin archivos.
   - Si quieres tu vals favorito: crea carpeta `music/` y guarda `music/vals.mp3`.
     Automáticamente usará tu mp3 en vez del sintetizado.

4. **Fecha límite RSVP:** está en la sección Confirma (31 Oct 2026). Cámbiala ahí.

## Estructura

- `index.html` — contenido y textos
- `styles.css` — paleta vinotinto + rosa empolvado + dorado, tipografías Great Vibes / Playfair / Cormorant
- `script.js` — countdown a 14-11-2026 19:30, pétalos, sobre de apertura, lightbox, música
- `netlify.toml` — config de deploy

## Datos del evento

- **Quinceañera:** Ana Victoria Sarmiento Pereira
- **Fecha:** Sábado 14 Noviembre 2026, 7:30 PM
- **Salón:** Aguasanta, Sector Terepaima, Aguaviva, Cabudare
- **Maps:** https://maps.app.goo.gl/TqyJQEDRbFRrQ9aJ7
