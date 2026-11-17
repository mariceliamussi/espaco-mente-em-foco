import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel · Administrador" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function Admin() {
  const { data: appts } = useQuery({
    queryKey: ["admin", "appointments"],
    queryFn: async () => (await supabase.from("appointments").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: msgs } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Painel</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/">Ver site</Link></Button>
          <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }}>Sair</Button>
        </div>
      </div>
      <h2 className="mt-10 text-xl font-semibold">Agendamentos</h2>
      <div className="mt-3 space-y-2">
        {appts?.length === 0 && <p className="text-muted-foreground">Nenhum pedido ainda.</p>}
        {appts?.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-semibold">{a.name} · {a.preferred_date} {a.preferred_time} · {a.modality}</p>
            <p className="text-sm text-muted-foreground">{a.email} {a.phone} · {a.status}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-semibold">Mensagens</h2>
      <div className="mt-3 space-y-2">
        {msgs?.length === 0 && <p className="text-muted-foreground">Nenhuma mensagem.</p>}
        {msgs?.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-semibold">{m.name} · {m.email}</p>
            <p className="text-sm">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
