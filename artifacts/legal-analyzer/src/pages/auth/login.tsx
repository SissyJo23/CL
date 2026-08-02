import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Scale } from "lucide-react";
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
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">CaseLight</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your case workspaces.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-card-border rounded-lg p-8 shadow-sm space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full h-11">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Need an account? <Link href="/register" className="text-primary underline underline-offset-2">Create one</Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/demo" className="underline underline-offset-2">View the public demo</Link>
        </p>
      </div>
    </div>
  );
}