"use client";

import { Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateSimpleInterest,
  DURATION_UNIT_LABELS,
  type SimpleInterestScenario,
} from "@/lib/calculators/simple-interest";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ComparisonTableProps {
  scenarios: SimpleInterestScenario[];
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ComparisonTable({
  scenarios,
  onRemove,
  onRename,
}: ComparisonTableProps) {
  const computed = scenarios.map((s) => ({
    scenario: s,
    result: calculateSimpleInterest(s.input),
  }));

  const bestId = computed.reduce<string | null>((bestId, curr) => {
    if (!bestId) return curr.scenario.id;
    const best = computed.find((c) => c.scenario.id === bestId)!;
    return curr.result.netYieldAnnualizedPercent >
      best.result.netYieldAnnualizedPercent
      ? curr.scenario.id
      : bestId;
  }, null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <Th>Escenario</Th>
            <Th align="right">Capital</Th>
            <Th align="right">TIN</Th>
            <Th align="right">Duración</Th>
            <Th align="right">Retención</Th>
            <Th align="right">Int. brutos</Th>
            <Th align="right">Int. netos</Th>
            <Th align="right">Rent. neta</Th>
            <Th align="right">Capital final neto</Th>
            <Th align="right"> </Th>
          </tr>
        </thead>
        <tbody>
          {computed.map(({ scenario, result }, idx) => (
            <tr
              key={scenario.id}
              className={cn(
                "stagger-row border-b border-border/70 last:border-0 transition-colors hover:bg-muted/30",
                scenario.id === bestId && "bg-gain-soft/60"
              )}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  {scenario.id === bestId && (
                    <Crown className="h-3.5 w-3.5 shrink-0 text-gold" />
                  )}
                  <input
                    value={scenario.name}
                    onChange={(e) => onRename(scenario.id, e.target.value)}
                    className="w-32 truncate bg-transparent font-semibold outline-none focus:underline"
                    aria-label="Nombre del escenario"
                  />
                </div>
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatCurrency(scenario.input.principal)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatPercent(scenario.input.annualRate)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {scenario.input.duration}{" "}
                {DURATION_UNIT_LABELS[scenario.input.durationUnit]}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatPercent(scenario.input.taxRate, 0)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatCurrency(result.grossInterest)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold text-gain">
                {formatCurrency(result.netInterest)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold">
                {formatPercent(result.netYieldPercent)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold">
                {formatCurrency(result.finalCapitalNet)}
              </td>
              <td className="px-2 py-3.5 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(scenario.id)}
                  aria-label={`Eliminar escenario ${scenario.name}`}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        align === "right" && "text-right"
      )}
    >
      {children}
    </th>
  );
}
