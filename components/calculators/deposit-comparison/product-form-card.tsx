"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CAPITALIZATION_TYPE_LABELS,
  COMPOUNDING_FREQUENCIES,
  COMPOUNDING_FREQUENCY_LABELS,
  DURATION_UNIT_LABELS,
  calculateDepositProduct,
  type CapitalizationType,
  type CompoundingFrequency,
  type DepositProduct,
  type DurationUnit,
} from "@/lib/calculators/deposit-comparison";
import { useNumberInput } from "@/lib/hooks/use-number-input";
import { cn, formatCurrency } from "@/lib/utils";

interface ProductFormCardProps {
  product: DepositProduct;
  index: number;
  canRemove: boolean;
  onChange: (product: DepositProduct) => void;
  onRemove: () => void;
}

export function ProductFormCard({
  product,
  index,
  canRemove,
  onChange,
  onRemove,
}: ProductFormCardProps) {
  const principal = useNumberInput(product.principal);
  const rate = useNumberInput(product.annualRate);
  const duration = useNumberInput(product.duration);
  const openingFee = useNumberInput(product.openingFee);
  const maintenanceFee = useNumberInput(product.maintenanceFeeAnnual);
  const tax = useNumberInput(product.taxRate);

  React.useEffect(() => {
    onChange({
      ...product,
      principal: Number.isFinite(principal.value) ? principal.value : 0,
      annualRate: Number.isFinite(rate.value) ? rate.value : 0,
      duration: Number.isFinite(duration.value) ? duration.value : 0,
      openingFee: Number.isFinite(openingFee.value) ? openingFee.value : 0,
      maintenanceFeeAnnual: Number.isFinite(maintenanceFee.value)
        ? maintenanceFee.value
        : 0,
      taxRate: Number.isFinite(tax.value) ? tax.value : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    principal.raw,
    rate.raw,
    duration.raw,
    openingFee.raw,
    maintenanceFee.raw,
    tax.raw,
  ]);

  const result = calculateDepositProduct(product);
  const isValid = product.principal > 0 && product.duration > 0;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
            {index + 1}
          </span>
          <input
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            className="w-full max-w-[220px] truncate bg-transparent font-display text-lg font-medium outline-none focus:underline"
            aria-label="Nombre del producto"
            placeholder="Nombre del producto"
          />
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label={`Eliminar ${product.name}`}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Capital */}
        <Field label="Capital">
          <div className="relative">
            <Input
              inputMode="decimal"
              value={principal.raw}
              onChange={(e) => principal.onChange(e.target.value)}
              className="pr-8"
            />
            <Unit>€</Unit>
          </div>
        </Field>

        {/* TIN */}
        <Field label="TIN anual">
          <div className="relative">
            <Input
              inputMode="decimal"
              value={rate.raw}
              onChange={(e) => rate.onChange(e.target.value)}
              className="pr-8"
            />
            <Unit>%</Unit>
          </div>
        </Field>

        {/* Duración */}
        <Field label="Duración">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              inputMode="decimal"
              value={duration.raw}
              onChange={(e) => duration.onChange(e.target.value)}
            />
            <Select
              value={product.durationUnit}
              onValueChange={(unit: DurationUnit) =>
                onChange({ ...product, durationUnit: unit })
              }
            >
              <SelectTrigger className="w-[100px]">
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
        </Field>

        {/* Retención */}
        <Field label="Retención">
          <div className="relative">
            <Input
              inputMode="decimal"
              value={tax.raw}
              onChange={(e) => tax.onChange(e.target.value)}
              className="pr-8"
            />
            <Unit>%</Unit>
          </div>
        </Field>

        {/* Capitalización */}
        <Field label="Capitalización" tooltip="Simple: el interés se calcula siempre sobre el capital inicial. Compuesta: los intereses generados se reinvierten y también generan interés.">
          <div className="inline-flex w-full rounded-xl border border-border bg-muted/40 p-1">
            {(
              Object.keys(CAPITALIZATION_TYPE_LABELS) as CapitalizationType[]
            ).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onChange({ ...product, capitalizationType: type })
                }
                className={cn(
                  "flex-1 rounded-lg py-2 text-xs font-semibold transition-colors",
                  product.capitalizationType === type
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {CAPITALIZATION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </Field>

        {/* Frecuencia (solo si compuesta) */}
        {product.capitalizationType === "compuesta" ? (
          <Field label="Frecuencia">
            <Select
              value={product.compoundingFrequency}
              onValueChange={(freq: CompoundingFrequency) =>
                onChange({ ...product, compoundingFrequency: freq })
              }
            >
              <SelectTrigger>
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
          </Field>
        ) : (
          <div />
        )}

        {/* Comisión de apertura */}
        <Field label="Comisión de apertura">
          <div className="relative">
            <Input
              inputMode="decimal"
              value={openingFee.raw}
              onChange={(e) => openingFee.onChange(e.target.value)}
              className="pr-8"
            />
            <Unit>€</Unit>
          </div>
        </Field>

        {/* Comisión de mantenimiento */}
        <Field label="Mantenimiento" tooltip="Comisión de mantenimiento anual. Se prorratea automáticamente según la duración del depósito.">
          <div className="relative">
            <Input
              inputMode="decimal"
              value={maintenanceFee.raw}
              onChange={(e) => maintenanceFee.onChange(e.target.value)}
              className="pr-14"
            />
            <Unit>€/año</Unit>
          </div>
        </Field>
      </div>

      {/* Mini resultado en vivo */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Capital final neto
        </span>
        <span className="font-display text-base font-medium num-tabular">
          {isValid ? formatCurrency(result.finalCapitalNet) : "—"}
        </span>
      </div>
    </Card>
  );
}

function Field({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-[11px]">{label}</Label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      {children}
    </div>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
