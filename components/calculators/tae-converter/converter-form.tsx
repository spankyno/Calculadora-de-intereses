"use client";

import * as React from "react";
import { ArrowRightLeft } from "lucide-react";
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
  COMPOUNDING_FREQUENCIES,
  COMPOUNDING_FREQUENCY_LABELS,
  type CompoundingFrequency,
  type ConversionMode,
  type ConverterInput,
} from "@/lib/calculators/tae-converter";
import { useNumberInput } from "@/lib/hooks/use-number-input";
import { cn } from "@/lib/utils";

interface ConverterFormProps {
  input: ConverterInput;
  onChange: (input: ConverterInput) => void;
}

const MODE_OPTIONS: { id: ConversionMode; label: string }[] = [
  { id: "tin-to-tae", label: "TIN → TAE" },
  { id: "tae-to-tin", label: "TAE → TIN" },
];

export function ConverterForm({ input, onChange }: ConverterFormProps) {
  const value = useNumberInput(input.value);

  React.useEffect(() => {
    onChange({ ...input, value: Number.isFinite(value.value) ? value.value : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.raw]);

  const valueError = Number.isFinite(value.value) && value.value < 0;
  const inputLabel = input.mode === "tin-to-tae" ? "TIN nominal" : "TAE";

  return (
    <div className="space-y-6">
      {/* Modo de conversión */}
      <div className="space-y-2">
        <Label>Conversión</Label>
        <div className="inline-flex w-full rounded-xl border border-border bg-muted/40 p-1">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ ...input, mode: opt.id })}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
                input.mode === opt.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Valor de entrada */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="value">{inputLabel}</Label>
          <InfoTooltip
            text={
              input.mode === "tin-to-tae"
                ? "Tipo de Interés Nominal anual del producto, antes de tener en cuenta el efecto de la capitalización."
                : "Tasa Anual Equivalente: la rentabilidad real anual, ya con el efecto de la capitalización incluido."
            }
          />
        </div>
        <div className="relative">
          <Input
            id="value"
            inputMode="decimal"
            value={value.raw}
            onChange={(e) => value.onChange(e.target.value)}
            placeholder="3,50"
            error={valueError}
            className="pr-10 text-lg font-semibold"
            aria-invalid={valueError}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
        {valueError && (
          <p className="text-xs text-destructive">El valor no puede ser negativo.</p>
        )}
      </div>

      {/* Frecuencia de liquidación */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="frequency">Frecuencia de liquidación</Label>
          <InfoTooltip text="Cada cuánto se liquidan (capitalizan) los intereses. Determina la relación exacta entre el TIN nominal y la TAE real." />
        </div>
        <Select
          value={input.frequency}
          onValueChange={(freq: CompoundingFrequency) =>
            onChange({ ...input, frequency: freq })
          }
        >
          <SelectTrigger id="frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMPOUNDING_FREQUENCIES.map((freq) => (
              <SelectItem key={freq} value={freq}>
                {COMPOUNDING_FREQUENCY_LABELS[freq]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground">
        <ArrowRightLeft className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          {input.mode === "tin-to-tae"
            ? "Convertimos tu TIN nominal a la TAE real que resulta al liquidarse con la frecuencia indicada."
            : "Convertimos tu TAE objetivo al TIN nominal que un producto debería ofrecer, liquidando con la frecuencia indicada."}
        </p>
      </div>
    </div>
  );
}
