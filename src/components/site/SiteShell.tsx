import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Heart, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/servicos", label: "Serviços" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-warm text-primary-foreground">
              <Heart className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">{SITE.name}</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="rounded-full px-5">
              <Link to="/agendar">Agendar consulta</Link>
            </Button>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-3 border-t border-border px-5 py-4 md:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-medium">
                {n.label}
              </Link>
            ))}
            <Button asChild className="rounded-full">
              <Link to="/agendar" onClick={() => setOpen(false)}>Agendar consulta</Link>
            </Button>
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-24 bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold">{SITE.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{SITE.role}</p>
            <p className="mt-4 text-sm text-muted-foreground">Um espaço seguro e acolhedor para cuidar da sua saúde emocional.</p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{SITE.phone}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{SITE.email}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{SITE.address}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm md:items-end">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-primary">{n.label}</Link>
            ))}
            <Link to="/auth" className="text-muted-foreground hover:text-primary">Área do administrador</Link>
          </div>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-peach/40 blur-3xl animate-blob" />
      <div className="relative mx-auto max-w-6xl px-5 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
