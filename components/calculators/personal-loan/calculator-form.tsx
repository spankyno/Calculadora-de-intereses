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
  type LoanDurationUnit,
  type PersonalLoanInput,
} from "@/lib/calculators/personal-loan";
import { useNumberInput } from "@/lib/hooks/use-number-input";

interface CalculatorFormProps {
  input: PersonalLoanInput;
  onChange: (input: PersonalLoanInput) => void;
}

export function CalculatorForm({ input, onChange }: CalculatorFormProps) {
  const principal = useNumberInput(input.principal);
  const rate = useNumberInput(input.annualRate);
  const duration = useNumberInput(input.duration);
  const fee = useNumberInput(input.openingFeePercent);

  React.useEffect(() => {
    onChange({
      ...input,
      principal: Number.isFinite(principal.value) ? principal.value : 0,
      annualRate: Number.isFinite(rate.value) ? rate.value : 0,
      duration: Number.isFinite(duration.value) ? duration.value : 0,
      openingFeePercent: Number.isFinite(fee.value) ? fee.value : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal.raw, rate.raw, duration.raw, fee.raw]);

  const principalError = Number.isFinite(principal.value) && principal.value <= 0;
  const rateError = Number.isFinite(rate.value) && rate.value < 0;
  const durationError = Number.isFinite(duration.value) && duration.value <= 0;
  const feeError =
    Number.isFinite(fee.value) && (fee.value < 0 || fee.value >= 100);

  return (
    <div className="space-y-6">
      {/* Capital del préstamo */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="principal">Capital del préstamo</Label>
          <InfoTooltip text="El importe total que solicitas financiar." />
        </div>
        <div className="relative">
          <Input
            id="principal"
            inputMode="decimal"
            value={principal.raw}
            onChange={(e) => principal.onChange(e.target.value)}
            placeholder="12.000"
            error={principalError}
            className="pr-10 text-lg font-semibold"
            aria-invalid={principalError}
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

      {/* TIN anual */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="rate">TIN anual</Label>
          <InfoTooltip text="Tipo de Interés Nominal anual del préstamo, sobre el que se calcula el interés de cada cuota." />
        </div>
        <div className="relative">
          <Input
            id="rate"
            inputMode="decimal"
            value={rate.raw}
            onChange={(e) => rate.onChange(e.target.value)}
            placeholder="7,50"
            error={rateError}
            className="pr-10 text-lg font-semibold"
            aria-invalid={rateError}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
        {rateError && (
          <p className="text-xs text-destructive">El TIN no puede ser negativo.</p>
        )}
      </div>

      {/* Plazo */}
      <div className="space-y-2">
        <Label htmlFor="duration">Plazo</Label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input
            id="duration"
            inputMode="decimal"
            value={duration.raw}
            onChange={(e) => duration.onChange(e.target.value)}
            placeholder="5"
            error={durationError}
            className="text-lg font-semibold"
            aria-invalid={durationError}
          />
          <Select
            value={input.durationUnit}
            onValueChange={(unit: LoanDurationUnit) =>
              onChange({ ...input, durationUnit: unit })
            }
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.keys(LOAN_DURATION_UNIT_LABELS) as LoanDurationUnit[]
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

      {/* Comisión de apertura */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="fee">Comisión de apertura</Label>
          <InfoTooltip text="Porcentaje que el banco descuenta del capital al formalizar el préstamo. Afecta a la TAE porque recibes menos dinero del que realmente devuelves." />
        </div>
        <div className="relative">
          <Input
            id="fee"
            inputMode="decimal"
            value={fee.raw}
            onChange={(e) => fee.onChange(e.target.value)}
            placeholder="1"
            error={feeError}
            className="pr-10 text-lg font-semibold"
            aria-invalid={feeError}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
        {feeError && (
          <p className="text-xs text-destructive">
            La comisión debe estar entre 0 y 100.
          </p>
        )}
      </div>
    </div>
  );
}
