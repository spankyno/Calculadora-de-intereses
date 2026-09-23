"use client";

import { cn } from "@/lib/utils";

export interface StackedBarSegment {
  id: string;
  label: string;
  value: number;
  colorClass: string;
  /** Clase de color para el punto de la leyenda; por defecto usa colorClass */
  dotClass?: string;
}

interface StackedBarProps {
  segments: StackedBarSegment[];
  /** Total sobre el que calcular los porcentajes. Por defecto, la suma de los segmentos. */
  total?: number;
  formatValue: (value: number) => string;
  height?: "sm" | "md";
  className?: string;
}

/**
 * Barra horizontal apilada, con transición suave cuando cambian los valores
 * (cálculo en tiempo real) y una leyenda con el detalle de cada segmento.
 */
export function StackedBar({
  segments,
  total,
  formatValue,
  height = "md",
  className,
}: StackedBarProps) {
  const computedTotal =
    total ?? segments.reduce((sum, s) => sum + Math.max(s.value, 0), 0);
  const hasData = computedTotal > 0;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div
        className={cn(
          "flex w-full overflow-hidden rounded-full bg-muted",
          height === "sm" ? "h-2.5" : "h-3.5"
        )}
        role="img"
        aria-label={segments
          .map((s) => `${s.label}: ${formatValue(s.value)}`)
          .join(", ")}
      >
        {hasData ? (
          segments.map((s) => {
            const pct = Math.max((s.value / computedTotal) * 100, 0);
            return (
              <div
                key={s.id}
                className={cn(
                  "h-full transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full",
                  s.colorClass
                )}
                style={{ width: `${pct}%` }}
              />
            );
          })
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {segments.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                s.dotClass ?? s.colorClass
              )}
            />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="num-tabular font-semibold text-foreground">
              {formatValue(s.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
