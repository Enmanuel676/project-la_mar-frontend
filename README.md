# Frontend · La Mar Joyería

**Web en producción:** <https://lamarjoyeria.mooo.com>

Sitio público de la joyería **La Mar**, el taller de Darelis Batista: presenta el taller, muestra
el catálogo de joyas disponibles y publica precios aproximados del oro. Los artículos del
catálogo se gestionan desde el panel de administración (`project-la_mar-administration`) y
llegan a través de la API de `project-la_mar-backend`.

## Páginas

- **Inicio** (`/`): indica si la tienda está abierta o cerrada según su horario (hora de Cuba).
  Debajo, un anillo gira al ritmo del scroll mientras pasan cuatro tarjetas que aparecen y se
  disuelven en píxeles: _Sobre mí_, _En el taller_, _Ubicación_ (con mapa de Google Maps) y
  _Tasación_. Termina con un acceso directo a WhatsApp.
- **Catálogo** (`/catalogo`): los artículos publicados desde el panel, con foto, nombre,
  descripción y precio en su moneda (USD o CUP). Al tocar una foto se abre ampliada en una
  ventana que se cierra con la cruz, tocando fuera o con `Esc`.
- **Informes de precios** (`/informes-precios`): precio aproximado del oro por gramo para 10k,
  14k, 18k y 22k, como prenda (venta) y como chatarra (compra), con la fecha de la última
  actualización y un botón para pedir el precio exacto por WhatsApp.
- **Página 404** para cualquier otra dirección.

En móvil, los enlaces pasan a un menú desplegable que se cierra con la cruz, tocando fuera o con
`Esc`. Con la opción del sistema «reducir movimiento», las tarjetas y el menú aparecen sin
animación.

### El anillo según la conexión

Antes de mostrar el anillo, Inicio mide la velocidad de conexión descargando
`public/network-probe.bin` (192 KB) y elige una de tres versiones:

- **normal**: el giro completo (240 fotogramas).
- **medium**: solo el brillo de la gema (23 fotogramas).
- **low**: una imagen fija, sin animación.

Los fotogramas se dibujan en un `<canvas>` según la posición del scroll y se quedan en memoria:
al volver a Inicio desde otra página no se descargan de nuevo.

## Stack

- React 19 con Vite 8
- React Router 8 (paquete `react-router`) para las rutas
- CSS plano, un archivo por componente, con nombres BEM
- ESLint (con los plugins de React Hooks y React Refresh)
- Tipografías Montserrat y Playfair Display, e iconos Material Symbols (Google Fonts)
- `gh-pages` para publicar en GitHub Pages

## Estructura

```
src/
  main.jsx                   punto de entrada
  App.jsx                    rutas (React Router), barra de navegación y pie de página
  index.css                  variables de diseño y estilos base
  data/content.js            constantes: enlaces, WhatsApp, URL de la API, ajustes de precios
  lib/
    formatPrice.js           formato de precios en USD y CUP
    storeHours.js            horario de la tienda y estado Abierto / Cerrado
    networkTier.js           mide la conexión para elegir la versión del anillo
    ringFrames.js            descarga y guarda en memoria los fotogramas del anillo
    pixelDissolve.js         disolución en píxeles de las tarjetas y del menú móvil
  components/                cada uno en su carpeta, con su .jsx y su .css
    Navbar/  MobileMenu/  Footer/  HomeHeader/  RingScroll/  PixelCard/  ContactCta/
    ImageModal/  PageLoader/  PriceTable/  AmbientGlow/
    cards/                   AboutMeCard, CraftCard, LocationCard y AppraisalCard
  pages/                     Home, Catalog, PriceReport y NotFound
public/
  ring-frames/               fotogramas del anillo (normal, medium y low)
  network-probe.bin          archivo de prueba para medir la conexión
  404.html                   redirección para que las rutas funcionen en GitHub Pages
scripts/
  update-gold-prices.js      genera public/gold-prices.json con el precio del oro
  build-ring-frames.py       genera public/ring-frames/ a partir de media/
media/                       videos e imagen originales del anillo
dist/                        build de producción (lo genera `npm run build`)
```

## Puesta en marcha

Requisitos: Node.js 20.19+ o 22.12+ (lo exige Vite 8). Para ver el catálogo, el backend
encendido (ver `project-la_mar-backend/README.md`).

```bash
npm install
npm run dev
```

Vite sirve el sitio en `http://localhost:5173/project-la_mar-frontend/`: la ruta sale del
`base` de `vite.config.js`.

## Scripts

- `npm run dev`: actualiza el precio del oro y arranca el servidor de desarrollo con recarga en
  caliente.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: sirve localmente el build de producción.
- `npm run lint`: revisa el código con ESLint.
- `npm run deploy`: publica `dist/` en la rama `gh-pages` (GitHub Pages). Antes hay que
  ejecutar `npm run build`.
- `npm run gold:update`: actualiza el precio del oro (ver más abajo).

## Conexión con el backend

El catálogo pide `GET /public/articles`, una ruta pública de la API (sin token) que devuelve solo
los artículos publicados y fuera de la papelera. La dirección se arma en `src/data/content.js`
(`CATALOG_API_URL`) a partir de la variable `VITE_API_URL`:

- Si no está definida, se usa `http://localhost:3000/api`, el backend en local. Si el backend
  escucha en otro puerto, define `VITE_API_URL` con esa dirección.
- En producción se compila con `VITE_API_URL=https://api.lamarjoyeria.mooo.com/api`.

Si la API no responde, el catálogo lo dice con un mensaje en lugar de quedarse vacío.

## Precio del oro

Alpha Vantage no permite pedir el precio desde el navegador (no envía cabeceras CORS), así que lo
pide un script de Node. `scripts/update-gold-prices.js` consulta el precio spot de la onza, lo
pasa a precio por gramo según el quilataje y escribe `public/gold-prices.json` (no se sube a
git). La página lee ese archivo y le aplica las diferencias de venta y de compra de chatarra de
`src/data/content.js` (`GOLD_SELL_DIFFERENCES` y `SCRAP_BUY_DIFFERENCES`). No hay precios por
defecto: mientras cargan, las tablas muestran «—»; si el archivo no se puede leer, se quedan así
y la página avisa del fallo, para no enseñar nunca precios viejos como si fueran del día.

- `npm run dev` ejecuta antes `npm run gold:update -- --once` (script `predev`): así, en un
  clon recién descargado, «Informes de precios» ya tiene los precios del día. Si Alpha Vantage
  no responde, avisa en la terminal y el servidor de desarrollo arranca igual.
- `npm run gold:update` hace una petición al arrancar y después una al día, a las 9:00. Sirve
  para dejarlo corriendo en otra terminal si el servidor de desarrollo pasa días abierto.
- `npm run gold:update -- --once` hace una sola petición y termina. Es el modo pensado para un
  temporizador diario (systemd) en el servidor.
- Variables: `ALPHA_VANTAGE_API_KEY` (la clave de Alpha Vantage; si no se define, se usa la que
  trae el script) y `GOLD_PRICES_PATH` (dónde escribir el JSON; en el servidor, el archivo que
  sirve Nginx).

## Fotogramas del anillo

`scripts/build-ring-frames.py` genera las tres secuencias WebP de `public/ring-frames/` a partir
de los originales de `media/`. Necesita ffmpeg y Pillow (`pip install pillow`).

```bash
python3 scripts/build-ring-frames.py              # las tres versiones
python3 scripts/build-ring-frames.py medium low   # solo las indicadas
```

## Despliegue

**Producción** (<https://lamarjoyeria.mooo.com>): Nginx sirve el contenido de `dist/` como sitio
estático. `vite.config.js` está preparado para GitHub Pages, así que para la raíz de un dominio
hay que compilar cambiando el `base`:

```bash
VITE_API_URL=https://api.lamarjoyeria.mooo.com/api npx vite build --base=/
```

Nginx debe responder con `index.html` a cualquier ruta (por ejemplo `try_files $uri /index.html;`)
para que `/catalogo` o `/informes-precios` funcionen al entrar directamente o al recargar.

**GitHub Pages**: el `base` de `vite.config.js` es `/project-la_mar-frontend/`, la ruta del sitio
de este repositorio. Se publica con `npm run build` y `npm run deploy`. Como GitHub Pages no
conoce las rutas de React, `public/404.html` redirige a `index.html` y un script de `index.html`
restaura la dirección real antes de que la lea React Router.
