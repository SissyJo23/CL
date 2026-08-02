import { ArrowRight, Scale } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PublicHome() {
  return (
    <div className="caselight-public-home min-h-[100dvh] bg-background text-foreground">
      <header className="caselight-public-header">
        <Link href="/" className="caselight-wordmark" aria-label="CaseLight home">
          <span className="caselight-mark">
            <Scale className="h-5 w-5" />
          </span>
          <span>CaseLight</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-7" aria-label="Main navigation">
          <Link href="/login" className="caselight-nav-link">
            Sign in
          </Link>
          <Link href="/register">
            <Button className="caselight-header-action" size="sm">
              Get started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="caselight-public-main">
        <section className="caselight-public-copy">
          <p className="caselight-eyebrow">Forensic legal analysis</p>
          <h1>
            The record is heavy.{" "}
            <span>CaseLight reads every line.</span>
          </h1>
          <p className="caselight-public-description">
            CaseLight is an AI document analysis platform for criminal legal cases.
            It anchors every finding to a citation, flags constitutional violations,
            evaluates federal habeas ripeness, and tracks your AEDPA deadline — for
            advocates, attorneys, families, and people representing themselves.
          </p>
          <div className="caselight-public-actions">
            <Link href="/register">
              <Button className="caselight-primary-action">
                Create a free account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="caselight-secondary-action">
                Sign in
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}