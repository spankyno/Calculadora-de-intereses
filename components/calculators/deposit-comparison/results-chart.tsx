"use client";

import { Crown } from "lucide-react";
import {
  calculateDepositProduct,
  type DepositProduct,
} from "@/lib/calculators/deposit-comparison";
import { cn, formatCurrency } from "@/lib/utils";

interface ResultsChartProps {
  products: DepositProduct[];
}

export function ResultsChart({ products }: ResultsChartProps) {
  const rows = products.map((p) => ({
    product: p,
    result: calculateDepositProduct(p),
  }));

  const maxValue = Math.max(
    ...rows.map((r) => Math.max(r.result.finalCapitalNet, 0)),
    0.0001
  );

  const bestId = rows.reduce<string | null>((bestId, curr) => {
    if (!bestId) return curr.product.id;
    const best = rows.find((r) => r.product.id === bestId)!;
    return curr.result.netYieldAnnualizedPercent >
      best.result.netYieldAnnualizedPercent
      ? curr.product.id
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
            Ganancia neta
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map(({ product, result }) => {
          const totalPct = Math.max(
            (Math.max(result.finalCapitalNet, 0) / maxValue) * 100,
            2
          );
          const principalOfTotal =
            result.finalCapitalNet > 0
              ? Math.min(
                  (product.principal / result.finalCapitalNet) * 100,
                  100
                )
              : 100;
          const isBest = product.id === bestId;

          return (
            <div key={product.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1 truncate font-medium text-foreground">
                  {isBest && <Crown className="h-3 w-3 shrink-0 text-gold" />}
                  {product.name}
                </span>
                <span className="shrink-0 num-tabular font-semibold text-foreground">
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
                    style={{ width: `${principalOfTotal}%` }}
                  />
                  <div
                    className={cn(
                      "h-full last:rounded-r-full",
                      isBest ? "bg-gain" : "bg-gain/60"
                    )}
                    style={{ width: `${100 - principalOfTotal}%` }}
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
