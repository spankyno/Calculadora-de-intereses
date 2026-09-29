"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConverterForm } from "@/components/calculators/tae-converter/converter-form";
import { ConverterResultPanel } from "@/components/calculators/tae-converter/converter-result-panel";
import {
  calculateConversion,
  type ConverterInput,
} from "@/lib/calculators/tae-converter";

export function TaeTinView() {
  const [input, setInput] = React.useState<ConverterInput>({
    mode: "tin-to-tae",
    value: 3.5,
    frequency: "mensual",
  });

  const result = React.useMemo(() => calculateConversion(input), [input]);

  return (
    <div className="pb-20">
      <SiteHeader />

      <main className="container">
        {/* Hero */}
        <section className="pb-10 pt-4 sm:pb-14 sm:pt-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
            <Zap className="h-3 w-3 text-gold" />
            TAE / TIN · Cálculo instantáneo, sin registro
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Convierte TIN y TAE al instante
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Pasa de TIN nominal a TAE real, o al revés, según la frecuencia
            de liquidación. Ideal para comparar productos que anuncian sus
            tipos de forma distinta.
          </p>
        </section>

        {/* Conversor */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit animate-fade-up">
            <CardHeader>
              <CardTitle>Datos de conversión</CardTitle>
              <CardDescription>
                El resultado se actualiza al instante mientras escribes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConverterForm input={input} onChange={setInput} />
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <ConverterResultPanel
                mode={input.mode}
                inputValue={input.value}
                frequency={input.frequency}
                result={result}
              />
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
