/**
 * Motor de cálculo de la Hipoteca (sistema francés), con tipo fijo o
 * variable (Euríbor + diferencial) y simulador de amortización anticipada.
 * Lógica pura, sin dependencias de React.
 */
import { generateScenarioId } from "./shared";
import {
  calculateMonthlyPayment,
  calculateMonthsToPayOff,
  solveEffectiveMonthlyRate,
  buildAmortizationSchedule,
  type LoanAmortizationRow,
} from "./loan-math";

export type MortgageDurationUnit = "meses" | "anios";

export const MORTGAGE_DURATION_UNIT_LABELS: Record<MortgageDurationUnit, string> = {
  meses: "meses",
  anios: "años",
};

export type MortgageRateType = "fijo" | "variable";

export const MORTGAGE_RATE_TYPE_LABELS: Record<MortgageRateType, string> = {
  fijo: "Fijo",
  variable: "Variable (Euríbor + diferencial)",
};

export interface MortgageInput {
  /** Capital del préstamo hipotecario en euros */
  principal: number;
  rateType: MortgageRateType;
  /** TIN anual, usado si rateType === "fijo" */
  fixedRate: number;
  /** Euríbor actual en %, usado si rateType === "variable" */
  euriborRate: number;
  /** Diferencial sobre el Euríbor en %, usado si rateType === "variable" */
  spread: number;
  duration: number;
  durationUnit: MortgageDurationUnit;
  /** Comisión de apertura, en % sobre el capital financiado */
  openingFeePercent: number;
}

export type AmortizationRow = LoanAmortizationRow;

export interface MortgageResult {
  /** TIN anual efectivo usado en el cálculo (fijo, o euríbor + diferencial) */
  annualRate: number;
  totalMonths: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  openingFeeAmount: number;
  netAmountReceived: number;
  effectiveAnnualRate: number;
  schedule: AmortizationRow[];
}

function durationToMonths(duration: number, unit: MortgageDurationUnit): number {
  return unit === "anios" ? duration * 12 : duration;
}

export function getMortgageAnnualRate(input: MortgageInput): number {
  return input.rateType === "fijo"
    ? input.fixedRate
    : input.euriborRate + input.spread;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { principal, duration, durationUnit, openingFeePercent } = input;

  const annualRate = getMortgageAnnualRate(input);
  const totalMonths = Math.round(durationToMonths(duration, durationUnit));
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment = calculateMonthlyPayment(
    principal,
    monthlyRate,
    totalMonths
  );
  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - principal;

  const openingFeeAmount = principal * (openingFeePercent / 100);
  const netAmountReceived = principal - openingFeeAmount;

  const effectiveMonthlyRate = solveEffectiveMonthlyRate(
    monthlyPayment,
    netAmountReceived,
    totalMonths
  );
  const effectiveAnnualRate = (Math.pow(1 + effectiveMonthlyRate, 12) - 1) * 100;

  const schedule = buildAmortizationSchedule(
    principal,
    monthlyRate,
    monthlyPayment,
    totalMonths
  );

  return {
    annualRate,
    totalMonths,
    monthlyRate,
    monthlyPayment,
    totalPaid,
    totalInterest,
    openingFeeAmount,
    netAmountReceived,
    effectiveAnnualRate,
    schedule,
  };
}

export function isValidMortgageInput(input: Partial<MortgageInput>): boolean {
  const rateOk =
    input.rateType === "fijo"
      ? typeof input.fixedRate === "number" && input.fixedRate >= 0
      : typeof input.euriborRate === "number" &&
        typeof input.spread === "number" &&
        input.euriborRate + input.spread >= 0;

  return (
    typeof input.principal === "number" &&
    input.principal > 0 &&
    typeof input.duration === "number" &&
    input.duration > 0 &&
    typeof input.openingFeePercent === "number" &&
    input.openingFeePercent >= 0 &&
    input.openingFeePercent < 100 &&
    rateOk
  );
}

export function createDefaultMortgageInput(): MortgageInput {
  return {
    principal: 180000,
    rateType: "fijo",
    fixedRate: 3.2,
    euriborRate: 3.0,
    spread: 0.8,
    duration: 25,
    durationUnit: "anios",
    openingFeePercent: 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Simulador de amortización anticipada                              */
/* ------------------------------------------------------------------ */

export type EarlyRepaymentStrategy = "reducir_cuota" | "reducir_plazo";

export const EARLY_REPAYMENT_STRATEGY_LABELS: Record<
  EarlyRepaymentStrategy,
  string
> = {
  reducir_cuota: "Reducir cuota",
  reducir_plazo: "Reducir plazo",
};

export interface EarlyRepaymentInput {
  /** Aportación extra, en euros */
  amount: number;
  /** Mes del préstamo en el que se realiza la aportación (1-indexado) */
  atMonth: number;
  strategy: EarlyRepaymentStrategy;
}

export interface EarlyRepaymentResult {
  /** Si la aportación cancela el préstamo por completo */
  fullyPaidOff: boolean;
  /** Saldo pendiente justo antes de aplicar la aportación */
  balanceBeforeExtra: number;
  /** Saldo pendiente justo después de aplicar la aportación */
  balanceAfterExtra: number;
  /** Nueva cuota mensual (solo cambia si strategy === "reducir_cuota") */
  newMonthlyPayment: number;
  /** Nuevo plazo total en meses desde el origen del préstamo */
  newTotalMonths: number;
  /** Meses que se acortan respecto al plazo original */
  monthsSaved: number;
  /** Intereses totales del préstamo original */
  originalTotalInterest: number;
  /** Intereses totales del préstamo con la amortización anticipada aplicada */
  newTotalInterest: number;
  /** Ahorro total en intereses gracias a la aportación */
  interestSaved: number;
}

/**
 * Simula el efecto de una aportación extra en el mes `atMonth`, comparando
 * las dos estrategias clásicas: reducir la cuota (manteniendo el plazo) o
 * reducir el plazo (manteniendo la cuota).
 */
export function calculateEarlyRepayment(
  loan: MortgageInput,
  result: MortgageResult,
  early: EarlyRepaymentInput
): EarlyRepaymentResult {
  const { monthlyRate, monthlyPayment, totalMonths, schedule } = result;
  const atMonth = Math.min(Math.max(Math.round(early.atMonth), 1), totalMonths);
  const amount = Math.max(early.amount, 0);

  const rowBefore = schedule[atMonth - 1];
  const balanceBeforeExtra = rowBefore
    ? rowBefore.remainingBalance
    : result.totalMonths > 0
      ? loan.principal
      : 0;

  const balanceAfterExtra = Math.max(balanceBeforeExtra - amount, 0);

  // Intereses ya pagados hasta (e incluyendo) el mes de la aportación
  const interestPaidSoFar = schedule
    .slice(0, atMonth)
    .reduce((sum, row) => sum + row.interestPayment, 0);

  if (balanceAfterExtra <= 0) {
    // La aportación cancela el préstamo por completo en ese mismo mes
    const newTotalInterest = interestPaidSoFar;
    return {
      fullyPaidOff: true,
      balanceBeforeExtra,
      balanceAfterExtra: 0,
      newMonthlyPayment: 0,
      newTotalMonths: atMonth,
      monthsSaved: totalMonths - atMonth,
      originalTotalInterest: result.totalInterest,
      newTotalInterest,
      interestSaved: result.totalInterest - newTotalInterest,
    };
  }

  const remainingMonthsOriginal = totalMonths - atMonth;

  if (early.strategy === "reducir_plazo") {
    const newRemainingMonths = Math.min(
      calculateMonthsToPayOff(balanceAfterExtra, monthlyRate, monthlyPayment),
      remainingMonthsOriginal
    );
    const continuationSchedule = buildAmortizationSchedule(
      balanceAfterExtra,
      monthlyRate,
      monthlyPayment,
      newRemainingMonths
    );
    const interestFromContinuation = continuationSchedule.reduce(
      (sum, row) => sum + row.interestPayment,
      0
    );
    const newTotalInterest = interestPaidSoFar + interestFromContinuation;
    const newTotalMonths = atMonth + Math.round(newRemainingMonths);

    return {
      fullyPaidOff: false,
      balanceBeforeExtra,
      balanceAfterExtra,
      newMonthlyPayment: monthlyPayment,
      newTotalMonths,
      monthsSaved: totalMonths - newTotalMonths,
      originalTotalInterest: result.totalInterest,
      newTotalInterest,
      interestSaved: result.totalInterest - newTotalInterest,
    };
  }

  // reducir_cuota: mismo plazo restante, cuota recalculada y más baja
  const newMonthlyPayment = calculateMonthlyPayment(
    balanceAfterExtra,
    monthlyRate,
    remainingMonthsOriginal
  );
  const continuationSchedule = buildAmortizationSchedule(
    balanceAfterExtra,
    monthlyRate,
    newMonthlyPayment,
    remainingMonthsOriginal
  );
  const interestFromContinuation = continuationSchedule.reduce(
    (sum, row) => sum + row.interestPayment,
    0
  );
  const newTotalInterest = interestPaidSoFar + interestFromContinuation;

  return {
    fullyPaidOff: false,
    balanceBeforeExtra,
    balanceAfterExtra,
    newMonthlyPayment,
    newTotalMonths: totalMonths,
    monthsSaved: 0,
    originalTotalInterest: result.totalInterest,
    newTotalInterest,
    interestSaved: result.totalInterest - newTotalInterest,
  };
}

export function createDefaultEarlyRepaymentInput(
  totalMonths: number
): EarlyRepaymentInput {
  return {
    amount: 5000,
    atMonth: Math.max(1, Math.min(12, totalMonths)),
    strategy: "reducir_plazo",
  };
}

export { generateScenarioId };
