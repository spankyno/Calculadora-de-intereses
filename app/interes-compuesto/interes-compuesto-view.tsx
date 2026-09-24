"use client";

import * as React from "react";
import { Sparkles, PlusCircle, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalculatorForm } from "@/components/calculators/compound-interest/calculator-form";
import { ResultsPanel } from "@/components/calculators/compound-interest/results-panel";
import { ComparisonSection } from "@/components/calculators/compound-interest/comparison-section";
import {
  calculateCompoundInterest,
  createDefaultCompoundScenario,
  type CompoundInterestInput,
  type CompoundInterestScenario,
} from "@/lib/calculators/compound-interest";
import { generateId } from "@/lib/utils";

export function InteresCompuestoView() {
  const [input, setInput] = React.useState<CompoundInterestInput>(
    createDefaultCompoundScenario("Escenario actual").input
  );
  const [scenarios, setScenarios] = React.useState<CompoundInterestScenario[]>(
    []
  );

  const result = React.useMemo(
    () => calculateCompoundInterest(input),
    [input]
  );

  const handleAddToComparison = () => {
    setScenarios((prev) => [
      ...prev,
      {
        id: generateId(),
        name: `Escenario ${prev.length + 1}`,
        input: { ...input },
      },
    ]);
  };

  const handleRemoveScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRenameScenario = (id: string, name: string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  const isInputValid =
    input.principal > 0 && input.annualRate >= 0 && input.duration > 0;

  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        {/* Hero */}
        <section className="pb-10 pt-4 sm:pb-14 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 text-gold" />
            Interés compuesto · Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Descubre el poder del interés compuesto
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Calcula cómo se capitalizan tus intereses periodo a periodo, con
            la TAE real, el desglose fiscal y el capital final. Compara
            distintas frecuencias de capitalización lado a lado.
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

              <Button
                onClick={handleAddToComparison}
                disabled={!isInputValid}
                className="mt-8 w-full gap-2"
                size="lg"
              >
                <PlusCircle className="h-4 w-4" />
                Añadir a comparativa
              </Button>
            </CardContent>
          </Card>

          <Card
            className="animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
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
              <ResultsPanel result={result} principal={input.principal} />
            </CardContent>
          </Card>
        </section>

        {/* Comparativa */}
        <section className="mt-14 sm:mt-20">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight">
                Modo comparativa
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Guarda distintos escenarios y descubre cuál rinde más.
              </p>
            </div>
            {scenarios.length > 0 && (
              <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground sm:inline-block">
                {scenarios.length}{" "}
                {scenarios.length === 1 ? "escenario" : "escenarios"}
              </span>
            )}
          </div>
          <ComparisonSection
            scenarios={scenarios}
            onRemove={handleRemoveScenario}
            onRename={handleRenameScenario}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
