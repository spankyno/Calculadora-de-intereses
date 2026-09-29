"use client";

import { cn } from "@/lib/utils";

export interface DetailRow {
  label: string;
  value: string;
  emphasis?: boolean;
  muted?: boolean;
}

interface DetailTableProps {
  rows: DetailRow[];
  className?: string;
}

/**
 * Tabla simple de pares etiqueta/valor, usada en las secciones "Mostrar más"
 * de cada calculadora para exponer el desglose completo del cálculo.
 */
export function DetailTable({ rows, className }: DetailTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between gap-4 px-4 py-2.5 text-sm",
            i !== rows.length - 1 && "border-b border-border/70",
            row.emphasis && "bg-muted/40"
          )}
        >
          <span
            className={cn(
              "text-muted-foreground",
              row.emphasis && "font-medium text-foreground"
            )}
          >
            {row.label}
          </span>
          <span
            className={cn(
              "num-tabular font-medium",
              row.emphasis && "font-semibold",
              row.muted && "text-muted-foreground"
            )}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
