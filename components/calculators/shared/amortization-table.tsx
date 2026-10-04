"use client";

import * as React from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LoanAmortizationRow } from "@/lib/calculators/loan-math";
import {
  getAggregatedRows,
  downloadAmortizationCsv,
  downloadAmortizationPdf,
  type AmortizationView,
} from "@/lib/calculators/amortization-export";
import { cn, formatCurrency } from "@/lib/utils";

interface AmortizationTableProps {
  schedule: LoanAmortizationRow[];
  /** Nombre base de los archivos exportados (sin extensión) */
  fileName?: string;
  /** Título usado en la cabecera del PDF */
  title?: string;
}

export function AmortizationTable({
  schedule,
  fileName = "tabla-amortizacion",
  title = "Tabla de amortización",
}: AmortizationTableProps) {
  const [view, setView] = React.useState<AmortizationView>("mensual");
  const [generatingPdf, setGeneratingPdf] = React.useState(false);

  if (schedule.length === 0) return null;

  const rows = getAggregatedRows(schedule, view);
  const periodLabel = view === "anual" ? "Año" : "Mes";

  const handlePdf = async () => {
    setGeneratingPdf(true);
    try {
      await downloadAmortizationPdf(rows, view, fileName, title, (v) =>
        formatCurrency(v)
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Tabla de amortización
          </p>
          <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
            {(["mensual", "anual"] as AmortizationView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors",
                  view === v
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v === "mensual" ? "Mes a mes" : "Año a año"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadAmortizationCsv(rows, view, fileName)}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePdf}
            disabled={generatingPdf}
            className="gap-1.5"
          >
            {generatingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            PDF
          </Button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border bg-card text-left shadow-[0_1px_0_0_hsl(var(--border))]">
              <th className="bg-muted/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {periodLabel}
              </th>
              <th className="bg-muted/60 px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Cuota
              </th>
              <th className="bg-muted/60 px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Interés
              </th>
              <th className="bg-muted/60 px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Capital
              </th>
              <th className="bg-muted/60 px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pendiente
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.period}
                className={cn(
                  i !== rows.length - 1 && "border-b border-border/70",
                  view === "mensual" && row.period % 12 === 0 && "bg-muted/20"
                )}
              >
                <td className="px-4 py-2 font-medium">{row.period}</td>
                <td className="px-4 py-2 text-right num-tabular">
                  {formatCurrency(row.payment)}
                </td>
                <td className="px-4 py-2 text-right num-tabular text-tax">
                  {formatCurrency(row.interestPayment)}
                </td>
                <td className="px-4 py-2 text-right num-tabular">
                  {formatCurrency(row.principalPayment)}
                </td>
                <td className="px-4 py-2 text-right num-tabular font-semibold">
                  {formatCurrency(row.remainingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
