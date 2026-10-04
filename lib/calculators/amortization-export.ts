/**
 * Utilidades de presentación y exportación para cualquier cuadro de
 * amortización (Préstamo personal, Hipoteca, Amortización anticipada).
 * Permite verla mes a mes o año a año, y exportarla a CSV o PDF.
 */
import type { LoanAmortizationRow } from "./loan-math";

export type AmortizationView = "mensual" | "anual";

export interface AggregatedRow {
  /** "1", "2"... — número de mes o de año, según la vista */
  period: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}

export function toMonthlyRows(
  schedule: LoanAmortizationRow[]
): AggregatedRow[] {
  return schedule.map((row) => ({
    period: row.month,
    payment: row.payment,
    interestPayment: row.interestPayment,
    principalPayment: row.principalPayment,
    remainingBalance: row.remainingBalance,
  }));
}

/**
 * Agrupa el cuadro mensual en filas anuales, sumando cuotas e intereses de
 * cada año y tomando el capital pendiente al final de ese año. Asume que el
 * cuadro empieza en el mes 1 del préstamo (siempre es así en esta app).
 */
export function toYearlyRows(
  schedule: LoanAmortizationRow[]
): AggregatedRow[] {
  const rows: AggregatedRow[] = [];
  for (let i = 0; i < schedule.length; i += 12) {
    const chunk = schedule.slice(i, i + 12);
    rows.push({
      period: Math.floor(i / 12) + 1,
      payment: chunk.reduce((sum, r) => sum + r.payment, 0),
      interestPayment: chunk.reduce((sum, r) => sum + r.interestPayment, 0),
      principalPayment: chunk.reduce((sum, r) => sum + r.principalPayment, 0),
      remainingBalance: chunk[chunk.length - 1].remainingBalance,
    });
  }
  return rows;
}

export function getAggregatedRows(
  schedule: LoanAmortizationRow[],
  view: AmortizationView
): AggregatedRow[] {
  return view === "anual" ? toYearlyRows(schedule) : toMonthlyRows(schedule);
}

function formatPlain(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function downloadAmortizationCsv(
  rows: AggregatedRow[],
  view: AmortizationView,
  fileName: string
) {
  const periodLabel = view === "anual" ? "Año" : "Mes";
  const header = `${periodLabel};Cuota;Interes;Capital amortizado;Capital pendiente\n`;
  const body = rows
    .map((row) =>
      [
        row.period,
        formatPlain(row.payment),
        formatPlain(row.interestPayment),
        formatPlain(row.principalPayment),
        formatPlain(row.remainingBalance),
      ].join(";")
    )
    .join("\n");

  const csvContent = "\uFEFF" + header + body;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Genera y descarga un PDF del cuadro de amortización, usando jsPDF de
 * forma perezosa (import dinámico) para no engordar el bundle principal.
 */
export async function downloadAmortizationPdf(
  rows: AggregatedRow[],
  view: AmortizationView,
  fileName: string,
  title: string,
  formatCurrencyFn: (value: number) => string
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const periodLabel = view === "anual" ? "Año" : "Mes";

  doc.setFontSize(14);
  doc.text(title, 40, 40);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Cuadro de amortización ${view === "anual" ? "anual" : "mensual"} — generado con Calculadora de Intereses`,
    40,
    58
  );

  autoTable(doc, {
    startY: 75,
    head: [[periodLabel, "Cuota", "Interés", "Capital", "Pendiente"]],
    body: rows.map((row) => [
      String(row.period),
      formatCurrencyFn(row.payment),
      formatCurrencyFn(row.interestPayment),
      formatCurrencyFn(row.principalPayment),
      formatCurrencyFn(row.remainingBalance),
    ]),
    headStyles: { fillColor: [10, 70, 50], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8.5 },
    alternateRowStyles: { fillColor: [245, 243, 237] },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${fileName}.pdf`);
}
