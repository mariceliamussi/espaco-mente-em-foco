import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, MessageCircleHeart, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { servicesQuery, postsQuery } from "@/lib/queries";
import { formatBRL, SITE } from "@/lib/site";
import hero from "@/assets/hero-psicologa.jpg";
import room from "@/assets/consultorio.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dra. Helena Martins · Psicóloga Clínica em São Paulo" },
      { name: "description", content: "Psicoterapia individual, de casal e para adolescentes. Atendimento online e presencial. Agende sua consulta." },
      { property: "og:title", content: "Dra. Helena Martins · Psicóloga Clínica" },
      { property: "og:description", content: "Um espaço seguro para cuidar da sua saúde emocional. Agende online." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: MessageCircleHeart, title: "Escuta acolhedora", text: "Sem julgamentos, no seu ritmo." },
  { icon: ShieldCheck, title: "Sigilo total", text: "Ética profissional e confidencialidade." },
  { icon: Video, title: "Online ou presencial", text: "Escolha o formato que combina com você." },
  { icon: Leaf, title: "Abordagem integrativa", text: "TCC e práticas de atenção plena." },
];

function Index() {
  const { data: services } = useQuery(servicesQuery);
  const { data: posts } = useQuery(postsQuery);
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-sky/50 blur-3xl animate-blob" />
        <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-peach/40 blur-3xl animate-blob" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-card/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">{SITE.role}</span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] md:text-6xl">
              Cuidar da mente é um <span className="text-gradient italic">ato de coragem</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Psicoterapia acolhedora para você reencontrar equilíbrio, leveza e sentido no dia a dia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 shadow-soft">
                <Link to="/agendar">Agendar consulta <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-card/60 px-7">
                <Link to="/sobre">Conheça meu trabalho</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-warm" />
            <img src={hero} alt="Dra. Helena Martins em seu consultório" width={1024} height={1280} className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><f.icon className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Serviços</p>
            <h2 className="mt-2 text-4xl font-semibold">Como posso te ajudar</h2>
          </div>
          <Link to="/servicos" className="hidden text-sm font-semibold text-primary md:block">Ver todos →</Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services?.map((s, i) => (
            <div key={s.id} className={`rounded-3xl p-8 ${i % 2 === 0 ? "bg-secondary" : "bg-accent"}`}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold">{s.title}</h3>
                <span className="whitespace-nowrap rounded-full bg-card px-3 py-1 text-sm font-semibold">{formatBRL(s.price)}</span>
              </div>
              <p className="mt-3 text-muted-foreground">{s.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.duration_minutes} min · {s.modality}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
        <img src={room} alt="Consultório acolhedor" width={1280} height={896} loading="lazy" className="rounded-[2rem] object-cover shadow-soft" />
        <div>
          <h2 className="text-4xl font-semibold">Um lugar pensado para você se sentir em casa</h2>
          <p className="mt-4 text-muted-foreground">O consultório foi preparado para ser um ambiente calmo e seguro. Para quem prefere, as sessões online têm o mesmo cuidado e sigilo.</p>
          <Button asChild variant="outline" className="mt-6 rounded-full"><Link to="/contato">Fale comigo</Link></Button>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-4xl font-semibold">Do blog</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts?.slice(0, 3).map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group rounded-3xl border border-border bg-card p-6 transition hover:shadow-soft">
              <p className="text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("pt-BR")}</p>
              <h3 className="mt-2 text-xl font-semibold group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="rounded-[2.5rem] bg-warm px-8 py-14 text-center">
          <h2 className="text-4xl font-semibold text-peach-foreground">Pronto para dar o primeiro passo?</h2>
          <p className="mx-auto mt-3 max-w-xl text-peach-foreground/80">A primeira conversa é gratuita e sem compromisso.</p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-full px-8"><Link to="/agendar">Agendar agora</Link></Button>
        </div>
      </section>
    </SiteShell>
  );
}
