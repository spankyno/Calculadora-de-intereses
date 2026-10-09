"use client";

import * as React from "react";
import { TrendingDown, Gauge, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  calculateEarlyRepayment,
  type MortgageInput,
  type MortgageResult,
} from "@/lib/calculators/mortgage";
import { useNumberInput } from "@/lib/hooks/use-number-input";
import { formatCurrency } from "@/lib/utils";

interface EarlyRepaymentSimulatorProps {
  loanInput: MortgageInput;
  loanResult: MortgageResult;
}

export function EarlyRepaymentSimulator({
  loanInput,
  loanResult,
}: EarlyRepaymentSimulatorProps) {
  const defaultMonth = Math.max(1, Math.min(12, loanResult.totalMonths));
  const amount = useNumberInput(5000);
  const atMonth = useNumberInput(defaultMonth);

  const parsedAmount = Number.isFinite(amount.value) ? amount.value : 0;
  const parsedMonth = Number.isFinite(atMonth.value)
    ? Math.min(Math.max(Math.round(atMonth.value), 1), loanResult.totalMonths)
    : defaultMonth;

  const hasValidInputs = parsedAmount > 0 && loanResult.totalMonths > 1;

  const reducirCuota = React.useMemo(
    () =>
      hasValidInputs
        ? calculateEarlyRepayment(loanInput, loanResult, {
            amount: parsedAmount,
            atMonth: parsedMonth,
            strategy: "reducir_cuota",
          })
        : null,
    [loanInput, loanResult, parsedAmount, parsedMonth, hasValidInputs]
  );

  const reducirPlazo = React.useMemo(
    () =>
      hasValidInputs
        ? calculateEarlyRepayment(loanInput, loanResult, {
            amount: parsedAmount,
            atMonth: parsedMonth,
            strategy: "reducir_plazo",
          })
        : null,
    [loanInput, loanResult, parsedAmount, parsedMonth, hasValidInputs]
  );

  return (
    <div className="space-y-4 rounded-xl border border-border p-4">
      <div className="flex items-center gap-1.5">
        <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Simulador de amortización anticipada
        </p>
        <InfoTooltip text="Simula el efecto de hacer una aportación extra en un mes concreto, comparando si conviene más reducir la cuota mensual o acortar el plazo." />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[11px]">Aportación extra</Label>
          <div className="relative">
            <Input
              inputMode="decimal"
              value={amount.raw}
              onChange={(e) => amount.onChange(e.target.value)}
              className="pr-8"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              €
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px]">
            En el mes nº (de {loanResult.totalMonths})
          </Label>
          <Input
            inputMode="numeric"
            value={atMonth.raw}
            onChange={(e) => atMonth.onChange(e.target.value)}
          />
        </div>
      </div>

      {hasValidInputs && reducirCuota && reducirPlazo && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StrategyCard
            icon={<Gauge className="h-4 w-4" />}
            title="Reducir cuota"
            description={
              reducirCuota.fullyPaidOff
                ? "La aportación cancela el préstamo"
                : `Nueva cuota: ${formatCurrency(reducirCuota.newMonthlyPayment)} (antes ${formatCurrency(loanResult.monthlyPayment)})`
            }
            interestSaved={reducirCuota.interestSaved}
          />
          <StrategyCard
            icon={<CalendarClock className="h-4 w-4" />}
            title="Reducir plazo"
            description={
              reducirPlazo.fullyPaidOff
                ? "La aportación cancela el préstamo"
                : `Ahorras ${reducirPlazo.monthsSaved} cuotas (${Math.round((reducirPlazo.monthsSaved / 12) * 10) / 10} años)`
            }
            interestSaved={reducirPlazo.interestSaved}
          />
        </div>
      )}
    </div>
  );
}

function StrategyCard({
  icon,
  title,
  description,
  interestSaved,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  interestSaved: number;
}) {
  return (
    <div className="rounded-xl border border-gain/25 bg-gain-soft p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gain">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm leading-snug text-foreground">
        {description}
      </p>
      <p className="mt-3 border-t border-gain/20 pt-2.5 text-xs text-muted-foreground">
        Ahorro en intereses
      </p>
      <p className="font-display text-lg font-medium text-gain num-tabular">
        {formatCurrency(Math.max(interestSaved, 0))}
      </p>
    </div>
  );
}
