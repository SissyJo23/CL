import { Link, useLocation } from "wouter";
import { clearToken } from "@/lib/api";

export default function Disclaimer() {
  const [, setLocation] = useLocation();

  const handleSignOut = () => {
    clearToken();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setLocation("/");
  };

  return (
    <div className="py-8 text-center px-4 border-t border-border/60 bg-card mt-auto">
      <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed font-serif">
        CaseLight provides structural analysis of legal documents to assist in advocacy.
        It does not provide legal advice or establish attorney-client privilege.
        Review all citations and analysis independently.
      </p>
      <p className="text-xs text-muted-foreground mt-4 font-serif">
        <Link href="/legal" className="hover:text-foreground transition-colors">
          Confidentiality · Copyright · Terms of Use
        </Link>
        {" · "}© {new Date().getFullYear()} Lagerman Advocates. All rights reserved.
        {" · "}
        <button onClick={handleSignOut} className="hover:text-foreground transition-colors">
          Sign Out
        </button>
      </p>
    </div>
  );
}
