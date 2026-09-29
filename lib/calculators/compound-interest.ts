/**
 * Motor de cálculo del Interés Compuesto (módulo "Interés compuesto").
 * Lógica pura, sin dependencias de React, fácil de testear y reutilizar.
 */
import {
  durationToYears,
  DURATION_UNIT_LABELS,
  DEFAULT_TAX_RATE,
  generateScenarioId,
  COMPOUNDING_FREQUENCY_TIMES,
  COMPOUNDING_FREQUENCY_LABELS,
  type DurationUnit,
  type CompoundingFrequency,
} from "./shared";

export type { DurationUnit, CompoundingFrequency } from "./shared";
export {
  DURATION_UNIT_LABELS,
  DEFAULT_TAX_RATE,
  durationToYears,
  COMPOUNDING_FREQUENCY_TIMES,
  COMPOUNDING_FREQUENCY_LABELS,
} from "./shared";

export interface CompoundInterestInput {
  /** Capital inicial en euros */
  principal: number;
  /** TIN anual en % (ej. 3.5 significa 3,5%) */
  annualRate: number;
  /** Frecuencia de capitalización del interés */
  compoundingFrequency: CompoundingFrequency;
  /** Duración en la unidad indicada */
  duration: number;
  /** Unidad de la duración */
  durationUnit: DurationUnit;
  /** Retención de impuestos en % (por defecto 19% en España) */
  taxRate: number;
}

export interface CompoundInterestResult {
  /** Duración expresada en años (decimal) */
  durationInYears: number;
  /** TAE (Tasa Anual Equivalente) real, en % — (1 + TIN/n)^n − 1 */
  effectiveAnnualRate: number;
  /** Intereses brutos generados */
  grossInterest: number;
  /** Importe retenido por impuestos */
  taxWithheld: number;
  /** Intereses netos tras retención */
  netInterest: number;
  /** Capital final bruto (capital + intereses brutos) */
  finalCapitalGross: number;
  /** Capital final neto (capital + intereses netos) */
  finalCapitalNet: number;
  /** Rentabilidad neta total en % sobre el capital inicial */
  netYieldPercent: number;
  /** Rentabilidad neta anualizada en % */
  netYieldAnnualizedPercent: number;
}

/**
 * Calcula el interés compuesto completo a partir de los datos de entrada.
 * Fórmula: Capital final bruto = Capital × (1 + TIN / (100 × n)) ^ (n × tiempo)
 * donde n es el nº de capitalizaciones anuales.
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const { principal, annualRate, compoundingFrequency, duration, durationUnit, taxRate } =
    input;

  const durationInYears = durationToYears(duration, durationUnit);
  const n = COMPOUNDING_FREQUENCY_TIMES[compoundingFrequency];
  const ratePerPeriod = annualRate / 100 / n;

  const effectiveAnnualRate = (Math.pow(1 + ratePerPeriod, n) - 1) * 100;

  const finalCapitalGross =
    principal * Math.pow(1 + ratePerPeriod, n * durationInYears);

  const grossInterest = finalCapitalGross - principal;
  const taxWithheld = grossInterest * (taxRate / 100);
  const netInterest = grossInterest - taxWithheld;
  const finalCapitalNet = principal + netInterest;

  const netYieldPercent = principal > 0 ? (netInterest / principal) * 100 : 0;
  const netYieldAnnualizedPercent =
    durationInYears > 0 ? netYieldPercent / durationInYears : 0;

  return {
    durationInYears,
    effectiveAnnualRate,
    grossInterest,
    taxWithheld,
    netInterest,
    finalCapitalGross,
    finalCapitalNet,
    netYieldPercent,
    netYieldAnnualizedPercent,
  };
}

export function isValidCompoundInterestInput(
  input: Partial<CompoundInterestInput>
): boolean {
  return (
    typeof input.principal === "number" &&
    input.principal > 0 &&
    typeof input.annualRate === "number" &&
    input.annualRate >= 0 &&
    typeof input.duration === "number" &&
    input.duration > 0 &&
    typeof input.taxRate === "number" &&
    input.taxRate >= 0 &&
    input.taxRate <= 100
  );
}

/** Escenario nombrado, usado en el modo comparativa */
export interface CompoundInterestScenario {
  id: string;
  name: string;
  input: CompoundInterestInput;
}

export function createDefaultCompoundScenario(
  name: string,
  overrides?: Partial<CompoundInterestInput>
): CompoundInterestScenario {
  return {
    id: generateScenarioId(),
    name,
    input: {
      principal: 10000,
      annualRate: 3.5,
      compoundingFrequency: "anual",
      duration: 5,
      durationUnit: "anios",
      taxRate: DEFAULT_TAX_RATE,
      ...overrides,
    },
  };
}

export interface YearlyBreakdownRow {
  /** Número de año (1, 2, 3...) */
  year: number;
  /** Etiqueta a mostrar, indica si el último periodo es parcial */
  label: string;
  /** Capital al inicio del año */
  startCapital: number;
  /** Interés bruto generado durante el año */
  interestGross: number;
  /** Capital bruto al final del año */
  endCapital: number;
}

const MAX_YEARLY_BREAKDOWN_ROWS = 100;

/**
 * Genera el desglose año a año de la evolución del capital bruto, útil para
 * visualizar el efecto de la capitalización compuesta a lo largo del tiempo.
 * Si la duración no es un número entero de años, el último periodo se marca
 * como parcial y representa lo que queda hasta la duración total.
 */
export function calculateCompoundInterestYearlyBreakdown(
  input: CompoundInterestInput
): YearlyBreakdownRow[] {
  const { principal, annualRate, compoundingFrequency, duration, durationUnit } =
    input;

  const durationInYears = durationToYears(duration, durationUnit);
  if (principal <= 0 || durationInYears <= 0) return [];

  const n = COMPOUNDING_FREQUENCY_TIMES[compoundingFrequency];
  const ratePerPeriod = annualRate / 100 / n;

  const capitalAt = (years: number) =>
    principal * Math.pow(1 + ratePerPeriod, n * years);

  const rows: YearlyBreakdownRow[] = [];
  const fullYears = Math.min(
    Math.floor(durationInYears),
    MAX_YEARLY_BREAKDOWN_ROWS
  );

  let previousCapital = principal;
  for (let year = 1; year <= fullYears; year++) {
    const endCapital = capitalAt(year);
    rows.push({
      year,
      label: `Año ${year}`,
      startCapital: previousCapital,
      interestGross: endCapital - previousCapital,
      endCapital,
    });
    previousCapital = endCapital;
  }

  const remainder = durationInYears - fullYears;
  if (remainder > 0.001 && rows.length < MAX_YEARLY_BREAKDOWN_ROWS) {
    const endCapital = capitalAt(durationInYears);
    rows.push({
      year: fullYears + 1,
      label: `Año ${fullYears + 1} (parcial)`,
      startCapital: previousCapital,
      interestGross: endCapital - previousCapital,
      endCapital,
    });
  }

  return rows;
}
