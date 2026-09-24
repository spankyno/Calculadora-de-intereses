"use client";

import * as React from "react";
import { LayoutGrid, Table2, Copy, Printer, Check, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "./comparison-table";
import { ComparisonCards } from "./comparison-cards";
import { ComparisonChart } from "./comparison-chart";
import {
  calculateCompoundInterest,
  COMPOUNDING_FREQUENCY_LABELS,
  DURATION_UNIT_LABELS,
  type CompoundInterestScenario,
} from "@/lib/calculators/compound-interest";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ComparisonSectionProps {
  scenarios: CompoundInterestScenario[];
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ComparisonSection({
  scenarios,
  onRemove,
  onRename,
}: ComparisonSectionProps) {
  const [view, setView] = React.useState<"table" | "cards">("table");
  const [copied, setCopied] = React.useState(false);

  if (scenarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Scale className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-4 font-display text-lg font-medium">
          Aún no hay escenarios para comparar
        </p>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Ajusta la calculadora a tu gusto y pulsa{" "}
          <span className="font-medium text-foreground">
            &ldquo;Añadir a comparativa&rdquo;
          </span>{" "}
          para guardar el escenario y compararlo con otros.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    const lines = scenarios.map((s) => {
      const r = calculateCompoundInterest(s.input);
      return [
        `${s.name}`,
        `  Capital: ${formatCurrency(s.input.principal)}`,
        `  TIN: ${formatPercent(s.input.annualRate)}`,
        `  Capitalización: ${COMPOUNDING_FREQUENCY_LABELS[s.input.compoundingFrequency]}`,
        `  Duración: ${s.input.duration} ${DURATION_UNIT_LABELS[s.input.durationUnit]}`,
        `  TAE: ${formatPercent(r.effectiveAnnualRate)}`,
        `  Intereses netos: ${formatCurrency(r.netInterest)}`,
        `  Capital final neto: ${formatCurrency(r.finalCapitalNet)}`,
      ].join("\n");
    });
    const text = `Comparativa · Interés compuesto\n\n${lines.join("\n\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // portapapeles no disponible; se ignora silenciosamente
    }
  };

  return (
    <div className="space-y-4" id="comparativa-imprimible">
      <ComparisonChart scenarios={scenarios} />

      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
          <ToggleButton
            active={view === "table"}
            onClick={() => setView("table")}
            icon={<Table2 className="h-3.5 w-3.5" />}
            label="Tabla"
          />
          <ToggleButton
            active={view === "cards"}
            onClick={() => setView("cards")}
            icon={<LayoutGrid className="h-3.5 w-3.5" />}
            label="Cards"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-gain" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copiado" : "Copiar resumen"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <div className="hidden sm:block">
          <ComparisonTable
            scenarios={scenarios}
            onRemove={onRemove}
            onRename={onRename}
          />
        </div>
      ) : null}

      <div className={cn(view === "table" ? "sm:hidden" : "")}>
        <ComparisonCards
          scenarios={scenarios}
          onRemove={onRemove}
          onRename={onRename}
        />
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
