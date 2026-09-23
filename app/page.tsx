"use client";

import * as React from "react";
import { Sparkles, PlusCircle, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalculatorForm } from "@/components/calculators/simple-interest/calculator-form";
import { ResultsPanel } from "@/components/calculators/simple-interest/results-panel";
import { ComparisonSection } from "@/components/calculators/simple-interest/comparison-section";
import {
  calculateSimpleInterest,
  createDefaultScenario,
  type SimpleInterestInput,
  type SimpleInterestScenario,
} from "@/lib/calculators/simple-interest";
import { generateId } from "@/lib/utils";

export default function Home() {
  const [input, setInput] = React.useState<SimpleInterestInput>(
    createDefaultScenario("Escenario actual").input
  );
  const [scenarios, setScenarios] = React.useState<SimpleInterestScenario[]>(
    []
  );

  const result = React.useMemo(() => calculateSimpleInterest(input), [input]);

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
            Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Descubre cuánto rinde realmente tu dinero
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Calcula intereses simples de depósitos e inversiones con el
            desglose fiscal exacto: TIN mensual, trimestral y semestral,
            retención de Hacienda e intereses netos. Compara varios
            escenarios lado a lado.
          </p>
        </section>

        {/* Calculadora principal */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit animate-fade-up">
            <CardHeader>
              <CardTitle>Datos del depósito</CardTitle>
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

        {/* Roadmap de próximas calculadoras */}
        <section className="mt-16 sm:mt-24">
          <div className="rounded-2xl border border-dashed border-border p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Próximamente
            </p>
            <h3 className="mt-1.5 font-display text-xl font-medium">
              Más herramientas financieras en camino
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Interés compuesto",
                "Préstamos",
                "Hipotecas",
                "Planes de pensiones",
              ].map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
