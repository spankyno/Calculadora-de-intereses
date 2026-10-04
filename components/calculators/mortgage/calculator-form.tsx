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
  MORTGAGE_DURATION_UNIT_LABELS,
  MORTGAGE_RATE_TYPE_LABELS,
  type MortgageDurationUnit,
  type MortgageInput,
  type MortgageRateType,
} from "@/lib/calculators/mortgage";
import { useNumberInput } from "@/lib/hooks/use-number-input";
import { cn } from "@/lib/utils";

interface CalculatorFormProps {
  input: MortgageInput;
  onChange: (input: MortgageInput) => void;
}

export function CalculatorForm({ input, onChange }: CalculatorFormProps) {
  const principal = useNumberInput(input.principal);
  const fixedRate = useNumberInput(input.fixedRate);
  const euriborRate = useNumberInput(input.euriborRate);
  const spread = useNumberInput(input.spread);
  const duration = useNumberInput(input.duration);
  const fee = useNumberInput(input.openingFeePercent);

  React.useEffect(() => {
    onChange({
      ...input,
      principal: Number.isFinite(principal.value) ? principal.value : 0,
      fixedRate: Number.isFinite(fixedRate.value) ? fixedRate.value : 0,
      euriborRate: Number.isFinite(euriborRate.value) ? euriborRate.value : 0,
      spread: Number.isFinite(spread.value) ? spread.value : 0,
      duration: Number.isFinite(duration.value) ? duration.value : 0,
      openingFeePercent: Number.isFinite(fee.value) ? fee.value : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    principal.raw,
    fixedRate.raw,
    euriborRate.raw,
    spread.raw,
    duration.raw,
    fee.raw,
  ]);

  const principalError = Number.isFinite(principal.value) && principal.value <= 0;
  const durationError = Number.isFinite(duration.value) && duration.value <= 0;

  return (
    <div className="space-y-6">
      {/* Capital */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="principal">Capital hipotecado</Label>
          <InfoTooltip text="El importe total que solicitas financiar para la compra de la vivienda." />
        </div>
        <div className="relative">
          <Input
            id="principal"
            inputMode="decimal"
            value={principal.raw}
            onChange={(e) => principal.onChange(e.target.value)}
            placeholder="180.000"
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

      {/* Tipo de interés */}
      <div className="space-y-2">
        <Label>Tipo de interés</Label>
        <div className="inline-flex w-full rounded-xl border border-border bg-muted/40 p-1">
          {(
            Object.keys(MORTGAGE_RATE_TYPE_LABELS) as MortgageRateType[]
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...input, rateType: type })}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-colors",
                input.rateType === type
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type === "fijo" ? "Fijo" : "Variable"}
            </button>
          ))}
        </div>
      </div>

      {input.rateType === "fijo" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="fixedRate">TIN fijo</Label>
            <InfoTooltip text="Tipo de interés fijo durante toda la vida de la hipoteca." />
          </div>
          <div className="relative">
            <Input
              id="fixedRate"
              inputMode="decimal"
              value={fixedRate.raw}
              onChange={(e) => fixedRate.onChange(e.target.value)}
              placeholder="3,20"
              className="pr-10 text-lg font-semibold"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="euribor">Euríbor actual</Label>
              <InfoTooltip text="El valor de referencia del Euríbor en el momento de la revisión. Puedes actualizarlo con el valor publicado más reciente." />
            </div>
            <div className="relative">
              <Input
                id="euribor"
                inputMode="decimal"
                value={euriborRate.raw}
                onChange={(e) => euriborRate.onChange(e.target.value)}
                placeholder="3,00"
                className="pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="spread">Diferencial</Label>
              <InfoTooltip text="El margen fijo que añade el banco sobre el Euríbor." />
            </div>
            <div className="relative">
              <Input
                id="spread"
                inputMode="decimal"
                value={spread.raw}
                onChange={(e) => spread.onChange(e.target.value)}
                placeholder="0,80"
                className="pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <p className="col-span-2 text-xs text-muted-foreground">
            TIN resultante:{" "}
            <span className="font-semibold text-foreground">
              {(euriborRate.value + spread.value).toFixed(2).replace(".", ",")}
              %
            </span>
          </p>
        </div>
      )}

      {/* Plazo */}
      <div className="space-y-2">
        <Label htmlFor="duration">Plazo</Label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input
            id="duration"
            inputMode="decimal"
            value={duration.raw}
            onChange={(e) => duration.onChange(e.target.value)}
            placeholder="25"
            error={durationError}
            className="text-lg font-semibold"
            aria-invalid={durationError}
          />
          <Select
            value={input.durationUnit}
            onValueChange={(unit: MortgageDurationUnit) =>
              onChange({ ...input, durationUnit: unit })
            }
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.keys(
                  MORTGAGE_DURATION_UNIT_LABELS
                ) as MortgageDurationUnit[]
              ).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {MORTGAGE_DURATION_UNIT_LABELS[unit]}
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
          <InfoTooltip text="Porcentaje que el banco descuenta del capital al formalizar la hipoteca. Muchas hipotecas actuales no la cobran." />
        </div>
        <div className="relative">
          <Input
            id="fee"
            inputMode="decimal"
            value={fee.raw}
            onChange={(e) => fee.onChange(e.target.value)}
            placeholder="0"
            className="pr-10 text-lg font-semibold"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
