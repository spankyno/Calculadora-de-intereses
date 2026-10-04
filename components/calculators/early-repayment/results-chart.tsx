"use client";

import { Crown } from "lucide-react";
import type { EarlyRepaymentComparison } from "@/lib/calculators/early-repayment";
import { cn, formatCurrency } from "@/lib/utils";

interface ResultsChartProps {
  comparison: EarlyRepaymentComparison;
}

export function ResultsChart({ comparison }: ResultsChartProps) {
  const rows = [
    {
      id: "sin",
      label: "Sin aportación",
      value: comparison.withoutExtra.totalInterest,
      best: false,
    },
    {
      id: "cuota",
      label: "Reducir cuota",
      value: comparison.reducirCuota.totalInterest,
      best: false,
    },
    {
      id: "plazo",
      label: "Reducir plazo",
      value: comparison.reducirPlazo.totalInterest,
      best: false,
    },
  ];

  const minValue = Math.min(...rows.map((r) => r.value));
  rows.forEach((r) => {
    if (r.id !== "sin") r.best = r.value === minValue;
  });

  const maxValue = Math.max(...rows.map((r) => r.value), 0.0001);

  return (
    <div className="rounded-2xl border border-border p-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Intereses totales por estrategia
      </p>
      <div className="space-y-4">
        {rows.map((row) => {
          const pct = Math.max((row.value / maxValue) * 100, 2);
          return (
            <div key={row.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {row.best && <Crown className="h-3 w-3 text-gold" />}
                  {row.label}
                </span>
                <span className="num-tabular font-semibold text-foreground">
                  {formatCurrency(row.value)}
                </span>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    row.id === "sin"
                      ? "bg-foreground/25"
                      : row.best
                        ? "bg-gain"
                        : "bg-tax/70"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
