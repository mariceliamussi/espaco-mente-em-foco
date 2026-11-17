import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery } from "@/lib/queries";
import { TIMES } from "@/lib/site";

export const Route = createFileRoute("/agendar")({
  validateSearch: (s: Record<string, unknown>): { servico?: string } =>
    typeof s["servico"] === "string" ? { servico: s["servico"] as string } : {},
  head: () => ({
    meta: [
      { title: "Agendar consulta · Dra. Helena Martins" },
      { name: "description", content: "Agende sua consulta de psicoterapia online ou presencial em poucos passos." },
      { property: "og:title", content: "Agendar consulta · Dra. Helena Martins" },
      { property: "og:description", content: "Escolha o serviço, a data e o horário." },
    ],
  }),
  component: Agendar,
});

const selectCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

function Agendar() {
  const { servico } = Route.useSearch();
  const { data: services } = useQuery(servicesQuery);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!time) { toast.error("Escolha um horário."); return; }
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      name: String(f.get("name")).trim(),
      email: String(f.get("email")).trim(),
      phone: String(f.get("phone") ?? "").trim(),
      service_id: (f.get("service_id") as string) || null,
      preferred_date: String(f.get("date")),
      preferred_time: time,
      modality: String(f.get("modality")),
      message: String(f.get("message") ?? "").slice(0, 2000),
    });
    setLoading(false);
    if (error) { toast.error("Não foi possível enviar. Tente novamente."); return; }
    setDone(true);
  }

  return (
    <SiteShell>
      <PageHero eyebrow="Agendamento" title="Vamos marcar sua consulta" subtitle="Preencha o formulário e eu confirmo o horário com você em até 24h." />
      <section className="mx-auto max-w-3xl px-5 py-16">
        {done ? (
          <div className="rounded-3xl bg-secondary p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-semibold">Pedido recebido!</h2>
            <p className="mt-2 text-muted-foreground">Em breve entrarei em contato para confirmar.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Nome completo</Label><Input id="name" name="name" required maxLength={200} /></div>
            <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" required maxLength={255} /></div>
            <div className="space-y-2"><Label htmlFor="phone">Telefone / WhatsApp</Label><Input id="phone" name="phone" maxLength={30} /></div>
            <div className="space-y-2">
              <Label htmlFor="service_id">Serviço</Label>
              <select id="service_id" name="service_id" defaultValue={servico ?? ""} className={selectCls}>
                <option value="">Selecione…</option>
                {services?.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label htmlFor="date">Data preferida</Label><Input id="date" name="date" type="date" min={today} required /></div>
            <div className="space-y-2">
              <Label htmlFor="modality">Formato</Label>
              <select id="modality" name="modality" className={selectCls}><option>Online</option><option>Presencial</option></select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Horário</Label>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => (
                  <button type="button" key={t} onClick={() => setTime(t)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${time === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="message">Conte um pouco sobre o que te traz (opcional)</Label><Textarea id="message" name="message" rows={4} maxLength={2000} /></div>
            <Button type="submit" size="lg" disabled={loading} className="rounded-full md:col-span-2">{loading ? "Enviando…" : "Solicitar agendamento"}</Button>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
