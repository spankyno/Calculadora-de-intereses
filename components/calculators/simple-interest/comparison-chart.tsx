"use client";

import * as React from "react";
import { Crown } from "lucide-react";
import {
  calculateSimpleInterest,
  type SimpleInterestScenario,
} from "@/lib/calculators/simple-interest";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type Metric = "finalCapitalNet" | "netInterest" | "netYieldPercent";

const METRIC_OPTIONS: { id: Metric; label: string }[] = [
  { id: "finalCapitalNet", label: "Capital final neto" },
  { id: "netInterest", label: "Intereses netos" },
  { id: "netYieldPercent", label: "Rentabilidad neta" },
];

interface ComparisonChartProps {
  scenarios: SimpleInterestScenario[];
}

export function ComparisonChart({ scenarios }: ComparisonChartProps) {
  const [metric, setMetric] = React.useState<Metric>("finalCapitalNet");

  const rows = scenarios.map((s) => {
    const result = calculateSimpleInterest(s.input);
    return { scenario: s, result };
  });

  const formatMetric = (value: number) =>
    metric === "netYieldPercent" ? formatPercent(value) : formatCurrency(value);

  const maxValue = Math.max(
    ...rows.map((r) => Math.max(r.result[metric], 0)),
    0.0001
  );

  const bestId = rows.reduce<string | null>((bestId, curr) => {
    if (!bestId) return curr.scenario.id;
    const best = rows.find((r) => r.scenario.id === bestId)!;
    return curr.result[metric] > best.result[metric]
      ? curr.scenario.id
      : bestId;
  }, null);

  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Comparativa visual
        </p>
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1">
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMetric(opt.id)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                metric === opt.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {rows.map(({ scenario, result }) => {
          const value = result[metric];
          const pct = Math.max((value / maxValue) * 100, 2);
          const isBest = scenario.id === bestId;
          return (
            <div key={scenario.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {isBest && <Crown className="h-3 w-3 text-gold" />}
                  {scenario.name}
                </span>
                <span className="num-tabular font-semibold text-foreground">
                  {formatMetric(value)}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
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
