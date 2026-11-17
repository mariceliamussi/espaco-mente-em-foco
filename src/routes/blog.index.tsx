import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { postsQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · Dra. Helena Martins" },
      { name: "description", content: "Artigos sobre ansiedade, autocuidado, relacionamentos e saúde emocional." },
      { property: "og:title", content: "Blog · Dra. Helena Martins" },
      { property: "og:description", content: "Reflexões sobre saúde emocional." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { data, isLoading } = useQuery(postsQuery);
  return (
    <SiteShell>
      <PageHero eyebrow="Blog" title="Reflexões para o seu bem-estar" />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Carregando…</p>}
        {data?.length === 0 && <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>}
        {data?.map((p, i) => (
          <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-soft">
            {p.cover_url ? (
              <img src={p.cover_url} alt="" loading="lazy" className="h-44 w-full object-cover" />
            ) : (
              <div className={`h-44 ${i % 2 ? "bg-accent" : "bg-secondary"}`} />
            )}
            <div className="p-6">
              <p className="text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString("pt-BR")}</p>
              <h2 className="mt-2 text-xl font-semibold group-hover:text-primary">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
