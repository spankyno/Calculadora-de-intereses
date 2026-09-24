"use client";

import { BarChart3 } from "lucide-react";
import { StackedBar } from "@/components/ui/stacked-bar";
import type { CompoundInterestResult } from "@/lib/calculators/compound-interest";
import { formatCurrency } from "@/lib/utils";

interface ResultsBreakdownChartProps {
  result: CompoundInterestResult;
  principal: number;
}

export function ResultsBreakdownChart({
  result,
  principal,
}: ResultsBreakdownChartProps) {
  const hasData = principal > 0;

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <BarChart3 className="h-3.5 w-3.5" />
        Composición del capital final neto
      </div>

      <StackedBar
        formatValue={(v) => formatCurrency(v)}
        total={hasData ? result.finalCapitalNet : 0}
        segments={[
          {
            id: "principal",
            label: "Capital inicial",
            value: principal,
            colorClass: "bg-foreground/20",
            dotClass: "bg-foreground/40",
          },
          {
            id: "net-interest",
            label: "Intereses netos",
            value: result.netInterest,
            colorClass: "bg-gain",
          },
        ]}
      />

      <div className="flex items-baseline justify-between border-t border-border pt-2.5 text-xs">
        <span className="text-muted-foreground">Capital final neto</span>
        <span className="font-display text-sm font-medium num-tabular">
          {formatCurrency(result.finalCapitalNet)}
        </span>
      </div>
    </div>
  );
}
