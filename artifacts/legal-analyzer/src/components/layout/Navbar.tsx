import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, FolderOpen, Info, User, Users, Scale, BookOpen, LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserMode, type UserMode } from "@/contexts/UserModeContext";
import { useAuth } from "@/contexts/AuthContext";

const MODE_ICONS: Record<UserMode, React.ReactNode> = {
  inmate: <User className="w-3.5 h-3.5 shrink-0" />,
  advocate: <Users className="w-3.5 h-3.5 shrink-0" />,
  attorney: <Scale className="w-3.5 h-3.5 shrink-0" />,
  appellate: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
};

const MODE_LABELS: Record<UserMode, string> = {
  inmate: "Pro Se",
  advocate: "Advocate",
  attorney: "Attorney",
  appellate: "Appellate",
};

export default function Navbar() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const { mode, setMode } = useUserMode();
  const { authenticated, authConfigured, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

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
          <nav className="flex items-center gap-3">
            <Select value={mode} onValueChange={(v) => setMode(v as UserMode)}>
              <SelectTrigger className="h-8 text-xs border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors w-auto min-w-0 gap-1.5 px-2.5 focus:ring-0 focus:ring-offset-0">
                {MODE_ICONS[mode]}
                <span className="text-xs font-medium">{MODE_LABELS[mode]}</span>
              </SelectTrigger>
              <SelectContent align="end" className="w-64">
                <div className="px-2 pt-2 pb-1">
                  <p className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground mb-1">Choose your starting point</p>
                </div>
                <SelectItem value="inmate">
                  <div className="flex items-start gap-2 py-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Incarcerated / Pro Se</div>
                      <div className="text-xs text-muted-foreground leading-tight">Plain-language findings — no legal background required</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="advocate">
                  <div className="flex items-start gap-2 py-0.5">
                    <Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Family / Advocate</div>
                      <div className="text-xs text-muted-foreground leading-tight">Fighting for someone — here's what you need to know</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="attorney">
                  <div className="flex items-start gap-2 py-0.5">
                    <Scale className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Defense Attorney</div>
                      <div className="text-xs text-muted-foreground leading-tight">Full legal analysis, citations, and strategic roadmap</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="appellate">
                  <div className="flex items-start gap-2 py-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Appellate / Post-Conviction</div>
                      <div className="text-xs text-muted-foreground leading-tight">Federal readiness, AEDPA tracking, exhaustion ladder</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Link href="/cases" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Cases</span>
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
            {authConfigured && authenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
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
