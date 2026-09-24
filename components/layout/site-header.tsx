"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiggyBank } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const MODULE_LINKS = [
  { href: "/depositos", label: "Depósitos" },
  { href: "/interes-compuesto", label: "Interés compuesto" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border/70 print:hidden">
      <div className="container flex flex-col gap-2 py-2.5 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <div className="flex items-center justify-between sm:contents">
          <Link href="/depositos" className="flex shrink-0 items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PiggyBank className="h-3.5 w-3.5" />
            </div>
            <span className="hidden font-display text-[15px] font-medium leading-none sm:inline">
              Calculadora de Intereses
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:order-3 sm:shrink-0">
            <Link
              href="/acerca-de"
              className={cn(
                "text-[13px] font-medium transition-colors",
                pathname === "/acerca-de"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Acerca de
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex min-w-0 items-center gap-1 sm:order-2">
          {MODULE_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
