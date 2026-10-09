# 💰 Calculadora de Intereses

Una calculadora de interés simple premium, rápida e intuitiva, pensada para depósitos e inversiones en España. Calcula el desglose fiscal completo (TIN mensual/trimestral/semestral, retención de Hacienda, intereses netos) en tiempo real y permite comparar varios escenarios lado a lado.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características

- **Cálculo en tiempo real** — capital, TIN anual, duración (días/meses/años) y retención fiscal, con resultados instantáneos.
- **Desglose fiscal completo** — intereses brutos, retención (19/21/23% o personalizada), intereses netos, capital final bruto y neto.
- **TIN equivalentes** — mensual, trimestral y semestral calculados automáticamente.
- **Modo comparativa** — añade varios escenarios y compáralos en una tabla (desktop) o cards (móvil), con indicador visual de la mejor opción.
- **Exportación** — copia un resumen al portapapeles o exporta la comparativa a PDF vía impresión del navegador.
- **Diseño premium** — estética fintech (inspirada en Mercury, Stripe, Revolut), tipografía editorial (Fraunces + Manrope), modo claro/oscuro, micro-animaciones sutiles.
- **100% en el cliente** — sin backend, sin base de datos, sin registro. Todo el cálculo ocurre en el navegador.
- **Formato español** — moneda y porcentajes con coma decimal y punto de miles (1.234,56 €).
- **Responsive y accesible** — mobile-first, labels asociadas, buen contraste, navegable por teclado.

## 🧮 Fórmulas

```
Interés bruto     = Capital × (TIN / 100) × (tiempo en años)
TIN mensual       = TIN anual / 12
TIN trimestral    = TIN anual / 4
TIN semestral     = TIN anual / 2
Retención         = Interés bruto × (% retención / 100)
Interés neto      = Interés bruto − Retención
Capital final     = Capital + Interés (bruto o neto)
```

La lógica de cálculo es pura, tipada y está aislada de la UI en [`lib/calculators/simple-interest.ts`](./lib/calculators/simple-interest.ts) y [`lib/calculators/compound-interest.ts`](./lib/calculators/compound-interest.ts), lo que la hace fácil de testear y reutilizar.

### Interés compuesto

```
Capital final bruto = Capital × (1 + TIN / (100 × n)) ^ (n × tiempo en años)
TAE (Tasa Anual Equivalente) = (1 + TIN / (100 × n)) ^ n − 1
```

donde `n` es el número de capitalizaciones por año (anual=1, semestral=2, trimestral=4, mensual=12, diaria=365). El resto del desglose (retención, intereses netos, capital final neto) sigue la misma lógica que el interés simple.

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + componentes propios estilo shadcn/ui |
| Primitivas accesibles | Radix UI (Select, Switch, Tooltip) |
| Iconos | lucide-react |
| Tema | next-themes (claro/oscuro) |
| Tipografía | Fraunces + Manrope (self-hosted vía `@fontsource`, sin llamadas a Google Fonts) |
| Estado | React hooks (sin librerías de estado externas) |
| Backend | Ninguno — 100% estático / client-side |

## 📁 Estructura del proyecto

```
├── app/
│   ├── layout.tsx                  # Layout raíz, metadata SEO, ThemeProvider
│   ├── page.tsx                    # Redirige a /depositos
│   ├── globals.css                 # Tokens de diseño (light/dark) y utilidades
│   ├── depositos/                  # Módulo "Depósitos" (interés simple)
│   ├── interes-compuesto/          # Módulo "Interés compuesto"
│   └── acerca-de/                  # Cómo funciona, módulos y stack técnico
├── components/
│   ├── calculators/
│   │   ├── simple-interest/        # UI del módulo Depósitos
│   │   └── compound-interest/      # UI del módulo Interés compuesto
│   ├── layout/                     # Header (navegación entre módulos) y footer
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ui/                         # Componentes base reutilizables (Button, Card, Input, StackedBar...)
├── lib/
│   ├── calculators/
│   │   ├── shared.ts               # Utilidades comunes (unidades de duración, ids...)
│   │   ├── simple-interest.ts      # Lógica de interés simple (pura, sin React)
│   │   └── compound-interest.ts    # Lógica de interés compuesto (pura, sin React)
│   ├── hooks/
│   │   └── use-number-input.ts     # Input numérico con formato español
│   └── utils.ts                    # Formateadores de moneda/porcentaje/número
└── public/
```

### Módulos disponibles

| Módulo | Ruta | Descripción |
|---|---|---|
| Depósitos | `/depositos` | Interés simple: TIN mensual/trimestral/semestral, retención, comparativa |
| Interés compuesto | `/interes-compuesto` | Capitalización compuesta, TAE real, frecuencia configurable, evolución anual, comparativa |
| TAE / TIN | `/tae-tin` | Conversor TIN ↔ TAE según frecuencia de liquidación |
| Comparativa de depósitos | `/comparativa-depositos` | Hasta 6 productos con plazo, TIN, comisiones, retención y capitalización (simple o compuesta) propios de cada uno |
| Préstamo personal | `/prestamo-personal` | Sistema de amortización francés: cuota mensual, TAE real (con comisión de apertura), tabla de amortización mensual exportable a CSV |
| Hipoteca | `/hipoteca` | Tipo fijo o variable (Euríbor + diferencial), TAE real, cuadro de amortización completo y simulador de amortización anticipada (reducir cuota vs. reducir plazo) |
| Amortización anticipada | `/amortizacion-anticipada` | Módulo dedicado: compara "reducir cuota" vs "reducir plazo" para cualquier préstamo o hipoteca, con cuadro de amortización completo y CSV descargable para cada estrategia |
| Letras del Tesoro | `/letras-tesoro` | Precio de adquisición al descuento, sobrante de la suscripción, importes brutos/netos y comparativa de rentabilidad entre los plazos de 3, 6, 9 y 12 meses |

El motor de amortización francesa (`lib/calculators/loan-math.ts`) y la tabla de amortización (`components/calculators/shared/amortization-table.tsx`) están compartidos entre Préstamo personal, Hipoteca y Amortización anticipada para no duplicar lógica. La tabla admite vista mes a mes o año a año, y exportación a CSV y a PDF (generado en el propio navegador con `jspdf` + `jspdf-autotable`, sin backend).

✅ **Hoja de ruta completa** — los 9 módulos planteados están disponibles. Nuevos módulos (p. ej. planes de pensiones, fondos indexados) pueden añadirse siguiendo el mismo patrón `lib/calculators/<nombre>.ts` + `components/calculators/<nombre>/` + `app/<nombre>/`, descrito más abajo en "Arquitectura pensada para crecer".

## 🔍 SEO

- **Open Graph / Twitter Cards por página**: cada uno de los 9 módulos tiene su propio `title`, `description`, `url` e imagen (`/public/og-image.png`, declarada como 1424×752), en vez de heredar los genéricos del layout raíz.
- **JSON-LD** (`WebSite` + `Person`) en `app/layout.tsx`, con `sameAs` enlazando el blog, el hub y el contacto del autor.
- **`sitemap.xml`** (`app/sitemap.ts`) y **`robots.txt`** (`app/robots.ts`), generados a partir de `lib/site-config.ts`.
- **`alternates.canonical`** en todas las páginas.
- **Favicon y apple-icon** generados en código (`app/icon.tsx`, `app/apple-icon.tsx`, vía `next/og`) con el mismo logo del header.
- **`manifest.webmanifest`** (`app/manifest.ts`) para instalación como PWA básica.
- **`rel="me"`** en los enlaces del autor (footer y sección "Autor" de `/acerca-de`) hacia blog, hub y contacto.

Toda la configuración (dominio, autor, enlaces) vive en un único sitio: `lib/site-config.ts`. El dominio de producción configurado es `https://calculadora-de-intereses-coral.vercel.app` (sin barra final: se concatena con las rutas).

> Si cambias de dominio, edita `SITE_URL` en `lib/site-config.ts`: de él salen las URLs canónicas, el sitemap y las rutas absolutas de las imágenes Open Graph. Si sustituyes `og-image.png` por otra de distinto tamaño, actualiza también `width`/`height` en `app/layout.tsx` y en los `page.tsx` de cada módulo.

## 🔒 Seguridad

El proyecto usa **Next.js 16** (actualizado desde 14 durante el desarrollo tras detectar que `npm audit` reportaba vulnerabilidades, incluida una crítica, sin parche disponible en ninguna versión de la rama 14.x ni 15.x).

`npm audit --omit=dev` — las dependencias que realmente se publican en la app — no reporta **ninguna** vulnerabilidad (se actualizó `source-map-js` a 1.2.2 para corregir un aviso de severidad alta que afectaba a `postcss`, dependencia de Next.js). `npm audit` a secas sí reporta hallazgos de severidad alta/moderada, pero todos están confinados a herramientas de *desarrollo* (el watcher de archivos de Tailwind CSS y la resolución de patrones glob de ESLint, vía las cadenas `braces` → `chokidar`/`micromatch` y `postcss-nested` → `postcss-selector-parser`), que no se ejecutan nunca en la aplicación desplegada ni procesan datos de usuarios: solo los propios archivos del proyecto durante `npm run build`/`npm run dev`. Se revisarán cuando Tailwind CSS publique una versión 3.x que corrija la cadena, o al evaluar la migración a Tailwind 4.

### Arquitectura pensada para crecer

Cada calculadora sigue el patrón `components/calculators/<nombre>/` + `lib/calculators/<nombre>.ts`, con su propia ruta en `app/<nombre>/`. Añadir un nuevo módulo (préstamos, hipotecas...) implica:

1. Crear `lib/calculators/<nombre>.ts` con la lógica pura y sus tipos (reutilizando `lib/calculators/shared.ts` cuando aplique).
2. Crear `components/calculators/<nombre>/` con el formulario, resultados, gráfico y comparativa, reutilizando los componentes de `components/ui/`.
3. Crear `app/<nombre>/page.tsx` (metadata SEO) + `app/<nombre>/<nombre>-view.tsx` (vista cliente interactiva).
4. Añadir la entrada correspondiente al array `MODULE_LINKS` en `components/layout/site-header.tsx`.

Los componentes de `components/ui/` (Button, Card, Input, Select, Switch, Tooltip, StackedBar...) son genéricos y se reutilizan en cualquier calculadora futura.

## 🚀 Desarrollo local

### Requisitos

- Node.js 18.17 o superior
- npm (o pnpm/yarn si prefieres)

### Instalación

```bash
git clone https://github.com/tu-usuario/calculadora-de-intereses.git
cd calculadora-de-intereses
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador. Los cambios se reflejan al instante.

### Compilar para producción

```bash
npm run build
npm run start
```

### Linter

```bash
npm run lint
```

## ☁️ Despliegue (gratis)

### Opción A — Vercel (recomendada)

1. Sube el repositorio a GitHub.
2. Entra en [vercel.com](https://vercel.com), pulsa **"Add New Project"** e importa el repositorio.
3. Vercel detecta Next.js automáticamente — no hace falta configurar nada. Pulsa **Deploy**.
4. Cada `git push` a `main` despliega automáticamente.

También puedes usar la CLI:

```bash
npm i -g vercel
vercel
```

### Opción B — Cloudflare Pages

1. Sube el repositorio a GitHub.
2. En el dashboard de Cloudflare, ve a **Workers & Pages → Create → Pages → Connect to Git**.
3. Configura:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
4. Guarda y despliega.

No se necesita ninguna variable de entorno, base de datos ni clave de API: la aplicación es 100% estática/client-side.

## ♿ Accesibilidad

- Todos los campos tienen `<label>` asociada.
- Contraste AA en modo claro y oscuro.
- Navegación completa por teclado (inputs, selects, botones, tooltips).
- `aria-label` en controles icon-only (tema, eliminar escenario, tooltips de ayuda).

## ⚠️ Aviso legal

Esta herramienta ofrece una estimación orientativa con fines informativos y no constituye asesoramiento financiero ni fiscal. Consulta siempre las condiciones exactas de tu entidad bancaria y la normativa fiscal vigente antes de tomar decisiones de inversión.

## 📄 Licencia

MIT — libre para usar, modificar y distribuir.
