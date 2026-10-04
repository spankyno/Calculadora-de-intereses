"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  LOAN_DURATION_UNIT_LABELS,
  type BaseLoanInput,
  type EarlyRepaymentInput,
  type LoanDurationUnit,
} from "@/lib/calculators/early-repayment";
import { useNumberInput } from "@/lib/hooks/use-number-input";

interface CalculatorFormProps {
  loanInput: BaseLoanInput;
  onLoanChange: (input: BaseLoanInput) => void;
  earlyInput: EarlyRepaymentInput;
  onEarlyChange: (input: EarlyRepaymentInput) => void;
  totalMonths: number;
}

export function CalculatorForm({
  loanInput,
  onLoanChange,
  earlyInput,
  onEarlyChange,
  totalMonths,
}: CalculatorFormProps) {
  const principal = useNumberInput(loanInput.principal);
  const rate = useNumberInput(loanInput.annualRate);
  const duration = useNumberInput(loanInput.duration);
  const amount = useNumberInput(earlyInput.amount);
  const atMonth = useNumberInput(earlyInput.atMonth);

  React.useEffect(() => {
    onLoanChange({
      ...loanInput,
      principal: Number.isFinite(principal.value) ? principal.value : 0,
      annualRate: Number.isFinite(rate.value) ? rate.value : 0,
      duration: Number.isFinite(duration.value) ? duration.value : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal.raw, rate.raw, duration.raw]);

  React.useEffect(() => {
    onEarlyChange({
      amount: Number.isFinite(amount.value) ? amount.value : 0,
      atMonth: Number.isFinite(atMonth.value) ? atMonth.value : 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount.raw, atMonth.raw]);

  const principalError = Number.isFinite(principal.value) && principal.value <= 0;
  const durationError = Number.isFinite(duration.value) && duration.value <= 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Tu préstamo o hipoteca
        </p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="principal">Capital pendiente</Label>
            <div className="relative">
              <Input
                id="principal"
                inputMode="decimal"
                value={principal.raw}
                onChange={(e) => principal.onChange(e.target.value)}
                error={principalError}
                className="pr-10 text-lg font-semibold"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                €
              </span>
            </div>
            {principalError && (
              <p className="text-xs text-destructive">
                El capital debe ser mayor que 0.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rate">TIN anual</Label>
            <div className="relative">
              <Input
                id="rate"
                inputMode="decimal"
                value={rate.raw}
                onChange={(e) => rate.onChange(e.target.value)}
                className="pr-10 text-lg font-semibold"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Plazo restante</Label>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input
                id="duration"
                inputMode="decimal"
                value={duration.raw}
                onChange={(e) => duration.onChange(e.target.value)}
                error={durationError}
                className="text-lg font-semibold"
              />
              <Select
                value={loanInput.durationUnit}
                onValueChange={(unit: LoanDurationUnit) =>
                  onLoanChange({ ...loanInput, durationUnit: unit })
                }
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(
                      LOAN_DURATION_UNIT_LABELS
                    ) as LoanDurationUnit[]
                  ).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {LOAN_DURATION_UNIT_LABELS[unit]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {durationError && (
              <p className="text-xs text-destructive">
                El plazo debe ser mayor que 0.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <div className="mb-3 flex items-center gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Aportación extra
          </p>
          <InfoTooltip text="Simula el efecto de hacer un pago adicional, único, en un mes concreto del préstamo." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Importe</Label>
            <div className="relative">
              <Input
                id="amount"
                inputMode="decimal"
                value={amount.raw}
                onChange={(e) => amount.onChange(e.target.value)}
                className="pr-10 text-lg font-semibold"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                €
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="atMonth">En el mes nº (de {totalMonths})</Label>
            <Input
              id="atMonth"
              inputMode="numeric"
              value={atMonth.raw}
              onChange={(e) => atMonth.onChange(e.target.value)}
              className="text-lg font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
