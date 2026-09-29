"use client";

import { Sparkles } from "lucide-react";
import {
  COMPOUNDING_FREQUENCY_LABELS,
  type ConversionMode,
  type ConverterResult,
} from "@/lib/calculators/tae-converter";
import type { CompoundingFrequency } from "@/lib/calculators/shared";
import { cn, formatPercent } from "@/lib/utils";

interface ConverterResultPanelProps {
  mode: ConversionMode;
  inputValue: number;
  frequency: CompoundingFrequency;
  result: ConverterResult;
}

export function ConverterResultPanel({
  mode,
  inputValue,
  frequency,
  result,
}: ConverterResultPanelProps) {
  const outputLabel = mode === "tin-to-tae" ? "TAE resultante" : "TIN nominal equivalente";
  const inputLabel = mode === "tin-to-tae" ? "TIN nominal" : "TAE";
  const equivalentLabel = mode === "tin-to-tae" ? "TAE" : "TIN";

  return (
    <div className="space-y-8">
      {/* Resultado hero */}
      <div className="relative overflow-hidden rounded-2xl bg-hero px-6 py-8 text-hero-foreground sm:px-10 sm:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary/30 blur-3xl"
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-hero-foreground/60">
          {outputLabel}
        </p>
        <p className="relative mt-2 font-display text-4xl font-medium tabular-nums text-balance sm:text-5xl">
          {formatPercent(result.primaryResult)}
        </p>
        <div className="relative mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-hero-foreground/70">
          <span>
            {inputLabel}{" "}
            <span className="font-semibold text-hero-foreground">
              {formatPercent(inputValue)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Liquidación{" "}
            <span className="font-semibold text-gold">
              {COMPOUNDING_FREQUENCY_LABELS[frequency]}
            </span>
          </span>
        </div>
      </div>

      {/* Equivalencias por frecuencia */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {equivalentLabel} equivalente según frecuencia de liquidación
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {result.equivalents.map((eq) => (
            <div
              key={eq.frequency}
              className={cn(
                "rounded-xl px-3 py-3.5 text-center",
                eq.frequency === frequency
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "bg-muted/50"
              )}
            >
              <p
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wide",
                  eq.frequency === frequency
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {COMPOUNDING_FREQUENCY_LABELS[eq.frequency]}
              </p>
              <p className="mt-1 font-display text-base font-medium tabular-nums">
                {formatPercent(eq.value)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Cuanto más frecuente es la liquidación, mayor es la TAE resultante
          para un mismo TIN nominal — y menor el TIN nominal necesario para
          alcanzar una misma TAE objetivo.
        </p>
      </div>
    </div>
  );
}
