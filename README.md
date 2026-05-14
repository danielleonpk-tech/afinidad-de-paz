# afiniPaz — Paz y conflicto armado · CAPAZ

Aplicación web (SPA) del Instituto Colombo‑Alemán para la Paz (CAPAZ) para que la ciudadanía compare sus posiciones, ítem por ítem, con las de los cinco principales candidatos a la Presidencia de Colombia 2026 en el eje de paz y conflicto armado.

- **Tiempo estimado:** 5 a 7 minutos
- **Tecnologías:** HTML estático + React (vía CDN) + Tailwind (CDN). Sin _build step_.

---

## Estructura del proyecto

```
.
├── index.html              ← Punto de entrada (incluye meta OpenGraph para previsualización en redes)
├── src/
│   ├── data.jsx            ← Matriz candidato × ítem y algoritmo de afinidad
│   ├── ui.jsx              ← Primitivas de UI (botones, modales, barras…)
│   ├── screens.jsx         ← Bienvenida, demografía, priorización, ítems
│   ├── results.jsx         ← Pantalla de resultados
│   └── app.jsx             ← Estado y navegación
├── assets/
│   ├── capaz-logo.png      ← Logo institucional
│   ├── favicon.png         ← Favicon
│   ├── og-image.png        ← Imagen de previsualización en redes (1200×630)
│   └── candidates/         ← Fotos de los candidatos (cepeda.png, fajardo.png, lopez.png, valencia.png, espriella.png)
├── vercel.json             ← Configuración de despliegue
├── robots.txt
└── .gitignore
```

---

## Despliegue en Vercel

Hay dos rutas; elige la más cómoda.

### Ruta A — Importar desde GitHub (recomendada)

1. Crea un repositorio nuevo en GitHub (puede ser privado) y sube todos los archivos de este proyecto.
2. Entra a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub).
3. Click en **Add New… → Project**, selecciona el repositorio y pulsa **Import**.
4. Vercel detectará el proyecto como **Other / Static**. Deja todos los valores por defecto:
   - Framework Preset: *Other*
   - Build Command: *(vacío)*
   - Output Directory: *(vacío)*
   - Install Command: *(vacío)*
5. Pulsa **Deploy**. En 30–60 s tendrás una URL del tipo `https://encuesta-afinidad-paz-capaz.vercel.app`.

A partir de aquí, cada `git push` despliega automáticamente.

### Ruta B — Vercel CLI (sin GitHub)

```bash
npm i -g vercel
cd <esta carpeta>
vercel        # primera vez: crea el proyecto y hace un preview
vercel --prod # publica la versión definitiva
```

---

## Dominio personalizado (opcional, recomendado)

En el panel del proyecto en Vercel:

1. **Settings → Domains → Add**.
2. Ingresa el dominio que vayas a usar, por ejemplo `paz2026.instituto-capaz.org`.
3. Vercel te indicará un registro `CNAME` (o `A`) para configurar en tu DNS. Una vez propagado, el dominio queda activo con HTTPS automático.

> Tip: para campañas en Instagram, usa un dominio o subdominio corto y memorable. El logo y la previsualización OpenGraph ya están listos.

---

## Compartir desde Instagram, X, WhatsApp, etc.

`index.html` incluye etiquetas **OpenGraph** y **Twitter Card** apuntando a `assets/og-image.png` (1200×630). Eso significa que cualquier enlace que pegues mostrará una tarjeta de previsualización con el logo, un titular y los datos clave de la encuesta.

Para forzar a las redes a refrescar la previsualización tras un cambio:

- **Facebook/Instagram:** [Sharing Debugger](https://developers.facebook.com/tools/debug/) → pegar URL → *Scrape Again*.
- **X (Twitter):** [Card Validator](https://cards-dev.twitter.com/validator).
- **WhatsApp/Telegram:** suelen cachear por 24 h; añadir `?v=2` al final de la URL fuerza un refetch.

---

## Privacidad y datos

- La aplicación es **completamente del lado del cliente**: el cálculo de afinidad ocurre en el navegador. No hay backend ni base de datos.
- Las respuestas se persisten en `localStorage` del propio dispositivo (clave `capaz_encuesta_v1.1`) para permitir reanudar la encuesta. Se borran desde la pantalla de resultados.
- No se recolecta ningún dato identificador.

Si en el futuro deseas guardar respuestas agregadas para investigación, las opciones recomendadas son:

- **Supabase** (free tier) con una tabla `responses` y una `INSERT` al terminar la encuesta.
- **Vercel KV** o **Vercel Postgres** desde una `/api` route — exigirá convertir el proyecto a uno con función serverless, mínimo trabajo.

---

## Iteraciones futuras

- Tras la primera vuelta del 31 de mayo de 2026, se sugiere bloquear la matriz una semana antes y publicar una **versión actualizada para segunda vuelta** (21 de junio) con dos finalistas.
- Cualquier cambio en posiciones de candidatos se aplica únicamente en `src/data.jsx` (constante `MATRIX`) — el resto del código no requiere modificación.

---

*Instrumento elaborado para el Instituto Colombo‑Alemán para la Paz (CAPAZ). No es una encuesta de intención de voto ni una recomendación electoral.*
