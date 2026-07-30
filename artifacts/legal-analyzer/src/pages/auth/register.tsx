import { useState } from "react";
import { useLocation } from "wouter";
import { setToken } from "@/lib/api";

export default function Register() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://caselight-api.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      setToken(data.token);
      setLocation("/cases");
    } catch (err) {
      setError(`Failed: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-serif font-medium text-foreground mb-1">CaseLight</h1>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
