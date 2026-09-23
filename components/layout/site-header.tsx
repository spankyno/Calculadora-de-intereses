import Link from "next/link";
import { PiggyBank } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 print:hidden">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PiggyBank className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-[15px] font-medium leading-none">
            Calculadora de Intereses
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/acerca-de"
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Acerca de
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
