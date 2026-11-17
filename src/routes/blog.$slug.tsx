import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { postQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Artigo · Dra. Helena Martins" },
      { name: "description", content: "Leia este artigo sobre saúde emocional no blog da Dra. Helena Martins." },
      { property: "og:title", content: "Artigo · Dra. Helena Martins" },
      { property: "og:description", content: "Reflexões sobre saúde emocional." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Post,
});

function Post() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery(postQuery(slug));
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/blog" className="text-sm font-semibold text-primary">← Voltar ao blog</Link>
        {isLoading && <p className="mt-8 text-muted-foreground">Carregando…</p>}
        {!isLoading && !data && <p className="mt-8">Artigo não encontrado.</p>}
        {data && (
          <>
            <p className="mt-8 text-sm text-muted-foreground">{data.published_at && new Date(data.published_at).toLocaleDateString("pt-BR", { dateStyle: "long" })}</p>
            <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{data.title}</h1>
            <p className="mt-4 text-xl text-muted-foreground">{data.excerpt}</p>
            {data.cover_url && <img src={data.cover_url} alt="" className="mt-8 w-full rounded-3xl object-cover" />}
            <div className="mt-10 space-y-5 text-lg leading-relaxed">
              {data.content.split(/\n+/).map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <div className="mt-14 rounded-3xl bg-secondary p-8 text-center">
              <p className="font-display text-2xl font-semibold">Quer conversar sobre isso?</p>
              <Button asChild className="mt-4 rounded-full"><Link to="/agendar">Agendar consulta</Link></Button>
            </div>
          </>
        )}
      </article>
    </SiteShell>
  );
}
