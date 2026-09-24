"use client";

import { Crown } from "lucide-react";
import {
  calculateCompoundInterest,
  type CompoundInterestScenario,
} from "@/lib/calculators/compound-interest";
import { cn, formatCurrency } from "@/lib/utils";

interface ComparisonChartProps {
  scenarios: CompoundInterestScenario[];
}

export function ComparisonChart({ scenarios }: ComparisonChartProps) {
  const rows = scenarios.map((s) => ({
    scenario: s,
    result: calculateCompoundInterest(s.input),
  }));

  const maxValue = Math.max(
    ...rows.map((r) => Math.max(r.result.finalCapitalNet, 0)),
    0.0001
  );

  // "Mejor opción" se determina por rentabilidad neta anualizada, para que la
  // comparación sea justa entre escenarios con capitales o duraciones distintas.
  const bestId = rows.reduce<string | null>((bestId, curr) => {
    if (!bestId) return curr.scenario.id;
    const best = rows.find((r) => r.scenario.id === bestId)!;
    return curr.result.netYieldAnnualizedPercent >
      best.result.netYieldAnnualizedPercent
      ? curr.scenario.id
      : bestId;
  }, null);

  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Comparativa visual
        </p>
        <div className="flex items-center gap-x-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground/40" />
            Capital inicial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gain" />
            Intereses netos
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map(({ scenario, result }) => {
          const totalPct = Math.max(
            (result.finalCapitalNet / maxValue) * 100,
            2
          );
          const principalPct =
            result.finalCapitalNet > 0
              ? (scenario.input.principal / result.finalCapitalNet) * 100
              : 100;
          const isBest = scenario.id === bestId;

          return (
            <div key={scenario.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {isBest && <Crown className="h-3 w-3 text-gold" />}
                  {scenario.name}
                </span>
                <span className="num-tabular font-semibold text-foreground">
                  {formatCurrency(result.finalCapitalNet)}
                </span>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="flex h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${totalPct}%` }}
                >
                  <div
                    className="h-full bg-foreground/25 first:rounded-l-full"
                    style={{ width: `${principalPct}%` }}
                  />
                  <div
                    className={cn(
                      "h-full last:rounded-r-full",
                      isBest ? "bg-gain" : "bg-gain/60"
                    )}
                    style={{ width: `${100 - principalPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
