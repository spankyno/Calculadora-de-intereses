"use client";

import { Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LETRA_TERM_LABELS,
  type TreasuryBillResult,
} from "@/lib/calculators/treasury-bills";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ComparisonCardsProps {
  results: TreasuryBillResult[];
}

export function ComparisonCards({ results }: ComparisonCardsProps) {
  const bestTerm = results.reduce<TreasuryBillResult | null>((best, curr) => {
    if (!best) return curr;
    return curr.netYieldAnnualizedPercent > best.netYieldAnnualizedPercent
      ? curr
      : best;
  }, null);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {results.map((result) => (
        <Card
          key={result.term}
          className={cn(
            "relative overflow-hidden p-5",
            result === bestTerm && "border-gain/40 ring-1 ring-gain/20"
          )}
        >
          {result === bestTerm && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gain-soft px-2.5 py-1 text-[11px] font-semibold text-gain">
              <Crown className="h-3 w-3" /> Mejor opción
            </div>
          )}
          <p className="font-display text-lg font-medium">
            {LETRA_TERM_LABELS[result.term]}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {result.numLetras} letras · {formatCurrency(result.capitalInvested)} invertidos
            {result.leftover > 0 && (
              <> · {formatCurrency(result.leftover)} sobrante</>
            )}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Importe bruto
              </p>
              <p className="font-display text-lg font-medium num-tabular">
                {formatCurrency(result.grossMaturityAmount)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Rent. anualizada
              </p>
              <p className="font-display text-lg font-medium num-tabular">
                {formatPercent(result.netYieldAnnualizedPercent)}
              </p>
            </div>
            <div className="col-span-2 border-t border-border pt-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Importe neto al vencimiento
              </p>
              <p className="font-display text-xl font-medium text-gain num-tabular">
                {formatCurrency(result.netMaturityAmount)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
