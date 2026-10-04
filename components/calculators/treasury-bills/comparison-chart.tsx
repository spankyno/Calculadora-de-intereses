"use client";

import { Crown } from "lucide-react";
import {
  LETRA_TERM_LABELS,
  type TreasuryBillResult,
} from "@/lib/calculators/treasury-bills";
import { cn, formatPercent } from "@/lib/utils";

interface ComparisonChartProps {
  results: TreasuryBillResult[];
}

export function ComparisonChart({ results }: ComparisonChartProps) {
  const bestTerm = results.reduce<TreasuryBillResult | null>((best, curr) => {
    if (!best) return curr;
    return curr.netYieldAnnualizedPercent > best.netYieldAnnualizedPercent
      ? curr
      : best;
  }, null);

  const maxValue = Math.max(
    ...results.map((r) => Math.max(r.netYieldAnnualizedPercent, 0)),
    0.0001
  );

  return (
    <div className="rounded-2xl border border-border p-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Rentabilidad anualizada por plazo
      </p>
      <div className="space-y-4">
        {results.map((result) => {
          const pct = Math.max(
            (result.netYieldAnnualizedPercent / maxValue) * 100,
            2
          );
          const isBest = result === bestTerm;
          return (
            <div key={result.term}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {isBest && <Crown className="h-3 w-3 text-gold" />}
                  {LETRA_TERM_LABELS[result.term]}
                </span>
                <span className="num-tabular font-semibold text-foreground">
                  {formatPercent(result.netYieldAnnualizedPercent)}
                </span>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    isBest ? "bg-gain" : "bg-foreground/25"
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
