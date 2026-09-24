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
  COMPOUNDING_FREQUENCY_LABELS,
  DURATION_UNIT_LABELS,
  type CompoundInterestInput,
  type CompoundingFrequency,
} from "@/lib/calculators/compound-interest";
import type { DurationUnit } from "@/lib/calculators/shared";
import { useNumberInput } from "@/lib/hooks/use-number-input";
import { cn } from "@/lib/utils";

interface CalculatorFormProps {
  input: CompoundInterestInput;
  onChange: (input: CompoundInterestInput) => void;
}

export function CalculatorForm({ input, onChange }: CalculatorFormProps) {
  const principal = useNumberInput(input.principal);
  const rate = useNumberInput(input.annualRate);
  const duration = useNumberInput(input.duration);
  const tax = useNumberInput(input.taxRate);

  // Sincroniza los valores parseados hacia arriba en cada cambio
  React.useEffect(() => {
    onChange({
      ...input,
      principal: Number.isFinite(principal.value) ? principal.value : 0,
      annualRate: Number.isFinite(rate.value) ? rate.value : 0,
      duration: Number.isFinite(duration.value) ? duration.value : 0,
      taxRate: Number.isFinite(tax.value) ? tax.value : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal.raw, rate.raw, duration.raw, tax.raw]);

  const principalError = Number.isFinite(principal.value) && principal.value <= 0;
  const rateError = Number.isFinite(rate.value) && rate.value < 0;
  const durationError = Number.isFinite(duration.value) && duration.value <= 0;
  const taxError =
    Number.isFinite(tax.value) && (tax.value < 0 || tax.value > 100);

  return (
    <div className="space-y-6">
      {/* Capital inicial */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="principal">Capital inicial</Label>
          <InfoTooltip text="La cantidad de dinero que depositas o inviertes al principio." />
        </div>
        <div className="relative">
          <Input
            id="principal"
            inputMode="decimal"
            value={principal.raw}
            onChange={(e) => principal.onChange(e.target.value)}
            placeholder="10.000"
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
          <InfoTooltip text="Tipo de Interés Nominal anual sobre el que se calcula el interés en cada periodo de capitalización." />
        </div>
        <div className="relative">
          <Input
            id="rate"
            inputMode="decimal"
            value={rate.raw}
            onChange={(e) => rate.onChange(e.target.value)}
            placeholder="3,50"
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

      {/* Frecuencia de capitalización */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="frequency">Frecuencia de capitalización</Label>
          <InfoTooltip text="Cada cuánto se reinvierten (capitalizan) los intereses generados. Cuanto más frecuente, mayor es la rentabilidad efectiva (TAE)." />
        </div>
        <Select
          value={input.compoundingFrequency}
          onValueChange={(freq: CompoundingFrequency) =>
            onChange({ ...input, compoundingFrequency: freq })
          }
        >
          <SelectTrigger id="frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              Object.keys(COMPOUNDING_FREQUENCY_LABELS) as CompoundingFrequency[]
            ).map((freq) => (
              <SelectItem key={freq} value={freq}>
                {COMPOUNDING_FREQUENCY_LABELS[freq]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duración */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duración</Label>
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
            onValueChange={(unit: DurationUnit) =>
              onChange({ ...input, durationUnit: unit })
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(DURATION_UNIT_LABELS) as DurationUnit[]).map(
                (unit) => (
                  <SelectItem key={unit} value={unit}>
                    {DURATION_UNIT_LABELS[unit]}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        {durationError && (
          <p className="text-xs text-destructive">
            La duración debe ser mayor que 0.
          </p>
        )}
      </div>

      {/* Retención de impuestos */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="tax">Retención de impuestos</Label>
          <InfoTooltip text="Porcentaje que Hacienda retiene sobre los rendimientos del capital mobiliario. En España, el tipo habitual es el 19% (puede variar según el importe)." />
        </div>
        <div className="relative">
          <Input
            id="tax"
            inputMode="decimal"
            value={tax.raw}
            onChange={(e) => tax.onChange(e.target.value)}
            placeholder="19"
            error={taxError}
            className={cn("pr-10 text-lg font-semibold")}
            aria-invalid={taxError}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
        {taxError && (
          <p className="text-xs text-destructive">
            La retención debe estar entre 0 y 100.
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[0, 19, 21, 23].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => tax.setValue(preset)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                tax.value === preset
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {preset === 0 ? "Sin retención" : `${preset}%`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
