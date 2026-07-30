import { Link, useLocation } from "wouter";

export default function Disclaimer() {
  const [, setLocation] = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return (
    <div className="py-8 text-center px-4 border-t border-border">
      <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        CaseLight provides structural analysis of legal documents to assist in advocacy.
        It does not provide legal advice or establish attorney-client privilege.
        Review all citations and analysis independently.
      </p>
      <p className="text-xs text-muted-foreground mt-3">
        <Link href="/legal" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Confidentiality · Copyright · Terms of Use
        </Link>
        {" · "}© {new Date().getFullYear()} Lagerman Advocates. All rights reserved.
        {" · "}
        <button onClick={handleSignOut} className="underline underline-offset-2 hover:text-foreground transition-colors">
          Sign Out
        </button>
      </p>
    </div>
  );
}
