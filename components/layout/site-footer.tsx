import Link from "next/link";
import { AUTHOR } from "@/lib/site-config";

const FOOTER_LINKS = [
  { label: "Acerca de", href: "/acerca-de", external: false, rel: undefined },
  {
    label: "Contacto",
    href: AUTHOR.contactUrl,
    external: true,
    rel: "me",
  },
  { label: "Blog", href: AUTHOR.blogUrl, external: true, rel: "me" },
  {
    label: "Más apps",
    href: AUTHOR.hubUrl,
    external: true,
    rel: "me",
  },
];

export function SiteFooter() {
  return (
    <footer className="print:hidden">
      <div className="container flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <a
            href={AUTHOR.blogUrl}
            target="_blank"
            rel="me noopener noreferrer"
            className="font-medium transition-colors hover:text-foreground hover:underline underline-offset-4"
          >
            {AUTHOR.name}
          </a>{" "}
          © 2026 — Reservados todos los derechos
        </p>
        <nav aria-label="Enlaces del pie de página">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            {FOOTER_LINKS.map((link) =>
              link.external ? (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel={`${link.rel ?? ""} noopener noreferrer`.trim()}
                    className="transition-colors hover:text-foreground hover:underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
