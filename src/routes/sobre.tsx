import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import hero from "@/assets/hero-psicologa.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · Dra. Helena Martins" },
      { name: "description", content: "Conheça a formação, a abordagem e a forma de trabalho da Dra. Helena Martins." },
      { property: "og:title", content: "Sobre · Dra. Helena Martins" },
      { property: "og:description", content: "Formação, abordagem e forma de trabalho." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteShell>
      <PageHero eyebrow="Sobre mim" title="Olá, eu sou a Helena." subtitle="Psicóloga clínica há mais de 12 anos, apaixonada por ajudar pessoas a viverem com mais leveza." />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_1.3fr]">
        <img src={hero} alt="Dra. Helena Martins" width={1024} height={1280} loading="lazy" className="rounded-[2rem] object-cover shadow-soft" />
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>Sou formada em Psicologia pela USP, com especialização em Terapia Cognitivo-Comportamental e formação em Mindfulness.</p>
          <p>Acredito que cada pessoa tem sua própria história e seus próprios recursos. Meu papel é oferecer um espaço de escuta e construir, junto com você, caminhos possíveis.</p>
          <p>Atendo adultos, casais e adolescentes, com foco em ansiedade, autoestima, relacionamentos e transições de vida.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[["12+", "anos de clínica"], ["800+", "pacientes"], ["4.9", "avaliação"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-secondary p-4 text-center">
                <p className="font-display text-3xl font-semibold text-primary">{n}</p>
                <p className="text-xs">{l}</p>
              </div>
            ))}
          </div>
          <Button asChild className="rounded-full"><Link to="/agendar">Agendar consulta</Link></Button>
        </div>
      </section>
    </SiteShell>
  );
}
