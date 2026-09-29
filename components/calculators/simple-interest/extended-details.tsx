"use client";

import { DetailTable, type DetailRow } from "@/components/ui/detail-table";
import type {
  SimpleInterestInput,
  SimpleInterestResult,
} from "@/lib/calculators/simple-interest";
import { DURATION_UNIT_LABELS } from "@/lib/calculators/simple-interest";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ExtendedDetailsProps {
  input: SimpleInterestInput;
  result: SimpleInterestResult;
}

export function ExtendedDetails({ input, result }: ExtendedDetailsProps) {
  const rows: DetailRow[] = [
    {
      label: "Capital inicial",
      value: formatCurrency(input.principal),
    },
    { label: "TIN anual", value: formatPercent(input.annualRate) },
    { label: "TIN mensual", value: formatPercent(result.monthlyRate) },
    { label: "TIN trimestral", value: formatPercent(result.quarterlyRate) },
    { label: "TIN semestral", value: formatPercent(result.semiannualRate) },
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

  return <DetailTable rows={rows} />;
}
