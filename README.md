# Mis XV Años — Ana Victoria · Invitación Victoriana

Landing page estática lista para Netlify. Tema claro seda rosa (paleta de la imagen de referencia).

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
   Ya configurado al +58 412 302 3075 (`wa.me/584123023075`).
   Si cambia, en `index.html` busca `wa.me/584123023075` y reemplázalo.
   Formato: código país + número sin `+` ni espacios.

2. **Fotos reales:**
   - Guarda tus fotos en una carpeta `images/` (ej: `images/foto-principal.jpg`, `images/foto1.jpg`...)
   - En `index.html` reemplaza los `src="https://picsum.photos/..."` por `src="images/..."`.
     Ojo: en la galería el lightbox usa `replace('/600/760','/900/1100')`; con fotos
     locales simplemente mostrará la misma imagen (funciona sin cambios).
   - Son 7 fotos: 1 principal (hero) + 6 galería. Tamaño ideal: 900x1100px vertical.

3. **Vista previa en WhatsApp (`og:image`):**
   - En `index.html` busca `TU-SITIO.netlify.app` y pon tu URL real de Netlify.
   - La imagen debe existir en esa ruta (ej: `images/foto-principal.jpg`).
   - Después de publicar, verifica en https://cards-dev.twitter.com/validator o
     reenviando el link (WhatsApp cachea la previa unas horas).

4. **Música:**
   - Ya hay `music/vals.mp3` (3.4MB) que suena al abrir la invitación.
   - Para aligerar la carga en datos móviles, comprímelo a ~1MB:
     ```bash
     ffmpeg -i music/vals.mp3 -codec:a libmp3lame -b:a 128k -ac 1 music/vals.mp3 -y
     ```
     (Si no tienes ffmpeg: `brew install ffmpeg` en Mac, o usa un compresor online
     y reemplaza el archivo con el mismo nombre.)
   - Si borras el mp3, la página usa automáticamente un vals sintetizado.

5. **Fecha límite RSVP:** está en la sección Confirma (31 Oct 2026). Cámbiala ahí.

## Estructura

- `index.html` — contenido y textos
- `styles.css` — tema claro seda: rosa `#F7D8D2/#ECC0B8`, vinotinto `#6E1428/#7E1E32`,
  dorado champagne `#C99A4A/#E8C987`. Tipografías Great Vibes / Playfair / Cormorant
- `script.js` — countdown a 14-11-2026 19:30, pétalos, sobre de apertura, lightbox, música
- `netlify.toml` — config de deploy (sin redirects: es sitio estático, no SPA)
- `music/vals.mp3` — vals de fondo

## Datos del evento

- **Quinceañera:** Ana Victoria Sarmiento Pereira
- **Fecha:** Sábado 14 Noviembre 2026, 7:30 PM
- **Salón:** Aguasanta, Sector Terepaima, Aguaviva, Cabudare
- **Maps:** https://maps.app.goo.gl/TqyJQEDRbFRrQ9aJ7
