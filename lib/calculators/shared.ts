/**
 * Utilidades compartidas por todas las calculadoras financieras del sitio
 * (interés simple, interés compuesto, y las que se añadan en el futuro).
 */

export type DurationUnit = "dias" | "meses" | "anios";

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

export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  dias: "días",
  meses: "meses",
  anios: "años",
};

export const DEFAULT_TAX_RATE = 19;

export function generateScenarioId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/** Nº de veces que se capitaliza/liquida el interés cada año */
export type CompoundingFrequency =
  | "anual"
  | "semestral"
  | "trimestral"
  | "mensual"
  | "diaria";

export const COMPOUNDING_FREQUENCY_TIMES: Record<CompoundingFrequency, number> = {
  anual: 1,
  semestral: 2,
  trimestral: 4,
  mensual: 12,
  diaria: 365,
};

export const COMPOUNDING_FREQUENCY_LABELS: Record<CompoundingFrequency, string> = {
  anual: "Anual",
  semestral: "Semestral",
  trimestral: "Trimestral",
  mensual: "Mensual",
  diaria: "Diaria",
};

export const COMPOUNDING_FREQUENCIES: CompoundingFrequency[] = [
  "anual",
  "semestral",
  "trimestral",
  "mensual",
  "diaria",
];
