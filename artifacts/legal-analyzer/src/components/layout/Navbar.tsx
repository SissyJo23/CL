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
    <nav className="caselight-app-nav sticky top-0 z-50">
      <div className="caselight-app-nav-inner">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          data-testid="link-home"
        >
          <div className="caselight-app-mark">
            <Scale className="w-4.5 h-4.5" />
          </div>
          <span className="font-serif text-xl font-medium tracking-tight">
            CaseLight
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/cases"
            className="caselight-app-link hidden sm:inline-block"
            data-testid="link-cases"
          >
            Cases
          </Link>
          <Link
            href="/documents"
            className="caselight-app-link hidden sm:inline-block"
            data-testid="link-documents"
          >
            Documents
          </Link>
          <Link
            href="/about"
            className="caselight-app-link hidden sm:inline-block"
            data-testid="link-about"
          >
            About
          </Link>
          <button
            onClick={handleLogout}
            className="caselight-app-link"
            data-testid="button-logout"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
