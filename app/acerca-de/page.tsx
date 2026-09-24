import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Scale,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Cómo funciona la Calculadora de Intereses, qué módulos incluye y con qué tecnología está construida.",
};

const HOW_IT_WORKS = [
  {
    icon: Calculator,
    title: "Interés simple, con precisión",
    description:
      "Introduces capital, TIN anual, duración y retención fiscal. La app aplica la fórmula del interés simple (Capital × TIN × tiempo) y calcula al instante el TIN mensual, trimestral y semestral, los intereses brutos y netos, y el capital final.",
  },
  {
    icon: Sparkles,
    title: "Todo en tiempo real",
    description:
      "No hay botón de \"calcular\": cada cambio en el formulario recalcula y redibuja los resultados y los gráficos de forma instantánea, directamente en tu navegador.",
  },
  {
    icon: Scale,
    title: "Modo comparativa",
    description:
      "Puedes guardar varios escenarios (distintos depósitos, plazos o TIN) y compararlos lado a lado en una tabla, en tarjetas o en un gráfico de barras, con la mejor opción destacada automáticamente.",
  },
  {
    icon: ShieldCheck,
    title: "Privado por diseño",
    description:
      "No hay backend, ni base de datos, ni registro: todos los cálculos ocurren en tu dispositivo y ningún dato sale de tu navegador.",
  },
];

const MODULES = [
  { name: "Depósitos (interés simple)", status: "Disponible" as const },
  { name: "Interés compuesto", status: "Disponible" as const },
  { name: "Préstamos", status: "Próximamente" as const },
  { name: "Hipotecas", status: "Próximamente" as const },
  { name: "Planes de pensiones", status: "Próximamente" as const },
];

const STACK = [
  { layer: "Framework", tech: "Next.js 14 (App Router)" },
  { layer: "Lenguaje", tech: "TypeScript" },
  { layer: "Estilos", tech: "Tailwind CSS + componentes propios estilo shadcn/ui" },
  { layer: "Primitivas accesibles", tech: "Radix UI (Select, Switch, Tooltip)" },
  { layer: "Iconos", tech: "lucide-react" },
  { layer: "Tema claro/oscuro", tech: "next-themes" },
  { layer: "Tipografía", tech: "Fraunces + Manrope (self-hosted, sin Google Fonts)" },
  { layer: "Estado", tech: "React hooks — sin librerías de estado externas" },
  { layer: "Backend", tech: "Ninguno — 100% estático y del lado del cliente" },
  { layer: "Despliegue", tech: "Vercel / Cloudflare Pages" },
];

export default function AcercaDePage() {
  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        <div className="pb-10 pt-8 sm:pb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a la calculadora
          </Link>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-balance sm:text-4xl">
            Acerca de Calculadora de Intereses
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Una herramienta gratuita, precisa y sin registro para entender
            cuánto rinde realmente tu dinero, con el desglose fiscal español
            explicado de forma clara.
          </p>
        </div>

        {/* Cómo funciona */}
        <section className="pb-14">
          <h2 className="mb-5 font-display text-xl font-medium tracking-tight">
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent className="p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-medium">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
            <p>Interés bruto = Capital × (TIN / 100) × (tiempo en años)</p>
            <p>TIN mensual = TIN anual / 12 · trimestral = TIN anual / 4 · semestral = TIN anual / 2</p>
            <p>Interés neto = Interés bruto − (Interés bruto × % retención / 100)</p>
          </div>
        </section>

        {/* Módulos */}
        <section className="pb-14">
          <div className="mb-5 flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-xl font-medium tracking-tight">
              Módulos
            </h2>
          </div>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {MODULES.map((mod) => (
                <div
                  key={mod.name}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <span className="text-sm font-medium">{mod.name}</span>
                  <span
                    className={
                      mod.status === "Disponible"
                        ? "rounded-full bg-gain-soft px-2.5 py-1 text-[11px] font-semibold text-gain"
                        : "rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                    }
                  >
                    {mod.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Stack tecnológico */}
        <section className="pb-14">
          <h2 className="mb-5 font-display text-xl font-medium tracking-tight">
            Stack tecnológico
          </h2>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {STACK.map((row) => (
                <div
                  key={row.layer}
                  className="flex flex-col gap-0.5 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.layer}
                  </span>
                  <span className="text-sm text-foreground">{row.tech}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Aviso legal */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aviso legal</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground">
              Esta herramienta ofrece una estimación orientativa con fines
              informativos y no constituye asesoramiento financiero ni
              fiscal. Consulta siempre las condiciones exactas de tu entidad
              bancaria y la normativa fiscal vigente antes de tomar
              decisiones de inversión.
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
