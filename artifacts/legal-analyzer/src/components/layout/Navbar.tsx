import { Link, useLocation } from "wouter";
import { Scale } from "lucide-react";
import { clearToken } from "@/lib/api";

export default function Navbar() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setLocation("/");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          data-testid="link-home"
        >
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Scale className="w-4.5 h-4.5 text-primary" />
          </div>
          <span className="font-serif text-xl font-medium text-foreground tracking-tight">
            CaseLight
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/cases"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
            data-testid="link-cases"
          >
            Cases
          </Link>
          <Link
            href="/documents"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
            data-testid="link-documents"
          >
            Documents
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
            data-testid="link-about"
          >
            About
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-logout"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
