"use client";

import { Crown } from "lucide-react";
import {
  CAPITALIZATION_TYPE_LABELS,
  DURATION_UNIT_LABELS,
  calculateDepositProduct,
  type DepositProduct,
} from "@/lib/calculators/deposit-comparison";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ResultsTableProps {
  products: DepositProduct[];
}

export function ResultsTable({ products }: ResultsTableProps) {
  const computed = products.map((p) => ({
    product: p,
    result: calculateDepositProduct(p),
  }));

  const bestId = computed.reduce<string | null>((bestId, curr) => {
    if (!bestId) return curr.product.id;
    const best = computed.find((c) => c.product.id === bestId)!;
    return curr.result.netYieldAnnualizedPercent >
      best.result.netYieldAnnualizedPercent
      ? curr.product.id
      : bestId;
  }, null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[980px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <Th>Producto</Th>
            <Th align="right">Capital</Th>
            <Th align="right">TIN</Th>
            <Th align="right">Capitaliz.</Th>
            <Th align="right">Duración</Th>
            <Th align="right">Comisiones</Th>
            <Th align="right">Int. netos</Th>
            <Th align="right">Rent. anual.</Th>
            <Th align="right">Capital final neto</Th>
          </tr>
        </thead>
        <tbody>
          {computed.map(({ product, result }) => (
            <tr
              key={product.id}
              className={cn(
                "border-b border-border/70 last:border-0 transition-colors hover:bg-muted/30",
                product.id === bestId && "bg-gain-soft/60"
              )}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  {product.id === bestId && (
                    <Crown className="h-3.5 w-3.5 shrink-0 text-gold" />
                  )}
                  <span className="max-w-[140px] truncate font-semibold">
                    {product.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatCurrency(product.principal)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {formatPercent(product.annualRate)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {CAPITALIZATION_TYPE_LABELS[product.capitalizationType]}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular">
                {product.duration} {DURATION_UNIT_LABELS[product.durationUnit]}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular text-tax">
                {result.totalFees > 0
                  ? `− ${formatCurrency(result.totalFees)}`
                  : "—"}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold text-gain">
                {formatCurrency(result.netInterest)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold">
                {formatPercent(result.netYieldAnnualizedPercent)}
              </td>
              <td className="px-4 py-3.5 text-right num-tabular font-semibold">
                {formatCurrency(result.finalCapitalNet)}
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
