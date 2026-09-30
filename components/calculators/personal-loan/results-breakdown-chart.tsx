"use client";

import { BarChart3 } from "lucide-react";
import { StackedBar } from "@/components/ui/stacked-bar";
import type { PersonalLoanResult } from "@/lib/calculators/personal-loan";
import { formatCurrency } from "@/lib/utils";

interface ResultsBreakdownChartProps {
  result: PersonalLoanResult;
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
        Composición del total pagado
      </div>

      <StackedBar
        formatValue={(v) => formatCurrency(v)}
        total={hasData ? result.totalPaid : 0}
        segments={[
          {
            id: "principal",
            label: "Capital",
            value: principal,
            colorClass: "bg-foreground/20",
            dotClass: "bg-foreground/40",
          },
          {
            id: "interest",
            label: "Intereses",
            value: result.totalInterest,
            colorClass: "bg-tax",
          },
        ]}
      />

      <div className="flex items-baseline justify-between border-t border-border pt-2.5 text-xs">
        <span className="text-muted-foreground">Total pagado</span>
        <span className="font-display text-sm font-medium num-tabular">
          {formatCurrency(result.totalPaid)}
        </span>
      </div>
    </div>
  );
}
