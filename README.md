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
| Interés compuesto | `/interes-compuesto` | Capitalización compuesta, TAE real, frecuencia configurable, comparativa |

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
