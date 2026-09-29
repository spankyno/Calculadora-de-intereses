/**
 * Motor de cálculo del conversor TIN ↔ TAE (módulo "TAE / TIN").
 * Lógica pura, sin dependencias de React.
 *
 * TAE = (1 + TIN / (100 × n)) ^ n − 1          (dado un TIN nominal, hallar su TAE)
 * TIN = n × [ (1 + TAE/100) ^ (1/n) − 1 ] × 100 (dado un TAE, hallar el TIN nominal)
 *
 * donde n es el número de liquidaciones (capitalizaciones) por año.
 */
import {
  COMPOUNDING_FREQUENCY_TIMES,
  COMPOUNDING_FREQUENCY_LABELS,
  COMPOUNDING_FREQUENCIES,
  type CompoundingFrequency,
} from "./shared";

export type { CompoundingFrequency } from "./shared";
export {
  COMPOUNDING_FREQUENCY_TIMES,
  COMPOUNDING_FREQUENCY_LABELS,
  COMPOUNDING_FREQUENCIES,
} from "./shared";

export type ConversionMode = "tin-to-tae" | "tae-to-tin";

/** Dado un TIN nominal anual (%) y una frecuencia de liquidación, calcula la TAE (%) */
export function tinToTae(
  tinPercent: number,
  frequency: CompoundingFrequency
): number {
  const n = COMPOUNDING_FREQUENCY_TIMES[frequency];
  const ratePerPeriod = tinPercent / 100 / n;
  return (Math.pow(1 + ratePerPeriod, n) - 1) * 100;
}

/** Dada una TAE (%) y una frecuencia de liquidación, calcula el TIN nominal anual (%) equivalente */
export function taeToTin(
  taePercent: number,
  frequency: CompoundingFrequency
): number {
  const n = COMPOUNDING_FREQUENCY_TIMES[frequency];
  const ratePerPeriod = Math.pow(1 + taePercent / 100, 1 / n) - 1;
  return ratePerPeriod * n * 100;
}

export interface ConverterInput {
  mode: ConversionMode;
  /** Valor introducido por el usuario (TIN si mode=tin-to-tae, TAE si mode=tae-to-tin), en % */
  value: number;
  /** Frecuencia de liquidación de referencia para el resultado principal */
  frequency: CompoundingFrequency;
}

export interface FrequencyEquivalent {
  frequency: CompoundingFrequency;
  /** El valor convertido a esa frecuencia (TAE si mode=tin-to-tae, TIN si mode=tae-to-tin) */
  value: number;
}

export interface ConverterResult {
  /** Resultado principal, en la frecuencia seleccionada */
  primaryResult: number;
  /** El mismo valor de entrada, convertido a todas las frecuencias, para comparar */
  equivalents: FrequencyEquivalent[];
}

export function calculateConversion(input: ConverterInput): ConverterResult {
  const { mode, value, frequency } = input;
  const convert = mode === "tin-to-tae" ? tinToTae : taeToTin;

  const primaryResult = convert(value, frequency);
  const equivalents = COMPOUNDING_FREQUENCIES.map((freq) => ({
    frequency: freq,
    value: convert(value, freq),
  }));

  return { primaryResult, equivalents };
}

export function isValidConverterInput(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}
