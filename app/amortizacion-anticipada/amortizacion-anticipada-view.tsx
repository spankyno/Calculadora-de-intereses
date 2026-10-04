"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalculatorForm } from "@/components/calculators/early-repayment/calculator-form";
import { ComparisonPanel } from "@/components/calculators/early-repayment/comparison-panel";
import {
  calculateBaseLoan,
  compareEarlyRepaymentStrategies,
  createDefaultBaseLoanInput,
  createDefaultEarlyRepaymentInput,
  type BaseLoanInput,
  type EarlyRepaymentInput,
} from "@/lib/calculators/early-repayment";

export function AmortizacionAnticipadaView() {
  const [loanInput, setLoanInput] = React.useState<BaseLoanInput>(
    createDefaultBaseLoanInput()
  );
  const baseResult = React.useMemo(() => calculateBaseLoan(loanInput), [loanInput]);

  const [earlyInput, setEarlyInput] = React.useState<EarlyRepaymentInput>(
    createDefaultEarlyRepaymentInput(baseResult.totalMonths)
  );

  const comparison = React.useMemo(
    () => compareEarlyRepaymentStrategies(baseResult, earlyInput),
    [baseResult, earlyInput]
  );

  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        {/* Hero */}
        <section className="pb-10 pt-4 sm:pb-14 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 text-gold" />
            Amortización anticipada · Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            ¿Reducir cuota o reducir plazo?
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Simula una aportación extra sobre tu préstamo o hipoteca y
            compara las dos estrategias de amortización anticipada,
            cuadro de amortización incluido para cada una.
          </p>
        </section>

        {/* Calculadora principal */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit animate-fade-up">
            <CardHeader>
              <CardTitle>Préstamo y aportación</CardTitle>
              <CardDescription>
                Los resultados se actualizan al instante mientras escribes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalculatorForm
                loanInput={loanInput}
                onLoanChange={setLoanInput}
                earlyInput={earlyInput}
                onEarlyChange={setEarlyInput}
                totalMonths={baseResult.totalMonths}
              />
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <CardHeader>
              <CardTitle>Comparativa de estrategias</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonPanel comparison={comparison} />
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
