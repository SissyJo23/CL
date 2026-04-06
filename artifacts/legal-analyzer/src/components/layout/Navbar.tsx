import { Link } from "wouter";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, FolderOpen, Info } from "lucide-react";

export default function Navbar() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHasApiKey(d.hasApiKey === true))
      .catch(() => setHasApiKey(null));
  }, []);

  return (
    <>
      <header className="w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-medium tracking-tight text-foreground transition-colors hover:text-primary">
            CaseLight
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/cases" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <FolderOpen className="w-4 h-4" />
              My Cases
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-4 h-4" />
              About
            </Link>
          </nav>
        </div>
      </header>

      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-2 text-xs text-slate-200 font-medium tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span>PRIVILEGED &amp; CONFIDENTIAL — ATTORNEY WORK-PRODUCT — DO NOT DISCLOSE</span>
        <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      </div>

      {hasApiKey === false && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>API key not configured.</strong> Add your Anthropic API key as the{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code>{" "}
            secret to enable AI analysis and court simulation.
          </span>
        </div>
      )}
    </>
  );
}
