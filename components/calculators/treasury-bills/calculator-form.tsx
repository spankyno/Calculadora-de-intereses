"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  LETRA_TERMS,
  LETRA_TERM_LABELS,
  NOMINAL_PER_LETRA,
  type LetraTerm,
  type TreasuryBillsInput,
} from "@/lib/calculators/treasury-bills";
import { useNumberInput } from "@/lib/hooks/use-number-input";

interface CalculatorFormProps {
  input: TreasuryBillsInput;
  onChange: (input: TreasuryBillsInput) => void;
}

export function CalculatorForm({ input, onChange }: CalculatorFormProps) {
  const capital = useNumberInput(input.capitalToInvest);
  const commission = useNumberInput(input.commissionPercent);
  const tax = useNumberInput(input.taxRate);
  const rate3m = useNumberInput(input.rates["3m"]);
  const rate6m = useNumberInput(input.rates["6m"]);
  const rate9m = useNumberInput(input.rates["9m"]);
  const rate12m = useNumberInput(input.rates["12m"]);

  const rateInputs: Record<LetraTerm, ReturnType<typeof useNumberInput>> = {
    "3m": rate3m,
    "6m": rate6m,
    "9m": rate9m,
    "12m": rate12m,
  };

  React.useEffect(() => {
    onChange({
      ...input,
      capitalToInvest: Number.isFinite(capital.value) ? capital.value : 0,
      commissionPercent: Number.isFinite(commission.value) ? commission.value : 0,
      taxRate: Number.isFinite(tax.value) ? tax.value : 0,
      rates: {
        "3m": Number.isFinite(rate3m.value) ? rate3m.value : 0,
        "6m": Number.isFinite(rate6m.value) ? rate6m.value : 0,
        "9m": Number.isFinite(rate9m.value) ? rate9m.value : 0,
        "12m": Number.isFinite(rate12m.value) ? rate12m.value : 0,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    capital.raw,
    commission.raw,
    tax.raw,
    rate3m.raw,
    rate6m.raw,
    rate9m.raw,
    rate12m.raw,
  ]);

  const capitalError =
    Number.isFinite(capital.value) && capital.value < NOMINAL_PER_LETRA;

  return (
    <div className="space-y-6">
      {/* Capital a invertir */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="capital">Capital a desembolsar</Label>
          <InfoTooltip text={`Cada letra tiene un nominal de ${NOMINAL_PER_LETRA.toLocaleString("es-ES")} €. Al comprarse en unidades enteras, es normal que no se pueda invertir el 100% del capital: el resto queda como sobrante.`} />
        </div>
        <div className="relative">
          <Input
            id="capital"
            inputMode="decimal"
            value={capital.raw}
            onChange={(e) => capital.onChange(e.target.value)}
            placeholder="10.000"
            error={capitalError}
            className="pr-10 text-lg font-semibold"
            aria-invalid={capitalError}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            €
          </span>
        </div>
        {capitalError && (
          <p className="text-xs text-destructive">
            El capital debe ser de al menos {NOMINAL_PER_LETRA.toLocaleString("es-ES")} € (el nominal de una letra).
          </p>
        )}
      </div>

      {/* Rentabilidad por plazo */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Rentabilidad por plazo (TIR anual)</Label>
          <InfoTooltip text="El tipo de interés marginal resultante de la última subasta de letras para cada plazo. Actualízalo con los datos publicados en tesoro.es para una estimación más precisa." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LETRA_TERMS.map((term) => (
            <div key={term} className="space-y-1">
              <Label className="text-[11px] font-normal normal-case text-muted-foreground">
                {LETRA_TERM_LABELS[term]}
              </Label>
              <div className="relative">
                <Input
                  inputMode="decimal"
                  value={rateInputs[term].raw}
                  onChange={(e) => rateInputs[term].onChange(e.target.value)}
                  className="pr-8"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comisión */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="commission">Comisión del bróker</Label>
          <InfoTooltip text="Comprar directamente en el Tesoro Público (tesoro.es) no tiene comisión. Algunos bancos sí cobran una comisión de compra o custodia." />
        </div>
        <div className="relative">
          <Input
            id="commission"
            inputMode="decimal"
            value={commission.raw}
            onChange={(e) => commission.onChange(e.target.value)}
            placeholder="0"
            className="pr-10"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
      </div>

      {/* Impuestos */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="tax">Tipo impositivo (IRPF)</Label>
          <InfoTooltip text="Las letras del Tesoro no suelen tener retención a cuenta, pero el rendimiento tributa igualmente en la base del ahorro de tu declaración de la renta." />
        </div>
        <div className="relative">
          <Input
            id="tax"
            inputMode="decimal"
            value={tax.raw}
            onChange={(e) => tax.onChange(e.target.value)}
            placeholder="19"
            className="pr-10"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
