import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, FolderOpen, Info, User, Users, Scale, BookOpen, LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

const TAGLINES = [
  "The truth is in the transcripts.",
  "A path to justice.",
  "Here to tell the truth, not give false hope.",
];

function RotatingBanner({ mode }: { mode: UserMode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % TAGLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isAttorney = mode === "attorney" || mode === "appellate";

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-2 text-xs text-slate-200 font-medium tracking-wide">
      <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      <span>
        {isAttorney
          ? "PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK-PRODUCT — DO NOT DISCLOSE"
          : `CaseLight — ${TAGLINES[index]}`}
      </span>
      <ShieldCheck className="w-3.5 h-3.5 text-slate-300 shrink-0" />
    </div>
  );
}

export default function Navbar() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const { mode, setMode } = useUserMode();
  const [, setLocation] = useLocation();

  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setLocation("/login");
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
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-tight text-foreground transition-colors hover:text-primary"
          >
            CaseLight
          </Link>

          <nav className="flex items-center gap-3">

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 text-xs border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors rounded-md px-2.5 flex items-center gap-1.5 focus:outline-none">
                {MODE_ICONS[mode]}
                <span className="text-xs font-medium">{MODE_LABELS[mode]}</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setMode("inmate")} className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5​​​​​​​​​​​​​​​​
                  }
