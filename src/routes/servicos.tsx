import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { servicesQuery } from "@/lib/queries";
import { formatBRL } from "@/lib/site";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços e valores · Dra. Helena Martins" },
      { name: "description", content: "Psicoterapia individual, terapia de casal e atendimento a adolescentes. Veja valores e duração." },
      { property: "og:title", content: "Serviços e valores · Dra. Helena Martins" },
      { property: "og:description", content: "Conheça os atendimentos e valores." },
    ],
  }),
  component: Servicos,
});

function Servicos() {
  const { data, isLoading } = useQuery(servicesQuery);
  return (
    <SiteShell>
      <PageHero eyebrow="Serviços" title="Atendimentos pensados para cada momento" subtitle="Escolha o formato ideal e agende online em poucos minutos." />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2">
        {isLoading && <p className="text-muted-foreground">Carregando…</p>}
        {data?.map((s) => (
          <article key={s.id} className="flex flex-col rounded-3xl border border-border bg-card p-8 transition hover:shadow-soft">
            <h2 className="text-2xl font-semibold">{s.title}</h2>
            <p className="mt-3 flex-1 text-muted-foreground">{s.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{s.duration_minutes} min</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{s.modality}</span>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-display text-3xl font-semibold text-primary">{formatBRL(s.price)}</span>
              <Button asChild className="rounded-full"><Link to="/agendar" search={{ servico: s.id }}>Agendar</Link></Button>
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
