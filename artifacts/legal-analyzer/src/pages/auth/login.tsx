import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE, setToken } from "@/lib/api";

export default function AuthLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Invalid email or password.");
      setToken(body.token);
      localStorage.setItem("user", JSON.stringify(body.user));
      setLocation("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {/* Compact header */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded-sm">
            <Scale className="w-5 h-5 text-background" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground tracking-tight">CaseLight</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">Sign in</Link>
          <Link href="/register">
            <Button size="sm" className="h-9 rounded-sm px-5 font-medium shadow-none">Get started</Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center container mx-auto px-6 lg:px-10 gap-12 lg:gap-24 py-12 lg:py-0">
        <div className="flex-1 space-y-8 max-w-2xl">
          <div className="space-y-5">
             <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase">Forensic Legal Analysis</span>
             <h1 className="font-serif text-5xl lg:text-7xl font-normal text-foreground leading-[1.05] tracking-tight">
               Find the error.<br/>Build the <span className="text-primary italic font-serif">CaseLight</span><br/>strategy.
             </h1>
             <p className="font-serif text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
               Analyze transcripts, surface reversible errors, and draft motions that withstand appellate scrutiny. Designed for advocates fighting for justice post-conviction.
             </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
             <Link href="/demo">
               <Button variant="outline" className="h-12 px-8 rounded-sm border-foreground/20 text-foreground hover:bg-foreground/5 shadow-none w-full sm:w-auto">Try Demo Workspace</Button>
             </Link>
             <Link href="/about">
               <Button variant="ghost" className="h-12 px-8 rounded-sm text-foreground hover:bg-foreground/5 w-full sm:w-auto">Read the methodology</Button>
             </Link>
          </div>
        </div>

        <div className="w-full max-w-md lg:w-[440px]">
          <form onSubmit={handleSubmit} className="bg-card border border-border shadow-sm p-8 sm:p-10 space-y-6 rounded-sm">
            <div className="space-y-2 mb-2">
              <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">Sign in to workspace</h2>
              <p className="text-sm text-muted-foreground font-serif">Access your privileged case files</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-sm bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-sm bg-background border-border/60" />
              </div>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full h-12 text-base rounded-sm shadow-none mt-2">
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2 font-serif">
              Need an account? <Link href="/register" className="text-primary hover:underline underline-offset-4">Create one</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
