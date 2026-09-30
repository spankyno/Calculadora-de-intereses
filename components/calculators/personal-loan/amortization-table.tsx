"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AmortizationRow } from "@/lib/calculators/personal-loan";
import { cn, formatCurrency } from "@/lib/utils";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

function downloadCsv(schedule: AmortizationRow[]) {
  const header = "Mes;Cuota;Interes;Capital amortizado;Capital pendiente\n";
  const rows = schedule
    .map((row) =>
      [
        row.month,
        row.payment.toFixed(2),
        row.interestPayment.toFixed(2),
        row.principalPayment.toFixed(2),
        row.remainingBalance.toFixed(2),
      ]
        .join(";")
        .replace(/\./g, ",")
    )
    .join("\n");

  const csvContent = "\uFEFF" + header + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tabla-amortizacion.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function AmortizationTable({ schedule }: AmortizationTableProps) {
  if (schedule.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Tabla de amortización mensual
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadCsv(schedule)}
          className="gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Descargar CSV
        </Button>
      </div>
      <div className="max-h-[420px] overflow-y-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border bg-card text-left shadow-[0_1px_0_0_hsl(var(--border))]">
              <th className="bg-muted/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Mes
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
            {schedule.map((row, i) => (
              <tr
                key={row.month}
                className={cn(
                  i !== schedule.length - 1 && "border-b border-border/70",
                  row.month % 12 === 0 && "bg-muted/20"
                )}
              >
                <td className="px-4 py-2 font-medium">{row.month}</td>
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
