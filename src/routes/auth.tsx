import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Área do administrador" },
      { name: "description", content: "Acesso restrito à área administrativa." },
      { property: "og:title", content: "Entrar · Área do administrador" },
      { property: "og:description", content: "Acesso restrito." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error("E-mail ou senha inválidos."); return; }
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
      setMode("in");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-5">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-warm text-primary-foreground"><Heart className="h-4 w-4" /></span>
          <span className="font-display font-semibold">Área do administrador</span>
        </Link>
        <h1 className="mt-6 text-3xl font-semibold">{mode === "in" ? "Entrar" : "Criar conta"}</h1>
        {mode === "up" && <p className="mt-2 text-sm text-muted-foreground">A primeira conta criada se torna a administradora do sistema.</p>}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" required /></div>
          <div className="space-y-2"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
          <Button type="submit" disabled={loading} className="w-full rounded-full">{loading ? "Aguarde…" : mode === "in" ? "Entrar" : "Criar conta"}</Button>
        </form>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-center text-sm text-primary">
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </div>
    </div>
  );
}
