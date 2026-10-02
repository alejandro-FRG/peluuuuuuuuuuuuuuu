# Barbería Ateneo — web + sistema de reservas (demo funcional)

Web para una barbería frente al Ateneo de La Calzada (Gijón). HTML, CSS y
JavaScript puro, sin frameworks ni build step: se abre y funciona tal cual,
y se sube a GitHub Pages en cinco minutos.

## Qué incluye

- `index.html` — la web pública: hero, servicios, cortes, barbas, el
  peluquero, antes/después, galería, ubicación y el flujo completo de
  reserva de cita.
- `admin.html` — panel del peluquero: ver citas por día, cancelarlas,
  marcarlas como realizadas y bloquear horarios manualmente.
- `css/style.css` — todos los estilos.
- `js/data.js` — **el fichero que se edita a mano del día a día**: nombre
  del negocio, precios, servicios, cortes, barbas y textos de la galería.
- `js/store.js` — el "backend" de la demo: guarda citas y bloqueos en
  `localStorage` del navegador. Mismo nombre de funciones que tendría una
  futura API, para poder sustituirlo por Supabase/Firebase sin tocar
  `app.js` ni `admin.js`.
- `js/app.js` — toda la interacción de la web pública (menús, filtros,
  modales, galería, antes/después, el asesor "No sé qué hacerme" y el
  flujo de reserva).
- `js/admin.js` — lógica del panel del peluquero.
- `js/placeholders.js` — genera las imágenes de marcador de posición.

## Sobre las fotos

Esta demo **no lleva fotografías reales del local todavía** — no las
tenemos. En vez de rellenar con fotos de stock o imágenes generadas por
IA (que es justo lo que este proyecto quería evitar), se generan
marcadores visuales limpios en los colores de la marca con el nombre de
lo que debería ir en cada hueco.

Para poner las fotos reales cuando se haga la sesión de fotos:
1. Guarda las imágenes en `assets/img/` (ya existe la carpeta).
2. En `index.html`, cambia cada `<img data-ph="N" data-ph-label="...">`
   por `<img src="assets/img/nombre-del-archivo.jpg" alt="...">`.
3. Todo lo demás (modales, galería a pantalla completa, antes/después,
   recomendaciones del asesor) sigue funcionando igual, porque todo
   consume la URL de la imagen, no cómo se genera.

## Cómo subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `barberia-ateneo`).
2. Desde esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Primera versión de la web"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/barberia-ateneo.git
   git push -u origin main
   ```
3. En GitHub → *Settings* → *Pages* → en "Source" elige la rama `main` y
   la carpeta `/ (root)`. Guarda.
4. En un par de minutos la web estará en
   `https://TU-USUARIO.github.io/barberia-ateneo/`.

## Cosas que faltan antes de venderla como definitiva

- Fotos reales del local y del peluquero (ver arriba).
- Mapa de Google Maps embebido en la sección de ubicación, en cuanto se
  tenga la dirección exacta y una API key.
- Conectar `store.js` a una base de datos real (Supabase/Firebase) para
  que las citas no dependan del navegador del cliente y se puedan enviar
  emails/WhatsApp de confirmación automáticos.
- Login real en `/admin` (la ruta ya está separada y lista para añadirlo).
- Redactar el aviso de privacidad y la política de cancelación definitivos.

## Notas de diseño

Paleta pensada para alejarse del típico "barbería = negro + dorado":
greige cálido, negro suave, verde pino como acento y un toque de cuero.
Tipografía `Fraunces` (con carácter, para titulares) combinada con
`Inter` (para todo lo demás). Mobile-first: la barra de "Reservar cita"
fija abajo solo aparece en móvil, donde entrará la mayoría de clientes.
