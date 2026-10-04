"use client";

import * as React from "react";
import { Sparkles, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalculatorForm } from "@/components/calculators/mortgage/calculator-form";
import { ResultsPanel } from "@/components/calculators/mortgage/results-panel";
import {
  calculateMortgage,
  createDefaultMortgageInput,
  type MortgageInput,
} from "@/lib/calculators/mortgage";

export function HipotecaView() {
  const [input, setInput] = React.useState<MortgageInput>(
    createDefaultMortgageInput()
  );

  const result = React.useMemo(() => calculateMortgage(input), [input]);

  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        {/* Hero */}
        <section className="pb-10 pt-4 sm:pb-14 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 text-gold" />
            Hipoteca · Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Tu hipoteca, cuota a cuota
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Sistema de amortización francés con tipo fijo o variable
            (Euríbor + diferencial), TAE real, cuadro de amortización
            completo y un simulador de amortización anticipada.
          </p>
        </section>

        {/* Calculadora principal */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit animate-fade-up">
            <CardHeader>
              <CardTitle>Datos de la hipoteca</CardTitle>
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
              <div className="flex items-center justify-between">
                <CardTitle>Resultado</CardTitle>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  En tiempo real
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResultsPanel input={input} result={result} />
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
