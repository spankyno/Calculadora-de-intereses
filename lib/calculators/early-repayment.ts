/**
 * Motor de cálculo del módulo dedicado "Amortización anticipada".
 * Aplica a cualquier préstamo con amortización francesa (personal o
 * hipotecario): dado un préstamo y una aportación extra en un mes
 * concreto, compara las dos estrategias clásicas —reducir cuota o
 * reducir plazo— y cuánto se ahorra en intereses con cada una.
 * Lógica pura, sin dependencias de React.
 */
import { generateScenarioId } from "./shared";
import {
  calculateMonthlyPayment,
  calculateMonthsToPayOff,
  buildAmortizationSchedule,
  type LoanAmortizationRow,
} from "./loan-math";

export type LoanDurationUnit = "meses" | "anios";

export const LOAN_DURATION_UNIT_LABELS: Record<LoanDurationUnit, string> = {
  meses: "meses",
  anios: "años",
};

export interface BaseLoanInput {
  principal: number;
  annualRate: number;
  duration: number;
  durationUnit: LoanDurationUnit;
}

export interface BaseLoanResult {
  totalMonths: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: LoanAmortizationRow[];
}

function durationToMonths(duration: number, unit: LoanDurationUnit): number {
  return unit === "anios" ? duration * 12 : duration;
}

export function calculateBaseLoan(input: BaseLoanInput): BaseLoanResult {
  const totalMonths = Math.round(
    durationToMonths(input.duration, input.durationUnit)
  );
  const monthlyRate = input.annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(
    input.principal,
    monthlyRate,
    totalMonths
  );
  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - input.principal;
  const schedule = buildAmortizationSchedule(
    input.principal,
    monthlyRate,
    monthlyPayment,
    totalMonths
  );
  return { totalMonths, monthlyRate, monthlyPayment, totalPaid, totalInterest, schedule };
}

export function isValidBaseLoanInput(input: Partial<BaseLoanInput>): boolean {
  return (
    typeof input.principal === "number" &&
    input.principal > 0 &&
    typeof input.annualRate === "number" &&
    input.annualRate >= 0 &&
    typeof input.duration === "number" &&
    input.duration > 0
  );
}

export function createDefaultBaseLoanInput(): BaseLoanInput {
  return {
    principal: 150000,
    annualRate: 3.2,
    duration: 25,
    durationUnit: "anios",
  };
}

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
  amount: number;
  /** Mes del préstamo en el que se realiza la aportación (1-indexado) */
  atMonth: number;
}

export interface StrategyOutcome {
  strategy: EarlyRepaymentStrategy;
  fullyPaidOff: boolean;
  newMonthlyPayment: number;
  newTotalMonths: number;
  monthsSaved: number;
  totalInterest: number;
  totalPaid: number;
  interestSaved: number;
  /** Cuadro de amortización completo resultante, con esta estrategia aplicada */
  schedule: LoanAmortizationRow[];
}

function buildStrategyOutcome(
  base: BaseLoanResult,
  early: EarlyRepaymentInput,
  strategy: EarlyRepaymentStrategy
): StrategyOutcome {
  const { monthlyRate, monthlyPayment, totalMonths, schedule, totalInterest } =
    base;
  const atMonth = Math.min(Math.max(Math.round(early.atMonth), 1), totalMonths);
  const amount = Math.max(early.amount, 0);

  const rowBefore = schedule[atMonth - 1];
  const balanceBeforeExtra = rowBefore ? rowBefore.remainingBalance : 0;
  const balanceAfterExtra = Math.max(balanceBeforeExtra - amount, 0);

  const rowsBeforeExtra = schedule.slice(0, atMonth);
  const interestPaidSoFar = rowsBeforeExtra.reduce(
    (sum, row) => sum + row.interestPayment,
    0
  );

  if (balanceAfterExtra <= 0) {
    // La aportación cancela el préstamo por completo en este mismo mes:
    // lo pagado es la suma de las cuotas anteriores más la aportación final.
    const totalPaid =
      rowsBeforeExtra.reduce((sum, row) => sum + row.payment, 0) +
      Math.min(amount, balanceBeforeExtra);

    return {
      strategy,
      fullyPaidOff: true,
      newMonthlyPayment: 0,
      newTotalMonths: atMonth,
      monthsSaved: totalMonths - atMonth,
      totalInterest: interestPaidSoFar,
      totalPaid,
      interestSaved: totalInterest - interestPaidSoFar,
      schedule: rowsBeforeExtra,
    };
  }

  const remainingMonthsOriginal = totalMonths - atMonth;

  if (strategy === "reducir_plazo") {
    const newRemainingMonths = Math.min(
      calculateMonthsToPayOff(balanceAfterExtra, monthlyRate, monthlyPayment),
      remainingMonthsOriginal
    );
    const continuation = buildAmortizationSchedule(
      balanceAfterExtra,
      monthlyRate,
      monthlyPayment,
      newRemainingMonths
    ).map((row) => ({ ...row, month: row.month + atMonth }));

    const interestFromContinuation = continuation.reduce(
      (sum, row) => sum + row.interestPayment,
      0
    );
    const newTotalInterest = interestPaidSoFar + interestFromContinuation;
    const newTotalMonths = atMonth + continuation.length;
    const mergedSchedule = [...rowsBeforeExtra, ...continuation];

    return {
      strategy,
      fullyPaidOff: false,
      newMonthlyPayment: monthlyPayment,
      newTotalMonths,
      monthsSaved: totalMonths - newTotalMonths,
      totalInterest: newTotalInterest,
      totalPaid: mergedSchedule.reduce((s, r) => s + r.payment, 0) + amount,
      interestSaved: totalInterest - newTotalInterest,
      schedule: mergedSchedule,
    };
  }

  // reducir_cuota
  const newMonthlyPayment = calculateMonthlyPayment(
    balanceAfterExtra,
    monthlyRate,
    remainingMonthsOriginal
  );
  const continuation = buildAmortizationSchedule(
    balanceAfterExtra,
    monthlyRate,
    newMonthlyPayment,
    remainingMonthsOriginal
  ).map((row) => ({ ...row, month: row.month + atMonth }));

  const interestFromContinuation = continuation.reduce(
    (sum, row) => sum + row.interestPayment,
    0
  );
  const newTotalInterest = interestPaidSoFar + interestFromContinuation;
  const mergedSchedule = [...rowsBeforeExtra, ...continuation];

  return {
    strategy,
    fullyPaidOff: false,
    newMonthlyPayment,
    newTotalMonths: totalMonths,
    monthsSaved: 0,
    totalInterest: newTotalInterest,
    totalPaid: mergedSchedule.reduce((s, r) => s + r.payment, 0) + amount,
    interestSaved: totalInterest - newTotalInterest,
    schedule: mergedSchedule,
  };
}

export interface EarlyRepaymentComparison {
  atMonth: number;
  amount: number;
  withoutExtra: {
    totalInterest: number;
    totalPaid: number;
    monthlyPayment: number;
    totalMonths: number;
  };
  reducirCuota: StrategyOutcome;
  reducirPlazo: StrategyOutcome;
}

export function compareEarlyRepaymentStrategies(
  base: BaseLoanResult,
  early: EarlyRepaymentInput
): EarlyRepaymentComparison {
  return {
    atMonth: Math.min(Math.max(Math.round(early.atMonth), 1), base.totalMonths),
    amount: Math.max(early.amount, 0),
    withoutExtra: {
      totalInterest: base.totalInterest,
      totalPaid: base.totalPaid,
      monthlyPayment: base.monthlyPayment,
      totalMonths: base.totalMonths,
    },
    reducirCuota: buildStrategyOutcome(base, early, "reducir_cuota"),
    reducirPlazo: buildStrategyOutcome(base, early, "reducir_plazo"),
  };
}

export function createDefaultEarlyRepaymentInput(
  totalMonths: number
): EarlyRepaymentInput {
  return {
    amount: 10000,
    atMonth: Math.max(1, Math.min(24, totalMonths)),
  };
}

export { generateScenarioId };
