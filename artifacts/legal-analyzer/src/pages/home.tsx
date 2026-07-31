import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Scale, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-20 sm:py-28 text-center">
          <div className="max-w-3xl mx-auto space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide">
                Forensic Legal Analysis
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Every case deserves<br />a second look
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Analyze transcripts. Surface reversible error. Draft motions that withstand scrutiny.
              Built for advocates continuing the fight after an unfair result.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/cases/new">
                <Button size="lg" className="h-12 px-8 text-base group shadow-sm" data-testid="button-create-case">
                  Open New Case
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>

              <Link href="/cases">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base" data-testid="button-view-cases">
                  View All Cases
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                Built for precision
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                CaseLight structures your work so nothing gets lost in the record
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-card border border-card-border rounded-lg p-7 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Organize the Record
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload transcripts, rulings, and filings. Each document is indexed and searchable so you can trace every claim back to the source.
                </p>
              </div>

              <div className="bg-card border border-card-border rounded-lg p-7 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Surface Legal Error
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identify preservation, procedural missteps, and constitutional issues. Every error is categorized and evaluated against binding precedent.
                </p>
              </div>

              <div className="bg-card border border-card-border rounded-lg p-7 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Test Your Argument
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Simulate the State's response before you file. Know where your argument holds and where it needs reinforcement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-8 sm:p-10 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
              Ready to begin?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-xl mx-auto">
              Open a case workspace and start building your analysis. Every detail is preserved and every argument is traceable.
            </p>
            <Link href="/cases/new">
              <Button size="lg" className="h-12 px-8 shadow-sm" data-testid="button-cta-create">
                Create Your First Case
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Disclaimer />
    </div>
  );
}
