"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalculatorForm } from "@/components/calculators/treasury-bills/calculator-form";
import { ResultsSection } from "@/components/calculators/treasury-bills/results-section";
import {
  calculateAllTreasuryBills,
  createDefaultTreasuryBillsInput,
  type TreasuryBillsInput,
} from "@/lib/calculators/treasury-bills";

export function LetrasTesoroView() {
  const [input, setInput] = React.useState<TreasuryBillsInput>(
    createDefaultTreasuryBillsInput()
  );

  const results = React.useMemo(() => calculateAllTreasuryBills(input), [input]);

  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        {/* Hero */}
        <section className="pb-10 pt-4 sm:pb-14 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 text-gold" />
            Letras del Tesoro · Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Letras del Tesoro, plazo a plazo
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Introduce el capital que quieres destinar y compara de un
            vistazo los 4 plazos habituales (3, 6, 9 y 12 meses): nº de
            letras, sobrante de la suscripción, impuestos e importe neto
            al vencimiento.
          </p>
        </section>

        {/* Calculadora principal */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit animate-fade-up">
            <CardHeader>
              <CardTitle>Datos de la inversión</CardTitle>
              <CardDescription>
                Los resultados se actualizan al instante mientras escribes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalculatorForm input={input} onChange={setInput} />
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <CardHeader>
              <CardTitle>Comparativa por plazo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsSection results={results} />
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
