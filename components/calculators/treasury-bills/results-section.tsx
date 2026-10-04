"use client";

import * as React from "react";
import { LayoutGrid, Table2, Copy, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "./comparison-table";
import { ComparisonCards } from "./comparison-cards";
import { ComparisonChart } from "./comparison-chart";
import {
  LETRA_TERM_LABELS,
  type TreasuryBillResult,
} from "@/lib/calculators/treasury-bills";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ResultsSectionProps {
  results: TreasuryBillResult[];
}

export function ResultsSection({ results }: ResultsSectionProps) {
  const [view, setView] = React.useState<"table" | "cards">("table");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const lines = results.map((r) =>
      [
        `${LETRA_TERM_LABELS[r.term]}`,
        `  Nº letras: ${r.numLetras}`,
        `  Capital invertido: ${formatCurrency(r.capitalInvested)}`,
        `  Sobrante: ${formatCurrency(r.leftover)}`,
        `  Importe bruto al vencimiento: ${formatCurrency(r.grossMaturityAmount)}`,
        `  Impuestos: ${formatCurrency(r.taxWithheld)}`,
        `  Importe neto al vencimiento: ${formatCurrency(r.netMaturityAmount)}`,
        `  Rentabilidad neta anualizada: ${formatPercent(r.netYieldAnnualizedPercent)}`,
      ].join("\n")
    );
    const text = `Comparativa de Letras del Tesoro\n\n${lines.join("\n\n")}`;
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
      <ComparisonChart results={results} />

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
          <ComparisonTable results={results} />
        </div>
      ) : null}

      <div className={cn(view === "table" ? "sm:hidden" : "")}>
        <ComparisonCards results={results} />
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
