"use client";

import { Crown } from "lucide-react";
import {
  LETRA_TERM_LABELS,
  type TreasuryBillResult,
} from "@/lib/calculators/treasury-bills";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ComparisonTableProps {
  results: TreasuryBillResult[];
}

export function ComparisonTable({ results }: ComparisonTableProps) {
  const bestTerm = results.reduce<TreasuryBillResult | null>((best, curr) => {
    if (!best) return curr;
    return curr.grossYieldAnnualizedPercent > best.grossYieldAnnualizedPercent
      ? curr
      : best;
  }, null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[780px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <Th>Plazo</Th>
            <Th align="right">Nº letras</Th>
            <Th align="right">Capital invertido</Th>
            <Th align="right">Sobrante (interés bruto)</Th>
            <Th align="right">Coste real de adquisición</Th>
            <Th align="right">Rentabilidad bruta</Th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.term}
              className={cn(
                "border-b border-border/70 last:border-0 transition-colors hover:bg-muted/30",
                result === bestTerm && "bg-gain-soft/60"
              )}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2 font-semibold">
                  {result === bestTerm && (
                    <Crown className="h-3.5 w-3.5 shrink-0 text-gold" />
                  )}
                  {LETRA_TERM_LABELS[result.term]}
                </div>
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {result.numLetras}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatCurrency(result.capitalInvested)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular text-gain">
                {formatCurrency(result.leftover)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatCurrency(result.realCost)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold">
                {formatPercent(result.grossYieldPercent)}
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
