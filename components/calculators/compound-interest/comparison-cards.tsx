"use client";

import { Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  calculateCompoundInterest,
  COMPOUNDING_FREQUENCY_LABELS,
  DURATION_UNIT_LABELS,
  type CompoundInterestScenario,
} from "@/lib/calculators/compound-interest";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ComparisonCardsProps {
  scenarios: CompoundInterestScenario[];
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ComparisonCards({
  scenarios,
  onRemove,
  onRename,
}: ComparisonCardsProps) {
  const computed = scenarios.map((s) => ({
    scenario: s,
    result: calculateCompoundInterest(s.input),
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {computed.map(({ scenario, result }) => (
        <Card
          key={scenario.id}
          className={cn(
            "relative overflow-hidden p-5",
            scenario.id === bestId && "border-gain/40 ring-1 ring-gain/20"
          )}
        >
          {scenario.id === bestId && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gain-soft px-2.5 py-1 text-[11px] font-semibold text-gain">
              <Crown className="h-3 w-3" /> Mejor opción
            </div>
          )}
          <input
            value={scenario.name}
            onChange={(e) => onRename(scenario.id, e.target.value)}
            className="w-[70%] truncate bg-transparent font-display text-lg font-medium outline-none focus:underline"
            aria-label="Nombre del escenario"
          />
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(scenario.input.principal)} ·{" "}
            {formatPercent(scenario.input.annualRate)} TIN ·{" "}
            {COMPOUNDING_FREQUENCY_LABELS[scenario.input.compoundingFrequency]} ·{" "}
            {scenario.input.duration}{" "}
            {DURATION_UNIT_LABELS[scenario.input.durationUnit]}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Intereses netos
              </p>
              <p className="font-display text-lg font-medium text-gain num-tabular">
                {formatCurrency(result.netInterest)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                TAE
              </p>
              <p className="font-display text-lg font-medium num-tabular">
                {formatPercent(result.effectiveAnnualRate)}
              </p>
            </div>
            <div className="col-span-2 border-t border-border pt-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Capital final neto
              </p>
              <p className="font-display text-xl font-medium num-tabular">
                {formatCurrency(result.finalCapitalNet)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(scenario.id)}
            className="mt-3 h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Eliminar
          </Button>
        </Card>
      ))}
    </div>
  );
}
