import { useState } from "react";
import { useLocation } from "wouter";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://caselight-api.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.access_token || data.token)) {
        localStorage.setItem("authToken", data.token || data.access_token);
        localStorage.setItem("isLoggedIn", "true");
        setAuthTokenGetter(() => localStorage.getItem("authToken"));
        setLocation("/home");
      } else {
        alert("Access Denied");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("System connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b border-border/50 bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <span className="font-serif text-xl font-medium tracking-tight text-foreground">
            CaseLight
          </span>
        </div>
      </header>

      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-2 text-xs text-slate-200 font-medium tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span>CaseLight — Here to tell the truth, not give false hope.</span>
        <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your case workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
