"use client";

import { TrendingUp, Receipt, Wallet, Landmark } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { ResultsBreakdownChart } from "./results-breakdown-chart";
import type { SimpleInterestResult } from "@/lib/calculators/simple-interest";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ResultsPanelProps {
  result: SimpleInterestResult;
  principal: number;
}

export function ResultsPanel({ result, principal }: ResultsPanelProps) {
  const hasValidPrincipal = principal > 0;

  return (
    <div className="space-y-8">
      {/* Resultado hero: capital final neto */}
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
          Capital final neto
        </p>
        <p className="relative mt-2 font-display text-4xl font-medium tabular-nums text-balance sm:text-5xl">
          {hasValidPrincipal ? formatCurrency(result.finalCapitalNet) : "—"}
        </p>
        <div className="relative mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-hero-foreground/70">
          <span>
            Capital inicial{" "}
            <span className="font-semibold text-hero-foreground">
              {formatCurrency(principal)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-gold" />
            Rentabilidad neta{" "}
            <span className="font-semibold text-gold">
              {formatPercent(result.netYieldPercent)}
            </span>
          </span>
        </div>
      </div>

      {/* Desglose de intereses */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Intereses brutos"
          value={formatCurrency(result.grossInterest)}
          tone="neutral"
          tooltip="Ganancia total antes de aplicar la retención fiscal: Capital × TIN × tiempo."
        />
        <MetricCard
          icon={<Receipt className="h-4 w-4" />}
          label="Retención de impuestos"
          value={`− ${formatCurrency(result.taxWithheld)}`}
          tone="tax"
          tooltip="Importe que se retiene sobre los intereses brutos según el porcentaje de retención indicado."
        />
        <MetricCard
          icon={<Wallet className="h-4 w-4" />}
          label="Intereses netos"
          value={formatCurrency(result.netInterest)}
          tone="gain"
          tooltip="Lo que realmente ganas después de la retención: Intereses brutos − Retención."
        />
      </div>

      {/* Gráfico de desglose: brutos, retención, netos y capital final */}
      <ResultsBreakdownChart result={result} principal={principal} />

      {/* TIN equivalentes */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          TIN equivalente
        </p>
        <div className="grid grid-cols-3 gap-3">
          <RateChip label="Mensual" value={formatPercent(result.monthlyRate)} />
          <RateChip
            label="Trimestral"
            value={formatPercent(result.quarterlyRate)}
          />
          <RateChip
            label="Semestral"
            value={formatPercent(result.semiannualRate)}
          />
        </div>
      </div>

      {/* Capital final bruto vs neto */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Landmark className="h-3.5 w-3.5" />
            Capital final bruto
          </div>
          <p className="mt-1.5 font-display text-2xl font-medium tabular-nums">
            {formatCurrency(result.finalCapitalGross)}
          </p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-gain-soft p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gain">
            <Landmark className="h-3.5 w-3.5" />
            Capital final neto
          </div>
          <p className="mt-1.5 font-display text-2xl font-medium tabular-nums text-gain">
            {formatCurrency(result.finalCapitalNet)}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "neutral" | "gain" | "tax";
  tooltip: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-transform duration-200 hover:-translate-y-0.5",
        tone === "gain" && "border-gain/25 bg-gain-soft",
        tone === "tax" && "border-tax/25 bg-tax-soft",
        tone === "neutral" && "border-border bg-muted/40"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide",
            tone === "gain" && "text-gain",
            tone === "tax" && "text-tax",
            tone === "neutral" && "text-muted-foreground"
          )}
        >
          {icon}
          {label}
        </div>
        <InfoTooltip text={tooltip} />
      </div>
      <p
        className={cn(
          "mt-2 font-display text-xl font-medium tabular-nums",
          tone === "gain" && "text-gain",
          tone === "tax" && "text-tax",
          tone === "neutral" && "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function RateChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 px-3 py-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-base font-medium tabular-nums">
        {value}
      </p>
    </div>
  );
}
