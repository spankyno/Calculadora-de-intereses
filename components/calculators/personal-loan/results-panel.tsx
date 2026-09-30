"use client";

import * as React from "react";
import {
  Receipt,
  Wallet,
  Landmark,
  Repeat,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { DetailTable, type DetailRow } from "@/components/ui/detail-table";
import { ResultsBreakdownChart } from "./results-breakdown-chart";
import { AmortizationTable } from "./amortization-table";
import type {
  PersonalLoanInput,
  PersonalLoanResult,
} from "@/lib/calculators/personal-loan";
import { LOAN_DURATION_UNIT_LABELS } from "@/lib/calculators/personal-loan";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ResultsPanelProps {
  input: PersonalLoanInput;
  result: PersonalLoanResult;
}

export function ResultsPanel({ input, result }: ResultsPanelProps) {
  const hasValidPrincipal = input.principal > 0;
  const [showMore, setShowMore] = React.useState(false);

  const detailRows: DetailRow[] = [
    { label: "Capital del préstamo", value: formatCurrency(input.principal) },
    { label: "TIN anual (nominal)", value: formatPercent(input.annualRate) },
    {
      label: "TAE (tasa anual equivalente)",
      value: formatPercent(result.effectiveAnnualRate),
    },
    {
      label: "Plazo",
      value: `${input.duration} ${LOAN_DURATION_UNIT_LABELS[input.durationUnit]} (${result.totalMonths} cuotas)`,
    },
    { label: "Cuota mensual", value: formatCurrency(result.monthlyPayment) },
    {
      label: "Comisión de apertura",
      value: `${formatPercent(input.openingFeePercent, 2)} — ${formatCurrency(result.openingFeeAmount)}`,
    },
    {
      label: "Importe neto recibido",
      value: formatCurrency(result.netAmountReceived),
    },
    {
      label: "Total intereses pagados",
      value: formatCurrency(result.totalInterest),
      emphasis: true,
    },
    {
      label: "Total pagado (capital + intereses)",
      value: formatCurrency(result.totalPaid),
      emphasis: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Resultado hero: cuota mensual */}
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
          Cuota mensual
        </p>
        <p className="relative mt-2 font-display text-4xl font-medium tabular-nums text-balance sm:text-5xl">
          {hasValidPrincipal ? formatCurrency(result.monthlyPayment) : "—"}
        </p>
        <div className="relative mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-hero-foreground/70">
          <span>
            Capital{" "}
            <span className="font-semibold text-hero-foreground">
              {formatCurrency(input.principal)}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-gold" />
            {result.totalMonths} cuotas
          </span>
        </div>
      </div>

      {/* Desglose de coste */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          icon={<Receipt className="h-4 w-4" />}
          label="Intereses totales"
          value={formatCurrency(result.totalInterest)}
          tone="tax"
          tooltip="Suma de todos los intereses que pagarás a lo largo de la vida del préstamo."
        />
        <MetricCard
          icon={<Wallet className="h-4 w-4" />}
          label="Comisión de apertura"
          value={formatCurrency(result.openingFeeAmount)}
          tone="tax"
          tooltip="Importe que el banco descuenta del capital al formalizar el préstamo."
        />
        <MetricCard
          icon={<Landmark className="h-4 w-4" />}
          label="Total pagado"
          value={formatCurrency(result.totalPaid)}
          tone="neutral"
          tooltip="Capital más intereses: todo lo que devolverás al banco en total."
        />
      </div>

      {/* Gráfico de composición */}
      <ResultsBreakdownChart result={result} principal={input.principal} />

      {/* TAE */}
      <div className="rounded-xl bg-muted/50 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              TAE — Tasa Anual Equivalente
            </p>
            <InfoTooltip text="El coste real anual del préstamo, incluyendo el efecto de la comisión de apertura. Es la cifra que debes comparar entre distintas ofertas." />
          </div>
          <p className="font-display text-lg font-medium tabular-nums">
            {formatPercent(result.effectiveAnnualRate)}
          </p>
        </div>
      </div>

      {/* Mostrar más: desglose ampliado + tabla de amortización */}
      <div>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          aria-expanded={showMore}
        >
          {showMore ? "Mostrar menos" : "Mostrar más"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              showMore && "rotate-180"
            )}
          />
        </button>

        {showMore && (
          <div className="mt-4 space-y-5">
            <DetailTable rows={detailRows} />
            <AmortizationTable schedule={result.schedule} />
          </div>
        )}
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
  tone: "neutral" | "tax";
  tooltip: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-transform duration-200 hover:-translate-y-0.5",
        tone === "tax" && "border-tax/25 bg-tax-soft",
        tone === "neutral" && "border-border bg-muted/40"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide",
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
          tone === "tax" && "text-tax",
          tone === "neutral" && "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
