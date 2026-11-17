import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato · Dra. Helena Martins" },
      { name: "description", content: "Envie uma mensagem, ligue ou visite o consultório." },
      { property: "og:title", content: "Contato · Dra. Helena Martins" },
      { property: "og:description", content: "Fale comigo." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(f.get("name")).trim(),
      email: String(f.get("email")).trim(),
      message: String(f.get("message")).trim().slice(0, 3000),
    });
    setLoading(false);
    if (error) { toast.error("Não foi possível enviar."); return; }
    toast.success("Mensagem enviada! Respondo em breve.");
    form.reset();
  }
  return (
    <SiteShell>
      <PageHero eyebrow="Contato" title="Vamos conversar" subtitle="Tire suas dúvidas ou envie uma mensagem." />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {[[Phone, SITE.phone], [Mail, SITE.email], [MapPin, SITE.address]].map(([Icon, t], i) => {
            const I = Icon as typeof Phone;
            return (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-secondary p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-card text-primary"><I className="h-5 w-5" /></span>
                <span>{t as string}</span>
              </div>
            );
          })}
          <Button asChild variant="outline" className="w-full rounded-full">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
          </Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-soft">
          <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" name="name" required maxLength={200} /></div>
          <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" required maxLength={255} /></div>
          <div className="space-y-2"><Label htmlFor="message">Mensagem</Label><Textarea id="message" name="message" rows={6} required maxLength={3000} /></div>
          <Button type="submit" disabled={loading} className="w-full rounded-full">{loading ? "Enviando…" : "Enviar mensagem"}</Button>
        </form>
      </section>
    </SiteShell>
  );
}
