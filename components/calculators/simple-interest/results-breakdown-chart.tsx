"use client";

import { BarChart3 } from "lucide-react";
import { StackedBar } from "@/components/ui/stacked-bar";
import type { SimpleInterestResult } from "@/lib/calculators/simple-interest";
import { formatCurrency } from "@/lib/utils";

interface ResultsBreakdownChartProps {
  result: SimpleInterestResult;
  principal: number;
}

export function ResultsBreakdownChart({
  result,
  principal,
}: ResultsBreakdownChartProps) {
  const hasData = principal > 0 && result.grossInterest >= 0;

  return (
    <div className="space-y-5 rounded-xl border border-border p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <BarChart3 className="h-3.5 w-3.5" />
        Desglose visual
      </div>

      {/* Intereses brutos = Intereses netos + Retención */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <p className="text-xs text-muted-foreground">Intereses brutos</p>
          <p className="font-display text-sm font-medium num-tabular">
            {formatCurrency(result.grossInterest)}
          </p>
        </div>
        <StackedBar
          formatValue={(v) => formatCurrency(v)}
          total={hasData ? result.grossInterest : 0}
          segments={[
            {
              id: "net",
              label: "Intereses netos",
              value: result.netInterest,
              colorClass: "bg-gain",
            },
            {
              id: "tax",
              label: "Retención",
              value: result.taxWithheld,
              colorClass: "bg-tax",
            },
          ]}
        />
      </div>

      {/* Capital final neto = Capital inicial + Intereses netos */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <p className="text-xs text-muted-foreground">Capital final neto</p>
          <p className="font-display text-sm font-medium num-tabular">
            {formatCurrency(result.finalCapitalNet)}
          </p>
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
      </div>
    </div>
  );
}
