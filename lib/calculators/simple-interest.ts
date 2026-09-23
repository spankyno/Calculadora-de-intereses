/**
 * Motor de cálculo del Interés Simple.
 * Lógica pura, sin dependencias de React, fácil de testear y reutilizar.
 */

export type DurationUnit = "dias" | "meses" | "anios";

export interface SimpleInterestInput {
  /** Capital inicial en euros */
  principal: number;
  /** TIN anual en % (ej. 3.5 significa 3,5%) */
  annualRate: number;
  /** Duración en la unidad indicada */
  duration: number;
  /** Unidad de la duración */
  durationUnit: DurationUnit;
  /** Retención de impuestos en % (por defecto 19% en España) */
  taxRate: number;
}

export interface SimpleInterestResult {
  /** Duración expresada en años (decimal) */
  durationInYears: number;
  /** TIN mensual equivalente (TIN anual / 12) */
  monthlyRate: number;
  /** TIN trimestral equivalente (TIN anual / 4) */
  quarterlyRate: number;
  /** TIN semestral equivalente (TIN anual / 2) */
  semiannualRate: number;
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
  /** Rentabilidad neta anualizada en % (TAE aproximada simple) */
  netYieldAnnualizedPercent: number;
}

const DAYS_IN_YEAR = 365;
const MONTHS_IN_YEAR = 12;

/**
 * Convierte una duración expresada en una unidad dada a años decimales.
 */
export function durationToYears(duration: number, unit: DurationUnit): number {
  switch (unit) {
    case "dias":
      return duration / DAYS_IN_YEAR;
    case "meses":
      return duration / MONTHS_IN_YEAR;
    case "anios":
      return duration;
    default:
      return 0;
  }
}

/**
 * Calcula el interés simple completo a partir de los datos de entrada.
 * Fórmula: Interés bruto = Capital × (TIN/100) × (tiempo en años)
 */
export function calculateSimpleInterest(
  input: SimpleInterestInput
): SimpleInterestResult {
  const { principal, annualRate, duration, durationUnit, taxRate } = input;

  const durationInYears = durationToYears(duration, durationUnit);

  const monthlyRate = annualRate / 12;
  const quarterlyRate = annualRate / 4;
  const semiannualRate = annualRate / 2;

  const grossInterest = principal * (annualRate / 100) * durationInYears;
  const taxWithheld = grossInterest * (taxRate / 100);
  const netInterest = grossInterest - taxWithheld;

  const finalCapitalGross = principal + grossInterest;
  const finalCapitalNet = principal + netInterest;

  const netYieldPercent =
    principal > 0 ? (netInterest / principal) * 100 : 0;

  const netYieldAnnualizedPercent =
    durationInYears > 0 ? netYieldPercent / durationInYears : 0;

  return {
    durationInYears,
    monthlyRate,
    quarterlyRate,
    semiannualRate,
    grossInterest,
    taxWithheld,
    netInterest,
    finalCapitalGross,
    finalCapitalNet,
    netYieldPercent,
    netYieldAnnualizedPercent,
  };
}

export function isValidSimpleInterestInput(
  input: Partial<SimpleInterestInput>
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

export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  dias: "días",
  meses: "meses",
  anios: "años",
};

export const DEFAULT_TAX_RATE = 19;

/** Escenario nombrado, usado en el modo comparativa */
export interface SimpleInterestScenario {
  id: string;
  name: string;
  input: SimpleInterestInput;
}

export function createDefaultScenario(
  name: string,
  overrides?: Partial<SimpleInterestInput>
): SimpleInterestScenario {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    name,
    input: {
      principal: 10000,
      annualRate: 3.5,
      duration: 12,
      durationUnit: "meses",
      taxRate: DEFAULT_TAX_RATE,
      ...overrides,
    },
  };
}
