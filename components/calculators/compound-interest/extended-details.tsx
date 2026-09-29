"use client";

import { DetailTable, type DetailRow } from "@/components/ui/detail-table";
import {
  calculateCompoundInterestYearlyBreakdown,
  COMPOUNDING_FREQUENCY_LABELS,
  DURATION_UNIT_LABELS,
  type CompoundInterestInput,
  type CompoundInterestResult,
} from "@/lib/calculators/compound-interest";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface ExtendedDetailsProps {
  input: CompoundInterestInput;
  result: CompoundInterestResult;
}

export function ExtendedDetails({ input, result }: ExtendedDetailsProps) {
  const rows: DetailRow[] = [
    {
      label: "Capital inicial",
      value: formatCurrency(input.principal),
    },
    { label: "TIN anual (nominal)", value: formatPercent(input.annualRate) },
    {
      label: "Frecuencia de capitalización",
      value: COMPOUNDING_FREQUENCY_LABELS[input.compoundingFrequency],
    },
    {
      label: "TAE (tasa anual equivalente)",
      value: formatPercent(result.effectiveAnnualRate),
    },
    {
      label: "Duración",
      value: `${input.duration} ${DURATION_UNIT_LABELS[input.durationUnit]}`,
    },
    {
      label: "Intereses brutos",
      value: formatCurrency(result.grossInterest),
    },
    { label: "Retención aplicada", value: formatPercent(input.taxRate, 0) },
    {
      label: "Importe retenido",
      value: `− ${formatCurrency(result.taxWithheld)}`,
    },
    {
      label: "Intereses netos",
      value: formatCurrency(result.netInterest),
      emphasis: true,
    },
    {
      label: "Capital final bruto",
      value: formatCurrency(result.finalCapitalGross),
    },
    {
      label: "Capital final neto",
      value: formatCurrency(result.finalCapitalNet),
      emphasis: true,
    },
    {
      label: "Rentabilidad neta (total)",
      value: formatPercent(result.netYieldPercent),
    },
    {
      label: "Rentabilidad neta anualizada",
      value: formatPercent(result.netYieldAnnualizedPercent),
    },
  ];

  const yearly = calculateCompoundInterestYearlyBreakdown(input);

  return (
    <div className="space-y-5">
      <DetailTable rows={rows} />

      {yearly.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Evolución anual del capital
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Periodo
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Capital inicio
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Interés generado
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Capital final
                  </th>
                </tr>
              </thead>
              <tbody>
                {yearly.map((row, i) => (
                  <tr
                    key={row.year}
                    className={cn(
                      i !== yearly.length - 1 && "border-b border-border/70",
                      i === yearly.length - 1 && "bg-muted/30"
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium">{row.label}</td>
                    <td className="px-4 py-2.5 text-right num-tabular">
                      {formatCurrency(row.startCapital)}
                    </td>
                    <td className="px-4 py-2.5 text-right num-tabular text-gain">
                      +{formatCurrency(row.interestGross)}
                    </td>
                    <td className="px-4 py-2.5 text-right num-tabular font-semibold">
                      {formatCurrency(row.endCapital)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Importes en bruto, antes de aplicar la retención fiscal.
          </p>
        </div>
      )}
    </div>
  );
}
