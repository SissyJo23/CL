import { Link } from "wouter";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, FolderOpen, Info, User, Users, Scale, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useUserMode, type UserMode } from "@/contexts/UserModeContext";

const MODE_ICONS: Record<UserMode, React.ReactNode> = {
  inmate: <User className="w-3.5 h-3.5 shrink-0" />,
  advocate: <Users className="w-3.5 h-3.5 shrink-0" />,
  attorney: <Scale className="w-3.5 h-3.5 shrink-0" />,
  appellate: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
};

const MODE_LABELS: Record<UserMode, string> = {
  inmate: "Defendant",
  advocate: "Advocate",
  attorney: "Attorney",
  appellate: "Appellate",
};

export default function Navbar() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const { mode, setMode } = useUserMode();

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
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-tight text-foreground transition-colors hover:text-primary"
          >
            CaseLight
          </Link>

          <nav className="flex items-center gap-3">
            <Select value={mode} onValueChange={(v) => setMode(v as UserMode)}>
              <SelectTrigger className="h-8 text-xs border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors w-auto min-w-0 gap-1.5 px-2.5 focus:ring-0 focus:ring-offset-0">
                {MODE_ICONS[mode]}
                <span className="text-xs font-medium">
                  {MODE_LABELS[mode]}
                </span>
              </SelectTrigger>

              <SelectContent align="end">
                <SelectItem value="inmate">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Defendant</span>
                  </div>
                </SelectItem>

                <SelectItem value="advocate">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Advocate</span>
                  </div>
                </SelectItem>

                <SelectItem value="attorney">
                  <div className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Attorney</span>
                  </div>
                </SelectItem>

                <SelectItem value="appellate">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Appellate</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Link
              href="/cases"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Cases</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
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
            <code className="font-mono bg-amber-100 px-1 rounded">
              ANTHROPIC_API_KEY
            </code>{" "}
            secret to enable AI analysis and court simulation.
          </span>
        </div>
      )}
    </>
  );
}
