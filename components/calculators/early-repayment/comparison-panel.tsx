"use client";

import * as React from "react";
import { Gauge, CalendarClock, Ban, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AmortizationTable } from "@/components/calculators/shared/amortization-table";
import { ResultsChart } from "./results-chart";
import type { EarlyRepaymentComparison } from "@/lib/calculators/early-repayment";
import { cn, formatCurrency } from "@/lib/utils";

interface ComparisonPanelProps {
  comparison: EarlyRepaymentComparison;
}

type ScheduleChoice = "cuota" | "plazo";

export function ComparisonPanel({ comparison }: ComparisonPanelProps) {
  const [scheduleChoice, setScheduleChoice] =
    React.useState<ScheduleChoice>("plazo");

  const bestInterest = Math.min(
    comparison.reducirCuota.totalInterest,
    comparison.reducirPlazo.totalInterest
  );

  return (
    <div className="space-y-6">
      <ResultsChart comparison={comparison} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <OutcomeCard
          icon={<Ban className="h-4 w-4" />}
          title="Sin aportación"
          rows={[
            { label: "Cuota", value: formatCurrency(comparison.withoutExtra.monthlyPayment) },
            { label: "Plazo", value: `${comparison.withoutExtra.totalMonths} meses` },
            { label: "Intereses totales", value: formatCurrency(comparison.withoutExtra.totalInterest) },
          ]}
        />
        <OutcomeCard
          icon={<Gauge className="h-4 w-4" />}
          title="Reducir cuota"
          highlight={comparison.reducirCuota.totalInterest === bestInterest}
          rows={[
            {
              label: "Nueva cuota",
              value: comparison.reducirCuota.fullyPaidOff
                ? "Préstamo cancelado"
                : formatCurrency(comparison.reducirCuota.newMonthlyPayment),
            },
            { label: "Plazo", value: `${comparison.reducirCuota.newTotalMonths} meses` },
            {
              label: "Ahorro en intereses",
              value: formatCurrency(Math.max(comparison.reducirCuota.interestSaved, 0)),
              emphasis: true,
            },
          ]}
        />
        <OutcomeCard
          icon={<CalendarClock className="h-4 w-4" />}
          title="Reducir plazo"
          highlight={comparison.reducirPlazo.totalInterest === bestInterest}
          rows={[
            {
              label: "Cuota",
              value: comparison.reducirPlazo.fullyPaidOff
                ? "Préstamo cancelado"
                : formatCurrency(comparison.reducirPlazo.newMonthlyPayment),
            },
            {
              label: "Nuevo plazo",
              value: `${comparison.reducirPlazo.newTotalMonths} meses (−${comparison.reducirPlazo.monthsSaved})`,
            },
            {
              label: "Ahorro en intereses",
              value: formatCurrency(Math.max(comparison.reducirPlazo.interestSaved, 0)),
              emphasis: true,
            },
          ]}
        />
      </div>

      <div>
        <div className="mb-3 inline-flex rounded-xl border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setScheduleChoice("cuota")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              scheduleChoice === "cuota"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Cuadro: reducir cuota
          </button>
          <button
            type="button"
            onClick={() => setScheduleChoice("plazo")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              scheduleChoice === "plazo"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Cuadro: reducir plazo
          </button>
        </div>
        <AmortizationTable
          schedule={
            scheduleChoice === "cuota"
              ? comparison.reducirCuota.schedule
              : comparison.reducirPlazo.schedule
          }
          fileName={
            scheduleChoice === "cuota"
              ? "amortizacion-reducir-cuota"
              : "amortizacion-reducir-plazo"
          }
          title={
            scheduleChoice === "cuota"
              ? "Amortización anticipada — Reducir cuota"
              : "Amortización anticipada — Reducir plazo"
          }
        />
      </div>
    </div>
  );
}

function OutcomeCard({
  icon,
  title,
  rows,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  rows: { label: string; value: string; emphasis?: boolean }[];
  highlight?: boolean;
}) {
  return (
    <Card
      className={cn(
        "p-4",
        highlight && "border-gain/40 ring-1 ring-gain/20"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          {icon}
          {title}
        </div>
        {highlight && <Crown className="h-3.5 w-3.5 text-gold" />}
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span
              className={cn(
                "num-tabular text-right text-sm font-medium",
                row.emphasis && "font-display text-base font-medium text-gain"
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
