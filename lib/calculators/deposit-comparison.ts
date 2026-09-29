/**
 * Motor de cálculo de la Comparativa avanzada de depósitos.
 * Permite comparar productos con distinto plazo, TIN, comisiones, retención
 * y tipo de capitalización (simple o compuesta). Lógica pura, sin React.
 */
import {
  durationToYears,
  DURATION_UNIT_LABELS,
  DEFAULT_TAX_RATE,
  generateScenarioId,
  COMPOUNDING_FREQUENCY_TIMES,
  COMPOUNDING_FREQUENCY_LABELS,
  COMPOUNDING_FREQUENCIES,
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
  COMPOUNDING_FREQUENCIES,
} from "./shared";

export type CapitalizationType = "simple" | "compuesta";

export const CAPITALIZATION_TYPE_LABELS: Record<CapitalizationType, string> = {
  simple: "Simple",
  compuesta: "Compuesta",
};

export interface DepositProduct {
  id: string;
  name: string;
  /** Capital a invertir en este producto */
  principal: number;
  /** TIN anual en % */
  annualRate: number;
  duration: number;
  durationUnit: DurationUnit;
  capitalizationType: CapitalizationType;
  /** Solo se usa si capitalizationType === "compuesta" */
  compoundingFrequency: CompoundingFrequency;
  /** Comisión de apertura, importe fijo en € */
  openingFee: number;
  /** Comisión de mantenimiento, en €/año (se prorratea según la duración) */
  maintenanceFeeAnnual: number;
  /** Retención de impuestos en % */
  taxRate: number;
}

export interface DepositProductResult {
  durationInYears: number;
  grossInterest: number;
  taxWithheld: number;
  netInterest: number;
  totalFees: number;
  /** Capital final antes de retención, después de comisiones */
  finalCapitalGross: number;
  /** Capital final después de retención y comisiones — la cifra real */
  finalCapitalNet: number;
  /** Rentabilidad neta total en %, ya con comisiones descontadas */
  netYieldPercent: number;
  /** Rentabilidad neta anualizada en % */
  netYieldAnnualizedPercent: number;
}

export function calculateDepositProduct(
  product: DepositProduct
): DepositProductResult {
  const {
    principal,
    annualRate,
    duration,
    durationUnit,
    capitalizationType,
    compoundingFrequency,
    openingFee,
    maintenanceFeeAnnual,
    taxRate,
  } = product;

  const durationInYears = durationToYears(duration, durationUnit);

  let grossInterest: number;
  if (capitalizationType === "compuesta") {
    const n = COMPOUNDING_FREQUENCY_TIMES[compoundingFrequency];
    const ratePerPeriod = annualRate / 100 / n;
    const finalBeforeFees =
      principal * Math.pow(1 + ratePerPeriod, n * durationInYears);
    grossInterest = finalBeforeFees - principal;
  } else {
    grossInterest = principal * (annualRate / 100) * durationInYears;
  }

  const taxWithheld = grossInterest * (taxRate / 100);
  const netInterest = grossInterest - taxWithheld;
  const totalFees = openingFee + maintenanceFeeAnnual * durationInYears;

  const finalCapitalGross = principal + grossInterest - totalFees;
  const finalCapitalNet = principal + netInterest - totalFees;

  const netYieldPercent =
    principal > 0 ? ((finalCapitalNet - principal) / principal) * 100 : 0;
  const netYieldAnnualizedPercent =
    durationInYears > 0 ? netYieldPercent / durationInYears : 0;

  return {
    durationInYears,
    grossInterest,
    taxWithheld,
    netInterest,
    totalFees,
    finalCapitalGross,
    finalCapitalNet,
    netYieldPercent,
    netYieldAnnualizedPercent,
  };
}

export function isValidDepositProduct(
  product: Partial<DepositProduct>
): boolean {
  return (
    typeof product.principal === "number" &&
    product.principal > 0 &&
    typeof product.annualRate === "number" &&
    product.annualRate >= 0 &&
    typeof product.duration === "number" &&
    product.duration > 0 &&
    typeof product.taxRate === "number" &&
    product.taxRate >= 0 &&
    product.taxRate <= 100
  );
}

export function createDefaultProduct(
  name: string,
  overrides?: Partial<DepositProduct>
): DepositProduct {
  return {
    id: generateScenarioId(),
    name,
    principal: 10000,
    annualRate: 3.5,
    duration: 12,
    durationUnit: "meses",
    capitalizationType: "simple",
    compoundingFrequency: "mensual",
    openingFee: 0,
    maintenanceFeeAnnual: 0,
    taxRate: DEFAULT_TAX_RATE,
    ...overrides,
  };
}

export const MAX_PRODUCTS = 6;
export const MIN_PRODUCTS = 1;
