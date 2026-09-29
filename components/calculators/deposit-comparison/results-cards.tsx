"use client";

import { Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  CAPITALIZATION_TYPE_LABELS,
  DURATION_UNIT_LABELS,
  calculateDepositProduct,
  type DepositProduct,
} from "@/lib/calculators/deposit-comparison";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ResultsCardsProps {
  products: DepositProduct[];
}

export function ResultsCards({ products }: ResultsCardsProps) {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {computed.map(({ product, result }) => (
        <Card
          key={product.id}
          className={cn(
            "relative overflow-hidden p-5",
            product.id === bestId && "border-gain/40 ring-1 ring-gain/20"
          )}
        >
          {product.id === bestId && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gain-soft px-2.5 py-1 text-[11px] font-semibold text-gain">
              <Crown className="h-3 w-3" /> Mejor opción
            </div>
          )}
          <p className="w-[70%] truncate font-display text-lg font-medium">
            {product.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(product.principal)} ·{" "}
            {formatPercent(product.annualRate)} TIN ·{" "}
            {CAPITALIZATION_TYPE_LABELS[product.capitalizationType]} ·{" "}
            {product.duration} {DURATION_UNIT_LABELS[product.durationUnit]}
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
                Comisiones
              </p>
              <p className="font-display text-lg font-medium num-tabular">
                {result.totalFees > 0
                  ? `− ${formatCurrency(result.totalFees)}`
                  : "—"}
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
        </Card>
      ))}
    </div>
  );
}
